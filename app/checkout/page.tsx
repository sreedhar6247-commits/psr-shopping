"use client";

import { FormEvent, useState } from "react";

export default function CheckoutPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      alert("Please enter a valid 6-digit PIN code.");
      return;
    }

    const newOrderNumber =
      "SS" + Date.now().toString().slice(-8);

    setOrderNumber(newOrderNumber);
    setOrderPlaced(true);

    // Clear cart count if your website stores it in localStorage
    localStorage.setItem("cartCount", "0");
  }

  if (orderPlaced) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#fff5f8",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "40px auto",
            background: "white",
            padding: "40px 25px",
            borderRadius: "20px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "60px" }}>✅</div>

          <h1
            style={{
              fontSize: "36px",
              marginBottom: "15px",
              color: "#e91e63",
            }}
          >
            Order Placed!
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#555",
              lineHeight: 1.5,
            }}
          >
            Thank you for shopping with Sindhu Shopping.
          </p>

          <div
            style={{
              background: "#fff0f5",
              padding: "20px",
              borderRadius: "12px",
              margin: "25px 0",
            }}
          >
            <p style={{ margin: 0, fontSize: "16px" }}>
              Your Order Number
            </p>

            <strong
              style={{
                display: "block",
                marginTop: "8px",
                fontSize: "26px",
                color: "#e91e63",
              }}
            >
              {orderNumber}
            </strong>
          </div>

          <p
            style={{
              color: "#666",
              marginBottom: "25px",
            }}
          >
            We have received your order details successfully.
          </p>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            style={{
              background: "#e91e63",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "15px 30px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f7",
        padding: "40px 20px",
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
            fontSize: "48px",
            marginBottom: "10px",
          }}
        >
          Checkout
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Enter your delivery details to place your order.
        </p>

        <form
          onSubmit={placeOrder}
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "18px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
          }}
        >
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />

          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Mobile Number
          </label>

          <input
            type="tel"
            placeholder="10-digit mobile number"
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            required
            maxLength={10}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />

          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Delivery Address
          </label>

          <textarea
            placeholder="House number, street, village/city, district"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={5}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />

          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            PIN Code
          </label>

          <input
            type="text"
            inputMode="numeric"
            placeholder="6-digit PIN code"
            value={pin}
            onChange={(e) =>
              setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
            maxLength={6}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "25px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              background: "#fff0f5",
              padding: "18px",
              borderRadius: "10px",
              marginBottom: "25px",
            }}
          >
            <strong style={{ fontSize: "18px" }}>
              Payment
            </strong>

            <p
              style={{
                marginBottom: 0,
                color: "#555",
              }}
            >
              UPI payment will be added after the order system is connected.
            </p>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              background: "#e91e63",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "17px",
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Place Order
          </button>
        </form>
      </div>
    </main>
  );
}
