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
        console.error(error);
        setLoading(false);
      });
  }, []);

  // Add product to cart
  function addToCart(product: Product) {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

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

  // Increase quantity
  function increaseQuantity(id: number) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  // Decrease quantity
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

  // Remove item completely
  function removeFromCart(id: number) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

  // Number of products in cart
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff7fb",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          maxWidth: "1200px",
          margin: "0 auto 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              color: "#222",
            }}
          >
            Sindhu Shopping
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#666",
              fontSize: "16px",
            }}
          >
            Women's Clothing
          </p>
        </div>

        {/* CART BUTTON */}
        <button
          onClick={() => setCartOpen(true)}
          style={{
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "14px 20px",
            fontSize: "16px",
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
              textAlign: "center",
              fontSize: "18px",
              color: "#666",
            }}
          >
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              fontSize: "18px",
              color: "#666",
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
              gap: "25px",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "15px",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                {/* PRODUCT IMAGE */}
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "280px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "280px",
                      background: "#ddd",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      color: "#888",
                    }}
                  >
                    No Image
                  </div>
                )}

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
                    minHeight: "40px",
                  }}
                >
                  {product.description}
                </p>

                <h3
                  style={{
                    fontSize: "20px",
                    margin: "12px 0",
                  }}
                >
                  ₹{product.price}
                </h3>

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  style={{
                    width: "100%",
                    padding: "13px",
                    border: "none",
                    borderRadius: "8px",
                    background:
                      product.stock > 0 ? "#111" : "#aaa",
                    color: "#fff",
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
            ))}
          </div>
        )}
      </section>

      {/* CART WINDOW */}
      {cartOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "18px",
              padding: "30px",
            }}
          >
            {/* CART HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "32px",
                  margin: 0,
                }}
              >
                🛒 Your Cart
              </h2>

              <button
                onClick={() => setCartOpen(false)}
                style={{
                  border: "none",
                  background: "#eee",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  fontSize: "25px",
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
                  padding: "70px 20px",
                }}
              >
                <div style={{ fontSize: "60px" }}>
                  🛒
                </div>

                <h3>Your cart is empty</h3>

                <p style={{ color: "#777" }}>
                  Add some beautiful clothes to your cart.
                </p>

                <button
                  onClick={() => setCartOpen(false)}
                  style={{
                    background: "#111",
                    color: "#fff",
                    border: "none",
                    padding: "14px 25px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* CART ITEMS */}
                <div style={{ marginTop: "30px" }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                        padding: "20px 0",
                        borderBottom:
                          "1px solid #ddd",
                      }}
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          style={{
                            width: "110px",
                            height: "130px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "110px",
                            height: "130px",
                            background: "#ddd",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          Image
                        </div>
                      )}

                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            margin: "0 0 8px",
                          }}
                        >
                          {item.name}
                        </h3>

                        <p
                          style={{
                            fontSize: "18px",
                            margin: "5px 0 15px",
                          }}
                        >
                          ₹{item.price}
                        </p>

                        {/* QUANTITY */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <button
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            style={{
                              width: "42px",
                              height: "42px",
                              background: "#fff",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              fontSize: "22px",
                              cursor: "pointer",
                            }}
                          >
                            −
                          </button>

                          <strong
                            style={{
                              fontSize: "20px",
                              minWidth: "25px",
                              textAlign: "center",
                            }}
                          >
                            {item.quantity}
                          </strong>

                          <button
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            style={{
                              width: "42px",
                              height: "42px",
                              background: "#fff",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              fontSize: "22px",
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
                              color: "#d22",
                              fontSize: "16px",
                              cursor: "pointer",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <strong
                        style={{
                          fontSize: "18px",
                        }}
                      >
                        ₹{item.price * item.quantity}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "30px",
                    paddingTop: "20px",
                    borderTop: "3px solid #111",
                  }}
                >
                  <h2>Total</h2>

                  <h2>₹{cartTotal}</h2>
                </div>

                {/* CHECKOUT */}
                <button
                  onClick={() => {
                    alert(
                      "Checkout will be connected to online payment soon."
                    );
                  }}
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    padding: "18px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#111",
                    color: "#fff",
                    fontSize: "20px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
                      }
