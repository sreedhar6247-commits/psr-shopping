"use client";

import { useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Elegant Blue Floral Suit",
    category: "Suits",
    description: "Beautiful floral printed women's suit set.",
    price: 1299,
    image: "/products/download.webp",
  },
  {
    id: 2,
    name: "Black Floral Skirt Set",
    category: "Western Wear",
    description: "Stylish black floral skirt with white top.",
    price: 999,
    image: "/products/shopping.webp",
  },
  {
    id: 3,
    name: "Navy Blue Designer Lehenga",
    category: "Lehengas",
    description: "Elegant navy blue embroidered lehenga set.",
    price: 2499,
    image: "/products/images.jpeg",
  },
  {
    id: 4,
    name: "Mustard Printed Suit",
    category: "Suits",
    description: "Traditional mustard yellow printed suit set.",
    price: 1199,
    image: "/products/images%20(1).jpeg",
  },
];

export default function Home() {
  const [cart, setCart] = useState<Product[]>([]);

  function addToCart(product: Product) {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  }

  return (
    <main
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          Sindhu Shopping
        </h1>

        <p
          style={{
            fontSize: "22px",
            color: "#555",
          }}
        >
          Women&apos;s Clothing
        </p>

        <p
          style={{
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          🛒 Cart: {cart.length}
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "15px",
              padding: "15px",
              background: "#fff",
              boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "350px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            <h2
              style={{
                fontSize: "22px",
                marginTop: "18px",
                marginBottom: "8px",
              }}
            >
              {product.name}
            </h2>

            <p
              style={{
                color: "#777",
                marginBottom: "8px",
              }}
            >
              {product.category}
            </p>

            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
              }}
            >
              {product.description}
            </p>

            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                margin: "15px 0",
              }}
            >
              ₹{product.price}
            </p>

            <button
              onClick={() => addToCart(product)}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "8px",
                background: "#111",
                color: "#fff",
                fontSize: "17px",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}
