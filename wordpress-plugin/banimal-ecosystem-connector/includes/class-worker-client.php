<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Signed HTTP client to the Banimal Cloudflare Worker. This is the ONLY
 * class in the plugin allowed to make outbound requests to the Worker.
 * It never calls Paystack, BobGo, GitHub, Google Drive, or any other
 * third-party service directly — those live exclusively behind the Worker.
 */
class Banimal_Worker_Client {

    private $base_url;
    private $secret;

    public function __construct($base_url, $secret) {
        $this->base_url = untrailingslashit((string) $base_url);
        $this->secret = (string) $secret;
    }

    public function is_configured() {
        return $this->base_url !== '' && $this->secret !== '';
    }

    /**
     * Send a signed event envelope to the Worker's /api/wp/events endpoint.
     * Returns true on 2xx, false otherwise. Never throws to the caller —
     * failures are logged and treated as non-fatal for the WordPress request
     * that triggered them (e.g. a WooCommerce status change still completes
     * even if the Worker is unreachable).
     */
    public function send_event($event_type, array $payload) {
        if (!$this->is_configured()) {
            error_log('[Banimal Connector] send_event skipped — Worker not configured');
            return false;
        }

        $body = wp_json_encode([
            'event_id'       => wp_generate_uuid4(),
            'event_type'     => $event_type,
            'schema_version' => '1.0',
            'occurred_at'    => gmdate('c'),
            'source'         => 'wordpress-plugin',
            'payload'        => $payload,
        ]);

        if ($body === false) {
            error_log('[Banimal Connector] send_event failed to encode payload for ' . $event_type);
            return false;
        }

        $signature = hash_hmac('sha256', $body, $this->secret);

        $response = wp_remote_post($this->base_url . '/api/wp/events', [
            'headers' => [
                'Content-Type'        => 'application/json',
                'X-Banimal-Signature' => $signature,
            ],
            'body'    => $body,
            'timeout' => 8,
        ]);

        if (is_wp_error($response)) {
            error_log('[Banimal Connector] send_event error: ' . $response->get_error_message());
            return false;
        }

        $code = wp_remote_retrieve_response_code($response);
        if ($code < 200 || $code >= 300) {
            error_log(sprintf('[Banimal Connector] send_event non-2xx (%d) for %s', $code, $event_type));
            return false;
        }

        return true;
    }

    /**
     * Server-side health check against the Worker's real /api/health
     * endpoint. Used only by the admin diagnostics AJAX handler — never
     * exposed to the browser directly, and carries no secret in the request
     * (the health endpoint is unauthenticated by design, matching the
     * Worker's existing app.get('/api/health', ...) route).
     */
    public function check_health() {
        if ($this->base_url === '') {
            return ['ok' => false, 'error' => 'Worker base URL not configured'];
        }

        $response = wp_remote_get($this->base_url . '/api/health', ['timeout' => 6]);

        if (is_wp_error($response)) {
            return ['ok' => false, 'error' => $response->get_error_message()];
        }

        $code = wp_remote_retrieve_response_code($response);
        $body = json_decode(wp_remote_retrieve_body($response), true);

        return [
            'ok'     => $code >= 200 && $code < 300,
            'status' => $code,
            'body'   => is_array($body) ? $body : null,
        ];
    }
}
