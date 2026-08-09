"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  active: boolean;
};

type CartItem = Product & {
  quantity: number;
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const [cartOpen, setCartOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /*
   * ----------------------------------------------------
   * LOAD PRODUCTS
   * ----------------------------------------------------
   */

  async function loadProducts() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Unable to load products");
      }

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load products. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  /*
   * ----------------------------------------------------
   * CATEGORIES
   * ----------------------------------------------------
   */

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    );

    return ["All", ...uniqueCategories];
  }, [products]);

  /*
   * ----------------------------------------------------
   * FILTER PRODUCTS
   * ----------------------------------------------------
   */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return (
        product.active &&
        matchesSearch &&
        matchesCategory
      );
    });
  }, [products, search, selectedCategory]);

  /*
   * ----------------------------------------------------
   * ADD TO CART
   * ----------------------------------------------------
   */

  function addToCart(product: Product) {
    if (!product.active || product.stock <= 0) {
      return;
    }

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  product.stock
                ),
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setMessage(`${product.name} added to cart.`);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  /*
   * ----------------------------------------------------
   * REMOVE FROM CART
   * ----------------------------------------------------
   */

  function removeFromCart(id: number) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

  /*
   * ----------------------------------------------------
   * INCREASE QUANTITY
   * ----------------------------------------------------
   */

  function increaseQuantity(id: number) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + 1,
                item.stock
              ),
            }
          : item
      )
    );
  }

  /*
   * ----------------------------------------------------
   * DECREASE QUANTITY
   * ----------------------------------------------------
   */

  function decreaseQuantity(id: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  /*
   * ----------------------------------------------------
   * CART TOTAL
   * ----------------------------------------------------
   */

  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  }, [cart]);

  /*
   * ----------------------------------------------------
   * LOAD RAZORPAY SCRIPT
   * ----------------------------------------------------
   */

  function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }

  /*
   * ----------------------------------------------------
   * START PAYMENT
   * ----------------------------------------------------
   */

  async function startPayment() {
    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setPaying(true);
    setMessage("");

    try {
      /*
       * Load Razorpay
       */

      const loaded = await loadRazorpayScript();

      if (!loaded) {
        throw new Error(
          "Unable to load payment system."
        );
      }

      /*
       * Create Razorpay order
       */

      const response = await fetch(
        "/api/razorpay/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: cartTotal,

            items: cart.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          }),
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json().catch(() => null);

        throw new Error(
          errorData?.error ||
            "Payment order could not be created."
        );
      }

      const order = await response.json();

      if (!order.id) {
        throw new Error(
          "Razorpay order ID is missing."
        );
      }

      /*
       * Razorpay public key
       */

      const razorpayKey =
        order.keyId ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error(
          "Razorpay public key is not configured."
        );
      }

      /*
       * Razorpay checkout options
       */

      const options = {
        key: razorpayKey,

        amount: order.amount,

        currency: order.currency || "INR",

        name: "Bee Girl Shopping",

        description: "Women's Clothing",

        order_id: order.id,

        theme: {
          color: "#111827",
        },

        handler: async function (
          paymentResponse: any
        ) {
          try {
            setMessage(
              "Payment received. Verifying..."
            );

            /*
             * Verify payment
             */

            const verifyResponse = await fetch(
              "/api/razorpay/verify",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }),
              }
            );

            const verifyData =
              await verifyResponse
                .json()
                .catch(() => null);

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData?.error ||
                  "Payment verification failed."
              );
            }

            /*
             * Payment successful
             */

            setMessage(
              "Payment successful! Thank you for your order."
            );

            setCart([]);
            setCartOpen(false);

            /*
             * Refresh stock/products
             */

            await loadProducts();
          } catch (error) {
            console.error(error);

            setMessage(
              error instanceof Error
                ? error.message
                : "Payment verification failed."
            );
          } finally {
            setPaying(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPaying(false);
            setMessage("Payment cancelled.");
          },
        },

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        notes: {
          store: "Bee Girl Shopping",
        },
      };

      /*
       * Open Razorpay
       */

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response: any) {
          console.error(
            "Payment failed:",
            response?.error
          );

          setMessage(
            response?.error?.description ||
              "Payment failed. Please try again."
          );

          setPaying(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to start payment."
      );

      setPaying(false);
    }
  }

  /*
   * ----------------------------------------------------
   * FORMAT PRICE
   * ----------------------------------------------------
   */

  function formatPrice(price: number) {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(price);
  }

  /*
   * ----------------------------------------------------
   * PAGE
   * ----------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">

        <div className="mx-auto max-w-7xl px-4 py-3">

          <div className="flex items-center justify-between gap-3">

            {/* LOGO */}

            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                Bee Girl
              </h1>

              <p className="text-xs font-medium text-gray-500">
                Women's Fashion
              </p>
            </div>

            {/* CART BUTTON */}

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-xl text-white shadow-sm transition active:scale-95"
              aria-label="Open cart"
            >
              🛒

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

          {/* SEARCH */}

          <div className="relative mt-3">

            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search women's clothing..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-100 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
            />

          </div>

          {/* CATEGORY SCROLL */}

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === category
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

        </div>
      </header>

      {/* =================================================
          MESSAGE
      ================================================= */}

      {message && (
        <div className="fixed left-4 right-4 top-24 z-[60] mx-auto max-w-md">
          <div className="rounded-2xl bg-gray-900 px-4 py-3 text-center text-sm font-medium text-white shadow-xl">
            {message}
          </div>
        </div>
      )}

      {/* =================================================
          HERO
      ================================================= */}

      <section className="mx-auto max-w-7xl px-4 pt-5">

        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-pink-100 via-white to-orange-100 p-6 sm:p-10">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
            New Collection
          </p>

          <h2 className="mt-2 max-w-xl text-3xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Beautiful styles for every occasion.
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-gray-600 sm:text-base">
            Discover elegant women's clothing,
            kurtis and traditional styles designed
            for everyday comfort and festive wear.
          </p>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            className="mt-5 rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition active:scale-95"
          >
            Shop Now →
          </button>

        </div>

      </section>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      <section
        id="products"
        className="mx-auto max-w-7xl px-4 py-8"
      >

        <div className="mb-5 flex items-end justify-between gap-3">

          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Women's Collection
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </p>
          </div>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <div className="aspect-[3/4] bg-gray-200" />

                  <div className="space-y-2 p-3">
                    <div className="h-3 w-16 rounded bg-gray-200" />
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-4 w-20 rounded bg-gray-200" />
                  </div>
                </div>
              )
            )}

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          filteredProducts.length === 0 && (
            <div className="rounded-3xl bg-white px-5 py-16 text-center shadow-sm">

              <div className="text-5xl">
                🛍️
              </div>

              <h3 className="mt-4 text-lg font-bold">
                No products found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Try another search or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mt-5 rounded-full bg-gray-900 px-5 py-3 text-sm font-bold text-white"
              >
                View All Products
              </button>

            </div>
          )}

        {/* PRODUCT GRID */}

        {!loading &&
          filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">

              {filteredProducts.map(
                (product) => (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >

                    {/* IMAGE */}

                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">

                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {/* CATEGORY */}

                      <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-gray-700 shadow-sm backdrop-blur">
                        {product.category}
                      </span>

                      {/* STOCK */}

                      {product.stock <= 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                          <span className="rounded-full bg-white px-3 py-2 text-xs font-bold">
                            Out of Stock
                          </span>
                        </div>
                      )}

                    </div>

                    {/* DETAILS */}

                    <div className="p-3">

                      <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-5 text-gray-900">
                        {product.name}
             
