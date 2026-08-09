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
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, product.stock),
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
    setTimeout(() => setMessage(""), 2000);
  }

  function increaseQuantity(id: number) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, item.stock),
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

  function removeFromCart(id: number) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
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

  function loadRazorpayScript() {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";
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

      /*
       * This expects your existing /api/razorpay route.
       * Keep your Razorpay secret key on the server only.
       */
      const response = await fetch("/api/razorpay", {
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
      });

      if (!response.ok) {
        throw new Error("Payment order could not be created");
      }

      const order = await response.json();

      const options = {
        key:
          order.key ||
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
          "",
        amount: order.amount || cartTotal * 100,
        currency: order.currency || "INR",
        name: "Bee Girl Shopping",
        description: "Women's Clothing",
        order_id: order.id,

        handler: function (paymentResponse: any) {
          console.log("Payment successful:", paymentResponse);

          setMessage(
            "Payment successful! Thank you for shopping with Bee Girl Shopping."
          );

          setCart([]);
          setCartOpen(false);
        },

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        theme: {
          color: "#000000",
        },

        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
      };

      if (!options.key) {
        setMessage(
          "Razorpay key is not configured yet. Your products and cart are working."
        );
        setPaying(false);
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);

      setMessage(
        "Payment is not configured yet. Your cart is working correctly."
      );
    }

    setPaying(false);
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* HEADER */}
      <header className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="text-6xl">🛍️</div>

              <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
                Bee Girl
                <br />
                Shopping
              </h1>
            </div>

            <p className="mt-5 text-2xl text-gray-700">
              Women&apos;s Clothing
            </p>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="rounded-3xl bg-black px-8 py-5 text-xl font-semibold text-white transition hover:bg-gray-800"
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
            Women&apos;s Kurtis
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* PRODUCT IMAGE */}
                <div className="relative h-72 w-full overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      const image = event.currentTarget;

                      image.style.display = "none";

                      const parent = image.parentElement;

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
                            <div style="font-size:48px;">👗</div>
                            <div style="font-size:16px;margin-top:8px;">
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
                    disabled={!product.active || product.stock <= 0}
                    className="mt-6 w-full rounded-2xl bg-black px-5 py-4 text-lg font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
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
          <div className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
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
              <div className="py-20 text-center">
                <div className="text-6xl">🛒</div>

                <p className="mt-5 text-xl text-gray-600">
                  Your cart is empty.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-8 space-y-5">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border p-4"
                    >
                      <div className="flex gap-4">
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
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

                          <p className="mt-1 text-lg font-semibold">
                            ₹{item.price}
                          </p>

                          <div className="mt-3 flex items-center gap-3">
                            <button
                              onClick={() =>
                                decreaseQuantity(item.id)
                              }
                              className="h-9 w-9 rounded-full bg-gray-200 text-lg"
                            >
                              −
                            </button>

                            <span className="min-w-6 text-center font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                increaseQuantity(item.id)
                              }
                              className="h-9 w-9 rounded-full bg-gray-200 text-lg"
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

                  <div className="mt-3 flex justify-between text-2xl font-black">
                    <span>Total</span>
                    <span>₹{cartTotal}</span>
                  </div>
                </div>

                {/* CHECKOUT */}
                <button
                  onClick={startPayment}
                  disabled={paying}
                  className="mt-6 w-full rounded-2xl bg-black px-5 py-5 text-xl font-bold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
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
          Women&apos;s Clothing
        </p>

        <p className="mt-5 text-sm text-gray-500">
          © {new Date().getFullYear()} Bee Girl Shopping. All rights reserved.
        </p>
      </footer>
    </main>
  );
            }
