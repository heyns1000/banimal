<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Serves the bundled Fruitful™ OmniGrid app (app/) from this site at /fruitful-app/,
 * so the whole app — every page, terminal and data file — runs inside WordPress
 * under the site's own domain. Static files only: no PHP from app/ is ever executed.
 *
 * Also adds [fruitful_app] to embed any app page in a post, and an admin screen.
 * A missing page never shows a 404: it redirects to the nearest real page.
 */
class Banimal_Fruitful_App {

    const SLUG = 'fruitful-app';
    const QUERY_VAR = 'banimal_app_path';
    const RULES_OPTION = 'banimal_app_rules_version';

    private static $types = [
        'html' => 'text/html; charset=utf-8', 'htm' => 'text/html; charset=utf-8',
        'js' => 'application/javascript; charset=utf-8', 'css' => 'text/css; charset=utf-8',
        'json' => 'application/json; charset=utf-8', 'txt' => 'text/plain; charset=utf-8', 'xml' => 'application/xml; charset=utf-8',
        'png' => 'image/png', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'gif' => 'image/gif',
        'svg' => 'image/svg+xml', 'webp' => 'image/webp', 'ico' => 'image/x-icon',
        'mp4' => 'video/mp4', 'webm' => 'video/webm', 'mp3' => 'audio/mpeg',
        'woff' => 'font/woff', 'woff2' => 'font/woff2', 'ttf' => 'font/ttf', 'pdf' => 'application/pdf',
    ];

    public function __construct() {
        add_action('init', [__CLASS__, 'add_rules']);
        add_action('init', [$this, 'maybe_flush'], 20);
        add_filter('query_vars', [$this, 'query_vars']);
        add_action('parse_request', [$this, 'serve']);
        add_filter('redirect_canonical', [$this, 'no_canonical_redirect'], 10, 2);
        add_shortcode('fruitful_app', [$this, 'shortcode']);
        add_action('admin_menu', [$this, 'admin_menu'], 20);
    }

    public static function app_dir() {
        return BANIMAL_CONNECTOR_DIR . 'app/';
    }

    public static function is_bundled() {
        return is_file(self::app_dir() . 'index.html');
    }

    public static function url($path = '') {
        return home_url('/' . self::SLUG . '/' . ltrim($path, '/'));
    }

    public static function add_rules() {
        add_rewrite_rule('^' . self::SLUG . '(?:/(.*))?$', 'index.php?' . self::QUERY_VAR . '=/$matches[1]', 'top');
    }

    /** Rewrite rules are flushed once per plugin version, so an upload-and-replace update needs no reactivation. */
    public function maybe_flush() {
        if (get_option(self::RULES_OPTION) !== BANIMAL_CONNECTOR_VERSION) {
            flush_rewrite_rules(false);
            update_option(self::RULES_OPTION, BANIMAL_CONNECTOR_VERSION, false);
        }
    }

    public static function activate() {
        self::add_rules();
        flush_rewrite_rules(false);
        update_option(self::RULES_OPTION, BANIMAL_CONNECTOR_VERSION, false);
    }

    public static function deactivate() {
        flush_rewrite_rules(false);
        delete_option(self::RULES_OPTION);
    }

    public function query_vars($vars) {
        $vars[] = self::QUERY_VAR;
        return $vars;
    }

    public function no_canonical_redirect($redirect, $requested) {
        return (strpos((string) $requested, '/' . self::SLUG) !== false) ? false : $redirect;
    }

