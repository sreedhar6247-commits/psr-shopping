"use client";

import { useState } from "react";
import Link from "next/link";

const products = [
  {
    id: 1,
    category: "Kurtis",
    name: "Elegant Cotton Kurti",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=90",
  },
  {
    id: 2,
    category: "Kurtis",
    name: "Designer Anarkali Kurti",
    price: 1199,
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=600&q=90",
  },
  {
    id: 3,
    category: "Sarees",
    name: "Beautiful Party Saree",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1610189012906-5c7d0f3f5d8b?auto=format&fit=crop&w=600&q=90",
  },
  {
    id: 4,
    category: "Sarees",
    name: "Premium Silk Saree",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=90",
  },
  {
    id: 5,
    category: "Lehengas",
    name: "Bridal Lehenga",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93f7?auto=format&fit=crop&w=600&q=90",
  },
  {
    id: 6,
    category: "Lehengas",
    name: "Designer Lehenga",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1610030469668-8e9b1e6f7d7d?auto=format&fit=crop&w=600&q=90",
  },
  {
    id: 7,
    category: "Night Wear",
    name: "Comfort Night Suit",
    price: 699,
    image:
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=600&q=90",
  },
  {
    id: 8,
    category: "Night Wear",
    name: "Soft Cotton Night Wear",
    price: 749,
    image:
      "https://images.unsplash.com/photo-1585488434992-5c4b3f4d7a1d?auto=format&fit=crop&w=600&q=90",
  },
];

const sections = [
  {
    name: "Kurtis",
    title: "Elegant Kurtis",
    subtitle: "Beautiful everyday styles",
    banner:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=90",
  },
  {
    name: "Sarees",
    title: "Graceful Sarees",
    subtitle: "Traditional beauty with a modern touch",
    banner:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=90",
  },
  {
    name: "Lehengas",
    title: "Designer Lehengas",
    subtitle: "Perfect for celebrations",
    banner:
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93f7?auto=format&fit=crop&w=1200&q=90",
  },
  {
    name: "Night Wear",
    title: "Comfort Night Wear",
    subtitle: "Relax in comfort and style",
    banner:
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1200&q=90",
  },
];

