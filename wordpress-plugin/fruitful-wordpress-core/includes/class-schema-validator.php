<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Maps a raw Fruitful API entity onto a small, stable "public display
 * object" before it ever reaches the REST bridge response or an Elementor
 * widget — per the integration guide's §17 data contract rule: a widget
 * consuming a raw entity means every internal field the API happens to
 * return becomes something the front end (and every future refactor) has
 * to keep working. Naming exactly which fields are public here, once,
 * means the API can add fields freely without any of them leaking.
 *
 * This intentionally does not become a generic "map anything" utility —
 * a new entity type gets its own explicit map_*() method so the field
 * allowlist stays visible and reviewable, not built up dynamically.
 */
class Fruitful_WP_Core_Schema_Validator {

    /**
     * @param mixed $raw Whatever the API client returned for a Brand.
     * @return array|WP_Error The public display object, or a WP_Error if
     *                        $raw isn't shaped like a Brand at all.
     */
    public static function map_brand($raw) {
        if (!is_array($raw)) {
            return new WP_Error(
                'fruitful_invalid_brand_schema',
                __('Fruitful API returned an unexpected shape for a Brand.', 'fruitful-wordpress-core')
            );
        }

        return [
            'id'          => sanitize_key($raw['id'] ?? ''),
            'name'        => sanitize_text_field($raw['name'] ?? ''),
            'description' => wp_kses_post($raw['public_description'] ?? ''),
            'website_url' => esc_url_raw($raw['website_url'] ?? ''),
            'logo_url'    => esc_url_raw($raw['logo_url'] ?? ''),
        ];
    }

    /**
     * @param mixed $raw Whatever the API client returned for a Brand list.
     * @return array[] Public display objects; entries that weren't
     *                 array-shaped are dropped rather than surfaced broken.
     */
    public static function map_brand_list($raw) {
        if (!is_array($raw)) {
            return [];
        }

        $mapped = [];

        foreach ($raw as $entry) {
            $brand = self::map_brand($entry);

            if (!is_wp_error($brand)) {
                $mapped[] = $brand;
            }
        }

        return $mapped;
    }
}
