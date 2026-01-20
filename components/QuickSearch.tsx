"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Location {
  id: string;
  name: string;
  city: string;
  type: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const QuickSearch = () => {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [pickUpDate, setPickUpDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [returnDate, setReturnDate] = useState(
    () => new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
  );
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [locRes, catRes] = await Promise.all([
        supabase.from("locations").select("*").order("name"),
        supabase.from("categories").select("*").order("name"),
      ]);

      if (locRes.data) {
        setLocations(locRes.data);
        if (locRes.data.length > 0) setSelectedLocation(locRes.data[0].name);
      }
      if (catRes.data) setCategories(catRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSearch = (filterOverride?: Record<string, string>) => {
    const params = new URLSearchParams();
    if (selectedLocation) params.append("location", selectedLocation);
    if (pickUpDate) params.append("startDate", pickUpDate);
    if (returnDate) params.append("endDate", returnDate);

    if (filterOverride) {
      Object.entries(filterOverride).forEach(([key, value]) => {
        params.append(key, value);
      });
    }

    router.push(`/cars?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 -mt-12 relative z-20">
      <div className="bg-white dark:bg-neutral-surface rounded-2xl border-t shadow-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-text-secondary flex items-center gap-2">
              <MapPin size={16} className="text-primary-main" />
              Pick-up Location
            </label>
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-neutral-surface border border-neutral-border rounded-xl pl-2 pr-8 py-3 text-neutral-text-secondary text-sm font-medium focus:ring-2 focus:ring-secondary-main outline-none appearance-none transition-all disabled:opacity-50"
              >
                {loading ? (
                  <option>Loading locations...</option>
                ) : (
                  <>
                    <optgroup label="Airports">
                      {locations
                        .filter((loc) => loc.type === "airport")
                        .map((loc) => (
                          <option
                            key={loc.id}
                            value={loc.name}
                            className="text-neutral-text-secondary"
                          >
                            {loc.name}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="City / Other">
                      {locations
                        .filter((loc) => loc.type !== "airport")
                        .map((loc) => (
                          <option
                            key={loc.id}
                            value={loc.name}
                            className="text-neutral-text-secondary"
                          >
                            {loc.name}
                          </option>
                        ))}
                    </optgroup>
                  </>
                )}
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
              className="w-full bg-neutral-surface border border-neutral-border rounded-xl pl-2 pr-8 py-3 text-neutral-text-secondary text-sm font-medium focus:ring-2 focus:ring-secondary-main outline-none transition-all"
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
              className="w-full bg-neutral-surface border border-neutral-border rounded-xl pl-2 pr-8 py-3 text-neutral-text-secondary text-sm font-medium focus:ring-2 focus:ring-secondary-main outline-none transition-all"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            className="bg-primary-main text-white h-[52px] rounded-full font-bold text-lg hover:bg-primary-dark transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10"
          >
            <Search size={24} />
            Search
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-4 mt-6 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-neutral-text-disabled uppercase tracking-widest whitespace-nowrap">
            Quick Select:
          </span>
          {loading ? (
            <span className="text-xs text-neutral-text-disabled animated-pulse">
              Loading categories...
            </span>
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSearch({ category: cat.id })}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-neutral-border text-neutral-text-secondary hover:border-secondary-main hover:text-secondary-main transition-colors whitespace-nowrap"
              >
                {cat.name}
              </button>
            ))
          )}
          {!loading && (
            <>
              <button
                onClick={() => handleSearch({ transmission: "Manual" })}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-neutral-border text-neutral-text-secondary hover:border-secondary-main hover:text-secondary-main transition-colors whitespace-nowrap"
              >
                Manual
              </button>
              <button
                onClick={() => handleSearch({ transmission: "Automatic" })}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-neutral-border text-neutral-text-secondary hover:border-secondary-main hover:text-secondary-main transition-colors whitespace-nowrap"
              >
                Automatic
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;
