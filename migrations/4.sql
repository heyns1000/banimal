
CREATE TABLE licenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  license_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_usd INTEGER NOT NULL,
  tier TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'active',
  sync_time_ms INTEGER DEFAULT 80,
  repository_url TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  total_amount INTEGER DEFAULT 0,
  care_loop_amount INTEGER DEFAULT 0,
  grain_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  license_id INTEGER NOT NULL,
  price_usd INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE checkout_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  total_amount INTEGER NOT NULL,
  care_loop_amount INTEGER NOT NULL,
  grain_count INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'initiated',
  sync_time_ms INTEGER DEFAULT 80,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cart_items_session ON cart_items(session_id);
CREATE INDEX idx_checkout_transactions_session ON checkout_transactions(session_id);
