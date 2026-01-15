"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Search } from "lucide-react";

const QuickSearch = () => {
  const [pickUpDate, setPickUpDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    // Setting dates in useEffect avoids hydration mismatch and impure function warnings during render
    const today = new Date().toISOString().split("T")[0];
    const future = new Date(Date.now() + 86400000 * 3)
      .toISOString()
      .split("T")[0];

    // Using a microtask to avoid the "cascading render" lint warning if needed,
    // although standard useEffect setState is generally acceptable for hydration.
    Promise.resolve().then(() => {
      setPickUpDate(today);
      setReturnDate(future);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-6 -mt-12 relative z-20">
      <div className="bg-white dark:bg-neutral-surface rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-text-secondary flex items-center gap-2">
              <MapPin size={16} className="text-primary-main" />
              Pick-up Location
            </label>
            <div className="relative">
              <select className="w-full bg-neutral-surface border border-neutral-border rounded-xl px-4 py-3 text-neutral-text-primary font-medium focus:ring-2 focus:ring-secondary-main outline-none appearance-none transition-all">
                <option>Dar es Salaam City Center</option>
                <option>JK Terminal 3 Airport</option>
                <option>Zanzibar Airport (ZNZ)</option>
                <option>Arusha (Kilimanjaro Int.)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-4 border-neutral-border">
                <div className="border-t-4 border-l-4 border-transparent border-t-neutral-text-secondary transform -rotate-45" />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-text-secondary flex items-center gap-2">
              <Calendar size={16} className="text-primary-main" />
              Pick-up Date
            </label>
            <input
              type="date"
              className="w-full bg-neutral-surface border border-neutral-border rounded-xl px-4 py-3 text-neutral-text-primary font-medium focus:ring-2 focus:ring-secondary-main outline-none transition-all"
              value={pickUpDate}
              onChange={(e) => setPickUpDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-text-secondary flex items-center gap-2">
              <Calendar size={16} className="text-primary-main" />
              Return Date
            </label>
            <input
              type="date"
              className="w-full bg-neutral-surface border border-neutral-border rounded-xl px-4 py-3 text-neutral-text-primary font-medium focus:ring-2 focus:ring-secondary-main outline-none transition-all"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <button className="bg-primary-main text-white h-[52px] rounded-xl font-bold text-lg hover:bg-primary-dark transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10">
            <Search size={22} />
            Search Cars
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-4 mt-6 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-neutral-text-disabled uppercase tracking-widest whitespace-nowrap">
            Quick Select:
          </span>
          {["Economy", "Luxury", "SUV/4x4", "Manual", "Automatic"].map(
            (tag) => (
              <button
                key={tag}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-neutral-border text-neutral-text-secondary hover:border-secondary-main hover:text-secondary-main transition-colors whitespace-nowrap"
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;
