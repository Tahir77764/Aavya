import React, { useEffect, useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import ProductFilterBar from '../Components/ProductFilterBar';

// Import images for mapping
import female1 from '../Assets/female/female1.png';
import female2 from '../Assets/female/female2.png';
import female3 from '../Assets/female/female3.png';
import female4 from '../Assets/female/female4.png';
import female5 from '../Assets/female/female5.png';
import female6 from '../Assets/female/female6.png';
import female7 from '../Assets/female/female7.png';
import female8 from '../Assets/female/female8.png';

const imageMap = {
    'female/female1.png': female1,
    'female/female2.png': female2,
    'female/female3.png': female3,
    'female/female4.png': female4,
    'female/female5.png': female5,
    'female/female6.png': female6,
    'female/female7.png': female7,
    'female/female8.png': female8,
};

const FemaleCollection = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/products?gender=Female');
                setProducts(data.products);
                setFilteredProducts(data.products);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const getImage = (product) => {
        if (!product.images || product.images.length === 0) return 'https://via.placeholder.com/300';
        const imgPath = product.images[0];
        if (imageMap[imgPath]) return imageMap[imgPath];
        if (imgPath.startsWith('http')) return imgPath;
        return `https://via.placeholder.com/300?text=${product.name}`;
    };

    const handleAddToCart = async (productId) => {
        try {
            await addToCart(productId, 1);
            alert('Product added to cart!');
        } catch (err) {
            if (err.message && (err.message.includes('login') || err.message.includes('Login'))) {
                if (window.confirm("You need to login to add items to cart. Proceed to login?")) {
                    navigate('/login');
                }
            } else {
                alert(`Failed to add to cart: ${err.message}`);
            }
        }
    };

    if (loading) return <div className="text-center py-20 min-h-screen pt-32">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500 min-h-screen pt-32">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-white font-serif">
            {/* Header */}
            <div className="relative overflow-hidden bg-gray-50 h-32 py-12 text-center" style={{
                background: 'linear-gradient(135deg, #1a1209 0%, #2d1f0a 50%, #1a1209 100%)',
            }}>
                {/* Decorative gold lines — contained inside banner */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
                    backgroundSize: '20px 20px',
                }} />
                <h1 className="relative text-4xl md:text-5xl font-bold text-white tracking-wide mt-[-20px] mb-2">Female Collection</h1>
                <p className="relative text-[#c9a84c] max-w-2xl mx-auto px-4 mt-[10px]">
                    Elegant and timeless pieces designed to celebrate femininity.
                </p>
            </div>

            {/* Product Grid */}
            <div className="container mx-auto px-2 py-8">
                {products.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">No products found in this collection.</div>
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
                                    <div key={product._id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-[0_0_20px_#D4AF37] transition-all duration-300 border-4 border-avaya-gold">
                                        <div className="aspect-[3/2] overflow-hidden bg-gray-100 relative">
                                            <Link to={`/product/${product._id}`}>
                                                <img
                                                    src={getImage(product)}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </Link>
                                            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center bg-white/90 backdrop-blur-sm border-t border-gray-100">
                                                <button
                                                    onClick={() => handleAddToCart(product._id)}
                                                    className="flex items-center gap-2 bg-avaya-gold text-white px-6 py-2 rounded-sm text-sm uppercase tracking-wider hover:bg-yellow-600 transition-colors w-full justify-center"
                                                >
                                                    <ShoppingBag size={16} /> Add to Cart
                                                </button>
                                            </div>
                                            <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                <Heart size={18} />
                                            </button>
                                        </div>

                                        <div className="p-4 text-center">
                                            <Link to={`/product/${product._id}`}>
                                                <h3 className="text-lg font-medium text-gray-900 mb-1 hover:text-avaya-gold transition-colors">{product.name}</h3>
                                            </Link>
                                            <p className="text-avaya-gold font-semibold">₹{product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FemaleCollection;
