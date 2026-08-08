export default function CheckoutPage() {
  return (
    <main className="container">
      <h1>Checkout</h1>
      <p className="muted">Customer address and payment flow placeholder.</p>
      <form className="card" style={{ maxWidth: 650 }}>
        <p><input required placeholder="Full name" style={{width:"100%",padding:12}} /></p>
        <p><input required placeholder="Mobile number" style={{width:"100%",padding:12}} /></p>
        <p><textarea required placeholder="Delivery address" style={{width:"100%",padding:12,minHeight:100}} /></p>
        <p><input required placeholder="PIN code" style={{width:"100%",padding:12}} /></p>
        <p>UPI: <b>psrshopping@upi</b></p>
        <button className="button" type="submit">Place Order</button>
      </form>
    </main>
  );
}
