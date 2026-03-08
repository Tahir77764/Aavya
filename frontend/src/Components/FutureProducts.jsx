import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import api from '../Utils/api';
import { Link } from 'react-router-dom';

const FutureProducts = () => {
    const scrollRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFutureProducts = async () => {
            try {
                const { data } = await api.get('/api/products?future=true&pageSize=12');
                setProducts(data.products);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching future products:', error);
                setLoading(false);
            }
        };
        fetchFutureProducts();
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -350 : 350;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (loading) return null; // Or a subtle skeleton
    if (products.length === 0) return null;

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-avaya-gold to-transparent opacity-50"></div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#fcf6ba] via-[#d4af37] to-[#997b2f] uppercase mb-4 inline-block drop-shadow-sm">
                        Future Collections
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-avaya-gold to-transparent mx-auto mt-2"></div>
                    <p className="text-gray-400 font-serif italic mt-4 tracking-wider">A glimpse into tomorrow's masterpieces</p>
                </div>

                <div className="relative max-w-6xl mx-auto px-12">
                    {/* Navigation Buttons */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full border border-avaya-gold/30 text-avaya-gold hover:bg-avaya-gold hover:text-black transition-all duration-300 z-20 hidden md:flex items-center justify-center group"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full border border-avaya-gold/30 text-avaya-gold hover:bg-avaya-gold hover:text-black transition-all duration-300 z-20 hidden md:flex items-center justify-center group"
                    >
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div ref={scrollRef} className="flex gap-8 overflow-x-auto pb-8 snap-x w-full justify-start scrollbar-hide px-4">
                        {products.map((item, idx) => (
                            <Link
                                to={`/product/${item._id}`}
                                key={item._id}
                                className="group relative w-[280px] md:w-[calc(33.333%-1.5rem)] aspect-square snap-center shrink-0 cursor-pointer rounded-lg overflow-hidden"
                            >
                                <div className="w-full h-full relative rounded-xl overflow-hidden shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] border border-white/5 group-hover:border-avaya-gold/40">

                                    {/* Image */}
                                    <img
                                        src={item.images?.[0] || 'https://via.placeholder.com/400'}
                                        alt={item.name}
                                        className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 transition-opacity duration-300"></div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 w-full p-6 text-left transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            <Sparkles size={14} className="text-avaya-gold" />
                                            <span className="text-xs tracking-[0.2em] text-avaya-gold uppercase">Coming Soon</span>
                                        </div>
                                        <h3 className="text-2xl font-serif text-white tracking-wider mb-2 drop-shadow-md group-hover:text-[#fcf6ba] transition-colors">{item.name}</h3>
                                        <div className="w-0 group-hover:w-full h-[1px] bg-avaya-gold transition-all duration-700 ease-in-out"></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FutureProducts;
