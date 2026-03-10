import React, { useState, useEffect } from 'react';
import api from '../Utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Trash2, Save, RefreshCw, AlertCircle, Plus, Image as ImageIcon } from 'lucide-react';

const AdminTrial = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // State for categories
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savingProductId, setSavingProductId] = useState(null); // Track which product is saving
    const navigate = useNavigate();

    // Pagination state
    const [pageNumber, setPageNumber] = useState(1);
    const [Pages, setPages] = useState(1);

    // Fetch Products and Categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch Products
                const { data: productData } = await api.get(`/api/products?pageNumber=${pageNumber}`);
                setProducts(productData.products);
                setPages(productData.Pages);

                // Fetch Categories
                const { data: categoryData } = await api.get('/api/categories');
                setCategories(categoryData);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            navigate('/login');
            return;
        }
        const user = JSON.parse(userInfo);
        if (!user.isAdmin) {
            setError("Not Authorized as Admin");
            setLoading(false);
            return;
        }

        fetchData();
    }, [navigate, pageNumber]);

    const handleInputChange = (id, field, value) => {
        setProducts(products.map(p =>
            p._id === id ? { ...p, [field]: value } : p
        ));
    };

    const handleImageChange = (id, index, value) => {
        setProducts(products.map(p => {
            if (p._id === id) {
                const newImages = [...p.images];
                newImages[index] = value;
                return { ...p, images: newImages };
            }
            return p;
        }));
    };

    const handleFileReplace = (id, index, file) => {
        setProducts(products.map(p =>
            p._id === id ? { ...p, [`file${index}`]: file } : p
        ));
    };

    const handleFileChange = (id, files) => {
        setProducts(products.map(p =>
            p._id === id ? { ...p, newFiles: files } : p
        ));
    };

    const saveProduct = async (id) => {
        setSavingProductId(id); // Disable button immediately
        const product = products.find(p => p._id === id);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));

            // Use FormData for file uploads
            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('price', product.price);
            formData.append('stock', product.stock);
            formData.append('description', product.description || '');

            // Handle category (send ID)
            const catId = product.category && product.category._id ? product.category._id : product.category;
            formData.append('category', catId);

            // Handle gender (send exact string value)
            formData.append('gender', product.gender);

            // --- IMAGE LAYOUT LOGIC ---
            const layout = [];
            const filesToUpload = [];

            // Index 0 (Image 1)
            if (product.file0) {
                layout.push('__FILE__');
                filesToUpload.push(product.file0);
            } else if (product.images[0]) {
                layout.push(product.images[0]);
            }

            // Index 1 (Image 2)
            if (product.file1) {
                layout.push('__FILE__');
                filesToUpload.push(product.file1);
            } else if (product.images[1]) {
                layout.push(product.images[1]);
            }

            // Remaining existing images (Index 2+)
            if (product.images.length > 2) {
                product.images.slice(2).forEach(img => {
                    if (img && typeof img === 'string') layout.push(img);
                });
            }

            // Append "New" (Extras)
            if (product.newFiles && product.newFiles.length > 0) {
                Array.from(product.newFiles).forEach(file => {
                    layout.push('__FILE__');
                    filesToUpload.push(file);
                });
            }

            formData.append('imageLayout', JSON.stringify(layout));
            filesToUpload.forEach(file => formData.append('images', file));


            const config = {
                headers: {
                    // Do NOT set Content-Type manually for FormData; browser sets it with boundary
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await api.put(
                `/api/products/${id}`,
                formData,
                config
            );

            toast.success('Product updated successfully');
            setTimeout(() => window.location.reload(), 1500);

        } catch (err) {
            console.error(err);
            const msg = err.response ? err.response.data.message : err.message;
            toast.error(`Error: ${msg}`);
        } finally {
            setSavingProductId(null); // Re-enable button (though page usually reloads on success)
        }
    };

    if (loading) return <div className="p-10">Loading...</div>;
    if (error) return <div className="p-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Trial Admin - Quick Edit</h1>
                <button
                    onClick={() => navigate('/admin/product/create')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                    + Create New Product
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Image 1 (Main)</th>
                            <th className="py-2 px-4 border-b">Image 2 (Hover)</th>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Category</th>
                            <th className="py-2 px-4 border-b">Gender</th>
                            <th className="py-2 px-4 border-b">Price</th>
                            <th className="py-2 px-4 border-b">Stock</th>
                            <th className="py-2 px-4 border-b">Add More Images</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                                {/* Image 1 Column */}
                                <td className="py-2 px-4 border-b text-center align-top w-32">
                                    <div className="flex flex-col items-center gap-2">
                                        {product.file0 ? (
                                            <div className="h-16 w-16 bg-green-100 border border-green-300 flex items-center justify-center text-xs text-green-700 font-bold rounded">
                                                New File
                                            </div>
                                        ) : (
                                            <img
                                                src={product.images[0] || 'https://via.placeholder.com/64?text=No+Img'}
                                                alt="Img 1"
                                                className="h-16 w-16 object-cover border rounded"
                                            />
                                        )}
                                        <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs w-full text-center">
                                            <span>{product.file0 ? 'Change File' : 'Replace'}</span>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileReplace(product._id, 0, e.target.files[0])}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                </td>

                                {/* Image 2 Column */}
                                <td className="py-2 px-4 border-b text-center align-top w-32">
                                    <div className="flex flex-col items-center gap-2">
                                        {product.file1 ? (
                                            <div className="h-16 w-16 bg-green-100 border border-green-300 flex items-center justify-center text-xs text-green-700 font-bold rounded">
                                                New File
                                            </div>
                                        ) : (
                                            <img
                                                src={product.images[1] || 'https://via.placeholder.com/64?text=No+Img'}
                                                alt="Img 2"
                                                className="h-16 w-16 object-cover border rounded"
                                            />
                                        )}
                                        <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs w-full text-center">
                                            <span>{product.file1 ? 'Change File' : 'Replace/Add'}</span>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileReplace(product._id, 1, e.target.files[0])}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                </td>

                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="text"
                                        value={product.name}
                                        onChange={(e) => handleInputChange(product._id, 'name', e.target.value)}
                                        className="w-full border p-1"
                                    />
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <select
                                        value={
                                            product.category && product.category._id
                                                ? product.category._id
                                                : product.category
                                        }
                                        onChange={(e) => handleInputChange(product._id, 'category', e.target.value)}
                                        className="w-full border p-1"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <select
                                        value={product.gender}
                                        onChange={(e) => handleInputChange(product._id, 'gender', e.target.value)}
                                        className="w-full border p-1"
                                    >
                                        <option value="Unisex">Unisex</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Kids">Baby/Kids</option>
                                    </select>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="number"
                                        value={product.price}
                                        onChange={(e) => handleInputChange(product._id, 'price', e.target.value)}
                                        className="w-24 border p-1"
                                    />
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="number"
                                        value={product.stock}
                                        onChange={(e) => handleInputChange(product._id, 'stock', e.target.value)}
                                        className="w-16 border p-1"
                                    />
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => handleFileChange(product._id, e.target.files)}
                                        className="w-full text-xs"
                                    />
                                    {product.newFiles && product.newFiles.length > 0 && (
                                        <div className="text-xs text-green-600 mt-1">
                                            {product.newFiles.length} files selected
                                        </div>
                                    )}
                                </td>

                                <td className="py-2 px-4 border-b text-center flex flex-col gap-2">
                                    <button
                                        onClick={() => saveProduct(product._id)}
                                        disabled={savingProductId === product._id}
                                        className={`px-3 py-1 rounded text-white ${savingProductId === product._id
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                            }`}
                                    >
                                        {savingProductId === product._id ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        onClick={async () => {
                                            // Custom confirm toast can be added later, for now we just do it
                                            try {
                                                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                                                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                                                await api.delete(`/api/products/${product._id}`, config);
                                                setProducts(products.filter(p => p._id !== product._id));
                                                toast.success('Product deleted');
                                            } catch (err) {
                                                toast.error(err.message);
                                            }
                                        }}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 gap-4">
                <button
                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                    disabled={pageNumber === 1}
                    className={`px-4 py-2 rounded ${pageNumber === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    Previous
                </button>
                <span className="flex items-center text-gray-700 font-medium">
                    Page {pageNumber} of {Pages}
                </span>
                <button
                    onClick={() => setPageNumber(prev => Math.min(prev + 1, Pages))}
                    disabled={pageNumber === Pages}
                    className={`px-4 py-2 rounded ${pageNumber === Pages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    Next
                </button>
            </div>

            <div className="mt-8 p-4 bg-gray-100 rounded">
                <h3 className="font-bold">Instructions:</h3>
                <ul className="list-disc pl-5 text-sm">
                    <li>**Text/Price/Stock:** Edit directly.</li>
                    <li>**Images:**
                        <ul className="list-disc pl-5">
                            <li>To **KEEP** existing images, leave URL inputs as is.</li>
                            <li>To **DELETE** an image, clear its URL input.</li>
                            <li>To **REPLACE**, clear the old URL input and use "Upload New" to select a file.</li>
                            <li>To **ADD** new images, just click "Choose Files" (Select 1 or more).</li>
                        </ul>
                    </li>
                    <li>**Save:** Click "Save" to update. The page will reload after success.</li>
                    <li>**Delete:** Click "Delete" to remove a product permanently.</li>
                    <li>**Note:** Uploaded images are automatically sent to Cloudinary.</li>
                </ul>
            </div>
        </div>
    );
};
export default AdminTrial;
