import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingBag, User, LogOut, RefreshCw, ChevronDown, ChevronUp,
    Package, Clock, CheckCircle, Truck, XCircle, AlertCircle, Ban
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ONE_HOUR_MS = 60 * 60 * 1000;

const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price || 0);

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
};

const STATUS_META = {
    Pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
    Confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Confirmed' },
    Processing: { color: 'bg-purple-100 text-purple-800', icon: RefreshCw, label: 'Processing' },
    Shipped: { color: 'bg-indigo-100 text-indigo-800', icon: Truck, label: 'Shipped' },
    Delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' },
    Cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
};

// ── Countdown hook — returns { canCancel, secondsLeft } ──────────────────────
function useCancelTimer(createdAt) {
    const getSecondsLeft = () => {
        const elapsed = Date.now() - new Date(createdAt).getTime();
        return Math.max(0, Math.floor((ONE_HOUR_MS - elapsed) / 1000));
    };

    const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft);

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const id = setInterval(() => {
            const s = getSecondsLeft();
            setSecondsLeft(s);
            if (s <= 0) clearInterval(id);
        }, 1000);
        return () => clearInterval(id);
    }, [createdAt]);

    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const ss = String(secondsLeft % 60).padStart(2, '0');
    return { canCancel: secondsLeft > 0, timeLabel: `${mm}:${ss}` };
}

// ─── OrderCard ───────────────────────────────────────────────────────────────

