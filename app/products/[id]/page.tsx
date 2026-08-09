"use client";

import { use, useState } from "react";

const products: Record<
  string,
  {
    name: string;
    price: number;
    category: string;
    description: string;
    image: string;
  }
> = {
  "1": {
    name: "Elegant Women's Kurti",
    price: 799,
    category: "Kurtis",
    description:
      "Beautiful and comfortable women's kurti, perfect for daily wear and special occasions.",
    image: "/products/kurti-1.jpg",
  },

  "2": {
    name: "Designer Women's Saree",
    price: 1299,
    category: "Sarees",
    description:
      "Stylish designer saree with an elegant look. Perfect for festivals and celebrations.",
    image: "/products/saree-1.jpg",
  },

  "3": {
    name: "Women's Cotton Dress",
    price: 699,
    category: "Dresses",
    description:
      "Soft and comfortable cotton dress designed for everyday use.",
    image: "/products/dress-1.jpg",
  },

  "4": {
    name: "Women's Anarkali Dress",
    price: 999,
    category: "Anarkali",
    description:
      "Beautiful Anarkali dress with a stylish traditional design.",
    image: "/products/anarkali-1.jpg",
  },
};

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = products[id];

  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main
        style={{
          maxWidth: 1100,
          margin: "50px auto",
          padding: 20,
          textAlign: "center",
        }}
      >
        <h1>Product Not Found</h1>
        <p>The product you are looking for does not exist.</p>

        <a
          href="/products"
          style={{
            display: "inline-block",
            marginTop: 20,
            padding: "12px 24px",
            background: "#111",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none",
          }}
        >
          Back to Products
        </a>
      </main>
    );
  }

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push({
      id,
      name: product.name,
      price: product.price,
      size,
      image: product.image,
      quantity: 1,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    setAdded(true);
  }

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "30px auto",
        padding: "20px",
      }}
    >
      <a
        href="/products"
        style={{
          color: "#555",
          textDecoration: "none",
          fontSize: 16,
        }}
      >
        ← Back to PSR Shopping
      </a>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          marginTop: 30,
        }}
      >
        {/* Product Image */}
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: 16,
            overflow: "hidden",
            minHeight: 450,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: 450,
              objectFit: "cover",
            }}
          />
        </div>

        {/* Product Details */}
        <div style={{ padding: "10px 0" }}>
          <p
            style={{
              color: "#777",
              textTransform: "uppercase",
              fontSize: 14,
              letterSpacing: 1,
            }}
          >
            {product.category}
          </p>

          <h1
            style={{
              fontSize: 36,
              margin: "10px 0",
            }}
          >
            {product.name}
          </h1>

          <h2
            style={{
              fontSize: 28,
              margin: "20px 0",
            }}
          >
            ₹{product.price}
          </h2>

          <p
            style={{
              color: "#555",
              lineHeight: 1.7,
              fontSize: 17,
            }}
          >
            {product.description}
          </p>

          {/* Size */}
          <div style={{ marginTop: 30 }}>
            <h3>Select Size</h3>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
              }}
            >
              {["S", "M", "L", "XL", "XXL"].map((item) => (
                <button
                  key={item}
                  onClick={() => setSize(item)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 8,
                    border:
                      size === item
                        ? "2px solid #111"
                        : "1px solid #ccc",
                    background: size === item ? "#111" : "#fff",
                    color: size === item ? "#fff" : "#111",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={addToCart}
            style={{
              width: "100%",
              marginTop: 30,
              padding: "16px",
              background: added ? "#198754" : "#111",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 18,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {added ? "✓ Added to Cart" : "Add to Cart"}
          </button>

          {added && (
            <a
              href="/cart"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: 15,
                padding: "14px",
                border: "1px solid #111",
                borderRadius: 10,
                color: "#111",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Go to Cart →
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
