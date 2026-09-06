<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Plugin bootstrap. Deliberately does almost nothing beyond a
 * configuration notice — this plugin must stay stable and activatable
 * even when the Fruitful API server config hasn't been added yet, per
 * the integration guide's Phase 1 success criterion.
 */
class Fruitful_WP_Core_Plugin {

    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct() {
        add_action('admin_notices', [$this, 'configuration_notice']);
    }

    public function configuration_notice() {
        if (!current_user_can('manage_options')) {
            return;
        }

        if (!Fruitful_WP_Core_Settings::is_configured()) {
            echo '<div class="notice notice-warning"><p>';
            echo esc_html__('Fruitful WordPress Core is active but the Fruitful API server configuration is incomplete. Add FRUITFUL_API_BASE_URL and FRUITFUL_API_TOKEN to wp-config.php.', 'fruitful-wordpress-core');
            echo '</p></div>';
        }
    }
}
