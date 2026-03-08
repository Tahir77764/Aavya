import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, Loader2, AlertCircle, User, ShoppingBag,
    ShoppingCart, Save, Trash2, Mail, Calendar, CheckCircle, XCircle
} from 'lucide-react';

const STATUS_COLORS = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Processing: 'bg-indigo-100 text-indigo-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
};

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    const [clearingCart, setClearingCart] = useState(false);

    const getConfig = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return { headers: { Authorization: `Bearer ${userInfo.token}` } };
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const cfg = getConfig();
                const [uRes, oRes, cRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/users/${id}`, cfg),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/orders/user/${id}`, cfg),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/cart/user/${id}`, cfg),
                ]);
                setUser(uRes.data);
                setName(uRes.data.name || '');
                setEmail(uRes.data.email || '');
                setOrders(oRes.data);
                setCart(cRes.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    const saveUser = async () => {
        try {
            setSaving(true);
            setSaveMsg('');
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/users/${id}`,
                { name, email },
                getConfig()
            );
            setUser(prev => ({ ...prev, name: data.name, email: data.email }));
            setSaveMsg('Saved successfully.');
        } catch (err) {
            setSaveMsg(err.response?.data?.message || err.message);
        } finally {
            setSaving(false);
        }
    };

    const clearCart = async () => {
        if (!window.confirm("Clear this user's cart?")) return;
        try {
            setClearingCart(true);
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/user/${id}`, getConfig());
            setCart({ items: [] });
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setClearingCart(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin h-10 w-10 text-avaya-gold" />
        </div>
    );

    if (error) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 flex-col gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-red-600">{error}</p>
        </div>
    );

    const cartTotal = (cart.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-3">
                            <User className="h-6 w-6 text-avaya-gold" />
                            {user.name || 'User Profile'}
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">ID: {user._id}</p>
                    </div>
                    <button
                        onClick={() => navigate('/users')}
                        className="flex items-center text-sm font-medium text-gray-600 hover:text-avaya-gold transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:border-avaya-gold"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Users
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-900 mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
                                <User size={14} className="text-avaya-gold" /> Profile
                            </h2>

                            <div className="flex justify-center mb-5">
                                <div className="h-16 w-16 rounded-full bg-avaya-gold/10 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-avaya-gold">
                                        {(name || '?').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-avaya-gold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-avaya-gold"
                                    />
                                </div>
                            </div>

                            {saveMsg && (
                                <p className={`text-xs mt-3 ${saveMsg.includes('success') || saveMsg.includes('Saved') ? 'text-green-600' : 'text-red-500'}`}>
                                    {saveMsg}
                                </p>
                            )}

                            <button
                                onClick={saveUser}
                                disabled={saving}
                                className="mt-4 w-full flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white bg-gray-900 hover:bg-avaya-gold transition-all disabled:opacity-50 uppercase tracking-widest"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>

                            <div className="mt-5 pt-5 border-t border-gray-100 space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 flex items-center gap-1.5"><Mail size={13} /> Verified</span>
                                    {user.isVerified
                                        ? <span className="flex items-center gap-1 text-green-600 text-xs font-semibold"><CheckCircle size={13} /> Yes</span>
                                        : <span className="flex items-center gap-1 text-yellow-600 text-xs font-semibold"><XCircle size={13} /> No</span>
                                    }
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Role</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {user.isAdmin ? 'Admin' : 'Customer'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 flex items-center gap-1.5"><Calendar size={13} /> Joined</span>
                                    <span className="text-xs text-gray-700">
                                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 flex items-center gap-1.5"><ShoppingBag size={13} /> Orders</span>
                                    <span className="text-xs font-bold text-gray-900">{orders.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                                    <ShoppingCart size={14} className="text-avaya-gold" /> Current Cart
                                </h2>
                                {(cart.items || []).length > 0 && (
                                    <button
                                        onClick={clearCart}
                                        disabled={clearingCart}
                                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                                    >
                                        {clearingCart ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                        Clear
                                    </button>
                                )}
                            </div>

                            {(cart.items || []).length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">Cart is empty</p>
                            ) : (
                                <div className="space-y-3">
                                    {cart.items.map((item, i) => {
                                        const product = item.product || {};
                                        const img = Array.isArray(product.images) ? product.images[0] : product.images;
                                        return (
                                            <div key={i} className="flex items-center gap-3">
                                                <img
                                                    src={img || 'https://placehold.co/40x40?text=?'}
                                                    alt={product.name || ''}
                                                    className="h-10 w-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                                                    onError={e => { e.target.src = 'https://placehold.co/40x40?text=?'; }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-900 truncate">{product.name || '—'}</p>
                                                    <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                                                </div>
                                                <p className="text-xs font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</p>
                                            </div>
                                        );
                                    })}
                                    <div className="pt-3 border-t border-gray-100 flex justify-between text-sm font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-900 mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
                                <ShoppingBag size={14} className="text-avaya-gold" /> Order History ({orders.length})
                            </h2>

                            {orders.length === 0 ? (
                                <div className="text-center py-16">
                                    <ShoppingBag className="mx-auto h-10 w-10 text-gray-200 mb-3" />
                                    <p className="text-sm text-gray-400">No orders placed yet.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead>
                                            <tr>
                                                <th className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Order #</th>
                                                <th className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                                <th className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Items</th>
                                                <th className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                                                <th className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment</th>
                                                <th className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                                <th className="pb-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {orders.map(order => (
                                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 pr-4 text-xs font-mono font-medium text-gray-900">{order.orderNumber}</td>
                                                    <td className="py-3 pr-4 text-xs text-gray-500">
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className="py-3 pr-4 text-xs text-gray-600">{order.items?.length || 0}</td>
                                                    <td className="py-3 pr-4 text-xs font-semibold text-gray-900">₹{order.totalPrice?.toFixed(2)}</td>
                                                    <td className="py-3 pr-4">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {order.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                                                            {order.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <Link
                                                            to={`/orders/${order._id}`}
                                                            className="text-xs font-medium text-avaya-gold hover:underline"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
