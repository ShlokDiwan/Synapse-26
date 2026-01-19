import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const Pricing = {
    2: 2300,
    3: 2500,
    4: 2800,
};

const ValidRanges = {
    2: [
        { start: 27, end: 28 },
        { start: 28, end: 1 },
    ],
    3: [{ start: 27, end: 1 }],
    4: [{ start: 26, end: 1 }],
    // Logic simplified: we expect start/end days.
    // Actually, let's just use the frontend provided range label or days for validation if needed.
    // But strict validation requires checking dates.
    // 2 nights: 27-28 Feb, 28 Feb-1 Mar.
    // 3 nights: 27 Feb-1 Mar.
    // 4 nights: 26 Feb-1 Mar.
};

export async function POST(request: Request) {
    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        return NextResponse.json(
            { error: "Razorpay credentials not configured" },
            { status: 500 }
        );
    }

    const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
    });

    try {
        const { nights, checkIn, checkOut, user_id } = await request.json();

        // Validate inputs
        if (!nights || !Pricing[nights as keyof typeof Pricing]) {
            return NextResponse.json(
                { error: "Invalid night selection" },
                { status: 400 }
            );
        }

        // Validate Date Ranges
        if (checkIn) {
            const startDay = new Date(checkIn).getDate();
            // ValidRanges: 2 nights -> starts on 27 or 28; 3 nights -> starts on 27; 4 nights -> starts on 26.
            // Note: This assumes Feb 2026.
            const validStarts = ValidRanges[nights as keyof typeof ValidRanges].map(r => r.start);
            if (!validStarts.includes(startDay)) {
                return NextResponse.json(
                    { error: `Invalid start date for ${nights} nights. Allowed starts: ${validStarts.join(", ")} Feb` },
                    { status: 400 }
                );
            }
        }

        // Amount
        const price = Pricing[nights as keyof typeof Pricing];
        const amountInPaise = price * 100;

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `acc_${user_id ? user_id.slice(0, 5) : "guest"}_${Date.now()}`,
            notes: {
                type: "accommodation",
                nights: nights.toString(),
                checkIn: checkIn || "",
                checkOut: checkOut || "",
                user_id: user_id || "guest",
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: amountInPaise,
            currency: "INR",
            nights,
            price
        });

    } catch (error: any) {
        console.error("Accommodation Order Create Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
