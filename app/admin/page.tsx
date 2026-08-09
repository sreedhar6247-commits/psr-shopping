const demoOrders = [
  { id: "BEG-1001", customer: "Demo Customer", total: 1299, status: "New" }
];

export default function AdminPage() {
  return (
    <main className="container">
      <h1>BEG Shopping Admin</h1>
      <p className="muted">Starter dashboard. Secure authentication must be added before production.</p>
      {demoOrders.map((o) => (
        <div className="card" key={o.id} style={{ marginTop: 16 }}>
          <b>{o.id}</b><p>{o.customer}</p><p>₹{o.total} • {o.status}</p>
        </div>
      ))}
    </main>
  );
}
