"use client";

import { useState } from "react";

const products = [
  {
    name: "Elegant Cotton Kurti",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Designer Anarkali Kurti",
    price: 1199,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Beautiful Saree",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Stylish Women Kurti",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Home() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  function toggleWishlist(name: string) {
    setWishlist((old) =>
      old.includes(name)
        ? old.filter((x) => x !== name)
        : [...old, name]
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#fff0f7,#f5efff)",
        fontFamily: "Arial,sans-serif",
        color: "#17172b",
      }}
    >
      <header
        style={{
          padding: "15px 5%",
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 12px #ddd",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#e60073" }}>
            Bee Girl Shopping
          </h2>
          <small>Women's Fashion</small>
        </div>

        <a
          href="/checkout"
          style={{
            background: "#e60073",
            color: "white",
            padding: "11px 18px",
            borderRadius: 25,
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          🛒 Cart
        </a>
      </header>

      <section style={{ padding: "55px 6%", textAlign: "center" }}>
        <p style={{ color: "#e60073", fontWeight: "bold" }}>
          ✨ NEW COLLECTION ✨
        </p>

        <h1
          style={{
            fontSize: "clamp(38px,7vw,70px)",
            margin: "10px 0",
            fontWeight: 800,
          }}
        >
          Beautiful Fashion
          <br />
          Made For You
        </h1>

        <p style={{ fontSize: 18, color: "#666" }}>
          Stylish women's clothing at affordable prices.
          <br />
          Kurtis • Sarees • Dresses • Night Wear
        </p>

        <a
          href="#collection"
          style={{
            display: "inline-block",
            marginTop: 20,
            background: "#e60073",
            color: "white",
            padding: "14px 28px",
            borderRadius: 30,
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Shop Now →
        </a>
      </section>

      <section
        style={{
          margin: "10px 5%",
          padding: 25,
          background: "white",
          borderRadius: 20,
          textAlign: "center",
          boxShadow: "0 4px 20px #ddd",
        }}
      >
        <h2>📍 Our Location</h2>
        <p>Sai Nagar, 7th Cross, Anantapur</p>

        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-block",
            marginTop: 10,
            background: "#25D366",
            color: "white",
            padding: "13px 25px",
            borderRadius: 25,
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          💬 Chat on WhatsApp
        </a>
      </section>

      <section id="collection" style={{ padding: "30px 5%" }}>
        <p style={{ color: "#e60073", fontWeight: "bold" }}>
          OUR COLLECTION
        </p>

        <h1>Women's Fashion</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          {products.map((p) => (
            <div
              key={p.name}
              style={{
                background: "white",
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 4px 15px #ddd",
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 300,
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <div style={{ padding: 15 }}>
                <button
                  onClick={() => toggleWishlist(p.name)}
                  style={{
                    float: "right",
                    border: 0,
                    background: "none",
                    fontSize: 25,
                    cursor: "pointer",
                  }}
                >
                  {wishlist.includes(p.name) ? "❤️" : "♡"}
                </button>

                <small style={{ color: "#e60073" }}>
                  Fashion
                </small>

                <h3>{p.name}</h3>

                <h2 style={{ color: "#e60073" }}>
                  ₹{p.price}
                </h2>

                <a
                  href="/checkout"
                  style={{
                    display: "block",
                    textAlign: "center",
                    background: "#e60073",
                    color: "white",
                    padding: 12,
                    borderRadius: 25,
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Select Size & Colour
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer
        style={{
          marginTop: 40,
          padding: 30,
          background: "#17172b",
          color: "white",
          textAlign: "center",
        }}
      >
        <h2>Bee Girl Shopping</h2>
        <p>Fashion • Style • Comfort</p>
        <p>📍 Sai Nagar, 7th Cross, Anantapur</p>
        <p>© 2026 Bee Girl Shopping</p>
      </footer>
    </main>
  );
}
