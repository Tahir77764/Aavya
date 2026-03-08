import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../Context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart, isLoggedIn } = useCart();
    const [adding, setAdding] = useState(false);
    const [message, setMessage] = useState('');

    const handleAddToCart = async (e) => {
        e.preventDefault(); // Prevent navigation if clicking from a Link

        if (!isLoggedIn()) {
            setMessage('Please login to add items to cart');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        if (product.stock === 0) {
            setMessage('Out of stock');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            setAdding(true);
            await addToCart(product._id, 1);
            setMessage('Added to cart!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.message || 'Failed to add to cart');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setAdding(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;

    return (
        <div className="group relative bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Discount Badge */}
            {hasDiscount && (
                <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm">
                    -{discountPercent}%
                </div>
            )}

            {/* Stock Badge */}
            {product.stock === 0 && (
                <div className="absolute top-3 right-3 z-10 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-sm">
                    OUT OF STOCK
                </div>
            )}

            {/* Image */}
            <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-square">
                <img
                    src={product.images && product.images[0]
                        ? product.images[0]
                        : 'https://via.placeholder.com/400x400?text=No+Image'
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Quick Add Button - Shows on Hover */}
                <button
                    onClick={handleAddToCart}
                    disabled={adding || product.stock === 0}
                    className={`absolute bottom-4 left-1/2 -translate-x-1/2 
                        ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-avaya-gold hover:bg-yellow-600'} 
                        text-white px-6 py-2 rounded-sm font-bold text-sm 
                        opacity-0 group-hover:opacity-100 transition-all duration-300 
                        transform translate-y-4 group-hover:translate-y-0
                        flex items-center gap-2 disabled:opacity-50`}
                >
                    <ShoppingCart size={16} />
                    {adding ? 'Adding...' : 'Quick Add'}
                </button>
            </Link>

            {/* Product Info */}
            <div className="p-4">
                {/* Category */}
                {product.category && (
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {product.category.name || 'Category'}
                    </p>
                )}

                {/* Product Name */}
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-avaya-gold transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={12}
                            className={i < Math.round(product.rating) ? 'fill-avaya-gold text-avaya-gold' : 'text-gray-300'}
                        />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">
                        ({product.numReviews || 0})
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                    </span>
                    {hasDiscount && (
                        <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.compareAtPrice)}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button - Mobile */}
                <button
                    onClick={handleAddToCart}
                    disabled={adding || product.stock === 0}
                    className={`w-full ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-avaya-gold hover:bg-yellow-600'} 
                        text-white py-2 rounded-sm font-bold text-sm transition-colors 
                        flex items-center justify-center gap-2 disabled:opacity-50 md:hidden`}
                >
                    <ShoppingCart size={16} />
                    {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                {/* Message */}
                {message && (
                    <p className={`text-xs mt-2 text-center ${message.includes('success') || message.includes('Added')
                        ? 'text-green-600'
                        : 'text-red-600'
                        }`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
