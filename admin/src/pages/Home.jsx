import React from 'react';
import { useNavigate } from 'react-router-dom';
import adminBg from '../Assets/hero6.png';

const Home = () => {
    const navigate = useNavigate();
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-gray-900 text-white flex items-center justify-start relative overflow-hidden font-serif">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-100"
                style={{ backgroundImage: `url(${adminBg})`, backgroundSize: 'cover' }}
            ></div>
            {/* Gradient Overlay */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div> */}

            {/* Content */}
            <div className="relative z-10 text-left px-8 md:px-16 max-w-4xl flex flex-col items-start ml-0 md:ml-12">
                <h1 className="text-5xl md:text-7xl font-bold text-avaya-gold mb-6 tracking-wide drop-shadow-2xl leading-tight">
                    Welcome, <br /> {userInfo?.name || 'Admin'}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wider max-w-xl mb-10 drop-shadow-lg">
                    Manage your exquisite jewelry collection with elegance and precision.
                </p>

                {userInfo ? (
                    <button
                        onClick={() => navigate('/products')}
                        className="px-10 py-4 bg-avaya-gold text-white text-lg font-bold uppercase tracking-widest hover:bg-white hover:text-avaya-gold transition-all duration-300 shadow-xl rounded-sm border border-avaya-gold"
                    >
                        Access Dashboard
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="px-10 py-4 bg-transparent border-2 border-avaya-gold text-avaya-gold text-lg font-bold uppercase tracking-widest hover:bg-avaya-gold hover:text-white transition-all duration-300 shadow-xl rounded-sm"
                    >
                        Login to Panel
                    </button>
                )}
            </div>
        </div>
    );
};

export default Home;
