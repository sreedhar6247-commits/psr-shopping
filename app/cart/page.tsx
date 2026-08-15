"use client";
import{useEffect,useState}from"react";

export default function Cart(){
const[c,setC]=useState<any[]>([]);
const[p,setP]=useState("UPI");
const[name,setN]=useState("");
const[phone,setPh]=useState("");
const[address,setA]=useState("");

useEffect(()=>{
setC(JSON.parse(localStorage.getItem("bee-cart")||"[]"));
},[]);

const save=(x:any[])=>{
setC(x);
localStorage.setItem("bee-cart",JSON.stringify(x));
};

const change=(i:number,n:number)=>{
let x=[...c],q=(x[i].qty||1)+n;
if(q<1)x.splice(i,1);
else x[i].qty=q;
save(x);
};

const total=c.reduce((s,x)=>s+x.price*(x.qty||1),0);

const order=()=>{
if(!name||!phone||!address)
return alert("Please enter your name, phone and address");
if(!c.length)return alert("Your cart is empty");
alert(p==="COD"?"Order placed!":"Payment selected. Gateway can be connected next.");
};

return <main>
<header>
<b>🌸 Bee Girl Shopping</b>
<a href="/">← Continue Shopping</a>
</header>

<h1>🛒 My Cart</h1>

{!c.length?<h2 className="empty">Your cart is empty</h2>:
<>
{c.map((x,i)=><article key={i}>
<img src={x.img}/>
<div>
<h3>{x.name}</h3>
<p>Size: {x.size}<br/>Colour: {x.colour}</p>
<b>₹{x.price}</b>
<div className="qty">
<button onClick={()=>change(i,-1)}>−</button>
<span>{x.qty||1}</span>
<button onClick={()=>change(i,1)}>+</button>
<button onClick={()=>change(i,-(x.qty||1))}>Remove</button>
</div>
</div>
</article>)}

<section>
<h2>Total: ₹{total}</h2>

<input placeholder="Your Name" value={name}
onChange={e=>setN(e.target.value)}/>

<input placeholder="Phone Number" value={phone}
onChange={e=>setPh(e.target.value)}/>

<textarea placeholder="Delivery Address" value={address}
onChange={e=>setA(e.target.value)}/>

<h3>Payment Method</h3>

<label><input type="radio" checked={p==="UPI"}
onChange={()=>setP("UPI")}/> UPI</label>

<label><input type="radio" checked={p==="CARD"}
onChange={()=>setP("CARD")}/> Card</label>

<label><input type="radio" checked={p==="COD"}
onChange={()=>setP("COD")}/> Cash on Delivery</label>

<button className="pay" onClick={order}>
{p==="COD"?"Place Order":"Proceed to Payment"}
</button>
</section>
</>}

<style jsx global>{`
*{box-sizing:border-box}
body{margin:0;background:#fffafd;color:#292333;font-family:Arial}
header{padding:18px 6%;background:white;display:flex;
justify-content:space-between;border-bottom:1px solid #eee}
header a{color:#7634c7;text-decoration:none;font-weight:bold}
h1{text-align:center;margin:30px}
article,section{max-width:700px;margin:12px auto;background:white;
padding:18px;border-radius:15px;box-shadow:0 2px 10px #ddd}
article{display:flex;gap:15px}
article img{width:95px;height:115px;object-fit:cover;border-radius:10px}
.qty{display:flex;align-items:center;gap:7px;margin-top:12px}
button{padding:9px 12px;margin:3px;border:0;border-radius:8px;
background:#7634c7;color:white}
.qty span{font-weight:bold}
input,textarea{width:100%;padding:11px;margin:6px 0;
border:1px solid #ddd;border-radius:8px}
textarea{height:80px}
.pay{width:100%;padding:14px;border-radius:25px;margin-top:12px}
label{display:block;margin:12px 0}
.empty{text-align:center;color:#888}
@media(max-width:600px){
article{margin:10px}
article img{width:80px;height:100px}
h1{font-size:27px}
}
`}</style>
</main>
}
