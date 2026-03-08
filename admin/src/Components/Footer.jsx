import React from 'react';
import logo from '../Assets/12.png';
import footBg from '../Assets/foot.png';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer
            style={{
                backgroundImage: `url(${footBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            className="text-gray-300 py-12 font-trajan"
        >
            <div className="container mx-auto px-4">
                {/* Main footer content — centered, logo + tagline only */}
                <div className="flex flex-col items-center gap-4 mb-10">
                    {/* Logo + Brand name */}
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Aavya Jewelry" className="h-20" />
                        <span className="text-xl tracking-[0.2em] font-trajan text-avaya-gold uppercase">Aavya</span>
                    </div>

                    {/* Tagline */}
                    <p className="text-sm text-[#fcf6ba] tracking-[0.1em] leading-relaxed text-center max-w-md">
                        Crafting elegance that lasts a lifetime. Discover our exclusive collection of fine jewelry designed for the modern soul.
                    </p>

                    {/* Social icons */}
                    <div className="flex gap-5 mt-2 text-[#fcf6ba]">
                        <a href="#" aria-label="Facebook" className="hover:text-avaya-gold transition-colors duration-300">
                            <Facebook size={20} />
                        </a>
                        <a href="#" aria-label="Twitter" className="hover:text-avaya-gold transition-colors duration-300">
                            <Twitter size={20} />
                        </a>
                        <a href="#" aria-label="Instagram" className="hover:text-avaya-gold transition-colors duration-300">
                            <Instagram size={20} />
                        </a>
                        <a href="#" aria-label="Email" className="hover:text-avaya-gold transition-colors duration-300">
                            <Mail size={20} />
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-400 tracking-widest">
                    &copy; {new Date().getFullYear()} Aavya Jewelry. All rights reserved. &nbsp;|&nbsp; Admin Panel
                </div>
            </div>
        </footer>
    );
};

export default Footer;
