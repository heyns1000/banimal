<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Registers this plugin's Elementor widgets, if Elementor is even active.
 * Per the integration guide's Phase 1 rule, this plugin must stay stable
 * with Elementor absent entirely — so every hook here is behind a
 * class_exists() guard, never a hard dependency declared in the plugin
 * header. A brand connector that needs Elementor Pro's custom form
 * actions is free to require it itself; this shared plugin doesn't.
 */
class Fruitful_WP_Core_Elementor {

    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct() {
        add_action('init', [$this, 'register_styles']);
        add_action('elementor/widgets/register', [$this, 'register_widgets']);
    }

    /**
     * Registered (not enqueued) on init, so it's available in every
     * context Elementor might ask for it — frontend render and editor
     * preview alike — via Widget_Base::get_style_depends(). Elementor
     * only actually prints it on a page where the widget is used.
     */
    public function register_styles() {
        wp_register_style(
            'fruitful-wp-core-frontend',
            plugins_url('assets/css/frontend.css', FRUITFUL_WP_CORE_FILE),
            [],
            FRUITFUL_WP_CORE_VERSION
        );
    }

    public function register_widgets($widgets_manager) {
        if (!class_exists('\Elementor\Widget_Base')) {
            return;
        }

        require_once FRUITFUL_WP_CORE_DIR . 'includes/widgets/class-widget-brand.php';

        $widgets_manager->register(new Fruitful_WP_Core_Widget_Brand());
    }
}
