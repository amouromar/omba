import React from "react";
import { supabase } from "@/lib/supabase";
import { UserList } from "./UserList";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/users";

export default async function AdminUsersPage() {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    redirect("/");
  }

  // Fetch users with profiles
  // We want to see those who are NOT verified first
  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .order("is_verified", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            User Verification
          </h1>
          <p className="text-muted-foreground text-sm">
            Review and verify user identification documents.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-muted rounded text-xs font-medium">
            Total: {users?.length || 0}
          </div>
          <div className="px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded text-xs font-medium">
            Pending:{" "}
            {users?.filter((u) => !u.is_verified && u.national_id_number)
              ?.length || 0}
          </div>
        </div>
      </div>

      <UserList initialUsers={users || []} />
    </div>
  );
}
