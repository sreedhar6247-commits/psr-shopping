import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

function authHeader() {
  return (
    "Basic " +
    Buffer.from(
      `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`
    ).toString("base64")
  );
}

export async function POST(request: NextRequest) {
  try {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        {
          error:
            "Payment gateway is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const amount = Number(body.amount);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount." },
        { status: 400 }
      );
    }

    const razorpayResponse = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
        method: "POST",
        headers: {
          Authorization: authHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: "INR",
          receipt: `BGS-${Date.now()}`,
          notes: {
            customer_name:
              body.customer?.name || "",
            customer_phone:
              body.customer?.phone || "",
            city:
              body.customer?.city || "",
            pincode:
              body.customer?.pincode || "",
          },
        }),
      }
    );

    const order = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      return NextResponse.json(
        {
          error:
            order?.error?.description ||
            "Unable to create payment order.",
        },
        { status: razorpayResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Payment order error:", error);

    return NextResponse.json(
      { error: "Unable to create payment order." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        {
          error:
            "Payment gateway secret is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    if (
      !orderId ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return NextResponse.json(
        {
          error:
            "Incomplete payment verification details.",
        },
        { status: 400 }
      );
    }

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          RAZORPAY_KEY_SECRET
        )
        .update(
          `${orderId}|${razorpayPaymentId}`
        )
        .digest("hex");

    const isValid =
      crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpaySignature)
      );

    if (!isValid) {
      return NextResponse.json(
        {
          error:
            "Payment verification failed.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      orderId,
      paymentId: razorpayPaymentId,
      message:
        "Payment verified successfully.",
    });
  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to verify payment.",
      },
      { status: 500 }
    );
  }
}
