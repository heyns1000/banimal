<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Narrow, permission-checked WordPress REST routes for the Elementor
 * editor to read through — never a generic proxy onto the Fruitful API.
 * Every route here is GET-only, requires edit_pages, and returns a cached,
 * server-mapped response. A route that forwards an arbitrary path to the
 * Fruitful API belongs nowhere in this file; see the guide's "do not
 * build this" example for why.
 */
class Fruitful_WP_Core_REST_API {

    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes() {
        register_rest_route(
            'fruitful/v1',
            '/brands',
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [$this, 'list_brands'],
                'permission_callback' => [$this, 'can_edit_pages'],
            ]
        );

        register_rest_route(
            'fruitful/v1',
            '/brand/(?P<brand_id>[a-zA-Z0-9_-]+)',
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_brand'],
                'permission_callback' => [$this, 'can_edit_pages'],
                'args'                => [
                    'brand_id' => [
                        'sanitize_callback' => 'sanitize_key',
                    ],
                ],
            ]
        );
    }

    public function can_edit_pages() {
        return current_user_can('edit_pages');
    }

    public function list_brands() {
        $client = new Fruitful_WP_Core_API_Client();

        return rest_ensure_response(
            Fruitful_WP_Core_Cache::remember(
                'brands:editor',
                10 * MINUTE_IN_SECONDS,
                static function () use ($client) {
                    return $client->get('/entities/Brand', ['limit' => 100]);
                }
            )
        );
    }

    public function get_brand(WP_REST_Request $request) {
        $brand_id = sanitize_key($request->get_param('brand_id'));
        $client   = new Fruitful_WP_Core_API_Client();

        return rest_ensure_response(
            Fruitful_WP_Core_Cache::remember(
                'brand:' . $brand_id,
                HOUR_IN_SECONDS,
                static function () use ($client, $brand_id) {
                    return $client->get('/entities/Brand/' . rawurlencode($brand_id));
                }
            )
        );
    }
}
