"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  sizes: string[];
  colours: string[];
};

const FALLBACK_IMAGES: Record<string, string> = {
  Kurtis: "/products/kurti-1.jpg",
  Sarees: "/products/fallback-saree.svg",
  Lehengas: "/products/fallback-lehenga.svg",
  "Night Wear": "/products/fallback-nightwear.svg",
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

function safeImage(category: string) {
  return FALLBACK_IMAGES[category] || "/products/hero-violet-kurti.png";
}

function ProductImage({
  src,
  alt,
  category,
  className,
}: {
  src: string;
  alt: string;
  category: string;
  className?: string;
}) {
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <img
      className={className}
      src={imageSrc}
      alt={alt}
      loading="lazy"
      onError={() => {
        const fallback = safeImage(category);
        if (imageSrc !== fallback) setImageSrc(fallback);
      }}
    />
  );
}

export default function Home() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [size, setSize] = useState("");
  const [colour, setColour] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState("");

  function refreshCounts() {
    try {
      const cart = JSON.parse(
        localStorage.getItem("bee-girl-shopping-cart") || "[]"
      );

      const wish = JSON.parse(
        localStorage.getItem("bee-girl-wishlist") || "[]"
      );

      setCartCount(
        Array.isArray(cart)
          ? cart.reduce(
              (sum: number, item: any) =>
                sum + Number(item.quantity || 1),
              0
            )
          : 0
      );

      setWishlist(Array.isArray(wish) ? wish : []);
    } catch {
      setCartCount(0);
      setWishlist([]);
    }
  }

  useEffect(() => {
    refreshCounts();

    window.addEventListener("cart-updated", refreshCounts);
    window.addEventListener("wishlist-updated", refreshCounts);
    window.addEventListener("storage", refreshCounts);

    return () => {
      window.removeEventListener("cart-updated", refreshCounts);
      window.removeEventListener("wishlist-updated", refreshCounts);
      window.removeEventListener("storage", refreshCounts);
    };
  }, []);

  const wishlistProducts = useMemo(
    () => products.filter((p) => wishlist.includes(p.id)),
    [wishlist]
  );

  function toggleWishlist(id: number) {
    const updated = wishlist.includes(id)
      ? wishlist.filter((x) => x !== id)
      : [...wishlist, id];

    setWishlist(updated);
    localStorage.setItem(
      "bee-girl-wishlist",
      JSON.stringify(updated)
    );

    window.dispatchEvent(new Event("wishlist-updated"));
  }

  function openProduct(product: Product) {
    setSelected(product);
    setSize(product.sizes.length === 1 ? product.sizes[0] : "");
    setColour("");
    setMessage("");
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
      const saved = JSON.parse(
        localStorage.getItem("bee-girl-shopping-cart") || "[]"
      );

      cart = Array.isArray(saved) ? saved : [];
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
      existing.quantity = Number(existing.quantity || 0) + 1;
    } else {
      cart.push({
        id: selected.id,
        name: selected.name,
        category: selected.category,
        price: selected.price,
        image: selected.image,
        size,
        color: colour,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "bee-girl-shopping-cart",
      JSON.stringify(cart)
    );

    window.dispatchEvent(new Event("cart-updated"));

    setSelected(null);
  }

  function showCategory(category: string) {
    document
      .getElementById(category)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  return (
    <main className="home">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #fbf7fa;
          color: #281a23;
          font-family: Arial, Helvetica, sans-serif;
        }

        button {
          font-family: inherit;
        }

        .topBar {
          background: #351226;
          color: white;
          padding: 8px 5%;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          letter-spacing: 0.04em;
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
          gap: 16px;
          padding: 12px 5%;
          box-shadow: 0 3px 18px rgba(59, 23, 41, 0.1);
        }

        .headerSide {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .headerLeft {
          justify-content: flex-start;
        }

        .headerRight {
          justify-content: flex-end;
        }

        .brandBlock {
          text-align: center;
        }

        .logoImage {
          width: 135px;
          height: 48px;
          object-fit: contain;
          display: block;
          margin: 0 auto 2px;
        }

        .brand {
          color: #691d45;
          font: 800 22px Georgia, serif;
        }

        .tag {
          color: #87747d;
          font-size: 10px;
          margin-top: 3px;
        }

        .headerButton {
          border: 0;
          padding: 10px 14px;
          border-radius: 25px;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
        }

        .wishlistButton {
          background: #9b5274;
          color: white;
        }

        .cartButton {
          background: #691d45;
          color: white;
        }

        .locationButton {
          background: #b17b27;
          color: white;
        }

        .whatsappHeader {
          background: #f4f0f2;
          color: #691d45;
          border: 1px solid #dbcbd3;
        }

        .heroHeader {
          width: 100%;
          background: #f3e4ea;
          line-height: 0;
        }

        .heroHeader img {
          width: 100%;
          height: auto;
          display: block;
        }

        .intro {
          padding: 45px 20px 35px;
          text-align: center;
          background: linear-gradient(
            135deg,
            #fffafc,
            #f4e8ef
          );
        }

        .eyebrow {
          color: #b17b27;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.28em;
        }

        .intro h1 {
          font: 700 clamp(34px, 5vw, 56px) Georgia, serif;
          color: #5a183c;
          margin: 10px 0;
        }

        .intro p {
          max-width: 760px;
          margin: 0 auto 20px;
          color: #76666e;
          line-height: 1.7;
          font-size: 15px;
        }

        .shopButton {
          display: inline-block;
          background: #691d45;
          color: white;
          padding: 13px 23px;
          border-radius: 28px;
          text-decoration: none;
          font-weight: 800;
          font-size: 12px;
        }

        .quickInfo {
          max-width: 1280px;
          margin: 0 auto;
          padding: 18px 5%;
          background: #4b1933;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .quickCard {
          min-height: 72px;
          padding: 13px 15px;
          border: 1px solid rgba(229, 193, 122, 0.5);
          border-radius: 14px;
          color: white;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .quickCard strong {
          display: block;
          font-size: 13px;
        }

        .quickCard span span {
          display: block;
          color: #eadce2;
          font-size: 10px;
          line-height: 1.35;
          margin-top: 3px;
        }

        .quickIcon {
          font-size: 25px;
          flex: 0 0 auto;
        }

        .categoryNav {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          padding: 24px 5%;
        }

        .categoryNav button {
          border: 1px solid #dfcbd4;
          background: white;
          color: #641c42;
          padding: 11px 20px;
          border-radius: 25px;
          cursor: pointer;
          box-shadow: 0 3px 12px rgba(59, 23, 41, 0.06);
        }

        .section {
          padding: 45px 5%;
          scroll-margin-top: 100px;
        }

        .categoryBanner {
          min-height: 260px;
          margin-bottom: 22px;
          border-radius: 28px;
          overflow: hidden;
          position: relative;
          background: #eee0e7;
        }

        .categoryBannerImage {
          width: 100%;
          height: 280px;
          object-fit: cover;
          display: block;
          filter: brightness(0.68);
        }

        .bannerText {
          position: absolute;
          left: 34px;
          top: 50%;
          transform: translateY(-50%);
          color: white;
        }

        .bannerText h2 {
          font: 700 38px Georgia, serif;
          margin: 0 0 8px;
        }

        .bannerText p {
          margin: 0;
          font-size: 14px;
        }

        .sectionHead {
          text-align: center;
          margin-bottom: 24px;
        }

        .sectionHead h2 {
          font: 700 34px Georgia, serif;
          color: #4d1934;
          margin: 8px 0;
        }

        .sectionHead p {
          color: #82727a;
        }

        .productGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 7px 24px rgba(59, 23, 41, 0.08);
        }

        .productImage {
          width: 100%;
          height: 330px;
          object-fit: cover;
          display: block;
          background: #f4e9ee;
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
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }

        .cardBody {
          padding: 15px;
        }

        .categoryName {
          color: #9b5274;
          font-size: 12px;
          font-weight: 800;
        }

        .cardBody h3 {
          margin: 7px 0;
          min-height: 38px;
          font-size: 16px;
        }

        .price {
          color: #691d45;
          font-size: 19px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .selectButton {
          width: 100%;
          border: 0;
          background: #691d45;
          color: white;
          padding: 12px;
          border-radius: 24px;
          font-weight: 800;
          cursor: pointer;
        }

        .wishlistSection {
          background: white;
          border-top: 1px solid #eddde4;
          border-bottom: 1px solid #eddde4;
        }

        .wishlistEmpty {
          text-align: center;
          padding: 20px;
          color: #7e6f76;
        }

        .footer {
          margin-top: 35px;
          background: #24101a;
          color: white;
          text-align: center;
          padding: 40px 20px;
        }

        .footer h2 {
          font: 700 28px Georgia, serif;
          color: #e5c17a;
          margin: 0 0 7px;
        }

        .footer p {
          margin: 6px;
          color: #cdbbc4;
          font-size: 11px;
        }

        .modalBackground {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(25, 15, 20, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }

        .modal {
          background: white;
          width: 100%;
          max-width: 500px;
          max-height: 92vh;
          overflow-y: auto;
          border-radius: 24px;
          padding: 18px;
        }

        .modalImage {
          width: 100%;
          height: 280px;
          object-fit: cover;
          border-radius: 16px;
          background: #f4e9ee;
        }

        .modal h2 {
          color: #4d1934;
        }

        .options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .option {
          border: 1px solid #d8c5ce;
          background: white;
          padding: 10px 17px;
          border-radius: 20px;
          cursor: pointer;
        }

        .option.selected {
          background: #691d45;
          color: white;
          border-color: #691d45;
        }

        .addButton,
        .closeButton {
          width: 100%;
          border: 0;
          padding: 13px;
          border-radius: 25px;
          cursor: pointer;
        }

        .addButton {
          background: #691d45;
          color: white;
          font-weight: 800;
          margin-top: 18px;
        }

        .closeButton {
          background: #eee7eb;
          color: #3a2530;
          margin-top: 8px;
        }

        .error {
          color: #bd0025;
          text-align: center;
          font-weight: 800;
          margin-top: 10px;
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

          .brandBlock {
            order: -1;
          }

          .quickInfo {
            grid-template-columns: 1fr 1fr;
          }

          .productGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 560px) {
          .topBar {
            justify-content: center;
          }

          .topBar span:last-child {
            display: none;
          }

          .headerButton {
            padding: 9px 10px;
            font-size: 11px;
          }

          .logoImage {
            width: 120px;
            height: 43px;
          }

          .quickInfo {
            grid-template-columns: 1fr;
            padding: 12px;
          }

          .section {
            padding: 35px 4%;
          }

          .categoryBanner,
          .categoryBannerImage {
            height: 220px;
            min-height: 220px;
          }

          .bannerText {
            left: 20px;
            right: 15px;
          }

          .bannerText h2 {
            font-size: 29px;
          }

          .productGrid {
            grid-template-columns: 1fr 1fr;
            gap: 11px;
          }

          .productImage {
            height: 230px;
          }

          .cardBody {
            padding: 10px;
          }

          .cardBody h3 {
            font-size: 14px;
          }

          .price {
            font-size: 17px;
          }

          .selectButton {
            font-size: 11px;
            padding: 11px;
          }

          .intro {
            padding: 38px 16px 28px;
          }

          .intro h1 {
            font-size: 34px;
          }
        }
      `}</style>

      <div className="topBar">
        <span>🌸 Women's Fashion • Style • Comfort</span>
        <span>🐝 Bee Girl Shopping</span>
      </div>

      <header className="header">
        <div className="headerSide headerLeft">
          <a
            className="headerButton wishlistButton"
            href="#wishlist"
          >
            ❤️ Wishlist ({wishlist.length})
          </a>

          <a
            className="headerButton cartButton"
            href="/cart"
          >
            🛒 Cart ({cartCount})
          </a>
        </div>

        <div className="brandBlock">
          <img
            className="logoImage"
            src="/products/bee-girl-logo.jpg"
            alt="Bee Girl Shopping"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />

          <div className="brand">Bee Girl Shopping</div>

          <div className="tag">
            Elegance • Style • Confidence
          </div>
        </div>

        <div className="headerSide headerRight">
          <a
            className="headerButton locationButton"
            href="https://maps.app.goo.gl/cdn339RiDvj99ikE9?g_st=ac"
            target="_blank"
            rel="noopener noreferrer"
          >
            📍 Location
          </a>

          <span className="headerButton whatsappHeader">
            💬 WhatsApp Support
          </span>
        </div>
      </header>

      <section className="heroHeader">
        <img
          src="/products/bee-girl-main-header.png"
          alt="Bee Girl Shopping main fashion banner"
        />
      </section>

      <section className="intro">
        <div className="eyebrow">
          ✨ BEE GIRL SHOPPING ✨
        </div>

        <h1>Wear Your Style. Own Your Moment.</h1>

        <p>
          Discover beautiful women's fashion for every occasion —
          from elegant kurtis and graceful sarees to designer
          lehengas and comfortable night wear.
        </p>

        <a
          className="shopButton"
          href="#collections"
        >
          EXPLORE COLLECTIONS →
        </a>
      </section>

      <section className="quickInfo">
        <a
          className="quickCard"
          href="#wishlist"
        >
          <span className="quickIcon">❤️</span>

          <span>
            <strong>Wishlist</strong>
            <span>
              Save your favourite items ({wishlist.length})
            </span>
          </span>
        </a>

        <a
          className="quickCard"
          href="/cart"
        >
          <span className="quickIcon">🛍️</span>

          <span>
            <strong>Your Cart</strong>
            <span>
              View and manage items ({cartCount})
            </span>
          </span>
        </a>

        <a
          className="quickCard"
          href="https://maps.app.goo.gl/cdn339RiDvj99ikE9?g_st=ac"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="quickIcon">📍</span>

          <span>
            <strong>Our Store</strong>
            <span>
              Sai Nagar, 7th Cross, Anantapur
            </span>
          </span>
        </a>

        <div className="quickCard">
          <span className="quickIcon">💬</span>

          <span>
            <strong>WhatsApp Support</strong>
            <span>
              Customer support
            </span>
          </span>
        </div>
      </section>

      <nav
        className="categoryNav"
        id="collections"
      >
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => showCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </nav>

      {categories.map((category) => {
        const items = products.filter(
          (product) =>
            product.category === category.name
        );

        return (
          <section
            key={category.name}
            id={category.name}
            className="section"
          >
            <div className="categoryBanner">
              <ProductImage
                className="categoryBannerImage"
                src={category.image}
                category={category.name}
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
                <article
                  className="card"
                  key={product.id}
                >
                  <ProductImage
                    className="productImage"
                    src={product.image}
                    category={product.category}
                    alt={product.name}
                  />

                  <button
                    className="heart"
                    aria-label={
                      wishlist.includes(product.id)
                        ? `Remove ${product.name} from wishlist`
                        : `Add ${product.name} to wishlist`
                    }
                    onClick={() =>
                      toggleWishlist(product.id)
                    }
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
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                    </div>

                    <button
                      className="selectButton"
                      onClick={() =>
                        openProduct(product)
                      }
                    >
                      Select Size & Colour
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <section
        id="wishlist"
        className="section wishlistSection"
      >
        <div className="sectionHead">
          <h2>❤️ Your Wishlist</h2>
          <p>
            Your saved favourites are kept on this
            device.
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="wishlistEmpty">
            No products in your wishlist yet.
            Tap ♡ on any product to save it.
          </div>
        ) : (
          <div className="productGrid">
            {wishlistProducts.map((product) => (
              <article
                className="card"
                key={`wishlist-${product.id}`}
              >
                <ProductImage
                  className="productImage"
                  src={product.image}
                  category={product.category}
                  alt={product.name}
                />

                <button
                  className="heart"
                  onClick={() =>
                    toggleWishlist(product.id)
                  }
                >
                  ❤️
                </button>

                <div className="cardBody">
                  <div className="categoryName">
                    {product.category}
                  </div>

                  <h3>{product.name}</h3>

                  <div className="price">
                    ₹
                    {product.price.toLocaleString(
                      "en-IN"
                    )}
                  </div>

                  <button
                    className="selectButton"
                    onClick={() =>
                      openProduct(product)
                    }
                  >
                    Select Size & Colour
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="footer">
        <h2>🌸 Bee Girl Shopping</h2>

        <p>Fashion • Style • Comfort</p>

        <p>
          📍 Sai Nagar, 7th Cross, Anantapur
        </p>

        <p>💬 WhatsApp Support</p>

        <p>© 2026 Bee Girl Shopping</p>
      </footer>

      {selected && (
        <div
          className="modalBackground"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setSelected(null);
            }
          }}
        >
          <div className="modal">
            <ProductImage
              className="modalImage"
              src={selected.image}
              category={selected.category}
              alt={selected.name}
            />

            <h2>{selected.name}</h2>

            <div className="price">
              ₹
              {selected.price.toLocaleString(
                "en-IN"
              )}
            </div>

            <h3>Select Size</h3>

            <div className="options">
              {selected.sizes.map((item) => (
                <button
                  key={item}
                  className={`option ${
                    size === item
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSize(item)
                  }
                >
                  {item}
                </button>
              ))}
            </div>

            <h3>Select Colour</h3>

            <div className="options">
              {selected.colours.map((item) => (
                <button
                  key={item}
                  className={`option ${
                    colour === item
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setColour(item)
                  }
                >
                  {item}
                </button>
              ))}
            </div>

            {message && (
              <div className="error">
                {message}
              </div>
            )}

            <button
              className="addButton"
              onClick={addToCart}
            >
              🛒 Add to Cart
            </button>

            <button
              className="closeButton"
              onClick={() =>
                setSelected(null)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
