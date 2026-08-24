=== Banimal Ecosystem Connector ===
Contributors: fruitfulglobal
Tags: banimal, woocommerce, cloudflare
Requires at least: 5.9
Tested up to: 6.6
Requires PHP: 7.4
Stable tag: 5.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Thin, signed WordPress client for the Banimal Cloudflare Worker.

== Description ==

This plugin does not process payments, book deliveries, or talk to GitHub,
Google Drive, or any third-party service directly. It holds only the
Worker's base URL and a shared HMAC signing secret, and relays WooCommerce
order events to the Worker — the single source of truth for orders,
payments (Paystack), and delivery (BobGo).

See wordpress-plugin/banimal-ecosystem-connector/legacy/README.md for why
this is a full rewrite rather than a patch of the 4.7.x line.

== Changelog ==

= 5.0.0 =
* Full rewrite as a thin, signed client to the Banimal Cloudflare Worker.
* Removed all direct third-party API calls (Paystack, GitHub, Google Drive,
  Cloudflare R2) from WordPress — these now live exclusively behind the
  Worker.
* Removed the admin page that decrypted and emitted the master API key into
  browser JavaScript; diagnostics are now server-side only, nonce-protected,
  and never return a secret to the browser.
* Encryption now fails closed: refuses to store or use a secret if AUTH_KEY
  is missing, short, or the WordPress-default placeholder, instead of
  falling back to a predictable key.
* WooCommerce bridge is fully inert (registers no hooks) when WooCommerce
  is not active.
* ID Finder page carried forward unchanged — informational only, makes no
  external requests, confirmed working against a live screenshot of the
  prior version.
