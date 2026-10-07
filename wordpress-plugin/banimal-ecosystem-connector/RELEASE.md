# Banimal Ecosystem Connector v5.0.0

**This branch is the release.** Pull `release/banimal-connector-v5.0.0` to get exactly this version; do not take the connector from `main`, which moves.

| | |
|---|---|
| Version | 5.0.0 (plugin header, `BANIMAL_CONNECTOR_VERSION` and readme Stable tag agree) |
| Edition | Earlier release |
| What it is | Original thin, signed client of the Banimal Worker. |
| Source commit | `d11713aff07ab7597628463330d915012fd0922d` on heyns1000/banimal |
| Verified zip SHA-256 | `3ace395a01911d34bdd92562c47bdc096ed40a1d7f7673c667f5cc36f335dd05` (the zip that was tested, built from the source commit; folder `banimal-ecosystem-connector/` without `legacy/`, `bin/`, `dist/`; this RELEASE.md is not in it) |


## Verified 2026-10-07

Installed into a clean WordPress (latest, PHP 8.3, WordPress Playground), activated, then checked with `fruitful-superagent/tools/verify_connector.sh`:
front page, Plugins list (active, version 5.0.0 shown), Banimal → Configuration, Diagnostics, ID Finder.
Result: **PASS**, no PHP fatal errors, warnings or critical-error screens.

## Install

WordPress → Plugins → Add New → Upload Plugin → choose the zip → Install Now → Activate.


## All editions

| Branch | Version | Edition |
|---|---|---|
| `release/banimal-connector-v5.2.0-premium` | 5.2.0 | Premium (current) |
| `release/banimal-connector-v5.1.1-standard` | 5.1.1 + security patch | Standard |
| `release/banimal-connector-v5.1.0` | 5.1.0 | Earlier |
| `release/banimal-connector-v5.0.0` | 5.0.0 | Earlier |
