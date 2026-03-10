import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authConfig } from "../utils/authConfig";
import { useNavigate, useLocation } from 'react-router-dom';
import { Edit, Trash2, Plus, Package, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Get pageNumber from URL, default to 1
    const queryParams = new URLSearchParams(location.search);
    const pageNumber = parseInt(queryParams.get('pageNumber') || '1', 10);

    const [pages, setPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const userInfo = localStorage.getItem('userInfo');
                if (!userInfo) { navigate('/login'); return; }
                const user = JSON.parse(userInfo);
                if (!user.isAdmin) { setError("Not Authorized as Admin"); setLoading(false); return; }

                const { data: productData } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?pageNumber=${pageNumber}`);
                setProducts(productData.products);
                setPages(productData.pages);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate, pageNumber]);

    const deleteProduct = async (id) => {
        // Confirmation could be added with a custom toast, but for now we follow the pattern of direct action + success toast
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, authConfig());
            setProducts(prev => prev.filter(product => product._id !== id));
            toast.success('Product deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin h-10 w-10 text-avaya-gold" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-gray-900 border-l-4 border-avaya-gold p-8 shadow-2xl animate-in zoom-in duration-300 rounded-r-3xl max-w-lg w-full text-center">
                <AlertCircle className="h-16 w-16 text-avaya-gold mx-auto mb-6" />
                <h2 className="text-gray-200 font-bold uppercase tracking-widest text-lg mb-2">Access Error</h2>
                <p className="text-gray-400 font-medium mb-8">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-avaya-gold text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all"
                >
                    Retry Connection
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-serif text-gray-900 font-bold mb-2">Product Catalog</h1>
                        <p className="text-gray-500">Manage your jewelry collection efficiently.</p>
                    </div>
                    <button
                        onClick={() => navigate('/product/create')}
                        className="group flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-avaya-gold transition-all duration-300 shadow-md transform active:scale-95"
                    >
                        <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                        <span className="font-bold tracking-wide uppercase text-xs">Add New Product</span>
                    </button>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                        <p className="mt-1 text-gray-500">Get started by creating a new product.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                            <Package size={48} />
                                        </div>
                                    )}

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 gap-3">
                                        <button
                                            onClick={() => navigate(`/product/edit/${product._id}`, { state: { fromPage: pageNumber } })}
                                            className="bg-white text-gray-900 p-3 rounded-full hover:bg-avaya-gold hover:text-white transition-colors shadow-lg transform hover:scale-110"
                                            title="Edit Product"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product._id)}
                                            className="bg-white text-red-600 p-3 rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-lg transform hover:scale-110"
                                            title="Delete Product"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    {/* Stock Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${product.stock > 0
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-serif font-bold text-gray-900 line-clamp-1 mb-1" title={product.name}>
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-3">{product.category?.name || 'Uncategorized'}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                        <span className="text-lg font-bold text-avaya-gold">₹{product.price.toLocaleString()}</span>
                                        <span className="text-xs text-gray-400 font-medium">Qty: {product.stock}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pages > 1 && (
                    <div className="flex justify-center mt-12 gap-4">
                        <button
                            onClick={() => navigate(`/products?pageNumber=${Math.max(pageNumber - 1, 1)}`)}
                            disabled={pageNumber === 1}
                            className="px-6 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                        >
                            Previous
                        </button>
                        <span className="flex items-center text-gray-600 font-medium text-sm">
                            Page {pageNumber} of {pages}
                        </span>
                        <button
                            onClick={() => navigate(`/products?pageNumber=${Math.min(pageNumber + 1, pages)}`)}
                            disabled={pageNumber === pages}
                            className="px-6 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
