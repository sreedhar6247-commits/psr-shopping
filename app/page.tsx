"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  const [cartOpen, setCartOpen] = useState(false);
  const [paying, setPaying] = useState(false);

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
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function increaseQuantity(id: number) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(id: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id: number) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  async function handleCheckout() {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setPaying(true);

      const response = await fetch(
        "/api/razorpay/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: cartTotal,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not create payment order."
        );
      }

      if (!data.orderId || !data.key) {
        throw new Error(
          "Razorpay order information is missing."
        );
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        const options = {
          key: data.key,
          amount: data.amount,
          currency: "INR",
          name: "Sindhu Shopping",
          description: "Women's Clothing",
          order_id: data.orderId,

          handler: async function (payment: any) {
            try {
              const verifyResponse = await fetch(
                "/api/razorpay/verify",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payment),
                }
              );

              const verifyData =
                await verifyResponse.json();

              if (verifyData.success) {
                alert(
                  "Payment successful! Thank you for shopping with Sindhu Shopping."
                );

                setCart([]);
                setCartOpen(false);
              } else {
                alert(
                  "Payment verification failed."
                );
              }
            } catch (error) {
              console.error(error);
              alert(
                "Payment verification failed."
              );
            } finally {
              setPaying(false);
            }
          },

          modal: {
            ondismiss: function () {
              setPaying(false);
            },
          },

          theme: {
            color: "#111111",
          },
        };

        const razorpay =
          new window.Razorpay(options);

        razorpay.on(
          "payment.failed",
          function (response: any) {
            console.error(
              "Payment failed:",
              response
            );

            alert(
              "Payment failed. Please try again."
            );

            setPaying(false);
          }
        );

        razorpay.open();
      };

      script.onerror = () => {
        alert(
          "Unable to load Razorpay checkout."
        );

        setPaying(false);
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to start payment."
      );

      setPaying(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#111111",
        padding: "30px",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "36px",
              margin: 0,
            }}
          >
            🛍️ Sindhu Shopping
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#666666",
            }}
          >
            Women's Clothing
          </p>
        </div>

        <button
          onClick={() => setCartOpen(true)}
          style={{
            background: "#111111",
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            padding: "14px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          🛒 Cart ({cartCount})
        </button>
      </header>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
          }}
        >
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
          }}
        >
          <h2>No products available</h2>
          <p>
            Please add products to your store.
          </p>
        </div>
      ) : (
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #eeeeee",
                borderRadius: "16px",
                overflow: "hidden",
                background: "#ffffff",
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src={product.image_url}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "260px",
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  padding: "18px",
                }}
              >
                <p
                  style={{
                    color: "#777777",
                    fontSize: "14px",
                  }}
                >
                  {product.category}
                </p>

                <h2
                  style={{
                    margin: "6px 0",
                    fontSize: "20px",
                  }}
                >
                  {product.name}
                </h2>

                <p
                  style={{
                    color: "#666666",
                    fontSize: "14px",
                    minHeight: "40px",
                  }}
                >
                  {product.description}
                </p>

                <strong
                  style={{
                    display: "block",
                    fontSize: "22px",
                    margin: "12px 0",
                  }}
                >
                  ₹{product.price}
                </strong>

                <button
                  onClick={() =>
                    addToCart(product)
                  }
                  disabled={product.stock <= 0}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "none",
                    borderRadius: "10px",
                    background:
                      product.stock > 0
                        ? "#111111"
                        : "#cccccc",
                    color: "#ffffff",
                    cursor:
                      product.stock > 0
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  {product.stock > 0
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {cartOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "20px",
              padding: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "30px",
                  margin: 0,
                }}
              >
                🛒 Your Cart
              </h2>

              <button
                onClick={() =>
                  setCartOpen(false)
                }
                style={{
                  border: "none",
                  background: "#eeeeee",
                  borderRadius: "50%",
                  width: "45px",
                  height: "45px",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "50px 10px",
                }}
              >
                <h3>Your cart is empty</h3>
                <p>
                  Add some beautiful clothes
                  to continue.
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    marginTop: "25px",
                  }}
                >
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                        borderBottom:
                          "1px solid #eeeeee",
                        padding:
                          "15px 0",
                      }}
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={{
                          width: "75px",
                          height: "75px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />

                      <div
                        style={{
                          flex: 1,
                        }}
                      >
                        <strong>
                          {item.name}
                        </strong>

                        <p
                          style={{
                            margin:
                              "5px 0",
                          }}
                        >
                          ₹{item.price}
                        </p>

                        <div>
                          <button
                            onClick={() =>
                              decreaseQuantity(
                                item.id
                              )
                            }
                            style={{
                              padding:
                                "5px 10px",
                            }}
                          >
                            −
                          </button>

                          <span
                            style={{
                              margin:
                                "0 12px",
                            }}
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(
                                item.id
                              )
                            }
                            style={{
                              padding:
                                "5px 10px",
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                        style={{
                          border: "none",
                          background:
                            "transparent",
                          color: "#cc0000",
                          cursor:
                            "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginTop: "25px",
                  }}
                >
                  <span>Total</span>
                  <span>
                    ₹{cartTotal}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={paying}
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    padding: "16px",
                    border: "none",
                    borderRadius: "12px",
                    background: "#111111",
                    color: "#ffffff",
                    fontSize: "18px",
                    fontWeight: "bold",
                    cursor: paying
                      ? "wait"
                      : "pointer",
                  }}
                >
                  {paying
                    ? "Opening Payment..."
                    : "Proceed to Checkout"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
