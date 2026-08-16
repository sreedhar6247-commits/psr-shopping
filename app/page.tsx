"use client";

import { useState } from "react";

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
    name: "Printed Women Kurti",
    category: "Kurtis",
    price: 899,
    image: "/products/kurti-3.jpg",
  },
  {
    id: 4,
    name: "Premium Embroidered Kurti",
    category: "Kurtis",
    price: 1299,
    image: "/products/kurti-4.jpg",
  },
];

const sections = [
  {
    category: "Kurtis",
    title: "Elegant Kurtis",
    subtitle: "Beautiful everyday styles",
    image: "/products/hero-violet-kurti.png",
  },
  {
    category: "Sarees",
    title: "Graceful Sarees",
    subtitle: "Traditional beauty with a modern touch",
    image: "",
  },
  {
    category: "Lehengas",
    title: "Designer Lehengas",
    subtitle: "Perfect for celebrations",
    image: "",
  },
  {
    category: "Night Wear",
    title: "Comfort Night Wear",
    subtitle: "Relax in comfort and style",
    image: "",
  },
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColour, setSelectedColour] = useState("Purple");

  const [cartOpen, setCartOpen] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerPincode, setCustomerPincode] = useState("");

  const [paymentLoading, setPaymentLoading] = useState(false);

  const visibleProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === activeCategory
        );

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function addToCart() {
    if (!selectedProduct) return;

    setCart((oldCart) => {
      const existing = oldCart.find(
        (item) =>
          item.id === selectedProduct.id &&
          item.size === selectedSize &&
          item.colour === selectedColour
      );

      if (existing) {
        return oldCart.map((item) =>
          item.id === selectedProduct.id &&
          item.size === selectedSize &&
          item.colour === selectedColour
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...oldCart,
        {
          ...selectedProduct,
          size: selectedSize,
          colour: selectedColour,
          quantity: 1,
        },
      ];
    });

    setSelectedProduct(null);
    setCartOpen(true);
  }

  function changeQuantity(
    id: number,
    size: string,
    colour: string,
    change: number
  ) {
    setCart((oldCart) =>
      oldCart
        .map((item) =>
          item.id === id &&
          item.size === size &&
          item.colour === colour
            ? {
                ...item,
                quantity: item.quantity + change,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(
    id: number,
    size: string,
    colour: string
  ) {
    setCart((oldCart) =>
      oldCart.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size &&
            item.colour === colour
          )
      )
    );
  }

  async function proceedToPay() {
    if (cart.length === 0) {
      alert("Please add a product to your cart first.");
      return;
    }

    if (
      !customerName ||
      !customerPhone ||
      !customerAddress ||
      !customerCity ||
      !customerPincode
    ) {
      alert("Please fill all customer details.");
      return;
    }

    setPaymentLoading(true);

    try {
      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        const Razorpay = (window as any).Razorpay;

        if (!Razorpay) {
          alert("Razorpay could not be loaded.");
          setPaymentLoading(false);
          return;
        }

        const options = {
          key:
            process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
            "rzp_test_YOUR_KEY_ID",

          amount: totalAmount * 100,

          currency: "INR",

          name: "Bee Girl Shopping",

          description: "Women's Fashion Order",

          prefill: {
            name: customerName,
            contact: customerPhone,
          },

          notes: {
            address: customerAddress,
            city: customerCity,
            pincode: customerPincode,
          },

          theme: {
            color: "#7935c4",
          },

          handler: function (response: any) {
            alert(
              "Payment successful!\nPayment ID: " +
                response.razorpay_payment_id
            );

            setCart([]);
            setCartOpen(false);
            setPaymentLoading(false);
          },

          modal: {
            ondismiss: function () {
              setPaymentLoading(false);
            },
          },
        };

        const paymentObject = new Razorpay(options);

        paymentObject.open();
      };

      script.onerror = () => {
        alert("Unable to load Razorpay.");
        setPaymentLoading(false);
      };

      document.body.appendChild(script);
    } catch {
      alert("Payment could not be started.");
      setPaymentLoading(false);
    }
  }

  return (
    <main className="page">

      {/* HEADER */}

      <header className="header">
        <div className="brand">
          <span>🌸</span>

          <div>
            <b>Bee Girl Shopping</b>

            <small>
              Women&apos;s Fashion • Kurtis • Sarees • Lehengas
            </small>
          </div>
        </div>

        <button
          className="cartTop"
          onClick={() => setCartOpen(true)}
        >
          🛒 Cart ({totalItems})
        </button>
      </header>


      {/* HERO */}

      <section className="hero">

        <div className="heroText">

          <div className="newCollection">
            ✨ NEW COLLECTION ✨
          </div>

          <h1>
            Fashion
            <br />
            Made For You
          </h1>

          <p>
            Discover beautiful women&apos;s fashion for every
            occasion — from everyday kurtis to elegant sarees,
            designer lehengas and comfortable night wear.
          </p>

          <button
            className="purpleButton"
            onClick={() =>
              document
                .getElementById("catalog")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            Explore Collection →
          </button>

        </div>

        <div className="heroImage">

          <img
            src="/products/hero-violet-kurti.png"
            alt="Fashion collection"
          />

        </div>

      </section>


      {/* LOCATION */}

      <section className="location">

        <div>
          <b>📍 Visit Bee Girl Shopping</b>

          <span>
            Near 7th Cross, Anantapur
          </span>
        </div>

        <a
          href="https://www.google.com/maps/search/?api=1&query=Anantapur%20Andhra%20Pradesh"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Location
        </a>

      </section>


      {/* CATALOG */}

      <section
        id="catalog"
        className="catalog"
      >

        <div className="categories">

          {[
            "All",
            "Kurtis",
            "Sarees",
            "Lehengas",
            "Night Wear",
          ].map((category) => (

            <button
              key={category}
              className={
                activeCategory === category
                  ? "category active"
                  : "category"
              }
              onClick={() =>
                setActiveCategory(category)
              }
            >
              {category}
            </button>

          ))}

        </div>


        {/* FOUR SECTIONS */}

        {sections.map((section) => {

          if (
            activeCategory !== "All" &&
            activeCategory !== section.category
          ) {
            return null;
          }

          const sectionProducts =
            visibleProducts.filter(
              (product) =>
                product.category ===
                section.category
            );

          return (
            <section
              className="catalogSection"
              key={section.category}
            >

              {/* SECTION BANNER */}

              <div className="sectionBanner">

                {section.image ? (
                  <img
                    src={section.image}
                    alt={section.title}
                  />
                ) : (
                  <div className="emptyBanner" />
                )}

                <div className="bannerShade" />

                <div className="bannerText">

                  <h2>
                    {section.title}
                  </h2>

                  <p>
                    {section.subtitle}
                  </p>

                </div>

              </div>


              {/* SECTION TITLE */}

              <div className="sectionHeading">

                <h2>
                  {section.category}
                </h2>

                <p>
                  Choose your favorite style
                </p>

              </div>


              {/* PRODUCTS */}

              {sectionProducts.length > 0 ? (

                <div className="products">

                  {sectionProducts.map(
                    (product) => (

                      <article
                        className="product"
                        key={product.id}
                      >

                        <div className="productImage">

                          <img
                            src={product.image}
                            alt={product.name}
                          />

                          <button className="heart">
                            ♡
                          </button>

                        </div>


                        <div className="productDetails">

                          <small>
                            {product.category}
                          </small>

                          <h3>
                            {product.name}
                          </h3>

                          <strong>
                            ₹{product.price}
                          </strong>

                          <button
                            className="selectButton"
                            onClick={() =>
                              setSelectedProduct(
                                product
                              )
                            }
                          >
                            Select Size &amp;
                            <br />
                            Colour
                          </button>

                        </div>

                      </article>

                    )
                  )}

                </div>

              ) : (

                <div className="comingSoon">
                  More {section.category} products
                  coming soon.
                </div>

              )}

            </section>
          );
        })}

      </section>


      {/* PRODUCT SELECTION MODAL */}

      {selectedProduct && (

        <div className="modalBackground">

          <div className="modal">

            <button
              className="close"
              onClick={() =>
                setSelectedProduct(null)
              }
            >
              ×
            </button>

            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
            />

            <h2>
              {selectedProduct.name}
            </h2>

            <strong>
              ₹{selectedProduct.price}
            </strong>


            <label>
              Select Size
            </label>

            <div className="options">

              {["S", "M", "L", "XL", "XXL"].map(
                (size) => (

                  <button
                    key={size}
                    className={
                      selectedSize === size
                        ? "option selectedOption"
                        : "option"
                    }
                    onClick={() =>
                      setSelectedSize(size)
                    }
                  >
                    {size}
                  </button>

                )
              )}

            </div>


            <label>
              Select Colour
            </label>

            <div className="options">

              {[
                "Purple",
                "Pink",
                "Black",
                "Blue",
              ].map((colour) => (

                <button
                  key={colour}
                  className={
                    selectedColour === colour
                      ? "option selectedOption"
                      : "option"
                  }
                  onClick={() =>
                    setSelectedColour(
                      colour
                    )
                  }
                >
                  {colour}
                </button>

              ))}

            </div>


            <button
              className="addButton"
              onClick={addToCart}
            >
              Add to Cart
            </button>

          </div>

        </div>

      )}


      {/* CART */}

      {cartOpen && (

        <div className="cartBackground">

          <div className="cartPanel">

            <div className="cartHeader">

              <h2>
                Your Cart
              </h2>

              <button
                onClick={() =>
                  setCartOpen(false)
                }
              >
                ×
              </button>

            </div>


            {cart.length === 0 ? (

              <div className="emptyCart">
                Your cart is empty.
              </div>

            ) : (

              <>
                <div className="cartItems">

                  {cart.map((item) => (

                    <div
                      className="cartItem"
                      key={`${item.id}-${item.size}-${item.colour}`}
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div className="cartInfo">

                        <b>
                          {item.name}
                        </b>

                        <small>
                          Size: {item.size}
                        </small>

                        <small>
                          Colour: {item.colour}
                        </small>

                        <strong>
                          ₹{item.price}
                        </strong>


                        <div className="quantity">

                          <button
                            onClick={() =>
                              changeQuantity(
                                item.id,
                                item.size,
                                item.colour,
                                -1
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              changeQuantity(
                                item.id,
                                item.size,
                                item.colour,
                                1
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                        <button
                          className="remove"
                          onClick={() =>
                            removeItem(
                              item.id,
                              item.size,
                              item.colour
                            )
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ))}

                </div>


                {/* CUSTOMER DETAILS */}

                <div className="checkout">

                  <h3>
                    Delivery Details
                  </h3>

                  <input
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) =>
                      setCustomerName(
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Mobile Number"
                    value={customerPhone}
                    onChange={(e) =>
                      setCustomerPhone(
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    placeholder="Full Address"
                    value={customerAddress}
                    onChange={(e) =>
                      setCustomerAddress(
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="City"
                    value={customerCity}
                    onChange={(e) =>
                      setCustomerCity(
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Pincode"
                    value={customerPincode}
                    onChange={(e) =>
                      setCustomerPincode(
                        e.target.value
                      )
                    }
                  />


                  <div className="total">

                    <span>
                      Total
                    </span>

                    <strong>
                      ₹{totalAmount}
                    </strong>

                  </div>


                  <button
                    className="payButton"
                    onClick={proceedToPay}
                    disabled={paymentLoading}
                  >
                    {paymentLoading
                      ? "Opening Payment..."
                      : "Proceed to Pay"}
                  </button>

                </div>
              </>

            )}

          </div>

        </div>

      )}


      {/* FOOTER */}

      <footer>

        <b>
          🌸 Bee Girl Shopping
        </b>

        <span>
          Sarees • Kurtis • Lehengas
        </span>

        <span>
          📍 Anantapur, Andhra Pradesh
        </span>

        <span>
          © 2026 Bee Girl Shopping
        </span>

      </footer>


      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #faf6ff;
          color: #292330;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        button {
          cursor: pointer;
        }


        /* HEADER */

        .header {
          height: 58px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .brand {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .brand b {
          display: block;
          color: #7532bd;
          font-size: 12px;
        }

        .brand small {
          display: block;
          color: #777;
          font-size: 7px;
          margin-top: 2px;
        }

        .cartTop {
          border: 0;
          background: #7835c3;
          color: white;
          border-radius: 20px;
          padding: 8px 13px;
          font-size: 8px;
          font-weight: bold;
        }


        /* HERO */

        .hero {
          min-height: 260px;
          display: grid;
          grid-template-columns: 1fr 150px;
          gap: 18px;
          align-items: center;
          padding: 28px 25px;
          background:
            linear-gradient(
              110deg,
              #faedff,
              #edddfa
            );
        }

        .newCollection {
          font-size: 6px;
          color: #7834bd;
          letter-spacing: 2px;
          font-weight: bold;
        }

        .hero h1 {
          font-size: 38px;
          line-height: .92;
          font-weight: 400;
          margin: 9px 0;
        }

        .hero p {
          max-width: 380px;
          color: #817787;
          font-size: 7px;
          line-height: 1.6;
        }

        .purpleButton {
          border: 0;
          background: #7935c4;
          color: white;
          border-radius: 18px;
          padding: 8px 13px;
          font-size: 6px;
          font-weight: bold;
        }

        .heroImage {
          height: 175px;
          border-radius: 15px;
          overflow: hidden;
        }

        .heroImage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }


        /* LOCATION */

        .location {
          width: calc(100% - 35px);
          max-width: 600px;
          min-height: 58px;
          background: white;
          margin: 14px auto;
          border-radius: 12px;
          box-shadow: 0 4px 18px #00000010;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          text-align: center;
        }

        .location b,
        .location span {
          display: block;
        }

        .location b {
          font-size: 7px;
        }

        .location span {
          font-size: 6px;
          color: #888;
          margin-top: 3px;
        }

        .location a {
          background: #20b968;
          color: white;
          padding: 7px 11px;
          border-radius: 20px;
          text-decoration: none;
          font-size: 6px;
          font-weight: bold;
        }


        /* CATALOG */

        .catalog {
          max-width: 1100px;
          margin: auto;
          padding: 0 17px 45px;
        }

        .categories {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 6px;
          margin: 15px 0 25px;
        }

        .category {
          border: 1px solid #eee;
          background: white;
          border-radius: 20px;
          padding: 7px 13px;
          font-size: 6px;
          color: #555;
        }

        .category.active {
          background: #7935c4;
          color: white;
          border-color: #7935c4;
        }


        /* SECTIONS */

        .catalogSection {
          margin-bottom: 28px;
        }

        .sectionBanner {
          height: 105px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          background: #ddd;
        }

        .sectionBanner img,
        .emptyBanner {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .emptyBanner {
          background:
            linear-gradient(
              120deg,
              #c9c2ca,
              #aaa3ac
            );
        }

        .bannerShade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            #00000080,
            transparent
          );
        }

        .bannerText {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: white;
        }

        .bannerText h2 {
          margin: 0;
          font-size: 14px;
          font-weight: 400;
        }

        .bannerText p {
          margin: 5px 0 0;
          font-size: 6px;
        }

        .sectionHeading {
          text-align: center;
          margin: 15px 0 9px;
        }

        .sectionHeading h2 {
          margin: 0;
          font-size: 13px;
          font-weight: 500;
        }

        .sectionHeading p {
          margin: 4px;
          font-size: 6px;
          color: #aaa;
        }


        /* PRODUCTS */

        .products {
          width: 100%;
          max-width: 430px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .product {
          overflow: hidden;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 15px #00000012;
        }

        .productImage {
          height: 160px;
          background: #f2f2f2;
          position: relative;
        }

        .productImage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .heart {
          position: absolute;
          right: 5px;
          top: 5px;
          width: 20px;
          height: 20px;
          border: 0;
          background: white;
          border-radius: 50%;
          font-size: 13px;
        }

        .productDetails {
          padding: 7px;
        }

        .productDetails small {
          color: #7935c4;
          font-size: 5px;
        }

        .productDetails h3 {
          font-size: 6px;
          min-height: 18px;
          margin: 3px 0;
          font-weight: 500;
        }

        .productDetails strong {
          display: block;
          font-size: 9px;
          margin-bottom: 6px;
        }

        .selectButton {
          width: 100%;
          border: 0;
          border-radius: 11px;
          background: #7935c4;
          color: white;
          padding: 6px;
          font-size: 5px;
          line-height: 1.3;
          font-weight: bold;
        }

        .comingSoon {
          text-align: center;
          background: white;
          border-radius: 10px;
          padding: 25px 10px;
          color: #999;
          font-size: 8px;
        }


        /* PRODUCT MODAL */

        .modalBackground,
        .cartBackground {
          position: fixed;
          inset: 0;
          background: #00000070;
          z-index: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px;
        }

        .modal {
          width: 100%;
          max-width: 360px;
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 18px;
          padding: 18px;
          position: relative;
        }

        .modal > img {
          width: 100%;
          height: 230px;
          object-fit: cover;
          border-radius: 12px;
        }

        .close {
          position: absolute;
          right: 10px;
          top: 10px;
          width: 30px;
          height: 30px;
          border: 0;
          background: white;
          border-radius: 50%;
          font-size: 20px;
        }

        .modal h2 {
          font-size: 16px;
          margin: 12px 0 5px;
        }

        .modal > strong {
          color: #7935c4;
        }

        .modal label {
          display: block;
          font-size: 8px;
          font-weight: bold;
          margin-top: 15px;
          margin-bottom: 7px;
        }

        .options {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .option {
          background: white;
          border: 1px solid #ddd;
          border-radius: 15px;
          padding: 7px 12px;
          font-size: 7px;
        }

        .selectedOption {
          background: #7935c4;
          color: white;
          border-color: #7935c4;
        }

        .addButton,
        .payButton {
          width: 100%;
          border: 0;
          border-radius: 20px;
          background: #7935c4;
          color: white;
          padding: 12px;
          margin-top: 18px;
          font-weight: bold;
          font-size: 9px;
        }


        /* CART */

        .cartPanel {
          width: 100%;
          max-width: 450px;
          max-height: 94vh;
          overflow-y: auto;
          background: #faf7ff;
          border-radius: 18px;
          padding: 16px;
        }

        .cartHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cartHeader h2 {
          margin: 0;
          font-size: 18px;
        }

        .cartHeader button {
          border: 0;
          background: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          font-size: 20px;
        }

        .emptyCart {
          text-align: center;
          padding: 50px 10px;
          color: #888;
          font-size: 11px;
        }

        .cartItem {
          display: flex;
          gap: 10px;
          background: white;
          padding: 8px;
          margin-top: 9px;
          border-radius: 10px;
        }

        .cartItem img {
          width: 70px;
          height: 85px;
          object-fit: cover;
          border-radius: 7px;
        }

        .cartInfo {
          flex: 1;
        }

        .cartInfo b,
        .cartInfo small,
        .cartInfo strong {
          display: block;
        }

        .cartInfo b {
          font-size: 9px;
        }

        .cartInfo small {
          color: #888;
          font-size: 7px;
          margin-top: 3px;
        }

        .cartInfo strong {
          font-size: 10px;
          margin-top: 4px;
        }

        .quantity {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 6px;
        }

        .quantity button {
          width: 24px;
          height: 24px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 50%;
        }

        .quantity span {
          font-size: 9px;
        }

        .remove {
          border: 0;
          background: transparent;
          color: #d33;
          font-size: 7px;
          margin-top: 4px;
        }


        /* CHECKOUT */

        .checkout {
          background: white;
          margin-top: 15px;
          border-radius: 12px;
          padding: 12px;
        }

        .checkout h3 {
          font-size: 12px;
          margin-top: 0;
        }

        .checkout input,
        .checkout textarea {
          width: 100%;
          border: 1px solid #e2dce8;
          border-radius: 8px;
          padding: 9px;
          margin-bottom: 8px;
          font-size: 8px;
          outline: none;
        }

        .checkout textarea {
          min-height: 60px;
          resize: vertical;
        }

        .total {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #eee;
        }

        .total span {
          font-size: 10px;
        }

        .total strong {
          font-size: 13px;
          color: #7935c4;
        }

        .payButton:disabled {
          opacity: .6;
        }


        /* FOOTER */

        footer {
          background: #17132a;
          color: white;
          text-align: center;
          padding: 22px 10px;
        }

        footer b,
        footer span {
          display: block;
        }

        footer b {
          font-size: 8px;
        }

        footer span {
          color: #ddd;
          font-size: 6px;
          margin-top: 4px;
        }


        /* MOBILE */

        @media (max-width: 600px) {

          .hero {
            grid-template-columns: 1fr 135px;
            padding: 25px 18px;
          }

          .hero h1 {
            font-size: 29px;
          }

          .heroImage {
            height: 165px;
          }

          .location {
            gap: 10px;
          }

        }


        /* DESKTOP */

        @media (min-width: 700px) {

          .hero {
            grid-template-columns: 1fr 260px;
            padding: 40px 55px;
          }

          .hero h1 {
            font-size: 55px;
          }

          .heroImage {
            height: 260px;
          }

          .productImage {
            height: 220px;
          }

        }

      `}</style>

    </main>
  );
}
