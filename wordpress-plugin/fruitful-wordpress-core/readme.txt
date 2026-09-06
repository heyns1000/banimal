=== Fruitful WordPress Core ===
Contributors: fruitfulglobal
Tags: fruitful, api, elementor
Requires at least: 5.9
Tested up to: 6.6
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Shared Fruitful API client, caching, and REST bridge for brand connector plugins.

== Description ==

This plugin holds no brand-specific widgets, labels, or business rules.
It provides the one thing every Fruitful-brand WordPress site needs the
same way:

* A single outbound HTTP client to the Fruitful Core App
  (`Fruitful_WP_Core_API_Client`), so every brand plugin authenticates
  and times out the same way instead of reimplementing it.
* Transient-backed caching (`Fruitful_WP_Core_Cache`) so a public page
  load never calls the Fruitful API directly.
* A narrow, permission-checked REST bridge (`/wp-json/fruitful/v1/...`)
  for the Elementor editor to read through — not a generic proxy onto
  the Fruitful API.

The Fruitful API base URL and token are read only from wp-config.php
constants (`FRUITFUL_API_BASE_URL`, `FRUITFUL_API_TOKEN`, optionally
`FRUITFUL_API_TIMEOUT`) — never from the options table, a request, or an
Elementor control. See docs/FRUITFUL_APP_TO_WORDPRESS_ELEMENTOR_INTEGRATION_README.md
at the repository root for the full architecture and the phased rollout
this plugin is Phase 1 of.

A brand connector (Banimal today, others later) depends on this plugin
for API/cache/REST plumbing and keeps its own widgets, brand rules, and
domain-specific forms to itself. This plugin activates safely and stays
stable even when the Fruitful API server configuration hasn't been added
yet — it shows an admin notice instead of failing.

== Changelog ==

= 1.0.0 =
* Initial skeleton: API client, transient cache, and the `/brands` and
  `/brand/{id}` REST routes from the integration guide's Phase 1 and
  Phase 2. No brand connector depends on this yet — that wiring is a
  separate, later change.
