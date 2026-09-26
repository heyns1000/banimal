=== Fruitful WordPress Core ===
Contributors: fruitfulglobal
Tags: fruitful, api, elementor
Requires at least: 5.9
Tested up to: 6.6
Requires PHP: 7.4
Stable tag: 1.1.0
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
* A schema validator (`Fruitful_WP_Core_Schema_Validator`) that maps every
  raw API entity onto a small, explicit "public display object" before
  it reaches the REST bridge or a widget — no internal field can leak by
  accident.
* One Elementor widget, "Fruitful Brand" — read-only, degrades to an
  editor-only placeholder when Elementor, the API configuration, or the
  requested brand isn't there, and never renders on the front end with
  nothing to show.
* A status page (WP Admin → Fruitful Core) reporting whether the API is
  configured, a live connection test, and a cache count — never a form,
  since the credentials it reports on are never stored anywhere this
  plugin controls.

The Fruitful API base URL and token are read only from wp-config.php
constants (`FRUITFUL_API_BASE_URL`, `FRUITFUL_API_TOKEN`, optionally
`FRUITFUL_API_TIMEOUT`) — never from the options table, a request, or an
Elementor control. See docs/FRUITFUL_APP_TO_WORDPRESS_ELEMENTOR_INTEGRATION_README.md
at the repository root for the full architecture and the phased rollout
this plugin is Phase 1 and Phase 2 of.

A brand connector (Banimal today, others later) depends on this plugin
for API/cache/REST plumbing and keeps its own widgets, brand rules, and
domain-specific forms to itself. This plugin activates safely and stays
stable even when the Fruitful API server configuration hasn't been added
yet, or when Elementor isn't installed at all — it shows an admin notice
or an editor-only placeholder instead of failing.

== Changelog ==

= 1.1.0 =
* Added `class-permissions.php` and `class-schema-validator.php` — the
  two classes the integration guide's own file tree called for that were
  never built in 1.0.0. The REST bridge now maps every response through
  the validator instead of returning the raw API entity, and both REST
  routes and the new widget share one permission check.
* Added the plugin's first real front-end feature: an Elementor "Fruitful
  Brand" widget, completing the integration guide's Phase 2 success
  criterion ("an editor can add a controlled Fruitful-powered widget to
  a page without a public visitor receiving any credential"). Registered
  only when Elementor is active; a minimal front-end stylesheet is
  registered via `get_style_depends()` so it only loads on pages that
  use the widget.
* Added a status page at WP Admin → Fruitful Core: configuration state,
  a server-side connection test (AJAX, nonce-protected, no credential
  ever reaches the browser), and a cache count. Read-only by design —
  the values it reports still live only in wp-config.php.

= 1.0.0 =
* Initial skeleton: API client, transient cache, and the `/brands` and
  `/brand/{id}` REST routes from the integration guide's Phase 1 and
  Phase 2. No brand connector depends on this yet — that wiring is a
  separate, later change.
