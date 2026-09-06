<?php
if (!defined('ABSPATH')) { exit; }

/**
 * The only class in this plugin allowed to make outbound requests to the
 * Fruitful Core App. Brand connectors call this — never wp_remote_request()
 * directly — so every outgoing call gets the same auth header, timeout,
 * and error handling. Per the integration guide, this speaks read-mostly:
 * a generic write/delete surface is deliberately not exposed here.
 *
 * The `Authorization: Bearer` scheme matches the guide's example; if the
 * deployed Fruitful API ends up using request signatures instead, that
 * change belongs only in this file's request() method.
 */
class Fruitful_WP_Core_API_Client {

    public function get($path, array $query = []) {
        return $this->request('GET', $path, null, $query);
    }

    public function post($path, array $payload) {
        return $this->request('POST', $path, $payload);
    }

    private function request($method, $path, $payload = null, array $query = []) {
        $base_url = Fruitful_WP_Core_Settings::get_api_base_url();
        $token    = Fruitful_WP_Core_Settings::get_api_token();
        $timeout  = Fruitful_WP_Core_Settings::get_timeout();

        if ($base_url === '' || $token === '') {
            return new WP_Error(
                'fruitful_api_not_configured',
                __('Fruitful API is not configured.', 'fruitful-wordpress-core')
            );
        }

        $path = '/' . ltrim((string) $path, '/');
        $url  = add_query_arg($query, $base_url . $path);

        $args = [
            'method'  => strtoupper($method),
            'timeout' => $timeout,
            'headers' => [
                'Accept'        => 'application/json',
                'Authorization' => 'Bearer ' . $token,
                'User-Agent'    => 'Fruitful-WordPress-Core/' . FRUITFUL_WP_CORE_VERSION,
            ],
        ];

        if (null !== $payload) {
            $args['headers']['Content-Type'] = 'application/json';
            $args['body']                    = wp_json_encode($payload);
        }

        $response = wp_remote_request($url, $args);

        if (is_wp_error($response)) {
            Fruitful_WP_Core_Logger::error('Request failed', [
                'path'  => $path,
                'error' => $response->get_error_message(),
            ]);
            return $response;
        }

        $status = (int) wp_remote_retrieve_response_code($response);
        $body   = wp_remote_retrieve_body($response);

        if ($status < 200 || $status >= 300) {
            Fruitful_WP_Core_Logger::error('Non-2xx response', [
                'path'   => $path,
                'status' => $status,
            ]);

            return new WP_Error(
                'fruitful_api_error',
                __('Fruitful API request was unsuccessful.', 'fruitful-wordpress-core'),
                ['status' => $status]
            );
        }

        $data = json_decode($body, true);

        if (JSON_ERROR_NONE !== json_last_error()) {
            Fruitful_WP_Core_Logger::error('Invalid JSON response', ['path' => $path]);

            return new WP_Error(
                'fruitful_api_invalid_json',
                __('Fruitful API returned invalid JSON.', 'fruitful-wordpress-core')
            );
        }

        return $data;
    }
}
