"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  sizes: string[];
  colors: string[];
};

type CartItem = Product & {
  size: string;
  color: string;
  quantity: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Elegant Cotton Kurti",
    price: 799,
    category: "Kurtis",
    description: "Comfortable cotton kurti for everyday wear.",
    image: "/products/kurti-1.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Pink", "Black", "White"],
  },
  {
    id: 2,
    name: "Designer Anarkali Kurti",
    price: 1199,
    category: "Kurtis",
    description: "Beautiful Anarkali kurti for festive occasions.",
    image: "/products/kurti-2.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Blue", "Red", "Green"],
  },
  {
    id: 3,
    name: "Printed Women's Kurti",
    price: 899,
    category: "Kurtis",
    description: "Trendy printed kurti with a comfortable fit.",
    image: "/products/kurti-3.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Yellow", "Pink", "Black"],
  },
  {
    id: 4,
    name: "Premium Embroidered Kurti",
    price: 1499,
    category: "Kurtis",
    description: "Premium embroidered kurti for special occasions.",
    image: "/products/kurti-4.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Maroon", "Blue", "Green"],
  },
  {
    id: 5,
    name: "Floral Daily Wear Kurti",
    price: 699,
    category: "Casual Wear",
    description: "Soft and stylish floral kurti for daily wear.",
    image: "/products/kurti-1.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Blue", "White", "Yellow"],
  },
  {
    id: 6,
    name: "Party Wear Kurti",
    price: 1399,
    category: "Party Wear",
    description: "Elegant party wear outfit for special occasions.",
    image: "/products/kurti-2.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Red", "Wine", "Blue"],
  },
  {
    id: 7,
    name: "Designer Silk Saree",
    price: 1899,
    category: "Sarees",
    description: "Elegant saree with a beautiful designer finish.",
    image: "/products/kurti-3.jpg",
    sizes: ["Free Size"],
    colors: ["Red", "Blue", "Green", "Pink"],
  },
  {
    id: 8,
    name: "Soft Cotton Saree",
    price: 999,
    category: "Sarees",
    description: "Comfortable cotton saree for everyday use.",
    image: "/products/kurti-4.jpg",
    sizes: ["Free Size"],
    colors: ["Blue", "Yellow", "Pink", "Green"],
  },
  {
    id: 9,
    name: "Printed Casual Dress",
    price: 1099,
    category: "Dresses",
    description: "Stylish printed dress for casual outings.",
    image: "/products/kurti-1.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Blue", "Black", "White"],
  },
  {
    id: 10,
    name: "Western Casual Dress",
    price: 1299,
    category: "Dresses",
    description: "Modern comfortable dress for everyday fashion.",
    image: "/products/kurti-2.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Blue", "Red", "White"],
  },
  {
    id: 11,
    name: "Comfort Night Suit",
    price: 799,
    category: "Night Wear",
    description: "Soft and comfortable women's night wear.",
    image: "/products/kurti-3.jpg",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Pink", "Blue", "Purple", "Grey"],
  },
  {
    id: 12,
    name: "Premium Night Dress",
    price: 899,
    category: "Night Wear",
    description: "Comfortable premium night dress.",
    image: "/products/kurti-4.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Black", "Blue", "Purple"],
  },
  {
    id: 13,
    name: "Casual Women's Top",
    price: 599,
    category: "Casual Wear",
    description: "Stylish casual top for everyday fashion.",
    image: "/products/kurti-1.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Pink", "Blue"],
  },
  {
    id: 14,
    name: "Party Wear Gown",
    price: 1999,
    category: "Party Wear",
    description: "Beautiful party gown for celebrations.",
    image: "/products/kurti-2.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Red", "Black", "Blue", "Wine"],
  },
];

