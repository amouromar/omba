"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface CarSortProps {
  onSortChange: (sort: string) => void;
  currentSort: string;
}

const CarSort: React.FC<CarSortProps> = ({ onSortChange, currentSort }) => {
  const options = [
    { label: "Newest Arrivals", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Seats: More to Less", value: "seats_desc" },
  ];

  return (
    <div className="relative group">
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="appearance-none bg-white dark:bg-neutral-surface border-2 border-neutral-border dark:border-neutral-border/50 rounded-2xl px-5 py-3 pr-12 text-xs font-black text-neutral-text-primary dark:text-neutral-text-primary outline-none transition-all cursor-pointer shadow-sm hover:shadow-md"
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-white dark:bg-neutral-surface text-neutral-text-primary dark:text-neutral-text-primary"
          >
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={18}
        className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-text-secondary group-hover:text-primary-main transition-colors pointer-events-none"
      />
    </div>
  );
};

export default CarSort;
