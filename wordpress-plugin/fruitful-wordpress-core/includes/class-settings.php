<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Single read path for the Fruitful API server configuration. The values
 * themselves live only in wp-config.php constants (or the host's
 * environment-variable panel) per the integration guide's golden rule —
 * this class never stores them in the options table, never accepts them
 * from a request, and never echoes the token. It exists so class-plugin.php
 * and class-api-client.php read the same three values the same way instead
 * of each re-checking defined() against the raw constant names.
 */
class Fruitful_WP_Core_Settings {

    public static function get_api_base_url() {
        return defined('FRUITFUL_API_BASE_URL') ? untrailingslashit((string) FRUITFUL_API_BASE_URL) : '';
    }

    public static function get_api_token() {
        return defined('FRUITFUL_API_TOKEN') ? (string) FRUITFUL_API_TOKEN : '';
    }

    public static function get_timeout() {
        return defined('FRUITFUL_API_TIMEOUT') ? absint(FRUITFUL_API_TIMEOUT) : 15;
    }

    public static function is_configured() {
        return self::get_api_base_url() !== '' && self::get_api_token() !== '';
    }
}
