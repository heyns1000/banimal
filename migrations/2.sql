
CREATE TABLE brand_systems (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  system_key TEXT NOT NULL UNIQUE,
  system_name TEXT NOT NULL,
  total_brands INTEGER DEFAULT 0,
  description TEXT,
  gradient_colors TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO brand_systems (system_key, system_name, total_brands, description, gradient_colors) VALUES
('faa', 'FAA™', 7344, 'Global Trade & Governance', 'from-yellow-400 to-amber-500'),
('hsomni', 'HSOMNI9000', 6219, 'Advanced AI & Mesh Network', 'from-purple-500 to-indigo-600'),
('seedwave', 'Seedwave', 150, 'Premium Sovereign Brands', 'from-green-500 to-emerald-600');

CREATE TABLE brand_tiers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tier_key TEXT NOT NULL UNIQUE,
  tier_name TEXT NOT NULL,
  gradient_colors TEXT,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO brand_tiers (tier_key, tier_name, gradient_colors, priority) VALUES
('sovereign', 'Sovereign', 'from-yellow-600 to-amber-700', 1),
('dynastic', 'Dynastic', 'from-purple-600 to-pink-600', 2),
('operational', 'Operational', 'from-blue-600 to-cyan-600', 3),
('market', 'Market', 'from-green-600 to-teal-600', 4),
('vaultmesh', 'VaultMesh', 'from-indigo-600 to-purple-600', 5);
