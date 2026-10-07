# Banimal Ecosystem Connector v5.2.0 (premium)

**This branch is the release.** Pull `release/banimal-connector-v5.2.0-premium` to get exactly this version; do not take the connector from `main`, which moves.

| | |
|---|---|
| Version | 5.2.0 (plugin header, `BANIMAL_CONNECTOR_VERSION` and readme Stable tag agree) |
| Edition | Premium (current) |
| What it is | PREMIUM edition. Standard plus the full Fruitful™ OmniGrid™ app served from the site at /fruitful-app/ (PR #48). |
| Source commit | `d09ab32b415aa1cd2443bddbb9776d602286fbde` on heyns1000/banimal |
| Verified zip SHA-256 | `77fc82abe29dc047bc9023813c7f02517a6e24fdf99313d21fa0c9d63c7afde5` (the zip that was tested, built from the source commit; folder `banimal-ecosystem-connector/` without `legacy/`, `bin/`, `dist/`; this RELEASE.md is not in it) |
| App bundle | `app/` is committed here exactly as tested: heyns1000/fruitful `claude/global-app-hat` @ `2493b71`, 340 files, 640 site-root links made relative |

## Verified 2026-10-07

Installed into a clean WordPress (latest, PHP 8.3, WordPress Playground), activated, then checked with `fruitful-superagent/tools/verify_connector.sh`:
front page, Plugins list (active, version 5.2.0 shown), Banimal → Configuration, Diagnostics, ID Finder, Fruitful™ App admin screen and `/fruitful-app/`.
Result: **PASS**, no PHP fatal errors, warnings or critical-error screens.

## Install

WordPress → Plugins → Add New → Upload Plugin → choose the zip → Install Now → Activate.
Settings → Permalinks must not be Plain; the app is at `https://your-site/fruitful-app/`.

## All editions

| Branch | Version | Edition |
|---|---|---|
| `release/banimal-connector-v5.2.0-premium` | 5.2.0 | Premium (current) |
| `release/banimal-connector-v5.1.1-standard` | 5.1.1 + security patch | Standard |
| `release/banimal-connector-v5.1.0` | 5.1.0 | Earlier |
| `release/banimal-connector-v5.0.0` | 5.0.0 | Earlier |
