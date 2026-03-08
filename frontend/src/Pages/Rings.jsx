import React, { useState, useEffect } from 'react';
import ProductCard from '../Components/ProductCard';
import ProductFilterBar from '../Components/ProductFilterBar';
import { getProducts, getCategories } from '../Utils/api';

const Rings = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryId, setCategoryId] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const categories = await getCategories();
                const ringCategory = categories.find(cat =>
                    cat.name.toLowerCase() === 'rings' || cat.slug === 'rings'
                );
                if (ringCategory) {
                    setCategoryId(ringCategory._id);
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
                console.error('Error fetching products:', err);
                setError(err.response?.data?.message || 'Failed to load products');
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
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide mt-[-20px] mb-2">Rings</h1>
                <p className="text-[#c9a84c] max-w-2xl mx-auto px-4 mt-[10px]">
                    Discover rings that symbolize love, commitment, and style.
                </p>
            </div>

            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-avaya-gold"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-avaya-gold text-white px-6 py-2 rounded-sm hover:bg-yellow-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-600 text-lg">No products found in this category.</p>
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

export default Rings;
