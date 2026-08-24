<?php
if (!defined('ABSPATH')) { exit; }

class Banimal_Plugin {

    private static $instance = null;

    private $settings;
    private $worker_client;
    private $woocommerce_bridge;
    private $diagnostics;
    private $id_finder;

    public static function instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->settings = new Banimal_Settings();

        $this->worker_client = new Banimal_Worker_Client(
            Banimal_Settings::get_worker_base_url(),
            Banimal_Settings::get_worker_secret()
        );

        $this->woocommerce_bridge = new Banimal_WooCommerce_Bridge($this->worker_client);
        $this->diagnostics = new Banimal_Admin_Diagnostics($this->worker_client);
        $this->id_finder = new Banimal_Id_Finder();

        add_action('admin_menu', [$this, 'add_admin_menu']);
    }

    public function add_admin_menu() {
        add_menu_page(
            'Banimal Connector',
            'Banimal',
            'manage_options',
            BANIMAL_CONNECTOR_SLUG,
            [$this, 'render_settings_page'],
            'dashicons-networking',
            30
        );

        add_submenu_page(
            BANIMAL_CONNECTOR_SLUG,
            'Configuration',
            'Configuration',
            'manage_options',
            BANIMAL_CONNECTOR_SLUG,
            [$this, 'render_settings_page']
        );

        add_submenu_page(
            BANIMAL_CONNECTOR_SLUG,
            'Diagnostics',
            'Diagnostics',
            'manage_options',
            BANIMAL_CONNECTOR_SLUG . '-diagnostics',
            [$this->diagnostics, 'render_page']
        );

        add_submenu_page(
            BANIMAL_CONNECTOR_SLUG,
            'ID Finder',
            'ID Finder',
            'manage_options',
            BANIMAL_CONNECTOR_SLUG . '-id-finder',
            [$this->id_finder, 'render_page']
        );
    }

    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>🦍 Banimal Connector Configuration</h1>
            <p>Configure the connection to the Banimal Cloudflare Worker — the single source of truth for orders, payments, and delivery. This plugin stores no payment, delivery, or storage credentials of its own.</p>
            <form method="post" action="options.php">
                <?php
                settings_fields('banimal_settings_options');
                do_settings_sections('banimal-settings');
                submit_button('Save Configuration');
                ?>
            </form>
        </div>
        <?php
    }
}
