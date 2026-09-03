#!/usr/bin/env bash
# Builds the installable WordPress plugin zip — the shape WP admin's
# Plugins → Add New → Upload Plugin expects: a single top-level folder
# named exactly the plugin slug. `legacy/`, `bin/`, and `dist/` are
# excluded on purpose — `legacy/` is the archived 4.7.8 baseline kept for
# history in this repo, and `bin/`/`dist/` are this build tooling itself;
# none of it should ever land on a live site.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SLUG="banimal-ecosystem-connector"
PARENT="$(dirname "$DIR")"
VERSION=$(grep -m1 '^ \* Version:' "$DIR/$SLUG.php" | sed -E 's/.*Version:[[:space:]]+([0-9][0-9A-Za-z.\-]*).*/\1/')

OUT_DIR="${1:-$DIR/dist}"
mkdir -p "$OUT_DIR"
OUT_ZIP="$OUT_DIR/$SLUG-$VERSION.zip"
rm -f "$OUT_ZIP"
mkdir -p "$OUT_DIR"
ABS_OUT_ZIP="$(cd "$OUT_DIR" && pwd)/$(basename "$OUT_ZIP")"

(
  cd "$PARENT"
  zip -r -q "$ABS_OUT_ZIP" "$SLUG" \
    -x "$SLUG/legacy/*" \
    -x "$SLUG/bin/*" \
    -x "$SLUG/dist/*"
)

echo "Built $ABS_OUT_ZIP"