    public function serve($wp) {
        if (!isset($wp->query_vars[self::QUERY_VAR])) {
            return;
        }
        // Read the path from the request itself: WordPress trims trailing slashes before matching rules,
        // and a folder's trailing slash matters for the app's relative links.
        $request_path = (string) wp_parse_url(isset($_SERVER['REQUEST_URI']) ? wp_unslash($_SERVER['REQUEST_URI']) : '', PHP_URL_PATH);
        $prefix = rtrim((string) wp_parse_url(self::url(), PHP_URL_PATH), '/');
        $rest = (strpos($request_path, $prefix) === 0) ? substr($request_path, strlen($prefix)) : (string) $wp->query_vars[self::QUERY_VAR];
        $path = ltrim(str_replace('\\', '/', rawurldecode($rest)), '/');

        // "/fruitful-app" without the slash: relative links inside the app need the trailing slash.
        if ($rest === '') {
            wp_safe_redirect(self::url(), 301);
            exit;
        }
        if (!self::is_bundled()) {
            wp_die('The Fruitful™ app files are not in this copy of the plugin. Upload the full release zip.', 'Fruitful™ app', ['response' => 503]);
        }

        $root = realpath(self::app_dir());
        if ($path === '' || substr($path, -1) === '/') {
            $path .= 'index.html';
        }
        // Static files only, nothing hidden, nothing outside app/.
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $file = ($path !== '' && strpos($path, "\0") === false && !preg_match('#(^|/)\.#', $path)) ? realpath($root . '/' . $path) : false;
        if ($file && is_dir($file)) {
            wp_safe_redirect(self::url(trailingslashit($path)), 301);
            exit;
        }
        if (!$file || strpos($file, $root . DIRECTORY_SEPARATOR) !== 0 || !is_file($file) || !isset(self::$types[$ext])) {
            $this->nearest($root, $path);
        }

        $long = !in_array($ext, ['html', 'htm', 'json'], true);
        status_header(200);
        header('Content-Type: ' . self::$types[$ext]);
        header('Content-Length: ' . filesize($file));
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: public, max-age=' . ($long ? 86400 : 300));
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($file)) . ' GMT');
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'HEAD') {
            exit;
        }
        readfile($file);
        exit;
    }

    /** No 404s: send a missing page to the nearest real page above it, ending at the app home. */
    private function nearest($root, $path) {
        $dir = trim(dirname($path), './');
        while ($dir !== '') {
            if (is_file($root . '/' . $dir . '/index.html')) {
                wp_safe_redirect(self::url($dir . '/'), 302);
                exit;
            }
            $dir = trim(dirname($dir), './');
        }
        wp_safe_redirect(self::url(), 302);
        exit;
    }

    /** [fruitful_app page="ecosystem.html" height="85vh"] */
    public function shortcode($atts) {
        $a = shortcode_atts(['page' => '', 'height' => '85vh'], $atts, 'fruitful_app');
        $page = ltrim(preg_replace('#[^A-Za-z0-9_\-./]#', '', (string) $a['page']), '/');
        $page = str_replace('..', '', $page);
        $height = preg_match('/^\d{2,4}(px|vh|%)$/', (string) $a['height']) ? $a['height'] : '85vh';
        return '<iframe class="fruitful-app-embed" src="' . esc_url(self::url($page)) . '" style="width:100%;height:' . esc_attr($height) .
            ';border:0;border-radius:12px;background:#FBF4E4" loading="lazy" title="Fruitful™ OmniGrid™"></iframe>';
    }

    public function admin_menu() {
        add_submenu_page(BANIMAL_CONNECTOR_SLUG, 'Fruitful™ App', 'Fruitful™ App', 'manage_options', BANIMAL_CONNECTOR_SLUG . '-app', [$this, 'render_page']);
    }

    public function render_page() {
        $info = self::is_bundled() && is_file(self::app_dir() . 'bundle.json') ? json_decode((string) file_get_contents(self::app_dir() . 'bundle.json'), true) : null;
        ?>
        <div class="wrap">
            <h1>Fruitful™ App</h1>
            <?php if (!get_option('permalink_structure')) : ?>
                <div class="notice notice-warning"><p>The app needs pretty permalinks. Go to <a href="<?php echo esc_url(admin_url('options-permalink.php')); ?>">Settings → Permalinks</a>, choose any option except Plain, and save.</p></div>
            <?php endif; ?>
            <?php if (!self::is_bundled()) : ?>
                <div class="notice notice-error"><p>The app files are missing from this copy of the plugin. Upload the full release zip.</p></div>
            <?php else : ?>
                <p>The full Fruitful™ OmniGrid™ app runs on this site at
                    <a href="<?php echo esc_url(self::url()); ?>" target="_blank" rel="noopener"><code><?php echo esc_html(self::url()); ?></code></a>.
                    Add that link to your menu, or embed any page in a post with <code>[fruitful_app page="ecosystem.html"]</code>.</p>
                <?php if ($info) : ?>
                    <p class="description">Bundle: <?php echo esc_html((int) $info['files']); ?> files from <code><?php echo esc_html($info['source'] . ' ' . $info['branch'] . '@' . $info['commit']); ?></code>.</p>
                <?php endif; ?>
                <p><a class="button button-primary" href="<?php echo esc_url(self::url()); ?>" target="_blank" rel="noopener">Open the app</a>
                    <a class="button" href="<?php echo esc_url(self::url('ecosystem.html')); ?>" target="_blank" rel="noopener">Global Ecosystem</a>
                    <a class="button" href="<?php echo esc_url(self::url('hat.html')); ?>" target="_blank" rel="noopener">A–Z Index</a></p>
                <iframe src="<?php echo esc_url(self::url()); ?>" style="width:100%;height:75vh;border:1px solid #dcdcde;border-radius:8px;background:#fff" title="Fruitful™ OmniGrid™"></iframe>
            <?php endif; ?>
        </div>
        <?php
    }
}
