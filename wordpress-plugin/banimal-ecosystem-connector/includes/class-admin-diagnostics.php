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

            <h2 style="margin-top:32px;"><?php esc_html_e('Sam Fox™ CI Guide', 'banimal-ecosystem-connector'); ?></h2>
            <p><?php esc_html_e('Confirms this site is pulling live brand tokens (palette, icon rules) from the Worker, not a stale local copy.', 'banimal-ecosystem-connector'); ?></p>
            <button type="button" class="button button-primary" id="banimal-check-brand-guide">
                <?php esc_html_e('Check Brand Guide', 'banimal-ecosystem-connector'); ?>
            </button>
            <pre id="banimal-brand-guide-result" style="margin-top:16px;padding:12px;background:#f0f0f1;display:none;white-space:pre-wrap;"></pre>
        </div>
        <script>
        (function () {
            var ajaxUrl = <?php echo wp_json_encode($ajax_url); ?>;
            var nonce = <?php echo wp_json_encode($nonce); ?>;

            function wireCheck(buttonId, outId, action) {
                var btn = document.getElementById(buttonId);
                var out = document.getElementById(outId);

                btn.addEventListener('click', function () {
                    out.style.display = 'block';
                    out.textContent = <?php echo wp_json_encode(__('Checking...', 'banimal-ecosystem-connector')); ?>;

                    var params = new URLSearchParams();
                    params.append('action', action);
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
            }

            wireCheck('banimal-check-health', 'banimal-health-result', 'banimal_check_health');
            wireCheck('banimal-check-brand-guide', 'banimal-brand-guide-result', 'banimal_check_brand_guide');
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
