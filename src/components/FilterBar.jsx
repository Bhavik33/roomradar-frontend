import React from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

const FilterBar = ({ onFilterChange, filters, categoryCount }) => {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] card-shadow border border-slate-50 mb-12 flex flex-col lg:flex-row items-center gap-6">
      {/* Search */}
      <div className="flex-1 w-full relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search by area, title or city..." 
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-700"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
        {/* Category */}
        <div className="relative flex-1 lg:flex-none">
          <select 
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="appearance-none w-full lg:w-48 pl-6 pr-12 py-4 bg-slate-50 rounded-2xl border-none outline-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700"
          >
            <option value="All">All Categories</option>
            <option value="Flat">Flats</option>
            <option value="PG">PGs</option>
            <option value="Hostel">Hostels</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
        </div>

        {/* Price Range */}
        <div className="relative flex-1 lg:flex-none">
          <select 
            value={filters.priceRange}
            onChange={(e) => onFilterChange('priceRange', e.target.value)}
            className="appearance-none w-full lg:w-48 pl-6 pr-12 py-4 bg-slate-50 rounded-2xl border-none outline-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700"
          >
            <option value="All">Any Budget</option>
            <option value="0-10000">Below ₹10k</option>
            <option value="10000-20000">₹10k - ₹20k</option>
            <option value="20000-50000">₹20k - ₹50k</option>
            <option value="50000+">₹50k+</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
        </div>

        <button className="p-4 bg-slate-900 text-white rounded-2xl hover:scale-105 transition-all shadow-lg active:scale-95">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
