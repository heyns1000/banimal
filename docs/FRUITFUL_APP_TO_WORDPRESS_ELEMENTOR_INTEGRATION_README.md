# Fruitful App → WordPress + Elementor Integration README

> **Goal:** Use the Fruitful app/API as the controlled data and automation backbone for multiple WordPress + Elementor websites—including Banimal—without exposing secrets or making each website a separate unmanaged system.
>
> This guide assumes **zero website knowledge** at the start and moves step by step to an implementation that a developer can build, test, operate, and extend.

---

## 1. The Simple Explanation

Imagine your business has a central brain and many storefronts.

- The **Fruitful app** is the central brain. It stores and manages shared business data: brands, products, directories, barcodes, subscriptions, operational records, and other approved entities.
- A **WordPress website** is a storefront. It publishes pages, articles, products, forms, and customer experiences.
- **Elementor** is the visual editor used to build WordPress pages without manually writing HTML for every page.
- The **Banimal Ecosystem Connector** is a WordPress plugin that connects the Banimal WordPress site to the Fruitful/Banimal data and workflow layer.
- An **API** is the controlled messenger between systems.
- **AI** is an optional assistant that can draft content, but it must not receive secrets, make unsupervised business decisions, or publish unreviewed claims.

The desired system is:

```text
Fruitful App and approved APIs
        │
        │  Server-to-server authenticated requests
        ▼
WordPress connector plugin
        │
        ├── Banimal Ecosystem Connector
        ├── Future Fruitful brand connectors
        └── Shared WordPress integration library
        │
        ▼
Elementor widgets, controls, forms and templates
        │
        ▼
Public WordPress websites
```

The public visitor sees a fast website. The editor sees Elementor controls. The browser never sees your private Fruitful API tokens.

---

## 2. What This System Can Build

Using the Fruitful app plus a reusable WordPress/Elementor connector pattern, you can build many website types from one governed foundation.

| Website or app type | What Elementor displays | What the Fruitful app/API provides |
|---|---|---|
| Brand website | Hero sections, brand stories, stockists, campaigns, forms | Brand profile, approved copy, design tokens, locations |
| E-commerce site | Product grids, collections, product finders, order forms | Product catalogue, SKU/barcode mappings, stock or enrichment data |
| Directory or marketplace | Searchable listings, filters, maps, profiles | DirectoryEntry records, categories, regions, contact details |
| Wholesale portal | Account request forms, catalogue cards, enquiry routing | Brand data, product data, CRM/lead events |
| Subscription service | Plan comparisons, sign-up flows, account onboarding | SubscriptionBox records, pricing and package metadata |
| Operations dashboard | Private admin displays, health checks, reports | Metrics and operational entity records |
| AI-assisted content site | Drafted page sections, FAQs, product stories, metadata | Approved brand rules, structured product facts, content constraints |
| Banimal website | Brand hero, products, animal-focused forms, campaigns | Banimal brand data, WooCommerce data, Banimal Worker workflows |

The supplied Fruitful OpenAPI specification contains entity-style endpoints for data such as `Brand`, `DirectoryEntry`, `BarcodeMapping`, `SubscriptionBox`, and `Metrics`; those can be used as carefully selected read models for website widgets. The API also includes create, update, bulk, soft-delete, and restore patterns, so public websites should normally be restricted to **read-only** access unless there is a tightly controlled server-side workflow. [file:24]

---

## 3. The Golden Rule

**Your WordPress browser is not your backend.**

Never allow Elementor, visitor-facing JavaScript, public page HTML, or a WordPress page export to contain any of the following:

- Fruitful API secret keys.
- Banimal Worker secrets.
- Bearer tokens.
- Database passwords.
- Webhook signing secrets.
- Private API base URLs that should not be public.
- Unrestricted write permissions.
- AI-provider keys.

Use this safe direction instead:

```text
Visitor or Elementor editor browser
        │
        │ Only public data or authenticated WordPress requests
        ▼
WordPress plugin
        │
        │ Protected, server-to-server authentication
        ▼
Fruitful app / Banimal Worker / approved AI service
```

---

## 4. Beginner Vocabulary

