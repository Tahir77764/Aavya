import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

                // Navigate to verify otp page with email state
                navigate('/verify-otp', { state: { email } });

            } catch (err) {
                setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            }
        }
    };

    return (
        <div className="min-h-screen py-20 flex justify-center items-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-serif text-center text-gray-800 mb-8">Register</h2>
                {message && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{message}</div>}
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

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
