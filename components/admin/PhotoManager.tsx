"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";

type PhotoType =
  | "interior"
  | "exterior"
  | "dashboard"
  | "cargo"
  | "speedometer";

interface CarImage {
  id: string;
  url: string;
  type: PhotoType;
}

const PHOTO_CATEGORIES: { type: PhotoType; label: string; count: number }[] = [
  { type: "exterior", label: "Exterior", count: 2 },
  { type: "interior", label: "Interior", count: 2 },
  { type: "dashboard", label: "Dashboard", count: 2 },
  { type: "cargo", label: "Cargo Space", count: 2 },
  { type: "speedometer", label: "Speedometer", count: 2 },
];

export default function PhotoManager({
  carId,
}: {
  carId: string;
  carName: string;
}) {
  const [images, setImages] = useState<CarImage[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function getImages() {
      const { data } = await supabase
        .from("car_images")
        .select("*")
        .eq("car_id", carId);

      if (active && data) {
        setImages(data as CarImage[]);
        setLoading(false);
      }
    }

    getImages();
    return () => {
      active = false;
    };
  }, [carId]);

  // Stable handler for refreshing data after mutations
  const refreshImages = useCallback(async () => {
    const { data } = await supabase
      .from("car_images")
      .select("*")
      .eq("car_id", carId);

    if (data) setImages(data as CarImage[]);
  }, [carId]);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, type: PhotoType) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(type);

      // 1. Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${carId}/${type}_${Date.now()}.${fileExt}`;
      const filePath = `cars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("car-photos")
        .upload(filePath, file);

      if (uploadError) {
        alert("Error uploading image: " + uploadError.message);
        setUploading(null);
        return;
      }

      // 2. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("car-photos").getPublicUrl(filePath);

      // 3. Save to Database
      const { error: dbError } = await supabase.from("car_images").insert({
        car_id: carId,
        url: publicUrl,
        type,
        is_primary:
          type === "exterior" &&
          images.filter((img) => img.type === "exterior").length === 0,
      });

      if (dbError) {
        alert("Error saving record: " + dbError.message);
      } else {
        refreshImages();
      }

      setUploading(null);
    },
    [carId, refreshImages, images],
  );

  const handleDelete = useCallback(
    async (imageId: string, url: string) => {
      if (!confirm("Are you sure you want to delete this photo?")) return;

      // 1. Delete from database
      const { error: dbError } = await supabase
        .from("car_images")
        .delete()
        .eq("id", imageId);

      if (dbError) {
        alert("Error deleting record: " + dbError.message);
        return;
      }

      // 2. Delete from storage (parsing path from URL)
      const path = url.split("car-photos/")[1];
      if (path) {
        await supabase.storage.from("car-photos").remove([path]);
      }

      refreshImages();
    },
    [refreshImages],
  );

  if (loading && images.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {PHOTO_CATEGORIES.map((cat) => {
        const catImages = images.filter((img) => img.type === cat.type);
        const isFull = catImages.length >= cat.count;

        return (
          <div key={cat.type} className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-xl font-semibold capitalize">
                {cat.label}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({catImages.length}/{cat.count})
                </span>
              </h3>
              {isFull && <CheckCircle2 className="text-green-500" size={20} />}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {catImages.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-lg overflow-hidden border bg-muted group"
                >
                  <Image
                    src={img.url}
                    alt={cat.label}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => handleDelete(img.id, img.url)}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {!isFull && (
                <label className="relative aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleUpload(e, cat.type)}
                    disabled={!!uploading}
                  />
                  {uploading === cat.type ? (
                    <Loader2 className="animate-spin text-primary" />
                  ) : (
                    <>
                      <Upload className="text-muted-foreground mb-2" />
                      <span className="text-xs font-medium text-muted-foreground">
                        Upload Photo
                      </span>
                    </>
                  )}
                </label>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
