#!/usr/bin/env bash
# Fails if the plugin's three independent version strings ever drift apart.
# There is no single source of truth for the version number in a WordPress
# plugin (WP.org reads the header comment; PHP code reads the constant;
# readme.txt's "Stable tag" is what WP.org actually offers for update), so
# this substitutes a CI check for the single source of truth we can't have.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_FILE="$DIR/fruitful-wordpress-core.php"
README_FILE="$DIR/readme.txt"

header_version=$(grep -m1 '^ \* Version:' "$PLUGIN_FILE" | sed -E 's/.*Version:[[:space:]]+([0-9][0-9A-Za-z.\-]*).*/\1/')
constant_version=$(grep -m1 "define('FRUITFUL_WP_CORE_VERSION'" "$PLUGIN_FILE" | sed -E "s/.*define\('FRUITFUL_WP_CORE_VERSION', '([^']+)'\).*/\1/")
readme_version=$(grep -m1 '^Stable tag:' "$README_FILE" | sed -E 's/^Stable tag:[[:space:]]+([0-9][0-9A-Za-z.\-]*).*/\1/')

echo "Plugin header Version:       $header_version"
echo "FRUITFUL_WP_CORE_VERSION:    $constant_version"
echo "readme.txt Stable tag:       $readme_version"

if [[ -z "$header_version" || -z "$constant_version" || -z "$readme_version" ]]; then
  echo "::error::Could not extract one or more version strings — check the patterns above still match the files." >&2
  exit 1
fi

if [[ "$header_version" != "$constant_version" || "$header_version" != "$readme_version" ]]; then
  echo "::error::Version mismatch — plugin header ($header_version), PHP constant ($constant_version), and readme.txt Stable tag ($readme_version) must all match." >&2
  exit 1
fi

echo "OK — all three agree on $header_version"
