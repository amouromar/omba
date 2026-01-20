"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, MessageCircle, LogIn } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { UserButton, useAuth } from "@clerk/nextjs";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useAuth();

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
          ? "bg-white/80 dark:bg-neutral-surface backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-32 h-12 md:w-32 md:h-12">
              <Image
                src="/logo.svg"
                alt="OMBA Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-secondary-main ${
                  scrolled
                    ? "text-neutral-text-primary"
                    : "text-white/90 dark:text-primary-main"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-4 py-2 rounded-full border transition-colors hover:border-primary-main ${
                    scrolled
                      ? "border-primary-main dark:border-neutral-border text-primary-main"
                      : "border-white/20 dark:border-neutral-border text-white dark:text-primary-main"
                  }`}
                >
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`px-4 py-2 rounded-full border transition-colors hover:border-primary-main flex items-center gap-2 ${
                    scrolled
                      ? "border-primary-main dark:border-neutral-border text-primary-main"
                      : "border-white/20 dark:border-neutral-border text-white dark:text-primary-main"
                  }`}
                >
                  <LogIn size={18} />
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-primary-main text-white px-4 py-2 rounded-full font-bold hover:bg-primary-dark transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}

            <ThemeToggle />
            <Link
              href="https://wa.me/+255759626308"
              className="bg-[#25D366] text-white px-4 py-2 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#12695f] transition-all"
            >
              <MessageCircle size={20} className="text-white" />
              <span>Chat</span>
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
                  scrolled
                    ? "text-primary-main dark:text-neutral-text-primary"
                    : "text-white dark:text-primary-main"
                }
              />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed h-screen  inset-0 z-105 bg-primary-main dark:bg-primary-dark backdrop-blur-xl transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-start h-full gap-8 pt-20 mx-12 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-semibold text-black dark:text-white hover:text-secondary-main transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="flex flex-col w-full max-w-xs gap-4">
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-secondary-main text-white py-4 rounded-full text-md font-bold shadow-xl"
                >
                  Dashboard
                </Link>
                <div className="flex justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-12 h-12",
                      },
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-full border border-white/20 text-white font-semibold flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-secondary-main text-white py-4 rounded-full text-md font-bold shadow-xl"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="absolute bottom-8 flex w-full items-center gap-48">
            <ThemeToggle />
            <Link
              href="https://wa.me/+255759626308"
              className="bg-[#25D366] text-white px-4 py-2 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#12695f] transition-all"
            >
              <MessageCircle size={20} className="text-white" />
              <span>Chat</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
