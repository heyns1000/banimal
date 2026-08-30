
CREATE TABLE wp_bridge_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  schema_version TEXT NOT NULL DEFAULT '1.0',
  occurred_at TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wp_bridge_events_type ON wp_bridge_events(event_type);
CREATE INDEX idx_wp_bridge_events_received ON wp_bridge_events(received_at);
