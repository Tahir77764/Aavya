import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authConfig } from "../utils/authConfig";
import { useNavigate } from 'react-router-dom';
import { Trash2, Loader2, AlertCircle, Users, Search, Pencil, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const getConfig = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return { headers: { Authorization: `Bearer ${userInfo.token}` } };
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, getConfig());
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        // Direct action
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, authConfig());
            setUsers(prev => prev.filter(user => user._id !== id));
            toast.success('User deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };


    const filtered = users
        .filter(u => u && u._id)
        .filter(u =>
            (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(search.toLowerCase())
        );

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin h-10 w-10 text-avaya-gold" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-gray-900 border-l-4 border-avaya-gold p-8 shadow-2xl animate-in zoom-in duration-300 rounded-r-3xl max-w-lg w-full text-center">
                <AlertCircle className="h-16 w-16 text-avaya-gold mx-auto mb-6" />
                <h2 className="text-gray-200 font-bold uppercase tracking-widest text-lg mb-2">User System Error</h2>
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
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif text-gray-900 font-bold flex items-center gap-3">
                            <Users className="h-8 w-8 text-avaya-gold" />
                            User Management
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">{users.length} registered users</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-avaya-gold focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500">No users found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.map(user => (
                                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-avaya-gold/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sm font-bold text-avaya-gold">
                                                            {(user.name || '?').charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="font-medium text-gray-900 text-sm">{user.name || '—'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {user.isVerified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {user.isAdmin ? 'Admin' : 'Customer'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/users/${user._id}`)}
                                                        title="View details"
                                                        className="p-2 rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/users/edit/${user._id}`)}
                                                        title="Edit"
                                                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser(user._id)}
                                                        disabled={user.isAdmin}
                                                        title={user.isAdmin ? 'Cannot delete admin' : 'Delete user'}
                                                        className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 size={16} />
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
            </div>
        </div>
    );
};

export default UserList;
