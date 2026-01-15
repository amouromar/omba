import React from "react";
import Image from "next/image";
import { Users, Fuel, Settings2, Info } from "lucide-react";

const cars = [
  {
    id: 1,
    name: "Toyota Vitz / Ist",
    category: "Economy",
    price: "75,000",
    image: "/car-economy.png",
    seats: 5,
    fuel: "Petrol",
    transmission: "Auto",
    tag: "Saver",
  },
  {
    id: 2,
    name: "Mercedes-Benz C-Class",
    category: "Luxury",
    price: "180,000",
    image: "/car-sedan.png",
    seats: 5,
    fuel: "Petrol",
    transmission: "Auto",
    tag: "Business",
  },
  {
    id: 3,
    name: "Toyota Land Cruiser V8",
    category: "Premium SUV",
    price: "350,000",
    image: "/car-suv.png",
    seats: 7,
    fuel: "Diesel",
    transmission: "Auto",
    tag: "Adventure",
  },
  {
    id: 4,
    name: "Toyota RAV4",
    category: "Standard SUV",
    price: "120,000",
    image: "/car-suv.png", // Reusing suv for demo
    seats: 5,
    fuel: "Petrol",
    transmission: "Auto",
    tag: "Popular",
  },
  {
    id: 5,
    name: "Suzuki Swift",
    category: "Economy",
    price: "85,000",
    image: "/car-economy.png",
    seats: 5,
    fuel: "Petrol",
    transmission: "Manual",
    tag: "Daily",
  },
  {
    id: 6,
    name: "Toyota Land Cruiser 70",
    category: "4x4 Off-Road",
    price: "400,000",
    image: "/car-suv.png",
    seats: 5,
    fuel: "Diesel",
    transmission: "Manual",
    tag: "Hardcore",
  },
];

const FeaturedCars = () => {
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
              →
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white dark:bg-neutral-surface rounded-3xl overflow-hidden border border-neutral-border hover:border-secondary-main/10 hover:shadow-2xl hover:shadow-primary-main/5 transition-all group"
            >
              {/* Image Container */}
              <div className="relative h-80 w-full bg-neutral-surface flex items-center justify-center p-6 overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-primary-main shadow-sm border border-neutral-border">
                    {car.tag}
                  </span>
                </div>
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  className="object-cover p-4 group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-secondary-main uppercase tracking-widest mb-1">
                      {car.category}
                    </p>
                    <h3 className="text-xl font-bold text-primary-main">
                      {car.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-text-disabled font-bold uppercase">
                      Per Day
                    </p>
                    <p className="text-xl font-black text-primary-main">
                      <span className="text-xs font-normal">TZS</span>{" "}
                      {car.price}
                    </p>
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 py-4 border-y border-neutral-border mb-6">
                  <div className="flex flex-col items-center gap-1">
                    <Users size={18} className="text-neutral-text-secondary" />
                    <span className="text-[10px] font-bold text-neutral-text-secondary">
                      {car.seats} Seats
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 border-x border-neutral-border">
                    <Fuel size={18} className="text-neutral-text-secondary" />
                    <span className="text-[10px] font-bold text-neutral-text-secondary">
                      {car.fuel}
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
                  <button className="flex-1 bg-primary-main text-white py-3.5 rounded-xl font-bold hover:bg-primary-dark transition-all transform active:scale-95">
                    Book Now
                  </button>
                  <button className="p-3.5 rounded-xl border border-neutral-border text-neutral-text-secondary hover:border-secondary-main hover:text-secondary-main transition-colors">
                    <Info size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