| Term | Meaning in plain language |
|---|---|
| Domain | The website name people type, for example `example.com`. |
| Hosting | The server/computer on the internet where your WordPress website runs. |
| WordPress | Website software that runs on your hosting. |
| Plugin | An add-on that gives WordPress new features. |
| Theme | The visual foundation of a WordPress site. |
| Elementor | A drag-and-drop visual page builder inside WordPress. |
| Elementor widget | A reusable visual block, such as a product grid or hero section. |
| Elementor control | A setting in the Elementor sidebar, such as text, image, colour, dropdown, slider, or toggle. |
| API | A structured way for software systems to exchange data. |
| Endpoint | One API address that performs one defined task. |
| REST API | A widely used API convention using URLs and HTTP methods such as GET and POST. |
| GET | Read data. It should not alter records. |
| POST | Create or submit data. |
| PUT/PATCH | Update data. |
| DELETE | Remove or soft-delete data. |
| JSON | Structured data text exchanged by APIs. |
| Authentication | Proving a request is allowed to access a system. |
| Authorization | Checking what an authenticated person or system is permitted to do. |
| Webhook | An automatic notification sent from one system to another when an event occurs. |
| Nonce | A WordPress short-lived security value used to protect authenticated requests. |
| Environment variable | A secret configuration value stored outside your committed source code. |
| Staging | A private test copy of your website. |
| Production | The live website used by real visitors. |
| AI | A tool that can generate content or assist with tasks from instructions. |

---

## 5. Architecture You Should Use

Build one shared connection pattern, then give each brand its own connector configuration and widgets.

```text
┌──────────────────────────────────────────────────────────────┐
│ Fruitful Core App                                             │
│                                                              │
│  Brands • products • directories • barcodes • subscriptions  │
│  metrics • workflow data • approved brand metadata           │
└──────────────────────────────────────────────────────────────┘
                         │
                         │ HTTPS + server authentication
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ Shared WordPress Integration Layer                            │
│                                                              │
│  API client • caching • schema validation • logs • security  │
│  WordPress REST bridge • Elementor integration base          │
└──────────────────────────────────────────────────────────────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
┌────────────────┐ ┌────────────────┐ ┌──────────────────────┐
│ Banimal plugin │ │ Brand X plugin │ │ Future brand plugins  │
│ / widgets      │ │ / widgets      │ │ / widgets             │
└────────────────┘ └────────────────┘ └──────────────────────┘
              │          │          │
              └──────────┴──────────┘
                         ▼
                Elementor and WordPress
                         ▼
                Website visitors and editors
```

### Why this architecture matters

Do not make every website call the Fruitful API differently. That causes repeated bugs, inconsistent security, duplicate API code, and different data definitions across brands.

Instead:

1. Create a **shared client** that knows how to call the Fruitful API safely.
2. Create **brand plugins** such as Banimal that provide brand-specific widgets, form actions, and configuration.
3. Use Elementor only as the visual composition layer.
4. Keep important business logic in the Fruitful app or secure WordPress server code.

---

## 6. Recommended Repository Layout

A scalable repository layout looks like this:

```text
fruitful-platform/
├── apps/
│   ├── fruitful-core-app/                 ← central app/API
│   ├── banimal-worker/                    ← Banimal domain workflows
│   └── other-apps/
├── packages/
│   ├── fruitful-api-contracts/            ← OpenAPI-derived schemas/types
│   ├── fruitful-brand-tokens/             ← shared colour/type/spacing tokens
│   └── fruitful-content-rules/            ← approved content constraints
├── wordpress-plugins/
│   ├── fruitful-wordpress-core/           ← shared API/security/cache layer
│   ├── banimal-ecosystem-connector/       ← Banimal-specific integration
│   └── fruitful-elementor-toolkit/        ← optional reusable Elementor base
└── docs/
    ├── architecture/
    ├── runbooks/
    └── api/
```

If the existing Banimal plugin must remain in the `banimal` repository, keep it there. The important principle is that shared code should be extracted only when it is stable enough to be truly reusable.

---

## 7. Which API Operations Are Safe

The Fruitful OpenAPI file contains broad entity CRUD patterns—list, get-by-ID, create, update, bulk operations, soft deletes, and restore. This is powerful, but not every operation belongs in a public-facing website. [file:24]

| User or system action | Recommended access | Reason |
|---|---|---|
| Show products, brands, directory listings, public metrics | Read-only `GET`, usually cached | Low risk when data is explicitly public |
| Elementor editor previews | WordPress-authenticated read route | Editors may see draft or restricted data |
| Submit a contact/quote/wholesale form | Server-side `POST` to a narrow lead endpoint | Validate and minimise data before sending |
| Update public profile owned by logged-in user | Dedicated limited route with ownership checks | Never expose generic entity update routes |
| Create a new product | Admin-only app workflow, not public Elementor | Needs validation, approvals, audit trail |
| Bulk update records | Central app only | High blast radius if configured incorrectly |
| Delete many records | Central app only, protected and reviewed | The OpenAPI specification warns that an empty delete query can delete all records in an entity |
| Restore soft-deleted records | Central app only | Operational recovery action requiring permission |

The supplied OpenAPI description explicitly notes that some entity delete-many endpoints can delete **all** records when an empty query is supplied. Never surface generic bulk-delete controls through Elementor or public WordPress routes. [file:24]

---

## 8. Build the Shared Core Plugin

Create a shared plugin called `fruitful-wordpress-core`. It must not contain Banimal-only labels, widgets, or business rules.

