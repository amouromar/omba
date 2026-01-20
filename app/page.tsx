import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCars from "@/components/FeaturedCars";
import InfoSections from "@/components/InfoSections";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL("https://omba-silk.vercel.app/"),
  title: "OMBA Car Rental | Premium Car Hire Dar es Salaam & Tanzania",
  description:
    "Book premium SUVs, 4x4s, and economy cars with OMBA. Reliable airport pickups in Dar es Salaam, Zanzibar, and Arusha. Best prices, no hidden fees.",
  keywords:
    "car rental tanzania, car hire dar es salaam, rent a car zanzibar, 4x4 rental tanzania, safari car hire",
  openGraph: {
    title: "OMBA Car Rental | Premium Mobility in Tanzania",
    description:
      "Explore Tanzania with comfort. Premium fleet, 24/7 support, and flexible delivery.",
    images: ["/hero-car.png"],
    type: "website",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CarRentalBusiness",
    name: "OMBA Car Rental",
    image: "https://omba-rental.com/logo.png",
    "@id": "https://omba-rental.com",
    url: "https://omba-rental.com",
    telephone: "+255759626308",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kihonda",
      addressLocality: "Morogoro",
      addressRegion: "Morogoro",
      postalCode: "00000",
      addressCountry: "TZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -6.8161,
      longitude: 39.2783,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Resource Hints */}
      <link rel="preload" href="/hero-car.png" as="image" />

      <main className="min-h-screen">
        <Navbar />

        <Hero />

        <div className="relative">
          <FeaturedCars />
        </div>

        <InfoSections />

        <Footer />
      </main>
    </>
  );
}
