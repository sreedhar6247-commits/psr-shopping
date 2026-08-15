import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // =========================
    // CREATE RAZORPAY ORDER
    // =========================
    if (body.amount) {
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keyId || !keySecret) {
        return NextResponse.json(
          {
            success: false,
            error: "Razorpay keys are missing",
          },
          { status: 500 }
        );
      }

      const amount = Math.round(Number(body.amount) * 100);

      if (!amount || amount < 100) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid payment amount",
          },
          { status: 400 }
        );
      }

      const receipt = `receipt_${Date.now()}`;

      const razorpayResponse = await fetch(
        "https://api.razorpay.com/v1/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic " +
              Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
          },
          body: JSON.stringify({
            amount,
            currency: "INR",
            receipt,
          }),
        }
      );

      const razorpayData = await razorpayResponse.json();

      if (!razorpayResponse.ok) {
        console.error("Razorpay order error:", razorpayData);

        return NextResponse.json(
          {
            success: false,
            error:
              razorpayData?.error?.description ||
              "Unable to create Razorpay order",
          },
          { status: razorpayResponse.status }
        );
      }

      return NextResponse.json({
        success: true,
        keyId,
        orderId: razorpayData.id,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
      });
    }

    // =========================
    // VERIFY RAZORPAY PAYMENT
    // =========================
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay secret is missing",
        },
        { status: 500 }
      );
    }

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification details are missing",
        },
        { status: 400 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment signature",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error("Payment API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Payment request failed",
      },
      { status: 500 }
    );
  }
}
