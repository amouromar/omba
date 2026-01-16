"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Calendar, MapPin, ShieldCheck, CreditCard, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Location {
  id: string;
  name: string;
  type: string;
}

interface BookingSidebarProps {
  pricePerDay: number;
  carId: string;
  make: string;
  model: string;
  imageUrl?: string;
}

const BookingSidebar: React.FC<BookingSidebarProps> = ({
  pricePerDay,
  carId,
  make,
  model,
  imageUrl,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Dates
  const [pickUpDate, setPickUpDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data } = await supabase
        .from("locations")
        .select("*")
        .order("name");
      if (data) setLocations(data);
      setLoadingLocations(false);
    };
    fetchLocations();
  }, []);

  const days = useMemo(() => {
    if (pickUpDate && returnDate) {
      const start = new Date(pickUpDate);
      const end = new Date(returnDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 3;
    }
    return 3;
  }, [pickUpDate, returnDate]);

  const priceInTZS = pricePerDay * 2500;
  const totalPrice = priceInTZS * days;
  const insurance = 15000;
  const grandTotal = totalPrice + insurance;

  const handleBooking = async () => {
    if (!pickUpDate || !returnDate) {
      alert("Please select pick-up and return dates.");
      return;
    }

    setIsBooking(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carId,
          carMake: make,
          carModel: model,
          totalAmount: grandTotal, // Passing the calculated TZS amount
          startDate: pickUpDate,
          endDate: returnDate,
          days,
          imageUrl,
          pricePerDay: pricePerDay, // USD base for reference if needed
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Booking failed: " + (data.error || "Unknown error"));
        setIsBooking(false);
      }
    } catch (error) {
      console.error("Booking Error:", error);
      alert("An error occurred. Please try again.");
      setIsBooking(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "decimal",
    }).format(price);
  };

  return (
    <div className="bg-white dark:bg-neutral-surface border border-neutral-border p-6 rounded-3xl sticky top-28 shadow-xl shadow-primary-main/5">
      <div className="flex items-end gap-2 mb-6">
        <h3 className="text-3xl font-black text-primary-main">
          TZS {formatPrice(priceInTZS)}
        </h3>
        <span className="text-neutral-text-secondary font-medium mb-1.5">
          / day
        </span>
      </div>

      <div className="space-y-4 mb-6">
        {/* Pick-up Location */}
        <div className="space-y-2">
          <label className="text-xs font-black text-primary-main uppercase tracking-widest">
            Pick-up Location
          </label>
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text-secondary"
            />
            <select className="w-full bg-neutral-surface dark:bg-neutral-bg border border-neutral-border rounded-xl pl-12 pr-4 py-3 appearance-none font-bold text-neutral-text-primary focus:outline-none focus:border-secondary-main transition-colors">
              {loadingLocations ? (
                <option>Loading locations...</option>
              ) : (
                <>
                  <optgroup label="Airports">
                    {locations
                      .filter((l) => l.type === "airport")
                      .map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="City / Other">
                    {locations
                      .filter((l) => l.type !== "airport")
                      .map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                  </optgroup>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Dates Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Pickup Date */}
          <div className="space-y-2">
            <label className="text-xs font-black text-primary-main uppercase tracking-widest">
              Pick-up
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text-secondary"
              />
              <input
                type="date"
                className="w-full bg-neutral-surface dark:bg-neutral-bg border border-neutral-border rounded-xl pl-12 pr-4 py-3 font-bold text-neutral-text-primary focus:outline-none focus:border-secondary-main transition-colors text-sm"
                value={pickUpDate}
                onChange={(e) => setPickUpDate(e.target.value)}
              />
            </div>
          </div>

          {/* Return Date */}
          <div className="space-y-2">
            <label className="text-xs font-black text-primary-main uppercase tracking-widest">
              Return
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text-secondary"
              />
              <input
                type="date"
                className="w-full bg-neutral-surface dark:bg-neutral-bg border border-neutral-border rounded-xl pl-12 pr-4 py-3 font-bold text-neutral-text-primary focus:outline-none focus:border-secondary-main transition-colors text-sm"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-8 pt-6 border-t border-neutral-border border-dashed">
        <div className="flex justify-between items-center text-sm font-medium text-neutral-text-secondary">
          <span>
            {formatPrice(priceInTZS)} x {days} days
          </span>
          <span>TZS {formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between items-center text-sm font-medium text-neutral-text-secondary">
          <div className="flex items-center gap-1">
            <span>Full Insurance</span>
            <Info size={14} className="text-neutral-text-disabled" />
          </div>
          <span>TZS {formatPrice(insurance)}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-black text-primary-main pt-3 border-t border-neutral-border">
          <span>Total</span>
          <span>TZS {formatPrice(grandTotal)}</span>
        </div>
      </div>

      <button
        onClick={handleBooking}
        disabled={isBooking}
        className="w-full bg-secondary-main text-primary-main py-4 rounded-xl font-black text-lg hover:bg-secondary-dark hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isBooking ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-main border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          "Book Now"
        )}
      </button>

      <p className="text-center text-xs text-neutral-text-disabled mt-4 font-medium">
        You won't be charged yet
      </p>

      <div className="space-y-3 mt-6">
        <div className="flex items-center gap-3 text-xs font-bold text-neutral-text-secondary">
          <ShieldCheck size={18} className="text-green-500" />
          <span>No hidden fees. Cancellation is free 24h before.</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-neutral-text-secondary">
          <CreditCard size={18} className="text-secondary-main" />
          <span>Secure payments via Cards, M-Pesa or Cash.</span>
        </div>
      </div>
    </div>
  );
};

export default BookingSidebar;
