import { supabase } from "@/lib/supabase";
import PhotoManager from "@/components/admin/PhotoManager";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function CarPhotosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: car, error } = await supabase
    .from("cars")
    .select("*, categories(name)")
    .eq("id", id)
    .single();

  if (error || !car) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/cars"
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Photos</h1>
          <p className="text-muted-foreground">
            {car.make} {car.model} ({car.year}) • {car.categories?.name}
          </p>
        </div>
      </div>

      <div className="p-6 rounded-xl border bg-card shadow-sm">
        <PhotoManager carId={id} carName={`${car.make} ${car.model}`} />
      </div>
    </div>
  );
}
