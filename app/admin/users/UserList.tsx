"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  ShieldAlert,
  Search,
} from "lucide-react";
import Image from "next/image";
import { Profile } from "@/types";

export const UserList = ({ initialUsers }: { initialUsers: Profile[] }) => {
  const [users, setUsers] = useState<Profile[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const toggleVerification = async (userId: string, currentStatus: boolean) => {
    setLoading(userId);
    const { error } = await supabase
      .from("profiles")
      .update({ is_verified: !currentStatus })
      .eq("id", userId);

    if (!error) {
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, is_verified: !currentStatus } : u,
        ),
      );
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, is_verified: !currentStatus });
      }
    }
    setLoading(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.national_id_number?.includes(searchTerm),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List Column */}
      <div className="lg:col-span-1 space-y-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedUser?.id === user.id
                  ? "border-primary-main bg-primary-main/5"
                  : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold truncate">
                  {user.full_name || "Unknown User"}
                </span>
                {user.is_verified ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : user.national_id_number ? (
                  <ShieldAlert size={16} className="text-yellow-500" />
                ) : (
                  <XCircle size={16} className="text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {user.email}
              </p>
              {user.national_id_number && !user.is_verified && (
                <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded">
                  Review Required
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Details Column */}
      <div className="lg:col-span-2">
        {selectedUser ? (
          <div className="bg-background border rounded-2xl p-6 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border">
                  {selectedUser.avatar_url ? (
                    <Image
                      src={selectedUser.avatar_url}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ShieldAlert className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedUser.full_name}
                  </h2>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() =>
                  toggleVerification(selectedUser.id!, selectedUser.is_verified)
                }
                disabled={loading === selectedUser.id}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${
                  selectedUser.is_verified
                    ? "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {loading === selectedUser.id
                  ? "Wait..."
                  : selectedUser.is_verified
                    ? "Unverify Account"
                    : "Verify Account"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold border-b pb-2">Information</h3>
                <InfoItem
                  label="National ID"
                  value={selectedUser.national_id_number}
                />
                <InfoItem
                  label="Driver's License"
                  value={selectedUser.driver_license_number}
                />
                <InfoItem label="Phone" value={selectedUser.phone_number} />
                <InfoItem label="Location" value={selectedUser.location} />
                <InfoItem
                  label="House Number"
                  value={selectedUser.house_number}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-bold border-b pb-2">Documents</h3>
                <div className="grid grid-cols-1 gap-4">
                  <DocPreview
                    label="National ID"
                    url={selectedUser.national_id_photo_url}
                  />
                  <DocPreview
                    label="Driver's License"
                    url={selectedUser.driver_license_photo_url}
                  />
                  <DocPreview label="Selfie" url={selectedUser.selfie_url} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-2xl">
            <Eye size={48} className="mb-4 opacity-20" />
            <p>Select a user to review their documents</p>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
      {label}
    </p>
    <p className="font-medium">{value || "Not provided"}</p>
  </div>
);

const DocPreview = ({ label, url }: { label: string; url: string | null }) => {
  if (!url) return null;
  return (
    <div className="group relative aspect-video rounded-xl border overflow-hidden bg-muted">
      <Image
        src={url}
        alt={label}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
        <p className="text-white text-xs font-bold uppercase mb-2">{label}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-black px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-neutral-200"
        >
          View Full Size <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};
