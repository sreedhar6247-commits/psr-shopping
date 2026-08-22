"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
};

type Customer = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const CART_KEY = "bee-girl-shopping-cart";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [customer, setCustomer] =
    useState<Customer>({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "Andhra Pradesh",
      pincode: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    try {
      const x = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      setCart(
        Array.isArray(x) ? x : []
      );
    } catch {
      setCart([]);
    }

    if (
      !document.getElementById(
        "razorpay-script"
      )
    ) {
      const s =
        document.createElement("script");

      s.id = "razorpay-script";

      s.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      s.async = true;

      document.body.appendChild(s);
    }
  }, []);

  const total = useMemo(
    () =>
      cart.reduce(
        (s, i) =>
          s +
          Number(i.price) *
            Number(i.quantity || 1),
        0
      ),
    [cart]
  );

  const update = (
    key: keyof Customer,
    value: string
  ) => {
    setCustomer((c) => ({
      ...c,
      [key]: value,
    }));
  };

  async function startPayment() {
    setMessage("");

    if (!customer.name.trim()) {
      return setMessage(
        "Please enter your name."
      );
    }

    if (
      !/^[6-9]\d{9}$/.test(
        customer.phone
      )
    ) {
      return setMessage(
        "Please enter a valid 10-digit Indian mobile number."
      );
    }

    if (!customer.address.trim()) {
      return setMessage(
        "Please enter your delivery address."
      );
    }

    if (!customer.city.trim()) {
      return setMessage(
        "Please enter your city."
      );
    }

    if (
      !/^\d{6}$/.test(
        customer.pincode
      )
    ) {
      return setMessage(
        "Please enter a valid 6-digit pincode."
      );
    }

    if (!cart.length) {
      return setMessage(
        "Your cart is empty."
      );
    }

    try {
      setLoading(true);

      const create = await fetch(
        "/api/payment",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "create",
            items: cart.map((i) => ({
              id: i.id,
              quantity: i.quantity,
            })),
          }),
        }
      );

      const data =
        await create.json();

      if (!create.ok) {
        throw new Error(
          data.error ||
            "Unable to create payment order."
        );
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay is still loading. Please try again."
        );
      }

      const razorpay =
        new window.Razorpay({
          key: data.keyId,

          amount: data.amount,

          currency:
            data.currency || "INR",

          name:
            "Bee Girl Shopping",

          description:
            "Women's Clothing Order",

          order_id:
            data.orderId,

          prefill: {
            name:
              customer.name,

            contact:
              customer.phone,
          },

          notes: {
            city:
              customer.city,

            pincode:
              customer.pincode,
          },

          theme: {
            color: "#691d45",
          },

          handler: async (
            payment: any
          ) => {
            try {
              const verify =
                await fetch(
                  "/api/payment",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body:
                      JSON.stringify({
                        action:
                          "verify",

                        razorpay_order_id:
                          payment.razorpay_order_id,

                        razorpay_payment_id:
                          payment.razorpay_payment_id,

                        razorpay_signature:
                          payment.razorpay_signature,
                      }),
                  }
                );

              const verified =
                await verify.json();

              if (!verify.ok) {
                throw new Error(
                  verified.error ||
                    "Payment verification failed."
                );
              }

              const order = {
                orderNumber:
                  `BEG-${Date.now()
                    .toString()
                    .slice(-8)}`,

                customer,

                items: cart,

                total,

                paymentId:
                  payment.razorpay_payment_id,

                orderId:
                  payment.razorpay_order_id,

                createdAt:
                  new Date().toISOString(),

                status:
                  "Paid / New",
              };

              const localOrders =
                JSON.parse(
                  localStorage.getItem(
                    "bee-girl-orders"
                  ) || "[]"
                );

              localStorage.setItem(
                "bee-girl-orders",
                JSON.stringify([
                  order,
                  ...(Array.isArray(
                    localOrders
                  )
                    ? localOrders
                    : []),
                ])
              );

              await fetch(
                "/api/orders",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body:
                    JSON.stringify(order),
                }
              ).catch(() => null);

              localStorage.removeItem(
                CART_KEY
              );

              window.dispatchEvent(
                new Event(
                  "cart-updated"
                )
              );

              alert(
                `Payment successful! Order ${order.orderNumber} has been placed.`
              );

              window.location.href =
                "/";
            } catch (e: any) {
              setMessage(
                e?.message ||
                  "Payment verification failed."
              );

              setLoading(false);
            }
          },

          modal: {
            ondismiss: () =>
              setLoading(false),
          },
        });

      razorpay.on(
        "payment.failed",
        () => {
          setMessage(
            "Payment failed. Please try again or use another payment option."
          );

          setLoading(false);
        }
      );

      razorpay.open();
    } catch (e: any) {
      setMessage(
        e?.message ||
          "Unable to start payment."
      );

      setLoading(false);
    }
  }

  return (
    <main className="checkoutPage">

      <header className="checkoutHeader">

        <Link href="/cart">
          ← Cart
        </Link>

        <b>
          🌸 Bee Girl Shopping
        </b>

        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noreferrer"
        >
          💬 Support
        </a>

      </header>

      <section className="checkoutContainer">

        <h1>
          Secure Checkout
        </h1>

        <p className="muted">
          Complete your delivery details
          and pay securely with Razorpay.
        </p>

        {!cart.length ? (

          <div className="checkoutBox empty">

            <h2>
              Your cart is empty
            </h2>

            <Link
              href="/"
              className="primary"
            >
              SHOP NOW
            </Link>

          </div>

        ) : (

          <div className="checkoutGrid">

            <div className="checkoutBox">

              <h2>
                Delivery Details
              </h2>

              {message && (
                <div className="error">
                  {message}
                </div>
              )}

              <label>
                Full Name

                <input
                  value={customer.name}
                  onChange={(e) =>
                    update(
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Enter your full name"
                />

              </label>

              <label>
                Phone Number

                <input
                  value={customer.phone}
                  inputMode="numeric"
                  maxLength={10}
                  onChange={(e) =>
                    update(
                      "phone",
                      e.target.value
                        .replace(
                          /\D/g,
                          ""
                        )
                        .slice(0, 10)
                    )
                  }
                  placeholder="10-digit mobile number"
                />

              </label>

              <label>
                Delivery Address

                <textarea
                  value={
                    customer.address
                  }
                  onChange={(e) =>
                    update(
                      "address",
                      e.target.value
                    )
                  }
                  placeholder="House / street / area"
                />

              </label>

              <div className="two">

                <label>
                  City

                  <input
                    value={
                      customer.city
                    }
                    onChange={(e) =>
                      update(
                        "city",
                        e.target.value
                      )
                    }
                    placeholder="Anantapur"
                  />

                </label>

                <label>
                  State

                  <input
                    value={
                      customer.state
                    }
                    onChange={(e) =>
                      update(
                        "state",
                        e.target.value
                      )
                    }
                  />

                </label>

              </div>

              <label>
                Pincode

                <input
                  value={
                    customer.pincode
                  }
                  inputMode="numeric"
                  maxLength={6}
                  onChange={(e) =>
                    update(
                      "pincode",
                      e.target.value
                        .replace(
                          /\D/g,
                          ""
                        )
                        .slice(0, 6)
                    )
                  }
                  placeholder="6-digit pincode"
                />

              </label>

              <button
                className="payButton"
                disabled={loading}
                onClick={startPayment}
              >
                {loading
                  ? "PROCESSING..."
                  : `PAY ₹${total.toLocaleString(
                      "en-IN"
                    )} WITH RAZORPAY`}
              </button>

            </div>

            <aside className="checkoutBox summaryBox">

              <h2>
                Order Summary
              </h2>

              {cart.map((i) => (

                <div
                  className="summaryItem"
                  key={`${i.id}-${i.size}-${i.color}`}
                >

                  <img
                    src={i.image}
                    alt={i.name}
                  />

                  <div>

                    <b>
                      {i.name}
                    </b>

                    <small>
                      {i.size} •{" "}
                      {i.color} • Qty{" "}
                      {i.quantity}
                    </small>

                  </div>

                  <strong>
                    ₹
                    {(
                      Number(i.price) *
                      Number(
                        i.quantity
                      )
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              ))}

              <div className="grand">

                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <p className="secure">
                🔒 Payment is processed by
                Razorpay. Never share your
                OTP with anyone.
              </p>

            </aside>

          </div>

        )}

      </section>

      <style jsx>{`

        .checkoutHeader {
          position: sticky;
          top: 0;
          z-index: 20;
          background: #fff;
          border-bottom: 1px solid #ead9df;
          padding: 15px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .checkoutHeader a {
          color: #691d45;
          text-decoration: none;
          font-weight: 800;
          font-size: 12px;
        }

        .checkoutHeader b {
          font: 700 20px Georgia, serif;
          color: #691d45;
        }

        .checkoutContainer {
          max-width: 1100px;
          margin: auto;
          padding: 35px 18px 70px;
        }

        .checkoutContainer > h1 {
          text-align: center;
          font: 700 40px Georgia, serif;
          color: #4d1934;
          margin-bottom: 6px;
        }

        .checkoutContainer > .muted {
          text-align: center;
          margin-bottom: 25px;
        }

        .checkoutGrid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 18px;
        }

        .checkoutBox {
          background: #fff;
          border: 1px solid #ead9df;
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 6px 20px rgba(59,23,41,.06);
        }

        .checkoutBox h2 {
          font: 700 24px Georgia, serif;
          color: #4d1934;
          margin-top: 0;
        }

        .checkoutBox label {
          display: block;
          font-size: 12px;
          font-weight: 800;
          color: #4d1934;
          margin: 14px 0;
        }

        .checkoutBox input,
        .checkoutBox textarea {
          width: 100%;
          border: 1px solid #dbcbd3;
          border-radius: 11px;
          padding: 12px;
          margin-top: 7px;
          outline: none;
          background: #fff;
        }

        .checkoutBox textarea {
          min-height: 100px;
          resize: vertical;
        }

        .two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .error {
          background: #fff0f3;
          color: #a10031;
          padding: 11px;
          border-radius: 10px;
          font-size: 12px;
        }

        .payButton {
          width: 100%;
          border: 0;
          background: #691d45;
          color: #fff;
          padding: 16px;
          border-radius: 28px;
          font-weight: 800;
          margin-top: 10px;
        }

        .payButton:disabled {
          opacity: .6;
        }

        .summaryItem {
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }

        .summaryItem img {
          width: 55px;
          height: 70px;
          object-fit: cover;
          border-radius: 8px;
        }

        .summaryItem > div {
          flex: 1;
        }

        .summaryItem b,
        .summaryItem small {
          display: block;
        }

        .summaryItem b {
          font-size: 12px;
          color: #4d1934;
        }

        .summaryItem small {
          font-size: 10px;
          color: #806f78;
          margin-top: 4px;
        }

        .summaryItem strong {
          font-size: 12px;
          color: #691d45;
        }

        .grand {
          display: flex;
          justify-content: space-between;
          padding-top: 20px;
          font-size: 20px;
          color: #691d45;
        }

        .secure {
          font-size: 11px;
          color: #806f78;
          line-height: 1.5;
        }

        .empty {
          text-align: center;
          padding: 60px;
        }

        .empty .primary {
          display: inline-block;
          margin-top: 15px;
          text-decoration: none;
        }

        @media(max-width:800px) {

          .checkoutGrid {
            grid-template-columns: 1fr;
          }

          .checkoutHeader b {
            font-size: 15px;
          }

          .two {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

    </main>
  );
}
