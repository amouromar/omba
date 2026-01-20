"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { useSupabaseClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/Button";
import { Camera, Calendar, CreditCard, Upload } from "lucide-react";
import { Profile } from "@/types";

export const VerificationForm = ({
  initialData,
}: {
  initialData: Profile | null;
}) => {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || "",
    phone_number: initialData?.phone_number || "",
    email: initialData?.email || "",
    national_id_number: initialData?.national_id_number || "",
    driver_license_number: initialData?.driver_license_number || "",
    location: initialData?.location || "",
    house_number: initialData?.house_number || "",
  });

  const [files, setFiles] = useState<{
    national_id: File | null;
    driver_license: File | null;
    selfie: File | null;
  }>({
    national_id: null,
    driver_license: null,
    selfie: null,
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof typeof files,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [type]: e.target.files[0] });
    }
  };

  const uploadFile = async (file: File, path: string) => {
    if (!user) throw new Error("User not authenticated");

    console.log("📁 [Storage Upload] Starting upload for:", path);
    console.log("👤 [Storage Upload] User ID:", user.id);
    console.log("📄 [Storage Upload] File:", file.name, "Size:", file.size);

    // Check if we can get a token before attempting upload
    const testToken = await getToken({ template: "supabase" });
    console.log("🔑 [Storage Upload] JWT Token available:", !!testToken);
    if (testToken) {
      console.log(
        "🔍 [Storage Upload] Token preview:",
        testToken.substring(0, 50) + "...",
      );
      try {
        const payload = JSON.parse(atob(testToken.split(".")[1]));
        console.log("👤 [Storage Upload] Token Payload:", payload);
        console.log("🆔 [Storage Upload] Token sub:", payload.sub);
        console.log("🆔 [Storage Upload] User ID:", user.id);
        console.log("🔍 [Storage Upload] Match?", payload.sub === user.id);
      } catch (e) {
        console.error("❌ [Storage Upload] Failed to decode token:", e);
      }
    } else {
      console.error("⚠️ [Storage Upload] NO TOKEN FOUND!");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${path}-${Math.random()}.${fileExt}`;

    console.log("🗂️ [Storage Upload] Full path:", fileName);
    console.log("🪣 [Storage Upload] Bucket: user-documents");

    const { data, error } = await supabase.storage
      .from("user-documents")
      .upload(fileName, file, {
        headers: {
          Authorization: `Bearer ${testToken}`,
        },
      });

    console.log("📊 [Storage Upload] Response data:", data);
    console.log("📊 [Storage Upload] Response error:", error);

    if (error) {
      console.error("❌ [Storage Upload] Upload failed:", error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("user-documents")
      .getPublicUrl(fileName);

    console.log("🔗 [Storage Upload] Public URL:", urlData.publicUrl);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("📋 [Verification Form] Form submission started");
    console.log("👤 [User Info] Clerk User:", user);
    console.log("🆔 [User Info] Clerk User ID:", user?.id);

    if (!user) {
      console.error("❌ [Auth] No user found - not signed in");
      setError("You must be signed in to submit verification");
      setLoading(false);
      return;
    }

    try {
      console.log("📸 [Files] Uploading files...");
      let national_id_photo_url = initialData?.national_id_photo_url;
      let driver_license_photo_url = initialData?.driver_license_photo_url;
      let selfie_url = initialData?.selfie_url;

      if (files.national_id) {
        console.log("📤 [Upload] Uploading national ID...");
        national_id_photo_url = await uploadFile(
          files.national_id,
          "national-id",
        );
        console.log("✅ [Upload] National ID uploaded:", national_id_photo_url);
      }
      if (files.driver_license) {
        console.log("📤 [Upload] Uploading driver license...");
        driver_license_photo_url = await uploadFile(
          files.driver_license,
          "driver-license",
        );
        console.log(
          "✅ [Upload] Driver license uploaded:",
          driver_license_photo_url,
        );
      }
      if (files.selfie) {
        console.log("📤 [Upload] Uploading selfie...");
        selfie_url = await uploadFile(files.selfie, "selfie");
        console.log("✅ [Upload] Selfie uploaded:", selfie_url);
      }

      const updateData = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        national_id_number: formData.national_id_number,
        driver_license_number: formData.driver_license_number,
        location: formData.location,
        house_number: formData.house_number,
        national_id_photo_url,
        driver_license_photo_url,
        selfie_url,
        updated_at: new Date().toISOString(),
      };

      console.log("💾 [Database] Updating profile with data:", updateData);
      console.log("🔍 [Database] Filtering by clerk_id:", user.id);

      const { data, error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("clerk_id", user.id)
        .select();

      console.log("📊 [Database] Update response data:", data);
      console.log("📊 [Database] Update response error:", updateError);

      if (updateError) {
        console.error("❌ [Database Error]", updateError);
        throw updateError;
      }

      console.log("✅ [Success] Profile updated successfully");
      router.push("/dashboard?verified_pending=true");
    } catch (err) {
      console.error("❌ [Verification Error]", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit verification request",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Full Name
          </label>
          <input
            type="text"
            required
            className="w-full p-3 rounded-lg border bg-background"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Phone Number
          </label>
          <input
            type="tel"
            required
            placeholder="+255 000 000 000"
            className="w-full p-3 rounded-lg border bg-background"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Email
          </label>
          <input
            type="email"
            className="w-full p-3 rounded-lg border bg-background"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            National ID Number
          </label>
          <input
            type="text"
            required
            className="w-full p-3 rounded-lg border bg-background"
            value={formData.national_id_number}
            onChange={(e) =>
              setFormData({ ...formData, national_id_number: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Location (City/Region)
          </label>
          <input
            type="text"
            required
            className="w-full p-3 rounded-lg border bg-background"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            House Number / Address
          </label>
          <input
            type="text"
            required
            className="w-full p-3 rounded-lg border bg-background"
            value={formData.house_number}
            onChange={(e) =>
              setFormData({ ...formData, house_number: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Required Documents</h3>
        <p className="text-sm text-muted-foreground">
          Please upload clear photos of your documents for manual verification.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FileUploader
            label="National ID"
            file={files.national_id}
            onChange={(e) => handleFileChange(e, "national_id")}
            icon={<CreditCard className="w-6 h-6" />}
          />
          <FileUploader
            label="Driver's License"
            file={files.driver_license}
            onChange={(e) => handleFileChange(e, "driver_license")}
            icon={<Calendar className="w-6 h-6" />}
          />
          <FileUploader
            label="Selfie"
            file={files.selfie}
            onChange={(e) => handleFileChange(e, "selfie")}
            icon={<Camera className="w-6 h-6" />}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full py-4 text-lg font-bold bg-primary-main hover:bg-primary-dark text-white rounded-xl shadow-xl transition-all"
      >
        {loading ? "Submitting..." : "Submit for Verification"}
      </Button>
    </form>
  );
};

interface FileUploaderProps {
  label: string;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}

const FileUploader = ({ label, file, onChange, icon }: FileUploaderProps) => {
  return (
    <div className="relative border-2 border-dashed border-neutral-border rounded-xl p-4 hover:border-primary-main transition-colors text-center group">
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-2">
        <div
          className={`p-3 rounded-full ${file ? "bg-green-500/10 text-green-500" : "bg-neutral-background group-hover:bg-primary-main/10 text-muted-foreground group-hover:text-primary-main"}`}
        >
          {file ? <Upload className="w-6 h-6" /> : icon}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider">
            {label}
          </p>
          <p className="text-[10px] text-muted-foreground line-clamp-1">
            {file ? file.name : "Tap to upload"}
          </p>
        </div>
      </div>
    </div>
  );
};
