"use client";
import{useState}from"react";

const products=[
{id:1,name:"Elegant Cotton Kurti",cat:"Kurtis",price:799,img:"/products/kurti-1.jpg"},
{id:2,name:"Designer Anarkali Kurti",cat:"Kurtis",price:1199,img:"/products/kurti-2.jpg"},
{id:3,name:"Beautiful Party Saree",cat:"Sarees",price:999,img:"/products/kurti-3.jpg"},
{id:4,name:"Premium Silk Saree",cat:"Sarees",price:1499,img:"/products/kurti-4.jpg"},
{id:5,name:"Designer Lehenga",cat:"Lehengas",price:2499,img:"/products/kurti-2.jpg"},
{id:6,name:"Bridal Lehenga",cat:"Lehengas",price:2999,img:"/products/kurti-3.jpg"},
{id:7,name:"Comfort Night Wear",cat:"Night Wear",price:699,img:"/products/kurti-1.jpg"},
{id:8,name:"Soft Cotton Night Wear",cat:"Night Wear",price:749,img:"/products/kurti-4.jpg"}
];

export default function Home(){
const[selected,setSelected]=useState<any>(null);
const[size,setSize]=useState("");
const[colour,setColour]=useState("");
const[wish,setWish]=useState<number[]>([]);

const add=()=>{
if(!size||!colour)return alert("Please select size and colour");
const cart=JSON.parse(localStorage.getItem("bee-cart")||"[]");
cart.push({...selected,size,colour,qty:1});
localStorage.setItem("bee-cart",JSON.stringify(cart));
setSelected(null);setSize("");setColour("");
alert("Added to cart!");
};

return <main>

<header>
<b>🌸 Bee Girl Shopping</b>
<div>
<a href="#wishlist">♡ Wishlist ({wish.length})</a>
<a href="/cart">🛒 Cart</a>
</div>
</header>

<div className="support">
💬 <b>Contact Support</b><br/>
📞 +91 98765 43210<br/>
💚 WhatsApp Support
</div>

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
📍 <b>Bee Girl Shopping</b><br/>
Sai Nagar, 7th Cross, Anantapur<br/>
💚 WhatsApp Support
</div>

<nav>
{["Kurtis","Sarees","Lehengas","Night Wear"].map(x=>
<a href={"#"+x.replace(" ","")} key={x}>{x}</a>)}
</nav>

<div id="shop">
{["Kurtis","Sarees","Lehengas","Night Wear"].map(cat=>
<section className="section" id={cat.replace(" ","")} key={cat}>
<h2>{cat}</h2>
<p>Choose your favourite style</p>

<div className="grid">
{products.filter(p=>p.cat===cat).map(p=>
<article key={p.id}>
<div className="pic">
<img src={p.img}/>
<button className="heart"
onClick={()=>setWish(w=>w.includes(p.id)?
w.filter(x=>x!==p.id):[...w,p.id])}>
{wish.includes(p.id)?"♥":"♡"}
</button>
</div>

<h3>{p.name}</h3>
<b>₹{p.price}</b>

<button className="select"
onClick={()=>setSelected(p)}>
Select Size & Colour
</button>
</article>
)}
</div>
</section>
)}
</div>

<footer id="wishlist">
<h3>♡ Wishlist</h3>
<p>{wish.length?`${wish.length} item(s) saved`:"Your wishlist is empty"}</p>
<p>📍 Sai Nagar, 7th Cross, Anantapur</p>
</footer>

{selected&&
<div className="modal">
<div className="box">

<button className="close"
onClick={()=>setSelected(null)}>✕</button>

<h2>{selected.name}</h2>

<select value={size}
onChange={e=>setSize(e.target.value)}>
<option value="">Select Size</option>
<option>S</option>
<option>M</option>
<option>L</option>
<option>XL</option>
<option>XXL</option>
</select>

<select value={colour}
onChange={e=>setColour(e.target.value)}>
<option value="">Select Colour</option>
<option>Black</option>
<option>Blue</option>
<option>Pink</option>
<option>Red</option>
<option>Green</option>
</select>

<button className="add" onClick={add}>
🛒 Add to Cart
</button>

</div>
</div>}

<style jsx global>{`

*{box-sizing:border-box}

body{
margin:0;
background:#fffafd;
color:#292333;
font-family:Arial
}

header{
padding:16px 6%;
background:white;
display:flex;
justify-content:space-between;
align-items:center;
border-bottom:1px solid #eee;
position:sticky;
top:0;
z-index:5
}

header a{
margin-left:8px;
padding:10px 15px;
border-radius:22px;
background:white;
box-shadow:0 2px 8px #ddd;
color:#7028a0;
text-decoration:none;
font-weight:bold
}

.support{
position:fixed;
right:15px;
top:78px;
background:white;
padding:13px;
border-radius:15px;
box-shadow:0 3px 15px #ccc;
z-index:6;
font-size:13px
}

.hero{
max-width:1200px;
margin:25px auto;
padding:55px 6%;
display:flex;
align-items:center;
justify-content:space-between;
background:#f4e7ff;
border-radius:25px
}

.hero h1{
font-size:48px;
margin:12px 0
}

.hero a,.select,.add{
background:#7634c7;
color:white;
padding:12px 20px;
border:0;
border-radius:25px;
font-weight:bold;
text-decoration:none;
display:inline-block
}

.hero img{
width:36%;
height:300px;
object-fit:cover;
border-radius:20px
}

.address{
max-width:1200px;
margin:20px auto;
padding:18px;
background:white;
border-radius:15px;
box-shadow:0 2px 12px #ddd
}

nav{
display:flex;
justify-content:center;
gap:10px;
flex-wrap:wrap;
margin:25px
}

nav a{
padding:11px 18px;
border-radius:22px;
background:white;
color:#7028a0;
text-decoration:none;
font-weight:bold;
box-shadow:0 2px 8px #ddd
}

.section{
max-width:1200px;
margin:50px auto
}

.section h2{
text-align:center;
margin-bottom:5px
}

.section>p{
text-align:center;
color:#888
}

.grid{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:18px
}

article{
background:white;
padding:10px;
border-radius:15px;
box-shadow:0 2px 12px #ddd
}

.pic{
position:relative
}

.pic img{
width:100%;
height:260px;
object-fit:cover;
border-radius:10px
}

.heart{
position:absolute;
right:8px;
top:8px;
border:0;
background:white;
border-radius:50%;
font-size:20px;
width:36px;
height:36px
}

article h3{
font-size:15px
}

article>b{
display:block;
color:#7028a0;
margin:8px 0
}

.select{
width:100%
}

footer{
margin-top:50px;
padding:35px 6%;
background:#f8efff
}

.modal{
position:fixed;
inset:0;
background:#0008;
display:grid;
place-items:center;
z-index:20
}

.box{
background:white;
padding:25px;
border-radius:20px;
width:min(90%,380px)
}

.close{
float:right;
border:0;
background:none;
font-size:20px
}

.box select{
width:100%;
padding:13px;
margin:8px 0;
border:1px solid #ddd;
border-radius:10px
}

.add{
width:100%;
margin-top:8px
}

@media(max-width:700px){

.hero{
margin:12px;
padding:30px 18px
}

.hero h1{
font-size:31px
}

.hero img{
width:40%;
height:190px
}

.grid{
grid-template-columns:repeat(2,1fr);
gap:10px;
padding:0 10px
}

.pic img{
height:190px
}

.section{
margin:35px auto
}

.support{
position:relative;
top:auto;
right:auto;
margin:10px
}

header a{
padding:8px;
font-size:11px
}

}
`}</style>

</main>
}
