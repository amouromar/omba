"use client";

import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

const BookingSuccessPage = () => {
  // const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: NodeJS.Timeout = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-surface px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>

        <h1 className="text-4xl font-black text-primary-main">
          Booking Confirmed!
        </h1>
        <p className="text-neutral-text-secondary text-lg">
          Thank you for your booking. We have sent a confirmation email with all
          the details.
        </p>

        <div className="pt-8 space-y-4">
          <Link
            href="/cars"
            className="block w-full bg-primary-main text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-all"
          >
            Browse More Cars
          </Link>
          <Link
            href="/"
            className="block w-full bg-white border border-neutral-border text-neutral-text-secondary py-4 rounded-xl font-bold hover:border-primary-main transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
