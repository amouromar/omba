import React from "react";
import { VerificationForm } from "@/components/auth/VerificationForm";
import { getUserProfile } from "@/lib/users";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function ProfileCompletePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const profile = await getUserProfile();

  if (profile?.is_verified) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen pt-24 pb-12 bg-neutral-background dark:bg-primary-dark/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Complete Your Profile
            </h1>
            <p className="text-muted-foreground">
              To start renting cars, we need to verify your identity and
              documents.
            </p>
          </div>

          <VerificationForm initialData={profile} />
        </div>
      </div>
    </main>
  );
}
