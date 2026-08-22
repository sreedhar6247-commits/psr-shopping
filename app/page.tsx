"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  products as defaultProducts,
  type Product,
} from "@/lib/catalog";

const CART_KEY = "bee-girl-shopping-cart";
const WISH_KEY = "bee-girl-wishlist";

const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
  "919876543210";

const whatsappUrl =
  `https://wa.me/${whatsappNumber}?text=` +
  "Hello%20Bee%20Girl%20Shopping%2C%20I%20need%20help%20with%20an%20order.";

const mapsUrl =
  "https://maps.app.goo.gl/cdn339RiDvj99ikE9?g_st=ac";

const categories = [
  "Kurtis",
  "Sarees",
  "Lehengas",
  "Night Wear",
];

function safeProduct(p: any, index = 0): Product {
  return {
    id: Number(p?.id || index + 1),
    name: String(p?.name || "Bee Girl Product"),
    category: String(p?.category || "Kurtis"),
    description: String(p?.description || ""),
    price: Number(p?.price || 0),
    image: String(
      p?.image || "/products/kurti-1.jpg"
    ),
    sizes: Array.isArray(p?.sizes)
      ? p.sizes.map(String)
      : ["Free Size"],
    colours: Array.isArray(p?.colours)
      ? p.colours.map(String)
      : ["Default"],
    stock: Number(p?.stock ?? 10),
    active: p?.active !== false,
  };
}

const safeDefaults: Product[] = defaultProducts.map(
  (p: any, index: number) => safeProduct(p, index)
);

function ProductImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [bad, setBad] = useState(false);

  useEffect(() => {
    setBad(false);
  }, [src]);

  if (bad) {
    return (
      <div className="imageFallback">
        👗
        <b>Bee Girl Shopping</b>
      </div>
    );
  }

  return (
    <img
      src={src || "/products/kurti-1.jpg"}
      alt={alt || "Bee Girl Shopping"}
      onError={() => setBad(true)}
      loading="lazy"
    />
  );
}

