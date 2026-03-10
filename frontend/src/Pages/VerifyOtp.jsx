import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Utils/api';
import { toast } from 'react-hot-toast';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/signup');
        }
    }, [email, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await api.post(
                '/api/users/verify-otp',
                { email, otp },
                config
            );

            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Account verified! Welcome to Aavya.');
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
                <h2 className="text-3xl font-serif text-center text-gray-800 mb-8">Verify OTP</h2>
                <p className="text-center text-gray-600 mb-6">Enter the OTP sent to {email}</p>
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
                        <label className="block text-gray-700 text-sm font-bold mb-2">One Time Password</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-avaya-gold text-center text-2xl tracking-widest"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="------"
                            maxLength="6"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-avaya-gold text-white font-bold py-2 px-4 rounded-sm hover:bg-yellow-600 transition-colors uppercase tracking-widest"
                    >
                        Verify
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;
