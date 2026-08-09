"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type CartItem = {
  id: number;
  name: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bee-girl-shopping-cart");

      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      setCart([]);
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function startPayment() {
    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      setMessage("Please enter your phone number.");
      return;
    }

    if (!address.trim()) {
      setMessage("Please enter your address.");
      return;
    }

    if (!city.trim()) {
      setMessage("Please enter your city.");
      return;
    }

    if (!pincode.trim()) {
      setMessage("Please enter your pincode.");
      return;
    }

    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          orderData?.error || "Unable to create payment order"
        );
      }

      const razorpayKey =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error(
          "Razorpay Key ID is not configured."
        );
      }

      const options = {
        key: razorpayKey,

        amount: orderData.amount,

        currency: "INR",

        name: "Sindhu Shopping",

        description: "Women's Fashion Order",

        order_id: orderData.id,

        prefill: {
          name: name,
          contact: phone,
        },

        notes: {
          customer_name: name,
          phone: phone,
          address: address,
          city: city,
          pincode: pincode,
        },

        theme: {
          color: "#e5007d",
        },

        handler: async function (response: any) {
          try {
            setMessage("Verifying payment...");

            const verifyResponse = await fetch(
              "/api/razorpay/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(response),
              }
            );

            const verifyData =
              await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              setMessage(
                "Payment verification failed. Please contact us."
              );
              setLoading(false);
              return;
            }

            localStorage.removeItem(
              "bee-girl-shopping-cart"
            );

            setCart([]);

            setMessage(
              `Payment successful! Payment ID: ${response.razorpay_payment_id}`
            );

            alert(
              "Payment successful! Thank you for shopping with Sindhu Shopping."
            );

            window.location.href = "/";
          } catch (error) {
            console.error(error);

            setMessage(
              "Payment completed but verification failed. Please contact us."
            );

            setLoading(false);
          }
        },

        modal: {
          confirm_close: true,
          escape: true,
          backdropclose: false,
        },

        retry: {
          enabled: true,
        },
      };

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay checkout is still loading. Please try again."
        );
      }

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response: any) {
          console.error(response);

          setMessage(
            response?.error?.description ||
              "Payment failed. Please try again."
          );

          setLoading(false);
        }
      );

      razorpay.open();

      setLoading(false);
    } catch (error: any) {
      console.error(error);

      setMessage(
        error?.message ||
          "Unable to start payment. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff5fb",
        padding: "30px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 800,
            marginBottom: "8px",
          }}
        >
          Checkout
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Complete your order and pay securely.
        </p>

        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              marginBottom: "15px",
            }}
          >
            Delivery Details
          </h2>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            style={inputStyle}
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            type="tel"
            style={inputStyle}
          />

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Full Address"
            rows={4}
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />

          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            style={inputStyle}
          />

          <input
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Pincode"
            type="text"
            inputMode="numeric"
            style={inputStyle}
          />
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              marginBottom: "15px",
            }}
          >
            Order Summary
          </h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  padding: "12px 0",
                  borderBottom:
                    "1px solid #eee",
                }}
              >
                <div>
                  <strong>{item.name}</strong>

                  <div
                    style={{
                      fontSize: "14px",
                      color: "#777",
                      marginTop: "4px",
                    }}
                  >
                    Size: {item.size || "M"}
                    {item.color
                      ? ` • Colour: ${item.color}`
                      : ""}

                    {" • Qty: "}
                    {item.quantity}
                  </div>
                </div>

                <strong>
                  ₹
                  {(
                    item.price * item.quantity
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            ))
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "22px",
              fontWeight: 800,
              marginTop: "20px",
            }}
          >
            <span>Total</span>

            <span>
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {message && (
          <div
            style={{
              background: "#fff0f6",
              color: "#c00065",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "15px",
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        <button
          onClick={startPayment}
          disabled={loading || cart.length === 0}
          style={{
            width: "100%",
            border: "none",
            borderRadius: "14px",
            padding: "17px",
            background:
              loading || cart.length === 0
                ? "#aaa"
                : "#e5007d",
            color: "white",
            fontSize: "18px",
            fontWeight: 800,
            cursor:
              loading || cart.length === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loading
            ? "Processing..."
            : `Pay ₹${total.toLocaleString("en-IN")}`}
        </button>

        <p
          style={{
            textAlign: "center",
            color: "#777",
            fontSize: "13px",
            marginTop: "12px",
          }}
        >
          Secure payment powered by Razorpay
        </p>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "14px",
  marginBottom: "12px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  fontSize: "16px",
  outline: "none",
};
