
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Fuel, Settings2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

const FeaturedCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase
        .from("cars")
        .select(
          `
          *,
          categories(name),
          car_images(*)
        `,
        )
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (data) {
        setCars(data as unknown as Car[]);
      }
      setLoading(false);
    };

    fetchCars();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "decimal",
    }).format(price);
  };

  return (
    <section id="featured" className="py-24 bg-neutral-bg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-primary-main mb-4">
              Explore Our <span className="text-secondary-main">Premium</span>{" "}
              Fleet
            </h2>
            <p className="text-neutral-text-secondary text-lg max-w-2xl">
              Choose from our diverse range of well-maintained vehicles,
              perfectly suited for the Tanzanian terrain and urban life.
            </p>
          </div>
          <button className="text-primary-main font-bold hover:text-secondary-main transition-colors flex items-center gap-2 group whitespace-nowrap">
            View All Vehicles
            <span className="w-8 h-8 rounded-full bg-primary-main/10 flex items-center justify-center group-hover:bg-secondary-main group-hover:text-white transition-all">
              <Link href="/cars">→</Link>
            </span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-secondary-main animate-spin mb-4" />
            <p className="text-neutral-text-secondary animate-pulse font-bold">
              Preparing your fleet...
            </p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-neutral-border rounded-3xl">
            <p className="text-neutral-text-secondary font-medium">
              No cars available at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => {
              const primaryImage =
                car.car_images.find((img) => img.is_primary) ||
                car.car_images[0];
              const tag =
                car.price_per_day < 60
                  ? "Saver"
                  : car.price_per_day > 200
                    ? "Elite"
                    : "Popular";

              return (
                <div
                  key={car.id}
                  className="bg-white dark:bg-neutral-surface rounded-3xl overflow-hidden border border-neutral-border hover:border-secondary-main/10 hover:shadow-2xl hover:shadow-primary-main/5 transition-all group"
                >
                  {/* Image Container */}
                  <div className="relative h-80 w-full bg-neutral-surface flex items-center justify-center overflow-hidden">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-primary-main shadow-sm border border-neutral-border">
                        {tag}
                      </span>
                    </div>
                    {primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={`${car.make} ${car.model}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-neutral-text-disabled">
                        <Loader2 className="w-8 h-8 opacity-20" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Photo Coming Soon
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-bold text-secondary-main uppercase tracking-widest mb-1">
                          {car.categories?.name}
                        </p>
                        <h3 className="text-xl font-bold text-primary-main">
                          {car.make} {car.model} ({car.year})
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-text-disabled font-bold uppercase">
                          Per Day
                        </p>
                        <p className="text-xl font-black text-primary-main">
                          <span className="text-xs font-normal">TZS</span>{" "}
                          {formatPrice(car.price_per_day * 2500)}{" "}
                          {/* Convert USD to TZS for display if base is USD */}
                        </p>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-2 py-4 border-y border-neutral-border mb-6">
                      <div className="flex flex-col items-center gap-1">
                        <Users
                          size={18}
                          className="text-neutral-text-secondary"
                        />
                        <span className="text-[10px] font-bold text-neutral-text-secondary">
                          {car.seats || 5} Seats
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1 border-x border-neutral-border">
                        <Fuel
                          size={18}
                          className="text-neutral-text-secondary"
                        />
                        <span className="text-[10px] font-bold text-neutral-text-secondary">
                          {car.fuel_type || "Petrol"}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Settings2
                          size={18}
                          className="text-neutral-text-secondary"
                        />
                        <span className="text-[10px] font-bold text-neutral-text-secondary">
                          {car.transmission}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/cars/${car.id}`}
                        className="flex-1 block text-center bg-primary-main text-white py-3.5 rounded-full font-bold hover:bg-primary-dark transition-all transform active:scale-95"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCars;
