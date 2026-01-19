import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Clock, Tag, ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full h-[90vh] md:h-screen flex items-center overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-car.png"
          alt="Premium SUV driving in Dar es Salaam"
          fill
          className="object-cover object-center scale-105 animate-slow-zoom"
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+Z9PQAI8QM286S86AAAAABJRU5ErkJggg=="
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary-dark/80 via-primary-dark/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full mb-6 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-secondary-main animate-pulse" />
            <span className="text-white text-xs md:text-sm font-medium uppercase tracking-wider">
              Premium Car Rental in Tanzania
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6 animate-fade-in-up delay-100">
            Explore <span className="text-secondary-main">Tanzania</span> <br />
            With Ultimate Comfort
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl animate-fade-in-up delay-200">
            From the bustling streets of Dar es Salaam to the wild savannas.
            Reliable, safe, and premium vehicles for business and leisure.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-300">
            <Link
              href="/cars"
              className="w-full sm:w-auto bg-secondary-main text-white px-8 py-4 rounded-xl text-lg font-bold shadow-2xl shadow-orange-500/30 hover:bg-secondary-dark transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Find Your Car
              <ChevronRight size={20} />
            </Link>
            <Link
              href="/cars"
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/20 transition-all text-center"
            >
              View All Cars
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 animate-fade-in-up delay-400">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-2 md:p-3 bg-white/10 rounded-lg">
                <ShieldCheck className="text-secondary-main" size={24} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-white font-bold text-sm md:text-lg">
                  100% Insured
                </p>
                <p className="hidden md:block text-white/60 md:text-sm">
                  Full protection
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 border-x border-white/10 px-4 md:px-8">
              <div className="p-2 md:p-3 bg-white/10 rounded-lg">
                <Clock className="text-secondary-main" size={24} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-white font-bold whitespace-nowrap text-sm md:text-lg">
                  24/7 Support
                </p>
                <p className="hidden md:block text-white/60 md:text-sm">
                  Always available
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-2 md:p-3 bg-white/10 rounded-lg">
                <Tag className="text-secondary-main" size={24} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-white font-bold whitespace-nowrap text-sm md:text-lg">
                  Best Prices
                </p>
                <p className="hidden md:block text-white/60 md:text-sm">
                  No hidden fees
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
