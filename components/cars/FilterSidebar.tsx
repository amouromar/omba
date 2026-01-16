"use client";

import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FilterSidebarProps {
  categories: Category[];
  onFilterChange: (
    filters: Partial<{
      search: string;
      category: string | null;
      minPrice: string;
      maxPrice: string;
      transmission: string | null;
      fuelType: string | null;
    }>,
  ) => void;
  onClear: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
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
                className="w-full bg-neutral-surface dark:bg-neutral-surface border border-neutral-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary-main outline-none transition-all"
                onChange={(e) => onFilterChange({ search: e.target.value })}
              />
              <Search
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-text-disabled"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-text-secondary uppercase tracking-widest">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFilterChange({ category: null })}
                className="px-4 py-2 rounded-xl border border-neutral-border text-xs font-semibold hover:border-primary-main hover:text-primary-main transition-colors bg-white dark:bg-transparent"
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onFilterChange({ category: cat.id })}
                  className="px-4 py-2 rounded-xl border border-neutral-border text-xs font-semibold hover:border-primary-main hover:text-primary-main transition-colors bg-white dark:bg-transparent"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-neutral-text-secondary uppercase tracking-widest">
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
                  className="w-full bg-neutral-surface dark:bg-neutral-surface border border-neutral-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary-main outline-none transition-all"
                  onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Transmission */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-neutral-text-secondary uppercase tracking-widest">
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
                    className="w-5 h-5 rounded border-neutral-border text-secondary-main focus:ring-secondary-main"
                    onChange={(e) =>
                      onFilterChange({
                        transmission: e.target.checked ? type : null,
                      })
                    }
                  />
                  <span className="text-sm font-medium text-neutral-text-primary dark:text-neutral-text-secondary group-hover:text-secondary-main transition-colors">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Fuel Type */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-neutral-text-secondary uppercase tracking-widest">
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
                    className="w-5 h-5 rounded border-neutral-border text-secondary-main focus:ring-secondary-main"
                    onChange={(e) =>
                      onFilterChange({
                        fuelType: e.target.checked ? type : null,
                      })
                    }
                  />
                  <span className="text-sm font-medium text-neutral-text-primary dark:text-neutral-text-secondary group-hover:text-secondary-main transition-colors">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={onClear}
            className="w-full py-4 text-sm font-bold text-neutral-text-disabled bg-slate-400 dark:bg-slate-200 rounded-full hover:text-primary-main dark:hover:text-primary-main transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
