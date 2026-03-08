import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Utils/api';

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
            navigate('/');
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        }
    };

    return (
        <div className="min-h-screen py-20 flex justify-center items-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-serif text-center text-gray-800 mb-8">Verify OTP</h2>
                <p className="text-center text-gray-600 mb-6">Enter the OTP sent to {email}</p>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

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
