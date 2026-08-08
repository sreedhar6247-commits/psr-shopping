export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="container">
      <a href="/">← Back to PSR Shopping</a>
      <div className="card" style={{ marginTop: 24 }}>
        <div className="emoji">👗</div>
        <h1>Product {id}</h1>
        <p className="muted">Product details will come from PostgreSQL in the next phase.</p>
        <p className="price">₹0</p>
        <button className="button">Add to Cart</button>
      </div>
    </main>
  );
}
