"use client";
import{useEffect,useState}from"react";
import Link from"next/link";

const products=[
{id:1,name:"Elegant Cotton Kurti",cat:"Kurtis",price:799,img:"/products/kurti-1.jpg"},
{id:2,name:"Designer Anarkali Kurti",cat:"Kurtis",price:1199,img:"/products/kurti-2.jpg"},
{id:3,name:"Beautiful Party Saree",cat:"Sarees",price:999,img:"/products/kurti-3.jpg"},
{id:4,name:"Premium Silk Saree",cat:"Sarees",price:1499,img:"/products/kurti-4.jpg"},
{id:5,name:"Designer Lehenga",cat:"Lehengas",price:2499,img:"/products/kurti-2.jpg"},
{id:6,name:"Bridal Lehenga",cat:"Lehengas",price:2999,img:"/products/kurti-3.jpg"},
{id:7,name:"Comfort Night Suit",cat:"Night Wear",price:699,img:"/products/kurti-1.jpg"},
{id:8,name:"Soft Cotton Night Wear",cat:"Night Wear",price:749,img:"/products/kurti-4.jpg"}
];

export default function Home(){
const[cart,setCart]=useState<any[]>([]);
const[selected,setSelected]=useState<any>(null);
const[size,setSize]=useState("");
const[colour,setColour]=useState("");
const[wish,setWish]=useState<number[]>([]);

useEffect(()=>{
setCart(JSON.parse(localStorage.getItem("bee-cart")||"[]"));
setWish(JSON.parse(localStorage.getItem("bee-wish")||"[]"));
},[]);

const add=()=>{
if(!size||!colour)return alert("Please select size and colour");
const item={...selected,size,colour,qty:1};
const old=JSON.parse(localStorage.getItem("bee-cart")||"[]");
localStorage.setItem("bee-cart",JSON.stringify([...old,item]));
setCart([...old,item]);setSelected(null);setSize("");setColour("");
alert("Added to cart!");
};

const toggleWish=(id:number)=>{
const w=wish.includes(id)?wish.filter(x=>x!==id):[...wish,id];
setWish(w);localStorage.setItem("bee-wish",JSON.stringify(w));
};

return <main>
<header>
<b>🌸 Bee Girl Shopping</b>
<div>
<Link href="#wishlist">♡ Wishlist ({wish.length})</Link>
<Link href="/cart">🛒 Cart ({cart.reduce((a,p)=>a+p.qty,0)})</Link>
</div>
</header>

<div className="support">💬 <b>Contact Support</b><br/>📞 +91 98765 43210<br/>💚 WhatsApp Support</div>

<section className="hero">
<div><small>✨ NEW COLLECTION ✨</small>
<h1>Fashion Made For You</h1>
<p>Beautiful Indian fashion for every occasion.</p>
<button onClick={()=>document.getElementById("products")?.scrollIntoView()}>Explore Collection →</button>
</div>
<img src="/products/kurti-2.jpg"/>
</section>

<div className="address">
📍 <b>Your Bee Girl Shopping</b><br/>
Sai Nagar, 7th Cross, Anantapur<br/>
💚 Chat on WhatsApp
</div>

<nav>
{["Kurtis","Sarees","Lehengas","Night Wear"].map(x=>
<a key={x} href={"#"+x.replace(" ","")}>{x}</a>)}
</nav>

<div id="products">
{["Kurtis","Sarees","Lehengas","Night Wear"].map(cat=>
<section className="section" id={cat.replace(" ","")} key={cat}>
<h2>{cat}</h2><p>Choose your favourite style</p>
<div className="grid">
{products.filter(p=>p.cat===cat).map(p=>
<article key={p.id}>
<div className="pic">
<img src={p.img}/>
<button className="heart" onClick={()=>toggleWish(p.id)}>
{wish.includes(p.id)?"♥":"♡"}
</button>
</div>
<h3>{p.name}</h3><b>₹{p.price}</b>
<button onClick={()=>setSelected(p)}>Select Size & Colour</button>
</article>)}
</div>
</section>)}
</div>

<footer id="wishlist">
<h3>♡ Wishlist</h3>
<p>{wish.length?`${wish.length} item(s) saved`: "Your wishlist is empty"}</p>
<p>📍 Sai Nagar, 7th Cross, Anantapur</p>
</footer>

{selected&&<div className="modal">
<div className="box">
<h2>{selected.name}</h2>
<img src={selected.img}/>
<select value={size} onChange={e=>setSize(e.target.value)}>
<option value="">Select Size</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
</select>
<select value={colour} onChange={e=>setColour(e.target.value)}>
<option value="">Select Colour</option><option>Pink</option><option>Blue</option><option>Black</option><option>Red</option><option>Green</option>
</select>
<button onClick={add}>🛒 Add to Cart</button>
<button className="close" onClick={()=>setSelected(null)}>Cancel</button>
</div></div>}

<style jsx global>{`
*{box-sizing:border-box}body{margin:0;background:#fffafd;color:#292334;font-family:Arial,sans-serif}
header{height:70px;padding:15px 5%;display:flex;justify-content:space-between;align-items:center;background:white;border-bottom:1px solid #eee;position:sticky;top:0;z-index:5}
header b{font-size:18px}header div{display:flex;gap:10px}header a{background:#fff;padding:11px 16px;border-radius:25px;color:#7028a0;text-decoration:none;font-weight:bold;box-shadow:0 2px 8px #ddd}
.support{position:fixed;right:15px;top:82px;background:white;padding:12px;border-radius:15px;box-shadow:0 3px 15px #ccc;z-index:6;font-size:13px;line-height:22px}
.hero{max-width:1200px;margin:25px auto;padding:55px 6%;display:flex;align-items:center;justify-content:space-between;background:#f4e7ff;border-radius:25px}
.hero h1{font-size:48px;margin:12px 0}.hero p{font-size:17px}.hero button,article>button,.box button{border:0;background:#7634c7;color:white;padding:12px 20px;border-radius:25px;font-weight:bold;cursor:pointer}
.hero img{width:36%;height:300px;object-fit:cover;border-radius:20px}
.address{max-width:1200px;margin:20px auto;padding:18px;background:white;border-radius:15px;box-shadow:0 2px 12px #eee;line-height:25px}
nav{display:flex;justify-content:center;gap:12px;margin:25px;flex-wrap:wrap}nav a{padding:12px 20px;background:white;border-radius:25px;text-decoration:none;color:#7028a0;font-weight:bold;box-shadow:0 2px 8px #ddd}
.section{max-width:1200px;margin:55px auto}.section>h2{text-align:center;margin-bottom:4px}.section>p{text-align:center;color:#888}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:20px}
article{background:white;padding:10px;border-radius:15px;box-shadow:0 2px 12px #ddd;overflow:hidden}article img{width:100%;height:260px;object-fit:cover;border-radius:10px}
article h3{font-size:15px;margin:10px 2px 7px}article>b{display:block;color:#7028a0;margin-bottom:10px}.pic{position:relative}.heart{position:absolute;right:8px;top:8px;border:0;background:white;border-radius:50%;font-size:20px;width:36px;height:36px}
article>button{width:100%}footer{margin-top:60px;padding:35px 6%;background:#faf5ff}
.modal{position:fixed;inset:0;background:#0008;display:grid;place-items:center;z-index:20;padding:20px}.box{background:white;padding:22px;border-radius:20px;width:min(400px,100%);text-align:center}.box img{width:130px;height:150px;object-fit:cover;border-radius:10px}.box select,.box button{width:100%;margin-top:10px;padding:12px;border-radius:10px}.box select{border:1px solid #ddd}.box .close{background:#eee;color:#333}
@media(max-width:700px){header{height:auto;padding:12px}header b{font-size:14px}header a{padding:8px;font-size:12px}.support{top:70px;font-size:11px}.hero{margin:12px;padding:30px 20px}.hero h1{font-size:32px}.hero img{width:42%;height:190px}.address{margin:12px}.grid{grid-template-columns:repeat(2,1fr);gap:12px;padding:0 12px}.section{margin:40px auto}.section>h2{font-size:20px}article img{height:190px}article h3{font-size:13px}.hero p{font-size:13px}nav{margin:18px 8px}.grid article>b{font-size:14px}}
`}</style>
</main>
}
