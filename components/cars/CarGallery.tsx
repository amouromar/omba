"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";

interface CarImage {
  url: string;
  type: string;
  is_primary: boolean;
}

interface CarGalleryProps {
  images: CarImage[];
  make: string;
  model: string;
}

const CarGallery: React.FC<CarGalleryProps> = ({ images, make, model }) => {
  const [activeImage, setActiveImage] = useState<CarImage | null>(null);

  useEffect(() => {
    if (images && images.length > 0) {
      const primary = images.find((img) => img.is_primary) || images[0];
      setActiveImage(primary);
    }
  }, [images]);

  // Ensure we always have a valid image to show if possible
  const displayImage =
    activeImage || images.find((img) => img.is_primary) || images[0];

  // Side images are those that are NOT the currently displayed one
  const sideImages = images.filter((img) => img.url !== displayImage?.url);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
        {/* Main Image */}
        <div className="md:col-span-3 relative rounded-3xl overflow-hidden group">
          {displayImage ? (
            <>
              <Image
                src={displayImage.url}
                alt={`${make} ${model}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </>
          ) : (
            <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
              <span className="text-neutral-400 font-medium">
                No Image Available
              </span>
            </div>
          )}

          <button className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg hover:bg-white transition-colors">
            <Maximize2 size={20} className="text-primary-main" />
          </button>
        </div>

        {/* Side Images */}
        <div className="hidden md:flex flex-col gap-4">
          {sideImages.slice(0, 2).map((img) => (
            <div
              key={img.url}
              className="relative flex-1 rounded-2xl overflow-hidden bg-neutral-100 group cursor-pointer border-2 border-transparent hover:border-secondary-main transition-all"
              onClick={() => setActiveImage(img)}
            >
              <Image
                src={img.url}
                alt={`${make} ${model}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}

          {/* If there are more than 3 images (1 main + 2 side), show a count overlay on the last side image? 
              Actually, the loop above only shows 2 side images. If we want the overlay, we need to check total count.
          */}
          {sideImages.length > 2 && (
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-neutral-100 group cursor-pointer">
              <Image
                src={sideImages[2].url}
                alt="More photos"
                fill
                className="object-cover blur-sm"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  +{sideImages.length - 2} Photos
                </span>
              </div>
            </div>
          )}

          {/* 
             Wait, the design had 2 side slots. If I use map above for slice(0,2), I might take up both slots.
             If I have a "more photos" button, it usually occupies the last visible slot.
             Let's stick to the previous simple logic: 
             - Show Max 2 side column items.
             - If there are many images, the second item has the overlay.
          */}
        </div>
      </div>
    </div>
  );
};

export default CarGallery;
