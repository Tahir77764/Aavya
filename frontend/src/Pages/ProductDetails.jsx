import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Utils/api';
import { useCart } from '../Context/CartContext';
import { Star, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Plus, Minus, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import images statically to map them (same as TrendingProducts for consistency if needed)
import trending1 from '../Assets/trending1.jpg';
import trending4 from '../Assets/trending4.jpg';
import trending2 from '../Assets/trending2.jpg';
import trending3 from '../Assets/trending3.jpg';

// Image Mapping
const imageMap = {
    'trending1.jpg': trending1,
    'trending2.jpg': trending2,
    'trending3.jpg': trending3,
    'trending4.jpg': trending4,
};

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qty, setQty] = useState(1);
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/api/products/${id}`);
                setProduct(data);

                // Set initial active image
                if (data.images && data.images.length > 0) {
                    const img = data.images[0];
                    if (imageMap[img]) setActiveImage(imageMap[img]);
                    else if (img.startsWith('http')) setActiveImage(img);
                    else setActiveImage(trending1); // fallback
                } else {
                    setActiveImage(trending1);
                }

                setLoading(false);
            } catch (err) {
                setError(err.response && err.response.data.message ? err.response.data.message : err.message);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            await addToCart(product, qty);
            toast.success('Added to your collection');
        } catch (error) {
            if (error.message.includes('login')) {
                toast.error('Please login to continue');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                toast.error(error.message || 'Failed to add to cart');
            }
        }
    };

    const handleBuyNow = async () => {
        try {
            await addToCart(product, qty);
            navigate('/cart');
        } catch (error) {
            if (error.message.includes('login')) {
                toast.error('Please login to proceed');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                toast.error(error.message || 'Error occurred');
            }
        }
    };

    const getImage = (img) => {
        if (!img) return trending1;
        if (imageMap[img]) return imageMap[img];
        if (img.startsWith('http')) return img;
        return trending1;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-avaya-gold"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            <div className="bg-gray-900 border-l-4 border-avaya-gold p-8 shadow-2xl animate-in zoom-in duration-300 rounded-r-3xl max-w-lg w-full text-center">
                <AlertCircle className="h-16 w-16 text-avaya-gold mx-auto mb-6" />
                <h2 className="text-gray-200 font-bold uppercase tracking-widest text-lg mb-2">Product Not Found</h2>
                <p className="text-gray-400 font-medium mb-8">{error}</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-avaya-gold text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all"
                >
                    Back to Collection
                </button>
            </div>
        </div>
    );

    if (!product) return null;

    return (
        <div className="bg-white min-h-screen font-serif pb-20 pt-10">
            <div className="container mx-auto px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-avaya-gold mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative">
                            <img
                                src={activeImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {product.images && product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(getImage(img))}
                                    className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${activeImage === getImage(img) ? 'border-avaya-gold' : 'border-transparent'} hover:border-avaya-gold transition-all`}
                                >
                                    <img src={getImage(img)} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        {product.category && (
                            <span className="text-avaya-gold uppercase tracking-wider text-sm font-semibold">
                                {product.category.name}
                            </span>
                        )}
                        <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{product.name}</h1>

                        <div className="flex items-center mb-6">
                            <div className="flex text-yellow-500 mr-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} className={i < Math.round(product.rating) ? "fill-current" : "text-gray-300"} />
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm">({product.numReviews} Reviews)</span>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-6">
                            ₹{product.price.toLocaleString('en-IN')}
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        <div className="border-t border-b border-gray-100 py-6 mb-8">
                            <div className="flex items-center mb-4">
                                <span className="mr-4 font-medium text-gray-900">Quantity:</span>
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="p-2 hover:bg-gray-50"
                                        disabled={qty <= 1}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="px-4 font-medium">{qty}</span>
                                    <button
                                        onClick={() => setQty(Math.min(product.stock, qty + 1))}
                                        className="p-2 hover:bg-gray-50"
                                        disabled={qty >= product.stock}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">
                                {product.stock > 0 ? `${product.stock} items in stock` : 'Out of Stock'}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-md font-bold text-white transition-all
                                    ${product.stock > 0 ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                <ShoppingBag size={20} />
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>

                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className={`flex-1 py-4 rounded-md font-bold text-white transition-all
                                    ${product.stock > 0 ? 'bg-avaya-gold hover:bg-yellow-600' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                Order Now
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t pt-6">
                            <div className="flex items-center gap-2">
                                <Truck size={18} className="text-avaya-gold" />
                                <span>Free Delivery & Returns</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={18} className="text-avaya-gold" />
                                <span>1 Year Warranty</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
