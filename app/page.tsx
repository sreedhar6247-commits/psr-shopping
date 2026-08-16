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
    name: "Elegant Violet Kurti",
    category: "Kurtis",
    price: 799,
    oldPrice: 1199,
    image: "/kurti-1.jpg",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Designer Kurti",
    category: "Kurtis",
    price: 899,
    oldPrice: 1399,
    image: "/kurti-2.jpg",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Printed Fashion Kurti",
    category: "Kurtis",
    price: 699,
    oldPrice: 999,
    image: "/kurti-3.jpg",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Premium Party Kurti",
    category: "Kurtis",
    price: 999,
    oldPrice: 1499,
    image: "/kurti-4.jpg",
    rating: 4.9,
  },
];

const categories = [
  {
    name: "Kurtis",
    emoji: "👗",
    text: "Trendy everyday elegance",
  },
  {
    name: "Sarees",
    emoji: "🥻",
    text: "Timeless traditional beauty",
  },
  {
    name: "Night Wear",
    emoji: "🌙",
    text: "Comfort meets style",
  },
  {
    name: "Lehengas",
    emoji: "💃",
    text: "Perfect for celebrations",
  },
];

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  const selectCategory = (category: string) => {
    setSelectedCategory(category);

    setTimeout(() => {
      document
        .getElementById("catalog")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const toggleWishlist = (id: number) => {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const addToCart = () => {
    setCartCount((current) => current + 1);
  };

  return (
    <main className="min-h-screen bg-[#fffafc] text-[#3c2330]">

      {/* TOP OFFER BAR */}
      <div className="bg-[#4b1735] px-4 py-2 text-center text-[11px] font-semibold tracking-[0.12em] text-white sm:text-xs">
        ✨ WELCOME TO BEE GIRL SHOPPING • TRENDY OUTFITS, TIMELESS ELEGANCE ✨
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#ead9df] bg-white/95 shadow-sm backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">

          {/* LOGO */}
          <Link href="/" className="shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7e5ee] text-2xl">
                🐝
              </div>

              <div>
                <div className="font-serif text-xl font-bold leading-none text-[#4b1735] sm:text-2xl">
                  Bee Girl
                </div>

                <div className="mt-1 text-[8px] font-bold tracking-[0.32em] text-[#b68a3a]">
                  SHOPPING
                </div>
              </div>
            </div>
          </Link>

          {/* SEARCH */}
          <div className="mx-auto hidden max-w-xl flex-1 md:block">
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search kurtis, sarees, night wear..."
                className="w-full rounded-full border border-[#e2cdd6] bg-[#fffafd] px-5 py-3 pr-12 text-sm outline-none focus:border-[#8f315e] focus:ring-2 focus:ring-[#f2dce6]"
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
                  .getElementById("wishlist")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hidden rounded-full border border-[#ead9df] px-4 py-2.5 text-sm font-semibold hover:bg-[#fff4f8] sm:block"
            >
              ♡ Wishlist
              {wishlist.length > 0 && (
                <span className="ml-1 text-[#8f315e]">
                  {wishlist.length}
                </span>
              )}
            </button>

            <Link
              href="/cart"
              className="rounded-full bg-[#8f315e] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#701f46]"
            >
              🛍️ Cart
              {cartCount > 0 && (
                <span className="ml-1">({cartCount})</span>
              )}
            </Link>

          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-[#e2cdd6] bg-[#fffafd] px-5 py-3 pr-12 text-sm outline-none focus:border-[#8f315e]"
            />

            <span className="absolute right-5 top-1/2 -translate-y-1/2">
              🔍
            </span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="border-t border-[#f0e2e7]">
          <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-4 py-3 text-sm font-semibold">

            <Link
              href="/"
              className="whitespace-nowrap text-[#8f315e]"
            >
              Home
            </Link>

            {["Kurtis", "Sarees", "Night Wear", "Lehengas"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => selectCategory(item)}
                  className="whitespace-nowrap hover:text-[#8f315e]"
                >
                  {item}
                </button>
              )
            )}

            <Link href="/cart" className="whitespace-nowrap">
              Cart
            </Link>

            <Link href="/checkout" className="whitespace-nowrap">
              Checkout
            </Link>

          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#f8e6ee] via-[#f4dce8] to-[#e7d4e5]">

        <div className="absolute left-0 top-0 h-full w-1/2 opacity-30">
          <div className="absolute left-8 top-12 h-2 w-2 rounded-full bg-[#b68a3a]" />
          <div className="absolute left-20 top-28 h-3 w-3 rounded-full bg-[#b68a3a]" />
          <div className="absolute bottom-20 left-12 h-2 w-2 rounded-full bg-[#b68a3a]" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center lg:grid-cols-2">

          {/* HERO CONTENT */}
          <div className="order-2 px-6 py-12 sm:px-10 sm:py-16 lg:order-1 lg:py-20">

            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#b68a3a]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b68a3a]">
                Bee Girl Shopping
              </span>
            </div>

            <h1 className="font-serif text-5xl font-bold leading-[1] text-[#4b1735] sm:text-6xl lg:text-7xl">
              Fashion
              <br />
              <span className="font-serif italic font-medium text-[#9c6b35]">
                That Defines You
              </span>
            </h1>

            <p className="mt-6 text-base font-medium text-[#684b59] sm:text-lg">
              Trendy Outfits, Timeless Elegance
            </p>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#7a626c]">
              Discover beautiful fashion collections made for every mood,
              moment and celebration.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() => selectCategory("Kurtis")}
                className="rounded-none bg-[#8f315e] px-8 py-3.5 text-xs font-bold tracking-[0.14em] text-white shadow-lg transition hover:bg-[#701f46]"
              >
                🛍️ SHOP NOW
              </button>

              <Link
                href="/cart"
                className="rounded-none border border-[#8f315e] bg-white/60 px-8 py-3.5 text-xs font-bold tracking-[0.14em] text-[#8f315e] hover:bg-white"
              >
                VIEW CART
              </Link>

            </div>

            {/* FEATURE BADGES */}
            <div className="mt-10 grid grid-cols-2 gap-0 border-y border-[#d7bdc8] sm:grid-cols-4">

              <div className="border-r border-[#d7bdc8] px-3 py-4 text-center">
                <div className="text-lg">🏅</div>
                <p className="mt-1 text-[9px] font-bold tracking-[0.12em] text-[#4b1735]">
                  PREMIUM
                </p>
                <p className="text-[9px] tracking-[0.12em] text-[#80636e]">
                  QUALITY
                </p>
              </div>

              <div className="border-r border-[#d7bdc8] px-3 py-4 text-center">
                <div className="text-lg">🚚</div>
                <p className="mt-1 text-[9px] font-bold tracking-[0.12em] text-[#4b1735]">
                  FAST & FREE
                </p>
                <p className="text-[9px] tracking-[0.12em] text-[#80636e]">
                  DELIVERY
                </p>
              </div>

              <div className="border-r border-[#d7bdc8] px-3 py-4 text-center">
                <div className="text-lg">🛡️</div>
                <p className="mt-1 text-[9px] font-bold tracking-[0.12em] text-[#4b1735]">
                  SECURE
                </p>
                <p className="text-[9px] tracking-[0.12em] text-[#80636e]">
                  PAYMENT
                </p>
              </div>

              <div className="px-3 py-4 text-center">
                <div className="text-lg">🎧</div>
                <p className="mt-1 text-[9px] font-bold tracking-[0.12em] text-[#4b1735]">
                  CUSTOMER
                </p>
                <p className="text-[9px] tracking-[0.12em] text-[#80636e]">
                  SUPPORT
                </p>
              </div>

            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="order-1 flex min-h-[430px] items-end justify-center overflow-hidden bg-gradient-to-br from-[#e6d6e7] to-[#cdb9d4] lg:order-2 lg:min-h-[620px]">

            <div className="relative h-full w-full">

              <img
                src="/hero-violet-kurti.png"
                alt="Violet kurti fashion collection"
                className="h-full min-h-[430px] w-full object-cover object-center lg:min-h-[620px]"
              />

              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f8e6ee] to-transparent lg:w-28" />

            </div>
          </div>

        </div>
      </section>

      {/* STORE INFORMATION STRIP */}
      <section className="bg-[#4b1735] text-white">

        <div className="mx-auto grid max-w-7xl md:grid-cols-4">

          <a
            href="https://www.google.com/maps/search/?api=1&query=Sai+Nagar+7th+Cross+Anantapur"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-white/10 p-6 transition hover:bg-white/5 md:border-b-0 md:border-r"
          >
            <div className="flex gap-4">
              <div className="text-2xl">📍</div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#e5c17a]">
                  Our Store
                </p>

                <p className="mt-2 text-sm font-semibold">
                  Sai Nagar, 7th Cross
                </p>

                <p className="text-sm text-white/60">
                  Anantapur
                </p>
              </div>
            </div>
          </a>

          <div className="border-b border-white/10 p-6 md:border-b-0 md:border-r">
            <div className="flex gap-4">
              <div className="text-2xl">💬</div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#e5c17a]">
                  WhatsApp Support
                </p>

                <p className="mt-2 text-sm font-semibold">
                  Chat with Us
                </p>

                <p className="text-sm text-white/60">
                  Number will be added later
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("wishlist")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="border-b border-white/10 p-6 text-left transition hover:bg-white/5 md:border-b-0 md:border-r"
          >
            <div className="flex gap-4">
              <div className="text-2xl">♡</div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#e5c17a]">
                  Wishlist
                </p>

                <p className="mt-2 text-sm font-semibold">
                  Save your favourites
                </p>

                <p className="text-sm text-white/60">
                  {wishlist.length} saved item
                  {wishlist.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          </button>

          <Link
            href="/cart"
            className="p-6 transition hover:bg-white/5"
          >
            <div className="flex gap-4">
              <div className="text-2xl">🛒</div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#e5c17a]">
                  Your Cart
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {cartCount} item{cartCount === 1 ? "" : "s"}
                </p>

                <p className="text-sm text-white/60">
                  View your shopping bag
                </p>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="text-center">

          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b68a3a]">
            Explore Our Collections
          </p>

          <h2 className="mt-3 font-serif text-3xl font-bold text-[#4b1735] sm:text-4xl">
            Shop By Category
          </h2>

          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#d4b06b]" />
            <span className="text-[#b68a3a]">✦</span>
            <span className="h-px w-12 bg-[#d4b06b]" />
          </div>

        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">

          {categories.map((category) => (

            <button
              key={category.name}
              type="button"
              onClick={() => selectCategory(category.name)}
              className="group border border-[#ead9df] bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#c796aa] hover:shadow-xl"
            >

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f9eaf1] text-4xl transition group-hover:scale-110">
                {category.emoji}
              </div>

              <h3 className="mt-5 font-serif text-xl font-bold text-[#4b1735]">
                {category.name}
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#80636e]">
                {category.text}
              </p>

              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#8f315e]">
                Explore →
              </p>

            </button>

          ))}

        </div>
      </section>

      {/* CATALOG */}
      <section
        id="catalog"
        className="bg-[#fbf1f5] px-4 py-14 sm:px-6 lg:px-8"
      >

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b68a3a]">
              Bee Girl Collection
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold text-[#4b1735] sm:text-4xl">
              {selectedCategory === "All"
                ? "Featured Kurtis"
                : selectedCategory}
            </h2>

          </div>

          {/* FILTERS */}
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">

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
                className={`whitespace-nowrap border px-5 py-2.5 text-xs font-bold uppercase tracking-wide transition ${
                  selectedCategory === category
                    ? "border-[#8f315e] bg-[#8f315e] text-white"
                    : "border-[#dcc5cf] bg-white text-[#604653] hover:border-[#8f315e]"
                }`}
              >
                {category}
              </button>

            ))}

          </div>

          {/* PRODUCTS */}
          <div
            id="wishlist"
            className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4"
          >

            {visibleProducts.map((product) => {

              const saved = wishlist.includes(product.id);

              const discount = Math.round(
                ((product.oldPrice - product.price) /
                  product.oldPrice) *
                  100
              );

              return (
                <article
                  key={product.id}
                  className="overflow-hidden border border-[#ead9df] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >

                  <div className="relative aspect-[3/4] overflow-hidden bg-[#f4e8ee]">

                    <Link href={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </Link>

                    <span className="absolute left-3 top-3 bg-[#8f315e] px-2.5 py-1 text-[9px] font-bold text-white">
                      {discount}% OFF
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-lg shadow"
                      aria-label="Wishlist"
                    >
                      {saved ? "❤️" : "♡"}
                    </button>

                  </div>

                  <div className="p-4">

                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#b68a3a]">
                      {product.category}
                    </p>

                    <Link href={`/product/${product.id}`}>
                      <h3 className="mt-1 truncate font-serif text-base font-bold text-[#4b1735]">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-bold text-[#8f315e]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>

                      <span className="text-xs text-gray-400 line-through">
                        ₹{product.oldPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <p className="mt-2 text-xs">
                      ⭐ {product.rating}
                    </p>

                    <button
                      type="button"
                      onClick={addToCart}
                      className="mt-4 w-full bg-[#4b1735] py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#8f315e]"
                    >
                      Add To Cart
                    </button>

                  </div>
                </article>
              );
            })}

          </div>

          {visibleProducts.length === 0 && (
            <div className="mt-8 border border-[#ead9df] bg-white p-12 text-center">
              <div className="text-4xl">🛍️</div>

              <h3 className="mt-4 font-serif text-xl font-bold text-[#4b1735]">
                Coming Soon
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Beautiful {selectedCategory.toLowerCase()} collections
                will be added here.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* COLLECTION BANNERS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-5 md:grid-cols-3">

          <button
            type="button"
            onClick={() => selectCategory("Sarees")}
            className="bg-gradient-to-br from-[#f5dce7] to-[#e9bdd1] p-7 text-left transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-4xl">🥻</div>
            <h3 className="mt-4 font-serif text-2xl font-bold text-[#4b1735]">
              Sarees
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#684b59]">
              Graceful traditional styles for beautiful occasions.
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#8f315e]">
              Explore Sarees →
            </p>
          </button>

          <button
            type="button"
            onClick={() => selectCategory("Night Wear")}
            className="bg-gradient-to-br from-[#e6e0f2] to-[#c9bfe2] p-7 text-left transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-4xl">🌙</div>
            <h3 className="mt-4 font-serif text-2xl font-bold text-[#493d69]">
              Night Wear
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#5d5670]">
              Soft, comfortable and stylish night collections.
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#665493]">
              Explore Night Wear →
            </p>
          </button>

          <button
            type="button"
            onClick={() => selectCategory("Lehengas")}
            className="bg-gradient-to-br from-[#f5e3c0] to-[#e9c887] p-7 text-left transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-4xl">💃</div>
            <h3 className="mt-4 font-serif text-2xl font-bold text-[#674919]">
              Lehengas
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#66502d]">
              Celebration-ready styles for your special moments.
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#89591b]">
              Explore Lehengas →
            </p>
          </button>

        </div>
      </section>

      {/* WHY BEE GIRL */}
      <section className="bg-[#4b1735] px-4 py-14 text-white sm:px-6">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#e5c17a]">
              The Bee Girl Promise
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
              Made For Your Style
            </h2>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            <div className="text-center">
              <div className="text-3xl">✨</div>
              <h3 className="mt-3 font-bold">Premium Quality</h3>
              <p className="mt-2 text-xs leading-5 text-white/60">
                Carefully selected fashion collections.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl">🚚</div>
              <h3 className="mt-3 font-bold">Easy Delivery</h3>
              <p className="mt-2 text-xs leading-5 text-white/60">
                Convenient doorstep shopping.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl">🔐</div>
              <h3 className="mt-3 font-bold">Secure Payment</h3>
              <p className="mt-2 text-xs leading-5 text-white/60">
                Secure checkout will be connected through Razorpay.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl">💝</div>
              <h3 className="mt-3 font-bold">Customer Support</h3>
              <p className="mt-2 text-xs leading-5 text-white/60">
                Support details can be added when your WhatsApp number is ready.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* STORE + OWNER */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-5 md:grid-cols-3">

          <a
            href="https://www.google.com/maps/search/?api=1&query=Sai+Nagar+7th+Cross+Anantapur"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#ead9df] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-3xl">📍</div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b68a3a]">
              Our Store
            </p>

            <h3 className="mt-2 font-serif text-xl font-bold text-[#4b1735]">
              Bee Girl Shopping
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Sai Nagar, 7th Cross
              <br />
              Anantapur
            </p>

            <p className="mt-4 text-xs font-bold text-[#8f315e]">
              Open Location →
            </p>
          </a>

          <div className="border border-[#ead9df] bg-[#f5fff8] p-7 shadow-sm">
            <div className="text-3xl">💬</div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#279653]">
              WhatsApp Support
            </p>

            <h3 className="mt-2 font-serif text-xl font-bold text-[#244e35]">
              Chat With Us
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Your WhatsApp support number is intentionally left empty
              until you provide the business number.
            </p>

            <span className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-xs font-bold text-[#279653]">
              Number pending
            </span>
          </div>

          <Link
            href="/admin"
            className="border border-[#ead9df] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-3xl">👑</div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b68a3a]">
              Store Owner
            </p>

            <h3 className="mt-2 font-serif text-xl font-bold text-[#4b1735]">
              Owner / Admin
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Manage products, orders and store operations from your
              administration area.
            </p>

            <p className="mt-4 text-xs font-bold text-[#8f315e]">
              Open Admin →
            </p>
          </Link>

        </div>
      </section>

      {/* CART / CHECKOUT ACTIONS */}
      <section className="bg-[#fbf1f5] px-4 py-12">

        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <Link
            href="/cart"
            className="border border-[#ead9df] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">🛒</div>
            <h3 className="mt-3 font-serif text-xl font-bold text-[#4b1735]">
              My Cart
            </h3>
            <p className="mt-2 text-xs text-gray-500">
              Review and manage your selected products.
            </p>
          </Link>

          <Link
            href="/checkout"
            className="bg-[#8f315e] p-6 text-center text-white shadow-sm transition hover:-translate-y-1 hover:bg-[#701f46] hover:shadow-lg"
          >
            <div className="text-3xl">💳</div>
            <h3 className="mt-3 font-serif text-xl font-bold">
              Checkout
            </h3>
            <p className="mt-2 text-xs text-white/70">
              Continue to secure checkout and payment.
            </p>
          </Link>

          <Link
            href="/admin"
            className="border border-[#ead9df] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">⚙️</div>
            <h3 className="mt-3 font-serif text-xl font-bold text-[#4b1735]">
              Owner Dashboard
            </h3>
            <p className="mt-2 text-xs text-gray-500">
              Store management and order controls.
            </p>
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#211018] px-4 py-12 text-white sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <div className="flex items-center gap-3">
                <div className="text-3xl">🐝</div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#e5c17a]">
                    Bee Girl
                  </h2>

                  <p className="text-[8px] tracking-[0.3em] text-white/50">
                    SHOPPING
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-white/55">
                Trendy outfits, timeless elegance and fashion made for
                your beautiful moments.
              </p>
            </div>

            <div>
              <h3 className="font-bold">Shop</h3>

              <div className="mt-4 space-y-3 text-sm text-white/60">
                {["Kurtis", "Sarees", "Night Wear", "Lehengas"].map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => selectCategory(item)}
                      className="block hover:text-white"
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold">Customer Care</h3>

              <div className="mt-4 space-y-3 text-sm text-white/60">
                <Link href="/cart" className="block hover:text-white">
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
              <h3 className="font-bold">Visit Us</h3>

              <div className="mt-4 space-y-3 text-sm text-white/60">
                <p>📍 Sai Nagar, 7th Cross</p>
                <p>Anantapur</p>
                <p>💬 WhatsApp Support</p>
                <p>🔐 Secure Checkout</p>
              </div>
            </div>

          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/35">
            © {new Date().getFullYear()} Bee Girl Shopping. All rights reserved.
          </div>

        </div>
      </footer>

      {/* FLOATING LOCATION - LEFT */}
      <a
        href="https://www.google.com/maps/search/?api=1&query=Sai+Nagar+7th+Cross+Anantapur"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 left-4 z-50 flex items-center gap-2 rounded-full bg-[#4b1735] px-4 py-3 text-xs font-bold text-white shadow-xl transition hover:bg-[#8f315e]"
      >
        📍
        <span>Location</span>
      </a>

      {/* FLOATING WHATSAPP - LEFT */}
      <div
        className="fixed left-0 top-1/2 z-40 flex -translate-y-1/2 items-center gap-2 rounded-r-full bg-[#25d366] px-3 py-3 text-xs font-bold text-white shadow-xl"
        aria-label="WhatsApp support"
      >
        💬
        <span className="hidden sm:inline">
          WhatsApp
        </span>
      </div>

    </main>
  );
}
