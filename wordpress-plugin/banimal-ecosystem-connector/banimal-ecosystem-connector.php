<?php
/**
 * Plugin Name:       Banimal Ecosystem Connector
 * Plugin URI:        https://banimal.co.za
 * Description:       Thin, signed WordPress client for the Banimal Cloudflare Worker (single source of truth for orders, payments, delivery, and the Sam Fox™ CI Guide). Relays WooCommerce events to the Worker and applies the Worker's brand guide to the theme; never calls Paystack, BobGo, or GitHub directly.
 * Version:           5.1.1
 * Requires at least: 5.9
 * Requires PHP:      7.4
 * Author:            Fruitful Global
 * Author URI:        https://banimal.co.za
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       banimal-ecosystem-connector
 */

if (!defined('ABSPATH')) {
    exit;
}

define('BANIMAL_CONNECTOR_VERSION', '5.1.1');
define('BANIMAL_CONNECTOR_SLUG', 'banimal-ecosystem-connector');
define('BANIMAL_CONNECTOR_DIR', plugin_dir_path(__FILE__));
define('BANIMAL_CONNECTOR_FILE', __FILE__);

require_once BANIMAL_CONNECTOR_DIR . 'includes/class-settings.php';
require_once BANIMAL_CONNECTOR_DIR . 'includes/class-worker-client.php';
require_once BANIMAL_CONNECTOR_DIR . 'includes/class-woocommerce-bridge.php';
require_once BANIMAL_CONNECTOR_DIR . 'includes/class-admin-diagnostics.php';
require_once BANIMAL_CONNECTOR_DIR . 'includes/class-id-finder.php';
require_once BANIMAL_CONNECTOR_DIR . 'includes/class-brand-guide.php';
require_once BANIMAL_CONNECTOR_DIR . 'includes/class-plugin.php';

Banimal_Plugin::instance();
