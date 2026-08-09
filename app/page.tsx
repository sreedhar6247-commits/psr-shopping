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

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Products error:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (document.getElementById("razorpay-script")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);
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
    (total, item) => total + item.price * item.quantity,
    0
  );

  async function handleCheckout() {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (cartTotal <= 0) {
      alert("Invalid cart amount.");
      return;
    }

    setPaying(true);

    try {
      /*
       * IMPORTANT:
       * Send the amount to your server.
       * The server creates the Razorpay order.
       */
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: cartTotal,
        }),
      });

      const data = await response.json();

      console.log("Razorpay order response:", data);

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to create Razorpay order."
        );
      }

      /*
       * Your API returns:
       * {
       *   id: order.id,
       *   amount: order.amount,
       *   currency: order.currency
       * }
       *
       * We MUST use data.id here.
       */
      if (!data?.id) {
        console.error("Missing Razorpay order ID:", data);
        throw new Error("Razorpay order ID is missing.");
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout is still loading. Please try again."
        );
      }

      const options = {
        key: data.key || undefined,

        amount: data.amount,
        currency: data.currency || "INR",

        name: "Sindhu Shopping",
        description: "Women's Clothing",
        order_id: data.id,

        handler: function (paymentResponse: any) {
          console.log("Payment successful:", paymentResponse);

          alert(
            "Payment successful!\nPayment ID: " +
              paymentResponse.razorpay_payment_id
          );

          setCart([]);
          setCartOpen(false);
        },

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        theme: {
          color: "#000000",
        },

        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
      };

      /*
       * If the server does not return the public key,
       * use the environment-injected key through this fallback.
       *
       * The actual key should be returned by your API.
       */
      if (!options.key) {
        alert(
          "Razorpay public key is missing. Please check your Vercel environment variables."
        );
        setPaying(false);
        return;
      }

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response);

        alert(
          "Payment failed.\n\n" +
            (response?.error?.description ||
              "Please try again.")
        );

        setPaying(false);
      });

      razorpay.open();
    } catch (error: any) {
      console.error("Checkout error:", error);

      alert(
        error?.message ||
          "Unable to start payment. Please try again."
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
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <header
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              fontWeight: 800,
            }}
          >
            🛍️ Bee Girl Shopping
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "18px",
              color: "#555",
            }}
          >
            Women&apos;s Clothing
          </p>
        </div>

        <button
          onClick={() => setCartOpen(true)}
          style={{
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            padding: "15px 20px",
            fontSize: "16px",
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
        <div
          style={{
            background: "#f2f2f2",
            borderRadius: "20px",
            padding: "35px 20px",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "42px",
            }}
          >
            Bee girl Shopping
          </h2>

          <p
            style={{
              fontSize: "20px",
              color: "#555",
            }}
          >
            Beautiful women&apos;s clothing
          </p>
        </div>

        {loading ? (
          <p
            style={{
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            No products available.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "25px",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "18px",
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "280px",
                    objectFit: "cover",
                    display: "block",
                    background: "#eee",
                  }}
                />

                <div
                  style={{
                    padding: "18px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 6px",
                      color: "#777",
                      fontSize: "14px",
                    }}
                  >
                    {product.category}
                  </p>

                  <h3
                    style={{
                      margin: "0 0 8px",
                      fontSize: "22px",
                    }}
                  >
                    {product.name}
                  </h3>

                  <p
                    style={{
                      color: "#555",
                      minHeight: "45px",
                    }}
                  >
                    {product.description}
                  </p>

                  <h2
                    style={{
                      margin: "12px 0",
                    }}
                  >
                    ₹{product.price}
                  </h2>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    style={{
                      width: "100%",
                      padding: "14px",
                      border: "none",
                      borderRadius: "10px",
                      background:
                        product.stock > 0
                          ? "#000"
                          : "#aaa",
                      color: "#fff",
                      cursor:
                        product.stock > 0
                          ? "pointer"
                          : "not-allowed",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    {product.stock > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {cartOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#fff",
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
                  margin: 0,
                  fontSize: "30px",
                }}
              >
                🛒 Your Cart
              </h2>

              <button
                onClick={() => setCartOpen(false)}
                style={{
                  border: "none",
                  background: "#eee",
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  fontSize: "25px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "50px 0",
                  fontSize: "20px",
                }}
              >
                Your cart is empty.
              </p>
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
                        borderBottom: "1px solid #ddd",
                        padding: "15px 0",
                      }}
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />

                      <div
                        style={{
                          flex: 1,
                        }}
                      >
                        <h3
                          style={{
                            margin: "0 0 5px",
                          }}
                        >
                          {item.name}
                        </h3>

                        <p
                          style={{
                            margin: "0 0 8px",
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
                              decreaseQuantity(item.id)
                            }
                            style={{
                              width: "32px",
                              height: "32px",
                              border: "1px solid #ccc",
                              borderRadius: "6px",
                              background: "#fff",
                              cursor: "pointer",
                            }}
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            style={{
                              width: "32px",
                              height: "32px",
                              border: "1px solid #ccc",
                              borderRadius: "6px",
                              background: "#fff",
                              cursor: "pointer",
                            }}
                          >
                            +
                          </button>

                          <button
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            style={{
                              marginLeft: "10px",
                              border: "none",
                              background: "none",
                              color: "red",
                              cursor: "pointer",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <strong>
                        ₹{item.price * item.quantity}
                      </strong>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "24px",
                    fontWeight: 700,
                    padding: "25px 0",
                  }}
                >
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={paying}
                  style={{
                    width: "100%",
                    padding: "18px",
                    border: "none",
                    borderRadius: "12px",
                    background: paying ? "#777" : "#000",
                    color: "#fff",
                    fontSize: "20px",
                    fontWeight: 700,
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
