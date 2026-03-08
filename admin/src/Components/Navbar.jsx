import React, { useState } from 'react';
import { LogOut, User, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../Assets/12.png';
import navBg from '../Assets/nav12.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
    const [mobileOpen, setMobileOpen] = useState(false);

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        setMobileOpen(false);
        navigate('/login');
    };

    const NavLink = ({ to, children }) => (
        <Link
            to={to}
            onClick={() => setMobileOpen(false)}
            className={`font-serif hover:text-white transition-colors uppercase tracking-widest text-sm ${location.pathname === to ? 'text-white' : 'text-avaya-gold'}`}
        >
            {children}
        </Link>
    );

    return (
        <header className="font-serif">
            <nav
                style={{
                    backgroundImage: `url(${navBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
                className="text-white shadow-md border-b border-avaya-gold relative z-50 w-full"
            >
                <div className="container mx-auto px-4 lg:px-12 h-20 flex justify-between items-center">

                    {/* Logo (Left) */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <img
                                src={logo}
                                alt="Avaya Jewelry"
                                className='h-12 w-auto object-contain transition-transform group-hover:scale-105'
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl tracking-[0.2em] font-serif text-avaya-gold uppercase leading-none">Aavya</span>
                            <span className="text-[10px] tracking-[0.3em] text-gray-300 uppercase leading-none self-end mt-1 font-sans">Admin Panel</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {userInfo && <NavLink to="/products">Products</NavLink>}
                        {userInfo && <NavLink to="/trending">Trending</NavLink>}
                        {userInfo && <NavLink to="/future">Future</NavLink>}
                        {userInfo && <NavLink to="/orders">Orders</NavLink>}
                        {userInfo && <NavLink to="/users">Users</NavLink>}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4 text-avaya-gold">
                        {userInfo ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex flex-col items-end mr-2">
                                    <span className="text-[10px] text-gray-300 uppercase tracking-widest leading-none mb-1">Welcome</span>
                                    <span className="text-sm font-serif text-avaya-gold tracking-wide leading-none">{userInfo.name || 'Admin'}</span>
                                </div>
                                <button
                                    onClick={logoutHandler}
                                    className="hidden md:flex hover:text-white transition-colors items-center gap-2 text-sm font-bold uppercase tracking-widest border border-avaya-gold px-4 py-2 rounded-sm hover:bg-avaya-teal hover:border-avaya-teal"
                                >
                                    Logout
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            location.pathname !== '/login' && (
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest border border-avaya-gold px-4 py-2 rounded-sm transition-colors hover:text-white hover:bg-avaya-teal hover:border-avaya-teal"
                                >
                                    <User size={16} />
                                    Login
                                </Link>
                            )
                        )}

                        {/* Mobile Hamburger */}
                        {userInfo && (
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden text-avaya-gold hover:text-white transition-colors p-1"
                                aria-label="Toggle menu"
                            >
                                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && userInfo && (
                    <div
                        style={{
                            backgroundImage: `url(${navBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                        className="md:hidden border-t border-avaya-gold/30"
                    >
                        <div className="px-6 py-4 space-y-4">
                            <NavLink to="/products">Products</NavLink>
                            <div></div>
                            <NavLink to="/trending">Trending</NavLink>
                            <div></div>
                            <NavLink to="/future">Future</NavLink>
                            <div></div>
                            <NavLink to="/orders">Orders</NavLink>
                            <div></div>
                            <NavLink to="/users">Users</NavLink>
                            <div className="pt-4 border-t border-avaya-gold/20">
                                <button
                                    onClick={logoutHandler}
                                    className="w-full text-left text-avaya-gold hover:text-white transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