export default function Home() {
  const [products, setProducts] =
    useState<Product[]>(safeDefaults);

  const [wishlist, setWishlist] =
    useState<number[]>([]);

  const [cartCount, setCartCount] =
    useState(0);

  const [selected, setSelected] =
    useState<Product | null>(null);

  const [size, setSize] = useState("");
  const [colour, setColour] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  function refresh() {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      const savedWishlist = JSON.parse(
        localStorage.getItem(WISH_KEY) || "[]"
      );

      setCartCount(
        Array.isArray(savedCart)
          ? savedCart.reduce(
              (sum: number, item: any) =>
                sum + Number(item?.quantity || 1),
              0
            )
          : 0
      );

      setWishlist(
        Array.isArray(savedWishlist)
          ? savedWishlist
              .map((id: any) => Number(id))
              .filter((id: number) =>
                Number.isFinite(id)
              )
          : []
      );
    } catch {
      setCartCount(0);
      setWishlist([]);
    }
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        const response =
          await fetch("/api/products", {
            cache: "no-store",
          });

        if (!response.ok) {
          setProducts(safeDefaults);
          return;
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length) {
          const clean = data.map(
            (p: any, index: number) =>
              safeProduct(p, index)
          );

          setProducts(clean);
        } else {
          setProducts(safeDefaults);
        }
      } catch {
        setProducts(safeDefaults);
      }
    }

    loadProducts();
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
      "storage",
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
        "storage",
        refresh
      );
    };
  }, []);

  const visible = useMemo(() => {
    const text = search.toLowerCase().trim();

    return products.filter((p) => {
      if (!p) return false;

      const active = p.active !== false;

      const categoryMatches =
        category === "All" ||
        p.category === category;

      const searchMatches =
        `${p.name || ""} ${p.category || ""}`
          .toLowerCase()
          .includes(text);

      return (
        active &&
        categoryMatches &&
        searchMatches
      );
    });
  }, [products, category, search]);

  function toggleWishlist(id: number) {
    const next = wishlist.includes(id)
      ? wishlist.filter((x) => x !== id)
      : [...wishlist, id];

    setWishlist(next);

    localStorage.setItem(
      WISH_KEY,
      JSON.stringify(next)
    );

    window.dispatchEvent(
      new Event("wishlist-updated")
    );
  }

  function openProduct(product: Product) {
    const sizes = Array.isArray(product.sizes)
      ? product.sizes
      : [];

    const colours = Array.isArray(
      product.colours
    )
      ? product.colours
      : [];

    setSelected(product);
    setSize(sizes[0] || "");
    setColour(colours[0] || "");
    setNotice("");
  }

  function addToCart() {
    if (!selected) return;

    if (!size) {
      setNotice("Please select a size.");
      return;
    }

    if (!colour) {
      setNotice("Please select a colour.");
      return;
    }

    let cart: any[] = [];

    try {
      const stored = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      cart = Array.isArray(stored)
        ? stored
        : [];
    } catch {
      cart = [];
    }

    const found = cart.find(
      (item) =>
        Number(item?.id) === selected.id &&
        item?.size === size &&
        item?.color === colour
    );

    if (found) {
      found.quantity =
        Number(found.quantity || 1) + 1;
    } else {
      cart.push({
        id: selected.id,
        name: selected.name,
        category: selected.category,
        price: Number(selected.price || 0),
        image:
          selected.image ||
          "/products/kurti-1.jpg",
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
      <div className="topbar">
        <span>🐝 BEE GIRL SHOPPING</span>
        <span>
          Women&apos;s Fashion • Anantapur
        </span>
      </div>

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
          <span>🌸 Bee Girl Shopping</span>
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

      <section className="hero">
        <img
          src="/products/bee-girl-main-header.png"
          alt="Bee Girl Shopping fashion collection"
        />
      </section>

      <section className="intro">
        <span className="eyebrow">
          BEE GIRL SHOPPING
        </span>

        <h1>
          Beautiful fashion for every occasion
        </h1>

        <p>
          Shop elegant kurtis, sarees, lehengas
          and comfortable night wear from Bee
          Girl Shopping in Anantapur.
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

      <section className="quick">
        <span>
          <b>👗 Real Clothing Images</b>
          <span>
            See the product image in every
            catalogue card
          </span>
        </span>

        <span>
          <b>♡ Wishlist</b>
          <span>
            Save your favourite products for later
          </span>
        </span>

        <span>
          <b>🛒 Easy Cart</b>
          <span>
            Quantity, remove and total controls
          </span>
        </span>

        <span>
          <b>🔒 Secure Payment</b>
          <span>Razorpay checkout</span>
        </span>
      </section>

      <section className="categoryNav">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => {
              setCategory(item);

              document
                .getElementById("catalog")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            {item}
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

      <section
        className="catalog"
        id="catalog"
      >
        <div className="sectionHead">
          <span>OUR COLLECTION</span>

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
            <option value="All">
              All
            </option>

            {categories.map((item) => (
              <option
                value={item}
                key={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="grid">
          {visible.map((product) => (
            <article
              className="card"
              key={product.id}
            >
              <div className="imageWrap">
                <ProductImage
                  src={
                    product.image ||
                    "/products/kurti-1.jpg"
                  }
                  alt={
                    product.name ||
                    "Bee Girl Product"
                  }
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
                  {product.description || ""}
                </p>

                <div className="cardBottom">
                  <strong>
                    ₹
                    {Number(
                      product.price || 0
                    ).toLocaleString(
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
          ))}
        </div>

        {!visible.length && (
          <div className="empty">
            No products found. Try another
            search.
          </div>
        )}
      </section>

      <section
        className="wishlist"
        id="wishlist"
      >
        <div className="sectionHead">
          <span>
            YOUR SAVED ITEMS
          </span>

          <h2>Wishlist</h2>

          <p>
            {wishlist.length
              ? `${wishlist.length} item(s) saved for later.`
              : "Tap the heart on any product to save it here."}
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="miniGrid">
            {products
              .filter((product) =>
                wishlist.includes(
                  product.id
                )
              )
              .map((product) => (
                <button
                  key={product.id}
                  onClick={() =>
                    openProduct(
                      product
                    )
                  }
                >
                  <ProductImage
                    src={
                      product.image ||
                      "/products/kurti-1.jpg"
                    }
                    alt={
                      product.name ||
                      "Bee Girl Product"
                    }
                  />

                  <span>
                    {product.name}
                  </span>

                  <b>
                    ₹
                    {Number(
                      product.price || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </b>
                </button>
              ))}
          </div>
        )}
      </section>

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

            <ProductImage
              src={
                selected.image ||
                "/products/kurti-1.jpg"
              }
              alt={
                selected.name ||
                "Bee Girl Product"
              }
            />

            <div>
              <span className="category">
                {selected.category}
              </span>

              <h2>
                {selected.name}
              </h2>

              <p>
                {selected.description || ""}
              </p>

              <strong className="modalPrice">
                ₹
                {Number(
                  selected.price || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

              <label>
                Select Size
              </label>

              <div className="options">
                {(Array.isArray(
                  selected.sizes
                )
                  ? selected.sizes
                  : []
                ).map((item) => (
                  <button
                    key={item}
                    className={
                      size === item
                        ? "selected"
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
                Select Colour
              </label>

              <div className="options">
                {(Array.isArray(
                  selected.colours
                )
                  ? selected.colours
                  : []
                ).map((item) => (
                  <button
                    key={item}
                    className={
                      colour === item
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setColour(item)
                    }
                  >
                    {item}
                  </button>
                ))}
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
                🛒 ADD TO CART
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
