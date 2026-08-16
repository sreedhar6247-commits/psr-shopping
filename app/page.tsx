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
    } catch {
      setCartCount(0);
      setWishlist([]);
    }
  }, []);

  function openProduct(product: Product) {
    setSelected(product);
    setSize("");
    setColour("");
    setMessage("");
  }

  function toggleWishlist(id: number) {
    const updated = wishlist.includes(id)
      ? wishlist.filter((item) => item !== id)
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
      (item: any) =>
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
        (total: number, item: any) =>
          total + Number(item.quantity || 1),
        0
      )
    );

    setSelected(null);
  }

  function showCategory(category: string) {
    document
      .getElementById(category)
      ?.scrollIntoView({ behavior: "smooth" });
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
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(12px);
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
          padding: 14px 5%;
          box-shadow: 0 3px 18px rgba(0, 0, 0, 0.08);
        }

        .headerLeft,
        .headerRight {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .headerLeft {
          justify-content: flex-start;
        }

        .headerRight {
          justify-content: flex-end;
        }

        .headerAction {
          border: 1px solid #e4d9f5;
          background: white;
          color: #7137c8;
          padding: 10px 14px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
        }

        .headerAction:hover {
          background: #f5efff;
        }

        .whatsappDisabled {
          opacity: 0.8;
          cursor: default;
        }

        .brandWrap {
          text-align: center;
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

        .hero {
          min-height: 550px;
          padding: 65px 6%;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 40px;
          align-items: center;
          background:
            radial-gradient(
              circle at 15% 20%,
              #ead9ff,
              transparent 35%
            ),
            linear-gradient(135deg, #faf6ff, #eee5ff);
        }

        .heroText small {
          color: #7137c8;
          font-weight: bold;
          letter-spacing: 3px;
        }

        .hero h1 {
          font-size: clamp(45px, 7vw, 78px);
          line-height: 1.02;
          margin: 18px 0;
        }

        .hero p {
          color: #666;
          font-size: 18px;
          line-height: 1.7;
          max-width: 650px;
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
          height: 500px;
          object-fit: cover;
          border-radius: 35px;
          box-shadow: 0 20px 50px rgba(70, 30, 120, 0.2);
        }

        .storeInfo {
          margin: 30px 5%;
          padding: 22px;
          background: white;
          border-radius: 25px;
          text-align: center;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        }

        .storeInfo h3 {
          margin: 0 0 8px;
        }

        .storeInfo p {
          margin: 5px 0;
          color: #666;
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
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
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
          filter: brightness(0.65);
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

        .productGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .card {
          background: white;
          border-radius: 22px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
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
          background: rgba(0, 0, 0, 0.65);
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

        @media (max-width: 900px) {
          .header {
            grid-template-columns: 1fr;
            justify-items: center;
          }

          .headerLeft,
          .headerRight {
            justify-content: center;
            flex-wrap: wrap;
          }

          .brandWrap {
            order: -1;
          }

          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .heroImage {
            height: 380px;
          }

          .productGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 550px) {
          .header {
            padding: 12px 4%;
          }

          .brand {
            font-size: 18px;
          }

          .headerAction {
            padding: 9px 11px;
            font-size: 12px;
          }

          .hero {
            padding: 45px 5%;
          }

          .hero h1 {
            font-size: 43px;
          }

          .hero p {
            font-size: 15px;
          }

          .heroImage {
            height: 360px;
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

          .section {
            padding: 35px 4%;
          }
        }
      `}</style>

      <header className="header">
        <div className="headerLeft">
          <button
            className="headerAction"
            onClick={() =>
              document
                .getElementById("collections")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            ❤️ Wishlist ({wishlist.length})
          </button>

          <button
            className="headerAction"
            onClick={() => {
              window.location.href = "/cart";
            }}
          >
            🛒 Cart ({cartCount})
          </button>
        </div>

        <div className="brandWrap">
          <div className="brand">🌸 Bee Girl Shopping</div>
          <div className="tag">
            Women's Fashion • Style • Comfort
          </div>
        </div>

        <div className="headerRight">
          <a
            className="headerAction"
            href="https://www.google.com/maps/search/?api=1&query=Sai+Nagar+7th+Cross+Anantapur"
            target="_blank"
            rel="noreferrer"
          >
            📍 Location
          </a>

          <span
            className="headerAction whatsappDisabled"
            title="WhatsApp number will be added later"
          >
            💬 WhatsApp Support
          </span>
        </div>
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
            Discover beautiful women's fashion for every occasion —
            from everyday kurtis to elegant sarees, designer lehengas
            and comfortable night wear.
          </p>

          <a className="shopButton" href="#collections">
            Explore Collection →
          </a>
        </div>

        <img
          className="heroImage"
          src="/products/hero-violet-kurti.png"
          alt="Bee Girl Shopping"
        />
      </section>

      <section className="storeInfo">
        <h3>📍 Visit Bee Girl Shopping</h3>
        <p>Sai Nagar, 7th Cross, Anantapur</p>
        <p>💬 WhatsApp Support — number will be added later</p>
      </section>

      <nav className="categoryNav">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => showCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </nav>

      <div id="collections">
        {categories.map((category) => {
          const items = products.filter(
            (product) => product.category === category.name
          );

          return (
            <section
              key={category.name}
              id={category.name}
              className="section"
            >
              <div className="categoryBanner">
                <img
                  src={category.image}
                  alt={category.title}
                />

                <div className="bannerText">
                  <h2>{category.title}</h2>
                  <p>{category.subtitle}</p>
                </div>
              </div>

              <div className="sectionHead">
                <h2>{category.name}</h2>
                <p>Choose your favourite style</p>
              </div>

              <div className="productGrid">
                {items.map((product) => (
                  <div className="card" key={product.id}>
                    <img
                      className="productImage"
                      src={product.image}
                      alt={product.name}
                    />

                    <button
                      className="heart"
                      onClick={() =>
                        toggleWishlist(product.id)
                      }
                      aria-label={`Add ${product.name} to wishlist`}
                    >
                      {wishlist.includes(product.id)
                        ? "❤️"
                        : "♡"}
                    </button>

                    <div className="cardBody">
                      <div className="categoryName">
                        {product.category}
                      </div>

                      <h3>{product.name}</h3>

                      <div className="price">
                        ₹{product.price}
                      </div>

                      <button
                        className="selectButton"
                        onClick={() => openProduct(product)}
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
              {selected.sizes.map((itemSize) => (
                <button
                  key={itemSize}
                  className={`option ${
                    size === itemSize ? "selected" : ""
                  }`}
                  onClick={() => setSize(itemSize)}
                >
                  {itemSize}
                </button>
              ))}
            </div>

            <h3>Select Colour</h3>

            <div className="options">
              {selected.colours.map((itemColour) => (
                <button
                  key={itemColour}
                  className={`option ${
                    colour === itemColour ? "selected" : ""
                  }`}
                  onClick={() => setColour(itemColour)}
                >
                  {itemColour}
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
