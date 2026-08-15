"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
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
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=85",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colours: ["Blue", "Black", "Pink"],
  },
  {
    id: 2,
    name: "Designer Anarkali Kurti",
    price: 1199,
    category: "Kurtis",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85",
    sizes: ["S", "M", "L", "XL"],
    colours: ["Pink", "Red", "Green"],
  },
  {
    id: 3,
    name: "Beautiful Party Saree",
    price: 999,
    category: "Sarees",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=85",
    sizes: ["Free Size"],
    colours: ["Red", "Blue", "Green"],
  },
  {
    id: 4,
    name: "Premium Silk Saree",
    price: 1499,
    category: "Sarees",
    image:
      "https://images.unsplash.com/photo-1610189012906-4c7b0d1b8e85?auto=format&fit=crop&w=800&q=85",
    sizes: ["Free Size"],
    colours: ["Purple", "Green", "Pink"],
  },
  {
    id: 5,
    name: "Bridal Lehenga",
    price: 2499,
    category: "Lehengas",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=85",
    sizes: ["S", "M", "L", "XL"],
    colours: ["Maroon", "Pink", "Red"],
  },
  {
    id: 6,
    name: "Designer Lehenga",
    price: 1999,
    category: "Lehengas",
    image:
      "https://images.unsplash.com/photo-1583391733970-7d8e2e6b5f4e?auto=format&fit=crop&w=800&q=85",
    sizes: ["S", "M", "L", "XL"],
    colours: ["Pink", "Blue", "Wine"],
  },
  {
    id: 7,
    name: "Comfort Night Suit",
    price: 699,
    category: "Night Wear",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85",
    sizes: ["M", "L", "XL", "XXL"],
    colours: ["Pink", "Blue", "Purple"],
  },
  {
    id: 8,
    name: "Soft Cotton Night Wear",
    price: 749,
    category: "Night Wear",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85",
    sizes: ["M", "L", "XL", "XXL"],
    colours: ["Blue", "Grey", "Pink"],
  },
];

const categories = [
  {
    name: "Kurtis",
    title: "Elegant Kurtis",
    subtitle: "Everyday style with beautiful designs",
    image: products[0].image,
  },
  {
    name: "Sarees",
    title: "Graceful Sarees",
    subtitle: "Traditional beauty with a modern touch",
    image: products[2].image,
  },
  {
    name: "Lehengas",
    title: "Designer Lehengas",
    subtitle: "Perfect for celebrations",
    image: products[4].image,
  },
  {
    name: "Night Wear",
    title: "Comfort Night Wear",
    subtitle: "Relax in comfort and style",
    image: products[6].image,
  },
];

