"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
};

type CartItem = Product & {
  quantity: number;
  size: string;
  color: string;
};

const products: Product[] = [
  {
    id: "kurti-1",
    name: "Elegant Cotton Kurti",
    category: "Kurtis",
    price: 799,
    image: "/images/hero.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Blue", "Black"],
  },
  {
    id: "kurti-2",
    name: "Designer Anarkali Kurti",
    category: "Kurtis",
    price: 1199,
    image: "/images/kurti-2.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Maroon", "Purple", "Black"],
  },
  {
    id: "saree-1",
    name: "Beautiful Party Saree",
    category: "Sarees",
    price: 999,
    image: "/images/saree-1.jpg",
    sizes: ["Free Size"],
    colors: ["Pink", "Red", "Green"],
  },
  {
    id: "saree-2",
    name: "Premium Silk Saree",
    category: "Sarees",
    price: 1499,
    image: "/images/saree-1.jpg",
    sizes: ["Free Size"],
    colors: ["Red", "Blue", "Green"],
  },
  {
    id: "lehenga-1",
    name: "Bridal Lehenga",
    category: "Lehengas",
    price: 2499,
    image: "/images/lehenga-1.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Peach", "Pink", "Red"],
  },
  {
    id: "lehenga-2",
    name: "Designer Lehenga",
    category: "Lehengas",
    price: 1999,
    image: "/images/lehenga-1.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Peach", "Pink", "Wine"],
  },
  {
    id: "night-1",
    name: "Comfort Night Suit",
    category: "Night Wear",
    price: 699,
    image: "/images/nightwear-1.jpg",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Blue", "Pink", "Grey"],
  },
  {
    id: "night-2",
    name: "Soft Cotton Night Wear",
    category: "Night Wear",
    price: 749,
    image: "/images/nightwear-2.jpg",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Blue", "Pink"],
  },
];

const sections = [
  {
    category: "Kurtis",
    title: "Elegant Kurtis",
    subtitle: "Comfortable styles for everyday elegance",
    banner: "/images/kurtis-banner.jpg",
  },
  {
    category: "Sarees",
    title: "Graceful Sarees",
    subtitle: "Traditional beauty with a modern touch",
    banner: "/images/saree-banner.jpg",
  },
  {
    category: "Lehengas",
    title: "Designer Lehengas",
    subtitle: "Perfect for celebrations",
    banner: "/images/lehenga-banner.jpg",
  },
  {
    category: "Night Wear",
    title: "Comfort Night Wear",
    subtitle: "Relax in comfort and style",
    banner: "/images/nightwear-banner.jpg",
  },
];

function addCart(product: Product, size: string, color: string) {
  const raw = localStorage.getItem("bee-girl-shopping-cart");

  const cart: CartItem[] = raw ? JSON.parse(raw) : [];

  const index = cart.findIndex(
    (item) =>
      item.id === product.id &&
      item.size === size &&
      item.color === color
  );

  if (index >= 0) {
    cart[index].quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
      size,
      color,
    });
  }

  localStorage.setItem(
    "bee-girl-shopping-cart",
    JSON.stringify(cart)
  );

  window.dispatchEvent(new Event("cart-updated"));
}

