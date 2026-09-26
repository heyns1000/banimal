<?php
/**
 * Fires only on explicit plugin deletion from the Plugins screen (not on
 * deactivation). This plugin never stores the API base URL or token in
 * the options table — those live only in wp-config.php constants — so
 * the only thing to clean up is the transient cache class-cache.php
 * creates under the 'fruitful_' key prefix.
 */
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

global $wpdb;

$wpdb->query(
    "DELETE FROM {$wpdb->options}
     WHERE option_name LIKE '\_transient\_fruitful\_%'
        OR option_name LIKE '\_transient\_timeout\_fruitful\_%'"
);
