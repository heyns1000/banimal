# Legacy connector versions

This plugin (5.0.0) is a full rewrite, not a patch. Nothing in the files
below was carried forward as code — they were read for requirements only.
See `banimal-connector-system-design-2026-08-20.md` §6 for the reasoning.

## `banimal-ecosystem-connector.v4.7.8.baseline.php`

Preserved verbatim below as a historical baseline, per the standing
recommendation to freeze and archive rather than edit in place. On direct
reading, it had:

- An admin "API Status" page that decrypted the master API key and printed
  it into an inline `<script>` block for its test buttons — recoverable
  from page source by anyone who could load the page.
- A master-key comparison using `===` instead of `hash_equals()`
  (timing-attack risk).
- An `AUTH_KEY`-or-`'default_key_change_me'` fallback for its encryption
  key — silently insecure if `AUTH_KEY` was ever undefined.
- `GoogleDriveConnector`, `CloudflareR2Connector`,
  `BanimalMasterEcosystemPuller`, and `BanimalDeploymentManager` classes
  that were instantiated in the constructor but never actually invoked by
  any route — they returned only placeholder data and had no real
  behavior to preserve.
- A GitHub push in `push_global_storage()` that never sent the file's
  existing `sha`, so it would 404/422 on every run after the first.
- A WooCommerce webhook handler that *did* fail closed correctly
  (`hash_equals(hmac_sha256(...))`) — noted so it isn't mistaken for
  something that needed fixing.

## Other candidate files (not reproduced here)

Two other candidate sources were reviewed but are not preserved in this
repo, because neither was ever a clean, canonical file:

- A multi-file variant (`ecosystem-puller.php`, `noodle-juice-flow.php`,
  `vault-allocator.php`, etc.) supplied as a zip outside git history.
  Its `banimal-connector.php` was a corrupted fragment — a duplicate
  mid-file `<?php` tag and AI code-review comments (e.g. "✅ EXCELLENT:
  Proper sanitization") pasted into the source as if they were part of
  it — and could not have run as-is.
- That same variant's `update_user_profile()` simulated a Zoho CRM /
  SecureSign™ / VaultMesh™ sync using `rand(0, 100) > 3` for a fake
  "97% success rate" rather than calling anything real. There was
  nothing genuine in it to carry forward.

If a real, intact copy of either surfaces later, diff it against this
rewrite rather than reintroducing it wholesale.
