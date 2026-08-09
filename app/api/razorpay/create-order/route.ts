import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay keys are not configured" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          payment_capture: 1,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.description || "Unable to create order" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Payment order creation failed" },
      { status: 500 }
    );
  }
}
