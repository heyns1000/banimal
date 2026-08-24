<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Server-side diagnostics page. Deliberately does NOT echo any secret into
 * page HTML or inline JavaScript — the browser only ever sees a nonce and
 * the JSON result of a server-side health check. This replaces the old
 * render_status_page(), which decrypted the master API key and printed it
 * into a <script> block for its test buttons.
 */
class Banimal_Admin_Diagnostics {

    private $client;

    public function __construct(Banimal_Worker_Client $client) {
        $this->client = $client;
        add_action('wp_ajax_banimal_check_health', [$this, 'ajax_check_health']);
    }

    public function render_page() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to access this page.', 'banimal-ecosystem-connector'));
        }
        $nonce = wp_create_nonce('banimal_diagnostics');
        $ajax_url = admin_url('admin-ajax.php');
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('🔌 Banimal Connector Diagnostics', 'banimal-ecosystem-connector'); ?></h1>
            <p><?php esc_html_e('Runs a live health check against the Worker. No credentials are ever sent to your browser.', 'banimal-ecosystem-connector'); ?></p>
            <button type="button" class="button button-primary" id="banimal-check-health">
                <?php esc_html_e('Check Worker Health', 'banimal-ecosystem-connector'); ?>
            </button>
            <pre id="banimal-health-result" style="margin-top:16px;padding:12px;background:#f0f0f1;display:none;white-space:pre-wrap;"></pre>
        </div>
        <script>
        (function () {
            var btn = document.getElementById('banimal-check-health');
            var out = document.getElementById('banimal-health-result');
            var ajaxUrl = <?php echo wp_json_encode($ajax_url); ?>;
            var nonce = <?php echo wp_json_encode($nonce); ?>;

            btn.addEventListener('click', function () {
                out.style.display = 'block';
                out.textContent = <?php echo wp_json_encode(__('Checking...', 'banimal-ecosystem-connector')); ?>;

                var params = new URLSearchParams();
                params.append('action', 'banimal_check_health');
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

    public function ajax_check_health() {
        check_ajax_referer('banimal_diagnostics', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Forbidden'], 403);
        }

        $result = $this->client->check_health();
        wp_send_json_success($result);
    }
}