const categories = [
  "All",
  "Kurtis",
  "Sarees",
  "Casual Wear",
  "Night Wear",
  "Party Wear",
  "Dresses",
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [productOpen, setProductOpen] = useState<Product | null>(null);

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [checkout, setCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sindhu-shopping-cart");

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
        "sindhu-shopping-cart",
        JSON.stringify(cart)
      );
    } catch {}
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const text =
        `${product.name} ${product.category} ${product.description}`.toLowerCase();

      const matchesSearch =
        search.trim() === "" ||
        text.includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function openProduct(product: Product) {
    setProductOpen(product);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
  }

  function addToCart(product: Product) {
    const size = selectedSize || product.sizes[0];
    const color = selectedColor || product.colors[0];

    setCart((current) => {
      const existing = current.find(
        (item) =>
          item.id === product.id &&
          item.size === size &&
          item.color === color
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id &&
          item.size === size &&
          item.color === color
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          size,
          color,
          quantity: 1,
        },
      ];
    });

    setProductOpen(null);
    setCartOpen(true);
  }

  function increaseQuantity(
    id: number,
    size: string,
    color: string
  ) {
    setCart((current) =>
      current.map((item) =>
        item.id === id &&
        item.size === size &&
        item.color === color
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(
    id: number,
    size: string,
    color: string
  ) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id &&
          item.size === size &&
          item.color === color
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(
    id: number,
    size: string,
    color: string
  ) {
    setCart((current) =>
      current.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size &&
            item.color === color
          )
      )
    );
  }

  function startCheckout() {
    if (cart.length === 0) return;

    setCartOpen(false);
    setCheckout(true);
  }

  function placeOrder() {
    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !pincode.trim()
    ) {
      alert("Please fill all delivery details.");
      return;
    }

    if (phone.trim().length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }

    if (pincode.trim().length !== 6) {
      alert("Please enter a valid 6 digit pincode.");
      return;
    }

    setCheckout(false);
    setOrderPlaced(true);
    setCart([]);
  }

  return (
    <main className="min-h-screen bg-[#fff5fb] text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
          <div className="min-w-fit">
            <h1 className="text-xl font-extrabold text-pink-600 sm:text-2xl">
              Sindhu Shopping
            </h1>

            <p className="text-xs text-slate-500">
              Women&apos;s Fashion
            </p>
          </div>

          <div className="flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dresses, sarees, kurtis..."
              className="w-full rounded-full border border-slate-300 px-5 py-3 text-sm outline-none focus:border-pink-500"
            />
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="rounded-full bg-pink-600 px-4 py-3 font-bold text-white hover:bg-pink-700"
          >
            🛒 Cart
            {cartCount > 0 && (
              <span className="ml-2 rounded-full bg-white px-2 py-1 text-xs text-pink-600">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-r from-pink-100 via-white to-purple-100">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 md:grid-cols-2">
          <div>
            <p className="mb-3 font-bold uppercase tracking-widest text-pink-600">
              New Collection
            </p>

            <h2 className="text-4xl font-black leading-tight sm:text-6xl">
              Beautiful Fashion
              <br />
              Made For You
            </h2>

            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Discover stylish women&apos;s clothing at affordable
              prices. Kurtis, sarees, dresses, night wear and more.
            </p>

            <button
              onClick={() => {
                setCategory("All");
                window.scrollTo({
                  top: 650,
                  behavior: "smooth",
                });
              }}
              className="mt-7 rounded-full bg-pink-600 px-7 py-4 font-bold text-white shadow-lg hover:bg-pink-700"
            >
              Shop Now →
            </button>
          </div>

          <div className="flex min-h-[320px] items-center justify-center rounded-3xl bg-pink-200 p-8">
            <div className="text-center">
              <div className="text-8xl">👗</div>

              <h3 className="mt-5 text-3xl font-black text-pink-700">
                Sindhu Shopping
              </h3>

              <p className="mt-2 text-slate-600">
                Fashion • Style • Comfort
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-3 overflow-x-auto pb-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-6 py-3 font-semibold ${
                category === item
                  ? "bg-pink-600 text-white"
                  : "bg-white text-slate-700 shadow-sm"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="font-bold uppercase tracking-widest text-pink-600">
              Our Collection
            </p>

            <h2 className="text-3xl font-black">
              Women&apos;s Fashion
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            {filteredProducts.length} products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
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
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <button
                  onClick={() => openProduct(product)}
                  className="block w-full"
                >
                  <div className="aspect-square bg-pink-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                </button>

                <div className="p-4">
                  <p className="text-xs font-bold text-pink-600">
                    {product.category}
                  </p>

                  <h3 className="mt-1 min-h-[48px] text-lg font-bold">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-xl font-black text-pink-600">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>

                  <button
                    onClick={() => openProduct(product)}
                    className="mt-4 w-full rounded-xl bg-pink-600 py-3 font-bold text-white hover:bg-pink-700"
                  >
                    Select Size & Colour
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* PRODUCT DETAILS MODAL */}
      {productOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white">
            <div className="grid md:grid-cols-2">
              <div className="aspect-square bg-pink-50">
                <img
                  src={productOpen.image}
                  alt={productOpen.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <button
                  onClick={() => setProductOpen(null)}
                  className="float-right rounded-full bg-slate-100 px-3 py-2"
                >
                  ✕
                </button>

                <p className="text-sm font-bold text-pink-600">
                  {productOpen.category}
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {productOpen.name}
                </h2>

                <p className="mt-3 text-2xl font-black text-pink-600">
                  ₹{productOpen.price.toLocaleString("en-IN")}
                </p>

                <p className="mt-4 text-slate-600">
                  {productOpen.description}
                </p>

                {/* SIZE */}
                <div className="mt-6">
                  <h3 className="font-bold">
                    Select Size
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {productOpen.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-lg border px-5 py-3 font-semibold ${
                          selectedSize === size
                            ? "border-pink-600 bg-pink-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* COLOUR */}
                <div className="mt-6">
                  <h3 className="font-bold">
                    Select Colour
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {productOpen.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`rounded-lg border px-5 py-3 font-semibold ${
                          selectedColor === color
                            ? "border-pink-600 bg-pink-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(productOpen)}
                  className="mt-7 w-full rounded-xl bg-pink-600 py-4 font-bold text-white hover:bg-pink-700"
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CART */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60">
          <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-2xl font-black">
                  Your Cart
                </h2>

                <p className="text-sm text-slate-500">
                  {cartCount} item(s)
                </p>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full bg-slate-100 px-4 py-2"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="text-6xl">🛒</div>

                  <h3 className="mt-5 text-xl font-bold">
                    Your cart is empty
                  </h3>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="rounded-2xl border p-3"
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-24 w-24 rounded-xl object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold">
                            {item.name}
                          </h3>

                          <p className="text-sm text-slate-500">
                            Size: {item.size}
                          </p>

                          <p className="text-sm text-slate-500">
                            Colour: {item.color}
                          </p>

                          <p className="mt-1 font-bold text-pink-600">
                            ₹
                            {(
                              item.price * item.quantity
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              decreaseQuantity(
                                item.id,
                                item.size,
                                item.color
                              )
                            }
                            className="h-9 w-9 rounded-full bg-slate-100 font-bold"
                          >
                            −
                          </button>

                          <span className="font-bold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(
                                item.id,
                                item.size,
                                item.color
                              )
                            }
                            className="h-9 w-9 rounded-full bg-pink-100 font-bold text-pink-600"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            removeItem(
                              item.id,
                              item.size,
                              item.color
                            )
                          }
                          className="text-sm font-semibold text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-5">
                <div className="mb-4 flex justify-between text-xl font-black">
                  <span>Total</span>
                  <span className="text-pink-600">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  onClick={startCheckout}
                  className="w-full rounded-xl bg-pink-600 py-4 font-bold text-white hover:bg-pink-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT */}
      {checkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Delivery Details
                </h2>

                <p className="mt-1 text-slate-500">
                  Total: ₹{cartTotal.toLocaleString("en-IN")}
                </p>
              </div>

              <button
                onClick={() => setCheckout(false)}
                className="rounded-full bg-slate-100 px-4 py-2"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-pink-500"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile Number"
                inputMode="numeric"
                className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-pink-500"
              />

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Complete Delivery Address"
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-pink-500"
              />

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-pink-500"
              />

              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
                inputMode="numeric"
                maxLength={6}
                className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-pink-500"
              />

              <button
                onClick={placeOrder}
                className="w-full rounded-xl bg-pink-600 py-4 font-bold text-white hover:bg-pink-700"
              >
                Place Order
              </button>

              <p className="text-center text-xs text-slate-500">
                Your order details will be submitted securely.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ORDER SUCCESS */}
      {orderPlaced && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center">
            <div className="text-6xl">✅</div>

            <h2 className="mt-5 text-3xl font-black">
              Order Placed!
            </h2>

            <p className="mt-3 text-slate-600">
              Thank you for shopping with Sindhu Shopping.
              Your order has been received successfully.
            </p>

            <button
              onClick={() => {
                setOrderPlaced(false);
                setName("");
                setPhone("");
                setAddress("");
                setCity("");
                setPincode("");
              }}
              className="mt-7 w-full rounded-xl bg-pink-600 py-4 font-bold text-white"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-black text-pink-400">
            Sindhu Shopping
          </h2>

          <p className="mt-2 text-slate-400">
            Women&apos;s Fashion • Style • Comfort
          </p>

          <p className="mt-6 text-sm text-slate-500">
            © {new Date().getFullYear()} Sindhu Shopping. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
