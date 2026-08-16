"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image?: string;
};

const CART_KEY = "bee-girl-shopping-cart";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      setCart(Array.isArray(stored) ? stored : []);
    } catch {
      setCart([]);
    }
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function startPayment() {
    setError("");

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    if (!city.trim()) {
      setError("Please enter your city.");
      return;
    }

    if (!pincode.trim() || pincode.trim().length < 6) {
      setError("Please enter a valid pincode.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          customer: {
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            city: city.trim(),
            pincode: pincode.trim(),
          },
          items: cart,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to start payment."
        );
      }

      if (!data.orderId || !data.keyId) {
        throw new Error(
          "Payment gateway configuration is incomplete."
        );
      }

      const scriptId = "razorpay-checkout-script";

      if (!document.getElementById(scriptId)) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");

          script.id = scriptId;
          script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

          script.onload = () => resolve();
          script.onerror = () =>
            reject(
              new Error(
                "Unable to load the payment gateway."
              )
            );

          document.body.appendChild(script);
        });
      }

      const RazorpayConstructor = (
        window as any
      ).Razorpay;

      if (!RazorpayConstructor) {
        throw new Error(
          "Payment gateway could not be loaded."
        );
      }

      const razorpay = new RazorpayConstructor({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Bee Girl Shopping",
        description: "Bee Girl Shopping Order",
        order_id: data.orderId,

        prefill: {
          name: name.trim(),
          contact: phone.trim(),
        },

        notes: {
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
        },

        theme: {
          color: "#6f35a8",
        },

        handler: async function (paymentResponse: any) {
          try {
            setLoading(true);

            const verifyResponse = await fetch(
              "/api/payment",
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId: data.orderId,
                  razorpayOrderId:
                    paymentResponse.razorpay_order_id,
                  razorpayPaymentId:
                    paymentResponse.razorpay_payment_id,
                  razorpaySignature:
                    paymentResponse.razorpay_signature,
                  customer: {
                    name: name.trim(),
                    phone: phone.trim(),
                    address: address.trim(),
                    city: city.trim(),
                    pincode: pincode.trim(),
                  },
                  items: cart,
                }),
              }
            );

            const verifyData =
              await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData?.error ||
                  "Payment verification failed."
              );
            }

            localStorage.removeItem(CART_KEY);

            window.location.href =
              "/?payment=success&order=" +
              encodeURIComponent(data.orderId);
          } catch (verificationError: any) {
            setLoading(false);

            setError(
              verificationError?.message ||
                "Payment was received but verification failed. Please contact support."
            );
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      });

      razorpay.on(
        "payment.failed",
        function (response: any) {
          setLoading(false);

          setError(
            response?.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      razorpay.open();
    } catch (paymentError: any) {
      setLoading(false);

      setError(
        paymentError?.message ||
          "Unable to start payment. Please try again."
      );
    }
  }

  if (!cart.length) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 20,
          background:
            "linear-gradient(135deg,#fbf7ff,#f0e7ff)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 28,
            padding: 45,
            textAlign: "center",
            maxWidth: 500,
            width: "100%",
            boxShadow:
              "0 15px 50px rgba(50,20,90,.10)",
          }}
        >
          <div style={{ fontSize: 55 }}>🛒</div>

          <h1 style={{ color: "#5f2c91" }}>
            Your Cart is Empty
          </h1>

          <p style={{ color: "#777" }}>
            Add products before proceeding to checkout.
          </p>

          <a
            href="/"
            style={{
              display: "inline-block",
              marginTop: 15,
              padding: "14px 28px",
              background: "#6f35a8",
              color: "#fff",
              borderRadius: 30,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Continue Shopping
          </a>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px 18px 60px",
        background:
          "linear-gradient(135deg,#fbf7ff,#f0e7ff)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1050,
          margin: "0 auto",
        }}
      >
        <a
          href="/cart"
          style={{
            color: "#6f35a8",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← Back to Cart
        </a>

        <h1
          style={{
            color: "#35184f",
            marginBottom: 6,
          }}
        >
          Checkout
        </h1>

        <p style={{ color: "#777" }}>
          Complete your details and proceed securely to payment.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0,1fr) 340px",
            gap: 22,
            marginTop: 25,
            alignItems: "start",
          }}
        >
          <section
            style={{
              background: "#fff",
              borderRadius: 25,
              padding: 25,
              boxShadow:
                "0 10px 30px rgba(50,20,90,.08)",
            }}
          >
            <h2 style={{ color: "#35184f" }}>
              Delivery Details
            </h2>

            <label style={labelStyle}>
              Full Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your full name"
              style={inputStyle}
            />

            <label style={labelStyle}>
              Phone Number
            </label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Enter your phone number"
              inputMode="numeric"
              style={inputStyle}
            />

            <label style={labelStyle}>
              Delivery Address
            </label>

            <textarea
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="House number, street, area"
              rows={4}
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label style={labelStyle}>
                  City
                </label>

                <input
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  placeholder="City"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Pincode
                </label>

                <input
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value)
                  }
                  placeholder="Pincode"
                  inputMode="numeric"
                  style={inputStyle}
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  marginTop: 18,
                  padding: 13,
                  borderRadius: 12,
                  background: "#fff0f0",
                  color: "#c0392b",
                  fontWeight: 700,
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={startPayment}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: 22,
                padding: "16px 20px",
                border: 0,
                borderRadius: 30,
                background: loading
                  ? "#aaa"
                  : "linear-gradient(135deg,#6f35a8,#8d52c7)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 16,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {loading
                ? "Processing..."
                : `Pay ₹${total}`}
            </button>

            <p
              style={{
                textAlign: "center",
                color: "#888",
                fontSize: 12,
                marginTop: 13,
              }}
            >
              🔒 Secure payment powered by Razorpay
            </p>
          </section>

          <aside
            style={{
              background: "#fff",
              borderRadius: 25,
              padding: 22,
              boxShadow:
                "0 10px 30px rgba(50,20,90,.08)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: "#35184f",
              }}
            >
              Your Order
            </h2>

            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                style={{
                  padding: "12px 0",
                  borderBottom:
                    "1px solid #eee",
                }}
              >
                <strong>{item.name}</strong>

                <div
                  style={{
                    color: "#777",
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  Size: {item.size} • Colour:{" "}
                  {item.color}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginTop: 7,
                  }}
                >
                  <span>
                    Qty: {item.quantity}
                  </span>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>
                </div>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                fontSize: 21,
                fontWeight: 800,
                color: "#35184f",
                marginTop: 20,
              }}
            >
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 15,
                background: "#f7f1ff",
                color: "#6f35a8",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              <strong>Bee Girl Shopping</strong>
              <br />
              Sai Nagar, 7th Cross, Anantapur
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 800px) {
          main > div > div {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 500px) {
          main {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          section {
            padding: 18px !important;
          }
        }
      `}</style>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginTop: 17,
  marginBottom: 7,
  fontWeight: 700,
  color: "#4a3458",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  border: "1px solid #ddd",
  borderRadius: 12,
  outline: "none",
  fontSize: 15,
  background: "#fff",
};
