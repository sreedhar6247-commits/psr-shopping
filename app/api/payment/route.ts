import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = Number(body.amount);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay environment variables are missing" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: `bee-girl-${Date.now()}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error?.description || "Unable to create Razorpay order",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId,
    });
  } catch (error) {
    console.error("Razorpay error:", error);

    return NextResponse.json(
      { error: "Payment server error" },
      { status: 500 }
    );
  }
}
