CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_paise INTEGER NOT NULL,
  sizes JSONB NOT NULL DEFAULT '["S","M","L","XL"]'::jsonb,
  colours JSONB NOT NULL DEFAULT '["Pink","Blue"]'::jsonb,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  total_paise INTEGER NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'Razorpay',
  payment_status TEXT NOT NULL DEFAULT 'paid',
  order_status TEXT NOT NULL DEFAULT 'new',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_paise INTEGER NOT NULL,
  size TEXT NOT NULL DEFAULT '',
  colour TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
