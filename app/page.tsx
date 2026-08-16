"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  image: string;
  rating: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Elegant Kurti",
    category: "Kurtis",
    price: 799,
    oldPrice: 1199,
    image: "/products/kurti-1.jpg",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Designer Kurti",
    category: "Kurtis",
    price: 899,
    oldPrice: 1399,
    image: "/products/kurti-2.jpg",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Printed Kurti",
    category: "Kurtis",
    price: 699,
    oldPrice: 999,
    image: "/products/kurti-3.jpg",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Premium Kurti",
    category: "Kurtis",
    price: 999,
    oldPrice: 1499,
    image: "/products/kurti-4.jpg",
    rating: 4.9,
  },
];

const categories = [
  {
    name: "Kurtis",
    icon: "👗",
    description: "Elegant everyday styles",
  },
  {
    name: "Sarees",
    icon: "🥻",
    description: "Graceful traditional styles",
  },
  {
    name: "Night Wear",
    icon: "🌙",
    description: "Comfort for every night",
  },
  {
    name: "Lehengas",
    icon: "💃",
    description: "Beautiful celebration wear",
  },
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  function toggleWishlist(id: number) {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function selectCategory(category: string) {
    setSelectedCategory(category);

    setTimeout(() => {
      document
        .getElementById("featured")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function addToCart() {
    setCartCount((current) => current + 1);
  }

  return (
    <main className="min-h-screen bg-[#fffafc] text-[#25161c]">

      {/* TOP BAR */}
      <div className="bg-[#4b1632] px-4 py-2 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
        ✨ Welcome to PSR Shopping • Discover your next favourite style
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#ead9df] bg-white/95 shadow-sm backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">

          {/* LOGO */}
          <Link href="/" className="shrink-0">
            <div className="text-2xl font-black tracking-tight text-[#8d2455]">
              PSR
            </div>

            <div className="-mt-1 text-[8px] font-bold uppercase tracking-[0.3em] text-[#80636e]">
              Shopping
            </div>
          </Link>

          {/* DESKTOP SEARCH */}
          <div className="mx-auto hidden max-w-xl flex-1 md:block">
            <div className="relative">

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search kurtis, sarees, night wear..."
                className="w-full rounded-full border border-[#dfcbd4] bg-[#fffafc] px-5 py-3 pr-12 text-sm outline-none transition focus:border-[#a52d64] focus:ring-2 focus:ring-[#f2d8e3]"
              />

              <span className="absolute right-5 top-1/2 -translate-y-1/2">
                🔍
              </span>

            </div>
          </div>

          {/* HEADER ACTIONS */}
          <div className="ml-auto flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("featured")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hidden h-10 rounded-full border border-[#ead9df] px-4 text-sm font-semibold transition hover:bg-[#fff1f6] sm:block"
            >
              ❤️ Wishlist
              {wishlist.length > 0 && (
                <span className="ml-1 text-[#a52d64]">
                  {wishlist.length}
                </span>
              )}
            </button>

            <Link
              href="/cart"
              className="flex h-10 items-center rounded-full bg-[#8d2455] px-4 text-sm font-bold text-white transition hover:bg-[#701a43]"
            >
              🛒
              <span className="ml-1">Cart</span>

              {cartCount > 0 && (
                <span className="ml-1">
                  ({cartCount})
                </span>
              )}
            </Link>

          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="px-4 pb-3 md:hidden">

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-[#dfcbd4] bg-[#fffafc] px-5 py-3 text-sm outline-none focus:border-[#a52d64]"
          />

        </div>

        {/* NAVIGATION */}
        <nav className="border-t border-[#f0e2e7]">

          <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-4 py-3 text-sm font-semibold">

            <Link
              href="/"
              className="whitespace-nowrap text-[#a52d64]"
            >
              Home
            </Link>

            <button
              type="button"
              onClick={() => selectCategory("Kurtis")}
              className="whitespace-nowrap"
            >
              Kurtis
            </button>

            <button
              type="button"
              onClick={() => selectCategory("Sarees")}
              className="whitespace-nowrap"
            >
              Sarees
            </button>

            <button
              type="button"
              onClick={() => selectCategory("Night Wear")}
              className="whitespace-nowrap"
            >
              Night Wear
            </button>

            <button
              type="button"
              onClick={() => selectCategory("Lehengas")}
              className="whitespace-nowrap"
            >
              Lehengas
            </button>

            <Link
              href="/cart"
              className="whitespace-nowrap"
            >
              My Cart
            </Link>

            <Link
              href="/checkout"
              className="whitespace-nowrap"
            >
              Checkout
            </Link>

          </div>

        </nav>

      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4b1632] via-[#7d2350] to-[#c45b83] text-white">

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#f6c7d8]/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:px-8">

          <div>

            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#f8dce7] sm:text-sm">
              PSR Shopping
            </p>

            <h1 className="max-w-xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Your Style.
              <br />
              Your Story.
              <br />
              <span className="text-[#ffd8e7]">
                Your PSR.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              Discover beautiful fashion collections for everyday
              elegance, celebrations and everything in between.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() => selectCategory("Kurtis")}
                className="rounded-full bg-white px-7 py-3.5 font-bold text-[#8d2455] shadow-lg transition hover:bg-[#fff2f7]"
              >
                Shop Collection
              </button>

              <Link
                href="/cart"
                className="rounded-full border border-white/40 px-7 py-3.5 font-bold text-white transition hover:bg-white/10"
              >
                View Cart
              </Link>

            </div>

          </div>

          {/* HERO IMAGE */}
          <div className="mx-auto w-full max-w-md">

            <div className="rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur">

              <img
                src="/products/kurti-1.jpg"
                alt="PSR Shopping fashion collection"
                className="h-[380px] w-full rounded-[1.5rem] object-cover sm:h-[440px]"
              />

            </div>

          </div>

        </div>

      </section>

      {/* TRUST BAR */}
      <section className="border-b border-[#ead9df] bg-white">

        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#ead9df] sm:grid-cols-4">

          <div className="px-3 py-5 text-center">
            <div className="text-xl">🚚</div>
            <p className="mt-1 text-xs font-bold sm:text-sm">
              Easy Delivery
            </p>
          </div>

          <div className="px-3 py-5 text-center">
            <div className="text-xl">🔒</div>
            <p className="mt-1 text-xs font-bold sm:text-sm">
              Secure Checkout
            </p>
          </div>

          <div className="px-3 py-5 text-center">
            <div className="text-xl">💝</div>
            <p className="mt-1 text-xs font-bold sm:text-sm">
              Quality Fashion
            </p>
          </div>

          <div className="px-3 py-5 text-center">
            <div className="text-xl">💬</div>
            <p className="mt-1 text-xs font-bold sm:text-sm">
              WhatsApp Support
            </p>
          </div>

        </div>

      </section>

      {/* CATEGORIES */}
      <section
        id="collections"
        className="mx-auto max-w-7xl px-4 py-14 sm:py-16"
      >

        <div className="mb-9 text-center">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a52d64]">
            Explore
          </p>

          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            Shop By Category
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-[#806d74]">
            Choose a collection and discover styles made for you.
          </p>

        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          {categories.map((category) => (

            <button
              key={category.name}
              type="button"
              onClick={() => selectCategory(category.name)}
              className="group rounded-3xl border border-[#ead9df] bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d69ab4] hover:shadow-xl sm:p-7"
            >

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff1f6] text-4xl transition group-hover:scale-110">
                {category.icon}
              </div>

              <h3 className="mt-5 text-lg font-black sm:text-xl">
                {category.name}
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#806d74] sm:text-sm">
                {category.description}
              </p>

              <div className="mt-4 text-sm font-bold text-[#a52d64]">
                Explore →
              </div>

            </button>

          ))}

        </div>

      </section>

      {/* FEATURED PRODUCTS */}
      <section
        id="featured"
        className="bg-[#fff2f6] px-4 py-14 sm:py-16"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a52d64]">
                Featured Collection
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                {selectedCategory === "All"
                  ? "Trending Kurtis"
                  : selectedCategory}
              </h2>

            </div>

            <Link
              href="/product/1"
              className="font-bold text-[#a52d64]"
            >
              View Collection →
            </Link>

          </div>

          {/* FILTERS */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">

            {[
              "All",
              "Kurtis",
              "Sarees",
              "Night Wear",
              "Lehengas",
            ].map((category) => (

              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  selectedCategory === category
                    ? "bg-[#8d2455] text-white"
                    : "border border-[#e2cbd4] bg-white text-[#684c57]"
                }`}
              >
                {category}
              </button>

            ))}

          </div>

          {/* PRODUCT GRID */}
          {filteredProducts.length > 0 ? (

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

              {filteredProducts.map((product) => {

                const discount = Math.round(
                  ((product.oldPrice - product.price) /
                    product.oldPrice) *
                    100
                );

                return (

                  <article
                    key={product.id}
                    className="overflow-hidden rounded-3xl border border-[#ead9df] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f7eef2]">

                      <Link href={`/product/${product.id}`}>

                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />

                      </Link>

                      <span className="absolute left-3 top-3 rounded-full bg-[#8d2455] px-2.5 py-1 text-[10px] font-black text-white">
                        {discount}% OFF
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        aria-label="Toggle wishlist"
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-lg shadow-md"
                      >
                        {wishlist.includes(product.id)
                          ? "❤️"
                          : "♡"}
                      </button>

                    </div>

                    <div className="p-4">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#a52d64]">
                        {product.category}
                      </p>

                      <Link href={`/product/${product.id}`}>

                        <h3 className="mt-1 truncate font-black">
                          {product.name}
                        </h3>

                      </Link>

                      <div className="mt-2 flex items-center gap-2">

                        <span className="text-lg font-black text-[#8d2455]">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>

                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.oldPrice.toLocaleString("en-IN")}
                        </span>

                      </div>

                      <p className="mt-2 text-xs">
                        ⭐ {product.rating}{" "}
                        <span className="text-gray-400">
                          Excellent
                        </span>
                      </p>

                      <button
                        type="button"
                        onClick={addToCart}
                        className="mt-4 w-full rounded-xl bg-[#25161c] py-3 text-sm font-bold text-white transition hover:bg-[#8d2455]"
                      >
                        Add to Cart
                      </button>

                    </div>

                  </article>

                );
              })}

            </div>

          ) : (

            <div className="rounded-3xl border border-[#ead9df] bg-white px-5 py-14 text-center">

              <div className="text-5xl">🛍️</div>

              <h3 className="mt-4 text-xl font-black">
                More products coming soon
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                This collection will be updated with new products.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* PROMOTIONAL COLLECTIONS */}
      <section className="mx-auto max-w-7xl px-4 py-14">

        <div className="mb-9 text-center">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a52d64]">
            Discover More
          </p>

          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            More From PSR
          </h2>

        </div>

        <div className="grid gap-5 md:grid-cols-3">

          <button
            type="button"
            onClick={() => selectCategory("Sarees")}
            className="group rounded-3xl bg-gradient-to-br from-[#f8d8e3] to-[#f0a8c4] p-7 text-left transition hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="text-5xl transition group-hover:scale-110">
              🥻
            </div>

            <h3 className="mt-5 text-2xl font-black">
              Sarees
            </h3>

            <p className="mt-2 text-sm text-[#664652]">
              Timeless elegance for every occasion.
            </p>

            <p className="mt-5 font-bold text-[#8d2455]">
              Explore Sarees →
            </p>

          </button>

          <button
            type="button"
            onClick={() => selectCategory("Night Wear")}
            className="group rounded-3xl bg-gradient-to-br from-[#dedafa] to-[#bcb2e8] p-7 text-left transition hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="text-5xl transition group-hover:scale-110">
              🌙
            </div>

            <h3 className="mt-5 text-2xl font-black">
              Night Wear
            </h3>

            <p className="mt-2 text-sm text-[#504b68]">
              Soft, comfortable and stylish.
            </p>

            <p className="mt-5 font-bold text-[#584d91]">
              Explore Night Wear →
            </p>

          </button>

          <button
            type="button"
            onClick={() => selectCategory("Lehengas")}
            className="group rounded-3xl bg-gradient-to-br from-[#f9e3b7] to-[#efbd71] p-7 text-left transition hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="text-5xl transition group-hover:scale-110">
              💃
            </div>

            <h3 className="mt-5 text-2xl font-black">
              Lehengas
            </h3>

            <p className="mt-2 text-sm text-[#66502d]">
              Make every celebration special.
            </p>

            <p className="mt-5 font-bold text-[#89591b]">
              Explore Lehengas →
            </p>

          </button>

        </div>

      </section>

      {/* SUPPORT SECTION */}
      <section className="bg-[#4b1632] px-4 py-14 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f5cbd9]">
              PSR Shopping
            </p>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              We're Here To Help
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/65">
              Shop confidently with convenient support and a secure
              checkout experience.
            </p>

          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            <div className="text-center">
              <div className="text-4xl">🚚</div>
              <h3 className="mt-4 font-black">
                Easy Delivery
              </h3>
              <p className="mt-2 text-sm text-white/60">
                Convenient doorstep delivery.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl">🔒</div>
              <h3 className="mt-4 font-black">
                Secure Checkout
              </h3>
              <p className="mt-2 text-sm text-white/60">
                Safe and secure payments.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl">💝</div>
              <h3 className="mt-4 font-black">
                Quality Fashion
              </h3>
              <p className="mt-2 text-sm text-white/60">
                Carefully selected collections.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl">💬</div>
              <h3 className="mt-4 font-black">
                Customer Support
              </h3>
              <p className="mt-2 text-sm text-white/60">
                Get help whenever you need it.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* WHATSAPP SUPPORT */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp support"
        className="fixed left-0 top-1/2 z-50 flex -translate-y-1/2 items-center gap-2 rounded-r-full bg-[#25D366] px-3 py-3 text-sm font-bold text-white shadow-xl transition hover:px-5"
      >
        💬

        <span className="hidden sm:inline">
          WhatsApp Support
        </span>

      </a>

      {/* LOCATION */}
      <a
        href="https://maps.google.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Store location"
        className="fixed bottom-5 left-4 z-50 flex items-center gap-2 rounded-full bg-[#25161c] px-4 py-3 text-sm font-bold text-white shadow-xl"
      >
        📍
        <span>Location</span>
      </a>

      {/* FOOTER */}
      <footer className="bg-[#1d1015] px-4 py-12 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

            <div>

              <h2 className="text-2xl font-black text-[#f0a8c4]">
                PSR Shopping
              </h2>

              <p className="mt-4 text-sm leading-6 text-white/55">
                Fashion, comfort and elegance — carefully brought
                together for you.
              </p>

            </div>

            <div>

              <h3 className="font-black">
                Shop
              </h3>

              <div className="mt-4 space-y-3 text-sm text-white/60">

                <button
                  type="button"
                  onClick={() => selectCategory("Kurtis")}
                  className="block hover:text-white"
                >
                  Kurtis
                </button>

                <button
                  type="button"
                  onClick={() => selectCategory("Sarees")}
                  className="block hover:text-white"
                >
                  Sarees
                </button>

                <button
                  type="button"
                  onClick={() => selectCategory("Night Wear")}
                  className="block hover:text-white"
                >
                  Night Wear
                </button>

                <button
                  type="button"
                  onClick={() => selectCategory("Lehengas")}
                  className="block hover:text-white"
                >
                  Lehengas
                </button>

              </div>

            </div>

            <div>

              <h3 className="font-black">
                Customer Care
              </h3>

              <div className="mt-4 space-y-3 text-sm text-white/60">

                <Link
                  href="/cart"
                  className="block hover:text-white"
                >
                  My Cart
                </Link>

                <Link
                  href="/checkout"
                  className="block hover:text-white"
                >
                  Checkout
                </Link>

                <Link
                  href="/admin"
                  className="block hover:text-white"
                >
                  Owner / Admin
                </Link>

              </div>

            </div>

            <div>

              <h3 className="font-black">
                Contact
              </h3>

              <div className="mt-4 space-y-3 text-sm text-white/60">

                <p>📍 Store Location</p>
                <p>💬 WhatsApp Support</p>
                <p>📞 Customer Support</p>
                <p>🔒 Secure Checkout</p>

              </div>

            </div>

          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
            © {new Date().getFullYear()} PSR Shopping. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}
