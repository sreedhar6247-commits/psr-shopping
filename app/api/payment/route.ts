import { NextResponse } from "next/server";
import crypto from "crypto";
import { products as starter } from "@/lib/catalog";

const errorResponse = (
  error: string,
  status = 400
) =>
  NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );

function getPrices() {
  return new Map(
    starter.map((product) => [
      Number(product.id),
      {
        price: Math.round(
          Number(product.price) * 100
        ),
        stock: Number(product.stock || 0),
        active: product.active !== false,
      },
    ])
  );
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const action =
      body?.action || "create";

    const keyId =
      process.env.RAZORPAY_KEY_ID;

    const keySecret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return errorResponse(
        "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel Environment Variables.",
        500
      );
    }

    if (action === "create") {
      const items =
        Array.isArray(body.items)
          ? body.items
          : [];

      if (!items.length) {
        return errorResponse(
          "Your cart is empty."
        );
      }

      const prices =
        getPrices();

      let total = 0;

      for (const item of items) {
        const id =
          Number(item.id);

        const quantity =
          Math.max(
            1,
            Math.floor(
              Number(
                item.quantity || 1
              )
            )
          );

        const product =
          prices.get(id);

        if (
          !product ||
          !product.active
        ) {
          return errorResponse(
            `Product ${id} is unavailable.`
          );
        }

        if (
          product.stock <
          quantity
        ) {
          return errorResponse(
            "One or more products do not have enough stock."
          );
        }

        total +=
          product.price *
          quantity;
      }

      if (total < 100) {
        return errorResponse(
          "Invalid payment amount."
        );
      }

      const response =
        await fetch(
          "https://api.razorpay.com/v1/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                "Basic " +
                Buffer.from(
                  `${keyId}:${keySecret}`
                ).toString(
                  "base64"
                ),
            },

            body: JSON.stringify({
              amount: total,
              currency: "INR",
              receipt:
                `bgs_${Date.now()}`,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        return errorResponse(
          data?.error
            ?.description ||
            "Unable to create Razorpay order.",
          response.status
        );
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
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = body;

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {
        return errorResponse(
          "Payment verification details are missing."
        );
      }

      const generated =
        crypto
          .createHmac(
            "sha256",
            keySecret
          )
          .update(
            `${razorpay_order_id}|${razorpay_payment_id}`
          )
          .digest("hex");

      if (
        generated !==
        razorpay_signature
      ) {
        return errorResponse(
          "Invalid payment signature.",
          400
        );
      }

      return NextResponse.json({
        success: true,
        paymentId:
          razorpay_payment_id,
        orderId:
          razorpay_order_id,
      });
    }

    return errorResponse(
      "Invalid payment action."
    );
  } catch (e: any) {
    console.error(e);

    return errorResponse(
      e?.message ||
        "Payment request failed.",
      500
    );
  }
}
