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

  // Load cart
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bee-girl-shopping-cart");

      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Unable to load cart:", error);
      setCart([]);
    }
  }, []);

  // Load Razorpay checkout script
  useEffect(() => {
    if (document.getElementById("razorpay-script")) {
      return;
    }

    const script = document.createElement("script");

    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  async function startPayment() {
    setMessage("");

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      setMessage("Please enter your phone number.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setMessage("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    if (!address.trim()) {
      setMessage("Please enter your delivery address.");
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

    if (!/^\d{6}$/.test(pincode.trim())) {
      setMessage("Please enter a valid 6-digit pincode.");
      return;
    }

    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    if (total <= 0) {
      setMessage("Invalid order amount.");
      return;
    }

    try {
      setLoading(true);

      // Create Razorpay order on the server
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to create payment order."
        );
      }

      // Make sure Razorpay has loaded
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay is still loading. Please wait a few seconds and try again."
        );
      }

      const options = {
        key: data.keyId,

        amount: data.amount,

        currency: data.currency || "INR",

        name: "Sindhu Shopping",

        description: "Women's Clothing Order",

        order_id: data.orderId,

        prefill: {
          name: name.trim(),
          contact: phone.trim(),
        },

        notes: {
          customer_name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
        },

        theme: {
          color: "#e6007e",
        },

        handler: function (paymentResponse: any) {
          console.log("Payment successful:", paymentResponse);

          // Clear cart after successful payment
          localStorage.removeItem("bee-girl-shopping-cart");

          setCart([]);

          setMessage("");

          // Show success message
          alert(
            "Payment successful!\n\nThank you for shopping with Sindhu Shopping."
          );

          // Go back to home page
          window.location.href = "/";
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            setMessage("Payment window closed.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response);

        setLoading(false);

        setMessage(
          response?.error?.description ||
            "Payment failed. Please try again."
        );
      });

      razorpay.open();

      setLoading(false);
    } catch (error: any) {
      console.error("Payment error:", error);

      setLoading(false);

      setMessage(
        error?.message ||
          "Unable to start payment. Please try again."
      );
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8f8f8",
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
            fontWeight: "800",
            marginBottom: "8px",
            color: "#111827",
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
          Complete your details and make your payment.
        </p>

        {/* ORDER SUMMARY */}
        <section
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              fontSize: "21px",
              marginBottom: "15px",
              color: "#111827",
            }}
          >
            Order Summary
          </h2>

          {cart.length === 0 ? (
            <p style={{ color: "#666" }}>
              Your cart is empty.
            </p>
          ) : (
            <>
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "15px",
                    padding: "12px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div>
                    <strong>{item.name}</strong>

                    {item.size && (
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#777",
                          marginTop: "3px",
                        }}
                      >
                        Size: {item.size}
                      </div>
                    )}

                    {item.color && (
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#777",
                        }}
                      >
                        Colour: {item.color}
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: "14px",
                        color: "#777",
                      }}
                    >
                      Quantity: {item.quantity}
                    </div>
                  </div>

                  <strong>
                    ₹
                    {(
                      Number(item.price) * Number(item.quantity)
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "18px",
                  fontSize: "22px",
                  fontWeight: "800",
                }}
              >
                <span>Total</span>

                <span style={{ color: "#e6007e" }}>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </>
          )}
        </section>

        {/* CUSTOMER DETAILS */}
        <section
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              fontSize: "21px",
              marginBottom: "18px",
              color: "#111827",
            }}
          >
            Delivery Details
          </h2>

          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "7px",
            }}
          >
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            style={inputStyle}
          />

          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "7px",
            }}
          >
            Phone Number
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile number"
            maxLength={10}
            style={inputStyle}
          />

          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "7px",
            }}
          >
            Delivery Address
          </label>

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House number, street, area"
            rows={4}
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />

          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "7px",
            }}
          >
            City
          </label>

          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city"
            style={inputStyle}
          />

          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "7px",
            }}
          >
            Pincode
          </label>

          <input
            type="tel"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="6-digit pincode"
            maxLength={6}
            style={inputStyle}
          />
        </section>

        {/* ERROR / STATUS */}
        {message && (
          <div
            style={{
              background: "#fff0f0",
              color: "#c62828",
              border: "1px solid #ffcaca",
              borderRadius: "10px",
              padding: "14px",
              marginBottom: "18px",
              fontWeight: "600",
            }}
          >
            {message}
          </div>
        )}

        {/* PAYMENT BUTTON */}
        <button
          onClick={startPayment}
          disabled={loading || cart.length === 0}
          style={{
            width: "100%",
            border: "none",
            borderRadius: "12px",
            padding: "17px",
            fontSize: "18px",
            fontWeight: "800",
            background:
              loading || cart.length === 0
                ? "#aaa"
                : "#e6007e",
            color: "#fff",
            cursor:
              loading || cart.length === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loading
            ? "Opening Payment..."
            : `Pay ₹${total.toLocaleString("en-IN")}`}
        </button>

        <p
          style={{
            textAlign: "center",
            color: "#777",
            fontSize: "13px",
            marginTop: "14px",
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
  marginBottom: "17px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "16px",
  outline: "none",
  background: "#fff",
};
