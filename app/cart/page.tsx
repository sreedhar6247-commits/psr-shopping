"use client";

import Link from "next/link";

export default function CartPage() {
  return (
    <main style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🛒 Your Cart</h1>

      <p>Your cart is empty.</p>

      <Link href="/" style={{ color: "#e91e63" }}>
        ← Continue Shopping
      </Link>
    </main>
  );
}
