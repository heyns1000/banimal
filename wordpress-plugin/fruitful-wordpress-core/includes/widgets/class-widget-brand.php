<?php
if (!defined('ABSPATH')) { exit; }

/**
 * The Elementor widget the integration guide's Phase 2 success criterion
 * asks for: "an editor can add a controlled Fruitful-powered widget to a
 * page without a public visitor receiving any credential." Renders
 * server-side by calling the API client + cache + schema validator
 * directly — never through this plugin's own REST bridge, which exists
 * for the editor's JS to call, not for PHP already running on the server
 * to loop back through HTTP onto itself.
 *
 * Everything shown here has already passed through
 * Fruitful_WP_Core_Schema_Validator::map_brand(), so there's no raw API
 * field this widget could accidentally print.
 */
class Fruitful_WP_Core_Widget_Brand extends \Elementor\Widget_Base {

    public function get_name() {
        return 'fruitful-brand';
    }

    public function get_title() {
        return __('Fruitful Brand', 'fruitful-wordpress-core');
    }

    public function get_icon() {
        return 'eicon-info-box';
    }

    public function get_categories() {
        return ['general'];
    }

    public function get_keywords() {
        return ['fruitful', 'brand'];
    }

    public function get_style_depends() {
        return ['fruitful-wp-core-frontend'];
    }

    protected function register_controls() {
        $this->start_controls_section(
            'content_section',
            [
                'label' => __('Brand', 'fruitful-wordpress-core'),
                'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'brand_id',
            [
                'label'       => __('Brand ID', 'fruitful-wordpress-core'),
                'type'        => \Elementor\Controls_Manager::TEXT,
                'default'     => '',
                'placeholder' => __('e.g. banimal', 'fruitful-wordpress-core'),
                'description' => __('The Fruitful entity ID for this brand — not a credential, safe to set here.', 'fruitful-wordpress-core'),
            ]
        );

        $this->add_control(
            'show_logo',
            [
                'label'        => __('Show logo', 'fruitful-wordpress-core'),
                'type'         => \Elementor\Controls_Manager::SWITCHER,
                'default'      => 'yes',
                'label_on'     => __('Show', 'fruitful-wordpress-core'),
                'label_off'    => __('Hide', 'fruitful-wordpress-core'),
                'return_value' => 'yes',
            ]
        );

        $this->add_control(
            'show_description',
            [
                'label'        => __('Show description', 'fruitful-wordpress-core'),
                'type'         => \Elementor\Controls_Manager::SWITCHER,
                'default'      => 'yes',
                'label_on'     => __('Show', 'fruitful-wordpress-core'),
                'label_off'    => __('Hide', 'fruitful-wordpress-core'),
                'return_value' => 'yes',
            ]
        );

        $this->add_control(
            'link_to_website',
            [
                'label'        => __('Link name to website', 'fruitful-wordpress-core'),
                'type'         => \Elementor\Controls_Manager::SWITCHER,
                'default'      => 'yes',
                'label_on'     => __('Yes', 'fruitful-wordpress-core'),
                'label_off'    => __('No', 'fruitful-wordpress-core'),
                'return_value' => 'yes',
            ]
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        $brand_id = sanitize_key($settings['brand_id'] ?? '');
        $is_editor = \Elementor\Plugin::$instance->editor->is_edit_mode();

        if ($brand_id === '') {
            if ($is_editor) {
                echo '<div style="padding:16px;border:1px dashed #ccc;color:#666;">';
                echo esc_html__('Fruitful Brand widget: enter a Brand ID in the panel on the left.', 'fruitful-wordpress-core');
                echo '</div>';
            }

            return;
        }

        if (!Fruitful_WP_Core_Settings::is_configured()) {
            if ($is_editor) {
                echo '<div style="padding:16px;border:1px dashed #ccc;color:#666;">';
                echo esc_html__('Fruitful Brand widget: the Fruitful API is not configured on this site (see the Fruitful Core admin page).', 'fruitful-wordpress-core');
                echo '</div>';
            }

            return;
        }

        $brand = $this->get_brand($brand_id);

        if (is_wp_error($brand)) {
            if ($is_editor) {
                echo '<div style="padding:16px;border:1px dashed #ccc;color:#666;">';
                echo esc_html(sprintf(
                    /* translators: %s: error message */
                    __('Fruitful Brand widget: %s', 'fruitful-wordpress-core'),
                    $brand->get_error_message()
                ));
                echo '</div>';
            }

            return;
        }

        $this->render_brand($brand, $settings);
    }

    /**
     * @return array|WP_Error The public display object from
     *                        Fruitful_WP_Core_Schema_Validator::map_brand().
     */
    private function get_brand($brand_id) {
        $client = new Fruitful_WP_Core_API_Client();

        $raw = Fruitful_WP_Core_Cache::remember(
            'brand:' . $brand_id,
            HOUR_IN_SECONDS,
            static function () use ($client, $brand_id) {
                return $client->get('/entities/Brand/' . rawurlencode($brand_id));
            }
        );

        if (is_wp_error($raw)) {
            return $raw;
        }

        return Fruitful_WP_Core_Schema_Validator::map_brand($raw);
    }

    private function render_brand(array $brand, array $settings) {
        echo '<div class="fruitful-wp-core-brand">';

        if (($settings['show_logo'] ?? 'yes') === 'yes' && $brand['logo_url'] !== '') {
            printf(
                '<img class="fruitful-wp-core-brand__logo" src="%s" alt="%s" loading="lazy" />',
                esc_url($brand['logo_url']),
                esc_attr($brand['name'])
            );
        }

        if ($brand['name'] !== '') {
            echo '<h3 class="fruitful-wp-core-brand__name">';

            if (($settings['link_to_website'] ?? 'yes') === 'yes' && $brand['website_url'] !== '') {
                printf(
                    '<a href="%s" target="_blank" rel="noopener noreferrer">%s</a>',
                    esc_url($brand['website_url']),
                    esc_html($brand['name'])
                );
            } else {
                echo esc_html($brand['name']);
            }

            echo '</h3>';
        }

        if (($settings['show_description'] ?? 'yes') === 'yes' && $brand['description'] !== '') {
            echo '<div class="fruitful-wp-core-brand__description">' . wp_kses_post($brand['description']) . '</div>';
        }

        echo '</div>';
    }
}
