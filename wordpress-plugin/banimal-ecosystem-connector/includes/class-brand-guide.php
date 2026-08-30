<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Applies the Sam Fox™ CI Guide to the active theme without ever holding its
 * own copy of the brand truth. Fetches the machine-readable guide from the
 * Worker's public /api/brand-guide endpoint (no secret required — palette,
 * icon rules, and typography are not sensitive data), caches it briefly, and
 * injects it as CSS custom properties on the front end. Fails silently and
 * changes nothing on the site if the Worker is unreachable — this must
 * never be the reason a page breaks.
 */
class Banimal_Brand_Guide {

    const TRANSIENT_KEY = 'banimal_brand_guide_cache';
    const CACHE_TTL = HOUR_IN_SECONDS;

    private $client;

    public function __construct(Banimal_Worker_Client $client) {
        $this->client = $client;
        add_action('wp_head', [$this, 'print_brand_tokens']);
        add_action('wp_ajax_banimal_check_brand_guide', [$this, 'ajax_check_brand_guide']);
    }

    /**
     * Returns the cached guide array, or fetches and caches it. Never
     * throws; returns null if the Worker is unreachable or returns anything
     * other than a well-formed guide, so callers can treat "no guide" as a
     * normal, silent case rather than an error to handle.
     */
    private function get_guide() {
        $cached = get_transient(self::TRANSIENT_KEY);
        if (is_array($cached)) {
            return $cached;
        }

        $result = $this->client->get_brand_guide();
        if (empty($result['ok']) || empty($result['guide']['palette']) || !is_array($result['guide']['palette'])) {
            return null;
        }

        set_transient(self::TRANSIENT_KEY, $result['guide'], self::CACHE_TTL);
        return $result['guide'];
    }

    /**
     * Prints the verified Sam Fox™ palette as CSS custom properties on
     * :root, so a theme can build against var(--banimal-sage) etc. instead
     * of a hex value a designer copied once and never updates. Silent no-op
     * if the guide isn't available — never blocks page render.
     */
    public function print_brand_tokens() {
        $guide = $this->get_guide();
        if ($guide === null) {
            return;
        }

        echo "<style id=\"banimal-brand-tokens\">:root{";
        foreach ($guide['palette'] as $color) {
            if (empty($color['name']) || empty($color['hex'])) {
                continue;
            }
            printf('--banimal-%s:%s;', esc_attr(sanitize_html_class($color['name'])), esc_attr($color['hex']));
        }
        echo "}</style>\n";
    }

    /**
     * Diagnostics AJAX handler — always fetches live (bypassing the cache)
     * so an admin checking this page sees the Worker's current answer, not
     * a stale local copy. Shares the same nonce action as
     * Banimal_Admin_Diagnostics::ajax_check_health, both registered on the
     * same Diagnostics screen.
     */
    public function ajax_check_brand_guide() {
        check_ajax_referer('banimal_diagnostics', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Forbidden'], 403);
        }

        delete_transient(self::TRANSIENT_KEY);
        $result = $this->client->get_brand_guide();
        wp_send_json_success($result);
    }
}
