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
  const [message, setMessage] = useState("");

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

  async function loadRazorpayScript() {
    if (window.Razorpay) {
      return true;
    }

    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }

  async function startPayment() {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setPaying(true);
      setMessage("");

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert(
          "Razorpay could not be loaded. Please check your internet connection."
        );

        setPaying(false);
        return;
      }

      const orderResponse = await fetch(
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

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        alert(
          orderData.error ||
            "Unable to create payment order."
        );

        setPaying(false);
        return;
      }

      if (!orderData.id || !orderData.keyId) {
        alert(
          "Razorpay order information is missing."
        );

        setPaying(false);
        return;
      }

      const options = {
        key: orderData.keyId,

        amount: orderData.amount,

        currency: orderData.currency,

        name: "Bee Girl Shopping",

        description:
          "Women's Clothing Purchase",

        order_id: orderData.id,

        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch(
              "/api/razorpay/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }),
              }
            );

            const verifyData =
              await verifyResponse.json();

            if (
              verifyResponse.ok &&
              verifyData.success
            ) {
              setCart([]);
              setCartOpen(false);
              setMessage(
                "Payment successful! Thank you for shopping with Bee Girl Shopping."
              );

              alert(
                "Payment successful! 🎉\n\nThank you for shopping with Bee Girl Shopping."
              );
            } else {
              alert(
                verifyData.error ||
                  "Payment verification failed."
              );
            }
          } catch (error) {
            console.error(error);

            alert(
              "Payment was completed, but verification could not be completed. Please contact us."
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
          color: "#000000",
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
            response?.error?.description ||
              "Payment failed. Please try again."
          );

          setPaying(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong while starting payment."
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
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "42px",
              margin: 0,
              fontWeight: 800,
            }}
          >
            🛍️ Sindhu Shopping
          </h1>

          <p
            style={{
              fontSize: "20px",
              marginTop: "8px",
            }}
          >
            Women&apos;s Clothing
          </p>
        </div>

        <button
          onClick={() => setCartOpen(true)}
          style={{
            background: "#000000",
            color: "#ffffff",
            border: "none",
            borderRadius: "14px",
            padding: "16px 22px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          🛒 Cart ({cartCount})
        </button>
      </header>

      {message && (
        <div
          style={{
            background: "#e8f7e8",
            border: "1px solid #79c879",
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "25px",
            fontSize: "18px",
          }}
        >
          {message}
        </div>
      )}

      {loading ? (
        <p style={{ fontSize: "20px" }}>
          Loading products...
        </p>
      ) : products.length === 0 ? (
        <p style={{ fontSize: "20px" }}>
          No products available.
        </p>
      ) : (
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "25px",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #dddddd",
                borderRadius: "18px",
                overflow: "hidden",
                background: "#ffffff",
              }}
            >
              <img
                src={product.image_url}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  background: "#eeeeee",
                }}
              />

              <div style={{ padding: "20px" }}>
                <p
                  style={{
                    color: "#777777",
                    marginBottom: "6px",
                  }}
                >
                  {product.category}
                </p>

                <h2
                  style={{
                    margin: "5px 0",
                    fontSize: "24px",
                  }}
                >
                  {product.name}
                </h2>

                <p
                  style={{
                    color: "#555555",
                    minHeight: "45px",
                  }}
                >
                  {product.description}
                </p>

                <h3
                  style={{
                    fontSize: "24px",
                    margin: "15px 0",
                  }}
                >
                  ₹{product.price}
                </h3>

                <button
                  onClick={() =>
                    addToCart(product)
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#000000",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "17px",
                    cursor: "pointer",
                  }}
                >
                  Add to Cart
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
            background: "rgba(0,0,0,0.6)",
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
              color: "#111111",
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
                justifyContent: "space-between",
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
                onClick={() => setCartOpen(false)}
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
              <p
                style={{
                  fontSize: "20px",
                  marginTop: "40px",
                  textAlign: "center",
                }}
              >
                Your cart is empty.
              </p>
            ) : (
              <>
                <div style={{ marginTop: "25px" }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                        padding: "15px 0",
                        borderBottom:
                          "1px solid #dddddd",
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
                            margin: "5px 0",
                          }}
                        >
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
                            onClick={() =>
                              decreaseQuantity(
                                item.id
                              )
                            }
                            style={{
                              width: "32px",
                              height: "32px",
                              border: "1px solid #ccc",
                              background:
                                "#ffffff",
                              borderRadius: "6px",
                            }}
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(
                                item.id
                              )
                            }
                            style={{
                              width: "32px",
                              height: "32px",
                              border: "1px solid #ccc",
                              background:
                                "#ffffff",
                              borderRadius: "6px",
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        style={{
                          border: "none",
                          background: "#eeeeee",
                          borderRadius: "8px",
                          padding: "8px",
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
                    marginTop: "25px",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  <span>Total</span>

                  <span>
                    ₹{cartTotal}
                  </span>
                </div>

                <button
                  onClick={startPayment}
                  disabled={paying}
                  style={{
                    width: "100%",
                    marginTop: "25px",
                    padding: "18px",
                    background: paying
                      ? "#777777"
                      : "#000000",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "19px",
                    fontWeight: "bold",
                    cursor: paying
                      ? "not-allowed"
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
