import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authConfig } from "../utils/authConfig";
import { Loader2, TrendingUp, Check, X, Search, Plus, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TrendingManagement = () => {
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchTrendingProducts();
    }, []);

    const fetchTrendingProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?trending=true&pageSize=50`);
            setTrendingProducts(data.products);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching trending products:', error);
            toast.error('Failed to load trending products');
            setLoading(false);
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

    const toggleTrending = async (product) => {
        try {
            const newStatus = !product.isTrending;
            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/products/${product._id}`,
                { isTrending: newStatus },
                authConfig()
            );

            if (newStatus) {
                // Added to trending
                setTrendingProducts([...trendingProducts, { ...product, isTrending: true }]);
                toast.success(`${product.name} added to trending`);
            } else {
                // Removed from trending
                setTrendingProducts(trendingProducts.filter(p => p._id !== product._id));
                toast.success(`${product.name} removed from trending`);
            }

            // Update search results if visible
            setSearchResults(searchResults.map(p =>
                p._id === product._id ? { ...p, isTrending: newStatus } : p
            ));

        } catch (error) {
            console.error('Error updating trending status:', error);
            toast.error('Failed to update trending status');
        }
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
                            <TrendingUp className="text-avaya-gold" />
                            Trending Management
                        </h1>
                        <p className="text-gray-500">Manage products displayed in the Trending Section on the homepage.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-avaya-dark text-white hover:bg-avaya-gold px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={20} />
                        Add Trending Product
                    </button>
                    <style>{`
                        .bg-avaya-dark { background-color: #1a1a1a; }
                        .bg-avaya-gold { background-color: #C5A059; }
                        .text-avaya-gold { color: #C5A059; }
                    `}</style>
                </div>

                {/* Trending Products Grid */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        Currently Trending
                        <span className="bg-avaya-gold/10 text-avaya-gold px-3 py-0.5 rounded-full text-sm">
                            {trendingProducts.length}
                        </span>
                    </h2>

                    {trendingProducts.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
                            <TrendingUp className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No trending products yet</h3>
                            <p className="text-gray-500 mb-6">Start by adding products from your catalog to feature them here.</p>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="text-avaya-gold font-bold hover:underline"
                            >
                                Add your first trending product →
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trendingProducts.map(product => (
                                <div key={product._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow group relative overflow-hidden">
                                    <div className="h-20 w-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                        {product.images?.[0] ? (
                                            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-300">N/A</div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                                        <p className="text-sm text-gray-500">₹{product.price.toLocaleString()}</p>
                                    </div>

                                    <button
                                        onClick={() => toggleTrending(product)}
                                        className="h-10 w-10 rounded-full flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                        title="Remove from Trending"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search Modal (Conditional Rendering) */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all animate-in fade-in">
                        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <h3 className="text-xl font-bold text-gray-900">Add Trending Product</h3>
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
                                        placeholder="Search by product name..."
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
                                                const isAlreadyTrending = trendingProducts.some(p => p._id === product._id);
                                                return (
                                                    <div key={product._id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-50 hover:border-gray-200">
                                                        <img src={product.images?.[0]} alt="" className="h-16 w-16 rounded-xl object-cover bg-gray-100" />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
                                                            <p className="text-sm text-gray-500">₹{product.price.toLocaleString()}</p>
                                                        </div>
                                                        <button
                                                            disabled={isAlreadyTrending}
                                                            onClick={() => toggleTrending(product)}
                                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isAlreadyTrending
                                                                ? 'bg-green-100 text-green-600 cursor-default'
                                                                : 'bg-avaya-gold text-white hover:bg-black'
                                                                }`}
                                                        >
                                                            {isAlreadyTrending ? (
                                                                <span className="flex items-center gap-1"><Check size={16} /> Added</span>
                                                            ) : (
                                                                'Add to Trending'
                                                            )}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : searchTerm.length > 2 && !searching ? (
                                        <div className="text-center py-10 text-gray-400">
                                            No products found matching "{searchTerm}"
                                        </div>
                                    ) : searchTerm.length <= 2 ? (
                                        <div className="text-center py-10 text-gray-400 flex flex-col items-center gap-2">
                                            <Search className="h-10 w-10 opacity-20" />
                                            <p>Type at least 3 characters to search</p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrendingManagement;
