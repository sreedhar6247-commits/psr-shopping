"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  sizes: string[];
};

type CartItem = Product & {
  size: string;
  quantity: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Elegant Cotton Kurti",
    price: 799,
    category: "Kurtis",
    description: "Comfortable cotton kurti for everyday wear.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 2,
    name: "Designer Anarkali Kurti",
    price: 1199,
    category: "Kurtis",
    description: "Beautiful Anarkali kurti for festive occasions.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "Printed Women's Kurti",
    price: 899,
    category: "Kurtis",
    description: "Trendy printed kurti with a comfortable fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 4,
    name: "Premium Embroidered Kurti",
    price: 1499,
    category: "Kurtis",
    description: "Premium embroidered kurti for special occasions.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 5,
    name: "Floral Daily Wear Kurti",
    price: 699,
    category: "Kurtis",
    description: "Soft and stylish floral kurti for daily wear.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 6,
    name: "Party Wear Kurti",
    price: 1399,
    category: "Party Wear",
    description: "Elegant party wear outfit for special occasions.",
    sizes: ["S", "M", "L", "XL"],
  },
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [productOpen, setProductOpen] = useState<Product | null>(null);
  const [size, setSize] = useState("M");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");
  const [checkout, setCheckout] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bee girl-shopping-cart");

      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "bee girl-shopping-cart",
        JSON.stringify(cart)
      );
    } catch {}
  }, [cart]);

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(products.map((p) => p.category))),
    ];
  }, []);

  const filteredProducts = useMemo(() => {
    const text = search.toLowerCase().trim();

    return products.filter((p) => {
      const categoryMatch =
        category === "All" || p.category === category;

      const searchMatch =
        !text ||
        p.name.toLowerCase().includes(text) ||
        p.category.toLowerCase().includes(text);

      return categoryMatch && searchMatch;
    });
  }, [search, category]);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function money(value: number) {
    return `₹${value.toLocaleString("en-IN")}`;
  }

  function showMessage(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  }

  function addToCart(product: Product, selectedSize = "M") {
    setCart((oldCart) => {
      const found = oldCart.find(
        (item) =>
          item.id === product.id &&
          item.size === selectedSize
      );

      if (found) {
        return oldCart.map((item) =>
          item.id === product.id &&
          item.size === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...oldCart,
        {
          ...product,
          size: selectedSize,
          quantity: 1,
        },
      ];
    });

    showMessage(`${product.name} added to cart`);
  }

  function changeQuantity(
    id: number,
    itemSize: string,
    change: number
  ) {
    setCart((oldCart) =>
      oldCart
        .map((item) =>
          item.id === id && item.size === itemSize
            ? {
                ...item,
                quantity: item.quantity + change,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id: number, itemSize: string) {
    setCart((oldCart) =>
      oldCart.filter(
        (item) =>
          !(item.id === id && item.size === itemSize)
      )
    );
  }

  function openProduct(product: Product) {
    setProductOpen(product);
    setSize(
      product.sizes.includes("M")
        ? "M"
        : product.sizes[0]
    );
  }

  function placeOrder() {
    if (!name.trim()) {
      showMessage("Please enter your name");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      showMessage("Enter a valid 10-digit phone number");
      return;
    }

    if (!address.trim()) {
      showMessage("Please enter your address");
      return;
    }

    if (!city.trim()) {
      showMessage("Please enter your city");
      return;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      showMessage("Enter a valid 6-digit pincode");
      return;
    }

    setCart([]);
    setCheckout(false);

    setName("");
    setPhone("");
    setAddress("");
    setCity("");
    setPincode("");

    showMessage(
      "Order placed successfully! We will contact you shortly."
    );
  }

  return (
    <main className="min-h-screen bg-pink-50 text-gray-900">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="text-left"
          >
            <div className="text-2xl font-black text-pink-600">
              bee girl Shopping
            </div>

            <div className="text-xs text-gray-500">
              Women's Fashion
            </div>
          </button>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search kurtis..."
            className="hidden w-full max-w-md rounded-full border px-5 py-3 outline-none focus:border-pink-500 md:block"
          />

          <button
            onClick={() => setCartOpen(true)}
            className="relative rounded-full bg-pink-600 px-5 py-3 font-bold text-white hover:bg-pink-700"
          >
            🛒 Cart

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-1 text-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="px-4 pb-4 md:hidden">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search kurtis..."
            className="w-full rounded-full border px-5 py-3 outline-none focus:border-pink-500"
          />
        </div>
      </header>

      {/* MESSAGE */}
      {message && (
        <div className="fixed left-1/2 top-24 z-[100] -translate-x-1/2 rounded-xl bg-gray-900 px-5 py-3 text-center text-sm font-bold text-white shadow-xl">
          {message}
        </div>
      )}

      {/* HERO */}
      <section className="bg-gradient-to-r from-pink-100 via-white to-purple-100">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">

          <div>
            <p className="font-bold uppercase tracking-widest text-pink-600">
              New Collection
            </p>

            <h1 className="mt-3 text-4xl font-black sm:text-5xl">
              Beautiful Fashion
              <br />
              Made For You
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
              Discover stylish women's kurtis and outfits
              at affordable prices.
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="mt-7 rounded-full bg-pink-600 px-7 py-3 font-bold text-white hover:bg-pink-700"
            >
              Shop Now →
            </button>
          </div>

          <div className="flex min-h-[300px] items-center justify-center rounded-3xl bg-gradient-to-br from-pink-200 to-purple-200">
            <div className="text-center">
              <div className="text-8xl">👗</div>

              <h2 className="mt-4 text-3xl font-black text-pink-700">
                Bee Girl Shopping
              </h2>

              <p className="mt-2 text-gray-600">
                Fashion • Style • Comfort
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-3 overflow-x-auto">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-5 py-2 font-bold ${
                category === item
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        id="products"
        className="mx-auto max-w-7xl px-4 pb-16"
      >
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="font-bold uppercase tracking-wider text-pink-600">
              Our Collection
            </p>

            <h2 className="text-3xl font-black">
              Women's Fashion
            </h2>
          </div>

          <span className="text-sm text-gray-500">
            {filteredProducts.length} products
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <button
                onClick={() => openProduct(product)}
                className="w-full text-left"
              >
                <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 text-7xl">
                  👗
                </div>

                <div className="p-4">
                  <p className="text-xs font-bold text-pink-600">
                    {product.category}
                  </p>

                  <h3 className="mt-1 min-h-[48px] font-bold">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-xl font-black text-pink-600">
                    {money(product.price)}
                  </p>
                </div>
              </button>

              <div className="px-4 pb-4">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full rounded-xl bg-pink-600 py-3 font-bold text-white hover:bg-pink-700"
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center">
            <div className="text-5xl">🔍</div>

            <h3 className="mt-4 text-xl font-bold">
              No products found
            </h3>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-5 rounded-full bg-pink-600 px-6 py-3 font-bold text-white"
            >
              Show All
            </button>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-black text-pink-400">
            Sindhu Shopping
          </h2>

          <p className="mt-2 text-gray-400">
            Women's fashion • Style • Comfort
          </p>

          <p className="mt-6 text-sm text-gray-500">
            © {new Date().getFullYear()} Bee Girl Shopping
          </p>
        </div>
      </footer>

      {/* PRODUCT POPUP */}
      {productOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl bg-white">

            <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 text-9xl">
              👗
            </div>

            <div className="p-6">
              <button
                onClick={() => setProductOpen(null)}
                className="float-right text-2xl"
              >
                ×
              </button>

              <p className="text-sm font-bold text-pink-600">
                {productOpen.category}
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {productOpen.name}
              </h2>

              <p className="mt-2 text-2xl font-black text-pink-600">
                {money(productOpen.price)}
              </p>

              <p className="mt-4 text-gray-600">
                {productOpen.description}
              </p>

              <p className="mt-5 font-bold">
                Select Size
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {productOpen.sizes.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSize(item)}
                    className={`rounded-lg border px-4 py-2 font-bold ${
                      size === item
                        ? "border-pink-600 bg-pink-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  addToCart(productOpen, size);
                  setProductOpen(null);
                }}
                className="mt-6 w-full rounded-xl bg-pink-600 py-3 font-bold text-white hover:bg-pink-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60">
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-auto bg-white p-5">

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">
                Your Cart
              </h2>

              <button
                onClick={() => setCartOpen(false)}
                className="text-3xl"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-6xl">🛒</div>
                <p className="mt-4 font-bold">
                  Your cart is empty
                </p>
              </div>
            ) : (
              <>
                <div className="mt-6 space-y-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="rounded-xl bg-gray-50 p-4"
                    >
                      <div className="flex justify-between gap-3">
                        <div>
                          <h3 className="font-bold">
                            {item.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            Size: {item.size}
                          </p>

                          <p className="mt-1 font-bold text-pink-600">
                            {money(item.price)}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            removeItem(
                              item.id,
                              item.size
                            )
                          }
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() =>
                            changeQuantity(
                              item.id,
                              item.size,
                              -1
                            )
                          }
                          className="rounded-lg bg-white px-3 py-1 shadow"
                        >
                          −
                        </button>

                        <span className="font-bold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            changeQuantity(
                              item.id,
                              item.size,
                              1
                            )
                          }
                          className="rounded-lg bg-white px-3 py-1 shadow"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t pt-5">
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span className="text-pink-600">
                      {money(total)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setCartOpen(false);
                      setCheckout(true);
                    }}
                    className="mt-5 w-full rounded-xl bg-pink-600 py-4 font-bold text-white hover:bg-pink-700"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT */}
      {checkout && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl bg-white p-6">

            <div className="flex justify-between">
              <h2 className="text-2xl font-black">
                Checkout
              </h2>

              <button
                onClick={() => setCheckout(false)}
                className="text-3xl"
              >
                ×
              </button>
            </div>

            <p className="mt-2 text-gray-500">
              Total:{" "}
              <b className="text-pink-600">
                {money(total)}
              </b>
            </p>

            <div className="mt-6 space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full rounded-xl border p-3 outline-none focus:border-pink-500"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit Phone Number"
                inputMode="numeric"
                className="w-full rounded-xl border p-3 outline-none focus:border-pink-500"
              />

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery Address"
                rows={3}
                className="w-full rounded-xl border p-3 outline-none focus:border-pink-500"
              />

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full rounded-xl border p-3 outline-none focus:border-pink-500"
              />

              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="6-digit Pincode"
                inputMode="numeric"
                className="w-full rounded-xl border p-3 outline-none focus:border-pink-500"
              />

              <button
                onClick={placeOrder}
                className="w-full rounded-xl bg-pink-600 py-4 font-bold text-white hover:bg-pink-700"
              >
                Place Order
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-gray-500">
              Payment can be connected later.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
