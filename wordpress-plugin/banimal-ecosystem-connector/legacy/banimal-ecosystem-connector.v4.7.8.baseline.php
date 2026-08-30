<?php
/**
 * Plugin Name:       Banimal Ecosystem Connector
 * Plugin URI:        https://banimal.co.za
 * Description:       Comprehensive hub for FAA Global Ecosystem with payment gateways, WooCommerce, swarm intelligence, Alibaba/AliExpress, and storage.
 * Version:           4.7.8
 * Requires at least: 5.0
 * Requires PHP:      7.4
 * Author:            Fruitful Global Mac
 * Author URI:        https://banimal.co.za
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       banimal-ecosystem-connector
 *
 * PRESERVED AS-IS — historical baseline only, not loaded by this plugin.
 * See legacy/README.md for the specific issues found in this version.
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

define('BANIMAL_SLUG', 'banimal-ecosystem-connector');
define('BANIMAL_VERSION', '4.7.8');

// ============================================
// HELPER CLASSES - DEFINED FIRST
// ============================================

class BanimalVaultAllocator {
    private $wpdb;

    public function __construct() {
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->create_vault_table();
    }

    private function create_vault_table() {
        $table_name = $this->wpdb->prefix . 'banimal_vault_data';
        $charset_collate = $this->wpdb->get_charset_collate();
        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            vault_id varchar(32) NOT NULL,
            vault_type varchar(50) NOT NULL,
            vault_key varchar(255) NOT NULL,
            last_touched datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            data_json longtext,
            PRIMARY KEY (id),
            UNIQUE KEY vault_id (vault_id)
        ) $charset_collate;";
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    public function touch_vault($type, $key) {
        $vault_id = md5($type . $key);
        $this->wpdb->replace($this->wpdb->prefix . 'banimal_vault_data', [
            'vault_id' => $vault_id,
            'vault_type' => $type,
            'vault_key' => $key,
            'last_touched' => current_time('mysql'),
            'data_json' => '{}'
        ], ['%s', '%s', '%s', '%s', '%s']);
        return ['vault_id' => $vault_id, 'message' => 'Vault touched'];
    }
}

class NoodleJuiceFlowController {
    private $vault_allocator;

    public function __construct($vault_allocator) {
        $this->vault_allocator = $vault_allocator;
    }

    public function process_juice($raw_data) {
        $records = 0;
        foreach ($raw_data as $key => $file_data) {
            if (!empty($file_data)) {
                $this->vault_allocator->touch_vault('ecosystem_data', $key);
                $records++;
            }
        }
        return ['flow_status' => ['records' => $records, 'message' => 'Juice processed']];
    }
}

class BanimalMasterEcosystemPuller {
    public function pull_complete_ecosystem() {
        return ['message' => 'Ecosystem pull initiated'];
    }
}

class BanimalDeploymentManager {
    public function deploy_all() {
        return ['id' => 'DEPLOY_' . time(), 'status' => 'Successful'];
    }
}

class GoogleDriveConnector {
    public function fetch_google_drive_files() {
        return ['files' => []];
    }
}

class CloudflareR2Connector {
    public function upload_to_r2($file_path) {
        return ['key' => 'intake/' . basename($file_path)];
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function banimal_encrypt($data) {
    if (empty($data)) {
        return '';
    }
    $key = defined('AUTH_KEY') ? AUTH_KEY : 'default_key_change_me';
    $iv = random_bytes(openssl_cipher_iv_length('aes-256-cbc'));
    $encrypted = openssl_encrypt($data, 'aes-256-cbc', $key, 0, $iv);
    return base64_encode($encrypted . '::' . base64_encode($iv));
}

function banimal_decrypt($encrypted) {
    if (empty($encrypted)) {
        return '';
    }
    $key = defined('AUTH_KEY') ? AUTH_KEY : 'default_key_change_me';
    $parts = explode('::', base64_decode($encrypted), 2);
    if (count($parts) !== 2) {
        return '';
    }
    list($encrypted_data, $iv) = $parts;
    $iv = base64_decode($iv);
    return openssl_decrypt($encrypted_data, 'aes-256-cbc', $key, 0, $iv);
}

// ============================================
// MAIN PLUGIN CLASS
// ============================================

class Banimal_Plugin {
    private $vault_allocator;
    private $noodle_juice_flow;
    private $ecosystem_puller;
    private $deployment_manager;
    private $drive_connector;
    private $r2_connector;

    public function __construct() {
        $this->vault_allocator = new BanimalVaultAllocator();
        $this->noodle_juice_flow = new NoodleJuiceFlowController($this->vault_allocator);
        $this->ecosystem_puller = new BanimalMasterEcosystemPuller();
        $this->deployment_manager = new BanimalDeploymentManager();
        $this->drive_connector = new GoogleDriveConnector();
        $this->r2_connector = new CloudflareR2Connector();

        add_action('admin_menu', [$this, 'add_settings_page']);
        add_action('rest_api_init', [$this, 'register_rest_endpoint']);
        add_action('init', [$this, 'schedule_listener']);
        add_action('banimal_listener', [$this, 'run_listener']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    public function add_settings_page() {
        add_menu_page(
            'Banimal Ecosystem',
            'Banimal',
            'manage_options',
            BANIMAL_SLUG,
            [$this, 'render_settings_page'],
            'dashicons-networking',
            30
        );

        add_submenu_page(
            BANIMAL_SLUG,
            'Configuration',
            'Configuration',
            'manage_options',
            BANIMAL_SLUG,
            [$this, 'render_settings_page']
        );

        add_submenu_page(
            BANIMAL_SLUG,
            'API Status',
            'API Status',
            'manage_options',
            BANIMAL_SLUG . '-status',
            [$this, 'render_status_page']
        );

        add_submenu_page(
            BANIMAL_SLUG,
            'ID Finder',
            'ID Finder',
            'manage_options',
            BANIMAL_SLUG . '-id-finder',
            [$this, 'render_id_finder_page']
        );
    }

    public function register_settings() {
        add_settings_section('banimal_section', 'API Keys & Settings', null, 'banimal-settings');
        $fields = [
            'banimal_master_api_key' => 'Banimal Master API Key',
            'openai_api_key' => 'OpenAI API Key',
            'aliexpress_app_key' => 'AliExpress App Key',
            'aliexpress_app_secret' => 'AliExpress App Secret',
            'alibaba_app_key' => 'Alibaba App Key',
            'alibaba_app_secret' => 'Alibaba App Secret',
            'paystack_secret_key' => 'Paystack Secret Key',
            'stripe_secret_key' => 'Stripe Secret Key',
            'payfast_merchant_id' => 'Payfast Merchant ID',
            'payfast_secret_key' => 'Payfast Secret Key',
            'paypal_client_id' => 'PayPal Client ID',
            'paypal_secret' => 'PayPal Secret',
            'flutterwave_public_key' => 'Flutterwave Public Key',
            'flutterwave_secret_key' => 'Flutterwave Secret Key',
            'woocommerce_api_key' => 'WooCommerce API Key',
            'woocommerce_api_secret' => 'WooCommerce API Secret',
            'woocommerce_webhook_secret' => 'WooCommerce Webhook Secret',
            'google_drive_credentials' => 'Google Drive JSON Key',
            'git_api_key' => 'GitHub API Key',
            'webhook_urls' => 'Webhook URLs (comma-separated)',
            'backend_api_url' => 'Backend API URL'
        ];

        foreach ($fields as $key => $label) {
            add_settings_field($key, $label, [$this, 'text_field_callback'], 'banimal-settings', 'banimal_section', ['name' => $key]);
            register_setting('banimal_settings_options', $key, [$this, 'encrypt_callback']);
        }
    }

    public function text_field_callback($args) {
        $value = get_option($args['name']);
        if ($value) {
            $value = banimal_decrypt($value);
        }
        $input_type = ($args['name'] === 'google_drive_credentials') ? 'textarea' : 'text';

        if ($input_type === 'textarea') {
            echo '<textarea name="' . esc_attr($args['name']) . '" rows="5" cols="50">' . esc_textarea($value) . '</textarea>';
        } else {
            echo '<input type="text" name="' . esc_attr($args['name']) . '" value="' . esc_attr($value) . '" style="width: 400px;">';
        }
    }

    public function encrypt_callback($value) {
        return banimal_encrypt($value);
    }

    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>🐾 Banimal Ecosystem Configuration</h1>
            <p>Configure your API keys and integrations for the Banimal ecosystem.</p>
            <form method="post" action="options.php">
                <?php settings_fields('banimal_settings_options'); ?>
                <?php do_settings_sections('banimal-settings'); ?>
                <?php submit_button('Save Configuration'); ?>
            </form>
        </div>
        <?php
    }

    public function render_status_page() {
        ?>
        <div class="wrap">
            <h1>🔌 Banimal API Status</h1>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <h2>System Status</h2>
                <div id="status-container">
                    <p>Loading system status...</p>
                </div>

                <h2 style="margin-top: 30px;">Test Endpoints</h2>
                <button type="button" class="button button-primary" onclick="testSupplyChain()">Test Supply Chain</button>
                <button type="button" class="button" onclick="testPayment()">Test Payment Gateway</button>

                <div id="test-results" style="margin-top: 20px; padding: 15px; background: #f0f0f1; border-radius: 4px; display: none;">
                    <h3>Test Results:</h3>
                    <pre id="test-output" style="background: white; padding: 10px; overflow-x: auto;"></pre>
                </div>
            </div>

            <script>
                function showStatus() {
                    const configured = {
                        'Master API Key': <?php echo get_option('banimal_master_api_key') ? 'true' : 'false'; ?>,
                        'OpenAI': <?php echo get_option('openai_api_key') ? 'true' : 'false'; ?>,
                        'Paystack': <?php echo get_option('paystack_secret_key') ? 'true' : 'false'; ?>,
                        'WooCommerce': <?php echo get_option('woocommerce_api_key') ? 'true' : 'false'; ?>,
                        'GitHub': <?php echo get_option('git_api_key') ? 'true' : 'false'; ?>,
                        'Backend API': <?php echo get_option('backend_api_url') ? 'true' : 'false'; ?>
                    };

                    let html = '<table style="width: 100%; border-collapse: collapse;">';
                    html += '<tr style="background: #f9f9f9; font-weight: bold;"><td style="padding: 10px; border: 1px solid #ddd;">Service</td><td style="padding: 10px; border: 1px solid #ddd;">Status</td></tr>';

                    for (const [service, isConfigured] of Object.entries(configured)) {
                        const status = isConfigured ? '<span style="color: green;">✓ Configured</span>' : '<span style="color: red;">✗ Not Configured</span>';
                        html += `<tr><td style="padding: 10px; border: 1px solid #ddd;">${service}</td><td style="padding: 10px; border: 1px solid #ddd;">${status}</td></tr>`;
                    }
                    html += '</table>';

                    document.getElementById('status-container').innerHTML = html;
                }

                function testSupplyChain() {
                    const apiKey = '<?php echo esc_js(banimal_decrypt(get_option('banimal_master_api_key'))); ?>';
                    if (!apiKey) {
                        alert('Please configure your Banimal Master API Key first.');
                        return;
                    }

                    document.getElementById('test-results').style.display = 'block';
                    document.getElementById('test-output').textContent = 'Testing supply chain...';

                    fetch('<?php echo esc_url(rest_url('banimal/v1/automated-supply')); ?>', {
                        method: 'POST',
                        headers: { 'X-Banimal-Api-Key': apiKey }
                    })
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('test-output').textContent = JSON.stringify(data, null, 2);
                    })
                    .catch(error => {
                        document.getElementById('test-output').textContent = 'Error: ' + error.message;
                    });
                }

                function testPayment() {
                    const apiKey = '<?php echo esc_js(banimal_decrypt(get_option('banimal_master_api_key'))); ?>';
                    if (!apiKey) {
                        alert('Please configure your Banimal Master API Key first.');
                        return;
                    }

                    document.getElementById('test-results').style.display = 'block';
                    document.getElementById('test-output').textContent = 'Testing payment gateway...';

                    fetch('<?php echo esc_url(rest_url('banimal/v1/process-payment')); ?>', {
                        method: 'POST',
                        headers: {
                            'X-Banimal-Api-Key': apiKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            gateway: 'paystack',
                            amount: 1000,
                            email: 'test@example.com',
                            reference: 'test_' + Date.now()
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('test-output').textContent = JSON.stringify(data, null, 2);
                    })
                    .catch(error => {
                        document.getElementById('test-output').textContent = 'Error: ' + error.message;
                    });
                }

                window.addEventListener('load', showStatus);
            </script>
        </div>
        <?php
    }

    public function render_id_finder_page() {
        // (identical markup to the current class-id-finder.php; omitted from
        // this historical baseline copy for brevity — see git history of
        // this exact file if the full original text is needed.)
    }

    public function register_rest_endpoint() {
        register_rest_route('banimal/v1', '/automated-supply', [
            'methods' => 'POST',
            'callback' => [$this, 'automated_supply'],
            'permission_callback' => [$this, 'authenticate_master_key']
        ]);

        register_rest_route('banimal/v1', '/process-payment', [
            'methods' => 'POST',
            'callback' => [$this, 'process_payment'],
            'permission_callback' => [$this, 'authenticate_master_key']
        ]);

        register_rest_route('banimal/v1', '/woocommerce/webhook', [
            'methods' => 'POST',
            'callback' => [$this, 'woocommerce_webhook_callback'],
            'permission_callback' => '__return_true'
        ]);
    }

    public function authenticate_master_key($request) {
        $master_key = $request->get_header('x-banimal-api-key');
        $stored_key = banimal_decrypt(get_option('banimal_master_api_key'));
        return !empty($master_key) && $master_key === $stored_key;
    }

    public function schedule_listener() {
        if (!wp_next_scheduled('banimal_listener')) {
            wp_schedule_event(time(), 'hourly', 'banimal_listener');
        }
    }

    public function run_listener() {
        error_log('Banimal listener executed at ' . current_time('mysql'));
    }

    public function automated_supply() {
        try {
            $global_folder = $this->create_global_folder();
            $this->auto_ingest_data($global_folder);

            return new WP_REST_Response([
                'message' => 'Automated supply chain initiated successfully',
                'timestamp' => current_time('mysql')
            ], 200);
        } catch (Exception $e) {
            return new WP_REST_Response([
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    private function create_global_folder() {
        $upload_dir = wp_upload_dir();
        $banimal_dir = $upload_dir['basedir'] . '/banimal-ecosystem';

        if (!file_exists($banimal_dir)) {
            wp_mkdir_p($banimal_dir);
        }

        return $banimal_dir;
    }

    private function auto_ingest_data($folder_path) {
        $ecosystem_file = $folder_path . '/ecosystem_data.json';

        if (!file_exists($ecosystem_file)) {
            $initial_data = ['items' => [], 'timestamp' => current_time('mysql')];
            file_put_contents($ecosystem_file, json_encode($initial_data));
        }

        $this->push_global_storage($folder_path);
    }

    public function process_payment($request) {
        $gateway = $request->get_param('gateway') ?: 'paystack';
        $amount = $request->get_param('amount') ?: 1000;
        $email = $request->get_param('email') ?: 'user@example.com';
        $reference = $request->get_param('reference') ?: 'ref_' . time();

        try {
            $response = $this->initialize_payment($gateway, $amount, $email, $reference);
            return new WP_REST_Response($response, 200);
        } catch (Exception $e) {
            return new WP_REST_Response([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function initialize_payment($gateway, $amount, $email, $reference) {
        switch ($gateway) {
            case 'paystack':
                $secret_key = banimal_decrypt(get_option('paystack_secret_key'));
                if (!$secret_key) {
                    throw new Exception('Paystack secret key not configured');
                }

                $response = wp_remote_post('https://api.paystack.co/transaction/initialize', [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $secret_key,
                        'Content-Type' => 'application/json'
                    ],
                    'body' => json_encode([
                        'amount' => $amount,
                        'email' => $email,
                        'reference' => $reference
                    ])
                ]);

                if (is_wp_error($response)) {
                    throw new Exception($response->get_error_message());
                }

                return json_decode(wp_remote_retrieve_body($response), true);

            default:
                throw new Exception('Payment gateway not supported: ' . $gateway);
        }
    }

    private function log_payment($order_id, $amount, $email, $gateway, $status) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'banimal_payments';

        $charset_collate = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            order_id varchar(100) NOT NULL,
            amount bigint(20) NOT NULL,
            email varchar(100) NOT NULL,
            gateway varchar(50) NOT NULL,
            status varchar(50) NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY (id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);

        $wpdb->insert($table_name, [
            'order_id' => $order_id,
            'amount' => $amount,
            'email' => $email,
            'gateway' => $gateway,
            'status' => $status
        ]);
    }

    private function push_global_storage($path) {
        $ecosystem_file = $path . '/ecosystem_data.json';

        if (!file_exists($ecosystem_file)) {
            return;
        }

        $data = json_decode(file_get_contents($ecosystem_file), true) ?: [];
        $backend_url = banimal_decrypt(get_option('backend_api_url'));

        if ($backend_url) {
            wp_remote_post($backend_url . '/family/update', [
                'body' => json_encode($data),
                'headers' => ['Content-Type' => 'application/json']
            ]);
        }

        $git_token = banimal_decrypt(get_option('git_api_key'));
        if ($git_token) {
            wp_remote_post('https://api.github.com/repos/fruitful-global-planet/contents/data.json', [
                'headers' => [
                    'Authorization' => 'token ' . $git_token,
                    'Content-Type' => 'application/json',
                    'User-Agent' => 'Banimal-Plugin'
                ],
                'body' => json_encode([
                    'message' => 'Automated push',
                    'content' => base64_encode(json_encode($data))
                ])
            ]);
        }

        $webhook_urls = get_option('webhook_urls');
        if ($webhook_urls) {
            $urls = array_filter(array_map('trim', explode(',', banimal_decrypt($webhook_urls))));
            foreach ($urls as $url) {
                if (filter_var($url, FILTER_VALIDATE_URL)) {
                    wp_remote_post($url, [
                        'body' => json_encode($data),
                        'headers' => ['Content-Type' => 'application/json']
                    ]);
                }
            }
        }
    }

    public function woocommerce_webhook_callback($request) {
        $webhook_secret = banimal_decrypt(get_option('woocommerce_webhook_secret'));
        $signature = $request->get_header('x-wc-webhook-signature');

        if ($signature && $webhook_secret && hash_equals(hash_hmac('sha256', $request->get_body(), $webhook_secret), $signature)) {
            $data = json_decode($request->get_body());

            if ($data && isset($data->id) && isset($data->status) && $data->status === 'completed') {
                $this->log_payment(
                    $data->id,
                    isset($data->total) ? floatval($data->total) * 100 : 0,
                    isset($data->billing->email) ? $data->billing->email : '',
                    'woocommerce',
                    'completed'
                );

                return new WP_REST_Response(['message' => 'Webhook processed'], 200);
            }
        }

        return new WP_REST_Response(['message' => 'Invalid webhook'], 401);
    }
}

// Initialize plugin
new Banimal_Plugin();
