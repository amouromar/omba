"use client";

import React from "react";
import { Search, X, SlidersHorizontal, Calendar } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Location {
  id: string;
  name: string;
  type: string;
}

interface FilterSidebarProps {
  categories: Category[];
  locations: Location[];
  currentFilters: {
    search: string;
    category: string | null;
    location: string;
    minPrice: string;
    maxPrice: string;
    transmission: string | null;
    fuelType: string | null;
    seats: string | null;
    startDate: string;
    endDate: string;
  };
  onFilterChange: (
    filters: Partial<FilterSidebarProps["currentFilters"]>,
  ) => void;
  onClear: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  locations,
  currentFilters,
  onFilterChange,
  onClear,
  isOpen,
  onClose,
}) => {
  return (
    <aside
      className={`
      fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-neutral-surface shadow-2xl transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:shadow-none lg:z-0 lg:h-full lg:rounded-3xl lg:border lg:border-neutral-border dark:lg:border-neutral-border/50
      ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    `}
    >
      <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <h2 className="text-xl font-bold text-neutral-text-primary dark:text-neutral-text-primary flex items-center gap-2">
            <SlidersHorizontal size={20} />
            Filters
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-bg rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8 pb-6">
          <div className="hidden lg:flex items-center gap-2 mb-2">
            <SlidersHorizontal size={18} className="text-primary-main" />
            <h2 className="text-lg font-bold text-neutral-text-primary dark:text-neutral-text-primary">
              Filter Options
            </h2>
          </div>

          {/* Search */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-text-secondary uppercase tracking-widest">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search make or model..."
                value={currentFilters.search}
                className="w-full bg-neutral-surface dark:bg-neutral-surface border border-neutral-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary-main outline-none transition-all"
                onChange={(e) => onFilterChange({ search: e.target.value })}
              />
              <Search
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-text-disabled"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-text-secondary uppercase tracking-widest">
              Location
            </label>
            <select
              value={currentFilters.location}
              onChange={(e) => onFilterChange({ location: e.target.value })}
              className="w-full bg-neutral-surface dark:bg-neutral-surface border border-neutral-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary-main outline-none appearance-none transition-all"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-text-secondary uppercase flex items-center gap-2">
                <Calendar size={14} className="text-primary-main" />
                Pick-up Date
              </label>
              <input
                type="date"
                value={currentFilters.startDate}
                onChange={(e) => onFilterChange({ startDate: e.target.value })}
                className="w-full bg-neutral-surface dark:bg-neutral-surface border border-neutral-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary-main outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-text-secondary uppercase flex items-center gap-2">
                <Calendar size={14} className="text-primary-main" />
                Return Date
              </label>
              <input
                type="date"
                value={currentFilters.endDate}
                onChange={(e) => onFilterChange({ endDate: e.target.value })}
                className="w-full bg-neutral-surface dark:bg-neutral-surface border border-neutral-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary-main outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-text-secondary uppercase tracking-widest">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFilterChange({ category: null })}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  currentFilters.category === null
                    ? "bg-primary-main text-white border-primary-main shadow-lg shadow-primary-main/20"
                    : "border-neutral-border text-neutral-text-secondary hover:border-primary-main hover:text-primary-main bg-white dark:bg-transparent"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onFilterChange({ category: cat.id })}
                  className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    currentFilters.category === cat.id
                      ? "bg-primary-main text-white border-primary-main shadow-lg shadow-primary-main/20"
                      : "border-neutral-border text-neutral-text-secondary hover:border-primary-main hover:text-primary-main bg-white dark:bg-transparent"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Seats */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-text-secondary uppercase tracking-widest">
              Seats
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 4, 5, 7].map((num) => (
                <button
                  key={num}
                  onClick={() =>
                    onFilterChange({
                      seats:
                        currentFilters.seats === num.toString()
                          ? null
                          : num.toString(),
                    })
                  }
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    currentFilters.seats === num.toString()
                      ? "bg-secondary-main text-white border-secondary-main shadow-lg shadow-secondary-main/20"
                      : "border-neutral-border text-neutral-text-secondary hover:border-secondary-main hover:text-secondary-main bg-white dark:bg-transparent"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-text-secondary uppercase tracking-widest">
              Daily Rate (USD)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-text-disabled font-bold uppercase">
                  Min
                </span>
                <input
                  type="number"
                  placeholder="0"
                  value={currentFilters.minPrice}
                  className="w-full bg-neutral-surface dark:bg-neutral-surface border border-neutral-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary-main outline-none transition-all"
                  onChange={(e) => onFilterChange({ minPrice: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-text-disabled font-bold uppercase">
                  Max
                </span>
                <input
                  type="number"
                  placeholder="500"
                  value={currentFilters.maxPrice}
                  className="w-full bg-neutral-surface dark:bg-neutral-surface border border-neutral-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary-main outline-none transition-all"
                  onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Transmission */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-text-secondary uppercase tracking-widest">
              Transmission
            </label>
            <div className="flex flex-col gap-2">
              {["Automatic", "Manual"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={currentFilters.transmission === type}
                    className="w-5 h-5 rounded border-neutral-border text-secondary-main focus:ring-secondary-main transition-all"
                    onChange={(e) =>
                      onFilterChange({
                        transmission: e.target.checked ? type : null,
                      })
                    }
                  />
                  <span
                    className={`text-sm font-medium transition-colors ${
                      currentFilters.transmission === type
                        ? "text-secondary-main"
                        : "text-neutral-text-primary dark:text-neutral-text-secondary group-hover:text-secondary-main"
                    }`}
                  >
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Fuel Type */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-text-secondary uppercase tracking-widest">
              Fuel Type
            </label>
            <div className="flex flex-col gap-2">
              {["Petrol", "Diesel"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={currentFilters.fuelType === type}
                    className="w-5 h-5 rounded border-neutral-border text-secondary-main focus:ring-secondary-main transition-all"
                    onChange={(e) =>
                      onFilterChange({
                        fuelType: e.target.checked ? type : null,
                      })
                    }
                  />
                  <span
                    className={`text-sm font-medium transition-colors ${
                      currentFilters.fuelType === type
                        ? "text-secondary-main"
                        : "text-neutral-text-primary dark:text-neutral-text-secondary group-hover:text-secondary-main"
                    }`}
                  >
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={onClear}
            className="w-full py-4 text-sm font-bold text-neutral-text-secondary hover:text-white border-2 border-neutral-border hover:border-primary-main hover:bg-primary-main rounded-2xl transition-all active:scale-[0.98]"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