const OrderCard = ({ order, onCancelled }) => {
    const [expanded, setExpanded] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const meta = STATUS_META[order.orderStatus] || STATUS_META.Pending;
    const StatusIcon = meta.icon;

    const nonCancellableStatuses = ['Shipped', 'Delivered', 'Cancelled'];
    const isStatusCancellable = !nonCancellableStatuses.includes(order.orderStatus);
    const { canCancel, timeLabel } = useCancelTimer(order.createdAt);

    const handleCancel = async () => {
        setCancelling(true);
        try {
            const { default: api } = await import('../Utils/api');
            await api.put(`/api/orders/${order._id}/cancel`, {});
            toast.success('Order cancelled successfully');
            onCancelled(order._id);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel order');
        } finally {
            setCancelling(false);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
            {/* Card header */}
            <div
                className="flex flex-wrap items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Order number */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Order</p>
                    <p className="font-semibold text-gray-900 truncate">{order.orderNumber || order._id?.slice(-8).toUpperCase()}</p>
                </div>

                {/* Date */}
                <div className="hidden sm:block">
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm text-gray-700">{formatDate(order.createdAt)}</p>
                </div>

                {/* Total */}
                <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-sm font-semibold text-gray-900">{formatPrice(order.totalPrice)}</p>
                </div>

                {/* Status badge */}
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color}`}>
                    <StatusIcon size={12} />
                    {meta.label}
                </span>

                {/* Expand toggle */}
                {expanded
                    ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
                    : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                }
            </div>

            {/* Expanded detail */}
            {expanded && (
                <div className="border-t border-gray-100 px-5 py-4 space-y-4 bg-gray-50">
                    {/* Items */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Items Ordered</p>
                        <div className="space-y-2">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-md border border-gray-200 flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                                            <Package size={20} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">
                                            Qty: {item.quantity} × {formatPrice(item.price)}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-800 flex-shrink-0">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price breakdown */}
                    <div className="border-t border-gray-200 pt-3 space-y-1 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatPrice(order.itemsPrice)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>{formatPrice(order.taxPrice)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>{order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-1">
                            <span>Grand Total</span>
                            <span>{formatPrice(order.totalPrice)}</span>
                        </div>
                    </div>

                    {/* Payment & status */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 border-t border-gray-200 pt-3">
                        <span>💳 Payment: <strong className="text-gray-700">{order.paymentMethod}</strong></span>
                        <span>📦 Payment Status: <strong className="text-gray-700">{order.paymentStatus}</strong></span>
                        {order.deliveredAt && (
                            <span>✅ Delivered: <strong className="text-gray-700">{formatDate(order.deliveredAt)}</strong></span>
                        )}
                    </div>

                    {/* ── Cancel Order Section ─────────────────────────── */}
                    {isStatusCancellable && (
                        <div className={`border-t pt-4 mt-2 rounded-lg p-4 ${canCancel
                            ? 'bg-red-50 border-red-100'
                            : 'bg-gray-100 border-gray-200'
                            }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                {/* Timer info */}
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className={canCancel ? 'text-red-500' : 'text-gray-400'} />
                                    {canCancel ? (
                                        <div>
                                            <p className="text-xs font-semibold text-red-600">Cancellation window closes in</p>
                                            <p className="text-xl font-bold text-red-600 font-mono tracking-widest">{timeLabel}</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500">Cancellation window expired</p>
                                            <p className="text-xs text-gray-400">Orders can only be cancelled within 1 hour of placing</p>
                                        </div>
                                    )}
                                </div>

                                {/* Cancel button */}
                                {canCancel ? (
                                    <button
                                        onClick={handleCancel}
                                        disabled={cancelling}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                                    >
                                        {cancelling ? (
                                            <><RefreshCw size={14} className="animate-spin" /> Cancelling…</>
                                        ) : (
                                            <><Ban size={14} /> Cancel Order</>
                                        )}
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Ban size={14} />
                                        <span>Cannot Cancel</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Profile page ─────────────────────────────────────────────────────────────

const Profile = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState(null);

    // Load user from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('userInfo');
        if (!stored) {
            navigate('/signup');
        } else {
            setUserInfo(JSON.parse(stored));
        }
    }, [navigate]);

    // Fetch orders
    const fetchOrders = useCallback(async () => {
        setOrdersLoading(true);
        setOrdersError(null);
        try {
            const { default: api } = await import('../Utils/api');
            const res = await api.get('/api/orders/myorders');
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('fetchOrders error:', err);
            const msg = err.response?.data?.message || err.message || 'Could not load orders.';
            setOrdersError(msg);
        } finally {
            setOrdersLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userInfo) fetchOrders();
    }, [userInfo, fetchOrders]);

    // Optimistically update cancelled order in list (no refetch needed)
    const handleOrderCancelled = useCallback((orderId) => {
        setOrders(prev => prev.map(o =>
            o._id === orderId ? { ...o, orderStatus: 'Cancelled' } : o
        ));
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    if (!userInfo) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-trajan">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* ── Profile Header ── */}
                <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage your account and orders</p>
                    </div>
                    <button
                        onClick={logoutHandler}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-sm hover:bg-red-600 transition-colors text-sm uppercase tracking-wide"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* ── Account Details ── */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center gap-2">
                                <User size={18} /> Account Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase tracking-wide">Name</label>
                                    <p className="text-lg text-gray-900">{userInfo.name}</p>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase tracking-wide">Email</label>
                                    <p className="text-sm text-gray-900 font-sans">{userInfo.email?.toLowerCase()}</p>
                                </div>
                                <div className="pt-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${userInfo.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                        {userInfo.isAdmin ? 'Admin' : 'Customer'}
                                    </span>
                                    {userInfo.isAdmin && (
                                        <button
                                            onClick={() => navigate('/admin-trial')}
                                            className="ml-4 text-blue-600 hover:text-blue-800 text-sm underline"
                                        >
                                            Go to Admin Panel
                                        </button>
                                    )}
                                </div>

                                {/* Quick stats */}
                                <div className="border-t pt-4 mt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500 uppercase tracking-wide">Total Orders</span>
                                        <span className="text-lg font-bold text-avaya-gold">{orders.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Order History ── */}
                    <div className="md:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center border-b pb-3 mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <ShoppingBag size={18} /> Order History
                                </h2>
                                <button
                                    onClick={fetchOrders}
                                    disabled={ordersLoading}
                                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-avaya-gold transition-colors disabled:opacity-50"
                                    title="Refresh orders"
                                >
                                    <RefreshCw size={15} className={ordersLoading ? 'animate-spin' : ''} />
                                    Refresh
                                </button>
                            </div>

                            {/* Loading */}
                            {ordersLoading && (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <RefreshCw size={32} className="animate-spin mb-3" />
                                    <p className="text-sm">Loading your orders…</p>
                                </div>
                            )}

                            {/* Error */}
                            {!ordersLoading && ordersError && (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="bg-gray-900 border-l-4 border-avaya-gold p-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300 rounded-r-2xl max-w-sm">
                                        <AlertCircle size={36} className="text-avaya-gold mx-auto mb-4" />
                                        <p className="text-gray-200 font-bold uppercase tracking-widest text-sm mb-4">{ordersError}</p>
                                        <button
                                            onClick={fetchOrders}
                                            className="text-xs bg-avaya-gold text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition-all uppercase tracking-widest"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Empty */}
                            {!ordersLoading && !ordersError && orders.length === 0 && (
                                <div className="bg-gray-900 border-l-4 border-avaya-gold p-12 shadow-2xl animate-in zoom-in duration-500 rounded-r-[3rem] max-w-xl">
                                    <div className="bg-avaya-gold/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                        <ShoppingBag size={48} className="text-avaya-gold" />
                                    </div>
                                    <h3 className="text-3xl font-trajan text-white mb-4 tracking-widest uppercase">No Orders Yet</h3>
                                    <p className="mt-1 text-gray-400 font-sans mb-8">
                                        Your collection journey begins with your first masterpiece.
                                    </p>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="bg-avaya-gold text-white px-10 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
                                    >
                                        Start Your Story
                                    </button>
                                </div>
                            )}

                            {/* Orders list */}
                            {!ordersLoading && !ordersError && orders.length > 0 && (
                                <div className="space-y-3">
                                    {orders.map(order => (
                                        <OrderCard
                                            key={order._id}
                                            order={order}
                                            onCancelled={handleOrderCancelled}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
