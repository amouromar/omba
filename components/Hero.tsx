import React from "react";
import { ShieldCheck, Clock, Tag } from "lucide-react";
import QuickSearch from "./QuickSearch";

const Hero = () => {
  return (
    <section className="relative w-full h-screen md:h-screen flex items-center overflow-hidden">
      {/* Background with Overlay 
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
      </div>*/}

      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-0">
        <div className="max-w-3xl mx-auto">
          {/* Headline */}
          <h1 className="text-4xl text-center md:text-7xl font-extrabold text-primary-main dark:text-primary-main leading-[1.1] mb-16 animate-fade-in-up delay-100">
            Premium Car Rental in{" "}
            <span className="text-secondary-main">Tanzania</span>
          </h1>

          <div className="mt-12 mb-8">
            <QuickSearch />
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-16 animate-fade-in-up delay-400">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-2 md:p-3 bg-white/10 rounded-lg">
                <ShieldCheck className="text-secondary-main" size={24} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-primary-main dark:text-primary-main font-bold text-sm md:text-lg">
                  100% Insured
                </p>
                <p className="hidden md:block text-primary-main dark:text-primary-main md:text-sm">
                  Full protection
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 border-x border-primary-main dark:border-primary-main px-4 md:px-8">
              <div className="p-2 md:p-3 bg-white/10 rounded-lg">
                <Clock className="text-secondary-main" size={24} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-primary-main dark:text-primary-main font-bold whitespace-nowrap text-sm md:text-lg">
                  24/7 Support
                </p>
                <p className="hidden md:block text-primary-main dark:text-primary-main md:text-sm">
                  Always available
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-2 md:p-3 bg-white/10 rounded-lg">
                <Tag className="text-secondary-main" size={24} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-primary-main dark:text-primary-main font-bold whitespace-nowrap text-sm md:text-lg">
                  Best Prices
                </p>
                <p className="hidden md:block text-primary-main dark:text-primary-main md:text-sm">
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
