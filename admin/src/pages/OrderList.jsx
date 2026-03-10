import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authConfig } from "../utils/authConfig";
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ShoppingBag, Eye, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const STATUS_COLORS = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Processing: 'bg-indigo-100 text-indigo-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
};

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');
    const [deleting, setDeleting] = useState(null);
    const navigate = useNavigate();

    const getConfig = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return { headers: { Authorization: `Bearer ${userInfo.token}` } };
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({ pageNumber: page });
                if (statusFilter) params.append('status', statusFilter);
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders?${params}`, getConfig());
                setOrders(data.orders);
                setPages(data.pages);
                setTotal(data.total);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchOrders();
    }, [page, statusFilter]);

    const deleteOrder = async (id) => {
        // Direct deletion with toast feedback
        try {
            setDeleting(id);
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, authConfig());
            setOrders(prev => prev.filter(order => order._id !== id));
            toast.success('Order deleted successfully');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to delete order');
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin h-10 w-10 text-avaya-gold" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-gray-900 border-l-4 border-avaya-gold p-8 shadow-2xl animate-in zoom-in duration-300 rounded-r-3xl max-w-lg w-full text-center">
                <AlertCircle className="h-16 w-16 text-avaya-gold mx-auto mb-6" />
                <h2 className="text-gray-200 font-bold uppercase tracking-widest text-lg mb-2">Order System Error</h2>
                <p className="text-gray-400 font-medium mb-8">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-avaya-gold text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all"
                >
                    Retry Connection
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif text-gray-900 font-bold flex items-center gap-3">
                            <ShoppingBag className="h-8 w-8 text-avaya-gold" />
                            Orders
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">{total} total orders</p>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-avaya-gold"
                    >
                        <option value="">All Statuses</option>
                        {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {orders.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500">No orders found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order #</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.map(order => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">{order.orderNumber}</td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{order.user?.name || '—'}</p>
                                                    <p className="text-xs text-gray-400">{order.user?.email || '—'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{order.totalPrice?.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/orders/${order._id}`)}
                                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-avaya-gold transition-colors"
                                                    >
                                                        <Eye size={15} />
                                                        View
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            console.log('[DELETE BTN] Clicked for order:', order._id);
                                                            deleteOrder(order._id);
                                                        }}
                                                        disabled={deleting === order._id}
                                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors disabled:opacity-50"
                                                        title="Delete order"
                                                        style={{ cursor: 'pointer', position: 'relative', zIndex: 10 }}
                                                    >
                                                        {deleting === order._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {pages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-gray-500">Page {page} of {pages}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-gray-200 bg-white hover:border-avaya-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(p + 1, pages))}
                                disabled={page === pages}
                                className="p-2 rounded-lg border border-gray-200 bg-white hover:border-avaya-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderList;
