<?php
/**
 * Plugin Name:       Fruitful WordPress Core
 * Plugin URI:        https://banimal.co.za
 * Description:       Shared Fruitful API client, caching, and narrow REST bridge that brand connectors (Banimal today, others later) build on instead of each reimplementing API auth, caching, and REST security. Holds no brand-specific widgets or business rules — see docs/FRUITFUL_APP_TO_WORDPRESS_ELEMENTOR_INTEGRATION_README.md for the full architecture this plugin implements.
 * Version:           1.0.0
 * Requires at least: 5.9
 * Requires PHP:      7.4
 * Author:            Fruitful Global
 * Author URI:        https://banimal.co.za
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       fruitful-wordpress-core
 */

if (!defined('ABSPATH')) {
    exit;
}

define('FRUITFUL_WP_CORE_VERSION', '1.0.0');
define('FRUITFUL_WP_CORE_SLUG', 'fruitful-wordpress-core');
define('FRUITFUL_WP_CORE_DIR', plugin_dir_path(__FILE__));
define('FRUITFUL_WP_CORE_FILE', __FILE__);

require_once FRUITFUL_WP_CORE_DIR . 'includes/class-settings.php';
require_once FRUITFUL_WP_CORE_DIR . 'includes/class-logger.php';
require_once FRUITFUL_WP_CORE_DIR . 'includes/class-api-client.php';
require_once FRUITFUL_WP_CORE_DIR . 'includes/class-cache.php';
require_once FRUITFUL_WP_CORE_DIR . 'includes/class-rest-api.php';
require_once FRUITFUL_WP_CORE_DIR . 'includes/class-plugin.php';

add_action(
    'plugins_loaded',
    static function () {
        Fruitful_WP_Core_Plugin::instance();
        Fruitful_WP_Core_REST_API::instance();
    }
);
