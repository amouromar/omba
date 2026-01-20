"use client";

import React, { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Profile } from "@/types";
import { DocumentPreview } from "./DocumentPreview";
import { VerificationForm } from "./VerificationForm";

interface VerificationStatusProps {
  profile: Profile;
}

export const VerificationStatus = ({ profile }: VerificationStatusProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const isVerified = profile.is_verified;
  const hasDocuments = !!(
    profile.national_id_photo_url ||
    profile.driver_license_photo_url ||
    profile.selfie_url
  );

  // If verified, we don't necessarily need to show the form or preview anymore,
  // but if the user wants to see their documents, they can.
  // For now, we only care about the unverified/pending states.
  if (isVerified) return null;

  return (
    <div className="space-y-6">
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="bg-amber-500/20 p-4 rounded-full">
          <ShieldAlert className="w-8 h-8 text-amber-500" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h3 className="text-xl font-bold text-amber-600">
            {hasDocuments ? "Verification Pending" : "Verification Required"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {hasDocuments
              ? "Your documents are being reviewed. You can update them if needed."
              : "Your account is currently unverified. You will not be able to book cars until your identity is confirmed."}
          </p>
        </div>
      </div>

      <section className="bg-background border rounded-2xl p-6 md:p-8">
        {hasDocuments && !isEditing ? (
          <DocumentPreview
            profile={profile}
            onEdit={() => setIsEditing(true)}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {isEditing ? "Update Documents" : "Complete Verification"}
              </h3>
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Cancel
                </button>
              )}
            </div>
            <VerificationForm initialData={profile} />
          </div>
        )}
      </section>
    </div>
  );
};
