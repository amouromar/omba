import React from "react";
import {
  ShieldCheck,
  Zap,
  Globe,
  MessageSquare,
  Car,
  CalendarCheck,
  CreditCard,
  Key,
  MapPin,
  Star,
} from "lucide-react";

const InfoSections = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Why Choose Us */}
      <section id="services" className="py-24 bg-neutral-surface">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-primary-main mb-4">
              Why Choose <span className="text-secondary-main">OMBA</span>?
            </h2>
            <p className="text-neutral-text-secondary text-lg max-w-2xl mx-auto">
              Experience the best car rental service in Tanzania with
              transparent pricing and premium support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ShieldCheck size={32} />,
                title: "No Hidden Fees",
                desc: "What you see is what you pay. Full transparency on all contracts.",
              },
              {
                icon: <Zap size={32} />,
                title: "Newest Vehicles",
                desc: "Our fleet is regularly updated with the latest models for your safety.",
              },
              {
                icon: <Globe size={32} />,
                title: "Flexible Delivery",
                desc: "Pick up or get your car delivered to any major city or airport.",
              },
              {
                icon: <MessageSquare size={32} />,
                title: "Local Support",
                desc: "24/7 assistance available in Swahili and English across Tanzania.",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="bg-white dark:bg-neutral-surface p-8 rounded-3xl border border-neutral-border hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 bg-primary-main/5 rounded-2xl flex items-center justify-center text-primary-main group-hover:bg-primary-main group-hover:text-white transition-all mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-primary-main mb-3">
                  {benefit.title}
                </h3>
                <p className="text-neutral-text-secondary text-sm leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white dark:bg-neutral-surface">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-primary-main mb-4">
              Simple <span className="text-secondary-main">4-Step</span> Booking
            </h2>
            <p className="text-neutral-text-secondary text-lg max-w-2xl mx-auto">
              Get on the road in minutes with our streamlined rental process.
            </p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-neutral-border z-0" />

            {[
              {
                icon: <Car />,
                step: "01",
                title: "Choose Car",
                desc: "Select from our premium fleet of SUVs, Sedans or Economy cars.",
              },
              {
                icon: <CalendarCheck />,
                step: "02",
                title: "Select Date",
                desc: "Pick your dates and preferred pick-up/drop-off locations.",
              },
              {
                icon: <CreditCard />,
                step: "03",
                title: "Easy Payment",
                desc: "Secure your booking via mobile money or credit card.",
              },
              {
                icon: <Key />,
                step: "04",
                title: "Enjoy Drive",
                desc: "Get your keys and start your journey across beautiful Tanzania.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 bg-white dark:bg-neutral-surface border-2 border-neutral-border rounded-full flex items-center justify-center text-primary-main group-hover:border-primary-main group-hover:text-primary-main transition-all mb-6 relative">
                  {React.cloneElement(
                    item.icon as React.ReactElement<{ size: number }>,
                    {
                      size: 32,
                    },
                  )}
                </div>
                <h3 className="text-xl font-bold text-primary-main mb-3">
                  {item.title}
                </h3>
                <p className="text-neutral-text-secondary text-sm leading-relaxed px-4">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-neutral-surface relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-main/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-main/5 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-primary-main mb-4">
              What Our <span className="text-secondary-main">Clients</span> Say
            </h2>
            <div className="flex justify-center gap-1 text-secondary-main mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah J.",
                role: "Tourist",
                quote:
                  "The Land Cruiser was in perfect condition. We explored the Serengeti with zero issues. Highly recommend OMBA!",
              },
              {
                name: "Michael K.",
                role: "Business Traveler",
                quote:
                  "Effortless airport pickup at JNIA. The sedan was clean and the support team was very responsive.",
              },
              {
                name: "David L.",
                role: "Expat",
                quote:
                  "Best prices in Dar. I have been renting from them for months and the service is always top-notch.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white dark:bg-neutral-surface p-8 rounded-3xl shadow-sm border border-neutral-border flex flex-col h-full hover:shadow-xl transition-shadow"
              >
                <p className="text-neutral-text-secondary italic mb-8 grow">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-surface rounded-full flex items-center justify-center text-primary-main font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-main">{t.name}</h4>
                    <p className="text-xs text-neutral-text-disabled uppercase font-bold tracking-widest">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section
        id="locations"
        className="py-24 bg-white dark:bg-neutral-surface"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-primary-main mb-6">
                Available Across <br />
                <span className="text-secondary-main">Tanzania</span>
              </h2>
              <p className="text-neutral-text-secondary text-lg mb-10">
                With hubs in every major city and terminal, we ensure you have
                access to quality transportation wherever your journey begins.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { name: "Dar es Salaam", area: "City Center & JNIA" },
                  { name: "Zanzibar", area: "Stone Town & Airport" },
                  { name: "Arusha", area: "KIA & City" },
                  { name: "Mwanza", area: "Rock City & Airport" },
                ].map((loc, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-surface dark:bg-neutral-surface border border-neutral-border"
                  >
                    <MapPin
                      className="text-secondary-main shrink-0"
                      size={24}
                    />
                    <div>
                      <h4 className="font-bold text-primary-main">
                        {loc.name}
                      </h4>
                      <p className="text-sm text-neutral-text-secondary">
                        {loc.area}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[400px] bg-neutral-surface dark:bg-neutral-surface rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-neutral-border">
              {/* Dynamic Map Placeholder - Using SVG Pattern */}
              <div className="absolute inset-0 bg-neutral-surface dark:bg-neutral-surface flex items-center justify-center">
                <div className="text-neutral-text-disabled opacity-30 text-center">
                  <Globe size={120} className="mx-auto mb-4" />
                  <p className="font-bold uppercase tracking-[0.2em]">
                    Live Map View
                  </p>
                </div>
                {/* Simulated markers */}
                <div className="absolute top-1/4 left-1/3 w-4 h-4 rounded-full bg-secondary-main animate-ping" />
                <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-secondary-main shadow-lg" />
                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-primary-main shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InfoSections;