```text
wordpress-plugins/fruitful-wordpress-core/
├── fruitful-wordpress-core.php
├── includes/
│   ├── class-plugin.php
│   ├── class-settings.php
│   ├── class-api-client.php
│   ├── class-cache.php
│   ├── class-rest-api.php
│   ├── class-logger.php
│   ├── class-permissions.php
│   └── class-schema-validator.php
└── uninstall.php
```

### 8.1 Main plugin file

Create `fruitful-wordpress-core.php`:

```php
<?php
/**
 * Plugin Name: Fruitful WordPress Core
 * Description: Shared Fruitful API, security, caching and WordPress integration layer.
 * Version: 1.0.0
 * Author: Fruitful Holdings (Pty) Ltd
 * Text Domain: fruitful-wordpress-core
 */

defined( 'ABSPATH' ) || exit;

define( 'FRUITFUL_WP_CORE_VERSION', '1.0.0' );
define( 'FRUITFUL_WP_CORE_FILE', __FILE__ );
define( 'FRUITFUL_WP_CORE_PATH', plugin_dir_path( __FILE__ ) );
define( 'FRUITFUL_WP_CORE_URL', plugin_dir_url( __FILE__ ) );

require_once FRUITFUL_WP_CORE_PATH . 'includes/class-plugin.php';
require_once FRUITFUL_WP_CORE_PATH . 'includes/class-settings.php';
require_once FRUITFUL_WP_CORE_PATH . 'includes/class-api-client.php';
require_once FRUITFUL_WP_CORE_PATH . 'includes/class-cache.php';
require_once FRUITFUL_WP_CORE_PATH . 'includes/class-rest-api.php';
require_once FRUITFUL_WP_CORE_PATH . 'includes/class-logger.php';

add_action(
    'plugins_loaded',
    static function() {
        Fruitful_WP_Core_Plugin::instance();
        Fruitful_WP_Core_REST_API::instance();
    }
);
```

### 8.2 Core plugin loader

Create `includes/class-plugin.php`:

```php
<?php

defined( 'ABSPATH' ) || exit;

final class Fruitful_WP_Core_Plugin {

    private static $instance = null;

    public static function instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct() {
        add_action( 'admin_notices', array( $this, 'configuration_notice' ) );
    }

    public function configuration_notice() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        $api_base_url = defined( 'FRUITFUL_API_BASE_URL' ) ? FRUITFUL_API_BASE_URL : '';
        $api_token    = defined( 'FRUITFUL_API_TOKEN' ) ? FRUITFUL_API_TOKEN : '';

        if ( empty( $api_base_url ) || empty( $api_token ) ) {
            echo '<div class="notice notice-warning"><p>';
            echo esc_html__( 'Fruitful WordPress Core is active but the Fruitful API server configuration is incomplete.', 'fruitful-wordpress-core' );
            echo '</p></div>';
        }
    }
}
```

### 8.3 Add secrets outside source code

On a secure server, add configuration to `wp-config.php` or the host’s environment-variable panel:

```php
// Example only. Do not commit real values into Git.
define( 'FRUITFUL_API_BASE_URL', 'https://api.example.internal' );
define( 'FRUITFUL_API_TOKEN', 'replace-with-a-long-random-server-side-secret' );
define( 'FRUITFUL_API_TIMEOUT', 15 );
```

Never paste a real token into this README, GitHub issue, chat, Elementor control, screenshot, browser JavaScript, or public repository.

---

## 9. Build the Shared Fruitful API Client

The API client is the only code that should make outgoing calls to the Fruitful Core App.

Create `includes/class-api-client.php`:

```php
<?php

defined( 'ABSPATH' ) || exit;

final class Fruitful_WP_Core_API_Client {

    public function get( $path, array $query = array() ) {
        return $this->request( 'GET', $path, null, $query );
    }

    public function post( $path, array $payload ) {
        return $this->request( 'POST', $path, $payload );
    }

    private function request( $method, $path, $payload = null, array $query = array() ) {
        $base_url = rtrim( (string) FRUITFUL_API_BASE_URL, '/' );
        $token    = (string) FRUITFUL_API_TOKEN;
        $timeout  = defined( 'FRUITFUL_API_TIMEOUT' ) ? absint( FRUITFUL_API_TIMEOUT ) : 15;

        if ( empty( $base_url ) || empty( $token ) ) {
            return new WP_Error(
                'fruitful_api_not_configured',
                __( 'Fruitful API is not configured.', 'fruitful-wordpress-core' )
            );
        }

        $path = '/' . ltrim( (string) $path, '/' );
        $url  = add_query_arg( $query, $base_url . $path );

        $args = array(
            'method'  => strtoupper( $method ),
            'timeout' => $timeout,
            'headers' => array(
                'Accept'        => 'application/json',
                'Authorization' => 'Bearer ' . $token,
                'User-Agent'    => 'Fruitful-WordPress-Core/' . FRUITFUL_WP_CORE_VERSION,
            ),
        );

        if ( null !== $payload ) {
            $args['headers']['Content-Type'] = 'application/json';
            $args['body']                    = wp_json_encode( $payload );
        }

        $response = wp_remote_request( $url, $args );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $status = (int) wp_remote_retrieve_response_code( $response );
        $body   = wp_remote_retrieve_body( $response );
        $data   = json_decode( $body, true );

        if ( $status < 200 || $status >= 300 ) {
            return new WP_Error(
                'fruitful_api_error',
                __( 'Fruitful API request was unsuccessful.', 'fruitful-wordpress-core' ),
                array(
                    'status' => $status,
                )
            );
        }

        if ( JSON_ERROR_NONE !== json_last_error() ) {
            return new WP_Error(
                'fruitful_api_invalid_json',
                __( 'Fruitful API returned invalid JSON.', 'fruitful-wordpress-core' )
            );
        }

        return $data;
    }
}
```

