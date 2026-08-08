"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }
  }, []);

  function updateCart(updatedCart: CartItem[]) {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  function increaseQuantity(id: string | number) {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    updateCart(updatedCart);
  }

  function decreaseQuantity(id: string | number) {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  }

  function removeItem(id: string | number) {
    const updatedCart = cart.filter((item) => item.id !== id);
    updateCart(updatedCart);
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff5f8",
        padding: "30px 20px 60px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            color: "#e91e63",
            marginBottom: "10px",
          }}
        >
          🛒 Your Cart
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
        </p>

        {cart.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "50px 25px",
              textAlign: "center",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: "60px" }}>🛍️</div>

            <h2
              style={{
                fontSize: "30px",
                margin: "15px 0",
              }}
            >
              Your cart is empty
            </h2>

            <p
              style={{
                color: "#777",
                fontSize: "18px",
                marginBottom: "25px",
              }}
            >
              Add some beautiful clothes to your cart.
            </p>

            <a
              href="/"
              style={{
                display: "inline-block",
                background: "#e91e63",
                color: "white",
                padding: "15px 30px",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "22px",
                  marginBottom: "18px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: "0 0 8px",
                        fontSize: "24px",
                      }}
                    >
                      {item.name}
                    </h2>

                    <p
                      style={{
                        margin: 0,
                        color: "#e91e63",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      border: "none",
                      background: "#ffe5ee",
                      color: "#e91e63",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "20px",
                    gap: "15px",
                  }}
                >
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    style={{
                      width: "42px",
                      height: "42px",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      background: "white",
                      fontSize: "22px",
                      cursor: "pointer",
                    }}
                  >
                    −
                  </button>

                  <strong
                    style={{
                      fontSize: "20px",
                      minWidth: "30px",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </strong>

                  <button
                    onClick={() => increaseQuantity(item.id)}
                    style={{
                      width: "42px",
                      height: "42px",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      background: "white",
                      fontSize: "22px",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>

                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    ₹
                    {(
                      Number(item.price) * item.quantity
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}

            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "25px",
                marginTop: "25px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "25px",
                  fontWeight: "bold",
                  marginBottom: "25px",
                }}
              >
                <span>Total</span>

                <span style={{ color: "#e91e63" }}>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <a
                href="/checkout"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#e91e63",
                  color: "white",
                  padding: "17px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Proceed to Checkout
              </a>

              <a
                href="/"
                style={{
                  display: "block",
                  textAlign: "center",
                  color: "#e91e63",
                  marginTop: "18px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                ← Continue Shopping
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
                    }
