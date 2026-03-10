import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../Utils/api';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            toast.error('Passwords do not match');
        } else {
            setMessage(null);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };

                await api.post(
                    '/api/users/signup',
                    { name, email, password },
                    config
                );

                toast.success('Account created! Please verify your OTP.');
                navigate('/verify-otp', { state: { email } });

            } catch (err) {
                const msg = err.response && err.response.data.message ? err.response.data.message : err.message;
                setError(msg);
                toast.error(msg);
            }
        }
    };

    return (
        <div className="min-h-screen py-20 flex justify-center items-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-serif text-center text-gray-800 mb-8">Register</h2>
                {(error || message) && (
                    <div className="bg-gray-900 border-l-4 border-avaya-gold p-4 mb-6 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                <span className="text-avaya-gold text-xl">⚠️</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-200 font-trajan tracking-wider uppercase">{error || message}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-avaya-gold"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter name"
                        />
                    </div>
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
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-avaya-gold"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-avaya-gold text-white font-bold py-2 px-4 rounded-sm hover:bg-yellow-600 transition-colors uppercase tracking-widest"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-600">
                    Have an Account? <Link to="/login" className="text-avaya-gold hover:underline">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