export default function Home() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [size, setSize] = useState("");
  const [colour, setColour] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const cart = JSON.parse(
        localStorage.getItem("bee-girl-shopping-cart") || "[]"
      );

      setCartCount(
        cart.reduce(
          (total: number, item: any) =>
            total + Number(item.quantity || 1),
          0
        )
      );

      const wish = JSON.parse(
        localStorage.getItem("bee-girl-wishlist") || "[]"
      );

      setWishlist(wish);
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

    localStorage.setItem(
      "bee-girl-wishlist",
      JSON.stringify(updated)
    );
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

    let cart: any[] = [];

    try {
      cart = JSON.parse(
        localStorage.getItem("bee-girl-shopping-cart") || "[]"
      );
    } catch {
      cart = [];
    }

    const existing = cart.find(
      (item) =>
        item.id === selected.id &&
        item.size === size &&
        item.color === colour
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: selected.id,
        name: selected.name,
        price: selected.price,
        size,
        color: colour,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "bee-girl-shopping-cart",
      JSON.stringify(cart)
    );

    setCartCount(
      cart.reduce(
        (total, item) => total + Number(item.quantity || 1),
        0
      )
    );

    setSelected(null);
  }

  function showCategory(category: string) {
    const element = document.getElementById(category);
    element?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #f8f5ff;
          color: #18182b;
        }

        button {
          font-family: inherit;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,.96);
          backdrop-filter: blur(12px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 5%;
          box-shadow: 0 3px 18px rgba(0,0,0,.08);
        }

        .brand {
          color: #7137c8;
          font-size: 23px;
          font-weight: 800;
        }

        .tag {
          color: #777;
          font-size: 12px;
          margin-top: 3px;
        }

        .cartButton {
          border: 0;
          background: #7137c8;
          color: white;
          padding: 12px 20px;
          border-radius: 30px;
          font-weight: bold;
          cursor: pointer;
        }

        .hero {
          min-height: 550px;
          padding: 80px 6%;
          display: grid;
          grid-template-columns: 1.1fr .9fr;
          gap: 40px;
          align-items: center;
          background:
            radial-gradient(circle at 15% 20%, #ead9ff, transparent 35%),
            linear-gradient(135deg,#faf6ff,#eee5ff);
        }

        .heroText small {
          color: #7137c8;
          font-weight: bold;
          letter-spacing: 3px;
        }

        .hero h1 {
          font-size: clamp(45px,7vw,78px);
          line-height: 1.02;
          margin: 18px 0;
        }

        .hero p {
          color: #666;
          font-size: 18px;
          line-height: 1.7;
        }

        .shopButton {
          display: inline-block;
          margin-top: 15px;
          background: #7137c8;
          color: white;
          padding: 15px 28px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: bold;
        }

        .heroImage {
          width: 100%;
          height: 470px;
          object-fit: cover;
          border-radius: 35px;
          box-shadow: 0 20px 50px rgba(70,30,120,.2);
        }

        .location {
          margin: 30px 5%;
          padding: 25px;
          background: white;
          border-radius: 25px;
          text-align: center;
          box-shadow: 0 8px 30px rgba(0,0,0,.08);
        }

        .whatsapp {
          display: inline-block;
          background: #20c96b;
          color: white;
          text-decoration: none;
          padding: 12px 22px;
          border-radius: 25px;
          font-weight: bold;
        }

        .categoryNav {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          padding: 25px 5%;
        }

        .categoryNav button {
          border: 0;
          background: white;
          padding: 12px 22px;
          border-radius: 25px;
          cursor: pointer;
          box-shadow: 0 3px 12px rgba(0,0,0,.08);
        }

        .section {
          padding: 55px 5%;
        }

        .sectionHead {
          text-align: center;
          margin-bottom: 25px;
        }

        .sectionHead h2 {
          font-size: 34px;
          margin: 8px 0;
        }

        .sectionHead p {
          color: #777;
        }

        .productGrid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 20px;
        }

        .card {
          background: white;
          border-radius: 22px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 8px 25px rgba(0,0,0,.08);
        }

        .productImage {
          width: 100%;
          height: 330px;
          object-fit: cover;
          display: block;
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
          font-size: 22px;
          cursor: pointer;
        }

        .cardBody {
          padding: 16px;
        }

        .categoryName {
          color: #7137c8;
          font-size: 13px;
          font-weight: bold;
        }

        .cardBody h3 {
          margin: 8px 0;
        }

        .price {
          color: #7137c8;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 14px;
        }

        .selectButton {
          width: 100%;
          border: 0;
          background: #7137c8;
          color: white;
          padding: 13px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
        }

        .categoryBanner {
          min-height: 280px;
          margin-bottom: 20px;
          border-radius: 30px;
          overflow: hidden;
          position: relative;
        }

        .categoryBanner img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          display: block;
          filter: brightness(.65);
        }

        .bannerText {
          position: absolute;
          left: 35px;
          top: 50%;
          transform: translateY(-50%);
          color: white;
        }

        .bannerText h2 {
          font-size: 38px;
          margin: 0 0 8px;
        }

        .footer {
          margin-top: 50px;
          background: #17152b;
          color: white;
          padding: 45px 20px;
          text-align: center;
        }

        .modalBackground {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(0,0,0,.65);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal {
          background: white;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 25px;
          padding: 20px;
        }

        .modalImage {
          width: 100%;
          height: 280px;
          object-fit: cover;
          border-radius: 18px;
        }

        .options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .option {
          border: 1px solid #ccc;
          background: white;
          padding: 10px 17px;
          border-radius: 20px;
          cursor: pointer;
        }

        .option.selected {
          background: #7137c8;
          color: white;
          border-color: #7137c8;
        }

        .addButton {
          width: 100%;
          border: 0;
          background: #7137c8;
          color: white;
          padding: 15px;
          margin-top: 20px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
        }

        .closeButton {
          width: 100%;
          border: 0;
          background: #eee;
          padding: 12px;
          margin-top: 8px;
          border-radius: 25px;
          cursor: pointer;
        }

        .error {
          color: #d00000;
          text-align: center;
          font-weight: bold;
          margin-top: 12px;
        }

        @media(max-width:900px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .heroImage {
            height: 380px;
          }

          .productGrid {
            grid-template-columns: repeat(2,1fr);
          }
        }

        @media(max-width:550px) {
          .header {
            padding: 12px 4%;
          }

          .brand {
            font-size: 18px;
          }

          .cartButton {
            padding: 10px 13px;
          }

          .hero {
            padding: 55px 5%;
          }

          .hero h1 {
            font-size: 43px;
          }

          .productGrid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .productImage {
            height: 230px;
          }

          .cardBody {
            padding: 11px;
          }

          .cardBody h3 {
            font-size: 15px;
          }

          .categoryBanner,
          .categoryBanner img {
            height: 220px;
          }

          .bannerText {
            left: 20px;
          }

          .bannerText h2 {
            font-size: 29px;
          }
        }
      `}</style>

      <header className="header">
        <div>
          <div className="brand">🌸 Bee Girl Shopping</div>
          <div className="tag">
            Women's Fashion • Style • Comfort
          </div>
        </div>

        <button
          className="cartButton"
          onClick={() => {
            window.location.href = "/checkout";
          }}
        >
          🛒 Cart ({cartCount})
        </button>
      </header>

      <section className="hero">
        <div className="heroText">
          <small>✨ NEW COLLECTION ✨</small>

          <h1>
            Fashion
            <br />
            Made For You
          </h1>

          <p>
            Discover beautiful women's fashion for every
            occasion — from everyday kurtis to elegant sarees,
            designer lehengas and comfortable night wear.
          </p>

          <a className="shopButton" href="#collections">
            Explore Collection →
          </a>
        </div>

        <img
          className="heroImage"
          src={products[1].image}
          alt="Bee Girl Shopping"
        />
      </section>

      <section className="location">
        <h3>📍 Visit Bee Girl Shopping</h3>
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

      <div className="categoryNav">
        {categories.map((c) => (
          <button
            key={c.name}
            onClick={() => showCategory(c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div id="collections">
        {categories.map((cat) => {
          const items = products.filter(
            (p) => p.category === cat.name
          );

          return (
            <section
              key={cat.name}
              id={cat.name}
              className="section"
            >
              <div className="categoryBanner">
                <img src={cat.image} alt={cat.title} />

                <div className="bannerText">
                  <h2>{cat.title}</h2>
                  <p>{cat.subtitle}</p>
                </div>
              </div>

              <div className="sectionHead">
                <h2>{cat.name}</h2>
                <p>Choose your favourite style</p>
              </div>

              <div className="productGrid">
                {items.map((p) => (
                  <div className="card" key={p.id}>
                    <img
                      className="productImage"
                      src={p.image}
                      alt={p.name}
                    />

                    <button
                      className="heart"
                      onClick={() => toggleWishlist(p.id)}
                    >
                      {wishlist.includes(p.id)
                        ? "❤️"
                        : "♡"}
                    </button>

                    <div className="cardBody">
                      <div className="categoryName">
                        {p.category}
                      </div>

                      <h3>{p.name}</h3>

                      <div className="price">
                        ₹{p.price}
                      </div>

                      <button
                        className="selectButton"
                        onClick={() => openProduct(p)}
                      >
                        Select Size & Colour
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="footer">
        <h2>🌸 Bee Girl Shopping</h2>
        <p>Fashion • Style • Comfort</p>
        <p>📍 Sai Nagar, 7th Cross, Anantapur</p>
        <p>💬 WhatsApp Support</p>
        <p>© 2026 Bee Girl Shopping</p>
      </footer>

      {selected && (
        <div className="modalBackground">
          <div className="modal">
            <img
              className="modalImage"
              src={selected.image}
              alt={selected.name}
            />

            <h2>{selected.name}</h2>

            <h2 style={{ color: "#7137c8" }}>
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

            {message && (
              <div className="error">{message}</div>
            )}

            <button
              className="addButton"
              onClick={addToCart}
            >
              🛒 Add To Cart
            </button>

            <button
              className="closeButton"
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
