```tsx
"use client";

import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
};

type CartItem = Product & {
  size: string;
  colour: string;
  quantity: number;
};

const WHATSAPP_NUMBER = "919876543210";

const products: Product[] = [
  {
    id: 1,
    name: "Elegant Cotton Kurti",
    category: "Kurtis",
    price: 799,
    image: "/products/kurti-1.jpg",
  },
  {
    id: 2,
    name: "Designer Anarkali Kurti",
    category: "Kurtis",
    price: 1199,
    image: "/products/kurti-2.jpg",
  },
  {
    id: 3,
    name: "Beautiful Party Saree",
    category: "Sarees",
    price: 999,
    image: "/products/saree-1.jpg",
  },
  {
    id: 4,
    name: "Premium Silk Saree",
    category: "Sarees",
    price: 1499,
    image: "/products/saree-2.jpg",
  },
  {
    id: 5,
    name: "Bridal Lehenga",
    category: "Lehengas",
    price: 2499,
    image: "/products/lehenga-1.jpg",
  },
  {
    id: 6,
    name: "Designer Lehenga",
    category: "Lehengas",
    price: 1999,
    image: "/products/lehenga-2.jpg",
  },
  {
    id: 7,
    name: "Comfort Night Suit",
    category: "Night Wear",
    price: 699,
    image: "/products/nightwear-1.jpg",
  },
  {
    id: 8,
    name: "Soft Cotton Night Wear",
    category: "Night Wear",
    price: 749,
    image: "/products/nightwear-2.jpg",
  },
];

const categories = [
  {
    id: "kurtis",
    name: "Kurtis",
    title: "Elegant Kurtis",
    subtitle: "Stylish comfort for every occasion",
    image: "/banners/kurti-banner.jpg",
  },
  {
    id: "sarees",
    name: "Sarees",
    title: "Graceful Sarees",
    subtitle: "Traditional beauty with a modern touch",
    image: "/banners/saree-banner.jpg",
  },
  {
    id: "lehengas",
    name: "Lehengas",
    title: "Designer Lehengas",
    subtitle: "Perfect for celebrations",
    image: "/banners/lehenga-banner.jpg",
  },
  {
    id: "nightwear",
    name: "Night Wear",
    title: "Comfort Night Wear",
    subtitle: "Relax in comfort and style",
    image: "/banners/nightwear-banner.jpg",
  },
];

const sizes = ["S", "M", "L", "XL", "XXL"];

const colours = [
  "Black",
  "Red",
  "Pink",
  "Blue",
  "Green",
  "Maroon",
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColour, setSelectedColour] = useState("Black");

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  function scrollTo(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  function toggleWishlist(id: number) {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function openProduct(product: Product) {
    setSelectedProduct(product);
    setSelectedSize("M");
    setSelectedColour("Black");
  }

  function addToCart() {
    if (!selectedProduct) return;

    const existing = cart.find(
      (item) =>
        item.id === selectedProduct.id &&
        item.size === selectedSize &&
        item.colour === selectedColour
    );

    if (existing) {
      setCart((current) =>
        current.map((item) =>
          item.id === selectedProduct.id &&
          item.size === selectedSize &&
          item.colour === selectedColour
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCart((current) => [
        ...current,
        {
          ...selectedProduct,
          size: selectedSize,
          colour: selectedColour,
          quantity: 1,
        },
      ]);
    }

    setSelectedProduct(null);
    setCartOpen(true);
  }

  function updateQuantity(
    index: number,
    change: number
  ) {
    setCart((current) =>
      current
        .map((item, itemIndex) =>
          itemIndex === index
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

  function loadRazorpay(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }

  async function payWithRazorpay(
    name: string,
    phone: string,
    address: string
  ) {
    if (!cart.length) return;

    setPaymentLoading(true);

    try {
      const razorpayLoaded =
        await loadRazorpay();

      if (!razorpayLoaded) {
        alert(
          "Unable to load Razorpay. Please try again."
        );

        setPaymentLoading(false);
        return;
      }

      const response = await fetch(
        "/api/razorpay/order",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            amount: cartTotal,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Razorpay order creation failed"
        );
      }

      const order = await response.json();

      const razorpayKey =
        process.env
          .NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        alert(
          "Razorpay Key ID is not configured."
        );

        setPaymentLoading(false);
        return;
      }

      const options = {
        key: razorpayKey,

        amount: order.amount,

        currency: "INR",

        name: "Bee Girl Shopping",

        description:
          "Bee Girl Shopping Order",

        order_id: order.id,

        prefill: {
          name,
          contact: phone,
        },

        notes: {
          address,
        },

        theme: {
          color: "#7b2dcc",
        },

        handler: function (
          paymentResponse: any
        ) {
          const itemsText = cart
            .map(
              (item) =>
                `${item.name} - Size ${item.size} - ${item.colour} x${item.quantity}`
            )
            .join("\n");

          const message =
            `Hello Bee Girl Shopping!%0A%0A` +
            `🎉 New Paid Order%0A%0A` +
            `Customer: ${name}%0A` +
            `Phone: ${phone}%0A` +
            `Address: ${address}%0A%0A` +
            `Products:%0A${encodeURIComponent(
              itemsText
            )}%0A%0A` +
            `Total: ₹${cartTotal}%0A` +
            `Payment ID: ${paymentResponse.razorpay_payment_id}`;

          window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
            "_blank"
          );

          setCart([]);
          setCheckoutOpen(false);
          setCartOpen(false);
          setOrderSuccess(true);
          setPaymentLoading(false);
        },

        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(error);

      alert(
        "Payment could not be started. Please check your Razorpay configuration."
      );

      setPaymentLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#faf7ff] text-[#2c2432]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#eee7f3] bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-[48px] max-w-[1200px] items-center justify-between px-4">

          <button
            onClick={() => scrollTo("home")}
            className="flex items-center gap-1.5"
          >

            <span className="text-[13px]">
              🌸
            </span>

            <div className="text-left">

              <p className="text-[11px] font-bold leading-none">
                Bee Girl Shopping
              </p>

              <p className="mt-1 text-[7px] text-gray-400">
                Women&apos;s Fashion • Online Shopping
              </p>

            </div>

          </button>


          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                alert(
                  wishlist.length
                    ? `${wishlist.length} item(s) in wishlist`
                    : "Your wishlist is empty"
                )
              }
              className="rounded-full border border-[#eee6f3] bg-white px-3 py-1.5 text-[9px] font-semibold text-[#713e92] shadow-sm"
            >
              ♡ Wishlist ({wishlist.length})
            </button>


            <button
              onClick={() =>
                setCartOpen(true)
              }
              className="rounded-full border border-[#eee6f3] bg-white px-3 py-1.5 text-[9px] font-semibold text-[#713e92] shadow-sm"
            >
              🛒 Cart ({cartCount})
            </button>

          </div>

        </div>

      </header>


      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        id="home"
        className="bg-[#f4e4ff]"
      >

        <div className="mx-auto flex min-h-[250px] max-w-[1200px] items-center justify-between gap-5 px-5 py-7 sm:min-h-[300px] sm:px-8">

          <div className="max-w-[570px]">

            <p className="mb-3 text-[8px] uppercase tracking-[1.5px] text-[#765b80] sm:text-[10px]">
              ✨ NEW COLLECTION ✨
            </p>

            <h2 className="text-[31px] font-normal leading-[1.05] tracking-[-1px] sm:text-[43px] md:text-[50px]">
              Fashion Made For You
            </h2>

            <p className="mt-4 text-[10px] text-[#625967] sm:text-[13px]">
              Beautiful Indian fashion for every occasion.
            </p>

            <button
              onClick={() =>
                scrollTo("collection")
              }
              className="mt-3 rounded-full bg-[#7b2dcc] px-5 py-2.5 text-[10px] font-bold text-white shadow-md sm:text-[12px]"
            >
              Explore Collection →
            </button>

          </div>


          <div className="shrink-0">

            <div className="h-[175px] w-[135px] overflow-hidden rounded-[14px] bg-red-600 shadow-xl sm:h-[230px] sm:w-[180px] md:h-[255px] md:w-[205px]">

              <img
                src="/products/hero.jpg"
                alt="Bee Girl Fashion"
                className="h-full w-full object-cover"
              />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SUPPORT / ADDRESS
      ====================================================== */}

      <section className="px-3 pt-5">

        <div className="mx-auto max-w-[1100px] rounded-xl bg-white px-4 py-4 shadow-[0_4px_18px_rgba(70,40,100,0.08)]">

          <p className="text-[10px] font-bold">
            📍 Bee Girl Shopping
          </p>

          <p className="mt-1 text-[9px] text-gray-500">
            Sai Nagar, 7th Cross, Anantapur
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-[9px] font-medium text-gray-600"
          >
            💚 WhatsApp Support
          </a>

        </div>

      </section>


      {/* =====================================================
          FLOATING SUPPORT
      ====================================================== */}

      <div className="fixed right-3 top-[95px] z-40 hidden rounded-xl bg-white px-3 py-2 text-[9px] leading-4 shadow-[0_4px_20px_rgba(0,0,0,0.12)] sm:block">

        <p className="font-bold">
          💬 Contact Support
        </p>

        <p>
          📞 +91 98765 43210
        </p>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600"
        >
          💚 WhatsApp Support
        </a>

      </div>


      {/* =====================================================
          CATEGORY BUTTONS
      ====================================================== */}

      <nav className="mx-auto flex max-w-[900px] justify-center gap-2 overflow-x-auto px-4 py-5">

        {categories.map(
          (category) => (

            <button
              key={category.id}
              onClick={() =>
                scrollTo(category.id)
              }
              className="shrink-0 rounded-full bg-white px-4 py-2 text-[9px] font-semibold text-[#713e92] shadow-[0_2px_10px_rgba(70,40,100,0.10)]"
            >
              {category.name}
            </button>

          )
        )}

      </nav>


      {/* =====================================================
          CATALOG
      ====================================================== */}

      <div
        id="collection"
        className="mx-auto max-w-[1200px] px-4 pb-12"
      >

        {categories.map(
          (category) => {

            const categoryProducts =
              products.filter(
                (product) =>
                  product.category ===
                  category.name
              );

            return (

              <section
                key={category.id}
                id={category.id}
                className="mb-12 scroll-mt-20"
              >

                {/* CATEGORY BANNER */}

                <div className="relative mb-5 h-[105px] overflow-hidden rounded-xl sm:h-[145px]">

                  <img
                    src={category.image}
                    alt={category.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/35" />

                  <div className="relative flex h-full flex-col justify-center px-4 sm:px-7">

                    <h3 className="text-[18px] font-medium text-white sm:text-[24px]">
                      {category.title}
                    </h3>

                    <p className="mt-1 text-[8px] text-white/90 sm:text-[11px]">
                      {category.subtitle}
                    </p>

                  </div>

                </div>


                {/* CATEGORY TITLE */}

                <div className="mb-5 text-center">

                  <h3 className="text-[14px] font-medium">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-[9px] text-gray-400">
                    Choose your favourite style
                  </p>

                </div>


                {/* PRODUCT GRID */}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

                  {categoryProducts.map(
                    (product) => (

                      <article
                        key={product.id}
                        className="overflow-hidden rounded-xl bg-white p-1.5 shadow-[0_3px_14px_rgba(70,40,100,0.10)]"
                      >

                        <div className="relative aspect-[0.82] overflow-hidden rounded-lg bg-gray-100">

                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          />


                          <button
                            onClick={() =>
                              toggleWishlist(
                                product.id
                              )
                            }
                            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[16px] shadow-sm"
                          >
                            {wishlist.includes(
                              product.id
                            )
                              ? "♥"
                              : "♡"}
                          </button>

                        </div>


                        <div className="px-1 pb-1">

                          <p className="mt-1.5 min-h-[28px] text-[9px] leading-[13px] text-gray-600 sm:text-[11px]">
                            {product.name}
                          </p>

                          <p className="mt-1 text-[12px] font-bold text-[#7130a7] sm:text-[14px]">
                            ₹{product.price}
                          </p>


                          {/* ONLY SELECT OPTION */}

                          <button
                            onClick={() =>
                              openProduct(
                                product
                              )
                            }
                            className="mt-2 w-full rounded-full bg-[#7831c5] py-2 text-[8px] font-bold text-white sm:py-2.5 sm:text-[10px]"
                          >
                            Select Size &amp; Colour
                          </button>

                        </div>

                      </article>

                    )
                  )}

                </div>

              </section>

            );
          }
        )}

      </div>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-purple-100 bg-white px-4 py-8 text-center">

        <p className="text-[11px] font-bold text-[#d21c72]">
          🌸 Bee Girl Shopping
        </p>

        <p className="mt-2 text-[8px] text-gray-400">
          Beautiful Indian fashion for every occasion.
        </p>

        <p className="mt-3 text-[8px] text-gray-400">
          📍 Sai Nagar, 7th Cross, Anantapur
        </p>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-[8px] font-semibold text-green-600"
        >
          💚 WhatsApp Support
        </a>

      </footer>


      {/* =====================================================
          SIZE + COLOUR MODAL
      ====================================================== */}

      {selectedProduct && (

        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-5">

          <div className="w-full max-w-[430px] rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl">

            <div className="flex gap-4">

              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="h-[120px] w-[95px] rounded-xl object-cover"
              />

              <div className="flex-1">

                <h3 className="text-sm font-semibold">
                  {selectedProduct.name}
                </h3>

                <p className="mt-2 text-sm font-bold text-[#7130a7]">
                  ₹{selectedProduct.price}
                </p>

                <button
                  onClick={() =>
                    setSelectedProduct(
                      null
                    )
                  }
                  className="mt-4 text-xs text-gray-400"
                >
                  Close
                </button>

              </div>

            </div>


            <div className="mt-5">

              <p className="mb-2 text-xs font-semibold">
                Select Size
              </p>

              <div className="flex flex-wrap gap-2">

                {sizes.map(
                  (size) => (

                    <button
                      key={size}
                      onClick={() =>
                        setSelectedSize(
                          size
                        )
                      }
                      className={`rounded-lg border px-4 py-2 text-xs font-semibold ${
                        selectedSize ===
                        size
                          ? "border-[#7831c5] bg-[#7831c5] text-white"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      {size}
                    </button>

                  )
                )}

              </div>

            </div>


            <div className="mt-5">

              <p className="mb-2 text-xs font-semibold">
                Select Colour
              </p>

              <div className="flex flex-wrap gap-2">

                {colours.map(
                  (colour) => (

                    <button
                      key={colour}
                      onClick={() =>
                        setSelectedColour(
                          colour
                        )
                      }
                      className={`rounded-lg border px-3 py-2 text-[10px] ${
                        selectedColour ===
                        colour
                          ? "border-[#7831c5] bg-[#7831c5] text-white"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {colour}
                    </button>

                  )
                )}

              </div>

            </div>


            <button
              onClick={addToCart}
              className="mt-6 w-full rounded-full bg-[#7831c5] py-3 text-sm font-bold text-white"
            >
              Continue to Cart
            </button>

          </div>

        </div>

      )}


      {/* =====================================================
          CART DRAWER
      ====================================================== */}

      {cartOpen && (

        <div className="fixed inset-0 z-[110] bg-black/45">

          <div className="absolute right-0 top-0 h-full w-full max-w-[430px] overflow-y-auto bg-[#faf7ff] shadow-2xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">

              <div>

                <h2 className="text-lg font-bold">
                  Your Cart
                </h2>

                <p className="text-[10px] text-gray-400">
                  {cartCount} item(s)
                </p>

              </div>

              <button
                onClick={() =>
                  setCartOpen(false)
                }
                className="rounded-full bg-gray-100 px-3 py-2 text-xs"
              >
                ✕
              </button>

            </div>


            <div className="p-4">

              {cart.length === 0 ? (

                <div className="py-20 text-center">

                  <p className="text-4xl">
                    🛒
                  </p>

                  <p className="mt-3 text-sm font-semibold">
                    Your cart is empty
                  </p>

                  <button
                    onClick={() =>
                      setCartOpen(false)
                    }
                    className="mt-5 rounded-full bg-[#7831c5] px-5 py-2.5 text-xs font-bold text-white"
                  >
                    Continue Shopping
                  </button>

                </div>

              ) : (

                <>

                  {cart.map(
                    (item, index) => (

                      <div
                        key={`${item.id}-${item.size}-${item.colour}`}
                        className="mb-3 flex gap-3 rounded-xl bg-white p-3 shadow-sm"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-[85px] w-[70px] rounded-lg object-cover"
                        />

                        <div className="flex-1">

                          <p className="text-xs font-semibold">
                            {item.name}
                          </p>

                          <p className="mt-1 text-[9px] text-gray-400">
                            Size: {item.size}
                          </p>

                          <p className="text-[9px] text-gray-400">
                            Colour: {item.colour}
                          </p>

                          <p className="mt-1 text-sm font-bold text-[#7130a7]">
                            ₹{item.price}
                          </p>


                          <div className="mt-2 flex items-center gap-2">

                            <button
                              onClick={() =>
                                updateQuantity(
                                  index,
                                  -1
                                )
                              }
                              className="h-6 w-6 rounded-full bg-gray-100 text-xs"
                            >
                              −
                            </button>

                            <span className="text-xs">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(
                                  index,
                                  1
                                )
                              }
                              className="h-6 w-6 rounded-full bg-gray-100 text-xs"
                            >
                              +
                            </button>

                          </div>

                        </div>

                      </div>

                    )
                  )}


                  <div className="mt-5 rounded-xl bg-white p-4 shadow-sm">

                    <div className="flex justify-between text-xs">
                      <span>
                        Subtotal
                      </span>

                      <span>
                        ₹{cartTotal}
                      </span>
                    </div>


                    <div className="mt-2 flex justify-between text-xs">
                      <span>
                        Delivery
                      </span>

                      <span>
                        Free
                      </span>
                    </div>


                    <div className="my-3 border-t" />


                    <div className="flex justify-between font-bold">
                      <span>
                        Total
                      </span>

                      <span>
                        ₹{cartTotal}
                      </span>
                    </div>


                    <button
                      onClick={() => {
                        setCartOpen(false);
                        setCheckoutOpen(
                          true
                        );
                      }}
                      className="mt-4 w-full rounded-full bg-[#7831c5] py-3 text-xs font-bold text-white"
                    >
                      Proceed to Checkout
                    </button>

                  </div>

                </>

              )}

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          CHECKOUT
      ====================================================== */}

      {checkoutOpen && (

        <CheckoutModal
          total={cartTotal}
          loading={paymentLoading}
          onClose={() =>
            setCheckoutOpen(false)
          }
          onPay={payWithRazorpay}
        />

      )}


      {/* =====================================================
          SUCCESS
      ====================================================== */}

      {orderSuccess && (

        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-5">

          <div className="w-full max-w-[390px] rounded-2xl bg-white p-7 text-center shadow-2xl">

            <div className="text-5xl">
              ✅
            </div>

            <h2 className="mt-4 text-xl font-bold">
              Order Successful!
            </h2>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Your payment was successful.
              Your order details have been
              sent to WhatsApp support.
            </p>

            <button
              onClick={() =>
                setOrderSuccess(false)
              }
              className="mt-5 w-full rounded-full bg-[#7831c5] py-3 text-xs font-bold text-white"
            >
              Continue Shopping
            </button>

          </div>

        </div>

      )}

    </main>
  );
}


/* ============================================================
   CHECKOUT COMPONENT
============================================================ */

function CheckoutModal({
  total,
  loading,
  onClose,
  onPay,
}: {
  total: number;
  loading: boolean;
  onClose: () => void;
  onPay: (
    name: string,
    phone: string,
    address: string
  ) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const valid =
    name.trim().length >= 3 &&
    phone.replace(/\D/g, "").length >=
      10 &&
    address.trim().length >= 6;

  return (

    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/50 sm:items-center sm:p-5">

      <div className="max-h-[95vh] w-full max-w-[430px] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold">
              Checkout
            </h2>

            <p className="text-[10px] text-gray-400">
              Enter delivery details
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 px-3 py-2 text-xs"
          >
            ✕
          </button>

        </div>


        <div className="mt-5 space-y-3">

          <div>

            <label className="mb-1 block text-[10px] font-semibold">
              Full Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
              className="w-full rounded-xl border border-gray-200 px-3 py-3 text-xs outline-none focus:border-purple-400"
            />

          </div>


          <div>

            <label className="mb-1 block text-[10px] font-semibold">
              Phone Number
            </label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="10 digit mobile number"
              inputMode="numeric"
              className="w-full rounded-xl border border-gray-200 px-3 py-3 text-xs outline-none focus:border-purple-400"
            />

          </div>


          <div>

            <label className="mb-1 block text-[10px] font-semibold">
              Delivery Address
            </label>

            <textarea
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
              placeholder="Enter complete delivery address"
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-3 text-xs outline-none focus:border-purple-400"
            />

          </div>

        </div>


        <div className="mt-5 rounded-xl bg-[#faf7ff] p-4">

          <div className="flex justify-between text-xs">

            <span>
              Total Amount
            </span>

            <strong className="text-[#7130a7]">
              ₹{total}
            </strong>

          </div>

        </div>


        <button
          disabled={!valid || loading}
          onClick={() =>
            onPay(
              name,
              phone,
              address
            )
          }
          className="mt-5 w-full rounded-full bg-[#7831c5] py-3.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading
            ? "Opening Razorpay..."
            : `Pay ₹${total} with Razorpay`}
        </button>


        <p className="mt-3 text-center text-[8px] text-gray-400">
          🔒 Secure payment powered by Razorpay
        </p>

      </div>

    </div>
  );
}
```
