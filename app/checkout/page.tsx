"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Designer Saree",
    price: 1499,
  },
  {
    id: 2,
    name: "Cotton Kurti",
    price: 699,
  },
  {
    id: 3,
    name: "Party Wear Dress",
    price: 1299,
  },
  {
    id: 4,
    name: "Women's Stylish Top",
    price: 499,
  },
];

export default function CheckoutPage() {
  const [cart, setCart] = useState<number[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const cartProducts = cart
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean) as Product[];

  const total = cartProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );

  function placeOrder() {
    if (!name || !phone || !address || !city || !pincode) {
      alert("Please fill all the delivery details.");
      return;
    }

    if (cartProducts.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderItems = cartProducts
      .map(
        (product, index) =>
          `${index + 1}. ${product.name} - ₹${product.price}`
      )
      .join("\n");

    const message = `
🛍️ *NEW ORDER - SINDHU SHOPPING*

👤 *Customer Details*
Name: ${name}
Mobile: ${phone}

📍 *Delivery Address*
${address}
${city} - ${pincode}

🛒 *Order Details*
${orderItems}

💰 *Total: ₹${total}*

Thank you for shopping with Sindhu Shopping ❤️
`;

    const whatsappNumber = "916300267770";

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff7f9",
        fontFamily: "Arial, sans-serif",
        color: "#222",
        paddingBottom: "50px",
      }}
    >
      {/* HEADER */}

      <header
        style={{
          background: "#ffffff",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#e91e63",
            fontSize: "30px",
          }}
        >
          Sindhu Shopping
        </h1>

        <a
          href="/"
          style={{
            background: "#e91e63",
            color: "#fff",
            padding: "14px 22px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Continue Shopping
        </a>
      </header>

      {/* CHECKOUT */}

      <section
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          🛍️ Checkout
        </h2>

        {/* DELIVERY DETAILS */}

        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "20px",
            marginBottom: "25px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontSize: "25px",
              marginTop: 0,
            }}
          >
            Delivery Details
          </h3>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            type="tel"
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="Full Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              ...inputStyle,
              minHeight: "110px",
              resize: "vertical",
            }}
          />

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* ORDER SUMMARY */}

        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontSize: "25px",
              marginTop: 0,
            }}
          >
            Order Summary
          </h3>

          {cartProducts.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cartProducts.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px 0",
                    borderBottom: "1px solid #eee",
                    fontSize: "17px",
                  }}
                >
                  <span>{product.name}</span>

                  <strong>₹{product.price}</strong>
                </div>
              ))}

              {/* TOTAL */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "25px",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                <span>Total</span>

                <span
                  style={{
                    color: "#e91e63",
                  }}
                >
                  ₹{total}
                </span>
              </div>

              {/* WHATSAPP ORDER BUTTON */}

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
            </>
          )}
        </div>
      </section>

      {/* FOOTER */}

      <footer
        style={{
          background: "#222",
          color: "#fff",
          textAlign: "center",
          padding: "40px 20px",
          marginTop: "50px",
        }}
      >
        <h2>Sindhu Shopping</h2>

        <p>
          Women's Fashion • Sarees • Kurtis • Dresses • Tops
        </p>

        <p
          style={{
            color: "#aaa",
          }}
        >
          © 2026 Sindhu Shopping. All rights reserved.
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
