import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';

const PRICE_RANGES = [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under ₹1000', min: 0, max: 1000 },
    { label: '₹1000 – ₹5000', min: 1000, max: 5000 },
    { label: '₹5000 – ₹10,000', min: 5000, max: 10000 },
    { label: '₹10,000 – ₹25,000', min: 10000, max: 25000 },
    { label: '₹25,000 – ₹50,000', min: 25000, max: 50000 },
    { label: 'Above ₹50,000', min: 50000, max: Infinity },
];

const SORT_OPTIONS = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Top Rated', value: 'rating' },
];

const ProductFilterBar = ({ products, onFiltered, totalCount }) => {
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);

    const applyFilters = (newSort, newPrice) => {
        let filtered = [...products];

        const range = PRICE_RANGES[newPrice];
        if (range && range.max !== Infinity) {
            filtered = filtered.filter(p => p.price >= range.min && p.price <= range.max);
        } else if (range && range.min > 0) {
            filtered = filtered.filter(p => p.price >= range.min);
        }

        switch (newSort) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'newest':
            default:
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        onFiltered(filtered);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        applyFilters(value, priceRange);
    };

    const handlePriceChange = (index) => {
        setPriceRange(index);
        applyFilters(sortBy, index);
    };

    const clearFilters = () => {
        setSortBy('newest');
        setPriceRange(0);
        applyFilters('newest', 0);
    };

    const hasActiveFilters = sortBy !== 'newest' || priceRange !== 0;

    return (
        <div className="mb-8">
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex items-center gap-2 w-full justify-center py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium mb-4 transition-colors hover:bg-gray-100"
            >
                <SlidersHorizontal size={18} />
                Filters & Sort
                <ChevronDown size={16} className={`transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter bar */}
            <div className={`${mobileOpen ? 'block' : 'hidden'} md:block`}>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">

                        {/* Sort By */}
                        <div className="flex-1 min-w-0">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c] transition-colors cursor-pointer"
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div className="flex-1 min-w-0">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Price Range</label>
                            <select
                                value={priceRange}
                                onChange={(e) => handlePriceChange(Number(e.target.value))}
                                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c] transition-colors cursor-pointer"
                            >
                                {PRICE_RANGES.map((range, idx) => (
                                    <option key={idx} value={idx}>{range.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Clear filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium whitespace-nowrap transition-colors py-2.5"
                            >
                                <X size={14} />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Result count */}
                    {totalCount !== undefined && (
                        <p className="text-xs text-gray-400 mt-3">
                            Showing <span className="font-semibold text-gray-600">{totalCount}</span> product{totalCount !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductFilterBar;
