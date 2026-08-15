"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
  colours: string[];
};

const products: Product[] = [
  {
    id: 1,
    name: "Elegant Cotton Kurti",
    price: 799,
    category: "Kurtis",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=85",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colours: ["Blue", "Black", "Pink"],
  },
  {
    id: 2,
    name: "Designer Anarkali Kurti",
    price: 1199,
    category: "Kurtis",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    sizes: ["S", "M", "L", "XL"],
    colours: ["Pink", "Red", "Green"],
  },
  {
    id: 3,
    name: "Beautiful Saree",
    price: 999,
    category: "Sarees",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85",
    sizes: ["Free Size"],
    colours: ["Red", "Blue", "Green"],
  },
  {
    id: 4,
    name: "Stylish Women Kurti",
    price: 899,
    category: "Kurtis",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colours: ["Yellow", "Blue", "Pink"],
  },
];

export default function Home() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [size, setSize] = useState("");
  const [colour, setColour] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bee-girl-shopping-cart");
      if (saved) {
        const cart = JSON.parse(saved);
        setCartCount(cart.length);
      }

      const savedWish = localStorage.getItem("bee-girl-wishlist");
      if (savedWish) setWishlist(JSON.parse(savedWish));
    } catch {}
  }, []);

  function openProduct(product: Product) {
    setSelected(product);
    setSize("");
    setColour("");
    setMessage("");
  }

  function toggleWishlist(id: number) {
    const updated = wishlist.includes(id)
      ? wishlist.filter((x) => x !== id)
      : [...wishlist, id];

    setWishlist(updated);
    localStorage.setItem("bee-girl-wishlist", JSON.stringify(updated));
  }

  function addToCart() {
    if (!selected) return;

    if (!size) {
      setMessage("Please select a size.");
      return;
    }

    if (!colour) {
      setMessage("Please select a colour.");
      return;
    }

    const item = {
      id: selected.id,
      name: selected.name,
      price: selected.price,
      size,
      color: colour,
      quantity: 1,
    };

    let cart: any[] = [];

    try {
      const saved = localStorage.getItem("bee-girl-shopping-cart");
      if (saved) cart = JSON.parse(saved);
    } catch {}

    const existing = cart.find(
      (x) =>
        x.id === item.id &&
        x.size === item.size &&
        x.color === item.color
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push(item);
    }

    localStorage.setItem(
      "bee-girl-shopping-cart",
      JSON.stringify(cart)
    );

    setCartCount(cart.length);
    setSelected(null);
    setMessage("");
  }

  const filtered =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <main className="site">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #fff4fa;
          color: #17172b;
        }

        .site {
          min-height: 100vh;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: white;
          padding: 14px 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 15px rgba(0,0,0,.1);
        }

        .brand {
          color: #e60073;
          font-size: 22px;
          font-weight: 800;
        }

        .tag {
          font-size: 12px;
          color: #777;
          margin-top: 3px;
        }

        .cart {
          background: #e60073;
          color: white;
          border: 0;
          border-radius: 30px;
          padding: 12px 18px;
          font-weight: bold;
          cursor: pointer;
        }

        .hero {
          padding: 65px 6%;
          text-align: center;
          background:
            radial-gradient(circle at top left,#ffd5ec,transparent 40%),
            linear-gradient(135deg,#fff1f8,#f2eaff);
        }

        .hero-small {
          color: #e60073;
          font-weight: bold;
          letter-spacing: 2px;
        }

        .hero h1 {
          font-size: clamp(42px,8vw,76px);
          line-height: 1.05;
          margin: 15px 0;
        }

        .hero p {
          color: #666;
          font-size: 18px;
          line-height: 1.6;
        }

        .shop {
          display: inline-block;
          margin-top: 15px;
          background: #e60073;
          color: white;
          padding: 15px 28px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: bold;
        }

        .info {
          margin: 25px auto;
          max-width: 900px;
          background: white;
          padding: 25px;
          border-radius: 22px;
          text-align: center;
          box-shadow: 0 5px 25px rgba(0,0,0,.08);
        }

        .whatsapp {
          display: inline-block;
          margin-top: 12px;
          background: #25d366;
          color: white;
          padding: 13px 22px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: bold;
        }

        .collection {
          padding: 35px 5%;
        }

        .categories {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 10px 0 25px;
        }

        .category {
          border: 1px solid #ddd;
          background: white;
          padding: 10px 18px;
          border-radius: 25px;
          white-space: nowrap;
          cursor: pointer;
        }

        .category.active {
          background: #e60073;
          color: white;
          border-color: #e60073;
        }

        .products {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
          gap: 20px;
        }

        .card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,.1);
          position: relative;
        }

        .product-img {
          width: 100%;
          height: 330px;
          object-fit: cover;
          display: block;
          background: #eee;
        }

        .heart {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 50%;
          background: white;
          font-size: 23px;
          cursor: pointer;
          box-shadow: 0 2px 10px #aaa;
        }

        .card-body {
          padding: 16px;
        }

        .category-name {
          color: #e60073;
          font-size: 13px;
          font-weight: bold;
        }

        .price {
          color: #e60073;
          font-size: 21px;
          font-weight: bold;
        }

        .select {
          width: 100%;
          border: 0;
          background: #e60073;
          color: white;
          padding: 13px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
        }

        .footer {
          margin-top: 50px;
          padding: 35px;
          text-align: center;
          background: #17172b;
          color: white;
        }

        .modal-bg {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.65);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal {
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 25px;
          padding: 20px;
        }

        .modal-img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          border-radius: 18px;
        }

        .options {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .option {
          border: 1px solid #ccc;
          background: white;
          padding: 10px 16px;
          border-radius: 20px;
          cursor: pointer;
        }

        .option.selected {
          background: #e60073;
          color: white;
          border-color: #e60073;
        }

        .add {
          width: 100%;
          margin-top: 20px;
          padding: 15px;
          border: 0;
          border-radius: 25px;
          background: #e60073;
          color: white;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
        }

        .close {
          width: 100%;
          margin-top: 8px;
          padding: 12px;
          border: 0;
          background: #eee;
          border-radius: 25px;
          cursor: pointer;
        }

        .error {
          color: #d00000;
          text-align: center;
          font-weight: bold;
          margin-top: 12px;
        }
      `}</style>

      <header className="header">
        <div>
          <div className="brand">🌸 Bee Girl Shopping</div>
          <div className="tag">Women's Fashion • Style • Comfort</div>
        </div>

        <button
          className="cart"
          onClick={() => (window.location.href = "/checkout")}
        >
          🛒 Cart ({cartCount})
        </button>
      </header>

      <section className="hero">
        <div className="hero-small">✨ NEW COLLECTION ✨</div>

        <h1>
          Beautiful Fashion
          <br />
          Made For You
        </h1>

        <p>
          Discover stylish women's clothing at affordable prices.
          <br />
          Kurtis • Sarees • Dresses • Night Wear
        </p>

        <a className="shop" href="#collection">
          Shop Now →
        </a>
      </section>

      <section className="info">
        <h3>📍 Our Location</h3>
        <p>Sai Nagar, 7th Cross, Anantapur</p>

        <a
          className="whatsapp"
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noreferrer"
        >
          💬 Chat on WhatsApp
        </a>
      </section>

      <section id="collection" className="collection">
        <div style={{ color: "#e60073", fontWeight: "bold" }}>
          OUR COLLECTION
        </div>

        <h2>Women's Fashion</h2>

        <div className="categories">
          {["All", "Kurtis", "Sarees"].map((c) => (
            <button
              key={c}
              className={`category ${
                category === c ? "active" : ""
              }`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="products">
          {filtered.map((p) => (
            <div className="card" key={p.id}>
              <img
                className="product-img"
                src={p.image}
                alt={p.name}
              />

              <button
                className="heart"
                onClick={() => toggleWishlist(p.id)}
              >
                {wishlist.includes(p.id) ? "❤️" : "♡"}
              </button>

              <div className="card-body">
                <div className="category-name">
                  {p.category}
                </div>

                <h3>{p.name}</h3>

                <div className="price">₹{p.price}</div>

                <button
                  className="select"
                  onClick={() => openProduct(p)}
                >
                  Select Size & Colour
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <h2>🌸 Bee Girl Shopping</h2>
        <p>Fashion • Style • Comfort</p>
        <p>📍 Sai Nagar, 7th Cross, Anantapur</p>
        <p>💬 WhatsApp Support Available</p>
        <p>© 2026 Bee Girl Shopping</p>
      </footer>

      {selected && (
        <div className="modal-bg">
          <div className="modal">
            <img
              className="modal-img"
              src={selected.image}
              alt={selected.name}
            />

            <h2>{selected.name}</h2>

            <h2 style={{ color: "#e60073" }}>
              ₹{selected.price}
            </h2>

            <h3>Select Size</h3>

            <div className="options">
              {selected.sizes.map((s) => (
                <button
                  key={s}
                  className={`option ${
                    size === s ? "selected" : ""
                  }`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <h3>Select Colour</h3>

            <div className="options">
              {selected.colours.map((c) => (
                <button
                  key={c}
                  className={`option ${
                    colour === c ? "selected" : ""
                  }`}
                  onClick={() => setColour(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            {message && <div className="error">{message}</div>}

            <button className="add" onClick={addToCart}>
              🛒 Add To Cart
            </button>

            <button
              className="close"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
