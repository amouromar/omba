"use client";

import React, { useState } from "react";
import { Profile, BookingWithCar } from "@/types";
import { VerificationStatus } from "@/components/auth/VerificationStatus";
import { CancelBookingButton } from "@/components/dashboard/CancelBookingButton";
import {
  LayoutDashboard,
  User,
  Clock,
  Calendar,
  MapPin,
  Car,
} from "lucide-react";
import Link from "next/link";

interface DashboardTabsProps {
  profile: Profile;
  bookings: BookingWithCar[];
}

export const DashboardTabs = ({ profile, bookings }: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState<"bookings" | "profile">(
    "bookings",
  );

  const totalBookings = bookings.length;
  const now = new Date();
  const activeRentals = bookings.filter((b) => {
    const start = new Date(b.start_date);
    const end = new Date(b.end_date);
    return b.status === "CONFIRMED" && now >= start && now <= end;
  }).length;
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <div className="space-y-8">
      {/* Tabs Header */}
      <div className="flex p-1 bg-muted/30 rounded-xl w-fit border">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "bookings"
              ? "bg-white dark:bg-neutral-800 shadow-sm text-primary-main"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutDashboard size={18} />
          My Bookings
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "profile"
              ? "bg-white dark:bg-neutral-800 shadow-sm text-primary-main"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User size={18} />
          My Profile & Documents
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === "bookings" ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Data summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Bookings"
                value={totalBookings.toString()}
              />
              <StatCard
                title="Active Rentals"
                value={activeRentals.toString()}
              />
              <StatCard
                title="Pending Approvals"
                value={pendingBookings.toString()}
              />
            </div>

            {/* Bookings List */}
            <section className="bg-background border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b bg-muted/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Car className="text-primary-main" size={20} />
                  <h3 className="font-bold">Recent Bookings</h3>
                </div>
              </div>
              <div className="divide-y">
                {bookings.length > 0 ? (
                  bookings.map((booking) => {
                    const start = new Date(booking.start_date);
                    const end = new Date(booking.end_date);
                    const isCancelled = booking.status === "CANCELLED";
                    const isPending = booking.status === "PENDING";
                    const isCompleted =
                      booking.status === "COMPLETED" ||
                      (booking.status === "CONFIRMED" && now > end);
                    const isActive =
                      booking.status === "CONFIRMED" &&
                      now >= start &&
                      now <= end;
                    const isUpcoming =
                      booking.status === "CONFIRMED" && now < start;

                    let statusLabel: string = booking.status;
                    let statusColor = "bg-gray-100 text-gray-700";

                    if (isCancelled) {
                      statusLabel = "Cancelled";
                      statusColor = "bg-red-100 text-red-700";
                    } else if (isPending) {
                      statusLabel = "Pending";
                      statusColor = "bg-yellow-100 text-yellow-700";
                    } else if (isActive) {
                      statusLabel = "Active";
                      statusColor = "bg-green-100 text-green-700";
                    } else if (isUpcoming) {
                      statusLabel = "Upcoming";
                      statusColor = "bg-blue-100 text-blue-700";
                    } else if (isCompleted) {
                      statusLabel = "Completed";
                      statusColor = "bg-gray-100 text-gray-700";
                    }

                    return (
                      <div
                        key={booking.id}
                        className="p-6 hover:bg-muted/5 transition-colors group"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Car Image */}
                          <div
                            className="w-full md:w-48 aspect-video bg-muted rounded-xl bg-cover bg-center shrink-0 border border-border/50"
                            style={{
                              backgroundImage: `url(${
                                booking.cars?.image || "/placeholder-car.png"
                              })`,
                            }}
                          />

                          {/* Details */}
                          <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-lg">
                                  {booking.cars?.name ||
                                    `${booking.cars?.make} ${booking.cars?.model}`}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs font-bold ${statusColor}`}
                                  >
                                    {statusLabel}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Booking ID: #{booking.id.slice(0, 8)}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg font-mono">
                                  TZS{" "}
                                  {new Intl.NumberFormat().format(
                                    booking.total_price,
                                  )}
                                </p>
                                {booking.status !== "CANCELLED" &&
                                  booking.status !== "COMPLETED" && (
                                    <div className="mt-2 flex justify-end">
                                      <CancelBookingButton
                                        bookingId={booking.id}
                                      />
                                    </div>
                                  )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 font-bold text-primary-main">
                                  <Clock size={16} />
                                  <span>
                                    {(() => {
                                      const diffMs =
                                        end.getTime() - start.getTime();
                                      const hours = Math.ceil(
                                        diffMs / (1000 * 60 * 60),
                                      );
                                      return hours <= 72
                                        ? `${hours} Hrs`
                                        : `${Math.ceil(hours / 24)} Days`;
                                    })()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar size={14} />
                                  <span>
                                    {booking.start_date.slice(0, 10)} -{" "}
                                    {booking.end_date.slice(0, 10)}
                                  </span>
                                </div>
                              </div>
                              {/* Fallback location if not in car data */}
                              <div className="flex items-center gap-2 text-muted-foreground self-start sm:mt-0.5">
                                <MapPin size={16} />
                                <span>Dar es Salaam</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-4">
                    <div className="bg-muted p-4 rounded-full">
                      <Car size={32} className="opacity-50" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">No bookings found</p>
                      <p className="text-sm opacity-70">
                        You haven&apos;t made any bookings yet.
                      </p>
                    </div>
                    <Link
                      href="/cars"
                      className="text-primary-main font-bold hover:underline mt-2 inline-block px-6 py-2 bg-primary-main/10 rounded-lg hover:bg-primary-main/20 transition-colors"
                    >
                      Browse Cars
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <VerificationStatus profile={profile} />
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-background border rounded-2xl p-6 space-y-1 shadow-sm">
    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider text-[10px]">
      {title}
    </p>
    <p className="text-3xl font-black text-primary-main">{value}</p>
  </div>
);
