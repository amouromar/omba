"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  Fuel,
  Settings2,
  ShieldCheck,
  Star,
  MapPin,
  ChevronLeft,
  Share2,
  Heart,
  CheckCircle2,
  Award,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarGallery from "@/components/cars/CarGallery";
import BookingSidebar from "@/components/cars/BookingSidebar";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  transmission: string;
  fuel_type: string;
  seats: number;
  price_per_day: number;
  description: string | null;
  features: string[] | null;
  categories: {
    name: string;
  };
  car_images: {
    url: string;
    type: string;
    is_primary: boolean;
  }[];
}

const CarDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  // Mobile sticky bar logic
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Description expansion logic
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("cars")
        .select(
          `
          *,
          categories(name),
          car_images(*)
        `
        )
        .eq("id", id)
        .single();

      if (data) {
        setCar(data as unknown as Car);
      }
      setLoading(false);
    };

    if (id) fetchCar();
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSidebarVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sidebarRef.current) {
      observer.observe(sidebarRef.current);
    }

    return () => {
      if (sidebarRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sidebarRef.current);
      }
    };
  }, [loading]); // Re-run when loading finishes and ref is available

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary-main border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-neutral-text-secondary animate-pulse">
            Polishing the chrome...
          </p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
        <div className="text-center">
          <h2 className="text-2xl font-black text-primary-main mb-4">
            Oops! Car not found.
          </h2>
          <button
            onClick={() => router.push("/cars")}
            className="bg-primary-main text-white px-8 py-3 rounded-xl font-bold"
          >
            Back to Fleet
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "decimal",
    }).format(price * 2500);
  };

  const scrollToBooking = () => {
    sidebarRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-neutral-surface">
      <Navbar />

      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumbs & Actions */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-bold text-neutral-text-secondary hover:text-primary-main transition-colors"
            >
              <ChevronLeft size={18} />
              Back to search
            </button>
            <div className="flex items-center gap-3">
              <button className="p-3 rounded-2xl bg-white border border-neutral-border text-neutral-text-secondary hover:text-primary-main transition-all">
                <Share2 size={18} />
              </button>
              <button className="p-3 rounded-2xl bg-white border border-neutral-border text-neutral-text-secondary hover:text-secondary-main transition-all">
                <Heart size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Main Column: Header -> Gallery -> Features -> Desc -> Reviews */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-secondary-main/10 text-secondary-main px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {car.categories?.name}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-black text-primary-main">
                      4.9
                    </span>
                    <span className="text-xs font-bold text-neutral-text-disabled">
                      (128 Reviews)
                    </span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-primary-main">
                  {car.make} {car.model}{" "}
                  <span className="text-neutral-text-disabled font-medium">
                    {car.year}
                  </span>
                </h1>
                <div className="flex items-center gap-4 mt-3 text-neutral-text-secondary font-bold">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    <span>Dar es Salaam, Tanzania</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-border" />
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-green-500" />
                    <span>OMBA Verified</span>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <CarGallery
                images={car.car_images}
                make={car.make}
                model={car.model}
              />

              {/* Features Grid (Key Specs) */}
              <div className="py-8">
                <h3 className="text-xl font-black text-primary-main mb-6 uppercase tracking-wider">
                  Vehicle Overview
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: <Users size={20} />, label: `${car.seats} Seats` },
                    { icon: <Settings2 size={20} />, label: car.transmission },
                    { icon: <Fuel size={20} />, label: car.fuel_type },
                    { icon: <Award size={20} />, label: "Full Insurance" },
                  ].map((spec, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-neutral-surface border border-neutral-border p-4 rounded-3xl flex flex-col items-center gap-3 text-center transition-all hover:border-secondary-main hover:shadow-lg hover:shadow-primary-main/5"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-primary-main/5 flex items-center justify-center text-primary-main">
                        {spec.icon}
                      </div>
                      <span className="text-xs font-black text-primary-main uppercase tracking-widest">
                        {spec.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description & Features */}
              <div className="bg-white dark:bg-neutral-surface p-8 rounded-4xl border border-neutral-border transition-all duration-300">
                <h3 className="text-xl font-black text-primary-main mb-6 uppercase tracking-wider">
                  Description
                </h3>
                <div
                  className={`relative ${
                    !isDescriptionExpanded ? "max-h-24 overflow-hidden" : ""
                  }`}
                >
                  <p className="text-neutral-text-secondary leading-relaxed text-lg">
                    {car.description ||
                      `Experience the ultimate comfort and performance with this ${car.year} ${car.make} ${car.model}. Perfect for both urban navigation and long-distance Tanzanian adventures. This vehicle is maintained to the highest standards, ensuring a reliable and premium driving experience.`}
                  </p>
                  {!isDescriptionExpanded && (
                    <div className="absolute inset-0 bg-linear-to-t from-white dark:from-neutral-surface via-transparent to-transparent" />
                  )}
                </div>

                {/* Collapsible Features List */}
                {isDescriptionExpanded &&
                  car.features &&
                  car.features.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-neutral-border animate-in fade-in slide-in-from-top-4 duration-500">
                      <h4 className="text-sm font-black text-neutral-text-secondary uppercase tracking-widest mb-6">
                        Key Highlights
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {car.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary-main shrink-0 mt-2" />
                            <span className="text-sm font-medium text-neutral-text-primary leading-relaxed">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="mt-6 text-secondary-main font-bold hover:text-secondary-dark flex items-center gap-1 group"
                >
                  {isDescriptionExpanded ? "Read less" : "Read more"}
                  <ChevronLeft
                    size={16}
                    className={`transition-transform duration-300 ${
                      isDescriptionExpanded ? "rotate-90" : "-rotate-90"
                    }`}
                  />
                </button>
              </div>

              {/* Host Info */}
              <div className="bg-white dark:bg-neutral-surface border border-neutral-border p-8 rounded-4xl flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 ring-4 ring-primary-main/5">
                  <div className="w-full h-full flex items-center justify-center bg-primary-main/10 text-primary-main">
                    <Users size={32} />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <h4 className="text-2xl font-black text-primary-main">
                      Hosted by Alexandria
                    </h4>
                    <span className="bg-primary-main text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      Superhost
                    </span>
                  </div>
                  <p className="text-neutral-text-secondary font-medium mb-4">
                    Member since Oct 2023 • 150+ successful rentals
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-primary-main">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span>Identity Verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-primary-main">
                      <Star size={16} className="text-yellow-500" />
                      <span>4.9 Rating</span>
                    </div>
                  </div>
                </div>
                <button className="bg-neutral-surface border border-neutral-border px-8 py-3 rounded-2xl font-bold hover:bg-white hover:border-primary-main transition-all">
                  Contact Host
                </button>
              </div>

              {/* Included in Price */}
              <div className="bg-primary-main/5 p-8 rounded-4xl border border-primary-main/10">
                <h3 className="text-xl font-black text-primary-main mb-6 uppercase tracking-wider">
                  Included in price
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Standard Insurance",
                      desc: "Covers third-party liability and basic collision.",
                    },
                    {
                      title: "Unlimited Mileage",
                      desc: "No extra charges for long distance travel.",
                    },
                    {
                      title: "24/7 Road Assistance",
                      desc: "Help is always just a phone call away.",
                    },
                    {
                      title: "Airport Pickup",
                      desc: "Free pickup/dropoff at JNIA (DAR).",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 size={14} className="text-green-500" />
                      </div>
                      <div>
                        <h5 className="font-bold text-primary-main">
                          {item.title}
                        </h5>
                        <p className="text-sm text-neutral-text-secondary mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:block" ref={sidebarRef}>
              <BookingSidebar
                pricePerDay={car.price_per_day}
                carId={car.id}
                make={car.make}
                model={car.model}
                imageUrl={
                  car.car_images?.find((img) => img.is_primary)?.url ||
                  car.car_images?.[0]?.url
                }
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Sticky Bottom Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-surface p-4 shadow-[0_-4px_30px_rgba(0,0,0,0.15)] z-50 transition-transform duration-300 lg:hidden rounded-t-3xl border-t border-neutral-border/50 ${
          isSidebarVisible
            ? "translate-y-full pointer-events-none"
            : "translate-y-0"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-neutral-text-secondary uppercase tracking-wider">
              Total per day
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-primary-main font-bold">TZS</span>
              <span className="text-xl font-black text-primary-main">
                {formatPrice(car.price_per_day)}
              </span>
            </div>
          </div>
          <button
            onClick={scrollToBooking}
            className="bg-primary-main text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-main/20 hover:bg-primary-dark transition-all active:scale-95"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
