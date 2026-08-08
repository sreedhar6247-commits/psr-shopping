"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  emoji: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Designer Saree",
    price: 1499,
    category: "Sarees",
    emoji: "🥻",
  },
  {
    id: 2,
    name: "Cotton Kurti",
    price: 699,
    category: "Kurtis",
    emoji: "👗",
  },
  {
    id: 3,
    name: "Party Wear Dress",
    price: 1299,
    category: "Dresses",
    emoji: "👗",
  },
  {
    id: 4,
    name: "Women's Stylish Top",
    price: 499,
    category: "Tops",
    emoji: "👚",
  },
];

export default function Home() {
  const [cart, setCart] = useState<number[]>([]);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState<"home" | "cart" | "checkout" | "success">(
    "home"
  );

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (id: number) => {
    setCart((currentCart) => [...currentCart, id]);
  };

  const removeFromCart = (indexToRemove: number) => {
    setCart((currentCart) =>
      currentCart.filter((_, index) => index !== indexToRemove)
    );
  };

  const filteredProducts =
    category === "All"
      ? products
      : products.filter((product) => product.category === category);

  const cartProducts = cart
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => product !== undefined);

  const total = cartProducts.reduce((sum, product) => sum + product.price, 0);

  const goToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setPage("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const placeOrder = () => {
    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!mobile.trim()) {
      alert("Please enter your mobile number.");
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile.trim())) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your full address.");
      return;
    }

    if (!city.trim()) {
      alert("Please enter your city.");
      return;
    }

    if (!/^[0-9]{6}$/.test(pincode.trim())) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    setPage("success");
    setCart([]);
    localStorage.removeItem("cart");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#fff7f9",
      color: "#222",
      fontFamily: "Arial, sans-serif",
    } as React.CSSProperties,

    header: {
      background: "#ffffff",
      padding: "20px 5%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #eee",
      position: "sticky" as const,
      top: 0,
      zIndex: 100,
    },

    logo: {
      margin: 0,
      color: "#e91e63",
      fontSize: "42px",
      fontWeight: "800",
      lineHeight: 1.05,
      cursor: "pointer",
    } as React.CSSProperties,

    cartButton: {
      background: "#e91e63",
      color: "white",
      border: "none",
      borderRadius: "18px",
      padding: "18px 28px",
      fontSize: "22px",
      fontWeight: "bold",
      cursor: "pointer",
    } as React.CSSProperties,

    section: {
      padding: "55px 5%",
      maxWidth: "1200px",
      margin: "0 auto",
    } as React.CSSProperties,

    hero: {
      background: "#ffe4ee",
      textAlign: "center" as const,
      padding: "80px 20px",
    },

    heroTitle: {
      color: "#d81b60",
      fontSize: "64px",
      margin: "0 0 20px",
      fontWeight: "800",
    } as React.CSSProperties,

    heroText: {
      fontSize: "28px",
      color: "#555",
      margin: 0,
    } as React.CSSProperties,

    heading: {
      textAlign: "center" as const,
      fontSize: "46px",
      margin: "30px 0",
    },

    categories: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap" as const,
      gap: "18px",
      marginBottom: "55px",
    },

    categoryButton: {
      padding: "14px 28px",
      borderRadius: "30px",
      border: "2px solid #e91e63",
      background: "white",
      color: "#d81b60",
      fontSize: "20px",
      fontWeight: "bold",
      cursor: "pointer",
    } as React.CSSProperties,

    activeCategory: {
      background: "#e91e63",
      color: "white",
    } as React.CSSProperties,

    products: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "30px",
    },

    productCard: {
      background: "white",
      borderRadius: "25px",
      padding: "25px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.07)",
      textAlign: "center" as const,
    },

    productImage: {
      background: "#fff0f5",
      borderRadius: "20px",
      height: "230px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "100px",
      marginBottom: "20px",
    },

    productName: {
      fontSize: "25px",
      fontWeight: "bold",
      margin: "10px 0",
    },

    productCategory: {
      color: "#777",
      fontSize: "18px",
      margin: "10px 0",
    },

    price: {
      color: "#e91e63",
      fontSize: "30px",
      fontWeight: "bold",
      margin: "15px 0",
    },

    primaryButton: {
      width: "100%",
      padding: "18px",
      background: "#e91e63",
      color: "white",
      border: "none",
      borderRadius: "16px",
      fontSize: "21px",
      fontWeight: "bold",
      cursor: "pointer",
    } as React.CSSProperties,

    card: {
      background: "white",
      borderRadius: "28px",
      padding: "40px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
      marginBottom: "30px",
    },

    footer: {
      background: "#222",
      color: "white",
      textAlign: "center" as const,
      padding: "60px 20px",
      marginTop: "60px",
    },
  };

  return (
    <main style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1
          style={styles.logo}
          onClick={() => {
            setPage("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Sindhu
          <br />
          Shopping
        </h1>

        {page === "checkout" || page === "success" ? (
          <button
            style={styles.cartButton}
            onClick={() => {
              setPage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Continue
            <br />
            Shopping
          </button>
        ) : (
          <button
            style={styles.cartButton}
            onClick={() => {
              setPage("cart");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            🛒 Cart
            <br />({cart.length})
          </button>
        )}
      </header>

      {/* HOME PAGE */}
      {page === "home" && (
        <>
          <section style={styles.hero}>
            <h2 style={styles.heroTitle}>Women's Fashion</h2>
            <p style={styles.heroText}>
              Beautiful clothes at beautiful prices ❤️
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>Shop by Category</h2>

            <div style={styles.categories}>
              {["All", "Sarees", "Kurtis", "Dresses", "Tops"].map(
                (item) => (
                  <button
                    key={item}
                    style={{
                      ...styles.categoryButton,
                      ...(category === item
                        ? styles.activeCategory
                        : {}),
                    }}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <h2 style={styles.heading}>Our Products</h2>

            <div style={styles.products}>
              {filteredProducts.map((product) => (
                <div key={product.id} style={styles.productCard}>
                  <div style={styles.productImage}>{product.emoji}</div>

                  <div style={styles.productName}>{product.name}</div>

                  <div style={styles.productCategory}>
                    {product.category}
                  </div>

                  <div style={styles.price}>₹{product.price}</div>

                  <button
                    style={styles.primaryButton}
                    onClick={() => addToCart(product.id)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* CART PAGE */}
      {page === "cart" && (
        <section style={styles.section}>
          <div style={styles.card}>
            <h2 style={styles.heading}>🛒 Your Cart</h2>

            {cartProducts.length === 0 ? (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "24px", color: "#666" }}>
                  Your cart is empty.
                </p>

                <button
                  style={styles.primaryButton}
                  onClick={() => setPage("home")}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {cartProducts.map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      padding: "25px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      >
                        {product.name}
                      </div>

                      <div
                        style={{
                          color: "#e91e63",
                          fontSize: "22px",
                          marginTop: "8px",
                        }}
                      >
                        ₹{product.price}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      style={{
                        background: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        padding: "14px 22px",
                        fontSize: "18px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "30px",
                    fontSize: "32px",
                    fontWeight: "bold",
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: "#e91e63" }}>₹{total}</span>
                </div>

                <button
                  style={{
                    ...styles.primaryButton,
                    marginTop: "30px",
                  }}
                  onClick={goToCheckout}
                >
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {/* CHECKOUT PAGE */}
      {page === "checkout" && (
        <section style={styles.section}>
          <div style={styles.card}>
            <h2 style={styles.heading}>Delivery Details</h2>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={10}
              style={inputStyle}
            />

            <textarea
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={inputStyle}
            />

            <input
              type="tel"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength={6}
              style={inputStyle}
            />
          </div>

          <div style={styles.card}>
            <h2 style={styles.heading}>Order Summary</h2>

            {cartProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px 0",
                  borderBottom: "1px solid #eee",
                  fontSize: "20px",
                }}
              >
                <span>{product.name}</span>
                <strong>₹{product.price}</strong>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "30px",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              <span>Total</span>

              <span style={{ color: "#e91e63" }}>₹{total}</span>
            </div>

            {/* NORMAL PLACE ORDER BUTTON - NO WHATSAPP */}
            <button
              style={{
                ...styles.primaryButton,
                marginTop: "30px",
                fontSize: "24px",
              }}
              onClick={placeOrder}
            >
              Place Order
            </button>
          </div>
        </section>
      )}

      {/* SUCCESS PAGE */}
      {page === "success" && (
        <section style={styles.section}>
          <div
            style={{
              ...styles.card,
              textAlign: "center",
              padding: "70px 30px",
            }}
          >
            <div style={{ fontSize: "80px" }}>✅</div>

            <h2
              style={{
                fontSize: "42px",
                margin: "20px 0",
                color: "#e91e63",
              }}
            >
              Order Placed Successfully!
            </h2>

            <p
              style={{
                fontSize: "22px",
                color: "#555",
                lineHeight: 1.6,
              }}
            >
              Thank you for shopping with Sindhu Shopping.
              <br />
              We have received your order details.
            </p>

            <button
              style={{
                ...styles.primaryButton,
                maxWidth: "400px",
                marginTop: "25px",
              }}
              onClick={() => {
                setPage("home");
                setName("");
                setMobile("");
                setAddress("");
                setCity("");
                setPincode("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Continue Shopping
            </button>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={styles.footer}>
        <h2 style={{ fontSize: "34px", marginBottom: "20px" }}>
          Sindhu Shopping
        </h2>

        <p
          style={{
            fontSize: "20px",
            lineHeight: 1.6,
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          Women's Fashion • Sarees • Kurtis • Dresses • Tops
        </p>

        <p
          style={{
            fontSize: "18px",
            color: "#aaa",
            marginTop: "35px",
          }}
        >
          © 2026 Sindhu Shopping. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "20px",
  marginBottom: "20px",
  border: "2px solid #ddd",
  borderRadius: "16px",
  fontSize: "20px",
  outline: "none",
  fontFamily: "Arial, sans-serif",
};
