"use client";

import { useState } from "react";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Elegant Kurti",
    price: 799,
    oldPrice: 1199,
    image: "/products/kurti-1.jpg",
  },
  {
    id: 2,
    name: "Designer Kurti",
    price: 899,
    oldPrice: 1399,
    image: "/products/kurti-2.jpg",
  },
  {
    id: 3,
    name: "Printed Kurti",
    price: 699,
    oldPrice: 999,
    image: "/products/kurti-3.jpg",
  },
  {
    id: 4,
    name: "Premium Kurti",
    price: 999,
    oldPrice: 1499,
    image: "/products/kurti-4.jpg",
  },
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = () => {
    setCartCount((count) => count + 1);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-pink-600">
            PSR Shopping
          </Link>

          <div className="hidden flex-1 max-w-xl md:block">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-300 px-5 py-3 outline-none focus:border-pink-500"
            />
          </div>

          <Link
            href="/checkout"
            className="rounded-full bg-pink-600 px-5 py-3 font-semibold text-white hover:bg-pink-700"
          >
            🛒 Cart ({cartCount})
          </Link>
        </div>

        {/* Mobile search */}
        <div className="px-4 pb-4 md:hidden">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-300 px-5 py-3 outline-none focus:border-pink-500"
          />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest">
            Welcome to PSR Shopping
          </p>

          <h1 className="text-4xl font-extrabold md:text-6xl">
            Style That Makes You Shine
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-pink-100">
            Discover beautiful fashion at amazing prices. Shop our latest
            collection today.
          </p>

          <a
            href="#products"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-bold text-pink-600 shadow-lg hover:bg-gray-100"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {["👗 Kurtis", "✨ New Arrivals", "🔥 Best Sellers", "💝 Offers"].map(
            (category) => (
              <div
                key={category}
                className="cursor-pointer rounded-2xl bg-white p-6 text-center font-semibold shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-lg">{category}</span>
              </div>
            )
          )}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="mt-1 text-gray-500">
              Our most popular products
            </p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold">No products found</p>
            <p className="mt-2 text-gray-500">
              Try searching for another product.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-pink-600 px-3 py-1 text-xs font-bold text-white">
                    SALE
                  </span>
                </div>

                {/* Product Details */}
                <div className="p-5">
                  <h3 className="text-lg font-bold">{product.name}</h3>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xl font-bold text-pink-600">
                      ₹{product.price}
                    </span>

                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.oldPrice}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    ⭐⭐⭐⭐⭐ 4.8
                  </p>

                  <button
                    onClick={addToCart}
                    className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-pink-600"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why PSR Shopping */}
      <section className="border-y bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-12 md:grid-cols-3">
          <div className="text-center">
            <div className="text-4xl">🚚</div>
            <h3 className="mt-3 font-bold">Fast Delivery</h3>
            <p className="mt-1 text-sm text-gray-500">
              Quick and reliable delivery to your doorstep.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl">🔒</div>
            <h3 className="mt-3 font-bold">Secure Shopping</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your information is protected with secure checkout.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl">💯</div>
            <h3 className="mt-3 font-bold">Quality Products</h3>
            <p className="mt-1 text-sm text-gray-500">
              Carefully selected products at great prices.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold text-pink-500">
            PSR Shopping
          </h2>

          <p className="mt-2 text-gray-400">
            Fashion • Quality • Affordable
          </p>

          <div className="mt-6 text-sm text-gray-500">
            © {new Date().getFullYear()} PSR Shopping. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
