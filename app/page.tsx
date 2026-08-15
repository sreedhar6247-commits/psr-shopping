"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";

const P=[
{id:1,n:"Elegant Cotton Kurti",c:"Kurtis",p:799,i:"/products/kurti-1.jpg"},
{id:2,n:"Designer Anarkali Kurti",c:"Kurtis",p:1199,i:"/products/kurti-2.jpg"},
{id:3,n:"Beautiful Party Saree",c:"Sarees",p:999,i:"/products/kurti-3.jpg"},
{id:4,n:"Premium Silk Saree",c:"Sarees",p:1499,i:"/products/kurti-4.jpg"},
{id:5,n:"Designer Lehenga",c:"Lehengas",p:2499,i:"/products/kurti-2.jpg"},
{id:6,n:"Comfort Night Wear",c:"Night Wear",p:699,i:"/products/kurti-1.jpg"}
];

export default function Home(){
 const r=useRouter();
 const [cart,setCart]=useState<any[]>([]);
 const [wish,setWish]=useState<number[]>([]);
 const [pick,setPick]=useState<any>(null);
 const [size,setSize]=useState("");
 const [color,setColor]=useState("");

 const add=()=>{
  if(!size||!color)return alert("Please select size and colour");
  const x={...pick,size,color,quantity:1};
  const old=JSON.parse(localStorage.getItem("bee-girl-shopping-cart")||"[]");
  localStorage.setItem("bee-girl-shopping-cart",JSON.stringify([...old,x]));
  setCart([...old,x]);setPick(null);alert("Added to cart");
 };

 return <main>
  <header>
   <b>🌸 Bee Girl Shopping</b>
   <nav>
    <button onClick={()=>setWish([])}>♡ Wishlist</button>
    <button onClick={()=>r.push("/checkout")}>🛒 Cart ({cart.length})</button>
   </nav>
  </header>

  <aside>
   <b>💬 Contact Support</b>
   <p>📞 +91 98765 43210</p>
   <p>💚 WhatsApp Support</p>
  </aside>

  <section className="hero">
   <div><small>✨ NEW COLLECTION ✨</small>
   <h1>Fashion Made For You</h1>
   <p>Beautiful Indian fashion for every occasion.</p>
   <button onClick={()=>document.getElementById("products")?.scrollIntoView()}>
    Explore Collection →
   </button></div>
   <img src="/products/kurti-2.jpg"/>
  </section>

  <div className="address">📍 Your Bee Girl Shopping<br/>
   Sai Nagar, 7th Cross, Anantapur<br/>
   <a href="https://wa.me/919876543210">💚 Chat on WhatsApp</a>
  </div>

  <div className="cats">
   {["Kurtis","Sarees","Lehengas","Night Wear"].map(x=>
    <a href={"#"+x} key={x}>{x}</a>)}
  </div>

  <div id="products">
   {["Kurtis","Sarees","Lehengas","Night Wear"].map(c=><section id={c} className="sec" key={c}>
    <h2>{c}</h2><p>Choose your favourite style</p>
    <div className="grid">
     {P.filter(x=>x.c==c).map(x=><article key={x.id}>
      <div className="pic">
       <img src={x.i}/><button onClick={()=>setWish(w=>w.includes(x.id)?w.filter(y=>y!=x.id):[...w,x.id])}>
        {wish.includes(x.id)?"♥":"♡"}
       </button>
      </div>
      <b>{x.n}</b><strong>₹{x.p}</strong>
      <button className="select" onClick={()=>setPick(x)}>Select Size & Colour</button>
     </article>)}
    </div>
   </section>)}
  </div>

  {pick&&<div className="modal"><div className="box">
   <button className="close" onClick={()=>setPick(null)}>×</button>
   <h2>{pick.n}</h2>
   <label>Size</label>
   <select value={size} onChange={e=>setSize(e.target.value)}>
    <option value="">Choose size</option><option>S</option><option>M</option>
    <option>L</option><option>XL</option><option>XXL</option>
   </select>
   <label>Colour</label>
   <select value={color} onChange={e=>setColor(e.target.value)}>
    <option value="">Choose colour</option><option>Red</option>
    <option>Pink</option><option>Blue</option><option>Black</option>
   </select>
   <button className="add" onClick={add}>Add to Cart • ₹{pick.p}</button>
  </div></div>}

  <style jsx global>{`
  *{box-sizing:border-box}body{margin:0;background:#fff8fc;color:#292333;font-family:Arial}
  header{position:sticky;top:0;z-index:5;background:#6d287d;color:white;padding:15px 5%;display:flex;justify-content:space-between;align-items:center}
  nav{display:flex;gap:8px}button,.cats a{border:0;border-radius:20px;padding:10px 14px;cursor:pointer;font-weight:bold}
  header button{background:white;color:#6d287d}
  aside{position:fixed;right:12px;top:95px;z-index:4;background:white;padding:12px;border-radius:14px;box-shadow:0 3px 15px #ddd;font-size:12px}
  aside p{margin:5px 0}.hero{max-width:1000px;margin:20px auto;padding:45px 6%;border-radius:25px;background:#f1e4ff;display:flex;align-items:center;justify-content:space-between;gap:25px}
  .hero h1{font-size:44px;margin:10px 0}.hero img{width:35%;height:280px;object-fit:cover;border-radius:20px}.hero button,.add,.select{background:#7435c2;color:white}
  .address{max-width:1000px;margin:15px auto;background:white;padding:15px;border-radius:15px;text-align:left;box-shadow:0 3px 15px #ddd}.address a{color:#159447}
  .cats{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:20px}.cats a{background:white;text-decoration:none;color:#6d287d;box-shadow:0 2px 8px #ddd}
  .sec{max-width:1000px;margin:45px auto;padding:0 15px}.sec h2{text-align:center}.sec>p{text-align:center;color:#888}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}article{background:white;padding:10px;border-radius:15px;box-shadow:0 3px 12px #ddd}.pic{position:relative}.pic img{width:100%;height:260px;object-fit:cover;border-radius:12px}.pic button{position:absolute;right:5px;top:5px;background:white;padding:7px}.select{width:100%;margin-top:8px}.select,.add{border-radius:18px}
  article strong{display:block;color:#7435c2;margin:7px 0}.modal{position:fixed;inset:0;background:#0008;z-index:10;display:grid;place-items:center;padding:20px}.box{background:white;padding:25px;border-radius:20px;width:min(400px,100%);position:relative}.close{position:absolute;right:10px;top:10px;background:#eee}.box select{width:100%;padding:12px;margin:6px 0 14px;border:1px solid #ddd;border-radius:10px}.box label{display:block}.add{width:100%;margin-top:8px}
  @media(max-width:600px){header{padding:12px}header b{font-size:13px}header button{padding:8px;font-size:11px}aside{position:relative;top:auto;right:auto;margin:10px 15px}.hero{margin:10px 15px;padding:25px 18px}.hero h1{font-size:30px}.hero img{width:42%;height:190px}.grid{grid-template-columns:repeat(2,1fr);gap:9px}.pic img{height:190px}.sec{margin:30px auto}.cats{gap:6px}.cats a{padding:8px;font-size:12px}}
  `}</style>
 </main>
}
