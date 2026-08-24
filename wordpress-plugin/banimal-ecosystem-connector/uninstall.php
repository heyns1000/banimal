<?php
/**
 * Fires only on explicit plugin deletion from the Plugins screen (not on
 * deactivation) — removes the two options this plugin ever creates.
 */
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

delete_option('banimal_worker_base_url');
delete_option('banimal_worker_secret');
