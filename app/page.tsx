export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff7f9",
        fontFamily: "Arial, sans-serif",
        color: "#222",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#ffffff",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
        }}
      >
        <h1 style={{ margin: 0, color: "#e91e63" }}>
          Sindhu Shopping
        </h1>

        <div style={{ fontSize: "16px" }}>
          🛒 Cart
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "#ffe4ec",
        }}
      >
        <h2 style={{ fontSize: "42px", margin: "0 0 15px" }}>
          Women's Fashion
        </h2>

        <p style={{ fontSize: "20px", marginBottom: "25px" }}>
          Beautiful clothes for every occasion
        </p>

        <a
          href="#products"
          style={{
            display: "inline-block",
            background: "#e91e63",
            color: "white",
            padding: "14px 30px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Shop Now
        </a>
      </section>

      {/* Categories */}
      <section style={{ padding: "35px 20px" }}>
        <h2 style={{ textAlign: "center" }}>Shop by Category</h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          {["Sarees", "Kurtis", "Dresses", "Tops", "New Arrivals"].map(
            (category) => (
              <div
                key={category}
                style={{
                  background: "white",
                  padding: "15px 22px",
                  borderRadius: "10px",
                  border: "1px solid #eee",
                  fontWeight: "bold",
                }}
              >
                {category}
              </div>
            )
          )}
        </div>
      </section>

      {/* Products */}
      <section id="products" style={{ padding: "20px" }}>
        <h2 style={{ textAlign: "center" }}>Featured Products</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            maxWidth: "1100px",
            margin: "25px auto",
          }}
        >
          {[
            ["👗", "Designer Dress", "₹999"],
            ["🥻", "Beautiful Saree", "₹1,299"],
            ["👚", "Women's Kurti", "₹799"],
            ["👕", "Fashion Top", "₹599"],
          ].map(([emoji, name, price]) => (
            <div
              key={name}
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "20px",
                textAlign: "center",
                boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontSize: "80px", padding: "20px" }}>
                {emoji}
              </div>

              <h3>{name}</h3>

              <p
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "#e91e63",
                }}
              >
                {price}
              </p>

              <button
                style={{
                  background: "#e91e63",
                  color: "white",
                  border: "none",
                  padding: "12px 25px",
                  borderRadius: "7px",
                  fontWeight: "bold",
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "30px",
          background: "#222",
          color: "white",
          marginTop: "30px",
        }}
      >
        <h3>Sindhu Shopping</h3>
        <p>Women's Fashion Store</p>
        <p>© 2026 Sindhu Shopping</p>
      </footer>
    </main>
  );
              }