### Important implementation note

The `Authorization: Bearer` convention is an example. Use the exact authentication scheme required by your deployed Fruitful API. If you use request signatures instead of bearer tokens, implement those signatures only in this server-side client.

---

## 10. Cache Public Read Data

Do not call your app API every time a public page loads. It creates cost, slow pages, rate-limit pressure, and a single point of failure.

Create `includes/class-cache.php`:

```php
<?php

defined( 'ABSPATH' ) || exit;

final class Fruitful_WP_Core_Cache {

    public static function remember( $key, $seconds, callable $callback ) {
        $cache_key = 'fruitful_' . md5( $key );
        $value     = get_transient( $cache_key );

        if ( false !== $value ) {
            return $value;
        }

        $value = call_user_func( $callback );

        if ( ! is_wp_error( $value ) ) {
            set_transient( $cache_key, $value, absint( $seconds ) );
        }

        return $value;
    }

    public static function forget( $key ) {
        delete_transient( 'fruitful_' . md5( $key ) );
    }
}
```

Example use:

```php
$client = new Fruitful_WP_Core_API_Client();

$brands = Fruitful_WP_Core_Cache::remember(
    'brands:public:limit=100',
    HOUR_IN_SECONDS,
    static function() use ( $client ) {
        return $client->get( '/entities/Brand', array( 'limit' => 100 ) );
    }
);
```

Cache duration depends on the data:

| Data | Suggested first cache setting |
|---|---|
| Brand names and design tokens | 1 hour to 24 hours |
| Directory entries | 5 to 60 minutes |
| Product catalogue cards | 5 to 30 minutes |
| Stock availability | 1 to 5 minutes, if safe and necessary |
| Campaign page content | 5 to 30 minutes |
| Admin previews | No cache or very short cache |

---

## 11. Expose Narrow WordPress REST Routes

Elementor editor interfaces may need data from WordPress. Provide narrow, safe routes—not a generic proxy that lets a browser call any Fruitful API path.

Create `includes/class-rest-api.php`:

```php
<?php

defined( 'ABSPATH' ) || exit;

final class Fruitful_WP_Core_REST_API {

    private static $instance = null;

    public static function instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
    }

    public function register_routes() {
        register_rest_route(
            'fruitful/v1',
            '/brands',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'list_brands' ),
                'permission_callback' => array( $this, 'can_edit_pages' ),
            )
        );

        register_rest_route(
            'fruitful/v1',
            '/brand/(?P<brand_id>[a-zA-Z0-9_-]+)',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_brand' ),
                'permission_callback' => array( $this, 'can_edit_pages' ),
                'args'                => array(
                    'brand_id' => array(
                        'sanitize_callback' => 'sanitize_key',
                    ),
                ),
            )
        );
    }

    public function can_edit_pages() {
        return current_user_can( 'edit_pages' );
    }

    public function list_brands() {
        $client = new Fruitful_WP_Core_API_Client();

        return rest_ensure_response(
            Fruitful_WP_Core_Cache::remember(
                'brands:editor',
                10 * MINUTE_IN_SECONDS,
                static function() use ( $client ) {
                    return $client->get( '/entities/Brand', array( 'limit' => 100 ) );
                }
            )
        );
    }

    public function get_brand( WP_REST_Request $request ) {
        $brand_id = sanitize_key( $request->get_param( 'brand_id' ) );
        $client   = new Fruitful_WP_Core_API_Client();

        return rest_ensure_response(
            Fruitful_WP_Core_Cache::remember(
                'brand:' . $brand_id,
                HOUR_IN_SECONDS,
                static function() use ( $client, $brand_id ) {
                    return $client->get( '/entities/Brand/' . rawurlencode( $brand_id ) );
                }
            )
        );
    }
}
```

