"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  MapPin,
  Phone,
  ArrowUp,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white pt-24 pb-12 relative overflow-hidden">
      {/* Wave Pattern Overlay */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-secondary-main/30 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-12 h-12 bg-white rounded-xl p-1">
                <Image
                  src="/logo.png"
                  alt="OMBA Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter">OMBA</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Tanzania&apos;s most reliable car rental service. Connecting Dar
              es Salaam, Zanzibar, Arusha and beyond with premium mobility.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary-main transition-colors"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-8 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-secondary-main" /> Quick Links
            </h4>
            <ul className="space-y-4 text-white/70">
              {[
                { label: "Browse Cars", href: "/cars" },
                { label: "Our Services", href: "/#services" },
                { label: "Booking Guide", href: "/#how-it-works" },
                { label: "Contact Us", href: "/#contact" },
                { label: "FAQs", href: "/#faqs" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-secondary-main transition-colors flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1 h-1 rounded-full bg-secondary-main scale-0 group-hover:scale-100 transition-transform" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div id="contact">
            <h4 className="text-lg font-bold mb-8 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-secondary-main" /> Contact Us
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-lg text-secondary-main">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">
                    Office
                  </p>
                  <Link
                    href="https://maps.app.goo.gl/tn1CNHGKebiEiEfJ8"
                    target="_blank"
                    className="text-sm text-white/80"
                  >
                    Mazimbu
                    <br />
                    Morogoro, Tanzania
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-lg text-secondary-main">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">
                    Hotline
                  </p>
                  <Link
                    href="tel:+255759626308"
                    className="text-sm text-white/80"
                  >
                    +255 759 626 308
                  </Link>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <h4 className="text-xl font-bold mb-4">Book via WhatsApp</h4>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              Need a quick quote? Talk to our travel experts directly on
              WhatsApp.
            </p>
            <Link
              href="https://wa.me/+255759626308"
              className="bg-[#25D366] text-white w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#128C7E] transition-all"
            >
              <MessageCircle size={24} />
              Chat Support
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/40 text-xs text-center md:text-left">
            © {new Date().getFullYear()} OMBA Car Rental (made by Amour Omar).
            All rights reserved. <br className="md:hidden" />
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>{" "}
            |{" "}
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-primary-dark transition-all"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
