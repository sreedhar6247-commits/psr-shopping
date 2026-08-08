"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
};

type CartItem = Product & {
  quantity: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  function addToCart(product: Product) {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  }

  function increaseQuantity(id: number) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(id: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff7f9",
        padding: "25px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          maxWidth: "1100px",
          margin: "0 auto 35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "38px",
              color: "#222",
            }}
          >
            Sindhu Shopping
          </h1>

          <p
            style={{
              marginTop: "8px",
              fontSize: "20px",
              color: "#666",
            }}
          >
            Women&apos;s Clothing
          </p>
        </div>

        <button
          onClick={() => setShowCart(true)}
          style={{
            border: "none",
            borderRadius: "12px",
            background: "#111",
            color: "white",
            padding: "14px 20px",
            fontSize: "17px",
            cursor: "pointer",
          }}
        >
          🛒 Cart ({cartCount})
        </button>
      </header>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {loading ? (
          <p style={{ fontSize: "20px" }}>Loading products...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "22px",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "14px",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "14px",
                  }}
                />

                <h2
                  style={{
                    fontSize: "20px",
                    margin: "15px 0 8px",
                  }}
                >
                  {product.name}
                </h2>

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
                    color: "#555",
                    minHeight: "45px",
                  }}
                >
                  {product.description}
                </p>

                <strong
                  style={{
                    display: "block",
                    fontSize: "24px",
                    margin: "12px 0",
                  }}
                >
                  ₹{product.price}
                </strong>

                <button
                  onClick={() => addToCart(product)}
                  style={{
                    width: "100%",
                    padding: "13px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#111",
                    color: "white",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  🛒 Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {showCart && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 1000,
          }}
          onClick={() => setShowCart(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(430px, 100%)",
              height: "100%",
              background: "white",
              padding: "25px",
              overflowY: "auto",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>🛒 Your Cart</h2>

              <button
                onClick={() => setShowCart(false)}
                style={{
                  border: "none",
                  background: "#eee",
                  borderRadius: "50%",
                  width: "38px",
                  height: "38px",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <p style={{ color: "#777", marginTop: "30px" }}>
                Your cart is empty.
              </p>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "15px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{
                        width: "80px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <strong>{item.name}</strong>

                      <p style={{ margin: "6px 0" }}>
                        ₹{item.price}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          style={{
                            width: "30px",
                            height: "30px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            background: "white",
                            cursor: "pointer",
                          }}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          style={{
                            width: "30px",
                            height: "30px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            background: "white",
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    marginTop: "25px",
                    paddingTop: "20px",
                    borderTop: "2px solid #111",
                  }}
                >
                  <h2>Total: ₹{cartTotal}</h2>

                  <button
                    style={{
                      width: "100%",
                      padding: "15px",
                      border: "none",
                      borderRadius: "10px",
                      background: "#25D366",
                      color: "white",
                      fontSize: "17px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const message = cart
                        .map(
                          (item) =>
                            `${item.name} x ${item.quantity} = ₹${
                              item.price * item.quantity
                            }`
                        )
                        .join("\n");

                      const whatsappMessage =
                        `Hello Sindhu Shopping! I want to order:\n\n${message}\n\nTotal: ₹${cartTotal}`;

                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(
                          whatsappMessage
                        )}`,
                        "_blank"
                      );
                    }}
                  >
                    📲 Order on WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
