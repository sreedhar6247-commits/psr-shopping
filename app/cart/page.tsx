"use client";

import { useEffect, useMemo, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image?: string;
};

const CART_KEY = "bee-girl-shopping-cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      setCart(Array.isArray(stored) ? stored : []);
    } catch {
      setCart([]);
    }
  }, []);

  function saveCart(nextCart: CartItem[]) {
    setCart(nextCart);
    localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
  }

  function increase(item: CartItem) {
    saveCart(
      cart.map((entry) =>
        entry.id === item.id &&
        entry.size === item.size &&
        entry.color === item.color
          ? { ...entry, quantity: entry.quantity + 1 }
          : entry
      )
    );
  }

  function decrease(item: CartItem) {
    const next = cart
      .map((entry) =>
        entry.id === item.id &&
        entry.size === item.size &&
        entry.color === item.color
          ? { ...entry, quantity: Math.max(0, entry.quantity - 1) }
          : entry
      )
      .filter((entry) => entry.quantity > 0);

    saveCart(next);
  }

  function remove(item: CartItem) {
    saveCart(
      cart.filter(
        (entry) =>
          !(
            entry.id === item.id &&
            entry.size === item.size &&
            entry.color === item.color
          )
      )
    );
  }

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  if (cart.length === 0) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#fbf7ff,#f0e7ff)",
          padding: "30px 20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 850,
            margin: "0 auto",
            background: "#fff",
            borderRadius: 28,
            padding: "60px 25px",
            textAlign: "center",
            boxShadow: "0 15px 50px rgba(50,20,90,.10)",
          }}
        >
          <div style={{ fontSize: 60 }}>🛒</div>

          <h1
            style={{
              color: "#5f2c91",
              marginBottom: 10,
            }}
          >
            Your Cart is Empty
          </h1>

          <p style={{ color: "#777" }}>
            Add something beautiful from Bee Girl Shopping.
          </p>

          <a
            href="/"
            style={{
              display: "inline-block",
              marginTop: 20,
              background: "#6f35a8",
              color: "#fff",
              padding: "14px 28px",
              borderRadius: 30,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Continue Shopping
          </a>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#fbf7ff,#f0e7ff)",
        padding: "25px 18px 60px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 15,
            marginBottom: 25,
            flexWrap: "wrap",
          }}
        >
          <div>
            <a
              href="/"
              style={{
                color: "#6f35a8",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              ← Continue Shopping
            </a>

            <h1
              style={{
                margin: "12px 0 4px",
                color: "#35184f",
              }}
            >
              My Cart
            </h1>

            <p style={{ margin: 0, color: "#777" }}>
              {totalItems} item
              {totalItems === 1 ? "" : "s"} in your cart
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              padding: "12px 18px",
              borderRadius: 20,
              boxShadow: "0 5px 20px rgba(0,0,0,.07)",
              color: "#6f35a8",
              fontWeight: 700,
            }}
          >
            Bee Girl Shopping 🌸
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) 330px",
            gap: 22,
            alignItems: "start",
          }}
        >
          <section>
            {cart.map((item) => (
              <article
                key={`${item.id}-${item.size}-${item.color}`}
                style={{
                  background: "#fff",
                  borderRadius: 22,
                  padding: 16,
                  marginBottom: 15,
                  display: "grid",
                  gridTemplateColumns: "100px minmax(0,1fr) auto",
                  gap: 18,
                  alignItems: "center",
                  boxShadow:
                    "0 8px 25px rgba(50,20,90,.08)",
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 120,
                    borderRadius: 15,
                    overflow: "hidden",
                    background: "#eee",
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                        color: "#999",
                      }}
                    >
                      🌸
                    </div>
                  )}
                </div>

                <div>
                  <h2
                    style={{
                      margin: "0 0 8px",
                      color: "#35184f",
                      fontSize: 20,
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
                      color: "#666",
                    }}
                  >
                    Colour: <strong>{item.color}</strong>
                  </p>

                  <div
                    style={{
                      color: "#6f35a8",
                      fontSize: 20,
                      fontWeight: 800,
                      marginTop: 8,
                    }}
                  >
                    ₹{item.price}
                  </div>
                </div>

                <div
                  style={{
                    minWidth: 130,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <button
                      onClick={() => decrease(item)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: "1px solid #ddd",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: 20,
                      }}
                    >
                      −
                    </button>

                    <strong
                      style={{
                        minWidth: 25,
                      }}
                    >
                      {item.quantity}
                    </strong>

                    <button
                      onClick={() => increase(item)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: "0",
                        background: "#6f35a8",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: 20,
                      }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => remove(item)}
                    style={{
                      marginTop: 12,
                      border: 0,
                      background: "transparent",
                      color: "#c0392b",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside
            style={{
              background: "#fff",
              borderRadius: 25,
              padding: 22,
              boxShadow:
                "0 10px 30px rgba(50,20,90,.10)",
              position: "sticky",
              top: 20,
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: "#35184f",
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "15px 0",
                color: "#666",
              }}
            >
              <span>Items</span>
              <strong>{totalItems}</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "15px 0",
                color: "#666",
              }}
            >
              <span>Subtotal</span>
              <strong>₹{subtotal}</strong>
            </div>

            <div
              style={{
                borderTop: "1px solid #eee",
                margin: "18px 0",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 22,
                color: "#35184f",
                fontWeight: 800,
              }}
            >
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>

            <a
              href="/checkout"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: 22,
                background:
                  "linear-gradient(135deg,#6f35a8,#8d52c7)",
                color: "#fff",
                padding: "15px 20px",
                borderRadius: 30,
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Proceed to Checkout →
            </a>

            <p
              style={{
                textAlign: "center",
                color: "#888",
                fontSize: 12,
                marginTop: 14,
              }}
            >
              Secure checkout • Bee Girl Shopping
            </p>
          </aside>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 800px) {
          main {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          section {
            width: 100%;
          }

          article {
            grid-template-columns: 80px minmax(0, 1fr) !important;
          }

          article > div:last-child {
            grid-column: 1 / -1;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          aside {
            position: static !important;
          }

          main > div > div {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          article {
            grid-template-columns: 70px minmax(0, 1fr) !important;
            gap: 12px !important;
          }

          article > div:first-child {
            width: 70px !important;
            height: 90px !important;
          }

          article h2 {
            font-size: 16px !important;
          }

          article p {
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}
