import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import api from '../Utils/api';
import ProductCard from '../Components/ProductCard';

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const keyword = searchParams.get('keyword') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [Pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState('newest');
    const [inputValue, setInputValue] = useState(keyword);

    // Re-sync input if URL param changes (e.g. back-navigation)
    useEffect(() => {
        setInputValue(keyword);
        setPage(1);
    }, [keyword]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!keyword.trim()) {
                setProducts([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const { data } = await api.get(
                    `/api/products?keyword=${encodeURIComponent(keyword)}&pageNumber=${page}&sortBy=${sortBy}`
                );
                setProducts(data.products || []);
                setPages(data.Pages || 1);
                setTotal(data.total || 0);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword, page, sortBy]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setSearchParams({ keyword: inputValue.trim() });
            setPage(1);
        }
    };

    const handleClearSearch = () => {
        setInputValue('');
        navigate('/collections');
    };

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Top Rated' },
    ];

    return (
        <div className="min-h-screen bg-[#faf9f6] font-serif">

            {/* Hero Search Banner */}
            <div
                className="relative py-16 px-4 text-center overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #1a1209 0%, #2d1f0a 50%, #1a1209 100%)',
                }}
            >
                {/* Decorative gold lines */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
                    backgroundSize: '20px 20px',
                }} />

                <div className="relative z-10 max-w-3xl mx-auto">
                    <p className="text-[#c9a84c] uppercase tracking-[0.4em] text-xs mb-3 font-sans">Aavya Jewellery</p>
                    <h1 className="text-3xl md:text-4xl font-trajan text-white mb-2 tracking-wider">
                        Search Results
                    </h1>
                    {keyword && (
                        <p className="text-[#c9a84c] text-lg mt-2 mb-6">
                            Results for <span className="italic">"{keyword}"</span>
                        </p>
                    )}

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="flex items-center max-w-xl mx-auto mt-6 px-2 min-[455px]:px-0">
                        <div className="flex flex-1 items-center bg-white/10 backdrop-blur border border-[#c9a84c]/40 rounded-l-full pl-3 pr-2 min-[455px]:px-5 h-10 min-[455px]:h-12 gap-2 min-[455px]:gap-3">
                            <Search size={16} className="text-[#c9a84c] shrink-0 min-[455px]:size-[18px]" />
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Search jewellery…"
                                className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-[13px] min-[455px]:text-sm font-sans w-full"
                            />
                            {inputValue && (
                                <button type="button" onClick={handleClearSearch} className="text-white/40 hover:text-white transition-colors">
                                    <X size={14} className="min-[455px]:size-[16px]" />
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-[#c9a84c] hover:bg-[#b8942f] border border-[#c9a84c]/40 text-white px-4 min-[455px]:px-6 h-10 min-[455px]:h-12 rounded-r-full font-sans text-xs min-[455px]:text-sm uppercase tracking-widest transition-colors duration-300"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Results Section */}
            <div className="container mx-auto px-4 lg:px-12 py-10">

                {/* Results meta + sort bar */}
                {!loading && keyword && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <p className="text-gray-500 font-sans text-sm">
                            {total > 0
                                ? <><span className="text-gray-900 font-semibold">{total}</span> products found for <span className="text-[#c9a84c] font-semibold italic">"{keyword}"</span></>
                                : <>No results for <span className="text-[#c9a84c] font-semibold italic">"{keyword}"</span></>
                            }
                        </p>

                        {total > 0 && (
                            <div className="flex items-center gap-2 font-sans">
                                <ArrowUpDown size={15} className="text-[#c9a84c]" />
                                <label className="text-sm text-gray-500 whitespace-nowrap">Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                                    className="border border-gray-300 rounded-md text-sm px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c9a84c] cursor-pointer"
                                >
                                    {sortOptions.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {/* Gold divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent mb-10" />

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-[#c9a84c]/20" />
                            <div className="absolute inset-0 rounded-full border-4 border-t-[#c9a84c] animate-spin" />
                        </div>
                        <p className="text-gray-400 font-sans text-sm animate-pulse">Searching our collection…</p>
                    </div>
                )}

                {/* No Keyword State */}
                {!loading && !keyword && (
                    <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
                            <Search size={36} className="text-[#c9a84c]" />
                        </div>
                        <h2 className="text-2xl font-trajan text-gray-700">Start Your Search</h2>
                        <p className="text-gray-400 font-sans max-w-sm">Type a product name like <em>"ring"</em>, <em>"necklace"</em>, or <em>"gold bangle"</em> to browse our collection.</p>
                    </div>
                )}

                {/* Empty Results State */}
                {!loading && keyword && products.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-28 text-center gap-5">
                        <div className="w-24 h-24 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
                            <SlidersHorizontal size={40} className="text-[#c9a84c]" />
                        </div>
                        <h2 className="text-2xl font-trajan text-gray-700">No Results Found</h2>
                        <p className="text-gray-400 font-sans max-w-sm">
                            We couldn't find any jewellery matching <span className="text-[#c9a84c] font-semibold italic">"{keyword}"</span>.
                            <br />Try a different name or browse our collections.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 mt-2">
                            {['Rings', 'Necklaces', 'Bangles', 'Earrings'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => { setInputValue(cat); setSearchParams({ keyword: cat }); }}
                                    className="px-5 py-2 border border-[#c9a84c]/50 rounded-full text-sm text-[#c9a84c] hover:bg-[#c9a84c] hover:text-white transition-colors duration-300 font-sans"
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && products.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="animate-fadeIn"
                                    style={{ animationFillMode: 'both' }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {Pages > 1 && (
                            <div className="flex justify-center mt-14 gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-500 hover:border-[#c9a84c] hover:text-[#c9a84c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-sans"
                                >
                                    ← Prev
                                </button>

                                {[...Array(Pages).keys()].map((x) => (
                                    <button
                                        key={x + 1}
                                        onClick={() => setPage(x + 1)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm transition-all duration-200 font-sans ${page === x + 1
                                            ? 'bg-[#c9a84c] text-white border-[#c9a84c] shadow-lg scale-110'
                                            : 'bg-white text-gray-600 border-gray-300 hover:border-[#c9a84c] hover:text-[#c9a84c]'
                                            }`}
                                    >
                                        {x + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setPage(p => Math.min(Pages, p + 1))}
                                    disabled={page === Pages}
                                    className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-500 hover:border-[#c9a84c] hover:text-[#c9a84c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-sans"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Fade-in animation style */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.35s ease forwards;
                }
            `}</style>
        </div>
    );
};

export default SearchResults;
