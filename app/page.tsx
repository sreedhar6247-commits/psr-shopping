"use client";
import {useState} from "react";

const products=[
{id:1,name:"Elegant Cotton Kurti",cat:"Kurtis",price:799,img:"/products/kurti-1.jpg"},
{id:2,name:"Designer Anarkali Kurti",cat:"Kurtis",price:1199,img:"/products/kurti-2.jpg"},
{id:3,name:"Beautiful Party Saree",cat:"Sarees",price:999,img:"/products/kurti-3.jpg"},
{id:4,name:"Premium Silk Saree",cat:"Sarees",price:1499,img:"/products/kurti-4.jpg"},
{id:5,name:"Designer Lehenga",cat:"Lehengas",price:2499,img:"/products/kurti-2.jpg"},
{id:6,name:"Comfort Night Wear",cat:"Night Wear",price:699,img:"/products/kurti-1.jpg"},
];

export default function Home(){
 const [wish,setWish]=useState<number[]>([]);
 const [selected,setSelected]=useState<any>(null);
 const [size,setSize]=useState("");
 const [colour,setColour]=useState("");

 const add=()=>{
  if(!size||!colour)return alert("Please select size and colour");
  const cart=JSON.parse(localStorage.getItem("bee-cart")||"[]");
  cart.push({...selected,size,colour});
  localStorage.setItem("bee-cart",JSON.stringify(cart));
  setSelected(null);
  alert("Added to cart!");
 };

 const cats=["Kurtis","Sarees","Lehengas","Night Wear"];

 return <main>
  <header>
   <b>🌸 Bee Girl Shopping</b>
   <nav>
    <a href="#wish">♡ Wishlist ({wish.length})</a>
    <a href="/cart">🛒 Cart</a>
   </nav>
  </header>

  <aside>
   💬 <b>Contact Support</b><br/>
   📞 +91 98765 43210<br/>
   💚 WhatsApp Support
  </aside>

  <section className="hero">
   <div>
    <small>✨ NEW COLLECTION ✨</small>
    <h1>Fashion Made For You</h1>
    <p>Beautiful Indian fashion for every occasion.</p>
    <a href="#shop">Explore Collection →</a>
   </div>
   <img src="/products/kurti-2.jpg"/>
  </section>

  <div className="address">
   📍 <b>Your Bee Girl Shopping</b><br/>
   Sai Nagar, 7th Cross, Anantapur<br/>
   💚 Chat on WhatsApp
  </div>

  <div className="tabs">
   {cats.map(x=><a href={"#"+x} key={x}>{x}</a>)}
  </div>

  <div id="shop">
   {cats.map(cat=><section className="section" id={cat} key={cat}>
    <h2>{cat}</h2>
    <p>Choose your favourite style</p>
    <div className="grid">
     {products.filter(p=>p.cat===cat).map(p=><article key={p.id}>
      <button className="heart" onClick={()=>
       setWish(w=>w.includes(p.id)?w.filter(x=>x!==p.id):[...w,p.id])
      }>{wish.includes(p.id)?"♥":"♡"}</button>
      <img src={p.img}/>
      <h3>{p.name}</h3>
      <b>₹{p.price}</b>
      <button className="select" onClick={()=>setSelected(p)}>
       Select Size & Colour
      </button>
     </article>)}
    </div>
   </section>)}
  </div>

  {selected&&<div className="modal">
   <div className="box">
    <button onClick={()=>setSelected(null)}>✕</button>
    <h2>{selected.name}</h2>
    <select value={size} onChange={e=>setSize(e.target.value)}>
     <option value="">Select Size</option>
     <option>S</option><option>M</option><option>L</option><option>XL</option>
    </select>
    <select value={colour} onChange={e=>setColour(e.target.value)}>
     <option value="">Select Colour</option>
     <option>Black</option><option>Blue</option><option>Pink</option>
     <option>Red</option><option>Green</option>
    </select>
    <button className="add" onClick={add}>🛒 Add to Cart</button>
   </div>
  </div>}

  <style jsx global>{`
   *{box-sizing:border-box}
   body{margin:0;background:#fffafc;color:#292333;font-family:Arial}
   header{height:65px;padding:15px 6%;display:flex;justify-content:space-between;
    align-items:center;background:#fff;border-bottom:1px solid #eee;position:sticky;top:0;z-index:5}
   nav{display:flex;gap:10px}a{color:inherit;text-decoration:none}
   nav a,.tabs a{padding:10px 16px;border-radius:25px;background:#fff;
    box-shadow:0 3px 12px #ddd;font-weight:bold}
   aside{position:fixed;right:15px;top:80px;background:#fff;padding:14px;
    border-radius:15px;box-shadow:0 5px 20px #ccc;z-index:6;font-size:13px}
   .hero{max-width:1200px;margin:30px auto;padding:55px 6%;display:flex;
    align-items:center;justify-content:space-between;background:#f5eaff;border-radius:25px}
   .hero h1{font-size:52px;margin:15px 0}.hero a,.add,.select{
    background:#7635c8;color:white;border:0;padding:12px 20px;border-radius:25px;font-weight:bold}
   .hero img{width:38%;max-height:350px;object-fit:cover;border-radius:20px}
   .address{max-width:1200px;margin:20px auto;padding:20px;background:#fff;
    border-radius:15px;box-shadow:0 3px 15px #ddd}
   .tabs{text-align:center;margin:30px}.tabs a{display:inline-block;margin:5px;color:#7635c8}
   .section{max-width:1200px;margin:45px auto}.section>h2{text-align:center;margin-bottom:0}
   .section>p{text-align:center;color:#888}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
   article{position:relative;background:#fff;padding:10px;border-radius:15px;
    box-shadow:0 3px 15px #ddd}article img{width:100%;height:270px;object-fit:cover;border-radius:10px}
   article h3{font-size:15px}.heart{position:absolute;right:15px;top:15px;border:0;
    background:white;border-radius:50%;font-size:20px}.select{width:100%;margin-top:12px}
   .modal{position:fixed;inset:0;background:#0008;display:grid;place-items:center;z-index:10}
   .box{background:white;padding:25px;border-radius:20px;width:min(90%,380px)}
   .box>button{float:right;border:0;background:none;font-size:20px}
   select{width:100%;padding:13px;margin:8px 0;border:1px solid #ddd;border-radius:10px}
   .add{width:100%;margin-top:10px}
   @media(max-width:700px){
    aside{top:75px;right:8px}.hero{margin:15px 8px;padding:30px 20px}
    .hero h1{font-size:34px}.hero img{width:42%}
    .grid{grid-template-columns:repeat(2,1fr);gap:10px}
    article img{height:210px}.section{margin:35px 10px}
    nav a{padding:8px;font-size:12px}.address{margin:15px 8px}
   }
  `}</style>
 </main>
}
