
CREATE TABLE orders (
  order_id TEXT PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'woocommerce',
  external_id TEXT,
  customer_email TEXT,
  total_zar INTEGER,
  currency TEXT DEFAULT 'ZAR',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'pending',
  wc_status_raw TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_source_external ON orders(source, external_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(customer_email);
