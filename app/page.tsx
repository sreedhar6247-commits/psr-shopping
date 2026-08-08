"use client";

import { useState, useEffect } from "react";

const products = [
  {
    id: 1,
    name: "Designer Saree",
    price: 1499,
    category: "Sarees",
    emoji: "🥻",
  },
  {
    id: 2,
    name: "Cotton Kurti",
    price: 699,
    category: "Kurtis",
    emoji: "👗",
  },
  {
    id: 3,
    name: "Party Wear Dress",
    price: 1299,
    category: "Dresses",
    emoji: "👗",
  },
  {
    id: 4,
    name: "Women's Stylish Top",
    price: 499,
    category: "Tops",
    emoji: "👚",
  },
];
export default function HomePage() {
const [cart, setCart] = useState<number[]>([]);
export default function HomePage() {
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);

function addToCart(id: number) {
  const newCart = [...cart, id];

  setCart(newCart);
  localStorage.setItem("cart", JSON.stringify(newCart));
}export default function HomePage() {
  

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff7f9",
        fontFamily: "Arial, sans-serif",
        color: "#222",
      }}
    >
      {/* Header */}
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
  href="/checkout"
  style={{
    fontSize: "18px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "#111",
    cursor: "pointer",
  }}
>
  🛒 Cart ({cart.length})
</a>
        
      </header>

      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "70px 20px",
          background: "#ffe4ec",
        }}
      >
        <h2
          style={{
            fontSize: "44px",
            margin: "0 0 15px",
          }}
        >
          Women's Fashion
        </h2>

        <p
          style={{
            fontSize: "20px",
            marginBottom: "25px",
          }}
        >
          Beautiful clothes for every occasion
        </p>

        <a
          href="#products"
          style={{
            display: "inline-block",
            background: "#e91e63",
            color: "white",
            padding: "15px 30px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Shop Now
        </a>
      </section>

      {/* Categories */}
      <section style={{ padding: "45px 20px" }}>
        <h2 style={{ textAlign: "center", fontSize: "32px" }}>
          Shop by Category
        </h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "25px",
          }}
        >
          {["Sarees", "Kurtis", "Dresses", "Tops", "New Arrivals"].map(
            (category) => (
              <div
                key={category}
                style={{
                  background: "white",
                  padding: "18px 28px",
                  borderRadius: "12px",
                  border: "1px solid #eee",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                {category}
              </div>
            )
          )}
        </div>
      </section>

      {/* Products */}
      <section
        id="products"
        style={{
          padding: "20px",
          maxWidth: "1100px",
          margin: "auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "32px",
            marginBottom: "30px",
          }}
        >
          🛍️ New Arrivals
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                background: "white",
                borderRadius: "15px",
                padding: "18px",
                boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  height: "180px",
                  background: "#f5f5f5",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "80px",
                }}
              >
                {product.emoji}
              </div>

              <p
                style={{
                  color: "#888",
                  marginBottom: "5px",
                }}
              >
                {product.category}
              </p>

              <h3 style={{ margin: "5px 0" }}>{product.name}</h3>

              <p
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  margin: "10px 0",
                }}
              >
                ₹{product.price}
              </p>

              <button
                onClick={() => addToCart(product.id)}
                style={{
                  width: "100%",
                  background: "#e91e63",
                  color: "white",
                  border: "none",
                  padding: "13px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: "50px",
          padding: "30px",
          textAlign: "center",
          background: "#222",
          color: "white",
        }}
      >
        <h3>Sindhu Shopping</h3>
        <p>Women's Fashion Store</p>
        <p>© 2026 Sindhu Shopping</p>
      </footer>
    </main>
  );
}
