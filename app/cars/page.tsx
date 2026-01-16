"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/Footer";
import CarCard from "@/components/cars/CarCard";
import FilterSidebar from "@/components/cars/FilterSidebar";
import CarSort from "@/components/cars/CarSort";
import { SlidersHorizontal, Loader2, AlertCircle } from "lucide-react";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  transmission: string;
  fuel_type: string;
  seats: number;
  price_per_day: number;
  categories: {
    name: string;
  };
  car_images: {
    url: string;
    type: string;
    is_primary: boolean;
  }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FilterState {
  search: string;
  category: string | null;
  minPrice: string;
  maxPrice: string;
  transmission: string | null;
  fuelType: string | null;
  sort: string;
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [savedCars, setSavedCars] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("omba_saved_cars");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Filter States
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: null,
    minPrice: "",
    maxPrice: "",
    transmission: null,
    fuelType: null,
    sort: "newest",
  });

  const fetchCars = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("cars")
      .select("*, categories(name), car_images(*)")
      .eq("is_available", true);

    // Apply filters
    if (filters.search) {
      query = query.or(
        `make.ilike.%${filters.search}%,model.ilike.%${filters.search}%`
      );
    }
    if (filters.category) {
      query = query.eq("category_id", filters.category);
    }
    if (filters.minPrice) {
      query = query.gte("price_per_day", parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      query = query.lte("price_per_day", parseInt(filters.maxPrice));
    }
    if (filters.transmission) {
      query = query.eq("transmission", filters.transmission);
    }
    if (filters.fuelType) {
      query = query.eq("fuel_type", filters.fuelType);
    }

    // Sort
    switch (filters.sort) {
      case "price_asc":
        query = query.order("price_per_day", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price_per_day", { ascending: false });
        break;
      case "seats_desc":
        query = query.order("seats", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data } = await query;
    if (data) setCars(data as unknown as Car[]);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: catData } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (catData) setCategories(catData as Category[]);
      fetchCars();
    };

    fetchInitialData();
  }, [fetchCars]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: null,
      minPrice: "",
      maxPrice: "",
      transmission: null,
      fuelType: null,
      sort: "newest",
    });
  };

  const toggleSave = (id: string) => {
    const newSaved = savedCars.includes(id)
      ? savedCars.filter((carId) => carId !== id)
      : [...savedCars, id];

    setSavedCars(newSaved);
    localStorage.setItem("omba_saved_cars", JSON.stringify(newSaved));
  };

  const handleReport = (id: string) => {
    // In a real app, this would open a modal or send an API request
    alert(
      `Vehicle ${id} has been reported. Our team will review it. Thank you!`
    );
  };

  return (
    <div className="min-h-screen bg-neutral-surface dark:bg-neutral-surface">
      

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-32">
                <FilterSidebar
                  categories={categories}
                  onFilterChange={handleFilterChange}
                  onClear={clearFilters}
                />
              </div>
            </div>

            {/* Mobile Filter Button and Sort */}
            <div className="flex flex-col gap-6 flex-1">
              <div className="flex items-center justify-between bg-white dark:bg-neutral-surface p-4 rounded-2xl border border-neutral-border shadow-sm">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary-main text-white rounded-xl font-bold transition-all active:scale-95"
                >
                  <SlidersHorizontal size={18} />
                  Filters
                </button>
                <div className="flex items-center gap-4 ml-auto">
                  <span className="hidden sm:inline text-sm font-medium text-neutral-text-secondary">
                    Sort by:
                  </span>
                  <CarSort
                    currentSort={filters.sort}
                    onSortChange={(sort) => handleFilterChange({ sort })}
                  />
                </div>
              </div>

              {/* Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <Loader2 className="w-12 h-12 text-secondary-main animate-spin mb-4" />
                  <p className="text-neutral-text-secondary font-bold animate-pulse">
                    Filtering the best for you...
                  </p>
                </div>
              ) : cars.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-neutral-border rounded-3xl bg-white/50 dark:bg-neutral-surface/50">
                  <AlertCircle className="w-16 h-16 text-neutral-text-disabled mb-4" />
                  <h3 className="text-xl font-bold text-primary-main dark:text-white mb-2">
                    No matching vehicles
                  </h3>
                  <p className="text-neutral-text-secondary mb-6 text-center max-w-sm">
                    We couldn&apos;t find any cars matching your current
                    filters. Try adjusting them or clearing all.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-primary-main text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      isSaved={savedCars.includes(car.id)}
                      onSave={toggleSave}
                      onReport={handleReport}
                    />
                  ))}
                </div>
              )}

              {/* Stats */}
              {!loading && cars.length > 0 && (
                <div className="mt-8 text-center">
                  <p className="text-sm font-medium text-neutral-text-secondary">
                    Showing{" "}
                    <span className="text-primary-main dark:text-white font-bold">
                      {cars.length}
                    </span>{" "}
                    vehicles available for you.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Drawer */}
      <div className="lg:hidden">
        <FilterSidebar
          categories={categories}
          onFilterChange={handleFilterChange}
          onClear={clearFilters}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
      </div>

      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
}
