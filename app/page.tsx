"use client";

import { useEffect, useState } from "react";

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
  const [category, setCategory] = useState("All");

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
  }

  function removeFromCart(id: number) {
    const index = cart.indexOf(id);

    if (index === -1) {
      return;
    }

    const newCart = [...cart];
    newCart.splice(index, 1);

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  const categories = [
    "All",
    "Sarees",
    "Kurtis",
    "Dresses",
    "Tops",
  ];

  const filteredProducts =
    category === "All"
      ? products
      : products.filter((product) => product.category === category);

  const cartTotal = cart.reduce((total, id) => {
    const product = products.find((item) => item.id === id);

    return total + (product ? product.price : 0);
  }, 0);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff7f9",
        fontFamily: "Arial, sans-serif",
        color: "#222",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "#ffffff",
          padding: "18px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eeeeee",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#e91e63",
            fontSize: "28px",
          }}
        >
          Sindhu Shopping
        </h1>

        <a
          href="#cart"
          style={{
            textDecoration: "none",
            color: "#ffffff",
            background: "#e91e63",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          🛒 Cart ({cart.length})
        </a>
      </header>

      {/* HERO */}
      <section
        style={{
          textAlign: "center",
          padding: "45px 20px",
          background: "#ffe4ed",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            margin: "0 0 10px",
            color: "#d81b60",
          }}
        >
          Women's Fashion
        </h2>

        <p
          style={{
            fontSize: "18px",
            margin: 0,
            color: "#555",
          }}
        >
          Beautiful clothes at beautiful prices ❤️
        </p>
      </section>

      {/* CATEGORIES */}
      <section
        style={{
          padding: "25px 20px 10px",
          textAlign: "center",
        }}
      >
        <h2>Shop by Category</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              style={{
                padding: "10px 18px",
                borderRadius: "20px",
                border: "1px solid #e91e63",
                background:
                  category === item ? "#e91e63" : "#ffffff",
                color:
                  category === item ? "#ffffff" : "#e91e63",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        style={{
          padding: "25px 20px",
          maxWidth: "1100px",
          margin: "auto",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Our Products</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                background: "#ffffff",
                borderRadius: "15px",
                padding: "20px",
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "80px",
                  background: "#fff0f5",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "15px",
                }}
              >
                {product.emoji}
              </div>

              <h3 style={{ margin: "10px 0" }}>
                {product.name}
              </h3>

              <p
                style={{
                  color: "#777",
                  margin: "5px 0",
                }}
              >
                {product.category}
              </p>

              <p
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "#e91e63",
                }}
              >
                ₹{product.price}
              </p>

              <button
                onClick={() => addToCart(product.id)}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#e91e63",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CART */}
      <section
        id="cart"
        style={{
          padding: "30px 20px",
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "15px",
            padding: "25px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <h2>🛒 Your Cart</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map((id, index) => {
                const product = products.find(
                  (item) => item.id === id
                );

                if (!product) {
                  return null;
                }

                return (
                  <div
                    key={`${id}-${index}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid #eeeeee",
                    }}
                  >
                    <div>
                      <strong>{product.name}</strong>
                      <div style={{ color: "#e91e63" }}>
                        ₹{product.price}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(id)}
                      style={{
                        background: "#f44336",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}

              <h2 style={{ textAlign: "right" }}>
                Total: ₹{cartTotal}
              </h2>

              <a
                href="/checkout"
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                  background: "#e91e63",
                  color: "#ffffff",
                  padding: "14px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginTop: "15px",
                }}
              >
                Proceed to Checkout
              </a>
            </>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#222",
          color: "#ffffff",
          textAlign: "center",
          padding: "25px 20px",
          marginTop: "30px",
        }}
      >
        <h3>Sindhu Shopping</h3>

        <p>
          Women's Fashion • Sarees • Kurtis • Dresses • Tops
        </p>

        <p style={{ color: "#bbbbbb" }}>
          © 2026 Sindhu Shopping. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
