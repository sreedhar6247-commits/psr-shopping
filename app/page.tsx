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
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading products:", error);
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
                quantity: Math.min(
                  item.quantity + 1,
                  product.stock
                ),
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
              quantity: Math.min(
                item.quantity + 1,
                item.stock
              ),
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

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff7fa",
        padding: "30px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              fontWeight: 800,
              color: "#171717",
            }}
          >
            Sindhu Shopping
          </h1>

          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              fontSize: "20px",
              color: "#555",
            }}
          >
            Women's Clothing
          </p>
        </div>

        {/* CART BUTTON */}
        <button
          onClick={() => setCartOpen(true)}
          style={{
            border: "none",
            background: "#171717",
            color: "white",
            borderRadius: "12px",
            padding: "14px 20px",
            fontSize: "17px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🛒 Cart ({cartCount})
        </button>
      </header>

      {/* PRODUCTS */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {loading ? (
          <p
            style={{
              fontSize: "20px",
              textAlign: "center",
              padding: "50px",
            }}
          >
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <p
            style={{
              fontSize: "20px",
              textAlign: "center",
              padding: "50px",
            }}
          >
            No products available.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "white",
                  border: "1px solid #e5e5e5",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.06)",
                }}
              >
                {/* PRODUCT IMAGE */}
                <div
                  style={{
                    width: "100%",
                    height: "280px",
                    background: "#eeeeee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        color: "#888",
                        fontSize: "22px",
                      }}
                    >
                      Product Image
                    </span>
                  )}
                </div>

                {/* PRODUCT DETAILS */}
                <div
                  style={{
                    padding: "18px",
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 8px",
                      fontSize: "22px",
                      color: "#171717",
                    }}
                  >
                    {product.name}
                  </h2>

                  <p
                    style={{
                      margin: "5px 0",
                      color: "#777",
                      fontSize: "14px",
                    }}
                  >
                    {product.category}
                  </p>

                  <p
                    style={{
                      margin: "12px 0",
                      color: "#444",
                      lineHeight: 1.5,
                    }}
                  >
                    {product.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "18px",
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "24px",
                        color: "#111",
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
                        border: "none",
                        background:
                          product.stock > 0
                            ? "#171717"
                            : "#aaa",
                        color: "white",
                        borderRadius: "10px",
                        padding:
                          "12px 16px",
                        fontSize: "15px",
                        fontWeight: "bold",
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
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CART OVERLAY */}
      {cartOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.45)",
            zIndex: 1000,
          }}
          onClick={() => setCartOpen(false)}
        >
          {/* CART PANEL */}
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              width: "min(500px, 100%)",
              background: "white",
              padding: "30px",
              boxSizing: "border-box",
              overflowY: "auto",
            }}
          >
            {/* CART HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "32px",
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
                  width: "48px",
                  height: "48px",
                  fontSize: "28px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {/* EMPTY CART */}
            {cart.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 10px",
                  color: "#777",
                }}
              >
                <div
                  style={{
                    fontSize: "60px",
                  }}
                >
                  🛒
                </div>

                <h3
                  style={{
                    fontSize: "24px",
                    color: "#333",
                  }}
                >
                  Your cart is empty
                </h3>

                <p>
                  Add some products to your
                  cart.
                </p>
              </div>
            ) : (
              <>
                {/* CART ITEMS */}
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: "15px",
                      paddingBottom: "20px",
                      marginBottom: "20px",
                      borderBottom:
                        "1px solid #eeeeee",
                    }}
                  >
                    <div
                      style={{
                        width: "100px",
                        height: "120px",
                        flexShrink: 0,
                        background: "#eeeeee",
                        borderRadius: "10px",
                        overflow: "hidden",
                      }}
                    >
                      {item.image_url ? (
                        <img
                          src={
                            item.image_url
                          }
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit:
                              "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            height: "100%",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            color: "#888",
                            fontSize: "12px",
                            textAlign:
                              "center",
                          }}
                        >
                          Product
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        flex: 1,
                      }}
                    >
                      <h3
                        style={{
                          margin:
                            "0 0 8px",
                          fontSize: "19px",
                        }}
                      >
                        {item.name}
                      </h3>

                      <p
                        style={{
                          margin:
                            "0 0 12px",
                          fontSize: "18px",
                        }}
                      >
                        ₹{item.price}
                      </p>

                      {/* QUANTITY */}
                      <div
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: "12px",
                        }}
                      >
                        <button
                          onClick={() =>
                            decreaseQuantity(
                              item.id
                            )
                          }
                          style={{
                            width: "40px",
                            height: "40px",
                            border:
                              "1px solid #ddd",
                            background:
                              "white",
                            borderRadius:
                              "8px",
                            fontSize:
                              "22px",
                            cursor:
                              "pointer",
                          }}
                        >
                          −
                        </button>

                        <strong
                          style={{
                            fontSize:
                              "18px",
                            minWidth:
                              "20px",
                            textAlign:
                              "center",
                          }}
                        >
                          {item.quantity}
                        </strong>

                        <button
                          onClick={() =>
                            increaseQuantity(
                              item.id
                            )
                          }
                          style={{
                            width: "40px",
                            height: "40px",
                            border:
                              "1px solid #ddd",
                            background:
                              "white",
                            borderRadius:
                              "8px",
                            fontSize:
                              "22px",
                            cursor:
                              "pointer",
                          }}
                        >
                          +
                        </button>

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
                            color: "#d11",
                            cursor:
                              "pointer",
                            marginLeft:
                              "auto",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* TOTAL */}
                <div
                  style={{
                    borderTop:
                      "3px solid #171717",
                    paddingTop: "25px",
                    marginTop: "10px",
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
                    <strong
                      style={{
                        fontSize: "28px",
                      }}
                    >
                      Total
                    </strong>

                    <strong
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      ₹{cartTotal}
                    </strong>
                  </div>

                  {/* NO WHATSAPP BUTTON */}
                  <div
                    style={{
                      marginTop: "25px",
                      padding: "18px",
                      background: "#f5f5f5",
                      borderRadius: "12px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "15px",
                      }}
                    >
                      Your cart is ready.
                    </p>

                    <p
                      style={{
                        margin:
                          "8px 0 0",
                        fontSize: "13px",
                      }}
                    >
                      Checkout will be
                      added here.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
          }
