import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCart } from '../Context/CartContext';
import api from '../Utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { fetchCart } = useCart();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { // Corrected headers
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await api.post(
                '/api/users/login',
                { email, password },
                config
            );

            localStorage.setItem('userInfo', JSON.stringify(data));
            await fetchCart();
            toast.success('Welcome back to Aavya!');
            navigate('/');
        } catch (err) {
            const msg = err.response && err.response.data.message ? err.response.data.message : err.message;
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen py-20 flex justify-center items-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-serif text-center text-gray-800 mb-8">Sign In</h2>
                {error && (
                    <div className="bg-gray-900 border-l-4 border-avaya-gold p-4 mb-6 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                <span className="text-avaya-gold text-xl">⚠️</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-200 font-trajan tracking-wider uppercase">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-avaya-gold"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-avaya-gold"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Link to="/forgot-password" class="text-sm text-avaya-gold hover:underline">
                            Forgot your password?
                        </Link>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-avaya-gold text-white font-bold py-2 px-4 rounded-sm hover:bg-yellow-600 transition-colors uppercase tracking-widest"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-600">
                    New Customer? <Link to="/signup" className="text-avaya-gold hover:underline">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