### Do not create this dangerous route

```php
// DO NOT BUILD THIS: it turns WordPress into an unrestricted API proxy.
register_rest_route( 'fruitful/v1', '/proxy/(?P<path>.*)', ... );
```

A generic proxy can accidentally expose write/delete routes, internal records, administrative endpoints, tokens, or data never intended for a public website.

---

## 12. Create a Reusable Elementor Base

Elementor should receive structured data through WordPress, not directly from Fruitful’s private API.

### 12.1 A generic brand selector control

A custom selector can start as a regular text field and later become a searchable Select2 field powered by the protected `/wp-json/fruitful/v1/brands` route.

```php
$this->add_control(
    'fruitful_brand_id',
    array(
        'label'       => esc_html__( 'Fruitful Brand ID', 'fruitful-elementor-toolkit' ),
        'type'        => \Elementor\Controls_Manager::TEXT,
        'placeholder' => 'e.g. banimal',
        'dynamic'     => array( 'active' => true ),
    )
);
```

### 12.2 Reusable brand hero widget concept

Every brand can use a shared hero base with brand-specific templates:

```text
Fruitful Brand Hero widget
        │
        ├── Brand ID
        ├── Eyebrow
        ├── Headline
        ├── Description
        ├── CTA label + URL
        ├── Image / video
        ├── Approved colour/style variation
        └── AI drafting control where appropriate
```

The Banimal connector can register `Banimal Brand Hero` as a preconfigured, opinionated wrapper around this shared pattern.

---

## 13. Connect the Banimal Plugin

The Banimal connector should remain the **Banimal domain layer**. It should use Fruitful WordPress Core rather than repeating API authentication, caching, logging, and REST security.

```text
Fruitful WordPress Core
        ↑ provides API client, caching, logs and protected REST support
        │
Banimal Ecosystem Connector
        ↑ provides Banimal widgets, brand rules, WooCommerce bridge and lead routing
        │
Elementor site
```

### 13.1 Banimal plugin dependency check

Add this to the Banimal plugin’s startup logic:

```php
if ( ! defined( 'FRUITFUL_WP_CORE_VERSION' ) ) {
    add_action(
        'admin_notices',
        static function() {
            if ( current_user_can( 'activate_plugins' ) ) {
                echo '<div class="notice notice-error"><p>';
                echo esc_html__( 'Banimal Ecosystem Connector requires the Fruitful WordPress Core plugin.', 'banimal-ecosystem-connector' );
                echo '</p></div>';
            }
        }
    );
    return;
}
```

### 13.2 Banimal product service

Create a Banimal service class that chooses an approved product source:

```php
<?php

defined( 'ABSPATH' ) || exit;

final class Banimal_Product_Service {

    public function get_featured_products( $limit = 6 ) {
        $limit = max( 1, min( 24, absint( $limit ) ) );

        if ( class_exists( 'WooCommerce' ) ) {
            return $this->get_woocommerce_products( $limit );
        }

        $client = new Fruitful_WP_Core_API_Client();

        return Fruitful_WP_Core_Cache::remember(
            'banimal:featured-products:' . $limit,
            10 * MINUTE_IN_SECONDS,
            static function() use ( $client, $limit ) {
                return $client->get( '/entities/BarcodeMapping', array( 'limit' => $limit ) );
            }
        );
    }

    private function get_woocommerce_products( $limit ) {
        $query = new WP_Query(
            array(
                'post_type'      => 'product',
                'post_status'    => 'publish',
                'posts_per_page' => $limit,
            )
        );

        return $query;
    }
}
```

This example reflects the Fruitful specification’s `BarcodeMapping` entity as a possible source of SKU/barcode-oriented data. Do not assume it is a complete product catalogue unless your actual schema and business rules define it that way. [file:24]

---

## 14. WordPress + Elementor Form Pattern

A public Elementor form should never call a generic Fruitful create endpoint directly. Create a purpose-built lead endpoint or send the form through a server-side Banimal/WordPress action.

### Correct data flow

```text
Visitor completes Elementor form
        ↓
Elementor Pro Form Action
        ↓
Banimal Lead Router (WordPress server)
        ↓
Validate, sanitise, add source metadata, rate-limit
        ↓
Purpose-built Fruitful/Banimal lead endpoint
        ↓
CRM, queue, staff notification, audit log
```

### Minimum fields to send

```json
{
  "brand_id": "banimal",
  "lead_type": "wholesale",
  "name": "Example Customer",
  "email": "customer@example.com",
  "message": "I would like wholesale information.",
  "source": {
    "website": "https://example.com",
    "page_url": "https://example.com/wholesale/",
    "form_name": "Wholesale enquiry"
  },
  "consent": true
}
```

### Required protections

