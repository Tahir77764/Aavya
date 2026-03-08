import React from 'react';

const OffersLoop = () => {
    return (
        <div className="bg-black text-white py-3 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30"></div>
            <div className="container mx-auto text-center relative z-10">
                <p className="tracking-[0.2em] font-light text-sm md:text-base">
                    UPTO 25% OFF ON FIRST PURCHASE
                </p>
            </div>
        </div>
    );
};

export default OffersLoop;
