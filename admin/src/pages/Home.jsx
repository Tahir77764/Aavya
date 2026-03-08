import React from 'react';
import { useNavigate } from 'react-router-dom';
import adminBg from '../Assets/hero6.png';
import adminMobileBg from '../Assets/hero_mobile.png';

const Home = () => {
    const navigate = useNavigate();
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

    return (
        <section className="relative w-full h-[calc(100vh-5rem)] bg-gray-900 overflow-hidden font-serif">
            {/* Responsive image — browser picks automatically */}
            <picture className="absolute inset-0 w-full h-full">
                {/* Screens BELOW 1063px → hero_mobile.png */}
                <source media="(max-width: 1063px)" srcSet={adminMobileBg} />
                {/* Default → hero6.png (desktop) */}
                <img
                    src={adminBg}
                    alt="Admin Hero Background"
                    className="w-full h-full object-cover object-center sm:object-right md:object-center"
                />
            </picture>

            {/* Content: 
                - Mobile (<1063px): Centered at bottom (below the background logo)
                - Desktop (>=1063px): Left-aligned at center
            */}
            <div className="
                relative z-10 w-full h-full flex flex-col
                px-6 sm:px-8 min-[1063px]:px-24
                items-center text-center
                justify-end pb-12 sm:pb-16
                min-[1063px]:container min-[1063px]:mx-auto min-[1063px]:justify-center min-[1063px]:items-start min-[1063px]:text-left min-[1063px]:pb-0
            ">
                <h1 className="
                    font-bold text-avaya-gold drop-shadow-2xl mb-4 sm:mb-6 leading-tight
                    text-4xl sm:text-5xl md:text-6xl min-[1064px]:text-7xl
                ">
                    Welcome, <br /> {userInfo?.name || 'Admin'}
                </h1>
                <p className="
                    text-gray-100 font-light tracking-wider max-w-xl mb-8 sm:mb-10 drop-shadow-lg
                    text-base sm:text-lg md:text-xl min-[1064px]:text-2xl
                ">
                    Manage your exquisite jewelry collection with elegance and precision.
                </p>

                {userInfo ? (
                    <button
                        onClick={() => navigate('/products')}
                        className="px-10 py-4 bg-avaya-gold text-white text-lg font-bold uppercase tracking-widest hover:bg-white hover:text-avaya-gold transition-all duration-300 shadow-xl rounded-sm border border-avaya-gold transform hover:scale-105 active:scale-95"
                    >
                        Access Dashboard
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="px-10 py-4 bg-transparent border-2 border-avaya-gold text-avaya-gold text-lg font-bold uppercase tracking-widest hover:bg-avaya-gold hover:text-white transition-all duration-300 shadow-xl rounded-sm transform hover:scale-105 active:scale-95"
                    >
                        Login to Panel
                    </button>
                )}
            </div>
        </section>
    );
};

export default Home;
