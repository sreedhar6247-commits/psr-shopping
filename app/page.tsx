"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { products as defaultProducts, type Product } from "@/lib/catalog";

const CART_KEY = "bee-girl-shopping-cart";
const WISH_KEY = "bee-girl-wishlist";
const PRODUCT_KEY = "bee-girl-products";

const whatsappUrl =
  "https://wa.me/919876543210?text=Hello%20Bee%20Girl%20Shopping%2C%20I%20need%20help%20with%20an%20order.";

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Sai+Nagar+7th+Cross+Anantapur";

const categories = [
  {
    name: "Kurtis",
    title: "Elegant Kurtis",
    subtitle: "Everyday style with beautiful designs",
    image: "/products/kurti-1.jpg",
  },
  {
    name: "Sarees",
    title: "Graceful Sarees",
    subtitle: "Traditional beauty with a modern touch",
    image: "/products/kurti-3.jpg",
  },
  {
    name: "Lehengas",
    title: "Designer Lehengas",
    subtitle: "Perfect for celebrations",
    image: "/products/kurti-2.jpg",
  },
  {
    name: "Night Wear",
    title: "Comfort Night Wear",
    subtitle: "Relax in comfort and style",
    image: "/products/kurti-4.jpg",
  },
];

function readProducts(): Product[] {
  try {
    const saved = JSON.parse(
      localStorage.getItem(PRODUCT_KEY) || "null"
    );

    return Array.isArray(saved) && saved.length
      ? saved
      : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

export default function Home() {
  const [products, setProducts] =
    useState<Product[]>(defaultProducts);

  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const [selected, setSelected] =
    useState<Product | null>(null);

  const [size, setSize] = useState("");
  const [colour, setColour] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const refresh = () => {
    try {
      const cart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      const wish = JSON.parse(
        localStorage.getItem(WISH_KEY) || "[]"
      );

      setCartCount(
        Array.isArray(cart)
          ? cart.reduce(
              (
                sum: number,
                item: { quantity?: number }
              ) => sum + Number(item.quantity || 1),
              0
            )
          : 0
      );

      setWishlist(
        Array.isArray(wish)
          ? wish.map(Number)
          : []
      );

      setProducts(readProducts());
    } catch {
      setCartCount(0);
      setWishlist([]);
      setProducts(defaultProducts);
    }
  };

  useEffect(() => {
    refresh();

    window.addEventListener(
      "cart-updated",
      refresh
    );

    window.addEventListener(
      "wishlist-updated",
      refresh
    );

    window.addEventListener(
      "products-updated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        refresh
      );

      window.removeEventListener(
        "wishlist-updated",
        refresh
      );

      window.removeEventListener(
        "products-updated",
        refresh
      );
    };
  }, []);

  const visibleProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.active &&
        (category === "All" ||
          p.category === category) &&
        `${p.name} ${p.category}`
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [products, category, search]);

  function toggleWishlist(id: number) {
    const updated = wishlist.includes(id)
      ? wishlist.filter((x) => x !== id)
      : [...wishlist, id];

    setWishlist(updated);

    localStorage.setItem(
      WISH_KEY,
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event("wishlist-updated")
    );
  }

  function openProduct(product: Product) {
    setSelected(product);
    setSize(product.sizes[0] || "");
    setColour(product.colours[0] || "");
    setNotice("");
  }

  function addToCart() {
    if (!selected) return;

    if (!size || !colour) {
      setNotice(
        "Please select size and colour."
      );
      return;
    }

    let cart: any[] = [];

    try {
      const saved = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      cart = Array.isArray(saved)
        ? saved
        : [];
    } catch {}

    const existing = cart.find(
      (item) =>
        item.id === selected.id &&
        item.size === size &&
        item.color === colour
    );

    if (existing) {
      existing.quantity =
        Number(existing.quantity || 0) + 1;
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
      CART_KEY,
      JSON.stringify(cart)
    );

    window.dispatchEvent(
      new Event("cart-updated")
    );

    setSelected(null);
  }

  return (
    <main>

      {/* TOP BAR */}
      <div className="topbar">
        <span>🐝 BEE GIRL SHOPPING</span>

        <span>
          Women&apos;s Fashion • Anantapur
        </span>
      </div>

      {/* HEADER */}
      <header className="header">

        <div className="headerSide">
          <Link
            href="/"
            className="logoMini"
          >
            <img
              src="/products/bee-girl-logo.jpg"
              alt="Bee Girl Shopping logo"
            />
          </Link>
        </div>

        <div className="brand">
          <span>
            🌸 Bee Girl Shopping
          </span>

          <small>
            Style • Grace • Comfort
          </small>
        </div>

        <div className="headerSide right">

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="headBtn location"
          >
            📍 Location
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="headBtn whatsapp"
          >
            💬 WhatsApp
          </a>

          <Link
            className="headBtn wish"
            href="#wishlist"
          >
            ♡ {wishlist.length}
          </Link>

          <Link
            className="headBtn cart"
            href="/cart"
          >
            🛒 {cartCount}
          </Link>

        </div>

      </header>

      {/* HERO IMAGE */}
      <section className="hero">
        <img
          src="/products/bee-girl-main-header.png"
          alt="Bee Girl Shopping fashion collection"
        />
      </section>

      {/* INTRO */}
      <section className="intro">

        <span className="eyebrow">
          BEE GIRL SHOPPING
        </span>

        <h1>
          Beautiful fashion for every occasion
        </h1>

        <p>
          Shop elegant kurtis, sarees,
          lehengas and comfortable night
          wear from Bee Girl Shopping in
          Anantapur.
        </p>

        <button
          className="primary"
          onClick={() =>
            document
              .getElementById("catalog")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
        >
          SHOP COLLECTION
        </button>

      </section>

      {/* QUICK FEATURES */}
      <section className="quick">

        <span>
          <b>
            👗 Real Clothing Images
          </b>

          <span>
            See the actual product image
            in every catalogue card
          </span>
        </span>

        <span>
          <b>
            ♡ Wishlist
          </b>

          <span>
            Save your favourite products
            for later
          </span>
        </span>

        <span>
          <b>
            🛒 Easy Cart
          </b>

          <span>
            Quantity, remove and total
            controls
          </span>
        </span>

        <span>
          <b>
            🔒 Secure Payment
          </b>

          <span>
            Razorpay checkout
          </span>
        </span>

      </section>

      {/* CATEGORY NAVIGATION */}
      <section className="categoryNav">

        {categories.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setCategory(item.name);

              document
                .getElementById("catalog")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            {item.name}
          </button>
        ))}

        <button
          onClick={() =>
            setCategory("All")
          }
        >
          All Products
        </button>

      </section>

      {/* CATALOG */}
      <section
        className="catalog"
        id="catalog"
      >

        <div className="sectionHead">

          <span>
            OUR COLLECTION
          </span>

          <h2>
            {category === "All"
              ? "Shop the collection"
              : category}
          </h2>

          <p>
            Choose your favourite design,
            select size and colour, then add
            it to your cart.
          </p>

        </div>

        {/* SEARCH + FILTER */}
        <div className="tools">

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search products..."
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option>
              All
            </option>

            {categories.map((c) => (
              <option
                key={c.name}
                value={c.name}
              >
                {c.name}
              </option>
            ))}

          </select>

        </div>

        {/* PRODUCT GRID */}
        <div className="grid">

          {visibleProducts.map(
            (product) => (

              <article
                className="card"
                key={product.id}
              >

                <div className="imageWrap">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <button
                    className={`heart ${
                      wishlist.includes(
                        product.id
                      )
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      toggleWishlist(
                        product.id
                      )
                    }
                    aria-label="Wishlist"
                  >
                    {wishlist.includes(
                      product.id
                    )
                      ? "♥"
                      : "♡"}
                  </button>

                </div>

                <div className="cardBody">

                  <span className="category">
                    {product.category}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    {product.description}
                  </p>

                  <div className="cardBottom">

                    <strong>
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <button
                      onClick={() =>
                        openProduct(product)
                      }
                    >
                      SELECT
                    </button>

                  </div>

                </div>

              </article>

            )
          )}

        </div>

        {visibleProducts.length === 0 && (
          <div className="empty">
            No products found.
            Try another search.
          </div>
        )}

      </section>

      {/* WISHLIST */}
      <section
        className="wishlist"
        id="wishlist"
      >

        <div className="sectionHead">

          <span>
            YOUR SAVED ITEMS
          </span>

          <h2>
            Wishlist
          </h2>

          <p>
            {wishlist.length
              ? `${wishlist.length} item(s) saved for later.`
              : "Tap the heart on any product to save it here."}
          </p>

        </div>

        {wishlist.length > 0 && (

          <div className="miniGrid">

            {products
              .filter((p) =>
                wishlist.includes(p.id)
              )
              .map((p) => (

                <button
                  key={p.id}
                  onClick={() =>
                    openProduct(p)
                  }
                >

                  <img
                    src={p.image}
                    alt={p.name}
                  />

                  <span>
                    {p.name}
                  </span>

                  <b>
                    ₹
                    {p.price.toLocaleString(
                      "en-IN"
                    )}
                  </b>

                </button>

              ))}

          </div>

        )}

      </section>

      {/* FOOTER */}
      <footer>

        <div>

          <img
            src="/products/bee-girl-logo.jpg"
            alt="Bee Girl Shopping"
          />

          <h2>
            Bee Girl Shopping
          </h2>

          <p>
            📍 Sai Nagar, 7th Cross,
            Anantapur
          </p>

        </div>

        <div>

          <h3>
            Customer Support
          </h3>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            💬 WhatsApp Support
          </a>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            📍 Open Location
          </a>

          <Link href="/cart">
            🛒 Cart
          </Link>

          <Link href="/admin">
            🔐 Admin
          </Link>

        </div>

        <small>
          © 2026 Bee Girl Shopping.
          All rights reserved.
        </small>

      </footer>

      {/* PRODUCT SELECT MODAL */}
      {selected && (

        <div
          className="modalBackdrop"
          onClick={() =>
            setSelected(null)
          }
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
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

            <div>

              <span className="category">
                {selected.category}
              </span>

              <h2>
                {selected.name}
              </h2>

              <p>
                {selected.description}
              </p>

              <strong className="modalPrice">
                ₹
                {selected.price.toLocaleString(
                  "en-IN"
                )}
              </strong>

              {/* SIZE */}
              <label>
                Size
              </label>

              <div className="options">

                {selected.sizes.map(
                  (x) => (

                    <button
                      key={x}
                      className={
                        size === x
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        setSize(x)
                      }
                    >
                      {x}
                    </button>

                  )
                )}

              </div>

              {/* COLOUR */}
              <label>
                Colour
              </label>

              <div className="options">

                {selected.colours.map(
                  (x) => (

                    <button
                      key={x}
                      className={
                        colour === x
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        setColour(x)
                      }
                    >
                      {x}
                    </button>

                  )
                )}

              </div>

              {notice && (
                <div className="notice">
                  {notice}
                </div>
              )}

              <button
                className="add"
                onClick={addToCart}
              >
                ADD TO CART
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}
