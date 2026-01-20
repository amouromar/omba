export interface Profile {
  clerk_id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  national_id_number: string | null;
  national_id_photo_url: string | null;
  driver_license_number: string | null;
  driver_license_photo_url: string | null;
  location: string | null;
  house_number: string | null;
  selfie_url: string | null;
  is_verified: boolean;
  role: "USER" | "ADMIN";
  updated_at: string | null;
  created_at: string | null;
}

export interface Car {
  id: string;
  name: string;
  image: string;
  location?: string;
  fuel_type?: string;
  seats?: number;
}

export interface Booking {
  id: string;
  carId: string;
  date: string;
  user_id?: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}
