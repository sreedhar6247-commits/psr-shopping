"use client";

import { use, useState } from "react";
import Link from "next/link";

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
  const [quantity, setQuantity] = useState(1);
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

        <Link
          href="/products"
          style={{
            display: "inline-block",
            marginTop: 20,
            padding: "12px 24px",
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 8,
          }}
        >
          ← Back to Products
        </Link>
      </main>
    );
  }

  function addToCart() {
    const cartItem = {
      id,
      name: product.name,
      price: product.price,
      size,
      quantity,
      image: product.image,
    };

    const existingCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    existingCart.push(cartItem);

    localStorage.setItem("cart", JSON.stringify(existingCart));

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "30px 20px 60px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Link
        href="/products"
        style={{
          textDecoration: "none",
          color: "#555",
          fontSize: 16,
        }}
      >
        ← Back to Products
      </Link>

      <div
        style={{
          marginTop: 25,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "start",
        }}
      >
        {/* PRODUCT IMAGE */}
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            background: "#f5f5f5",
            minHeight: 450,
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: 450,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* PRODUCT DETAILS */}
        <div>
          <p
            style={{
              color: "#777",
              fontSize: 16,
              marginBottom: 8,
            }}
          >
            {product.category}
          </p>

          <h1
            style={{
              fontSize: 36,
              margin: "0 0 15px",
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: "#666",
            }}
          >
            {product.description}
          </p>

          <h2
            style={{
              fontSize: 32,
              margin: "25px 0",
            }}
          >
            ₹{product.price}
          </h2>

          {/* SIZE */}
          <div style={{ marginBottom: 25 }}>
            <h3
              style={{
                marginBottom: 12,
                fontSize: 18,
              }}
            >
              Select Size
            </h3>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {["S", "M", "L", "XL", "XXL"].map((item) => (
                <button
                  key={item}
                  onClick={() => setSize(item)}
                  style={{
                    width: 58,
                    height: 48,
                    borderRadius: 8,
                    border:
                      size === item
                        ? "2px solid #000"
                        : "1px solid #ccc",
                    background:
                      size === item ? "#000" : "#fff",
                    color:
                      size === item ? "#fff" : "#000",
                    fontSize: 16,
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>

            <p
              style={{
                marginTop: 10,
                color: "#555",
              }}
            >
              Selected size: <strong>{size}</strong>
            </p>
          </div>

          {/* QUANTITY */}
          <div style={{ marginBottom: 25 }}>
            <h3
              style={{
                marginBottom: 12,
                fontSize: 18,
              }}
            >
              Quantity
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 15,
              }}
            >
              <button
                onClick={() =>
                  setQuantity(Math.max(1, quantity - 1))
                }
                style={{
                  width: 45,
                  height: 45,
                  border: "1px solid #ccc",
                  background: "#fff",
                  borderRadius: 8,
                  fontSize: 22,
                  cursor: "pointer",
                }}
              >
                −
              </button>

              <strong
                style={{
                  fontSize: 20,
                  minWidth: 25,
                  textAlign: "center",
                }}
              >
                {quantity}
              </strong>

              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: 45,
                  height: 45,
                  border: "1px solid #ccc",
                  background: "#fff",
                  borderRadius: 8,
                  fontSize: 22,
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={addToCart}
            style={{
              width: "100%",
              padding: "18px",
              border: "none",
              borderRadius: 10,
              background: "#000",
              color: "#fff",
              fontSize: 19,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {added ? "✓ Added to Cart" : "Add to Cart"}
          </button>

          {added && (
            <Link
              href="/cart"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: 15,
                padding: "14px",
                border: "1px solid #000",
                borderRadius: 10,
                textDecoration: "none",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              View Cart
            </Link>
          )}
        </div>
      </div>

      {/* MOBILE RESPONSIVE STYLE */}
      <style jsx>{`
        @media (max-width: 700px) {
          main > div {
            grid-template-columns: 1fr !important;
            gap: 25px !important;
          }

          h1 {
            font-size: 28px !important;
          }
        }
      `}</style>
    </main>
  );
}
