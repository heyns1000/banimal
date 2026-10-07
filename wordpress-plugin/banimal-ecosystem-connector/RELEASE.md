# Banimal Ecosystem Connector v5.1.1 (standard)

**This branch is the release.** Pull `release/banimal-connector-v5.1.1-standard` to get exactly this version; do not take the connector from `main`, which moves.

| | |
|---|---|
| Version | 5.1.1 (plugin header, `BANIMAL_CONNECTOR_VERSION` and readme Stable tag agree) |
| Edition | Standard |
| What it is | STANDARD edition. 5.1.1 plus the 5 Sep 2026 security patch (6563ae1: class-settings.php, class-id-finder.php), which landed without a version bump. |
| Source commit | `e10f51ec4937de6a4101745a4b8858c37ec6ad5e` on heyns1000/banimal |
| Verified zip SHA-256 | `f2911ead745ff3e3de62f7c2c03293a66ab1561bae04f88b766be3eaca6014b7` (the zip that was tested, built from the source commit; folder `banimal-ecosystem-connector/` without `legacy/`, `bin/`, `dist/`; this RELEASE.md is not in it) |


## Verified 2026-10-07

Installed into a clean WordPress (latest, PHP 8.3, WordPress Playground), activated, then checked with `fruitful-superagent/tools/verify_connector.sh`:
front page, Plugins list (active, version 5.1.1 shown), Banimal → Configuration, Diagnostics, ID Finder.
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
