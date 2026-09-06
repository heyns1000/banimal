<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Minimal integration logger. Writes to PHP's error log (same destination
 * WP_DEBUG_LOG already points at) so failures are observable per the
 * integration guide's testing checklist, while redacting anything that
 * looks like a credential before it's ever formatted into a string —
 * the guide is explicit that a bearer token or raw sensitive response body
 * must never reach a log line.
 */
class Fruitful_WP_Core_Logger {

    private static $redact_keys = ['token', 'authorization', 'secret', 'password'];

    public static function error($message, array $context = []) {
        self::write('ERROR', $message, $context);
    }

    public static function warning($message, array $context = []) {
        self::write('WARNING', $message, $context);
    }

    private static function write($level, $message, array $context) {
        $safe_context = self::redact($context);
        $line = sprintf('[Fruitful WP Core] %s: %s', $level, $message);

        if (!empty($safe_context)) {
            $line .= ' ' . wp_json_encode($safe_context);
        }

        error_log($line);
    }

    private static function redact(array $context) {
        $safe = [];

        foreach ($context as $key => $value) {
            $lower_key = strtolower((string) $key);
            $is_sensitive = false;

            foreach (self::$redact_keys as $needle) {
                if (strpos($lower_key, $needle) !== false) {
                    $is_sensitive = true;
                    break;
                }
            }

            $safe[$key] = $is_sensitive ? '[redacted]' : (is_scalar($value) ? $value : '[non-scalar]');
        }

        return $safe;
    }
}
