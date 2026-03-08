import { Link } from 'react-router-dom';
import React from 'react';
import logo from '../Assets/12.png';
import navBg from '../Assets/foot.png';
import { Facebook, Youtube, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ backgroundImage: `url(${navBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} className="bg-avaya-dark  border-t border-avaya-gold text-gray-300 py-12 font-trajan">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand */}
                <div className="space-y-4">
                    <div className="text-2xl font-serif font-bold text-white flex items-center">
                        <img src={logo} alt="" className='h-20' />
                        <span className="text-xl tracking-[0.2em] font-trajan text-avaya-gold uppercase">Aavya</span>
                    </div>
                    <p className="text-sm text-[#fcf6ba] tracking-[0.1em] leading-relaxed">
                        Crafting elegance that lasts a lifetime. Discover our exclusive collection of fine jewelry designed for the modern soul.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-white font-medium uppercase tracking-widest mb-4 text-sm text-[#fcf6ba] text-bold">Shop</h4>
                    <ul className="space-y-2 text-sm text-[#fcf6ba]">
                        <li><Link to="/necklaces" className="hover:text-avaya-gold tracking-[0.05em] transition-colors duration-300">Necklaces</Link></li>
                        <li><Link to="/rings" className="hover:text-avaya-gold tracking-[0.05em] transition-colors duration-300">Rings</Link></li>
                        <li><Link to="/earrings" className="hover:text-avaya-gold tracking-[0.05em] transition-colors duration-300">Earrings</Link></li>
                        <li><Link to="/bangles" className="hover:text-avaya-gold tracking-[0.05em] transition-colors duration-300">Bangles</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h4 className="text-white font-medium uppercase tracking-widest mb-4 text-sm text-avaya-gold text-bold">Support</h4>
                    <ul className="space-y-2 text-sm text-[#fcf6ba]">
                        <li><Link to="/about" className="hover:text-avaya-gold tracking-[0.05em] transition-colors duration-300">About Us</Link></li>
                        <li><Link to="/shipping-policy" className="hover:text-avaya-gold tracking-[0.05em] transition-colors duration-300">Shipping Policy</Link></li>
                        <li><Link to="/returns-exchanges" className="hover:text-avaya-gold tracking-[0.05em] transition-colors duration-300">Returns & Exchanges</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-white font-medium uppercase tracking-widest mb-4 text-sm">Stay Connected</h4>
                    <ul className="space-y-2 text-sm text-[#fcf6ba]">
                        <li><Link to="/contact" className="hover:text-avaya-gold transition-colors duration-300">Contact Us</Link></li>
                        <li><Link to="/faq" className="hover:text-avaya-gold transition-colors duration-300">FAQ</Link></li>
                    </ul>
                    <div className="flex gap-4 mt-6">
                        <a href="#" className="hover:text-avaya-gold transition-colors"><Facebook size={20} /></a>
                        <a href="#" className="hover:text-avaya-gold transition-colors"><Instagram size={20} /></a>
                        <a href="#" className="hover:text-avaya-gold transition-colors"><Youtube size={20} /></a>
                    </div>
                </div>

            </div>

            <div className="container mx-auto px-4 border-t border-avaya-gold mt-12 pt-8 text-center text-xs text-[#fcf6ba]">
                &copy; {new Date().getFullYear()} Aavya Jewelry. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;