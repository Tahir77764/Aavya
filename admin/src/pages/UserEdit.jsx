import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, UserCog } from 'lucide-react';

const UserEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const getConfig = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return { headers: { Authorization: `Bearer ${userInfo.token}` } };
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${id}`, getConfig());
                setName(data.name || '');
                setEmail(data.email || '');
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/users/${id}`,
                { name, email },
                getConfig()
            );
            setSaving(false);
            navigate('/users');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin h-10 w-10 text-avaya-gold" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-serif text-gray-900 font-bold flex items-center gap-3">
                            <UserCog className="h-7 w-7 text-avaya-gold" />
                            Edit User
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">Update user details.</p>
                    </div>
                    <button
                        onClick={() => navigate('/users')}
                        className="flex items-center text-sm font-medium text-gray-600 hover:text-avaya-gold transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:border-avaya-gold"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Users
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    {error && (
                        <div className="bg-gray-900 border-l-4 border-avaya-gold p-4 mb-8 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 rounded-r-xl">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 h-10 w-10 bg-avaya-gold/10 rounded-full flex items-center justify-center">
                                    <span className="text-avaya-gold text-lg">⚠️</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-200 font-bold uppercase tracking-widest">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                className="block w-full rounded-lg border-gray-300 border shadow-sm py-3 px-4 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-avaya-gold text-sm transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="block w-full rounded-lg border-gray-300 border shadow-sm py-3 px-4 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-avaya-gold text-sm transition-colors"
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-avaya-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="animate-spin h-4 w-4" />
                                        Saving...
                                    </>
                                ) : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserEdit;