- CAPTCHA or anti-spam protection.
- Rate limits.
- Input sanitisation.
- Email validation.
- Consent checkbox where applicable.
- Server-side authentication.
- No secret configuration in form controls.
- Error messages that do not reveal internal system details.
- A data-retention policy for personal information.

---

## 15. AI Integration Pattern

AI should be an **assistant**, not an ungoverned publisher.

```text
Editor chooses a structured task
        ↓
WordPress validates permissions and task inputs
        ↓
WordPress fetches only approved brand/product context
        ↓
Server sends restricted request to AI service
        ↓
AI response is schema-validated
        ↓
Editor reviews and edits draft in Elementor
        ↓
Human publishes page
```

### Good Elementor AI tasks

| Task | Input from Fruitful app | Result for Elementor editor |
|---|---|---|
| Hero copy | Brand voice + campaign brief | Headline, body copy, CTA options |
| Product description | Approved product facts + style rules | Draft description for review |
| FAQ creation | Product/directory facts | FAQ questions and answers |
| SEO metadata | Page topic + approved claims | Title/meta description draft |
| CSS assistance | Limited design requirement | Draft CSS for expert review |
| Campaign section plan | Audience, offer, channel | Structured page-section outline |

### AI request contract example

```json
{
  "task": "hero_copy",
  "brand_id": "banimal",
  "brief": "Introduce a premium animal-care collection for urban pet owners.",
  "constraints": {
    "locale": "en-ZA",
    "tone": ["clear", "humane", "confident"],
    "max_headline_words": 10,
    "forbidden_claims": [
      "guaranteed results",
      "medical cure",
      "unsubstantiated health claim"
    ]
  }
}
```

### AI response contract example

```json
{
  "headline": "Care made for their everyday adventure.",
  "description": "Thoughtfully selected essentials for healthier routines and happier companions.",
  "cta": "Explore the collection",
  "warnings": []
}
```

### Never allow AI to do these tasks automatically

- Publish pages without human approval.
- Change prices, financial records, tax settings, or orders.
- Delete data.
- Send email/SMS/WhatsApp messages without a confirmation workflow.
- Make medical, legal, financial, safety, or regulated product claims.
- Receive raw customer databases, payment data, or secrets.
- Execute arbitrary code or database queries.

---

## 16. Data Mapping Guide

The Fruitful OpenAPI specification contains multiple generic entity collections. Treat the API specification as the source of truth for real endpoint names, required fields, and schemas—not this conceptual mapping alone. [file:24]

| Fruitful entity example | Website use case | Elementor widget idea | Notes |
|---|---|---|---|
| `Brand` | Brand portfolio, brand selector, logo/tone profile | Brand Directory, Brand Hero | Use only approved public brand fields |
| `DirectoryEntry` | Store locator, partner list, service directory | Directory Search, Location Cards | Filter by region/country/category on server side |
| `BarcodeMapping` | SKU/barcode lookup/enrichment | Product Lookup, SKU Search | Avoid exposing internal supply data unless intended |
| `SubscriptionBox` | Subscription plan pages | Subscription Plan Cards | Display published/public pricing only |
| `Metrics` | Internal reporting | Private Admin Metrics widget | Do not expose operational metrics publicly by default |
| `SageItemRaw` | Internal source-data processing | None for public pages by default | Treat raw accounting/source records as restricted |

The API description includes `SageItemRaw`, which strongly suggests raw source/accounting-style records; do not publish raw integration data to web visitors unless a separate approved public data model exists. [file:24]

---

## 17. API Data Contract Rules

Before a widget uses any Fruitful data, define a small display contract.

### Bad pattern: widget consumes raw entity

```php
$data = $client->get( '/entities/Brand/' . $id );
// The frontend now relies on every field in a broad internal record.
```

### Better pattern: map to a public display object

```php
function fruitful_map_brand_for_public_display( array $brand ) {
    return array(
        'id'          => sanitize_key( $brand['id'] ?? '' ),
        'name'        => sanitize_text_field( $brand['name'] ?? '' ),
        'description' => wp_kses_post( $brand['public_description'] ?? '' ),
        'website_url' => esc_url_raw( $brand['website_url'] ?? '' ),
        'logo_url'    => esc_url_raw( $brand['logo_url'] ?? '' ),
    );
}
```

Why this is safer:

- You decide exactly which fields may become public.
- Internal fields do not leak accidentally.
- Your Elementor widget has a stable contract even if the database changes.
- You can transform field names without rebuilding every page.

---

## 18. Security Rules

Use this as a hard production checklist.

### Credentials

- [ ] Store private secrets only in host environment variables or `wp-config.php` outside version control.
- [ ] Rotate a secret immediately if it appears in Git, logs, screenshots, tickets, chat, browser output, or public files.
- [ ] Use separate API credentials for development, staging, and production.
- [ ] Give each website the lowest possible permission scope.

### API access

