            "use client";

import { useState } from "react";

const products = [
  { id: 1, name: "Elegant Cotton Kurti", cat: "Kurtis", price: 799, img: "/products/kurti-1.jpg" },
  { id: 2, name: "Designer Anarkali Kurti", cat: "Kurtis", price: 1199, img: "/products/kurti-2.jpg" },
  { id: 3, name: "Beautiful Party Saree", cat: "Sarees", price: 999, img: "/products/kurti-3.jpg" },
  { id: 4, name: "Premium Silk Saree", cat: "Sarees", price: 1499, img: "/products/kurti-4.jpg" },
];

export default function Home() {
  const [cart, setCart] = useState<number[]>([]);

  const add = (id: number) => setCart([...cart, id]);

  return (
    <main>
      <header>
        <b>🌸 Bee Girl Shopping</b>
        <button>🛒 Cart ({cart.length})</button>
      </header>

      <section className="hero">
        <div>
          <small>✨ NEW COLLECTION ✨</small>
          <h1>Fashion<br />Made For You</h1>
          <p>Discover beautiful fashion for every occasion.</p>
          <button>Explore Collection →</button>
        </div>
        <img src="/products/kurti-2.jpg" />
      </section>

      <div className="cats">
        {["Kurtis", "Sarees", "Lehengas", "Night Wear"].map(x =>
          <span key={x}>{x}</span>
        )}
      </div>

      {["Kurtis", "Sarees"].map(cat => (
        <section className="section" key={cat}>
          <h2>{cat}</h2>
          <p>Choose your favourite style</p>

          <div className="grid">
            {products.filter(p => p.cat === cat).map(p => (
              <article key={p.id}>
                <img src={p.img} />
                <h3>{p.name}</h3>
                <b>₹{p.price}</b>
                <button onClick={() => add(p.id)}>
                  Select Size & Colour
                </button>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="banner">
        <h2>Graceful Fashion</h2>
        <p>Traditional beauty with a modern touch.</p>
      </section>

      <style jsx global>{`
        *{box-sizing:border-box}
        body{margin:0;background:#faf5ff;font-family:Arial;color:#292033}
        header{padding:14px 5%;background:#7137c8;color:white;
          display:flex;justify-content:space-between;align-items:center}
        button{border:0;border-radius:20px;padding:10px 15px;
          background:#7137c8;color:white;font-weight:bold}
        header button{background:white;color:#7137c8}
        .hero{max-width:900px;margin:auto;padding:35px 5%;
          display:flex;align-items:center;justify-content:space-between;
          gap:20px;background:#f0e6ff}
        .hero h1{font-size:42px;margin:12px 0}
        .hero p{color:#666}
        .hero img{width:38%;max-height:280px;object-fit:cover;border-radius:20px}
        .cats{display:flex;gap:10px;justify-content:center;
          flex-wrap:wrap;padding:25px 10px}
        .cats span{background:white;padding:9px 16px;border-radius:20px;
          box-shadow:0 2px 8px #ddd}
        .section{max-width:900px;margin:25px auto;padding:0 15px}
        .section h2{text-align:center;margin-bottom:3px}
        .section>p{text-align:center;color:#888}
        .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
        article{background:white;border-radius:14px;padding:8px;
          box-shadow:0 2px 10px #ddd}
        article img{width:100%;height:220px;object-fit:cover;border-radius:10px}
        article h3{font-size:14px;margin:8px 3px}
        article b{display:block;margin:5px 3px;color:#7137c8}
        article button{width:100%;margin-top:5px}
        .banner{margin:35px 15px;padding:30px;border-radius:18px;
          background:#ddd;text-align:left}
        @media(max-width:600px){
          .hero{padding:25px 20px}
          .hero h1{font-size:30px}
          .hero img{width:42%;height:180px}
          .grid{grid-template-columns:repeat(2,1fr);gap:10px}
          article img{height:170px}
          article h3{font-size:12px}
        }
      `}</style>
    </main>
  );
}
