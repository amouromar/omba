"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Fuel, Settings2, Info, Heart, Flag } from "lucide-react";

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

interface CarCardProps {
  car: Car;
  isSaved?: boolean;
  onSave?: (id: string) => void;
  onReport?: (id: string) => void;
}

const CarCard: React.FC<CarCardProps> = ({
  car,
  isSaved,
  onSave,
  onReport,
}) => {
  const primaryImage =
    car.car_images.find((img) => img.is_primary) || car.car_images[0];
  const tag =
    car.price_per_day < 60
      ? "Saver"
      : car.price_per_day > 200
        ? "Elite"
        : "Popular";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "decimal",
    }).format(price);
  };

  return (
    <div className="bg-white dark:bg-neutral-surface rounded-4xl overflow-hidden border border-neutral-border/50 dark:border-neutral-border/20 shadow-xl shadow-primary-main/5 hover:shadow-2xl hover:shadow-primary-main/10 hover:border-secondary-main transition-all duration-300 group">
      {/* Image Container */}
      <div className="relative h-64 w-full bg-neutral-surface flex items-center justify-center overflow-hidden">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-primary-main shadow-sm border border-neutral-border">
            {tag}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => onSave?.(car.id)}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isSaved
                ? "bg-secondary-main text-white"
                : "bg-white/80 text-neutral-text-secondary hover:text-secondary-main"
            }`}
          >
            <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => onReport?.(car.id)}
            className="p-2 rounded-full bg-white/80 backdrop-blur-md text-neutral-text-secondary hover:text-red-500 transition-all"
          >
            <Flag size={18} />
          </button>
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
            <h3 className="text-lg font-bold text-neutral-text-main dark:text-neutral-text-main">
              {car.make} {car.model} ({car.year})
            </h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-neutral-text-disabled font-bold uppercase">
              Per Day
            </p>
            <p className="text-lg font-black text-primary-main dark:text-white">
              <span className="text-xs font-normal">TZS</span>{" "}
              {formatPrice(car.price_per_day * 2500)}
            </p>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-neutral-border mb-6">
          <div className="flex flex-col items-center gap-1">
            <Users size={16} className="text-neutral-text-secondary" />
            <span className="text-[10px] font-bold text-neutral-text-secondary">
              {car.seats || 5} Seats
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-neutral-border">
            <Fuel size={16} className="text-neutral-text-secondary" />
            <span className="text-[10px] font-bold text-neutral-text-secondary">
              {car.fuel_type || "Petrol"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Settings2 size={16} className="text-neutral-text-secondary" />
            <span className="text-[10px] font-bold text-neutral-text-secondary">
              {car.transmission}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href={`/cars/${car.id}`}
            className="flex-1 text-center rounded-full bg-primary-main text-white py-3 font-bold hover:bg-primary-dark transition-all transform active:scale-95"
          >
            Book Now
          </Link>
          <button className="p-3 rounded-xl border border-neutral-border text-neutral-text-secondary hover:border-secondary-main hover:text-secondary-main transition-colors">
            <Info size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