export default function Home() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(0);

  const filteredProducts = products.filter((product) => {
    const categoryOK =
      active === "All" || product.category === active;

    const searchOK =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    return categoryOK && searchOK;
  });

  return (
    <main className="site">

      {/* HEADER */}

      <header className="header">
        <Link href="/" className="brand">
          <span className="flower">🌸</span>

          <div>
            <strong>Bee Girl Shopping</strong>
            <small>
              Women&apos;s Fashion • Kurtis • Sarees • Lehengas
            </small>
          </div>
        </Link>

        <Link href="/cart" className="cartButton">
          🛒 Cart ({cart})
        </Link>
      </header>


      {/* HERO */}

      <section className="hero">

        <div className="heroContent">

          <div className="collection">
            ✨ NEW COLLECTION ✨
          </div>

          <h1>
            Fashion
            <br />
            Made For You
          </h1>

          <p>
            Discover beautiful women&apos;s fashion for every
            occasion — from everyday kurtis to elegant sarees,
            designer lehengas and comfortable night wear.
          </p>

          <button
            className="explore"
            onClick={() =>
              document
                .getElementById("catalog")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Collection →
          </button>

        </div>

        <div className="heroPhoto">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=90"
            alt="Fashion collection"
          />
        </div>

      </section>


      {/* LOCATION */}

      <section className="locationCard">

        <div className="locationText">
          <strong>📍 Visit Bee Girl Shopping</strong>
          <span>Near 7th Cross, Anantapur</span>
        </div>

        <a
          href="https://www.google.com/maps/search/?api=1&query=Anantapur%20Andhra%20Pradesh"
          target="_blank"
          rel="noopener noreferrer"
        >
          📍 View Location
        </a>

      </section>


      {/* CATALOG */}

      <section id="catalog" className="catalog">

        {/* CATEGORY BUTTONS */}

        <div className="categoryButtons">

          {["All", "Kurtis", "Sarees", "Lehengas", "Night Wear"].map(
            (item) => (
              <button
                key={item}
                className={active === item ? "selected" : ""}
                onClick={() => setActive(item)}
              >
                {item}
              </button>
            )
          )}

        </div>


        {/* SEARCH */}

        <div className="searchBox">
          🔍
          <input
            type="text"
            placeholder="Search fashion..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>


        {/* SECTIONS */}

        {sections.map((section) => {

          if (
            active !== "All" &&
            active !== section.name
          ) {
            return null;
          }

          const sectionProducts = filteredProducts.filter(
            (product) => product.category === section.name
          );

          if (sectionProducts.length === 0) {
            return null;
          }

          return (
            <section
              className="catalogSection"
              key={section.name}
            >

              {/* BANNER */}

              <div className="sectionBanner">

                <img
                  src={section.banner}
                  alt={section.title}
                />

                <div className="bannerOverlay" />

                <div className="bannerWords">
                  <h2>{section.title}</h2>
                  <p>{section.subtitle}</p>
                </div>

              </div>


              {/* SECTION TITLE */}

              <div className="sectionTitle">
                <h2>{section.name}</h2>
                <p>Choose your favorite style</p>
              </div>


              {/* PRODUCT GRID */}

              <div className="productGrid">

                {sectionProducts.map((product) => (

                  <article
                    className="productCard"
                    key={product.id}
                  >

                    <div className="productImage">

                      <img
                        src={product.image}
                        alt={product.name}
                      />

                      <button className="heart">
                        ♡
                      </button>

                    </div>

                    <div className="productInfo">

                      <span className="productCategory">
                        {product.category}
                      </span>

                      <h3>{product.name}</h3>

                      <strong>
                        ₹{product.price}
                      </strong>

                      <button
                        className="selectButton"
                        onClick={() =>
                          setCart((old) => old + 1)
                        }
                      >
                        Select Size &amp;
                        <br />
                        Colour
                      </button>

                    </div>

                  </article>

                ))}

              </div>

            </section>
          );
        })}

      </section>


      {/* FOOTER */}

      <footer>

        <strong>🌸 Bee Girl Shopping</strong>

        <span>
          Sarees • Kurtis • Lehengas
        </span>

        <span>
          📍 Anantapur, Andhra Pradesh
        </span>

        <span>
          © 2026 Bee Girl Shopping
        </span>

      </footer>


      {/* STYLES */}

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .site {
          min-height: 100vh;
          background: #faf6ff;
          color: #27212d;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }


        /* HEADER */

        .header {
          height: 60px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          border-bottom: 1px solid #eeeeee;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 5px;
          text-decoration: none;
          color: #29232f;
        }

        .flower {
          font-size: 11px;
        }

        .brand strong {
          display: block;
          color: #7130bb;
          font-size: 11px;
          font-weight: 700;
        }

        .brand small {
          display: block;
          color: #888;
          font-size: 6px;
          margin-top: 2px;
        }

        .cartButton {
          background: #7935c4;
          color: white;
          text-decoration: none;
          padding: 7px 12px;
          border-radius: 20px;
          font-size: 8px;
          font-weight: 600;
        }


        /* HERO */

        .hero {
          max-width: 1100px;
          margin: auto;
          min-height: 270px;
          padding: 28px 24px;
          display: grid;
          grid-template-columns: 1fr 135px;
          gap: 15px;
          align-items: center;
          background:
            linear-gradient(
              110deg,
              #f8eaff,
              #edddfa
            );
        }

        .collection {
          color: #7837bd;
          font-size: 6px;
          letter-spacing: 2px;
          font-weight: bold;
        }

        .heroContent h1 {
          font-size: 34px;
          line-height: .94;
          font-weight: 400;
          margin: 9px 0;
        }

        .heroContent p {
          max-width: 350px;
          color: #837889;
          font-size: 7px;
          line-height: 1.6;
          margin-bottom: 9px;
        }

        .explore {
          border: none;
          background: #7935c4;
          color: white;
          border-radius: 18px;
          padding: 7px 11px;
          font-size: 6px;
          font-weight: bold;
        }

        .heroPhoto {
          height: 168px;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 7px 18px #6e36a329;
        }

        .heroPhoto img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }


        /* LOCATION */

        .locationCard {
          width: calc(100% - 35px);
          max-width: 650px;
          min-height: 55px;
          margin: 13px auto 18px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 18px #0000000c;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          padding: 9px;
        }

        .locationText {
          text-align: center;
        }

        .locationText strong,
        .locationText span {
          display: block;
        }

        .locationText strong {
          font-size: 7px;
        }

        .locationText span {
          font-size: 6px;
          color: #888;
          margin-top: 2px;
        }

        .locationCard a {
          background: #20b967;
          color: white;
          padding: 6px 9px;
          border-radius: 15px;
          text-decoration: none;
          font-size: 6px;
          font-weight: bold;
        }


        /* CATALOG */

        .catalog {
          max-width: 1100px;
          margin: auto;
          padding: 0 17px 45px;
        }

        .categoryButtons {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }

        .categoryButtons button {
          border: 1px solid #eeeeee;
          background: white;
          color: #555;
          border-radius: 20px;
          padding: 7px 12px;
          font-size: 6px;
        }

        .categoryButtons .selected {
          color: white;
          background: #7935c4;
          border-color: #7935c4;
        }


        /* SEARCH */

        .searchBox {
          width: 90%;
          max-width: 380px;
          height: 30px;
          margin: 0 auto 22px;
          background: white;
          border: 1px solid #eeeeee;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0 10px;
          color: #888;
          font-size: 9px;
        }

        .searchBox input {
          flex: 1;
          border: 0;
          outline: 0;
          font-size: 7px;
          background: transparent;
        }


        /* BANNER */

        .catalogSection {
          margin-bottom: 26px;
        }

        .sectionBanner {
          height: 100px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }

        .sectionBanner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .bannerOverlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(0,0,0,.60),
              rgba(0,0,0,.12)
            );
        }

        .bannerWords {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: white;
        }

        .bannerWords h2 {
          margin: 0;
          font-size: 14px;
          font-weight: 400;
        }

        .bannerWords p {
          margin: 4px 0 0;
          font-size: 6px;
        }


        /* TITLES */

        .sectionTitle {
          text-align: center;
          margin: 17px 0 9px;
        }

        .sectionTitle h2 {
          margin: 0;
          font-size: 13px;
          font-weight: 500;
        }

        .sectionTitle p {
          margin: 4px 0 0;
          color: #aaa;
          font-size: 6px;
        }


        /* PRODUCTS */

        .productGrid {
          width: 100%;
          max-width: 430px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 7px;
        }

        .productCard {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 14px #0000000c;
        }

        .productImage {
          height: 155px;
          background: #f0f0f0;
          position: relative;
          overflow: hidden;
        }

        .productImage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .heart {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 19px;
          height: 19px;
          border: 0;
          background: white;
          border-radius: 50%;
          font-size: 12px;
          color: #555;
        }

        .productInfo {
          padding: 7px;
        }

        .productCategory {
          color: #7935c4;
          font-size: 5px;
        }

        .productInfo h3 {
          margin: 3px 0;
          min-height: 18px;
          font-size: 6px;
          font-weight: 500;
        }

        .productInfo strong {
          display: block;
          font-size: 9px;
          margin-bottom: 6px;
        }

        .selectButton {
          width: 100%;
          min-height: 27px;
          border: none;
          border-radius: 11px;
          background: #7935c4;
          color: white;
          font-size: 5px;
          line-height: 1.3;
          font-weight: bold;
        }


        /* FOOTER */

        footer {
          background: #171329;
          color: white;
          text-align: center;
          padding: 22px 10px;
        }

        footer strong {
          display: block;
          font-size: 8px;
        }

        footer span {
          display: block;
          color: #ddd;
          font-size: 6px;
          margin-top: 4px;
        }


        /* MOBILE */

        @media (max-width: 600px) {

          .header {
            height: 54px;
            padding: 0 13px;
          }

          .hero {
            min-height: 225px;
            grid-template-columns: 1fr 132px;
            padding: 23px 18px;
            gap: 10px;
          }

          .heroContent h1 {
            font-size: 29px;
          }

          .heroContent p {
            font-size: 6px;
            line-height: 1.55;
          }

          .heroPhoto {
            height: 165px;
          }

          .locationCard {
            margin-top: 12px;
          }

          .sectionBanner {
            height: 100px;
          }

          .productImage {
            height: 150px;
          }
        }


        /* TABLET/DESKTOP */

        @media (min-width: 700px) {

          .hero {
            grid-template-columns: 1fr 260px;
            padding: 35px 55px;
          }

          .heroContent h1 {
            font-size: 55px;
          }

          .heroPhoto {
            height: 250px;
          }

          .productGrid {
            max-width: 500px;
          }

          .productImage {
            height: 220px;
          }

        }

      `}</style>

    </main>
  );
}
