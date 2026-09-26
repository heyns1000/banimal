<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Wraps the Fruitful API in WordPress transients so a public page load
 * never calls the app API directly. Per the integration guide this is a
 * hard requirement, not an optimisation — without it every visitor hit
 * is cost, latency, and rate-limit pressure against the Fruitful app.
 */
class Fruitful_WP_Core_Cache {

    public static function remember($key, $seconds, callable $callback) {
        $cache_key = 'fruitful_' . md5($key);
        $value     = get_transient($cache_key);

        if (false !== $value) {
            return $value;
        }

        $value = call_user_func($callback);

        if (!is_wp_error($value)) {
            set_transient($cache_key, $value, absint($seconds));
        }

        return $value;
    }

    public static function forget($key) {
        delete_transient('fruitful_' . md5($key));
    }
}
