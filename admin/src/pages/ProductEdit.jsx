import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Upload, ArrowLeft, Loader2, X, Trash2, Package } from 'lucide-react';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const returnPage = location.state?.fromPage || 1;

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [gender, setGender] = useState('Unisex');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [isTrending, setIsTrending] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
                setCategories(data);
            } catch (err) {
                setError('Failed to load categories.');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                setName(data.name);
                setPrice(data.price);
                setCountInStock(data.stock);
                setCategory(data.category?._id || data.category || '');
                setGender(data.gender || 'Unisex');
                setIsTrending(data.isTrending || false);
                setDescription(data.description);
                setImages(data.images || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to load product.');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const newEntries = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newEntries]);
        e.target.value = '';
    };

    const removeImage = (idx) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError(null);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('stock', countInStock);
            formData.append('gender', gender);
            formData.append('isTrending', isTrending);

            const layout = [];
            images.forEach((img) => {
                if (typeof img === 'string') {
                    layout.push(img);
                } else {
                    layout.push('__FILE__');
                    formData.append('images', img.file);
                }
            });
            formData.append('imageLayout', JSON.stringify(layout));

            await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${id}`, formData, config);
            setUploading(false);
            alert('Product updated successfully');
            navigate(`/products?pageNumber=${returnPage}`);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setUploading(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin h-10 w-10 text-avaya-gold" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-serif text-gray-900 font-bold">Edit Product</h1>
                        <p className="mt-1 text-sm text-gray-500">Update product details and images.</p>
                    </div>
                    <button
                        onClick={() => navigate(`/products?pageNumber=${returnPage}`)}
                        className="flex items-center text-sm font-medium text-gray-600 hover:text-avaya-gold transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:border-avaya-gold"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Dashboard
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="p-8 space-y-8">
                        {/* Basic Info Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-avaya-gold focus:ring-avaya-gold sm:text-sm py-3 px-4 bg-gray-50 hover:bg-white transition-colors border"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-avaya-gold focus:ring-avaya-gold sm:text-sm py-3 px-4 bg-gray-50 hover:bg-white transition-colors border"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                                        <input
                                            type="number"
                                            value={countInStock}
                                            onChange={(e) => setCountInStock(e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-avaya-gold focus:ring-avaya-gold sm:text-sm py-3 px-4 bg-gray-50 hover:bg-white transition-colors border"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-avaya-gold focus:ring-avaya-gold sm:text-sm py-3 px-4 bg-gray-50 hover:bg-white transition-colors border"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-avaya-gold focus:ring-avaya-gold sm:text-sm py-3 px-4 bg-gray-50 hover:bg-white transition-colors border"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Kids">Kids</option>
                                            <option value="Unisex">Unisex</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <label className="flex items-center space-x-3 cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-avaya-gold/10 transition-colors border border-gray-100">
                                        <input
                                            type="checkbox"
                                            checked={isTrending}
                                            onChange={(e) => setIsTrending(e.target.checked)}
                                            className="h-5 w-5 bg-white border-gray-300 rounded text-avaya-gold focus:ring-avaya-gold cursor-pointer"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900">Mark as Trending</span>
                                            <span className="text-xs text-gray-500">Show this product in the Trending Section on Home</span>
                                        </div>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={6}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-avaya-gold focus:ring-avaya-gold sm:text-sm py-3 px-4 bg-gray-50 hover:bg-white transition-colors border resize-y"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Images Section */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-4">Product Images</label>

                                <div className="space-y-4">
                                    {/* Upload Area */}
                                    <label htmlFor="file-upload" className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group hover:border-avaya-gold relative">
                                        <div className="space-y-1 text-center pointer-events-none">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-avaya-gold transition-colors" />
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <span className="font-medium text-avaya-gold">Add New Images</span>
                                            </div>
                                            <p className="text-xs text-gray-500">Click anywhere here to upload</p>
                                        </div>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            multiple
                                            onChange={handleFileSelect}
                                        />
                                    </label>

                                    {/* Images List */}
                                    {images.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                                            {images.map((img, idx) => {
                                                const getImageUrl = (image) => {
                                                    if (typeof image !== 'string') {
                                                        return image.preview || null;
                                                    }
                                                    if (image.startsWith('http') || image.startsWith('data:') || image.startsWith('blob:')) {
                                                        return image;
                                                    }
                                                    return null;
                                                };

                                                const imageUrl = getImageUrl(img);

                                                return (
                                                    <div key={idx} className="relative group border rounded-lg overflow-hidden aspect-square bg-gray-50">
                                                        {imageUrl ? (
                                                            <img
                                                                src={imageUrl}
                                                                alt={`Product ${idx + 1}`}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.classList.remove('hidden');
                                                                    e.target.nextSibling.classList.add('flex');
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-gray-100">
                                                                <Package className="h-8 w-8 text-gray-300 mb-1" />
                                                                <span className="text-[10px] text-gray-400 break-all font-mono leading-tight">
                                                                    {typeof img === 'string' ? img : 'Invalid'}
                                                                </span>
                                                                <span className="text-[10px] text-red-500 font-bold mt-1">Invalid Image Source</span>
                                                            </div>
                                                        )}

                                                        <div className="hidden absolute inset-0 bg-gray-100 flex-col items-center justify-center p-2 text-center z-10">
                                                            <Package className="h-8 w-8 text-gray-300 mb-1" />
                                                            <span className="text-[10px] text-gray-400 break-all font-mono leading-tight">
                                                                {typeof img === 'string' ? img : 'File Object'}
                                                            </span>
                                                            <span className="text-[10px] text-red-500 font-bold mt-1">Failed to Load</span>
                                                        </div>

                                                        {/* Actions Overlay */}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-20">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(idx)}
                                                                className="text-white p-2 bg-red-600 rounded-full hover:bg-red-700 shadow-md transform hover:scale-110"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>

                                                        {typeof img !== 'string' && (
                                                            <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold z-10">New</div>
                                                        )}
                                                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-[10px] px-2 py-0.5 rounded z-10">
                                                            #{idx + 1}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 text-sm">
                                            No images yet. Add some!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gray-900 hover:bg-avaya-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-avaya-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-widest active:scale-[0.99]"
                            >
                                {uploading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Updating Product...
                                    </span>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default ProductEdit;
