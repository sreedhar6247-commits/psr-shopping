"use client";

import { useEffect, useState } from "react";

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

  /*
   * LOAD PRODUCTS
   */
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Unable to load products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error(error);
        setMessage("Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  /*
   * LOAD CART FROM BROWSER
   */
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("bee-girl-cart");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Unable to load cart", error);
    }
  }, []);

  /*
   * SAVE CART
   */
  useEffect(() => {
    try {
      localStorage.setItem("bee-girl-cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Unable to save cart", error);
    }
  }, [cart]);

  /*
   * ADD TO CART
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
  }

  /*
   * REMOVE FROM CART
   */
  function removeFromCart(productId: number) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  }

  /*
   * DECREASE QUANTITY
   */
  function decreaseQuantity(productId: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
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
   * INCREASE QUANTITY
   */
  function increaseQuantity(productId: number) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
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
   * CART COUNT
   */
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /*
   * CART TOTAL
   */
  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  /*
   * LOAD RAZORPAY CHECKOUT SCRIPT
   */
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

      script.async = true;

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }

  /*
   * START PAYMENT
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
       * STEP 1
       * Load Razorpay Checkout
       */
      const loaded = await loadRazorpayScript();

      if (!loaded) {
        throw new Error(
          "Unable to load Razorpay payment system."
        );
      }

      /*
       * STEP 2
       * CREATE RAZORPAY ORDER
       *
       * IMPORTANT:
       * Your API is located at:
       *
       * /api/razorpay/create-order
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
            "Payment order could not be created."
        );
      }

      const order = await response.json();

      /*
       * Your create-order API returns:
       *
       * id
       * amount
       * currency
       * keyId
       *
       * We use keyId here.
       */
      if (!order.id) {
        throw new Error(
          "Razorpay order ID was not returned."
        );
      }

      if (!order.keyId) {
        throw new Error(
          "Razorpay key ID was not returned. Check your server environment variables."
        );
      }

      /*
       * STEP 3
       * OPEN RAZORPAY CHECKOUT
       */
      const options = {
        key: order.keyId,

        amount: order.amount,

        currency: order.currency || "INR",

        name: "Bee Girl Shopping",

        description:
          "Women's Clothing",

        order_id: order.id,

        handler: async function (
          paymentResponse: any
        ) {
          try {
            setMessage(
              "Payment completed. Verifying payment..."
            );

            /*
             * STEP 4
             * VERIFY PAYMENT
             */
            const verifyResponse = await fetch(
              "/api/razorpay/verify",
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
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

            if (!verifyData?.success) {
              throw new Error(
                verifyData?.error ||
                  "Payment could not be confirmed."
              );
            }

            /*
             * PAYMENT SUCCESS
             */
            setMessage(
              "Payment confirmed successfully! 🎉"
            );

            setCart([]);

            localStorage.removeItem(
              "bee-girl-cart"
            );

            setCartOpen(false);
          } catch (error: any) {
            console.error(
              "Payment verification error:",
              error
            );

            setMessage(
              error?.message ||
                "Payment was completed but could not be confirmed."
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
          store: "Bee Girl Shopping",
        },

        theme: {
          color: "#000000",
        },

        modal: {
          ondismiss: function () {
            setPaying(false);
            setMessage(
              "Payment window was closed."
            );
          },
        },
      };

      /*
       * STEP 5
       * OPEN RAZORPAY
       */
      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response: any) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setMessage(
            response?.error?.description ||
              "Payment failed. Please try again."
          );

          setPaying(false);
        }
      );

      razorpay.open();
    } catch (error: any) {
      console.error(
        "Payment error:",
        error
      );

      setMessage(
        error?.message ||
          "Unable to start payment."
      );

      setPaying(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* HEADER */}
      <header className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="text-5xl">
                🛍️
              </div>

              <h1 className="text-5xl font-black tracking-tight">
                Bee Girl
                <br />
                Shopping
              </h1>
            </div>

            <p className="mt-5 text-2xl text-gray-700">
              Women's Clothing
            </p>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="rounded-3xl bg-black px-8 py-5 text-xl font-semibold text-white"
          >
            🛒 Cart ({cartCount})
          </button>
        </div>
      </header>

      {/* MESSAGE */}
      {message && (
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-xl bg-gray-100 px-5 py-4 text-center text-lg">
            {message}
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Women's Kurtis
          </h2>

          <p className="mt-2 text-lg text-gray-600">
            Beautiful styles for everyday and festive wear.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xl">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border p-10 text-center">
            No products available.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
              >
                {/* PRODUCT IMAGE */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      const image =
                        event.currentTarget;

                      image.style.display =
                        "none";

                      const parent =
                        image.parentElement;

                      if (parent) {
                        parent.innerHTML = `
                          <div style="
                            height:100%;
                            width:100%;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            flex-direction:column;
                            background:#f3f4f6;
                            color:#6b7280;
                            text-align:center;
                            padding:20px;
                          ">
                            <div style="font-size:48px;">
                              👗
                            </div>
                            <div style="
                              margin-top:8px;
                              font-size:16px;
                            ">
                              Product Image
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>

                {/* PRODUCT INFORMATION */}
                <div className="p-6">
                  <p className="text-sm font-medium text-gray-500">
                    {product.category}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    {product.name}
                  </h3>

                  <p className="mt-3 min-h-[72px] text-gray-600">
                    {product.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-3xl font-black">
                      ₹{product.price}
                    </span>

                    <span className="text-sm text-gray-500">
                      {product.stock} available
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      addToCart(product)
                    }
                    disabled={
                      !product.active ||
                      product.stock <= 0
                    }
                    className="mt-6 w-full rounded-2xl bg-black px-5 py-4 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {product.stock <= 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="mt-10 border-t px-6 py-10 text-center">
        <h3 className="text-2xl font-bold">
          Bee Girl Shopping
        </h3>

        <p className="mt-2 text-gray-600">
          Women's Clothing
        </p>

        <p className="mt-5 text-sm text-gray-500">
          © {new Date().getFullYear()} Bee Girl
          Shopping. All rights reserved.
        </p>
      </footer>

      {/* CART OVERLAY */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white p-6">
            {/* CART HEADER */}
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                Your Cart
              </h2>

              <button
                onClick={() =>
                  setCartOpen(false)
                }
                className="rounded-full bg-gray-100 px-4 py-2 text-xl"
              >
                ✕
              </button>
            </div>

            {/* EMPTY CART */}
            {cart.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-6xl">
                  🛒
                </div>

                <p className="mt-5 text-xl text-gray-600">
                  Your cart is empty.
                </p>

                <button
                  onClick={() =>
                    setCartOpen(false)
                  }
                  className="mt-6 rounded-2xl bg-black px-6 py-4 text-white"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* CART ITEMS */}
                <div className="mt-8 space-y-5">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border p-4"
                    >
                      <div className="flex gap-4">
                        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-gray-600">
                            ₹{item.price}
                          </p>

                          <div className="mt-3 flex items-center gap-3">
                            <button
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              className="h-9 w-9 rounded-full bg-gray-200"
                            >
                              −
                            </button>

                            <span className="font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              disabled={
                                item.quantity >=
                                item.stock
                              }
                              className="h-9 w-9 rounded-full bg-gray-200 disabled:opacity-40"
                            >
                              +
                            </button>

                            <button
                              onClick={() =>
                                removeFromCart(
                                  item.id
                                )
                              }
                              className="ml-auto text-sm text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="mt-8 rounded-2xl bg-gray-100 p-5">
                  <div className="flex justify-between text-lg">
                    <span>Items</span>

                    <span>
                      {cartCount}
    
