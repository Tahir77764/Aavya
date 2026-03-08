import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authConfig } from "../utils/authConfig";
import { Loader2, Sparkles, Check, X, Search, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FutureManagement = () => {
    const [futureProducts, setFutureProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: '0',
        gender: 'Unisex'
    });
    const [images, setImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchFutureProducts();
        fetchCategories();
    }, []);

    const fetchFutureProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?future=true&pageSize=50`);
            setFutureProducts(data.products);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching future products:', error);
            toast.error('Failed to load future products');
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
            setCategories(data);
            if (data.length > 0) setFormData(prev => ({ ...prev, category: data[0]._id }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 2) {
            try {
                setSearching(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?keyword=${value}&pageSize=10`);
                setSearchResults(data.products);
                setSearching(false);
            } catch (error) {
                console.error('Error searching products:', error);
                setSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const toggleFuture = async (product) => {
        try {
            const newStatus = !product.isFuture;
            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/products/${product._id}`,
                { isFuture: newStatus },
                authConfig()
            );

            if (newStatus) {
                setFutureProducts([...futureProducts, { ...product, isFuture: true }]);
                toast.success(`${product.name} added to future collection`);
            } else {
                setFutureProducts(futureProducts.filter(p => p._id !== product._id));
                toast.success(`${product.name} removed from future collection`);
            }

            setSearchResults(searchResults.map(p =>
                p._id === product._id ? { ...p, isFuture: newStatus } : p
            ));

        } catch (error) {
            console.error('Error updating future status:', error);
            toast.error('Failed to update future status');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`,
            },
        };

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('isFuture', 'true');
        images.forEach(img => data.append('images', img));

        try {
            const { data: newProduct } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/products`,
                data,
                config
            );
            toast.success('Future product created successfully');
            setFutureProducts([newProduct, ...futureProducts]);
            setIsFormOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('Failed to create future product');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            description: '',
            category: categories[0]?._id || '',
            stock: '0',
            gender: 'Unisex'
        });
        setImages([]);
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin h-10 w-10 text-avaya-gold" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-serif text-gray-900 font-bold mb-2 flex items-center gap-3">
                            <Sparkles className="text-avaya-gold" />
                            Future Collection
                        </h1>
                        <p className="text-gray-500">Manage upcoming products for the Future Collections section.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-white text-avaya-dark border-2 border-avaya-dark hover:bg-gray-50 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <Search size={20} />
                            Add from Catalog
                        </button>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-avaya-dark text-white hover:bg-avaya-gold px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                        >
                            <Plus size={20} />
                            Create New Future Item
                        </button>
                    </div>
                </div>

                {/* Trending Products Grid */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        Upcoming Items
                        <span className="bg-avaya-gold/10 text-avaya-gold px-3 py-0.5 rounded-full text-sm">
                            {futureProducts.length}
                        </span>
                    </h2>

                    {futureProducts.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
                            <Sparkles className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No future products yet</h3>
                            <p className="text-gray-500 mb-6">Start by adding products that will be part of your future collection.</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="text-avaya-gold font-bold hover:underline"
                                >
                                    Add from catalog →
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    className="text-avaya-gold font-bold hover:underline"
                                >
                                    Create new product →
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {futureProducts.map(product => (
                                <div key={product._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow group relative overflow-hidden">
                                    <div className="h-20 w-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                        {product.images?.[0] ? (
                                            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-300 text-xs">NO IMG</div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                                        <p className="text-sm text-gray-500">₹{product.price.toLocaleString()}</p>
                                    </div>

                                    <button
                                        onClick={() => toggleFuture(product)}
                                        className="h-10 w-10 rounded-full flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                        title="Remove from Future Collection"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SEARCH MODAL */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
                        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <h3 className="text-xl font-bold text-gray-900">Add from Catalog</h3>
                                <button
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setSearchTerm('');
                                        setSearchResults([]);
                                    }}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="relative mb-6">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-avaya-gold transition-colors text-lg"
                                    />
                                    {searching && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <Loader2 className="animate-spin h-5 w-5 text-avaya-gold" />
                                        </div>
                                    )}
                                </div>

                                <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {searchResults.length > 0 ? (
                                        <div className="space-y-3">
                                            {searchResults.map(product => {
                                                const isAlreadyFuture = futureProducts.some(p => p._id === product._id);
                                                return (
                                                    <div key={product._id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-50 hover:border-gray-200">
                                                        <img src={product.images?.[0]} alt="" className="h-16 w-16 rounded-xl object-cover bg-gray-100" />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
                                                            <p className="text-sm text-gray-500">₹{product.price.toLocaleString()}</p>
                                                        </div>
                                                        <button
                                                            disabled={isAlreadyFuture}
                                                            onClick={() => toggleFuture(product)}
                                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isAlreadyFuture
                                                                ? 'bg-green-100 text-green-600 cursor-default'
                                                                : 'bg-avaya-gold text-white hover:bg-black'
                                                                }`}
                                                        >
                                                            {isAlreadyFuture ? (
                                                                <span className="flex items-center gap-1"><Check size={16} /> Added</span>
                                                            ) : (
                                                                'Add to Future'
                                                            )}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : searchTerm.length > 2 && !searching ? (
                                        <div className="text-center py-10 text-gray-400">No products found</div>
                                    ) : (
                                        <div className="text-center py-10 text-gray-400">Type to search existing products...</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CREATE FORM MODAL */}
                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all">
                        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500 max-h-[90vh] flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Plus className="text-avaya-gold" />
                                        Launch New Future Product
                                    </h3>
                                    <p className="text-xs text-gray-500">This will create a new product and mark it as Future automatically.</p>
                                </div>
                                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleFormSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-avaya-gold transition-colors"
                                            placeholder="e.g. Royal Gold Necklace"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-avaya-gold transition-colors"
                                        >
                                            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Gender</label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-avaya-gold transition-colors"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Kids">Kids</option>
                                            <option value="Unisex">Unisex</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-avaya-gold transition-colors resize-none"
                                        placeholder="Enter product details..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Images</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group hover:border-avaya-gold relative">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-10 w-10 text-gray-300 group-hover:text-avaya-gold transition-colors" />
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-avaya-gold hover:text-black focus-within:outline-none transition-colors">
                                                    <span>Upload image files</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        onChange={(e) => setImages(Array.from(e.target.files))}
                                                        className="sr-only"
                                                    />
                                                </label>
                                            </div>
                                            {images.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1 justify-center">
                                                    {images.map((f, i) => <span key={i} className="px-2 py-0.5 bg-avaya-gold/10 text-avaya-gold text-[10px] rounded-full">{f.name}</span>)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex-shrink-0">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-avaya-dark text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-avaya-gold transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="animate-spin h-5 w-5" />
                                                Launching...
                                            </span>
                                        ) : (
                                            'Create & Add to Future'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <style>{`
                    .bg-avaya-dark { background-color: #1a1a1a; }
                    .bg-avaya-gold { background-color: #C5A059; }
                    .text-avaya-gold { color: #C5A059; }
                    .border-avaya-dark { border-color: #1a1a1a; }
                    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #C5A059; border-radius: 10px; }
                `}</style>
            </div>
        </div>
    );
};

export default FutureManagement;
