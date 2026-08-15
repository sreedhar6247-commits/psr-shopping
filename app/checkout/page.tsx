"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type CartItem = {
  id: number;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCart();

    if (!document.getElementById("razorpay-script")) {
      const script = document.createElement("script");

      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      document.body.appendChild(script);
    }
  }, []);

  function loadCart() {
    try {
      const saved = JSON.parse(
        localStorage.getItem("bee-girl-shopping-cart") || "[]"
      );

      setCart(saved);
    } catch {
      setCart([]);
    }
  }

  function saveCart(updated: CartItem[]) {
    setCart(updated);

    localStorage.setItem(
      "bee-girl-shopping-cart",
      JSON.stringify(updated)
    );
  }

  function increase(index: number) {
    const updated = [...cart];

    updated[index].quantity += 1;

    saveCart(updated);
  }

  function decrease(index: number) {
    const updated = [...cart];

    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
    } else {
      updated.splice(index, 1);
    }

    saveCart(updated);
  }

  function removeItem(index: number) {
    const updated = [...cart];

    updated.splice(index, 1);

    saveCart(updated);
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  async function startPayment() {
    setMessage("");

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim())) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!address.trim()) {
      setMessage("Please enter your delivery address.");
      return;
    }

    if (!city.trim()) {
      setMessage("Please enter your city.");
      return;
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      setMessage("Please enter a valid 6-digit pincode.");
      return;
    }

    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to create payment order."
        );
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay is still loading. Please try again."
        );
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Bee Girl Shopping",
        description: "Women's Clothing Order",
        order_id: data.orderId,

        prefill: {
          name: name.trim(),
          contact: phone.trim(),
        },

        notes: {
          customer_name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
        },

        theme: {
          color: "#7137c8",
        },

        handler: async function (payment: any) {
          try {
            const verify = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: payment.razorpay_order_id,
                razorpay_payment_id: payment.razorpay_payment_id,
                razorpay_signature: payment.razorpay_signature,
              }),
            });

            const verifyData = await verify.json();

            if (!verify.ok) {
              throw new Error(
                verifyData?.error || "Payment verification failed."
              );
            }

            setCart([]);

            localStorage.removeItem("bee-girl-shopping-cart");

            alert(
              "✅ Payment successful! Your order has been placed."
            );

            window.location.href = "/";
          } catch (error: any) {
            setMessage(
              error?.message || "Payment verification failed."
            );
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function () {
        setMessage(
          "Payment failed. Please try another payment method."
        );

        setLoading(false);
      });

      razorpay.open();
    } catch (error: any) {
      setMessage(
        error?.message || "Unable to start payment."
      );

      setLoading(false);
    }
  }

  return (
    <main>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #f8f5ff;
          color: #18182b;
        }

        .header {
          background: #7137c8;
          color: white;
          padding: 18px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header h2 {
          margin: 0;
        }

        .back {
          background: white;
          color: #7137c8;
          border: 0;
          padding: 10px 16px;
          border-radius: 22px;
          cursor: pointer;
          font-weight: bold;
        }

        .container {
          max-width: 850px;
          margin: 25px auto;
          padding: 0 15px;
        }

        .container h1 {
          margin-bottom: 20px;
        }

        .box {
          background: white;
          padding: 20px;
          border-radius: 22px;
          margin-bottom: 20px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }

        .item {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }

        .item:last-child {
          border-bottom: 0;
        }

        .details {
          flex: 1;
        }

        .details h3 {
          margin: 0 0 8px;
        }

        .details div {
          margin: 5px 0;
        }

        .price {
          color: #7137c8;
          font-weight: bold;
          font-size: 18px;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .qty {
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 10px;
          background: #f0eaff;
          color: #7137c8;
          font-size: 20px;
          cursor: pointer;
        }

        .remove {
          border: 0;
          background: #fff0f0;
          color: #d00000;
          padding: 9px 12px;
          border-radius: 10px;
          cursor: pointer;
        }

        label {
          display: block;
          margin-top: 12px;
          font-weight: bold;
        }

        input,
        textarea {
          width: 100%;
          padding: 13px;
          margin-top: 7px;
          margin-bottom: 13px;
          border: 1px solid #ddd;
          border-radius: 12px;
          font-size: 15px;
          font-family: Arial, sans-serif;
        }

        textarea {
          min-height: 80px;
          resize: vertical;
        }

        .pay {
          width: 100%;
          border: 0;
          background: #7137c8;
          color: white;
          padding: 17px;
          border-radius: 28px;
          font-size: 17px;
          font-weight: bold;
          cursor: pointer;
        }

        .pay:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .total {
          font-size: 24px;
          font-weight: bold;
          color: #7137c8;
          text-align: right;
          margin-top: 20px;
        }

        .error {
          color: #d00000;
          background: #fff0f0;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .empty {
          text-align: center;
          padding: 60px 20px;
        }

        @media (max-width: 600px) {
          .item {
            align-items: flex-start;
            flex-direction: column;
          }

          .controls {
            width: 100%;
            justify-content: space-between;
          }

          .header {
            gap: 10px;
          }

          .header h2 {
            font-size: 18px;
          }
        }
      `}</style>

      <header className="header">
        <h2>🌸 Bee Girl Shopping</h2>

        <button
          className="back"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          ← Continue Shopping
        </button>
      </header>

      <div className="container">
        <h1>🛒 Your Cart</h1>

        {cart.length === 0 ? (
          <div className="box empty">
            <h2>Your cart is empty</h2>

            <button
              className="pay"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Shop Now
            </button>
          </div>
        ) : (
          <>
            <div className="box">
              {cart.map((item, index) => (
                <div
                  className="item"
                  key={`${item.id}-${item.size}-${item.color}-${index}`}
                >
                  <div className="details">
                    <h3>{item.name}</h3>

                    <div>
                      Size: <b>{item.size}</b>
                    </div>

                    <div>
                      Colour: <b>{item.color}</b>
                    </div>

                    <div className="price">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="controls">
                    <button
                      className="qty"
                      onClick={() => decrease(index)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <b>{item.quantity}</b>

                    <button
                      className="qty"
                      onClick={() => increase(index)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>

                    <button
                      className="remove"
                      onClick={() => removeItem(index)}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="total">
                Total: ₹{total.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="box">
              <h2>Delivery Details</h2>

              {message && (
                <div className="error">
                  {message}
                </div>
              )}

              <label htmlFor="name">
                Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
                placeholder="10-digit mobile number"
              />

              <label htmlFor="address">
                Delivery Address
              </label>

              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete delivery address"
              />

              <label htmlFor="city">
                City
              </label>

              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
              />

              <label htmlFor="pincode">
                Pincode
              </label>

              <input
                id="pincode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(e) =>
                  setPincode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                placeholder="6-digit pincode"
              />

              <button
                className="pay"
                onClick={startPayment}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : `Pay ₹${total.toLocaleString("en-IN")}`}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
