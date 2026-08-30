<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Relays WooCommerce order events to the Worker. Entirely inert when
 * WooCommerce is not active — registers no hooks, holds no state, and
 * never writes its own payment/order tables. Whether a production
 * WooCommerce store actually exists is an open question (see the system
 * design doc, §8.1); this module is safe to ship either way.
 */
class Banimal_WooCommerce_Bridge {

    private $client;

    public function __construct(Banimal_Worker_Client $client) {
        $this->client = $client;

        if (!class_exists('WooCommerce')) {
            return;
        }

        add_action('woocommerce_order_status_changed', [$this, 'on_order_status_changed'], 10, 4);
    }

    public function on_order_status_changed($order_id, $status_from, $status_to, $order) {
        if (!$this->client->is_configured()) {
            return;
        }

        $wc_order = ($order instanceof WC_Order) ? $order : wc_get_order($order_id);
        if (!$wc_order) {
            return;
        }

        $this->client->send_event('woocommerce.order_status_changed', [
            'wc_order_id'    => $order_id,
            'status_from'    => $status_from,
            'status_to'      => $status_to,
            'total'          => $wc_order->get_total(),
            'currency'       => $wc_order->get_currency(),
            'customer_email' => $wc_order->get_billing_email(),
        ]);
    }
}