export default function HomePage() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [category, setCategory] = useState("All");

  const refreshCartCount = () => {
    const raw = localStorage.getItem("bee-girl-shopping-cart");

    const cart: CartItem[] = raw ? JSON.parse(raw) : [];

    setCartCount(
      cart.reduce(
        (total, item) => total + item.quantity,
        0
      )
    );
  };

  useEffect(() => {
    refreshCartCount();

    window.addEventListener(
      "cart-updated",
      refreshCartCount
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        refreshCartCount
      );
    };
  }, []);

  const visibleProducts = useMemo(() => {
    if (category === "All") {
      return products;
    }

    return products.filter(
      (product) => product.category === category
    );
  }, [category]);

  const openProduct = (product: Product) => {
    setSelected(product);
    setSize("");
    setColor("");
  };

  const confirmAdd = () => {
    if (!selected || !size || !color) {
      return;
    }

    addCart(selected, size, color);

    setSelected(null);
  };

  return (
    <main className="site">

      {/* HEADER */}

      <header className="header">

        <Link href="/" className="brand">
          🌸 <span>Bee Girl Shopping</span>

          <small>
            Women's Fashion • Kurtis • Sarees • Lehengas
          </small>
        </Link>

        <Link href="/cart" className="cartButton">
          🛒 Cart ({cartCount})
        </Link>

      </header>


      {/* HERO */}

      <section className="hero">

        <div className="heroText">

          <div className="eyebrow">
            ✨ NEW COLLECTION ✨
          </div>

          <h1>
            Fashion
            <br />
            Made For You
          </h1>

          <p>
            Discover beautiful women's fashion for every
            occasion — from everyday kurtis to elegant
            sarees, designer lehangas and comfortable
            night wear.
          </p>

          <button
            className="primary"
            onClick={() => setCategory("All")}
          >
            Explore Collection →
          </button>

        </div>

        <img
          src="/images/hero.jpg"
          className="heroImage"
          alt="Fashion collection"
        />

      </section>


      {/* STORE INFORMATION */}

      <section className="storeInfo">

        <div>
          📍 <b>Visit Bee Girl Shopping</b>
        </div>

        <div>
          Near 7th Cross, Anantapur
        </div>

        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noreferrer"
          className="whatsapp"
        >
          💬 Chat on WhatsApp
        </a>

      </section>


      {/* CATEGORY BUTTONS */}

      <nav className="categoryNav">

        {[
          "All",
          "Kurtis",
          "Sarees",
          "Lehengas",
          "Night Wear",
        ].map((item) => (

          <button
            key={item}
            className={
              category === item
                ? "activeChip"
                : ""
            }
            onClick={() => setCategory(item)}
          >
            {item}
          </button>

        ))}

      </nav>


      {/* PRODUCT SECTIONS */}

      {sections.map((section) => {

        const sectionProducts =
          visibleProducts.filter(
            (product) =>
              product.category === section.category
          );

        if (
          category !== "All" &&
          category !== section.category
        ) {
          return null;
        }

        return (

          <section
            className="categorySection"
            key={section.category}
          >

            {/* BANNER */}

            <div className="banner">

              <img
                src={section.banner}
                alt={section.title}
              />

              <div>

                <h2>
                  {section.title}
                </h2>

                <p>
                  {section.subtitle}
                </p>

              </div>

            </div>


            {/* SECTION TITLE */}

            <div className="sectionHeading">

              <h2>
                {section.category}
              </h2>

              <span>
                Choose your favorite style
              </span>

            </div>


            {/* PRODUCTS */}

            <div className="products">

              {sectionProducts.map((product) => (

                <article
                  className="productCard"
                  key={product.id}
                >

                  <div className="productImageWrap">

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <button className="heart">
                      ♡
                    </button>

                  </div>


                  <div className="productInfo">

                    <small>
                      {product.category}
                    </small>

                    <h3>
                      {product.name}
                    </h3>

                    <strong>
                      ₹{product.price}
                    </strong>

                    <button
                      className="selectButton"
                      onClick={() =>
                        openProduct(product)
                      }
                    >
                      Select Size &amp; Colour
                    </button>

                  </div>

                </article>

              ))}

            </div>

          </section>

        );

      })}


      {/* SIZE & COLOUR POPUP */}

      {selected && (

        <div
          className="modalBackdrop"
          onClick={() => setSelected(null)}
        >

          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="close"
              onClick={() =>
                setSelected(null)
              }
            >
              ×
            </button>

            <img
              src={selected.image}
              alt={selected.name}
            />

            <h2>
              {selected.name}
            </h2>

            <strong>
              ₹{selected.price}
            </strong>


            <label>
              Size
            </label>

            <div className="options">

              {selected.sizes.map((item) => (

                <button
                  key={item}
                  className={
                    size === item
                      ? "chosen"
                      : ""
                  }
                  onClick={() =>
                    setSize(item)
                  }
                >
                  {item}
                </button>

              ))}

            </div>


            <label>
              Colour
            </label>

            <div className="options">

              {selected.colors.map((item) => (

                <button
                  key={item}
                  className={
                    color === item
                      ? "chosen"
                      : ""
                  }
                  onClick={() =>
                    setColor(item)
                  }
                >
                  {item}
                </button>

              ))}

            </div>


            <button
              className="addButton"
              disabled={!size || !color}
              onClick={confirmAdd}
            >
              Add to Cart
            </button>

          </div>

        </div>

      )}


      {/* FOOTER */}

      <footer>

        <b>
          Bee Girl Shopping
        </b>

        <span>
          Beautiful fashion. Comfortable prices.
        </span>

      </footer>


      {/* CSS */}

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .site {
          min-height: 100vh;
          background: #f8f3ff;
          color: #27202f;
          font-family: Arial, Helvetica, sans-serif;
        }

        .header {
          height: 58px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          position: sticky;
          top: 0;
          z-index: 20;
          box-shadow: 0 1px 8px #00000012;
        }

        .brand {
          color: #5423a5;
          text-decoration: none;
          font-weight: 800;
          font-size: 13px;
        }

        .brand small {
          display: block;
          color: #777;
          font-size: 7px;
          font-weight: 500;
          margin-left: 18px;
        }

        .cartButton,
        .primary,
        .selectButton,
        .addButton {
          border: 0;
          border-radius: 20px;
          background: #7532c8;
          color: white;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
        }

        .cartButton {
          padding: 8px 14px;
          font-size: 11px;
        }

        .hero {
          max-width: 900px;
          margin: 0 auto;
          padding: 28px 22px;
          display: grid;
          grid-template-columns: 1fr 160px;
          gap: 24px;
          align-items: center;
          background: linear-gradient(
            110deg,
            #f8ecff,
            #f1e6ff
          );
        }

        .eyebrow {
          color: #7532c8;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .hero h1 {
          font-size: clamp(34px, 7vw, 52px);
          line-height: .95;
          margin: 10px 0;
          font-weight: 500;
        }

        .hero p {
          font-size: 11px;
          color: #777;
          line-height: 1.6;
          max-width: 430px;
        }

        .primary {
          padding: 9px 15px;
          font-size: 9px;
        }

        .heroImage {
          width: 160px;
          height: 175px;
          object-fit: cover;
          border-radius: 15px;
        }

        .storeInfo {
          background: white;
          max-width: 640px;
          margin: 12px auto;
          border-radius: 12px;
          padding: 12px;
          text-align: center;
          box-shadow: 0 4px 15px #0000000d;
          font-size: 8px;
        }

        .whatsapp {
          display: inline-block;
          background: #27c968;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          text-decoration: none;
          margin-top: 5px;
          font-weight: 700;
        }

        .categoryNav {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
          padding: 12px;
        }

        .categoryNav button {
          border: 0;
          background: white;
          padding: 7px 13px;
          border-radius: 20px;
          font-size: 8px;
          box-shadow: 0 2px 7px #0000000b;
          cursor: pointer;
        }

        .categoryNav .activeChip {
          background: #7532c8;
          color: white;
        }

        .categorySection {
          max-width: 900px;
          margin: 10px auto 30px;
          padding: 0 18px;
        }

        .banner {
          height: 115px;
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          color: white;
        }

        .banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(.65);
        }

        .banner > div {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 20px;
        }

        .banner h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
        }

        .banner p {
          margin: 5px 0;
          font-size: 8px;
        }

        .sectionHeading {
          text-align: center;
          margin: 17px 0 13px;
        }

        .sectionHeading h2 {
          font-size: 14px;
          font-weight: 500;
          margin: 0 0 4px;
        }

        .sectionHeading span {
          font-size: 8px;
          color: #888;
        }

        .products {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 10px;
          max-width: 360px;
          margin: auto;
        }

        .productCard {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 3px 12px #00000012;
        }

        .productImageWrap {
          height: 165px;
          position: relative;
          background: #fafafa;
        }

        .productImageWrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .heart {
          position: absolute;
          right: 5px;
          top: 5px;
          width: 20px;
          height: 20px;
          border: 0;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }

        .productInfo {
          padding: 8px;
        }

        .productInfo small {
          font-size: 7px;
          color: #7532c8;
        }

        .productInfo h3 {
          font-size: 8px;
          min-height: 18px;
          margin: 3px 0;
          font-weight: 600;
        }

        .productInfo strong {
          display: block;
          font-size: 10px;
          color: #333;
          margin-bottom: 7px;
        }

        .selectButton {
          width: 100%;
          padding: 7px 3px;
          font-size: 7px;
        }

        .modalBackdrop {
          position: fixed;
          inset: 0;
          background: #0008;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal {
          width: min(380px, 100%);
          background: white;
          border-radius: 18px;
          padding: 18px;
          position: relative;
        }

        .modal > img {
          width: 100%;
          height: 190px;
          object-fit: cover;
          border-radius: 12px;
        }

        .modal h2 {
          font-size: 17px;
          margin: 12px 0 4px;
        }

        .modal > strong {
          color: #7532c8;
        }

        .close {
          position: absolute;
          right: 27px;
          top: 27px;
          border: 0;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          background: white;
          font-size: 20px;
          cursor: pointer;
        }

        .modal label {
          display: block;
          margin-top: 14px;
          font-size: 10px;
          font-weight: 700;
        }

        .options {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          margin-top: 7px;
        }

        .options button {
          border: 1px solid #ddd;
          background: white;
          padding: 7px 11px;
          border-radius: 15px;
          font-size: 9px;
          cursor: pointer;
        }

        .options .chosen {
          background: #7532c8;
          color: white;
          border-color: #7532c8;
        }

        .addButton {
          width: 100%;
          padding: 11px;
          margin-top: 18px;
        }

        .addButton:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        footer {
          background: #25152e;
          color: white;
          padding: 25px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 10px;
        }

        footer span {
          opacity: .7;
          font-size: 8px;
        }

        @media (min-width: 700px) {

          .products {
            max-width: 600px;
            grid-template-columns:
              repeat(4, 1fr);
          }

          .productImageWrap {
            height: 210px;
          }

        }

        @media (max-width: 520px) {

          .hero {
            grid-template-columns: 1fr 135px;
            gap: 12px;
            padding: 28px 18px;
          }

          .heroImage {
            width: 135px;
            height: 172px;
          }

        }

      `}</style>

    </main>
  );
}
