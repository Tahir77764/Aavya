import React from 'react';
import { Link } from 'react-router-dom';
import modernNecklace from '../Assets/17.png';
import modernRing from '../Assets/10.jpg'

const ModernCollection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 h-auto md:h-[600px]">

                {/* Modern Necklace - Left */}
                <div className="relative overflow-hidden group h-[400px] md:h-full">
                    <img
                        src={modernNecklace}
                        alt="Modern Necklace"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12">
                        <h3 className="text-4xl font-serif text-white mb-2">
                            <span className="text-green-400">MODERN</span> NECKLACE
                        </h3>
                        <p className="text-gray-200 mb-6 max-w-sm text-sm">
                            A necklace is jewelry you wear around your neck. You might decide your sparkly faux-diamond necklace is a bit dressy for your.
                        </p>
                        <Link to="/necklaces">
                            <button className="border border-white text-white px-6 py-2 uppercase tracking-widest hover:bg-white hover:text-black transition-colors w-fit text-sm">
                                Shop Now
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Modern Rings - Right */}
                <div className="relative overflow-hidden group h-[400px] md:h-full">
                    <img
                        src={modernRing}
                        alt="Modern Ring"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12">
                        <h3 className="text-4xl font-serif text-white mb-4">Modern Rings</h3>
                        <p className="text-gray-200 mb-8 max-w-sm text-sm leading-relaxed">
                            You might decide your sparkly faux-diamond necklace is a bit dressy for your.
                        </p>
                        <Link to="/rings">
                            <button className="border border-white text-white px-6 py-2 uppercase tracking-widest hover:bg-white hover:text-black transition-colors w-fit text-sm">
                                Shop Now
                            </button>
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ModernCollection;
