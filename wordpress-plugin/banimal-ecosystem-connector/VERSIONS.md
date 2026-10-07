# Banimal Ecosystem Connector: versions

**Agents: never take the connector from `main`.** `main` moves. Pull the release branch for the version you need; each one carries a `RELEASE.md` with its exact source commit, test result and zip checksum.

| Branch | Tag | Version | Edition | Verified |
|---|---|---|---|---|
| `release/banimal-connector-v5.2.0-premium` | `banimal-connector-v5.2.0-premium` | 5.2.0 | **Premium (current)**: standard plus the full Fruitful™ OmniGrid™ app at `/fruitful-app/` | 2026-10-07 PASS |
| `release/banimal-connector-v5.1.1-standard` | `banimal-connector-v5.1.1-standard` | 5.1.1 + 5 Sep 2026 security patch (`6563ae1`) | **Standard** | 2026-10-07 PASS |
| `release/banimal-connector-v5.1.0` | `banimal-connector-v5.1.0` | 5.1.0 | Earlier: adds the Sam Fox™ CI Guide brand module | 2026-10-07 PASS |
| `release/banimal-connector-v5.0.0` | `banimal-connector-v5.0.0` | 5.0.0 | Earlier: thin, signed client of the Banimal Worker | 2026-10-07 PASS |

The 5 Sep 2026 security patch changed `class-settings.php` and `class-id-finder.php` after 5.1.1 without a version bump, so "5.1.1" names two code states. The standard branch is the patched one.

**Verification:** each version was installed into a clean WordPress (latest, PHP 8.3, WordPress Playground), activated, then checked with `tools/verify_connector.sh` in heyns1000/fruitful-superagent: front page, Plugins list (active, version shown), Configuration, Diagnostics, ID Finder, and for 5.2.0 also the Fruitful™ App screen and `/fruitful-app/`.

**Install any version:** WordPress → Plugins → Add New → Upload Plugin → choose the zip → Install Now → Activate. Build the zip from a release branch with `bin/build-zip.sh` (5.1.1 and later). For 5.2.0 on `main`, run `bin/bundle-fruitful-app.py <fruitful-repo>` first; the premium release branch already contains the tested `app/`.

**Legacy:** `legacy/banimal-ecosystem-connector.v4.7.8.baseline.php` is the archived 4.7.8 baseline, kept for history only. Never install it.

When a new version ships: add its `release/banimal-connector-v<version>[-edition]` branch with a `RELEASE.md`, tag it, verify it, and add a row here.
