"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCart(savedCart);
    setLoaded(true);
  }, []);

  function saveCart(newCart: CartItem[]) {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function increaseQuantity(index: number) {
    const newCart = [...cart];

    newCart[index].quantity += 1;

    saveCart(newCart);
  }

  function decreaseQuantity(index: number) {
    const newCart = [...cart];

    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
    } else {
      newCart.splice(index, 1);
    }

    saveCart(newCart);
  }

  function removeItem(index: number) {
    const newCart = [...cart];

    newCart.splice(index, 1);

    saveCart(newCart);
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!loaded) {
    return (
      <main
        style={{
          padding: 40,
          textAlign: "center",
          fontFamily: "Arial",
        }}
      >
        Loading cart...
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: 32,
          marginBottom: 30,
        }}
      >
        🛒 Your Cart
      </h1>

      {cart.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 50,
            border: "1px solid #ddd",
            borderRadius: 12,
          }}
        >
          <h2>Your cart is empty.</h2>

          <p style={{ color: "#666" }}>
            Add some beautiful clothes to your cart.
          </p>

          <a
            href="/products"
            style={{
              display: "inline-block",
              marginTop: 20,
              padding: "14px 25px",
              background: "#e91e63",
              color: "white",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <>
          {/* CART ITEMS */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 15,
            }}
          >
            {cart.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${index}`}
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  padding: 15,
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  background: "white",
                }}
              >
                {/* IMAGE */}

                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: 110,
                    height: 130,
                    objectFit: "contain",
                    background: "#f8f8f8",
                    borderRadius: 8,
                  }}
                />

                {/* DETAILS */}

                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 20,
                      margin: "0 0 8px",
                    }}
                  >
                    {item.name}
                  </h2>

                  <p
                    style={{
                      margin: "5px 0",
                      color: "#666",
                    }}
                  >
                    Size: <strong>{item.size}</strong>
                  </p>

                  <p
                    style={{
                      margin: "5px 0",
                      color: "#e91e63",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{item.price}
                  </p>

                  {/* QUANTITY */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginTop: 12,
                    }}
                  >
                    <button
                      onClick={() =>
                        decreaseQuantity(index)
                      }
                      style={{
                        width: 35,
                        height: 35,
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        background: "white",
                        fontSize: 20,
                        cursor: "pointer",
                      }}
                    >
                      −
                    </button>

                    <strong>{item.quantity}</strong>

                    <button
                      onClick={() =>
                        increaseQuantity(index)
                      }
                      style={{
                        width: 35,
                        height: 35,
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        background: "white",
                        fontSize: 20,
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* REMOVE */}

                <button
                  onClick={() => removeItem(index)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#d32f2f",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* TOTAL */}

          <div
            style={{
              marginTop: 30,
              padding: 25,
              border: "1px solid #ddd",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 22,
                fontWeight: "bold",
                marginBottom: 20,
              }}
            >
              <span>Total</span>

              <span style={{ color: "#e91e63" }}>
                ₹{total}
              </span>
            </div>

            {/* CHECKOUT */}

            <a
              href="/checkout"
              style={{
                display: "block",
                textAlign: "center",
                padding: "16px",
                background: "#e91e63",
                color: "white",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Proceed to Checkout
            </a>

            <a
              href="/products"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: 15,
                color: "#555",
                textDecoration: "none",
              }}
            >
              ← Continue Shopping
            </a>
          </div>
        </>
      )}
    </main>
  );
}
