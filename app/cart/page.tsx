"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
};

export default function CartPage() {

  const [cart, setCart] = useState<CartItem[]>([]);

  const [customerName, setCustomerName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [city, setCity] =
    useState("");

  const [pincode, setPincode] =
    useState("");

  const [message, setMessage] =
    useState("");


  const loadCart = () => {

    const raw =
      localStorage.getItem(
        "bee-girl-shopping-cart"
      );

    setCart(
      raw ? JSON.parse(raw) : []
    );
  };


  useEffect(() => {
    loadCart();
  }, []);


  const save = (items: CartItem[]) => {

    setCart(items);

    localStorage.setItem(
      "bee-girl-shopping-cart",
      JSON.stringify(items)
    );

    window.dispatchEvent(
      new Event("cart-updated")
    );
  };


  const changeQuantity = (
    index: number,
    amount: number
  ) => {

    const items = [...cart];

    items[index].quantity += amount;

    if (items[index].quantity <= 0) {
      items.splice(index, 1);
    }

    save(items);
  };


  const remove = (index: number) => {

    const items = [...cart];

    items.splice(index, 1);

    save(items);
  };


  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          item.price *
            item.quantity,
        0
      ),
    [cart]
  );


  const placeOrder = () => {

    if (!cart.length) {

      setMessage(
        "Your cart is empty."
      );

      return;
    }


    if (
      !customerName ||
      !phone ||
      !address ||
      !city ||
      !pincode
    ) {

      setMessage(
        "Please fill all customer details."
      );

      return;
    }


    const orderNumber =
      "BGS" +
      Date.now()
        .toString()
        .slice(-7);


    setMessage(
      `Order ${orderNumber} created successfully! Total: ₹${total}`
    );
  };


  return (

    <main className="cartPage">

      {/* HEADER */}

      <header>

        <Link
          href="/"
          className="back"
        >
          ← Continue Shopping
        </Link>

        <b>
          🛍️ Bee Girl Shopping
        </b>

      </header>


      <section className="container">

        <h1>
          Your Cart
        </h1>

        <p className="sub">
          Review your selected products
          before placing your order.
        </p>


        {/* EMPTY CART */}

        {!cart.length ? (

          <div className="empty">

            <div className="emptyIcon">
              🛒
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Add some beautiful fashion
              items from our collection.
            </p>

            <Link
              href="/"
              className="shop"
            >
              Shop Now
            </Link>

          </div>

        ) : (

          <>

            {/* CART PRODUCTS */}

            <div className="cartList">

              {cart.map(
                (item, index) => (

                  <article
                    className="item"
                    key={`${item.id}-${item.size}-${item.color}`}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="itemInfo">

                      <small>
                        {item.category}
                      </small>

                      <h2>
                        {item.name}
                      </h2>

                      <p>
                        Size:
                        {" "}
                        <b>
                          {item.size}
                        </b>

                        {"   "}

                        Colour:
                        {" "}
                        <b>
                          {item.color}
                        </b>
                      </p>

                      <strong>
                        ₹{item.price}
                      </strong>


                      <div className="actions">

                        <button
                          onClick={() =>
                            changeQuantity(
                              index,
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
                              index,
                              1
                            )
                          }
                        >
                          +
                        </button>

                        <button
                          className="remove"
                          onClick={() =>
                            remove(index)
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>


            {/* CHECKOUT */}

            <div className="checkoutGrid">


              {/* CUSTOMER FORM */}

              <div className="form">

                <h2>
                  Delivery Details
                </h2>

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
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                />

                <textarea
                  placeholder="Full Address"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="City"
                  value={city}
                  onChange={(e) =>
                    setCity(
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) =>
                    setPincode(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* ORDER SUMMARY */}

              <div className="summary">

                <h2>
                  Order Summary
                </h2>


                <div className="row">

                  <span>
                    Items
                  </span>

                  <span>
                    {
                      cart.reduce(
                        (sum, item) =>
                          sum +
                          item.quantity,
                        0
                      )
                    }
                  </span>

                </div>


                <div className="row">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₹{total}
                  </span>

                </div>


                <div className="row">

                  <span>
                    Delivery
                  </span>

                  <span>
                    Free
                  </span>

                </div>


                <hr />


                <div className="total">

                  <span>
                    Total
                  </span>

                  <b>
                    ₹{total}
                  </b>

                </div>


                <button
                  className="order"
                  onClick={placeOrder}
                >
                  Place Order
                </button>


                <a
                  className="whatsapp"
                  href={`https://wa.me/919999999999?text=${encodeURIComponent(
                    `Hello Bee Girl Shopping, I want to order from my cart. Total: ₹${total}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  💬 Order on WhatsApp
                </a>


                {message && (

                  <div className="message">
                    {message}
                  </div>

                )}

              </div>

            </div>

          </>

        )}

      </section>


      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .cartPage {
          min-height: 100vh;
          background: #f8f3ff;
          color: #29202f;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        header {
          height: 58px;
          background: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 18px;
          box-shadow:
            0 1px 8px #0001;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .back {
          color: #7532c8;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
        }

        header b {
          color: #5423a5;
          font-size: 13px;
        }

        .container {
          max-width: 900px;
          margin: auto;
          padding:
            25px
            18px
            50px;
        }

        h1 {
          text-align: center;
          font-size: 28px;
          font-weight: 500;
          margin: 8px 0 4px;
        }

        .sub {
          text-align: center;
          color: #888;
          font-size: 10px;
          margin-bottom: 25px;
        }

        .empty {
          background: white;
          border-radius: 16px;
          padding: 45px 20px;
          text-align: center;
          box-shadow:
            0 4px 18px #00000010;
        }

        .emptyIcon {
          font-size: 40px;
        }

        .empty h2 {
          font-size: 18px;
        }

        .empty p {
          color: #888;
          font-size: 11px;
        }

        .shop,
        .order,
        .whatsapp {
          display: inline-block;
          border: 0;
          text-decoration: none;
          color: white;
          background: #7532c8;
          padding: 11px 20px;
          border-radius: 22px;
          font-weight: 700;
          font-size: 10px;
          cursor: pointer;
        }

        .cartList {
          display: grid;
          gap: 10px;
        }

        .item {
          background: white;
          border-radius: 14px;
          padding: 10px;
          display: flex;
          gap: 12px;
          box-shadow:
            0 3px 12px #0000000d;
        }

        .item img {
          width: 100px;
          height: 120px;
          object-fit: cover;
          border-radius: 10px;
        }

        .itemInfo {
          flex: 1;
        }

        .itemInfo small {
          color: #7532c8;
          font-size: 8px;
        }

        .itemInfo h2 {
          font-size: 13px;
          margin: 4px 0;
        }

        .itemInfo p {
          font-size: 9px;
          color: #777;
        }

        .itemInfo strong {
          font-size: 13px;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .actions button {
          border: 1px solid #ddd;
          background: white;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          cursor: pointer;
        }

        .actions span {
          font-size: 10px;
          font-weight: 700;
        }

        .actions .remove {
          width: auto;
          padding: 0 9px;
          border: 0;
          border-radius: 15px;
          color: #d33;
          font-size: 8px;
        }

        .checkoutGrid {
          display: grid;
          grid-template-columns:
            1.2fr .8fr;
          gap: 15px;
          margin-top: 20px;
        }

        .form,
        .summary {
          background: white;
          padding: 17px;
          border-radius: 14px;
          box-shadow:
            0 3px 12px #0000000d;
        }

        .form h2,
        .summary h2 {
          font-size: 15px;
          margin-top: 0;
        }

        input,
        textarea {
          width: 100%;
          border: 1px solid #e5e0ea;
          border-radius: 9px;
          padding: 10px;
          margin: 5px 0;
          font-size: 10px;
          outline: none;
        }

        textarea {
          min-height: 75px;
          resize: vertical;
        }

        .row,
        .total {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 10px;
          color: #666;
        }

        .total {
          font-size: 13px;
          color: #222;
        }

        .total b {
          color: #7532c8;
        }

        .order {
          width: 100%;
          margin-top: 10px;
        }

        .whatsapp {
          width: 100%;
          text-align: center;
          background: #27c968;
          margin-top: 8px;
        }

        .message {
          margin-top: 10px;
          padding: 9px;
          background: #f1e8ff;
          color: #6330a0;
          border-radius: 8px;
          font-size: 9px;
          text-align: center;
        }

        @media (max-width: 650px) {

          .checkoutGrid {
            grid-template-columns: 1fr;
          }

          .item img {
            width: 82px;
            height: 105px;
          }

          .itemInfo h2 {
            font-size: 11px;
          }

        }

      `}</style>

    </main>
  );
}
