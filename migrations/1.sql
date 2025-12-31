
CREATE TABLE brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  system TEXT NOT NULL,
  tier TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  fee TEXT,
  royalty TEXT,
  division TEXT,
  vault_mesh_id TEXT,
  parent_id TEXT,
  use_phrase TEXT,
  subnodes TEXT,
  metadata TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brands_system ON brands(system);
CREATE INDEX idx_brands_tier ON brands(tier);
CREATE INDEX idx_brands_category ON brands(category);
CREATE INDEX idx_brands_name ON brands(name);
CREATE INDEX idx_brands_active ON brands(is_active);