- [ ] Allow public websites to use read-only endpoints only where data is explicitly public.
- [ ] Give Elementor editors narrow WordPress-authenticated routes, not direct Fruitful credentials.
- [ ] Use dedicated routes for leads, subscriptions, and other writes.
- [ ] Never expose generic update, bulk-update, delete-many, restore, or administrative API functions through public Elementor controls.
- [ ] Validate response schemas before rendering remote data.

### WordPress coding

- [ ] Begin PHP files with `defined( 'ABSPATH' ) || exit;`.
- [ ] Sanitise every input before use or storage.
- [ ] Escape every output for its context.
- [ ] Use WordPress capability checks.
- [ ] Use nonces for authenticated browser actions.
- [ ] Add HTTP timeouts and safe failure behaviour.
- [ ] Do not show PHP errors, remote stack traces, or secret-bearing response bodies to visitors.

### Elementor

- [ ] Do not place tokens in widget controls.
- [ ] Do not put private endpoints in page controls.
- [ ] Remove sensitive custom Form Action settings in `on_export()`.
- [ ] Limit dynamic content to approved fields.
- [ ] Review AI-generated content before publishing.

### Operations

- [ ] Run backups before deployment.
- [ ] Test restores periodically.
- [ ] Maintain staging before production.
- [ ] Log integration failures without logging tokens or sensitive personal data.
- [ ] Monitor API error rates and form-action failures.

---

## 19. Development Sequence

Follow this exact order. Do not jump to AI or complex automation before the base system is stable.

### Phase 1 — Foundation

1. Install WordPress on staging.
2. Install Elementor.
3. Install Elementor Pro only if custom form actions are required.
4. Install the shared Fruitful WordPress Core plugin.
5. Add staging-only API configuration.
6. Confirm the plugin activates without PHP errors.

**Success:** WordPress remains stable even when the Fruitful API is unavailable.

### Phase 2 — Read-only data

1. Implement the shared API client.
2. Add cached read-only routes for one entity, such as `Brand`.
3. Map raw data to a limited public display object.
4. Create one simple Elementor widget that displays mapped data.

**Success:** An editor can add a controlled Fruitful-powered widget to a page without a public visitor receiving any credential.

### Phase 3 — Banimal connector

1. Install or update Banimal Ecosystem Connector.
2. Make it require Fruitful WordPress Core.
3. Register Banimal Elementor widgets.
4. Connect existing WooCommerce bridge logic where appropriate.
5. Test product display and brand hero widgets.

**Success:** A Banimal editor builds a page from Banimal components in Elementor.

### Phase 4 — Forms and workflows

1. Create a dedicated lead endpoint in the Fruitful/Banimal backend.
2. Add the Elementor Pro custom form action.
3. Add spam protection, consent, rate limiting, logging, and notifications.
4. Test failures as well as successful submits.

**Success:** A lead reaches the intended system reliably and failures are observable.

### Phase 5 — AI assistance

1. Define approved tasks and response schemas.
2. Connect only server-side AI requests.
3. Add AI-enabled text/code controls where Elementor supports them.
4. Add human review before publish.
5. Measure quality and failure modes.

**Success:** AI speeds up editing without controlling business-critical outcomes.

---

## 20. Testing Checklist

### Core plugin

- [ ] Activates with no PHP warning or fatal error.
- [ ] Shows a useful configuration notice when staging credentials are missing.
- [ ] Does not reveal the token in WordPress admin output.
- [ ] Fails safely when the Fruitful API is offline.

### API client

- [ ] Calls expected read endpoints.
- [ ] Rejects non-2xx responses safely.
- [ ] Rejects invalid JSON safely.
- [ ] Uses timeouts.
- [ ] Does not log bearer tokens or raw sensitive responses.

### REST bridge

- [ ] Logged-out visitor cannot access editor-only endpoints.
- [ ] Subscriber cannot access editor endpoints.
- [ ] Editor can access only required read routes.
- [ ] Routes do not proxy arbitrary remote paths.

### Elementor

- [ ] Widgets appear only when Elementor is active.
- [ ] Widgets work in editor preview and published pages.
- [ ] Desktop, tablet, and mobile layouts are checked.
- [ ] Empty API results show safe, friendly fallbacks.
- [ ] Remote text and URLs are escaped.

### Banimal

- [ ] Banimal Brand Hero renders correctly.
- [ ] Banimal Product Grid uses the intended approved data source.
- [ ] WooCommerce absence does not cause a fatal error.
- [ ] Banimal form action sends test leads to staging destination.

### Forms

- [ ] Spam test is rejected.
- [ ] Invalid email is rejected.
- [ ] Rate limit works.
- [ ] Consent is stored or processed according to policy.
- [ ] Template export does not include any secrets.

### AI

