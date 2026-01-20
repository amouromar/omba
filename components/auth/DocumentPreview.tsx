"use client";

import React from "react";
import { Edit2, FileText, CheckCircle2, Clock } from "lucide-react";
import { Profile } from "@/types";
import { useSupabaseClient } from "@/lib/supabase-client";
import { useEffect, useState } from "react";
import NextImage from "next/image";

interface DocumentPreviewProps {
  profile: Profile;
  onEdit: () => void;
}

export const DocumentPreview = ({ profile, onEdit }: DocumentPreviewProps) => {
  const supabase = useSupabaseClient();
  const [signedUrls, setSignedUrls] = useState<{
    [key: string]: string | null;
  }>({});

  useEffect(() => {
    const fetchSignedUrls = async () => {
      const urls: { [key: string]: string | null } = {};

      const docs = [
        { key: "national_id", path: profile.national_id_photo_url },
        { key: "driver_license", path: profile.driver_license_photo_url },
        { key: "selfie", path: profile.selfie_url },
      ];

      for (const doc of docs) {
        if (doc.path) {
          try {
            // Extract the path from the stored public URL
            // Format: .../storage/v1/object/public/user-documents/{path}
            // Or if custom domain: .../storage/v1/object/public/user-documents/{path}
            // We need the part AFTER /user-documents/

            let filePath = doc.path;
            const marker = "/user-documents/";
            const index = doc.path.indexOf(marker);

            if (index !== -1) {
              filePath = doc.path.substring(index + marker.length);
              // Clean any potential URL encoding if needed, though usually automatic
              filePath = decodeURIComponent(filePath);
            }

            const { data, error } = await supabase.storage
              .from("user-documents")
              .createSignedUrl(filePath, 3600); // 1 hour expiry

            if (data?.signedUrl) {
              urls[doc.key] = data.signedUrl;
            } else {
              console.error(`Failed to sign URL for ${doc.key}:`, error);
              // Fallback to original if signing fails (might be public)
              urls[doc.key] = doc.path;
            }
          } catch (e) {
            console.error(`Error processing URL for ${doc.key}:`, e);
            urls[doc.key] = doc.path;
          }
        }
      }
      setSignedUrls(urls);
    };

    fetchSignedUrls();
  }, [profile, supabase]);

  const documents = [
    {
      label: "National ID",
      url: signedUrls.national_id || profile.national_id_photo_url,
      id: profile.national_id_number,
    },
    {
      label: "Driver's License",
      url: signedUrls.driver_license || profile.driver_license_photo_url,
      id: profile.driver_license_number,
    },
    {
      label: "Selfie",
      url: signedUrls.selfie || profile.selfie_url,
      id: "Face Verification",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Your Documents</h3>
          <p className="text-sm text-muted-foreground">
            The documents you&apos;ve uploaded for verification.
          </p>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground rounded-lg transition-colors text-sm font-medium border"
        >
          <Edit2 size={16} />
          Update Documents
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="group relative bg-muted/30 border rounded-2xl overflow-hidden aspect-video flex flex-col"
          >
            {doc.url ? (
              <>
                <NextImage
                  fill
                  src={doc.url}
                  alt={doc.label}
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                    Preview {doc.label}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-muted-foreground">
                <FileText size={40} className="mb-2 opacity-20" />
                <p className="text-sm font-medium">No document uploaded</p>
              </div>
            )}

            <div className="absolute top-3 right-3">
              {doc.url ? (
                <div className="bg-green-500 text-white p-1 rounded-full shadow-lg">
                  <CheckCircle2 size={14} />
                </div>
              ) : (
                <div className="bg-amber-500 text-white p-1 rounded-full shadow-lg">
                  <Clock size={14} />
                </div>
              )}
            </div>

            <div className="p-3 bg-background/80 backdrop-blur-sm border-t mt-auto">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                {doc.label}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {doc.id || "Not provided"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-muted/30 border rounded-2xl p-6">
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Personal Information
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem label="Full Name" value={profile.full_name} />
          <DetailItem label="Email Address" value={profile.email} />
          <DetailItem label="Phone Number" value={profile.phone_number} />
          <DetailItem label="Location" value={profile.location} />
          <DetailItem label="Address" value={profile.house_number} />
          <DetailItem label="National ID" value={profile.national_id_number} />
          <DetailItem
            label="Driver's License"
            value={profile.driver_license_number}
          />
        </div>
      </div>

      {!profile.is_verified && (
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-blue-700">Under Review</p>
            <p className="text-xs text-blue-600/80 leading-relaxed">
              Our team is currently reviewing your documents. This process
              usually takes 24-48 hours. We&apos;ll notify you once it&apos;s
              complete.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) => (
  <div className="space-y-1">
    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
      {label}
    </p>
    <p className="text-sm font-medium">{value || "Not provided"}</p>
  </div>
);
