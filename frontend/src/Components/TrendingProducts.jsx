import React, { useEffect, useState } from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../Context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../Utils/api';
import { toast } from 'react-hot-toast';

// Import images statically to map them
import trending1 from '../Assets/trending1.jpg';
import trending2 from '../Assets/trending2.jpg';
import trending3 from '../Assets/trending3.jpg';
import trending4 from '../Assets/trending4.jpg';

// Image Mapping
const imageMap = {
    'trending1.jpg': trending1,
    'trending2.jpg': trending2,
    'trending3.jpg': trending3,
    'trending4.jpg': trending4,
};

const TrendingProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // ── Add to Cart handler ──────────────────────────────────────────────────
    const handleAddToCart = async (product) => {
        try {
            await addToCart(product, 1);
            toast.success('Added to your collection');
        } catch (error) {
            if (error.message?.includes('login')) {
                toast.error('Please login to continue', {
                    icon: '👤',
                });
                setTimeout(() => navigate('/login'), 1500);
            } else {
                toast.error(error.message || 'Failed to add to cart');
            }
        }
    };

    // ── Fetch trending products ──────────────────────────────────────────────
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/api/products?trending=true');
                setProducts(data.products.slice(0, 4)); // Show top 4 trending
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trending products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const getImage = (product) => {
        if (!product.images || product.images.length === 0) return trending1;
        const imgPath = product.images[0];
        if (imageMap[imgPath]) return imageMap[imgPath];
        if (imgPath.startsWith('http')) return imgPath;
        return trending1;
    };

    return (
        <section className="py-16 bg-white relative">
            {/* Background Texture/Overlay */}
            <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-center -translate-y-12">
            </div>
            <div className="absolute top-0 w-full flex justify-center -mt-8 z-10">
                <h2 className="text-3xl font-serif text-white tracking-widest uppercase drop-shadow-md">Trending Product</h2>
            </div>

            <div className="container mx-auto px-4 mt-12">
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="bg-gray-100 rounded-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                                <div className="relative h-64 overflow-hidden">
                                    <Link to={`/product/${product._id}`}>
                                        <img
                                            src={getImage(product)}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </Link>
                                </div>

                                <div className="p-4">
                                    <Link to={`/product/${product._id}`}>
                                        <h3 className="font-medium text-gray-900 mb-1 truncate hover:text-avaya-gold transition-colors">{product.name}</h3>
                                    </Link>
                                    <div className="flex items-center text-yellow-500 mb-2 text-xs">
                                        <Star size={12} fill="currentColor" />
                                        <span className="ml-1 text-gray-600">{product.rating || 4.5} ({product.numReviews || 0})</span>
                                    </div>
                                    <div className="font-bold text-gray-900 mb-3">₹{product.price}</div>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="w-full bg-avaya-gold text-white py-2 rounded-sm hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                    >
                                        <ShoppingBag size={16} />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TrendingProducts;
