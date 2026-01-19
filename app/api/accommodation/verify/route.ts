import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    const { RAZORPAY_KEY_SECRET } = process.env;

    if (!RAZORPAY_KEY_SECRET) {
        return NextResponse.json(
            { error: "Razorpay secret not configured" },
            { status: 500 }
        );
    }

    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            booking_details,
            user_id,
            amount,
        } = await request.json();

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json(
                { success: false, error: "Invalid signature" },
                { status: 400 }
            );
        }

        // Insert into 'accommodation_bookings'
        // Note: This table must be created by the user using the provided SQL artifact.
        const { data: booking, error } = await supabase
            .from("accommodation_bookings")
            .insert([
                {
                    user_id: user_id || null, // Allow null for guests if schema permits, or require auth
                    nights: booking_details.nights,
                    check_in: booking_details.checkIn,
                    check_out: booking_details.checkOut,
                    amount: amount / 100, // Store in Rupees
                    razorpay_order_id,
                    razorpay_payment_id,
                    payment_status: "done",
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Error creating accommodation booking:", error);
            return NextResponse.json({
                success: true,
                warning: "Payment successful but DB record failed. Contact support.",
                payment_id: razorpay_payment_id,
            });
        }

        return NextResponse.json({
            success: true,
            booking_id: booking.booking_id,
            message: "Accommodation booked successfully",
        });

    } catch (error: any) {
        console.error("Accommodation Verification Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
