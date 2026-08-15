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

const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

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
    description: "Elegant traditional silk saree with a rich festive look.",
    sizes: ["Free Size"],
    colors: ["Red", "Purple", "Green", "Maroon"],
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Soft Cotton Daily Wear Saree",
    price: 999,
    category: "Sarees",
    description: "Lightweight cotton saree for comfortable everyday wear.",
    sizes: ["Free Size"],
    colors: ["Blue", "Pink", "Green", "Yellow"],
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Designer Party Wear Saree",
    price: 1899,
    category: "Sarees",
    description: "Stylish saree designed for parties and celebrations.",
    sizes: ["Free Size"],
    colors: ["Black", "Wine", "Navy Blue", "Pink"],
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "Comfort Cotton Night Suit",
    price: 699,
    category: "Night Wear",
    description: "Soft and comfortable night suit for a relaxed sleep.",
    sizes: defaultSizes,
    colors: ["Pink", "Blue", "Lavender", "Grey"],
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 9,
    name: "Floral Night Dress",
    price: 599,
    category: "Night Wear",
    description: "Soft floral night dress with an easy comfortable fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Blue", "Purple", "White"],
    image:
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 10,
    name: "Women's Casual Shirt",
    price: 749,
    category: "Casual Wear",
    description: "Smart casual shirt for daily outings and weekends.",
    sizes: defaultSizes,
    colors: ["White", "Black", "Blue", "Green"],
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 11,
    name: "Relaxed Casual Top",
    price: 649,
    category: "Casual Wear",
    description: "Easy everyday top with a modern relaxed style.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "White", "Black", "Yellow"],
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 12,
    name: "Elegant Floral Maxi Dress",
    price: 1399,
    category: "Dresses",
    description:
      "Flowy floral maxi dress for casual and semi-formal occasions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Blue", "Green", "Black"],
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 13,
    name: "Classic Midi Dress",
    price: 1299,
    category: "Dresses",
    description: "Modern midi dress with a clean, elegant silhouette.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Red", "Blue", "White"],
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 14,
    name: "Premium Women's Top",
    price: 699,
    category: "Tops",
    description: "Stylish top for everyday fashion and casual occasions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Black", "White", "Green"],
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 15,
    name: "Comfort Palazzo Pants",
    price: 799,
    category: "Palazzo",
    description: "Wide-leg palazzo pants designed for comfort and style.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Cream", "Navy Blue", "Maroon"],
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 16,
    name: "Festive Salwar Suit Set",
    price: 1699,
    category: "Salwar Suits",
    description:
      "Elegant salwar suit set for festivals and family occasions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Green", "Blue", "Maroon"],
    image:
      "https://images.unsplash.com/photo-1583391733981-849840f6f3d5?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 17,
    name: "Classic Embroidered Ethnic Set",
    price: 1799,
    category: "Ethnic Wear",
    description:
      "Graceful ethnic outfit with an elegant embroidered finish.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Cream", "Pink", "Green", "Royal Blue"],
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 18,
    name: "Glamour Party Wear Dress",
    price: 1999,
    category: "Party Wear",
    description:
      "Statement party dress for celebrations and evening events.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Red", "Wine", "Navy Blue"],
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85",
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
  const [productOpen, setProductOpen] = useState<Product | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("");

  const [message, setMessage] = useState("");

  const [checkout, setCheckout] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(
    "Sai Nagar, 7th Cross, Anantapur"
  );
  const [city, setCity] = useState("Anantapur");
  const [pincode, setPincode] = useState("");

  const [wishlist, setWishlist] = useState<number[]>([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  /*
   * WhatsApp support.
   * This opens WhatsApp with a ready-made message.
   * When you have your shop WhatsApp number, you can change the
   * support URL to:
   * https://wa.me/91XXXXXXXXXX
   */
  const whatsappSupport =
    "https://wa.me/?text=" +
    encodeURIComponent(
      "Hello Bee Girl Shopping, I need support regarding my order."
    );

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("bee-girl-shopping-cart");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      const savedWishlist = localStorage.getItem(
        "bee-girl-shopping-wishlist"
      );

      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch {
      setCart([]);
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "bee-girl-shopping-cart",
        JSON.stringify(cart)
      );
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "bee-girl-shopping-wishlist",
        JSON.stringify(wishlist)
      );
    } catch {}
  }, [wishlist]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function showMessage(text: string) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2200);
  }

  function openProduct(product: Product) {
    setProductOpen(product);

    setSelectedSize(
      product.sizes.includes("M")
        ? "M"
        : product.sizes[0]
    );

    setSelectedColor(product.colors[0]);
  }

  function toggleWishlist(productId: number) {
    setWishlist((current) => {
      if (current.includes(productId)) {
        showMessage("Removed from Wishlist ❤️");
        return current.filter((id) => id !== productId);
      }

      showMessage("Added to Wishlist ❤️");
      return [...current, productId];
    });
  }

  function addToCart(
    product: Product,
    size: string,
    color: string
  ) {
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

    showMessage(`${product.name} added to cart`);

    setProductOpen(null);
    setCartOpen(true);
  }

  function updateQuantity(
    index: number,
    change: number
  ) {
    setCart((current) =>
      current
        .map((item, i) =>
          i === index
            ? {
                ...item,
                quantity: Math.max(
                  0,
                  item.quantity + change
                ),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function submitOrder(e: React.FormEvent) {
    e.preventDefault();

    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !pincode.trim()
    ) {
      showMessage("Please fill all delivery details");
      return;
    }

    if (cart.length === 0) {
      showMessage("Your cart is empty");
      return;
    }

    const orderText = cart
      .map(
        (item) =>
          `${item.name} | Size: ${item.size} | Colour: ${item.color} | Qty: ${item.quantity}`
      )
      .join("\n");

    const whatsappText =
      `Hello Bee Girl Shopping,\n\n` +
      `I want to place an order:\n\n` +
      `${orderText}\n\n` +
      `Total: ₹${totalPrice.toLocaleString("en-IN")}\n\n` +
      `Customer: ${name}\n` +
      `Phone: ${phone}\n` +
      `Address: ${address}, ${city} - ${pincode}`;

    const url =
      `https://wa.me/?text=` +
      encodeURIComponent(whatsappText);

    window.open(url, "_blank");

    showMessage(
      "Order details prepared for WhatsApp"
    );
  }

  return (
    <main
      className="min-h-screen text-slate-900"
      style={{
        fontFamily:
          "Trebuchet MS, Arial, sans-serif",
        background:
          "linear-gradient(180deg,#fff7fc 0%,#fdf4ff 45%,#ffffff 100%)",
      }}
    >
      {/* TOP ANNOUNCEMENT */}
      <div className="bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-600 px-4 py-2 text-center text-xs font-bold text-white sm:text-sm">
        ✨ Welcome to Bee Girl Shopping ✨
        <span className="mx-2">•</span>
        Fashion • Style • Comfort
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-fuchsia-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:px-4">
          <button
            type="button"
            onClick={() => {
              setCategory("All");
              setSearch("");
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="min-w-fit text-left"
          >
            <div className="text-xl font-black tracking-tight text-fuchsia-600 sm:text-2xl">
              Bee Girl Shopping
            </div>

            <div className="text-[10px] font-semibold text-gray-500 sm:text-xs">
              Women&apos;s Fashion
            </div>
          </button>

          <div className="hidden flex-1 md:block">
            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search sarees, kurtis, dresses..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-sm outline-none transition focus:border-fuchsia-400 focus:bg-white"
            />
          </div>

          {/* WISHLIST */}
          <button
            type="button"
            onClick={() =>
              setWishlistOpen(true)
            }
            className="relative rounded-full border border-fuchsia-200 bg-white px-3 py-2 text-lg shadow-sm transition hover:bg-fuchsia-50 sm:px-4"
          >
            ❤️

            {wishlist.length > 0 && (
              <span className="absolute -right-1 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* CART */}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:scale-105 sm:px-5"
          >
            🛒 Cart{" "}
            {totalItems > 0
              ? `(${totalItems})`
              : ""}
          </button>
        </div>

        {/* MOBILE SEARCH */}
        <div className="px-3 pb-3 md:hidden">
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search products..."
            className="w-full rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-sm outline-none focus:border-fuchsia-400"
          />
        </div>

        {/* CATEGORIES */}
        <div className="overflow-x-auto border-t border-gray-100 bg-white">
          <div className="mx-auto flex max-w-7xl gap-2 px-3 py-3">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() =>
                  setCategory(item)
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                  category === item
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow"
                    : "bg-fuchsia-50 text-gray-700 hover:bg-fuchsia-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MESSAGE */}
      {message && (
        <div className="fixed left-1/2 top-28 z-[100] w-[90%] max-w-md -translate-x-1/2 rounded-2xl bg-slate-900 px-5 py-3 text-center text-sm font-bold text-white shadow-2xl">
          {message}
        </div>
      )}

      {/* LOCATION BAR */}
      <section className="border-b border-fuchsia-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-3 text-center text-xs font-semibold text-gray-700 sm:text-sm">
          <span className="text-lg">📍</span>
          <span>
            Sai Nagar, 7th Cross, Anantapur
          </span>
          <span className="hidden text-fuchsia-500 sm:inline">
            •
          </span>
          <span className="text-fuchsia-600">
            Fast &amp; Friendly Shopping
          </span>
        </div>
      </section>

      {/* HERO */}
      <section className="bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <div className="mb-3 font-black uppercase tracking-[0.2em] text-fuchsia-600">
              New Collection
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
              Beautiful Fashion
              <br />
              Made For You
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
              Discover stylish women&apos;s kurtis,
              sarees, dresses, night wear, casual
              wear and party outfits at affordable
              prices.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setCategory("All");

                  document
                    .getElementById("collection")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3.5 font-black text-white shadow-lg transition hover:scale-105"
              >
                Shop Now →
              </button>

              <a
                href={whatsappSupport}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border-2 border-green-500 bg-white px-6 py-3 font-black text-green-600 shadow-sm transition hover:bg-green-50"
              >
            
