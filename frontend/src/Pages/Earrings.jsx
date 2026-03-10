import React, { useState, useEffect } from 'react';
import ProductCard from '../Components/ProductCard';
import ProductFilterBar from '../Components/ProductFilterBar';
import { getProducts, getCategories } from '../Utils/api';
import { toast } from 'react-hot-toast';
import { ShoppingBag, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Earrings = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryId, setCategoryId] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const categories = await getCategories();
                const earringCategory = categories.find(cat =>
                    cat.name.toLowerCase() === 'earrings' || cat.slug === 'earrings'
                );
                if (earringCategory) {
                    setCategoryId(earringCategory._id);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!categoryId) return;

            try {
                setLoading(true);
                setError(null);
                const data = await getProducts({ category: categoryId });
                const list = data.products || [];
                setProducts(list);
                setFilteredProducts(list);
            } catch (err) {
                const msg = err.response?.data?.message || 'Failed to load products';
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    return (
        <div className="min-h-screen bg-white font-serif">
            <div className="relative overflow-hidden bg-gray-50 h-32 py-12 text-center" style={{
                background: 'linear-gradient(135deg, #1a1209 0%, #2d1f0a 50%, #1a1209 100%)',
            }}>
                {/* Decorative gold lines — contained inside banner */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
                    backgroundSize: '20px 20px',
                }} />
                <h1 className="relative text-4xl md:text-5xl font-bold text-white tracking-wide mt-[-20px] mb-2">Earrings</h1>
                <p className="relative text-[#c9a84c] max-w-2xl mx-auto px-4 mt-[10px]">
                    Frame your face with our stunning collection of earrings.
                </p>
            </div>

            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-avaya-gold"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gray-900 border-l-4 border-avaya-gold p-10 shadow-2xl animate-in zoom-in duration-500 rounded-r-3xl max-w-md">
                            <AlertCircle size={40} className="text-avaya-gold mx-auto mb-4" />
                            <h2 className="text-xl font-trajan text-white mb-4 tracking-widest uppercase">Elegance Interrupted</h2>
                            <p className="text-gray-400 text-sm mb-6">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center gap-2 bg-avaya-gold text-white px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
                            >
                                <RefreshCw size={14} /> Try Again
                            </button>
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="bg-gray-900 border-l-4 border-avaya-gold p-12 shadow-2xl animate-in zoom-in duration-500 rounded-r-[3rem] max-w-xl">
                            <ShoppingBag size={48} className="text-avaya-gold mx-auto mb-6 opacity-50" strokeWidth={1} />
                            <h2 className="text-3xl font-trajan text-white mb-4 tracking-widest uppercase">Collection Coming Soon</h2>
                            <p className="text-gray-400 font-sans mb-8">We are curating a stunning selection of earrings. Check back explore more.</p>
                            <Link to="/" className="inline-block bg-avaya-gold text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
                                Go to Home
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <ProductFilterBar
                            products={products}
                            onFiltered={setFilteredProducts}
                            totalCount={filteredProducts.length}
                        />
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-gray-500 text-lg">No products match your filters.</p>
                                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters to see more results.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Earrings;
