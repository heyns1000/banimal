<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Stores exactly two things: the Worker's base URL and a shared HMAC
 * signing secret. Deliberately does NOT store Paystack, Stripe, BobGo,
 * GitHub, or Google Drive credentials — those live only in the Worker's
 * own secret store (wrangler secret put), never duplicated here.
 */
class Banimal_Settings {

    const OPTION_WORKER_BASE_URL = 'banimal_worker_base_url';
    const OPTION_WORKER_SECRET   = 'banimal_worker_secret';

    public function __construct() {
        add_action('admin_init', [$this, 'register_settings']);
    }

    /**
     * A short, missing, or default-placeholder AUTH_KEY must never be used
     * as an encryption key — fail closed instead of falling back to a
     * predictable string.
     */
    public static function has_secure_auth_key() {
        return defined('AUTH_KEY')
            && is_string(AUTH_KEY)
            && strlen(AUTH_KEY) >= 32
            && AUTH_KEY !== 'put your unique phrase here';
    }

    public static function encrypt($value) {
        if ($value === '' || !self::has_secure_auth_key()) {
            return '';
        }
        $iv = random_bytes(openssl_cipher_iv_length('aes-256-cbc'));
        $encrypted = openssl_encrypt($value, 'aes-256-cbc', AUTH_KEY, 0, $iv);
        if ($encrypted === false) {
            return '';
        }
        return base64_encode($encrypted . '::' . base64_encode($iv));
    }

    public static function decrypt($encrypted) {
        if ($encrypted === '' || !self::has_secure_auth_key()) {
            return '';
        }
        $decoded = base64_decode($encrypted, true);
        if ($decoded === false) {
            return '';
        }
        $parts = explode('::', $decoded, 2);
        if (count($parts) !== 2) {
            return '';
        }
        list($encrypted_data, $iv_b64) = $parts;
        $iv = base64_decode($iv_b64, true);
        if ($iv === false) {
            return '';
        }
        $plain = openssl_decrypt($encrypted_data, 'aes-256-cbc', AUTH_KEY, 0, $iv);
        return $plain === false ? '' : $plain;
    }

    /**
     * A blank submission means "keep the existing secret" — the settings
     * field is always rendered empty, so this is the only way to avoid
     * wiping a saved secret every time the form is submitted.
     */
    public static function sanitize_secret($value) {
        if ($value === '' || $value === null) {
            return get_option(self::OPTION_WORKER_SECRET, '');
        }
        return self::encrypt($value);
    }

    public function register_settings() {
        register_setting('banimal_settings_options', self::OPTION_WORKER_BASE_URL, [
            'sanitize_callback' => 'esc_url_raw',
        ]);
        register_setting('banimal_settings_options', self::OPTION_WORKER_SECRET, [
            'sanitize_callback' => [__CLASS__, 'sanitize_secret'],
        ]);

        add_settings_section('banimal_section', 'Worker Connection', [$this, 'section_intro'], 'banimal-settings');

        add_settings_field(
            self::OPTION_WORKER_BASE_URL,
            'Worker API Base URL',
            [$this, 'field_base_url'],
            'banimal-settings',
            'banimal_section'
        );
        add_settings_field(
            self::OPTION_WORKER_SECRET,
            'Signing Secret',
            [$this, 'field_secret'],
            'banimal-settings',
            'banimal_section'
        );
    }

    public function section_intro() {
        echo '<p>' . esc_html__(
            'This plugin never stores payment gateway, delivery, or storage credentials. It holds only the Worker\'s base URL and a shared signing secret, and relays events to the Cloudflare Worker — the single source of truth for orders, payments, and delivery.',
            'banimal-ecosystem-connector'
        ) . '</p>';

        if (!self::has_secure_auth_key()) {
            echo '<div class="notice notice-error inline"><p><strong>' .
                esc_html__('WordPress security keys are missing or insecure.', 'banimal-ecosystem-connector') .
                '</strong> ' .
                esc_html__('Define a unique AUTH_KEY (32+ characters) in wp-config.php before configuring the signing secret. The connector will not store or use a secret until this is fixed.', 'banimal-ecosystem-connector') .
                '</p></div>';
        }
    }

    public function field_base_url() {
        $value = get_option(self::OPTION_WORKER_BASE_URL, '');
        printf(
            '<input type="url" name="%1$s" value="%2$s" class="regular-text" placeholder="https://banimal-worker.example.workers.dev" />',
            esc_attr(self::OPTION_WORKER_BASE_URL),
            esc_attr($value)
        );
    }

    public function field_secret() {
        $stored = get_option(self::OPTION_WORKER_SECRET, '');
        $has_value = ($stored !== '') && (self::decrypt($stored) !== '');
        $disabled = self::has_secure_auth_key() ? '' : ' disabled';
        $placeholder = $has_value
            ? esc_attr__('•••••••• (saved — leave blank to keep)', 'banimal-ecosystem-connector')
            : '';
        printf(
            '<input type="password" name="%1$s" value="" class="regular-text" placeholder="%2$s"%3$s />',
            esc_attr(self::OPTION_WORKER_SECRET),
            $placeholder,
            $disabled
        );
        echo '<p class="description">' . esc_html__('Shared HMAC-SHA256 secret. Set the identical value as WP_BRIDGE_SECRET via wrangler secret put on the Worker.', 'banimal-ecosystem-connector') . '</p>';
    }

    public static function get_worker_base_url() {
        return get_option(self::OPTION_WORKER_BASE_URL, '');
    }

    public static function get_worker_secret() {
        $stored = get_option(self::OPTION_WORKER_SECRET, '');
        return self::decrypt($stored);
    }
}
