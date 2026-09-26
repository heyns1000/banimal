<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Read-only status page: is the API configured, is it reachable, how many
 * responses are currently cached. Never a settings form — the values it
 * reports live only in wp-config.php constants, and this page must not
 * become a second place they could be entered or stored. The one live
 * action (connection test) runs server-side over AJAX and returns only a
 * boolean + status code to the browser; the token itself never leaves
 * the server, matching Banimal_Admin_Diagnostics's own rule in the
 * sibling connector plugin.
 */
class Fruitful_WP_Core_Admin_Page {

    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('wp_ajax_fruitful_wp_core_test_connection', [$this, 'ajax_test_connection']);
    }

    public function add_admin_menu() {
        add_menu_page(
            __('Fruitful Core', 'fruitful-wordpress-core'),
            __('Fruitful Core', 'fruitful-wordpress-core'),
            'manage_options',
            FRUITFUL_WP_CORE_SLUG,
            [$this, 'render_page'],
            'dashicons-admin-links',
            31
        );
    }

    public function render_page() {
        if (!Fruitful_WP_Core_Permissions::can_view_diagnostics()) {
            wp_die(esc_html__('You do not have permission to access this page.', 'fruitful-wordpress-core'));
        }

        $base_url    = Fruitful_WP_Core_Settings::get_api_base_url();
        $configured  = Fruitful_WP_Core_Settings::is_configured();
        $timeout     = Fruitful_WP_Core_Settings::get_timeout();
        $cache_count = $this->count_cached_responses();
        $nonce       = wp_create_nonce('fruitful_wp_core_admin');
        $ajax_url    = admin_url('admin-ajax.php');
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Fruitful WordPress Core', 'fruitful-wordpress-core'); ?></h1>
            <p>
                <?php esc_html_e('Shared API client, cache, and REST bridge that Fruitful brand connector plugins build on. This page is status-only — the API base URL and token are read from wp-config.php constants and are never stored, displayed, or editable here.', 'fruitful-wordpress-core'); ?>
            </p>

            <table class="widefat striped" style="max-width:640px;margin-top:16px;">
                <tbody>
                    <tr>
                        <td><strong><?php esc_html_e('API configured', 'fruitful-wordpress-core'); ?></strong></td>
                        <td>
                            <?php if ($configured) : ?>
                                <span style="color:#00a32a;">&#10003; <?php esc_html_e('Yes', 'fruitful-wordpress-core'); ?></span>
                            <?php else : ?>
                                <span style="color:#d63638;">&#10007; <?php esc_html_e('No — add FRUITFUL_API_BASE_URL and FRUITFUL_API_TOKEN to wp-config.php', 'fruitful-wordpress-core'); ?></span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <tr>
                        <td><strong><?php esc_html_e('API base URL', 'fruitful-wordpress-core'); ?></strong></td>
                        <td><code><?php echo $base_url !== '' ? esc_html($base_url) : esc_html__('(not set)', 'fruitful-wordpress-core'); ?></code></td>
                    </tr>
                    <tr>
                        <td><strong><?php esc_html_e('Token', 'fruitful-wordpress-core'); ?></strong></td>
                        <td><?php echo Fruitful_WP_Core_Settings::get_api_token() !== '' ? esc_html__('Set (hidden)', 'fruitful-wordpress-core') : esc_html__('(not set)', 'fruitful-wordpress-core'); ?></td>
                    </tr>
                    <tr>
                        <td><strong><?php esc_html_e('Request timeout', 'fruitful-wordpress-core'); ?></strong></td>
                        <td><?php echo esc_html($timeout); ?>s</td>
                    </tr>
                    <tr>
                        <td><strong><?php esc_html_e('Cached responses', 'fruitful-wordpress-core'); ?></strong></td>
                        <td><?php echo esc_html($cache_count); ?></td>
                    </tr>
                    <tr>
                        <td><strong><?php esc_html_e('Plugin version', 'fruitful-wordpress-core'); ?></strong></td>
                        <td><?php echo esc_html(FRUITFUL_WP_CORE_VERSION); ?></td>
                    </tr>
                </tbody>
            </table>

            <h2 style="margin-top:32px;"><?php esc_html_e('Connection test', 'fruitful-wordpress-core'); ?></h2>
            <p><?php esc_html_e('Makes one real, cached request to the Fruitful API. The result shown is only success/failure and an HTTP status — no response body or credential ever reaches this page.', 'fruitful-wordpress-core'); ?></p>
            <button type="button" class="button button-primary" id="fruitful-wp-core-test-connection">
                <?php esc_html_e('Test Connection', 'fruitful-wordpress-core'); ?>
            </button>
            <pre id="fruitful-wp-core-test-result" style="margin-top:16px;padding:12px;background:#f0f0f1;display:none;white-space:pre-wrap;"></pre>
        </div>
        <script>
        (function () {
            var ajaxUrl = <?php echo wp_json_encode($ajax_url); ?>;
            var nonce = <?php echo wp_json_encode($nonce); ?>;
            var btn = document.getElementById('fruitful-wp-core-test-connection');
            var out = document.getElementById('fruitful-wp-core-test-result');

            btn.addEventListener('click', function () {
                out.style.display = 'block';
                out.textContent = <?php echo wp_json_encode(__('Testing...', 'fruitful-wordpress-core')); ?>;

                var params = new URLSearchParams();
                params.append('action', 'fruitful_wp_core_test_connection');
                params.append('nonce', nonce);

                fetch(ajaxUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params.toString(),
                    credentials: 'same-origin'
                })
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    out.textContent = JSON.stringify(data, null, 2);
                })
                .catch(function (err) {
                    out.textContent = 'Request failed: ' + err.message;
                });
            });
        })();
        </script>
        <?php
    }

    public function ajax_test_connection() {
        check_ajax_referer('fruitful_wp_core_admin', 'nonce');

        if (!Fruitful_WP_Core_Permissions::can_view_diagnostics()) {
            wp_send_json_error(['message' => 'Forbidden'], 403);
        }

        if (!Fruitful_WP_Core_Settings::is_configured()) {
            wp_send_json_error(['message' => __('API is not configured.', 'fruitful-wordpress-core')]);
        }

        $client = new Fruitful_WP_Core_API_Client();
        $result = $client->get('/entities/Brand', ['limit' => 1]);

        if (is_wp_error($result)) {
            wp_send_json_error(['message' => $result->get_error_message()]);
        }

        wp_send_json_success(['message' => __('Connected.', 'fruitful-wordpress-core')]);
    }

    /**
     * Counts this plugin's own transients directly via $wpdb rather than
     * WP_Query/get_transient() in a loop — there's no capability-safe way
     * to enumerate transients by key prefix through core APIs, and this is
     * a read-only COUNT, not something that touches transient values.
     */
    private function count_cached_responses() {
        global $wpdb;

        $count = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$wpdb->options} WHERE option_name LIKE %s",
                $wpdb->esc_like('_transient_fruitful_') . '%'
            )
        );

        return absint($count);
    }
}