- [ ] AI request contains no credentials or unnecessary personal data.
- [ ] Disallowed claims are rejected or flagged.
- [ ] Output meets a schema before insertion.
- [ ] A person must approve content before publishing.

---

## 21. Troubleshooting

### “The Elementor widget is missing”

Check, in order:

1. Elementor is installed and active.
2. The plugin includes the widget file.
3. The widget class name matches the registration code.
4. The Elementor registration hook is correct.
5. PHP error logs contain no fatal error.
6. Elementor cache and browser cache have been cleared.

### “The website is slow”

Likely causes:

- Every visitor page load calls a remote Fruitful endpoint.
- The remote endpoint is slow.
- API queries request too much data.
- A page has too many widgets making separate API requests.

Fixes:

- Add WordPress transient caching.
- Build one aggregated backend endpoint for a page rather than many tiny requests.
- Request only fields needed for display.
- Use a CDN/page cache for suitable public content.

### “I get 401 or 403 from `/wp-json/fruitful/v1/...`”

This means access was denied.

Check:

- You are logged into WordPress.
- Your user account has the required capability such as `edit_pages`.
- Your browser is sending the expected REST nonce for JavaScript requests.
- A security plugin, firewall, or CDN has not blocked WordPress REST routes.

### “The API returns data but the widget is blank”

Check:

- The endpoint response shape matches the widget’s expected mapping.
- The correct fields exist and are public.
- The render method handles arrays versus single objects correctly.
- The cache has been cleared after schema changes.
- Output is not being blocked by invalid URLs or sanitisation.

### “A secret was committed to Git”

Treat it as compromised immediately:

1. Revoke or rotate it.
2. Remove it from current code.
3. Remove it from deployment configuration if necessary.
4. Check Git history and CI logs.
5. Replace with an environment variable.
6. Record the incident and confirm all environments use new credentials.

Deleting the visible line is not enough if the old secret remains in Git history or logs.

---

## 22. Deployment Procedure

### Before deployment

1. Create a Git branch, for example:

```bash
git checkout -b feature/fruitful-wordpress-elementor-core
```

2. Implement a small logical change.
3. Test it locally or on staging.
4. Check for credentials before committing.
5. Commit with a clear message.

```bash
git status
git add wordpress-plugins/fruitful-wordpress-core
git commit -m "feat: add secure Fruitful API client and cached brand route"
git push -u origin feature/fruitful-wordpress-elementor-core
```

### Never do this

```bash
# Avoid blindly staging all files in a project that might contain environment data.
git add .
```

### Production release

1. Make a full database and files backup.
2. Confirm rollback version and procedure.
3. Merge reviewed code.
4. Deploy plugin update.
5. Clear relevant caches.
6. Test one public page, one Elementor editor page, one API response, and one form submission.
7. Monitor error logs and integration health after release.

---

## 23. Governance Rules for Many Apps

When other apps and brands are added, use these rules:

- Each app owns its business logic and data model.
- The Fruitful Core App owns shared entities and system-wide policy.
- The shared WordPress Core plugin owns API transport, security, caching, audit-friendly logging, and common REST patterns.
- Each brand plugin owns its Elementor widgets, brand tokens, domain-specific forms, and content rules.
- No brand plugin gets a universal administrator token.
- No website writes to generic entity CRUD endpoints without a dedicated service and permission model.
- Every public display has an explicit public-data contract.
- Every AI task has an approved input, output schema, and human review point.

---

## 24. Definition of Done

You have a safe working integration when all statements below are true:

- [ ] Fruitful WordPress Core exists and activates safely.
- [ ] Fruitful API credentials exist only in server configuration.
- [ ] A cached, read-only Fruitful data route works on staging.
- [ ] A WordPress REST bridge exposes only narrow, permission-checked routes.
- [ ] Elementor displays at least one Fruitful-powered widget.
- [ ] Banimal Ecosystem Connector uses the shared core rather than duplicating credentials.
- [ ] Banimal widgets work with Elementor and degrade safely if an optional service is unavailable.
- [ ] Elementor form submission uses a dedicated, validated server-side workflow.
- [ ] No secret is in Elementor controls, exports, frontend JavaScript, page HTML, Git, or logs.
- [ ] AI output is reviewed by a human before public publication.
- [ ] Staging tests are documented and passed.
- [ ] Backup and rollback procedures are tested.

---

## 25. Final Principle

The purpose is not simply to connect an API to Elementor.

The purpose is to build a controlled publishing system where:

- The Fruitful app holds authoritative business data.
- WordPress and Elementor make that data easy to present as a website.
- Banimal and future brand plugins turn shared capability into brand-specific experiences.
- APIs connect systems safely.
- AI helps people create better drafts.
- Humans remain accountable for what goes live.

Build the foundation once. Reuse it carefully. Keep the website layer simple, the backend authoritative, the credentials private, the data contracts narrow, and every high-impact action reviewable.
