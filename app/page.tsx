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

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to load products");
        }

        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setMessage("Unable to load products.");
      });
  }, []);

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

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
        setMessage("Unable to load payment system.");
        setPaying(false);
        return;
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
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.error ||
            "Payment order could not be created"
        );
      }

      const order = await response.json();

      if (!order.id) {
        throw new Error("Razorpay order ID is missing");
      }

      const razorpayKey =
        order.keyId ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error(
          "Razorpay public key is not configured"
        );
      }

      const options = {
        key: razorpayKey,

        amount: order.amount,

        currency: order.currency || "INR",

        name: "Bee Girl Shopping",

        description: "Women's Clothing",

        order_id: order.id,

        handler: async function (paymentResponse: any) {
          try {
            setMessage("Verifying payment...");

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
              await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              setMessage(
                verifyData.error ||
                  "Payment verification failed."
              );

              setPaying(false);
              return;
            }

            setMessage(
              "Payment confirmed successfully! Thank you for your order."
            );

            setCart([]);
            setCartOpen(false);
            setPaying(false);
          } catch (error) {
            console.error(error);

            setMessage(
              "Payment was received, but verification failed. Please contact us."
            );

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

        theme: {
          color: "#000000",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response: any) {
          console.error(
            "Payment failed:",
            response.error
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

  return (
    <main className="min-h-screen bg-white text-black">
      {/* HEADER */}

      <header className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="text-4xl">
                🛍️
              </div>

              <h1 className="text-4xl font-black tracking-tight">
                Bee Girl
                <br />
                Shopping
              </h1>
            </div>

            <p className="mt-4 text-xl text-gray-600">
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
          <div className="rounded-xl bg-gray-100 px-5 py-4 text-center">
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

          <p className="mt-2 text-gray-600">
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
              >
                {/* PRODUCT IMAGE */}

                <div className="relative h-80 w-full overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      const image =
                        event.currentTarget;

                      image.style.display = "none";

                      const parent =
                        image.parentElement;

                      if (parent) {
                        parent.innerHTML = `
                          <div
                            style="
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
                            "
                          >
                            <div style="font-size:48px;">
                              👗
                            </div>

                            <div
                              style="
                                font-size:16px;
                                margin-top:8px;
                              "
                            >
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
                    onClick={() => addToCart(product)}
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

      {/* CART OVERLAY */}

      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                Your Cart
              </h2>

              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full bg-gray-100 px-4 py-2 text-xl"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="py-20 text-center text-lg text-gray-500">
                Your cart is empty.
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
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-24 w-20 rounded-xl object-cover"
                        />

                        <div className="flex-1">
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

                            <span className="font-bold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              className="h-9 w-9 rounded-full bg-gray-200"
                            >
                              +
                            </button>

                            <button
                              onClick={() =>
                                removeFromCart(item.id)
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
                    <span>{cartCount}</span>
                  </div>

                  <div className="mt-3 flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span>₹{cartTotal}</span>
                  </div>
                </div>

                {/* CHECKOUT */}

                <button
                  onClick={startPayment}
                  disabled={paying}
                  className="mt-6 w-full rounded-2xl bg-black px-5 py-5 text-xl font-semibold text-white disabled:bg-gray-500"
                >
                  {paying
                    ? "Opening Payment..."
                    : `Pay ₹${cartTotal}`}
                </button>

                <p className="mt-4 text-center text-sm text-gray-500">
                  Secure checkout • UPI / Cards / Net Banking
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}

      <footer className="mt-20 border-t px-6 py-10 text-center">
        <h3 className="text-2xl font-bold">
          Bee Girl Shopping
        </h3>

        <p className="mt-2 text-gray-600">
          Women's Clothing
        </p>

        <p className="mt-5 text-sm text-gray-500">
          © {new Date().getFullYear()} Bee Girl Shopping.
          All rights reserved.
        </p>
      </footer>
    </main>
  );
      }
