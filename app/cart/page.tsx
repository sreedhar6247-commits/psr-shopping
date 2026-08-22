"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CART_KEY = "bee-girl-shopping-cart";

type CartItem = {
  id: number;
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

  const load = () => {
    try {
      const x = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      setCart(
        Array.isArray(x)
          ? x
          : []
      );
    } catch {
      setCart([]);
    }
  };

  useEffect(() => {
    load();

    window.addEventListener(
      "cart-updated",
      load
    );

    return () =>
      window.removeEventListener(
        "cart-updated",
        load
      );
  }, []);

  const save = (x: CartItem[]) => {
    setCart(x);

    localStorage.setItem(
      CART_KEY,
      JSON.stringify(x)
    );

    window.dispatchEvent(
      new Event("cart-updated")
    );
  };

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            Number(item.quantity || 1),
        0
      ),
    [cart]
  );

  const change = (
    index: number,
    delta: number
  ) => {
    const x = [...cart];

    x[index].quantity =
      Number(x[index].quantity || 1) +
      delta;

    if (x[index].quantity <= 0) {
      x.splice(index, 1);
    }

    save(x);
  };

  const remove = (index: number) => {
    const x = [...cart];

    x.splice(index, 1);

    save(x);
  };

  return (
    <main className="cartPage">

      {/* HEADER */}

      <header className="cartHeader">

        <Link href="/">
          ← Continue Shopping
        </Link>

        <b>
          🌸 Bee Girl Shopping
        </b>

        <Link href="/checkout">
          Checkout →
        </Link>

      </header>

      {/* CART */}

      <section className="cartContainer">

        <h1>
          Your Cart
        </h1>

        <p className="muted">
          Change quantity, remove products,
          and continue to secure Razorpay
          checkout.
        </p>

        {!cart.length ? (

          <div className="cartEmpty">

            <div>
              🛍️
            </div>

            <h2>
              Your cart is empty
            </h2>

            <Link
              href="/"
              className="primary"
            >
              SHOP NOW
            </Link>

          </div>

        ) : (

          <>

            {/* CART ITEMS */}

            <div className="cartList">

              {cart.map(
                (item, index) => (

                  <article
                    className="cartItem"
                    key={`${item.id}-${item.size}-${item.color}-${index}`}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="cartInfo">

                      <span className="category">
                        {item.category}
                      </span>

                      <h2>
                        {item.name}
                      </h2>

                      <p>
                        Size:{" "}
                        <b>
                          {item.size}
                        </b>

                        {" • "}

                        Colour:{" "}
                        <b>
                          {item.color}
                        </b>
                      </p>

                      <strong>
                        ₹
                        {Number(
                          item.price
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      {/* QUANTITY */}

                      <div className="qtyRow">

                        <button
                          onClick={() =>
                            change(
                              index,
                              -1
                            )
                          }
                        >
                          −
                        </button>

                        <b>
                          {item.quantity}
                        </b>

                        <button
                          onClick={() =>
                            change(
                              index,
                              1
                            )
                          }
                        >
                          +
                        </button>

                        {/* REMOVE */}

                        <button
                          className="remove"
                          onClick={() =>
                            remove(index)
                          }
                        >
                          🗑 Remove
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

            {/* CART SUMMARY */}

            <div className="cartSummary">

              <div>

                <small>
                  {cart.reduce(
                    (sum, item) =>
                      sum +
                      Number(
                        item.quantity || 1
                      ),
                    0
                  )}{" "}
                  item(s)
                </small>

                <h2>
                  Total: ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </h2>

              </div>

              <Link
                href="/checkout"
                className="primary"
              >
                PROCEED TO CHECKOUT
              </Link>

            </div>

          </>

        )}

      </section>

      {/* CART PAGE CSS */}

      <style jsx>{`

        .cartHeader {
          position: sticky;
          top: 0;
          z-index: 20;
          background: #fff;
          padding: 15px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #ead9df;
          box-shadow: 0 3px 15px rgba(59,23,41,.08);
        }

        .cartHeader a {
          color: #691d45;
          text-decoration: none;
          font-weight: 800;
          font-size: 12px;
        }

        .cartHeader b {
          font: 700 20px Georgia, serif;
          color: #691d45;
        }

        .cartContainer {
          max-width: 1000px;
          margin: auto;
          padding: 35px 18px 70px;
        }

        .cartContainer > h1 {
          text-align: center;
          font: 700 40px Georgia, serif;
          color: #4d1934;
          margin-bottom: 6px;
        }

        .cartContainer > .muted {
          text-align: center;
          margin-bottom: 28px;
        }

        .cartList {
          display: grid;
          gap: 13px;
        }

        .cartItem {
          display: flex;
          gap: 16px;
          padding: 14px;
          background: #fff;
          border: 1px solid #ead9df;
          border-radius: 18px;
          box-shadow: 0 6px 20px rgba(59,23,41,.06);
        }

        .cartItem img {
          width: 120px;
          height: 145px;
          object-fit: cover;
          border-radius: 12px;
        }

        .cartInfo {
          flex: 1;
        }

        .cartInfo h2 {
          font: 700 20px Georgia, serif;
          color: #4d1934;
          margin: 6px 0;
        }

        .cartInfo p {
          font-size: 12px;
          color: #806f78;
        }

        .cartInfo > strong {
          display: block;
          color: #691d45;
          font-size: 18px;
          margin: 10px 0;
        }

        .qtyRow {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .qtyRow button {
          width: 34px;
          height: 34px;
          border: 1px solid #dbcbd3;
          background: #fff;
          border-radius: 50%;
          color: #691d45;
          font-size: 18px;
        }

        .qtyRow .remove {
          width: auto;
          border: 0;
          border-radius: 18px;
          background: #fff0f3;
          color: #a10031;
          font-size: 12px;
          padding: 0 13px;
        }

        .cartSummary {
          margin-top: 18px;
          background: #fff;
          border: 1px solid #ead9df;
          border-radius: 18px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .cartSummary h2 {
          font: 700 26px Georgia, serif;
          color: #691d45;
          margin: 5px 0;
        }

        .cartEmpty {
          text-align: center;
          background: #fff;
          border: 1px solid #ead9df;
          border-radius: 18px;
          padding: 60px 20px;
        }

        .cartEmpty > div {
          font-size: 44px;
          margin-bottom: 12px;
        }

        .cartEmpty .primary {
          display: inline-block;
          margin-top: 15px;
          text-decoration: none;
        }

        @media(max-width:600px) {

          .cartHeader {
            padding: 12px 3%;
          }

          .cartHeader b {
            font-size: 15px;
          }

          .cartHeader a {
            font-size: 10px;
          }

          .cartItem {
            align-items: flex-start;
          }

          .cartItem img {
            width: 90px;
            height: 115px;
          }

          .cartInfo h2 {
            font-size: 16px;
          }

          .cartSummary {
            flex-direction: column;
            align-items: stretch;
          }

          .cartSummary .primary {
            text-align: center;
          }

          .qtyRow {
            flex-wrap: wrap;
          }

        }

      `}</style>

    </main>
  );
}
