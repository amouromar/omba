"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Cars", href: "/cars" },
    { name: "Services", href: "#services" },
    { name: "Locations", href: "#locations" },
    { name: "About", href: "#about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-primary-dark/80 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image
                src="/logo.svg"
                alt="OMBA Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* <span
              className={`text-xl md:text-2xl font-bold tracking-tight transition-colors ${
                scrolled ? "text-primary-main dark:text-white" : "text-white dark:text-primary-main"
              }`}
            >
              OMBA
            </span> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-secondary-main ${
                  scrolled
                    ? "text-neutral-text-primary dark:text-white/90"
                    : "text-white/90"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="tel:+255"
              className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                scrolled
                  ? "text-neutral-text-primary dark:text-white"
                  : "text-white"
              }`}
            >
              <Phone size={16} className="text-secondary-main" />
              <span>+255 700 000 000</span>
            </Link>
            <Link
              href="/login"
              className={`p-2 rounded-full border transition-colors hover:bg-secondary-main hover:border-secondary-main ${
                scrolled
                  ? "border-primary-main text-primary-main dark:border-white/20 dark:text-white"
                  : "border-white/20 text-white"
              }`}
            >
              <User size={20} />
            </Link>
            <ThemeToggle />
            <Link
              href="/cars"
              className="bg-secondary-main text-white px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-secondary-dark transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 z-110 relative"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={28} className="absolute top-0 right-4 text-white" />
            ) : (
              <Menu
                size={28}
                className={
                  scrolled ? "text-primary-main dark:text-white" : "text-white"
                }
              />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed h-screen  inset-0 z-105 bg-primary-dark/98 backdrop-blur-xl transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 p-6 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-semibold text-white hover:text-secondary-main transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/cars"
            onClick={() => setIsOpen(false)}
            className="w-full max-w-xs bg-secondary-main text-white py-4 rounded-xl text-xl font-bold shadow-xl"
          >
            Find Your Car
          </Link>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link
              href="tel:+255"
              className="flex items-center gap-3 text-white/80 text-lg"
            >
              <Phone size={20} className="text-secondary-main" />
              <span>+255 700 000 000</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
