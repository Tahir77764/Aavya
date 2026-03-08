import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../Context/CartContext';
import { WHATSAPP_NUMBER } from '../Utils/constants';
import api from '../Utils/api';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, loading, error: cartError, fetchCart, updateQuantity, removeFromCart, clearCart, isLoggedIn } = useCart();
    const [updating, setUpdating] = useState({});
    const [localError, setLocalError] = useState(null);
    const [checkingOut, setCheckingOut] = useState(false);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/login');
            return;
        }

        // Fetch cart only once when component mounts
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchCart();
        }
    }, []); // Empty dependency array - run only once on mount

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            setUpdating(prev => ({ ...prev, [itemId]: true }));
            await updateQuantity(itemId, newQuantity);
        } catch (error) {
            alert(error.message || 'Failed to update quantity');
        } finally {
            setUpdating(prev => ({ ...prev, [itemId]: false }));
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!window.confirm('Remove this item from cart?')) return;

        try {
            await removeFromCart(itemId);
        } catch (error) {
            alert(error.message || 'Failed to remove item');
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm('Clear all items from cart?')) return;

        try {
            await clearCart();
        } catch (error) {
            alert(error.message || 'Failed to clear cart');
        }
    };

    const calculateSubtotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.03; // 3% tax
    };

    const calculateShipping = () => {
        return calculateSubtotal() > 50000 ? 0 : 500; // Free shipping over ₹50,000
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax() + calculateShipping();
    };

    const handleCheckout = async () => {
        if (!cart || !cart.items || cart.items.length === 0) return;

        setCheckingOut(true);
        setLocalError(null);

        try {
            const subtotal = calculateSubtotal();
            const tax = calculateTax();
            const shipping = calculateShipping();
            const total = calculateTotal();

            // ── SNAPSHOT items NOW before any state changes ────────────────
            const itemsSnapshot = cart.items.map(item => ({
                name: item.product?.name || 'Product',
                qty: item.quantity,
                unitPrice: item.price,
                lineTotal: item.price * item.quantity,
            }));
            const itemCount = cart.items.length;

            // ── 1. Save order to database (Build WhatsApp msg uses snapshot) ─
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                const token = userInfo?.token;
                if (token) {
                    const res = await api.post(
                        '/api/orders/whatsapp',
                        {
                            itemsPrice: subtotal,
                            taxPrice: tax,
                            shippingPrice: shipping,
                            totalPrice: total,
                        }
                    );
                    if (res.status !== 200 && res.status !== 201) {
                        console.error('Order save error:', res.data);
                    }
                    // Cart was already cleared server-side — just re-fetch to update badge
                    fetchCart();
                }
            } catch (saveErr) {
                // Non-fatal — still open WhatsApp so customer is not blocked
                console.error('Order save failed (non-fatal):', saveErr);
                setLocalError('⚠️ Your WhatsApp order opened but could not be saved to history. Please screenshot your order for reference.');
            }

            // ── 2. Build WhatsApp message from frozen snapshot ─────────────
            let orderLines = '';
            itemsSnapshot.forEach((item, index) => {
                orderLines +=
                    `${index + 1}. ${item.name}%0A` +
                    `   Qty: ${item.qty}  |  Unit Price: ${formatPrice(item.unitPrice)}  |  Total: ${formatPrice(item.lineTotal)}%0A`;
            });

            const message =
                `Hello Aavya Jewels! 🛍️ I would like to place the following order:%0A%0A` +
                `━━━━━━━━━━━━━━━━━━━━%0A` +
                `🛒 *ORDER DETAILS*%0A` +
                `━━━━━━━━━━━━━━━━━━━━%0A` +
                orderLines +
                `━━━━━━━━━━━━━━━━━━━━%0A` +
                `💰 *PRICE BREAKDOWN*%0A` +
                `Subtotal (${itemCount} item${itemCount > 1 ? 's' : ''}): ${formatPrice(subtotal)}%0A` +
                `Tax (3%%): ${formatPrice(tax)}%0A` +
                `Shipping: ${shipping === 0 ? 'FREE 🎉' : formatPrice(shipping)}%0A` +
                `━━━━━━━━━━━━━━━━━━━━%0A` +
                `*Grand Total: ${formatPrice(total)}*%0A` +
                `━━━━━━━━━━━━━━━━━━━━%0A%0A` +
                `Please confirm my order. Thank you! 🙏`;

            // ── 3. Open WhatsApp ───────────────────────────────────────────
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');

            // Navigate to profile so user sees their order history
            setTimeout(() => {
                navigate('/profile');
            }, 800);

        } catch (err) {
            console.error('Checkout error:', err);
            setLocalError('Something went wrong. Please try again.');
        } finally {
            setCheckingOut(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-avaya-gold"></div>
                    <p className="mt-4 text-gray-600">Loading cart...</p>
                    {cartError && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-sm max-w-md mx-auto">
                            <p className="text-red-600 font-semibold mb-2">Error loading cart</p>
                            <p className="text-red-600 text-sm mb-4">{cartError}</p>
                            <div className="space-x-4">
                                <button
                                    onClick={() => fetchCart()}
                                    className="text-sm bg-avaya-gold text-white px-4 py-2 rounded-sm hover:bg-yellow-600"
                                >
                                    Retry
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-sm text-avaya-gold underline hover:no-underline"
                                >
                                    Re-login
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-serif">
                <div className="text-center px-4">
                    <ShoppingBag className="mx-auto text-gray-300 mb-6" size={80} />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-8">Add some beautiful jewelry to your cart!</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-avaya-gold text-white px-8 py-3 rounded-sm hover:bg-yellow-600 transition-colors font-bold"
                    >
                        <ArrowLeft size={20} />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-serif py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center text-gray-600 hover:text-avaya-gold transition-colors mb-4">
                        <ArrowLeft size={20} className="mr-2" />
                        Continue Shopping
                    </Link>
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shopping Cart</h1>
                        {cart.items.length > 0 && (
                            <button
                                onClick={handleClearCart}
                                className="text-red-600 hover:text-red-700 text-sm font-semibold"
                            >
                                Clear Cart
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div key={item._id} className="bg-white rounded-sm shadow-sm p-6 flex gap-6">
                                {/* Product Image */}
                                <div className="w-24 h-24 flex-shrink-0">
                                    <img
                                        src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                                        alt={item.product?.name || 'Product'}
                                        className="w-full h-full object-cover rounded-sm"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-grow">
                                    <Link
                                        to={`/product/${item.product?._id}`}
                                        className="text-lg font-semibold text-gray-900 hover:text-avaya-gold transition-colors block mb-2"
                                    >
                                        {item.product?.name || 'Product Name'}
                                    </Link>
                                    <p className="text-gray-600 text-sm mb-2">
                                        {formatPrice(item.price)} each
                                    </p>
                                    {item.product?.stock <= 5 && item.product?.stock > 0 && (
                                        <p className="text-orange-600 text-xs">
                                            Only {item.product.stock} left in stock
                                        </p>
                                    )}
                                    {item.product?.stock === 0 && (
                                        <p className="text-red-600 text-xs font-semibold">Out of stock</p>
                                    )}
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex flex-col items-end gap-4">
                                    <button
                                        onClick={() => handleRemoveItem(item._id)}
                                        className="text-red-600 hover:text-red-700 transition-colors"
                                        title="Remove item"
                                    >
                                        <Trash2 size={20} />
                                    </button>

                                    <div className="flex items-center gap-2 border border-gray-300 rounded-sm">
                                        <button
                                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                            disabled={item.quantity <= 1 || updating[item._id]}
                                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-12 text-center font-semibold">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                            disabled={
                                                item.quantity >= (item.product?.stock || 0) ||
                                                updating[item._id]
                                            }
                                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <p className="text-lg font-bold text-gray-900">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-sm shadow-sm p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cart.items.length} items)</span>
                                    <span>{formatPrice(calculateSubtotal())}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (3%)</span>
                                    <span>{formatPrice(calculateTax())}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{calculateShipping() === 0 ? 'FREE' : formatPrice(calculateShipping())}</span>
                                </div>
                                {calculateSubtotal() < 50000 && (
                                    <p className="text-xs text-gray-500">
                                        Add {formatPrice(50000 - calculateSubtotal())} more for free shipping!
                                    </p>
                                )}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>{formatPrice(calculateTotal())}</span>
                                    </div>
                                </div>
                            </div>

                            {localError && (
                                <p className="text-red-600 text-sm mb-3 text-center">{localError}</p>
                            )}
                            <button
                                onClick={handleCheckout}
                                disabled={checkingOut}
                                className="w-full bg-avaya-gold text-white py-3 rounded-sm font-bold text-lg hover:bg-yellow-600 transition-colors mb-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {checkingOut ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Redirecting to WhatsApp…
                                    </>
                                ) : (
                                    <>🛍️ Checkout via WhatsApp</>
                                )}
                            </button>

                            <Link
                                to="/"
                                className="block text-center text-avaya-gold hover:text-yellow-600 transition-colors font-semibold"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
