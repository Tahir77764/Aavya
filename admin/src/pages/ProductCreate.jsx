import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, Loader2 } from 'lucide-react';

const ProductCreate = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [gender, setGender] = useState('Male');
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isTrending, setIsTrending] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
                setCategories(data);
                if (data.length > 0) setCategory(data[0]._id);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    const uploadFileHandler = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('stock', countInStock);
        formData.append('gender', gender);
        formData.append('isTrending', isTrending);

        images.forEach(image => {
            formData.append('images', image);
        });

        try {
            setUploading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, formData, config);
            setUploading(false);
            alert('Product created successfully');
            navigate('/products');
        } catch (error) {
            console.error(error);
            setUploading(false);
            setError(error.response && error.response.data.message ? error.response.data.message : error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-serif text-gray-900 font-bold">Add New Product</h1>
                        <p className="mt-1 text-sm text-gray-500">Create a new product for your catalog.</p>
                    </div>
                    <button
                        onClick={() => navigate('/products')}
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
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-avaya-gold focus:ring-avaya-gold sm:text-sm py-3 px-4 bg-gray-50 hover:bg-white transition-colors border"
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="block w-full rounded-lg border-gray-300 pl-7 shadow-sm focus:border-avaya-gold focus:ring-avaya-gold sm:text-sm py-3 px-4 bg-gray-50 hover:bg-white transition-colors border"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Inventory</label>
                                <input
                                    type="number"
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-avaya-gold focus:ring-avaya-gold sm:text-sm py-3 px-4 bg-gray-50 hover:bg-white transition-colors border"
                                    placeholder="0"
                                    required
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-avaya-gold focus:ring-avaya-gold sm:text-sm py-3 px-4 bg-gray-50 hover:bg-white transition-colors border cursor-pointer"
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
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-avaya-gold focus:ring-avaya-gold sm:text-sm py-3 px-4 bg-gray-50 hover:bg-white transition-colors border cursor-pointer"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Kids">Kids</option>
                                    <option value="Unisex">Unisex</option>
                                </select>
                            </div>
                        </div>

                        <div>
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
                                rows={5}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-avaya-gold focus:ring-avaya-gold sm:text-sm py-3 px-4 bg-gray-50 hover:bg-white transition-colors border resize-y"
                                placeholder="Describe the product details..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Images</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group hover:border-avaya-gold relative">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-avaya-gold transition-colors" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-avaya-gold hover:text-yellow-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-avaya-gold">
                                            <span>Upload files</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                multiple
                                                onChange={uploadFileHandler}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, WEBP up to 10MB
                                    </p>
                                    {images.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                            {images.map((file, index) => (
                                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    {file.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">First image is the Main image, second is Hover.</p>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gray-900 hover:bg-avaya-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-avaya-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-widest active:scale-[0.99]"
                            >
                                {uploading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Creating...
                                    </span>
                                ) : (
                                    'Create Value Product'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductCreate;
