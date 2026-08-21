import { NextResponse } from "next/server";
import crypto from "crypto";

const PRICE_BY_ID: Record<number, number> = {
  1: 799,
  2: 1199,
  3: 999,
  4: 1499,
  5: 2499,
  6: 1999,
  7: 699,
  8: 749,
};

function jsonError(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body?.action || "create";

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return jsonError(
        "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel Environment Variables.",
        500
      );
    }

    if (action === "create") {
      const items = Array.isArray(body.items) ? body.items : [];

      if (!items.length) return jsonError("Your cart is empty.");

      const totalRupees = items.reduce((sum: number, item: any) => {
        const id = Number(item.id);
        const quantity = Math.max(1, Math.floor(Number(item.quantity || 1)));
        const price = PRICE_BY_ID[id];
        if (!price) throw new Error(`Invalid product: ${id}`);
        return sum + price * quantity;
      }, 0);

      const amount = Math.round(totalRupees * 100);
      if (amount < 100) return jsonError("Invalid payment amount.");

      const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
        },
        body: JSON.stringify({
          amount,
          currency: "INR",
          receipt: `bgs_${Date.now()}`,
        }),
      });

      const data = await razorpayResponse.json();

      if (!razorpayResponse.ok) {
        console.error("Razorpay order error:", data);
        return jsonError(data?.error?.description || "Unable to create Razorpay order.", razorpayResponse.status);
      }

      return NextResponse.json({
        success: true,
        keyId,
        orderId: data.id,
        amount: data.amount,
        currency: data.currency,
      });
    }

    if (action === "verify") {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return jsonError("Payment verification details are missing.");
      }

      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return jsonError("Invalid payment signature.", 400);
      }

      return NextResponse.json({
        success: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    }

    return jsonError("Invalid payment action.");
  } catch (error) {
    console.error("Payment API error:", error);
    return jsonError(error instanceof Error ? error.message : "Payment request failed.", 500);
  }
}
