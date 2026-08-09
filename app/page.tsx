"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  sizes: string[];
  colors: string[];
  image: string;
};

type CartItem = Product & {
  size: string;
  color: string;
  quantity: number;
};

const categories = [
  "All",
  "Kurtis",
  "Sarees",
  "Night Wear",
  "Casual Wear",
  "Dresses",
  "Tops",
  "Palazzo",
  "Salwar Suits",
  "Ethnic Wear",
  "Party Wear",
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const products: Product[] = [
  {
    id: 1,
    name: "Elegant Cotton Kurti",
    price: 799,
    category: "Kurtis",
    description: "Comfortable cotton kurti for everyday wear.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Pink", "Black", "Red"],
    image: "/products/kurti-1.jpg",
  },
  {
    id: 2,
    name: "Designer Anarkali Kurti",
    price: 1199,
    category: "Kurtis",
    description: "Beautiful Anarkali kurti for festive occasions.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Pink", "Blue", "Green", "Maroon"],
    image: "/products/kurti-2.jpg",
  },
  {
    id: 3,
    name: "Printed Women's Kurti",
    price: 899,
    category: "Kurtis",
    description: "Trendy printed kurti with a comfortable fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Yellow", "Blue", "Pink", "White"],
    image: "/products/kurti-3.jpg",
  },
  {
    id: 4,
    name: "Premium Embroidered Kurti",
    price: 1499,
    category: "Kurtis",
    description: "Premium embroidered kurti for special occasions.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Wine", "Royal Blue", "Cream"],
    image: "/products/kurti-4.jpg",
  },

  {
    id: 5,
    name: "Royal Banarasi Silk Saree",
    price: 2499,
    category: "Sarees",
    description: "Traditional Banarasi style saree for weddings and festivals.",
    sizes: ["Free Size"],
    colors: ["Red", "Purple", "Green", "Maroon"],
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Soft Cotton Daily Wear Saree",
    price: 999,
    category: "Sarees",
    description: "Lightweight cotton saree for comfortable daily wear.",
    sizes: ["Free Size"],
    colors: ["Blue", "Pink", "Green", "Yellow"],
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    name: "Designer Party Wear Saree",
    price: 1899,
    category: "Sarees",
    description: "Elegant saree for parties and special occasions.",
    sizes: ["Free Size"],
    colors: ["Black", "Wine", "Navy Blue", "Pink"],
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 8,
    name: "Comfort Cotton Night Suit",
    price: 699,
    category: "Night Wear",
    description: "Soft cotton night suit for comfortable sleeping.",
    sizes,
    colors: ["Pink", "Blue", "Lavender", "Grey"],
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    name: "Floral Night Dress",
    price: 599,
    category: "Night Wear",
    description: "Soft floral night dress with a relaxed fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Blue", "Purple", "White"],
    image:
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 10,
    name: "Women's Casual Shirt",
    price: 749,
    category: "Casual Wear",
    description: "Smart casual shirt for everyday outings.",
    sizes,
    colors: ["White", "Black", "Blue", "Green"],
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 11,
    name: "Relaxed Casual Top",
    price: 649,
    category: "Casual Wear",
    description: "Comfortable modern top for everyday fashion.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "White", "Black", "Yellow"],
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 12,
    name: "Elegant Floral Maxi Dress",
    price: 1399,
    category: "Dresses",
    description: "Flowy floral maxi dress for casual occasions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Blue", "Green", "Black"],
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 13,
    name: "Classic Midi Dress",
    price: 1299,
    category: "Dresses",
    description: "Elegant modern midi dress.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Red", "Blue", "White"],
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 14,
    name: "Premium Women's Top",
    price: 699,
    category: "Tops",
    description: "Stylish women's top for everyday wear.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Black", "White", "Green"],
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 15,
    name: "Comfort Palazzo Pants",
    price: 799,
    category: "Palazzo",
    description: "Wide-leg palazzo pants with a comfortable fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Cream", "Navy Blue", "Maroon"],
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 16,
    name: "Festive Salwar Suit Set",
    price: 1699,
    category: "Salwar Suits",
    description: "Beautiful salwar suit set for festivals and functions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Green", "Blue", "Maroon"],
    image:
      "https://images.unsplash.com/photo-1583391733981-849840f6f3d5?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 17,
    name: "Classic Embroidered Ethnic Set",
    price: 1799,
    category: "Ethnic Wear",
    description: "Graceful embroidered ethnic outfit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Cream", "Pink", "Green", "Royal Blue"],
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 18,
    name: "Glamour Party Wear Dress",
    price: 1999,
    category: "Party Wear",
    description: "Stylish party dress for celebrations and events.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Red", "Wine", "Navy Blue"],
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
  },
];

