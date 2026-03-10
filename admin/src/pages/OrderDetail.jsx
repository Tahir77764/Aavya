import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authConfig } from "../utils/authConfig";
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Package, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const STATUS_COLORS = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Processing: 'bg-indigo-100 text-indigo-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
};

const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [note, setNote] = useState('');
    const [updating, setUpdating] = useState(false);
    const [updateMsg, setUpdateMsg] = useState('');
    const [newPaymentStatus, setNewPaymentStatus] = useState('');
    const [updatingPayment, setUpdatingPayment] = useState(false);
    const [paymentMsg, setPaymentMsg] = useState('');
    const [deleting, setDeleting] = useState(false);

    const getConfig = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return { headers: { Authorization: `Bearer ${userInfo.token}` } };
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, getConfig());
                setOrder(data);
                setNewStatus(data.orderStatus);
                setNewPaymentStatus(data.paymentStatus);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const updateStatus = async () => {
        if (newStatus === order.orderStatus && !note) return;
        try {
            setUpdating(true);
            setUpdateMsg('');
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/orders/${id}/status`,
                { status: newStatus, note },
                getConfig()
            );
            setOrder(data);
            setNote('');
            toast.success('Status updated successfully.');
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setUpdating(false);
        }
    };

    const updatePaymentStatus = async () => {
        if (newPaymentStatus === order.paymentStatus) return;
        try {
            setUpdatingPayment(true);
            setPaymentMsg('');
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/orders/${id}/payment`,
                { paymentStatus: newPaymentStatus },
                getConfig()
            );
            setOrder(data);
            setNewPaymentStatus(data.paymentStatus);
            setNewStatus(data.orderStatus);
            if (data.paymentStatus === 'Paid' && data.orderStatus === 'Confirmed') {
                toast.success('Payment updated! Order automatically confirmed ✓');
            } else {
                toast.success('Payment status updated!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setUpdatingPayment(false);
        }
    };

    const deleteOrder = async () => {
        // Confirmation is implicit or handled by the premium flow
        try {
            setDeleting(true);
            const url = `${import.meta.env.VITE_API_URL}/api/orders/${id}`;
            console.log('[DELETE] Sending delete request to:', url);
            const response = await axios.delete(url, authConfig());
            console.log('[DELETE] Response:', response.data);
            navigate('/orders');
        } catch (err) {
            console.error('[DELETE] Error:', err);
            console.error('[DELETE] Response data:', err.response?.data);
            console.error('[DELETE] Response status:', err.response?.status);
            toast.error(err.response?.data?.message || 'Failed to delete order');
            setDeleting(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin h-10 w-10 text-avaya-gold" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
            <div className="bg-gray-900 border-l-4 border-avaya-gold p-10 shadow-2xl animate-in zoom-in duration-500 rounded-r-3xl max-w-md w-full">
                <AlertCircle size={40} className="text-avaya-gold mx-auto mb-4" />
                <h2 className="text-xl font-serif text-white mb-2 tracking-widest uppercase">Detail Error</h2>
                <p className="text-gray-400 text-sm mb-6">{error}</p>
                <button
                    onClick={() => navigate('/orders')}
                    className="inline-flex items-center gap-2 bg-avaya-gold text-white px-8 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-black transition-all"
                >
                    <ArrowLeft size={14} /> Back to Orders
                </button>
            </div>
        </div>
    );

    const { shippingAddress: addr } = order;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-3">
                            <Package className="h-6 w-6 text-avaya-gold" />
                            {order.orderNumber}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('[DELETE BTN] OrderDetail delete clicked for:', id);
                                deleteOrder();
                            }}
                            disabled={deleting}
                            className="flex items-center text-sm font-medium text-red-500 hover:text-red-700 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-red-200 hover:border-red-400 disabled:opacity-50"
                            style={{ cursor: 'pointer', position: 'relative', zIndex: 10 }}
                        >
                            {deleting ? <Loader2 size={16} className="animate-spin mr-2" /> : <Trash2 size={16} className="mr-2" />}
                            Delete
                        </button>
                        <button
                            onClick={() => navigate('/orders')}
                            className="flex items-center text-sm font-medium text-gray-600 hover:text-avaya-gold transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:border-avaya-gold"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Orders
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Order Items</h2>
                            <div className="divide-y divide-gray-50">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 py-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-14 w-14 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                                            onError={e => { e.target.src = 'https://placehold.co/56x56?text=?'; }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 mt-4 pt-4 space-y-1 text-sm">
                                <div className="flex justify-between text-gray-500"><span>Items</span><span>₹{order.itemsPrice?.toFixed(2)}</span></div>
                                <div className="flex justify-between text-gray-500"><span>Tax</span><span>₹{order.taxPrice?.toFixed(2)}</span></div>
                                <div className="flex justify-between text-gray-500"><span>Shipping</span><span>₹{order.shippingPrice?.toFixed(2)}</span></div>
                                <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100"><span>Total</span><span>₹{order.totalPrice?.toFixed(2)}</span></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Status History</h2>
                            <ol className="relative border-l border-gray-200 ml-2 space-y-4">
                                {[...order.statusHistory].reverse().map((h, i) => (
                                    <li key={i} className="ml-4">
                                        <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border border-white bg-avaya-gold"></div>
                                        <p className="text-sm font-semibold text-gray-900">{h.status}</p>
                                        <p className="text-xs text-gray-400">{new Date(h.timestamp).toLocaleString('en-IN')}</p>
                                        {h.note && <p className="text-xs text-gray-500 mt-0.5">{h.note}</p>}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Update Status</h2>
                            <div className="space-y-3">
                                <select
                                    value={newStatus}
                                    onChange={e => setNewStatus(e.target.value)}
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-avaya-gold"
                                >
                                    {STATUSES.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Optional note..."
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-avaya-gold"
                                />
                                <button
                                    onClick={updateStatus}
                                    disabled={updating}
                                    className="w-full flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white bg-gray-900 hover:bg-avaya-gold transition-all disabled:opacity-50 uppercase tracking-widest"
                                >
                                    {updating ? <Loader2 size={15} className="animate-spin" /> : 'Update'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Customer</h2>
                            {order.user ? (
                                <>
                                    <p className="text-sm font-medium text-gray-900">{order.user.name || '—'}</p>
                                    <p className="text-sm text-gray-500">{order.user.email || '—'}</p>
                                </>
                            ) : (
                                <p className="text-sm text-red-400 italic">User has been deleted</p>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Shipping Address</h2>
                            <div className="text-sm text-gray-600 space-y-0.5">
                                <p className="font-medium text-gray-900">{addr?.fullName}</p>
                                <p>{addr?.phone}</p>
                                <p>{addr?.addressLine1}</p>
                                {addr?.addressLine2 && <p>{addr.addressLine2}</p>}
                                <p>{addr?.city}, {addr?.state} - {addr?.pincode}</p>
                                <p>{addr?.country}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Payment</h2>
                            <div className="flex justify-between items-center text-sm mb-3">
                                <span className="text-gray-500">Method</span>
                                <span className="font-medium">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-4">
                                <span className="text-gray-500">Current Status</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                                    order.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700' :
                                        order.paymentStatus === 'Refunded' ? 'bg-purple-100 text-purple-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <select
                                    value={newPaymentStatus}
                                    onChange={e => setNewPaymentStatus(e.target.value)}
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-avaya-gold"
                                >
                                    {['Pending', 'Paid'].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={updatePaymentStatus}
                                    disabled={updatingPayment || newPaymentStatus === order.paymentStatus}
                                    className="w-full flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white bg-gray-900 hover:bg-avaya-gold transition-all disabled:opacity-40 uppercase tracking-widest"
                                >
                                    {updatingPayment ? <Loader2 size={15} className="animate-spin" /> : 'Update Payment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
