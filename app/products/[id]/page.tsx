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

        <a href="/products">← Back to Products</a>
      </main>
    );
  }

  function addToCart() {
    const existingCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existingItemIndex = existingCart.findIndex(
      (item: any) => item.id === id && item.size === size
    );

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({
        id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        quantity,
      });
    }

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
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <a
        href="/products"
        style={{
          textDecoration: "none",
          color: "#555",
          display: "inline-block",
          marginBottom: 25,
        }}
      >
        ← Back to Products
      </a>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "start",
        }}
      >
        {/* PRODUCT IMAGE */}

        <div
          style={{
            background: "#f8f8f8",
            borderRadius: 15,
            padding: 20,
            textAlign: "center",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              maxHeight: 550,
              objectFit: "contain",
              borderRadius: 12,
            }}
          />
        </div>

        {/* PRODUCT DETAILS */}

        <div>
          <p
            style={{
              color: "#777",
              textTransform: "uppercase",
              fontSize: 14,
            }}
          >
            {product.category}
          </p>

          <h1
            style={{
              fontSize: 36,
              marginBottom: 15,
            }}
          >
            {product.name}
          </h1>

          <h2
            style={{
              fontSize: 28,
              color: "#e91e63",
              marginBottom: 20,
            }}
          >
            ₹{product.price}
          </h2>

          <p
            style={{
              color: "#555",
              lineHeight: 1.7,
              marginBottom: 30,
            }}
          >
            {product.description}
          </p>

          {/* SIZE */}

          <div style={{ marginBottom: 25 }}>
            <h3 style={{ marginBottom: 12 }}>Select Size</h3>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {["XS", "S", "M", "L", "XL", "XXL"].map((item) => (
                <button
                  key={item}
                  onClick={() => setSize(item)}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 8,
                    border:
                      size === item
                        ? "2px solid #e91e63"
                        : "1px solid #ccc",
                    background:
                      size === item ? "#e91e63" : "white",
                    color:
                      size === item ? "white" : "#333",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}

          <div style={{ marginBottom: 25 }}>
            <h3 style={{ marginBottom: 12 }}>Quantity</h3>

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
                  width: 42,
                  height: 42,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  background: "white",
                  fontSize: 22,
                  cursor: "pointer",
                }}
              >
                −
              </button>

              <strong style={{ fontSize: 20 }}>
                {quantity}
              </strong>

              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: 42,
                  height: 42,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  background: "white",
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
              padding: "16px 20px",
              border: "none",
              borderRadius: 10,
              background: added ? "#2e7d32" : "#e91e63",
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: 15,
            }}
          >
            {added ? "✓ Added to Cart" : "Add to Cart"}
          </button>

          {/* GO TO CART */}

          <a
            href="/cart"
            style={{
              display: "block",
              textAlign: "center",
              padding: "15px",
              border: "1px solid #e91e63",
              borderRadius: 10,
              color: "#e91e63",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            🛒 View Cart
          </a>
        </div>
      </div>
    </main>
  );
}