const colorClass: Record<string, string> = {
  Black: "bg-black",
  White: "bg-white",
  Red: "bg-red-500",
  Blue: "bg-blue-600",
  "Royal Blue": "bg-blue-800",
  Pink: "bg-pink-400",
  Green: "bg-green-600",
  Yellow: "bg-yellow-400",
  Purple: "bg-purple-500",
  Lavender: "bg-purple-300",
  Maroon: "bg-red-900",
  Wine: "bg-rose-900",
  "Navy Blue": "bg-slate-900",
  Cream: "bg-amber-100",
  Grey: "bg-gray-500",
};

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("");
  const [checkout, setCheckout] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("bee-girl-shopping-cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "bee-girl-shopping-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();

    return products.filter((item) => {
      const categoryMatch =
        category === "All" || item.category === category;

      const searchMatch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return categoryMatch && searchMatch;
    });
  }, [search, category]);

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function openProduct(item: Product) {
    setProduct(item);
    setSelectedSize(
      item.sizes.includes("M") ? "M" : item.sizes[0]
    );
    setSelectedColor(item.colors[0]);
  }

  function addToCart(
    item: Product,
    size: string,
    color: string
  ) {
    setCart((old) => {
      const found = old.find(
        (x) =>
          x.id === item.id &&
          x.size === size &&
          x.color === color
      );

      if (found) {
        return old.map((x) =>
          x.id === item.id &&
          x.size === size &&
          x.color === color
            ? { ...x, quantity: x.quantity + 1 }
            : x
        );
      }

      return [
        ...old,
        {
          ...item,
          size,
          color,
          quantity: 1,
        },
      ];
    });

    setProduct(null);
    setCartOpen(true);
  }

  function changeQuantity(index: number, amount: number) {
    setCart((old) =>
      old
        .map((item, i) =>
          i === index
            ? {
                ...item,
                quantity: item.quantity + amount,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(index: number) {
    setCart((old) => old.filter((_, i) => i !== index));
  }

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !phone || !address || !city || !pincode) {
      alert("Please fill all delivery details.");
      return;
    }

    let message =
      `*Bee Girl Shopping Order*%0A%0A`;

    cart.forEach((item, index) => {
      message +=
        `${index + 1}. ${item.name}%0A` +
        `Size: ${item.size}%0A` +
        `Colour: ${item.color}%0A` +
        `Qty: ${item.quantity}%0A` +
        `Price: ₹${item.price}%0A%0A`;
    });

    message +=
      `*Total: ₹${totalPrice}*%0A%0A` +
      `*Customer Details*%0A` +
      `Name: ${name}%0A` +
      `Phone: ${phone}%0A` +
      `Address: ${address}%0A` +
      `City: ${city}%0A` +
      `Pincode: ${pincode}`;

    /*
      IMPORTANT:
      Replace 919999999999 with your real WhatsApp number.
      Example:
      India number 9876543210
      becomes 919876543210
    */

    const whatsappNumber = "919999999999";

    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
      "_blank"
    );
  }

  return (
    <main className="min-h-screen bg-pink-50 text-gray-900">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">

          <div className="min-w-fit">
            <div className="text-xl font-black text-pink-600">
              Bee Girl Shopping
            </div>
            <div className="text-xs text-gray-500">
              Women's Fashion
            </div>
          </div>

          <div className="flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sarees, kurtis, dresses..."
              className="w-full rounded-full border px-5 py-3 outline-none focus:border-pink-500"
            />
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="rounded-full bg-pink-600 px-5 py-3 font-bold text-white"
          >
            🛒 Cart ({totalItems})
          </button>

        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-r from-pink-100 via-white to-purple-100">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-2 md:items-center">

          <div>
            <div className="font-bold uppercase tracking-widest text-pink-600">
              New Collection
            </div>

            <h1 className="mt-3 text-4xl font-black md:text-6xl">
              Beautiful Fashion
              <br />
              Made For You
            </h1>

            <p className="mt-5 max-w-xl text-lg text-gray-600">
              Discover stylish women's clothing at affordable
              prices. Kurtis, sarees, dresses, night wear,
              casual wear and more.
            </p>

            <button
              onClick={() => {
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-7 rounded-full bg-pink-600 px-7 py-4 font-bold text-white"
            >
              Shop Now →
            </button>
          </div>

          <div className="flex min-h-[300px] items-center justify-center rounded-3xl bg-pink-200 p-8">
            <div className="text-center">
              <div className="text-8xl">👗</div>
              <div className="mt-5 text-3xl font-black text-pink-700">
                Bee Girl Shopping
              </div>
              <div className="mt-2 text-gray-600">
                Fashion • Style • Comfort
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-8">

        <div className="mb-5 text-center">
          <div className="font-bold uppercase tracking-widest text-pink-600">
            Shop By Category
          </div>
          <h2 className="mt-2 text-3xl font-black">
            Women's Fashion
          </h2>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-5 py-3 font-bold ${
                category === item
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-700 shadow-sm"
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
        className="mx-auto max-w-7xl px-4 pb-14"
      >

        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="font-bold uppercase tracking-widest text-pink-600">
              Our Collection
            </div>
            <h2 className="text-3xl font-black">
              {category === "All"
                ? "All Women's Clothing"
                : category}
            </h2>
          </div>

          <div className="text-sm text-gray-500">
            {filteredProducts.length} products
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >

              <button
                onClick={() => openProduct(item)}
                className="block w-full"
              >
                <div className="aspect-[4/5] overflow-hidden bg-pink-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>
              </button>

              <div className="p-4">

                <div className="text-xs font-bold text-pink-600">
                  {item.category}
                </div>

                <h3 className="mt-1 min-h-[48px] font-black">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {item.description}
                </p>

                <div className="mt-3 text-xl font-black text-pink-600">
                  ₹{item.price.toLocaleString("en-IN")}
                </div>

                <button
                  onClick={() => openProduct(item)}
                  className="mt-4 w-full rounded-xl bg-pink-600 py-3 font-bold text-white"
                >
                  Select Size & Colour
                </button>

              </div>
            </div>
          ))}

        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center">
            <div className="text-5xl">🔎</div>
            <h3 className="mt-4 text-xl font-bold">
              No products found
            </h3>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-4 rounded-xl bg-pink-600 px-6 py-3 font-bold text-white"
            >
              Show All Products
            </button>
          </div>
        )}

      </section>

      {/* PRODUCT MODAL */}
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white">

            <div className="grid md:grid-cols-2">

              <div className="bg-pink-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full min-h-[400px] w-full object-cover"
                />
              </div>

              <div className="p-6">

                <button
                  onClick={() => setProduct(null)}
                  className="float-right rounded-full bg-gray-100 px-3 py-2"
                >
                  ✕
                </button>

                <div className="text-sm font-bold text-pink-600">
                  {product.category}
                </div>

                <h2 className="mt-2 text-3xl font-black">
                  {product.name}
                </h2>

                <div className="mt-3 text-2xl font-black text-pink-600">
                  ₹{product.price.toLocaleString("en-IN")}
                </div>

                <p className="mt-4 text-gray-600">
                  {product.description}
                </p>

                {/* SIZE */}
                <div className="mt-7">
                  <div className="mb-3 font-black">
                    Select Size
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-lg border px-4 py-2 font-bold ${
                          selectedSize === size
                            ? "border-pink-600 bg-pink-600 text-white"
                            : "bg-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* COLOUR */}
                <div className="mt-7">
                  <div className="mb-3 font-black">
                    Select Colour: {selectedColor}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-2 rounded-full border px-3 py-2 font-semibold ${
                          selectedColor === color
                            ? "border-pink-600 ring-2 ring-pink-200"
                            : ""
                        }`}
                      >
                        <span
                          className={`h-5 w-5 rounded-full border ${colorClass[color] || "bg-gray-300"}`}
                        />
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    addToCart(
                      product,
                      selectedSize,
                      selectedColor
                    )
                  }
                  className="mt-8 w-full rounded-xl bg-pink-600 py-4 font-black text-white"
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
        <div className="fixed inset-0 z-50 bg-black/50">

          <div className="ml-auto flex h-full w-full max-w-lg flex-col bg-white">

            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-2xl font-black">
                  Your Cart
                </h2>
                <p className="text-sm text-gray-500">
                  {totalItems} item(s)
                </p>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full bg-gray-100 px-3 py-2"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">

              {cart.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="text-6xl">🛍️</div>
                  <h3 className="mt-4 text-xl font-bold">
                    Your cart is empty
                  </h3>
                </div>
              ) : (
                <div className="space-y-4">

                  {cart.map((item, index) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="rounded-2xl border p-3"
                    >

                      <div className="flex gap-3">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-24 w-20 rounded-xl object-cover"
                        />

                        <div className="flex-1">

                          <div className="font-bold">
                            {item.name}
                          </div>

                          <div className="mt-1 text-xs text-gray-500">
                            Size: {item.size}
                          </div>

                          <div className="text-xs text-gray-500">
                            Colour: {item.color}
                          </div>

                          <div className="mt-1 font-bold text-pink-600">
                            ₹{item.price.toLocaleString("en-IN")}
                          </div>

                          <div className="mt-2 flex items-center gap-3">

                            <button
                              onClick={() =>
                                changeQuantity(index, -1)
                              }
                              className="rounded-lg bg-gray-100 px-3 py-1 font-bold"
                            >
                              −
                            </button>

                            <span className="font-bold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                changeQuantity(index, 1)
                              }
                              className="rounded-lg bg-gray-100 px-3 py-1 font-bold"
                            >
                              +
                            </button>

                            <button
                              onClick={() =>
                                removeItem(index)
                              }
                              className="ml-auto text-sm font-bold text-red-500"
                            >
                              Remove
                            </button>

                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              )}

            </div>

            {cart.length > 0 && (
              <div className="border-t p-5">

                <div className="flex justify-between text-xl font-black">
                  <span>Total</span>
                  <span>
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  onClick={() => setCheckout(true)}
                  className="mt-4 w-full rounded-xl bg-pink-600 py-4 font-black text-white"
                >
                  Continue to Checkout
                </button>

              </div>
            )}

          </div>
        </div>
      )}

      {/* CHECKOUT */}
      {checkout && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">

          <form
            onSubmit={placeOrder}
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6"
          >

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-black">
                  Delivery Details
                </h2>

                <p className="text-sm text-gray-500">
                  Total: ₹{totalPrice.toLocaleString("en-IN")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCheckout(false)}
                className="rounded-full bg-gray-100 px-3 py-2"
              >
                ✕
              </button>

            </div>

            <div className="mt-6 space-y-4">

              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500"
              />

              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile Number"
                type="tel"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500"
              />

              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full Address"
                rows={4}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500"
              />

              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500"
              />

              <input
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
                inputMode="numeric"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500"
              />

            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-green-600 py-4 font-black text-white"
            >
              📱 Place Order via WhatsApp
            </button>

          </form>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-gray-900 px-4 py-10 text-center text-white">

        <div className="text-2xl font-black text-pink-400">
          Bee Girl Shopping
        </div>

        <p className="mt-2 text-gray-400">
          Women's Fashion • Style • Comfort
        </p>

        <p className="mt-5 text-sm text-gray-500">
          © {new Date().getFullYear()} Bee Girl Shopping. All rights reserved.
        </p>

      </footer>

    </main>
  );
}
