"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category?: string;
  image?: string;
  description?: string;
  sizes?: string[];
  stock?: number;
};

type CartItem = Product & {
  quantity: number;
  size: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Elegant Cotton Kurti",
    price: 799,
    category: "Kurtis",
    image: "/products/kurti-1.jpeg",
    description:
      "Comfortable and stylish cotton kurti for everyday wear.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 20,
  },
  {
    id: 2,
    name: "Designer Anarkali Kurti",
    price: 1199,
    category: "Kurtis",
    image: "/products/kurti-2.jpeg",
    description:
      "Beautiful designer Anarkali kurti for festive occasions.",
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
  },
  {
    id: 3,
    name: "Printed Women's Kurti",
    price: 899,
    category: "Kurtis",
    image: "/products/kurti-3.jpeg",
    description:
      "Trendy printed kurti with a comfortable fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 25,
  },
  {
    id: 4,
    name: "Premium Embroidered Kurti",
    price: 1499,
    category: "Kurtis",
    image: "/products/kurti-4.jpeg",
    description:
      "Premium embroidered kurti for special occasions.",
    sizes: ["S", "M", "L", "XL"],
    stock: 10,
  },
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("M");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [message, setMessage] = useState("");
  const [paying, setPaying] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerPincode, setCustomerPincode] = useState("");

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(
        "sindhu-shopping-cart"
      );

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error("Unable to load cart:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "sindhu-shopping-cart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  }, [cart]);

  function showMessage(text: string) {
    setMessage(text);

    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category)
      .filter(Boolean) as string[];

    return ["All", ...Array.from(new Set(values))];
  }, []);

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatch =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const searchMatch =
        !searchText ||
        product.name.toLowerCase().includes(searchText) ||
        (product.category || "")
          .toLowerCase()
          .includes(searchText) ||
        (product.description || "")
          .toLowerCase()
          .includes(searchText);

      return categoryMatch && searchMatch;
    });
  }, [search, selectedCategory]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  }

  function addToCart(
    product: Product,
    size: string = "M"
  ) {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) =>
          item.id === product.id &&
          item.size === size
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id &&
          item.size === size
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
          size,
        },
      ];
    });

    showMessage(
      `${product.name} added to cart.`
    );
  }

  function removeFromCart(
    id: number,
    size: string
  ) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(item.id === id && item.size === size)
      )
    );
  }

  function updateQuantity(
    id: number,
    size: string,
    change: number
  ) {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (
            item.id !== id ||
            item.size !== size
          ) {
            return item;
          }

          return {
            ...item,
            quantity: Math.max(
              0,
              item.quantity + change
            ),
          };
        })
        .filter(
          (item) => item.quantity > 0
        )
    );
  }

  function openProduct(product: Product) {
    setSelectedProduct(product);

    const sizes =
      product.sizes && product.sizes.length > 0
        ? product.sizes
        : ["S", "M", "L", "XL"];

    setSelectedSize(
      sizes.includes("M") ? "M" : sizes[0]
    );
  }

  function openCheckout() {
    if (cart.length === 0) {
      showMessage("Your cart is empty.");
      return;
    }

    setCartOpen(false);
    setCheckoutOpen(true);
  }

  function validateCheckout() {
    if (!customerName.trim()) {
      showMessage("Please enter your name.");
      return false;
    }

    if (
      !/^[0-9]{10}$/.test(
        customerPhone.trim()
      )
    ) {
      showMessage(
        "Please enter a valid 10-digit phone number."
      );
      return false;
    }

    if (!customerAddress.trim()) {
      showMessage("Please enter your address.");
      return false;
    }

    if (!customerCity.trim()) {
      showMessage("Please enter your city.");
      return false;
    }

    if (
      !/^[0-9]{6}$/.test(
        customerPincode.trim()
      )
    ) {
      showMessage(
        "Please enter a valid 6-digit pincode."
      );
      return false;
    }

    return true;
  }

  async function placeOrder() {
    if (!validateCheckout()) {
      return;
    }

    setPaying(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      setCart([]);
      setCheckoutOpen(false);

      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setCustomerCity("");
      setCustomerPincode("");

      showMessage(
        "Order placed successfully! We will contact you shortly."
      );
    } catch (error) {
      console.error(error);
      showMessage(
        "Unable to place the order. Please try again."
      );
    } finally {
      setPaying(false);
    }
  }

  return (
    <main className="min-h-screen bg-pink-50 text-gray-900">

      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">

          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="text-left"
          >
            <div className="text-2xl font-black text-pink-600">
              Sindhu Shopping
            </div>

            <div className="text-xs font-medium text-gray-500">
              Women's Fashion
            </div>
          </button>

          <div className="hidden flex-1 md:block md:max-w-xl">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search kurtis, dresses, fashion..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-sm outline-none focus:border-pink-400 focus:bg-white"
            />
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative rounded-full bg-pink-600 px-5 py-3 font-bold text-white shadow-sm hover:bg-pink-700"
          >
            🛒 Cart

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="px-4 pb-4 md:hidden">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search products..."
            className="w-full rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-sm outline-none focus:border-pink-400"
          />
        </div>
      </header>

      {/* MESSAGE */}

      {message && (
        <div className="fixed left-1/2 top-24 z-[100] w-[90%] max-w-md -translate-x-1/2 rounded-xl bg-gray-900 px-5 py-3 text-center text-sm font-medium text-white shadow-xl">
          {message}
        </div>
      )}

      {/* HERO */}

      <section className="bg-gradient-to-r from-pink-100 via-white to-purple-100">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">

          <div>
            <p className="mb-3 font-bold uppercase tracking-[0.2em] text-pink-600">
              New Collection
            </p>

            <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Beautiful Fashion
              <br />
              Made For You
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
              Discover stylish women's kurtis
              and outfits at affordable prices
              from Sindhu Shopping.
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
              className="mt-8 rounded-full bg-pink-600 px-7 py-3 font-bold text-white shadow-lg hover:bg-pink-700"
            >
              Shop Now →
            </button>
          </div>

          <div className="flex min-h-[280px] items-center justify-center rounded-3xl bg-gradient-to-br from-pink-200 to-purple-200 p-8 shadow-inner">
            <div className="text-center">
              <div className="text-7xl">
                👗
              </div>

              <div className="mt-4 text-2xl font-black text-pink-700">
                Sindhu Shopping
              </div>

              <div className="mt-2 text-gray-600">
                Fashion • Style • Comfort
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CATEGORIES */}

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-3 overflow-x-auto pb-2">

          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold ${
                selectedCategory === category
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-700 shadow-sm hover:bg-pink-50"
              }`}
            >
              {category}
            </button>
          ))}

        </div>
      </section>

      {/* PRODUCTS */}

      <section
        id="products"
        className="mx-auto max-w-7xl px-4 pb-16"
      >
        <div className="mb-7 flex items-end justify-between gap-4">

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
              Our Collection
            </p>

            <h2 className="mt-1 text-3xl font-black">
              Women's Fashion
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            {filteredProducts.length} products
          </p>

        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <div className="text-5xl">
              🔍
            </div>

            <h3 className="mt-4 text-xl font-bold">
              No products found
            </h3>

            <p className="mt-2 text-gray-500">
              Try another search or category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-5 rounded-full bg-pink-600 px-6 py-2.5 font-bold text-white"
            >
              Show All Products
            </button>

          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                <button
                  type="button"
                  onClick={() =>
                    openProduct(product)
                  }
                  className="block w-full text-left"
                >

                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">

                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl">
                        👗
                      </div>
                    )}

                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-pink-600">
                      {product.category || "Fashion"}
                    </div>

                  </div>

                  <div className="p-4">

                    <h3 className="min-h-[48px] font-bold">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-lg font-black text-pink-600">
                      {formatPrice(product.price)}
                    </p>

                  </div>

                </button>

                <div className="px-4 pb-4">

                  <button
                    type="button"
                    onClick={() =>
                      addToCart(product, "M")
                    }
                    className="w-full rounded-xl bg-pink-600 py-3 font-bold text-white hover:bg-pink-700"
                  >
                    Add to Cart
                  </button>

                </div>

              </article>
            ))}

          </div>
        )}
      </section>

      {/* FOOTER */}

      <footer className="bg-gray-950 px-4 py-12 text-white">

        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">

          <div>
            <h3 className="text-2xl font-black text-pink-400">
              Sindhu Shopping
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-400">
              Stylish women's clothing at
              affordable prices.
            </p>
          </div>

          <div>
            <h4 className="font-bold">
              Quick Links
            </h4>

            <div className="mt-4 space-y-2 text-sm text-gray-400">

              <button
                type="button"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
                className="block hover:text-pink-400"
              >
                Home
              </button>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="block hover:text-pink-400"
              >
                Products
              </button>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="block hover:text-pink-400"
              >
                Cart
              </button>

            </div>
          </div>

          <div>
            <h4 className="font-bold">
              Contact
            </h4>

            <div className="mt-4 space-y-2 text-sm text-gray-400">
              <p>📞 Contact us for orders</p>
              <p>🚚 Delivery available</p>
              <p>💳 Secure checkout</p>
              <p>❤️ Thank you for shopping with us</p>
            </div>
          </div>

        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Sindhu Shopping. All rights reserved.
        </div>

      </footer>

      {/* PRODUCT MODAL */}

      {selectedProduct && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="grid md:grid-cols-2">

              <div className="aspect-[3/4] bg-gray-100 md:aspect-auto">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[350px] items-center justify-center text-7xl">
                    👗
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedProduct(null)
                  }
                  className="float-right rounded-full bg-gray-100 px-3 py-1 text-xl"
                >
                  ×
                </button>

                <p className="text-sm font-bold uppercase text-pink-600">
                  {selectedProduct.category || "Fashion"}
       
