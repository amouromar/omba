import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Plus, Image as ImageIcon, Edit, Trash2 } from "lucide-react";

export default async function AdminCarsPage() {
  const { data: cars, error } = await supabase
    .from("cars")
    .select(
      `
      *,
      categories (name)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading cars: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cars</h1>
          <p className="text-muted-foreground">
            Manage your fleet and upload vehicle photos.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity">
          <Plus size={18} />
          Add New Car
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Transmission</th>
              <th className="px-6 py-4">Price/Day</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {cars?.map((car) => (
              <tr key={car.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold">
                    {car.make} {car.model}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {car.year} • {car.vin}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {car.categories?.name}
                  </span>
                </td>
                <td className="px-6 py-4">{car.transmission}</td>
                <td className="px-6 py-4">${car.price_per_day}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center h-2 w-2 rounded-full mr-2 ${
                      car.is_available ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  {car.is_available ? "Available" : "Rented"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/cars/${car.id}/photos`}
                      className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors"
                      title="Manage Photos"
                    >
                      <ImageIcon size={18} />
                    </Link>
                    <button className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
