<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Single place every capability check in this plugin goes through, so the
 * REST bridge, the admin status page, and the Elementor widget can't drift
 * from each other on who's allowed to see Fruitful-sourced data. Per the
 * integration guide's security checklist: editors get a narrow
 * WordPress-authenticated route, never a Fruitful credential — this class
 * is what "narrow" means in code, not a place to widen access later.
 */
class Fruitful_WP_Core_Permissions {

    /**
     * Can this request read Fruitful-sourced data through the plugin's
     * REST bridge or see it rendered in the Elementor editor? Deliberately
     * the same capability an editor already needs to build a page with —
     * no new role or capability is introduced by this plugin.
     */
    public static function can_read_brand_data() {
        return current_user_can('edit_pages');
    }

    /**
     * Can this request see the plugin's own connection status / cache
     * diagnostics? That's operational information about the site's own
     * configuration, not Fruitful data, so it stays at the higher bar the
     * rest of wp-admin's settings screens use.
     */
    public static function can_view_diagnostics() {
        return current_user_can('manage_options');
    }
}
