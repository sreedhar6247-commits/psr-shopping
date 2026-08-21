"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem("bee-girl-shopping-cart") || "[]");
      setCart(Array.isArray(saved) ? saved : []);
    } catch {
      setCart([]);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  function saveCart(updated: CartItem[]) {
    setCart(updated);
    localStorage.setItem("bee-girl-shopping-cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
  }

  function changeQuantity(index: number, amount: number) {
    const updated = [...cart];
    updated[index].quantity = Number(updated[index].quantity || 1) + amount;
    if (updated[index].quantity <= 0) updated.splice(index, 1);
    saveCart(updated);
  }

  function removeItem(index: number) {
    const updated = [...cart];
    updated.splice(index, 1);
    saveCart(updated);
  }

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity || 1), 0),
    [cart]
  );

  return (
    <main className="cartPage">
      <style jsx global>{`
        *{box-sizing:border-box}body{margin:0;background:#fbf7fa;color:#281a23;font-family:Arial,Helvetica,sans-serif}.cartHeader{position:sticky;top:0;z-index:20;background:#fff;border-bottom:1px solid #ead9df;padding:14px 5%;display:flex;justify-content:space-between;align-items:center;box-shadow:0 3px 15px rgba(59,23,41,.08)}.back{color:#691d45;text-decoration:none;font-weight:800;font-size:12px}.cartBrand{font:700 20px Georgia,serif;color:#691d45}.container{max-width:1000px;margin:auto;padding:30px 18px 60px}.title{text-align:center;font:700 38px Georgia,serif;color:#4d1934;margin:5px 0}.sub{text-align:center;color:#806f78;margin:0 0 28px;font-size:13px}.empty,.item,.summary{background:#fff;border:1px solid #ead9df;border-radius:18px;box-shadow:0 6px 20px rgba(59,23,41,.07)}.empty{text-align:center;padding:55px 20px}.shopButton,.checkoutButton{display:inline-block;background:#691d45;color:#fff;text-decoration:none;border:0;padding:13px 22px;border-radius:26px;font-weight:800;cursor:pointer}.cartList{display:grid;gap:12px}.item{display:flex;gap:16px;padding:13px}.item img{width:105px;height:125px;object-fit:cover;border-radius:12px;background:#f4e9ee}.itemInfo{flex:1}.category{color:#9b5274;font-size:11px;font-weight:800}.item h2{font:700 19px Georgia,serif;color:#4d1934;margin:6px 0}.variant{color:#77666f;font-size:12px}.price{color:#691d45;font-weight:800;margin:10px 0}.actions{display:flex;align-items:center;gap:8px}.qty{width:34px;height:34px;border:1px solid #dac8d1;background:#fff;border-radius:50%;font-size:18px;cursor:pointer;color:#691d45}.remove{border:0;background:#fff0f3;color:#b0002d;padding:9px 12px;border-radius:18px;cursor:pointer;font-weight:700}.summary{margin-top:18px;padding:20px;display:flex;align-items:center;justify-content:space-between;gap:20px}.summary small{color:#7d6c75}.total{font:700 24px Georgia,serif;color:#691d45}@media(max-width:600px){.cartHeader{padding:12px 4%}.cartBrand{font-size:16px}.item{align-items:flex-start}.item img{width:82px;height:105px}.item h2{font-size:16px}.summary{flex-direction:column;align-items:stretch}.checkoutButton{text-align:center}}
      `}</style>

      <header className="cartHeader">
        <Link href="/" className="back">← Continue Shopping</Link>
        <div className="cartBrand">🌸 Bee Girl Shopping</div>
      </header>

      <section className="container">
        <h1 className="title">Your Cart</h1>
        <p className="sub">Adjust quantities, remove items, and continue to secure checkout.</p>

        {cart.length === 0 ? (
          <div className="empty">
            <div style={{ fontSize: 42 }}>🛍️</div>
            <h2>Your cart is empty</h2>
            <p style={{ color: "#806f78" }}>Choose something beautiful from Bee Girl Shopping.</p>
            <Link href="/" className="shopButton">SHOP NOW</Link>
          </div>
        ) : (
          <>
            <div className="cartList">
              {cart.map((item, index) => (
                <article className="item" key={`${item.id}-${item.size}-${item.color}-${index}`}>
                  <img src={item.image} alt={item.name} onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
                  <div className="itemInfo">
                    <div className="category">{item.category}</div>
                    <h2>{item.name}</h2>
                    <div className="variant">Size: <b>{item.size}</b> • Colour: <b>{item.color}</b></div>
                    <div className="price">₹{Number(item.price).toLocaleString("en-IN")}</div>
                    <div className="actions">
                      <button className="qty" onClick={() => changeQuantity(index, -1)} aria-label="Decrease quantity">−</button>
                      <b>{item.quantity}</b>
                      <button className="qty" onClick={() => changeQuantity(index, 1)} aria-label="Increase quantity">+</button>
                      <button className="remove" onClick={() => removeItem(index)}>🗑 Remove</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="summary">
              <div><small>{cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0)} item(s) • Delivery calculated at checkout</small><div className="total">Total: ₹{total.toLocaleString("en-IN")}</div></div>
              <Link href="/checkout" className="checkoutButton">PROCEED TO CHECKOUT →</Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
