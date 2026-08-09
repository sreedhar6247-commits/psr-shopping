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

  // --------------------------------------------------
  // LOAD PRODUCTS
  // --------------------------------------------------

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);

      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Unable to load products");
      }

      const data = await response.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load products. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // CATEGORIES
  // --------------------------------------------------

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category)
      .filter(Boolean);

    return ["All", ...Array.from(new Set(values))];
  }, [products]);

  // --------------------------------------------------
  // FILTER PRODUCTS
  // --------------------------------------------------

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  // --------------------------------------------------
  // CART
  // --------------------------------------------------

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

  // --------------------------------------------------
  // RAZORPAY SCRIPT
  // --------------------------------------------------

  function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        existingScript.addEventListener("load", () =>
          resolve(true)
        );

        existingScript.addEventListener("error", () =>
          resolve(false)
        );

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

  // --------------------------------------------------
  // START PAYMENT
  // --------------------------------------------------

  async function startPayment() {
    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setPaying(true);
    setMessage("");

    try {
      const loaded = await loadRazorpayScript();

      if (!loaded) {
        throw new Error(
          "Unable to load payment system."
        );
      }

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
        let errorMessage =
          "Payment order could not be created.";

        try {
          const errorData = await response.json();

          errorMessage =
            errorData?.error || errorMessage;
        } catch {
          // Ignore invalid error response
        }

        throw new Error(errorMessage);
      }

      const order = await response.json();

      if (!order?.id) {
        throw new Error(
          "Razorpay order ID is missing."
        );
      }

      const razorpayKey =
        order.keyId ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error(
          "Razorpay public key is not configured."
        );
      }

      const options = {
        key: razorpayKey,

        amount: order.amount,

        currency: order.currency || "INR",

        name: "Sindhu Shopping",

        description: "Women's Clothing",

        order_id: order.id,

        handler: async function (
          paymentResponse: any
        ) {
          try {
            setMessage(
              "Verifying payment..."
            );

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
              await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData?.error ||
                  "Payment verification failed."
              );
            }

            setMessage(
              "Payment successful! Your order has been placed."
            );

            setCart([]);
            setCartOpen(false);
          } catch (error) {
            console.error(error);

            setMessage(
              error instanceof Error
                ? error.message
                : "Payment was received, but verification failed."
            );
          } finally {
            setPaying(false);
          }
        },

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        notes: {
          store: "Sindhu Shopping",
        },

        theme: {
          color: "#000000",
        },

        modal: {
          ondismiss: function () {
            setPaying(false);
            setMessage("Payment cancelled.");
          },
        },
      };

      const razorpay = new window.Razorpay(
        options
      );

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
      console.error("Payment error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to start payment."
      );

      setPaying(false);
    }
  }

  // --------------------------------------------------
  // FORMAT PRICE
  // --------------------------------------------------

  function formatPrice(price: number) {
    return `₹${price.toLocaleString("en-IN")}`;
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-white text-black">
      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* LOGO */}

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Sindhu Shopping
              </h1>

              <p className="text-sm text-gray-500">
                Women's Clothing
              </p>
            </div>

            {/* SEARCH */}

            <div className="flex flex-1 sm:max-w-md">
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search women's clothing..."
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {/* CART */}

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative rounded-xl bg-black px-5 py-3 font-semibold text-white"
            >
              Cart

              {cartCount > 0 && (
                <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MESSAGE */}

      {message && (
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <div className="rounded-xl border bg-gray-50 px-4 py-3 text-sm">
            {message}
          </div>
        </div>
      )}

      {/* HERO */}

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl bg-gray-100 px-6 py-12 sm:px-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
            Sindhu Shopping
          </p>

          <h2 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
            Beautiful styles for every woman.
          </h2>

          <p className="mt-5 max-w-2xl text-base text-gray-600 sm:text-lg">
            Discover stylish women's clothing at
            affordable prices.
          </p>

          <button
            type="button"
            onClick={() => {
              const element =
                document.getElementById(
                  "products"
                );

              element?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="mt-7 rounded-xl bg-black px-6 py-3 font-semibold text-white"
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* PRODUCTS */}

      <section
        id="products"
        className="mx-auto max-w-7xl px-4 pb-20"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-black">
              Our Collection
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredProducts.length} products
            </p>
          </div>

          {/* CATEGORY FILTER */}

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="mt-4 text-gray-500">
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 py-20 text-center">
            <h3 className="text-xl font-bold">
              No products found
            </h3>

            <p className="mt-2 text-gray-500">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map(
              (product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* IMAGE */}

                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />

                    {product.stock <= 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="rounded-full bg-white px-4 py-2 text-sm font-bold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {product.category}
                    </p>

                    <h3 className="mt-2 line-clamp-2 min-h-[3rem] text-lg font-bold">
                      {product.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {product.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="text-xl font-black">
                        {formatPrice(
                          product.price
                        )}
                      </span>

                      <span className="text-xs text-gray-500">
                        {product.stock > 0
                          ? `${product.stock} left`
                          : "Sold out"}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={
                        !product.active ||
                        product.stock <= 0
                      }
                      onClick={() =>
                        addToCart(product)
                      }
                      className="mt-5 w-full rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      {!product.active ||
                      product.stock <= 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>

      {/* CART OVERLAY */}

      {cartOpen && (
        <div className="fixed inset-0 z-50">
          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/50"
          />

          {/* CART */}

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
            {/* CART HEADER */}

            <div className="flex items-center justify-between border-b px-5 py-5">
              <div>
                <h2 className="text-2xl font-black">
                  Your Cart
                </h2>

                <p className="text-sm text-gray-500">
                  {cartCount} item
                  {cartCount !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCartOpen(false)
                }
                className="rounded-full bg-gray-100 px-4 py-2 text-xl"
              >
                ×
              </button>
            </div>

            {/* CART CONTENT */}

            {cart.length === 0 ? (
              <div className="flex flex-1 items-center justify-center px-6 text-center">
                <div>
                  <div className="text-5xl">
                    🛍️
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    Your cart is empty
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Add some beautiful clothes
                    to your cart.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setCartOpen(false)
                    }
                    className="mt-5 rounded-xl bg-black px-5 py-3 font-semibold text-white"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              <>
               
