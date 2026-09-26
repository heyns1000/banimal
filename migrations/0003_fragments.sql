-- Fragment distribution: named, versioned shared HTML (global footer first)
-- served live to WordPress sites and the ~105 non-WordPress repos instead of
-- being hand-copied per repo. See docs/manual/user-manual.html#fragments for
-- the full design and docs/atlas/seedwave-atlas.html entry 29.
--
-- Deliberately no "consumers" or "sites" table here — the Worker stays
-- pull-based and doesn't track who's fetching. The Seedwave Atlas is the
-- human-maintained inventory of adoption, not this database.
CREATE TABLE IF NOT EXISTS fragments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  version INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'staged', 'live')),
  html TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (name, version)
);

CREATE INDEX IF NOT EXISTS idx_fragments_name ON fragments(name);

-- Only one version per fragment name can be 'live' at a time — enforced by a
-- partial unique index rather than application logic, so promoting a new
-- version to live must demote the old one in the same transaction or the
-- write fails outright.
CREATE UNIQUE INDEX IF NOT EXISTS idx_fragments_one_live
  ON fragments(name)
  WHERE status = 'live';
