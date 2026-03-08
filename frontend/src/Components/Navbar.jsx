import React, { useState, useEffect, useRef } from 'react';
import { User, Search, ShoppingBag } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import api from '../Utils/api';
import logo from '../Assets/12.png';
import navBg from '../Assets/nav12.png';

const Navbar = () => {
    const { getCartCount } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
    const cartCount = getCartCount();

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    // Handle clicks outside search component
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch search results
    useEffect(() => {
        const fetchProducts = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const { data } = await api.get(`/api/products?keyword=${searchQuery}`);
                setSearchResults(data.products || []);
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (searchQuery) fetchProducts();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
        setShowResults(false);
        setSearchQuery('');
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
            setShowResults(false);
            setSearchQuery('');
        }
    };

    return (
        <header className="font-trajan sticky top-0 z-50">
            {/* Main Navigation */}
            <nav style={{ backgroundImage: `url(${navBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} className="text-white shadow-md border-b border-avaya-gold relative z-50">
                <div className="container mx-auto px-4 lg:px-12 h-20 flex justify-between items-center">

                    {/* Logo (Left) */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <img src={logo} alt="Avaya Jewelry" className='h-12 w-auto object-contain transition-transform group-hover:scale-105' />
                        </div>
                        <span className="text-xl tracking-[0.2em] font-trajan text-avaya-gold uppercase">Aavya</span>
                    </Link>

                    {/* Desktop Navigation Links (Center) */}
                    <ul className="hidden md:flex items-center gap-8 text-sm font-trajan font-bold tracking-widest text-[#fcf6ba]">
                        <li><Link to="/necklaces" className="hover:text-avaya-gold transition-colors duration-300">Necklaces</Link></li>
                        <li><Link to="/bangles" className="hover:text-avaya-gold transition-colors duration-300">Bangles</Link></li>
                        <li><Link to="/earrings" className="hover:text-avaya-gold transition-colors duration-300">Earrings</Link></li>
                        <li><Link to="/rings" className="hover:text-avaya-gold transition-colors duration-300">Rings</Link></li>
                    </ul>

                    {/* Icons (Right) */}
                    <div className="flex items-center gap-5 text-avaya-gold">
                        <div className="relative group flex items-center" ref={searchRef}>
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowResults(true);
                                }}
                                onKeyDown={handleSearchSubmit}
                                className={`absolute right-5 w-0 group-hover:w-28 md:group-hover:w-60 focus:w-28 md:focus:w-60 transition-all duration-500 ease-in-out bg-black/80 backdrop-blur-md border-b border-avaya-gold text-white text-sm focus:outline-none opacity-0 group-hover:opacity-100 focus:opacity-100 placeholder:text-gray-400 px-2 rounded-t-md ${searchQuery ? 'w-28 md:w-60 opacity-100' : ''}`}
                            />
                            <button className="hover:text-white transition-colors relative z-10">
                                <Search size={18} />
                            </button>

                            {/* Search Results Dropdown */}
                            {showResults && searchQuery && (
                                <div className="absolute top-full right-0 mt-2 w-40 md:w-72 bg-neutral-900 border border-avaya-gold/30 text-white shadow-2xl rounded-md overflow-hidden z-[60]">
                                    {isLoading ? (
                                        <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                            {searchResults.map((product) => (
                                                <div
                                                    key={product._id}
                                                    onClick={() => handleProductClick(product._id)}
                                                    className="flex items-center gap-3 p-3 border-b border-gray-800 hover:bg-white/10 cursor-pointer transition-colors"
                                                >
                                                    <img
                                                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/40'}
                                                        alt={product.name}
                                                        className="w-10 h-10 object-cover rounded bg-gray-800"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-avaya-gold truncate">{product.name}</h4>
                                                        <p className="text-xs text-gray-400 truncate">${product.price?.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-400 text-sm">No products found</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Profile Link */}
                        <Link to={userInfo ? "/profile" : "/login"} className="hover:text-white transition-colors" title={userInfo ? "Profile" : "Login"}>
                            <User size={18} />
                        </Link>

                        {/* Cart Link */}
                        <Link to="/cart" className="hover:text-white transition-colors relative">
                            <ShoppingBag size={18} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
