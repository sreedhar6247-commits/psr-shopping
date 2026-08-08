"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");

      if (savedCart) {
        const items = JSON.parse(savedCart);
        setCart(items);

        const amount = items.reduce(
          (sum: number, item: any) =>
            sum +
            Number(item.price || 0) * Number(item.quantity || 1),
          0
        );

        setTotal(amount);
      }
    } catch (error) {
      console.log("Cart error:", error);
    }
  }, []);

  function placeOrder() {
    if (!name || !phone || !address || !city || !state || !pincode) {
      alert("Please fill all details.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    let message = `🛍️ *NEW ORDER - BEEGIRL SHOPPING*%0A%0A`;

    message += `👤 *Customer Details*%0A`;
    message += `Name: ${name}%0A`;
    message += `Phone: ${phone}%0A`;
    message += `Address: ${address}%0A`;
    message += `City: ${city}%0A`;
    message += `State: ${state}%0A`;
    message += `Pincode: ${pincode}%0A%0A`;

    message += `🛒 *Order Details*%0A`;

    cart.forEach((item: any, index: number) => {
      const quantity = Number(item.quantity || 1);
      const price = Number(item.price || 0);
      const itemTotal = price * quantity;

      message += `${index + 1}. ${item.name}%0A`;
      message += `   Qty: ${quantity}%0A`;
      message += `   Price: ₹${price}%0A`;
      message += `   Total: ₹${itemTotal}%0A%0A`;
    });

    message += `💰 *TOTAL: ₹${total}*%0A%0A`;
    message += `Thank you for shopping with Sindhu Shopping ❤️`;

    /*
      CHANGE THIS NUMBER TO YOUR WHATSAPP NUMBER.

      IMPORTANT:
      Include country code.
      India = 91

      Example:
      919876543210
    */

    const whatsappNumber = "919876543210";

    const whatsappURL =
      `https://wa.me/${whatsappNumber}?text=${message}`;

    window.location.href = whatsappURL;
  }

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        Sindhu Shopping
      </h1>

      <p style={{ textAlign: "center" }}>
        Complete your order
      </p>

      <section
        style={{
          marginTop: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "12px",
        }}
      >
        <h2>Customer Details</h2>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
          type="tel"
        />

        <textarea
          placeholder="Full Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{
            ...inputStyle,
            minHeight: "100px",
          }}
        />

        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          style={inputStyle}
          type="number"
        />
      </section>

      <section
        style={{
          marginTop: "25px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "12px",
        }}
      >
        <h2>Order Summary</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item: any, index: number) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span>
                {item.name} × {item.quantity || 1}
              </span>

              <strong>
                ₹
                {Number(item.price || 0) *
                  Number(item.quantity || 1)}
              </strong>
            </div>
          ))
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "25px",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          <span>Total</span>

          <span style={{ color: "#e91e63" }}>
            ₹{total}
          </span>
        </div>
      </section>

      <button
        onClick={placeOrder}
        style={{
          width: "100%",
          marginTop: "30px",
          padding: "18px",
          background: "#25D366",
          color: "#ffffff",
          border: "none",
          borderRadius: "12px",
          fontSize: "20px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        📱 Place Order on WhatsApp
      </button>

      <footer
        style={{
          textAlign: "center",
          marginTop: "50px",
          padding: "30px",
          background: "#222",
          color: "#fff",
          borderRadius: "12px",
        }}
      >
        <h2>Beegirl Shopping</h2>
        <p>Women's Fashion • Sarees • Kurtis</p>
        <p style={{ color: "#aaa" }}>
          © 2026 Sindhu Shopping
        </p>
      </footer>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "16px",
  marginTop: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "16px",
  outline: "none",
};
