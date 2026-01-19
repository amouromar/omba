import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { isVerified } from "@/lib/users";
import { auth } from "@clerk/nextjs/server";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: "2025-12-15.clover" as any, // Suppressing type check for specific version to avoid build errors
});

// Initialize Supabase Admin (Standard client might lack permissions for server-side inserts depending on RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const verified = await isVerified();
    if (!verified) {
      return NextResponse.json(
        {
          error:
            "Account not verified. Please complete your profile and wait for admin approval.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const {
      carId,
      carMake,
      carModel,
      totalAmount,
      startDate,
      endDate,
      imageUrl,
    } = body;

    // totalAmount is expected in TZS

    // 1. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "tzs",
            product_data: {
              name: `${carMake} ${carModel}`,
              description: `Rental from ${startDate} to ${endDate}`,
              images: imageUrl ? [imageUrl] : [],
            },
            unit_amount: Math.round(totalAmount * 100), // Stripe expects cents/minor units (TZS is 100 divisor)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.headers.get(
        "origin",
      )}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/cars/${carId}`, // specific cancel page or back to car
      metadata: {
        carId,
        startDate,
        endDate,
      },
    });

    // 2. Create Booking Record in Supabase
    const { error } = await supabase.from("bookings").insert([
      {
        car_id: carId,
        user_id: userId, // Added clerk_id/user_id for tracking
        start_date: startDate,
        end_date: endDate,
        total_price: totalAmount,
        status: "PENDING",
        stripe_session_id: session.id,
      },
    ]);

    if (error) {
      console.error("Supabase Booking Insert Error:", error);
      // Logic: If DB insert fails, should we cancel the session?
      // For MVP, we log it. User will pay, but booking missing.
      // Improve: Expire session if DB fails.
      await stripe.checkout.sessions.expire(session.id);
      return NextResponse.json(
        { error: "Failed to create booking record." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Stripe Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
