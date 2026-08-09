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
  const [cartOpen, setCartOpen] = useState(false);
  const [paying, setPaying] = useState(false);

  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /*
   * ---------------------------------------------------------
   * LOAD PRODUCTS
   * ---------------------------------------------------------
   */

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);

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

    loadProducts();
  }, []);

  /*
   * ---------------------------------------------------------
   * CATEGORIES
   * ---------------------------------------------------------
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
   * ---------------------------------------------------------
   * FILTER PRODUCTS
   * ---------------------------------------------------------
   */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.category
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  /*
   * ---------------------------------------------------------
   * CART FUNCTIONS
   * ---------------------------------------------------------
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

  function removeFromCart(id: number) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

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
   * ---------------------------------------------------------
   * CART TOTALS
   * ---------------------------------------------------------
   */

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  /*
   * ---------------------------------------------------------
   * LOAD RAZORPAY
   * ---------------------------------------------------------
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
   * ---------------------------------------------------------
   * START PAYMENT
   * ---------------------------------------------------------
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
        setMessage(
          "Unable to load payment system. Please try again."
        );

        setPaying(false);
        return;
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
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.error ||
            "Payment order could not be created"
        );
      }

      const order = await response.json();

      if (!order.id) {
        throw new Error(
          "Razorpay order ID is missing"
        );
      }

      /*
       * Razorpay public key
       *
       * Your API can return keyId.
       * Otherwise this uses NEXT_PUBLIC_RAZORPAY_KEY_ID.
       */

      const razorpayKey =
        order.keyId ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error(
          "Razorpay public key is not configured"
        );
      }

      /*
       * Razorpay checkout
       */

      const options = {
        key: razorpayKey,

        amount: order.amount,

        currency: order.currency || "INR",

        name: "Bee Girl Shopping",

        description: "Women's Clothing",

        order_id: order.id,

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        notes: {
          store: "Bee Girl Shopping",
        },

        theme: {
          color: "#111827",
        },

        handler: async function (
          paymentResponse: any
        ) {
          try {
            setMessage(
              "Verifying payment..."
            );

            /*
             * Verify payment on server
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
                  "Payment verification failed"
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
          } catch (error) {
            console.error(error);

            setMessage(
              error instanceof Error
                ? error.message
                : "Payment verification failed. Please contact support."
            );
          } finally {
            setPaying(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPaying(false);
            setMessage(
              "Payment cancelled."
            );
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      /*
       * Payment failed event
       */

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
   * ---------------------------------------------------------
   * FORMAT PRICE
   * ---------------------------------------------------------
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
   * ---------------------------------------------------------
   * PAGE
   * ---------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">

        <div className="mx-auto max-w-7xl px-4">

          <div className="flex min-h-[68px] items-center justify-between gap-3">

            {/* LOGO */}

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-lg text-white">
                  🐝
                </div>

                <div className="min-w-0">

                  <h1 className="truncate text-base font-bold sm:text-lg">
                    Bee Girl Shopping
                  </h1>

                  <p className="text-[11px] text-gray-500 sm:text-xs">
                    Women&apos;s Clothing
                  </p>

                </div>

              </div>

            </div>

            {/* CART BUTTON */}

            <button
              type="button"
              onClick={() =>
                setCartOpen(true)
              }
              className="relative flex shrink-0 items-center gap-1.5 rounded-full bg-black px-3.5 py-2.5 text-sm font-semibold text-white transition active:scale-95"
            >

              <span>🛒</span>

              <span className="hidden sm:inline">
                Cart
              </span>

              {cartCount > 0 && (
                <span className="rounded-full bg-white px-1.5 text-xs font-bold text-black">
                  {cartCount}
                </span>
              )}

            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          SEARCH + CATEGORY AREA
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 pt-4">

        {/* SEARCH */}

        <div className="flex items-center rounded-xl border bg-white px-3 shadow-sm">

          <span className="mr-2 text-lg">
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search women's clothing..."
            className="w-full bg-transparent py-3 text-sm outline-none"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="rounded-full px-2 text-gray-500"
            >
              ✕
            </button>
          )}

        </div>

        {/* CATEGORY FILTER */}

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition ${
                selectedCategory === category
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}

        </div>

      </section>

      {/* =====================================================
          MESSAGE
      ====================================================== */}

      {message && (
        <div className="fixed bottom-5 left-1/2 z-[70] w-[calc(100%-32px)] max-w-md -translate-x-1/2">

          <div className="rounded-xl bg-black px-4 py-3 text-center text-sm font-medium text-white shadow-2xl">

            {message}

          </div>

        </div>
      )}

      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-6">

        {/* SECTION TITLE */}

        <div className="mb-5">

          <div className="flex items-end justify-between gap-3">

            <div>

              <h2 className="text-xl font-bold sm:text-2xl">
                Women&apos;s Kurtis
              </h2>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Beautiful styles for everyday and festive wear.
              </p>

            </div>

            {!loading && (
              <span className="text-xs text-gray-500">
                {filteredProducts.length} items
              </span>
            )}

          </div>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-xl border bg-white"
                >

                  <div className="aspect-[3/4] animate-pulse bg-gray-200" />

                  <div className="space-y-2 p-3">

                    <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />

                    <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />

                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                    <div className="h-10 animate-pulse rounded-lg bg-gray-200" />

                  </div>

                </div>
              )
            )}

          </div>
        )}

        {/* NO PRODUCTS */}

        {!loading &&
          filteredProducts.length === 0 && (
            <div className="rounded-2xl border bg-white px-5 py-16 text-center">

              <div className="text-4xl">
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
                className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white"
              >
                View All Products
              </button>

            </div>
          )}

        {/* PRODUCT GRID */}

        {!loading &&
          filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">

              {filteredProducts.map(
                (product) => {

                  const cartItem =
                    cart.find(
                      (item) =>
                        item.id === product.id
                    );

                  return (
                    <article
                      key={product.id}
                      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >

                      {/* PRODUCT IMAGE */}

                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">

                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        {/* OUT OF STOCK */}

                        {(!product.active ||
                          product.stock <= 0) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/45">

                            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-black">
                              Out of Stock
                            </span>

                          </div>
                        )}

                        {/* CART QUANTITY */}

                        {cartItem &&
                          cartItem.quantity > 0 && (
                            <div className="absolute right-2 top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-black px-2 text-xs font-bold text-white shadow">
                              {cartItem.quantity}
                            </div>
                          )}

                      </div>

                      {/* PRODUCT DETAILS */}

                      <div className="p-3">

                        <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
                          {product.category}
                        </p>

                        <h3 className="line-clamp-2 min-h-[36px] text-sm font-semibold leading-5">
             
