import React, { useState, useEffect } from 'react';
import api from '../Utils/api';
import { Link } from 'react-router-dom';
import ProductCard from '../Components/ProductCard';
import ProductFilterBar from '../Components/ProductFilterBar';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [Pages, setPages] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState({ _id: 'all', name: 'All Products' });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/api/categories');
                // Exclude 'Jewellery' category
                const filteredData = data.filter(cat => cat.name.toLowerCase() !== 'jewellery');
                setCategories([{ _id: 'all', name: 'All Products' }, ...filteredData]);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let url = `/api/products?pageNumber=${page}`;

                if (selectedCategory._id !== 'all') {
                    url += `&category=${selectedCategory._id}`;
                }

                const { data } = await api.get(url);

                setProducts(data.products);
                setPages(data.Pages);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, selectedCategory]);

    return (
        <div className="bg-white min-h-screen py-10 font-serif">
            <div className="container mx-auto px-4 lg:px-12">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-trajan text-avaya-gold uppercase tracking-widest mb-4">
                        All Collections
                    </h1>
                    <div className="w-24 h-1 bg-avaya-gold mx-auto mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto font-sans">
                        Explore our complete range of exquisite jewellery, handcrafted to perfection. From timeless classics to modern masterpieces.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setPage(1); // Reset to page 1 on filter change
                            }}
                            className={`px-6 py-2 rounded-full border text-sm uppercase tracking-wider transition-all duration-300 ${selectedCategory._id === cat._id
                                ? 'bg-avaya-gold text-white border-avaya-gold shadow-lg'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-avaya-gold hover:text-avaya-gold'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>


                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-avaya-gold"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="bg-gray-900 border-l-4 border-avaya-gold p-12 shadow-2xl animate-in zoom-in duration-500 rounded-r-[3rem] max-w-xl">
                            <h2 className="text-3xl font-trajan text-white mb-4 tracking-widest uppercase">Collection Coming Soon</h2>
                            <p className="text-gray-400 font-sans mb-8">We are currently curating new pieces for this collection. Please check back soon.</p>
                            <Link to="/" className="inline-block bg-avaya-gold text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
                                View Featured Pieces
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {Pages > 1 && (
                    <div className="flex justify-center mt-12 gap-2">
                        {[...Array(Pages).keys()].map((x) => (
                            <button
                                key={x + 1}
                                onClick={() => setPage(x + 1)}
                                className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${page === x + 1
                                    ? 'bg-avaya-dark text-white border-avaya-dark'
                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                {x + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProducts;
