<?php
if (!defined('ABSPATH')) { exit; }

/**
 * ID Finder admin page — unchanged in behavior from the verified working
 * version in the 4.7.8 baseline (confirmed against a live screenshot of
 * this exact page). Purely informational: helps an admin locate WordPress
 * user/product IDs. Makes no external requests and needs no Worker config.
 */
class Banimal_Id_Finder {

    public function render_page() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to access this page.', 'banimal-ecosystem-connector'));
        }
        ?>
        <div class="wrap" style="max-width: 1200px;">
            <style>
                .banimal-id-finder {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background-color: #F8F5F2;
                    padding: 20px;
                    border-radius: 12px;
                }
                .banimal-btn-primary {
                    background-color: #A8DADC;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                    border: none;
                    padding: 16px 24px;
                    font-size: 18px;
                    font-weight: 600;
                    border-radius: 12px;
                    cursor: pointer;
                    width: 100%;
                    color: #413F3D;
                }
                .banimal-btn-primary:hover {
                    background-color: #8ac9ca;
                    transform: translateY(-2px);
                }
                .banimal-btn-primary.active {
                    background-color: #413F3D;
                    color: #F8F5F2;
                }
                .banimal-instruction-card {
                    transition: opacity 0.5s ease, transform 0.5s ease;
                }
                .banimal-instruction-card.hidden-view {
                    opacity: 0;
                    transform: translateY(20px);
                    height: 0;
                    overflow: hidden;
                }
                .banimal-wp-sidebar-item.highlight {
                    background-color: rgba(168, 218, 220, 0.4);
                    border-left: 3px solid #A8DADC;
                    font-weight: 600;
                }
                .banimal-url-highlight {
                    background-color: #E07A5F;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-weight: 600;
                }
                .banimal-card {
                    background: white;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    margin-bottom: 20px;
                }
                .banimal-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 20px;
                }
                .banimal-wp-mockup {
                    display: flex;
                    background: white;
                    border-radius: 8px;
                    box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);
                    overflow: hidden;
                    border: 1px solid #ddd;
                }
                .banimal-wp-sidebar {
                    width: 35%;
                    background: #23282d;
                    color: #ccc;
                    padding: 15px;
                    font-size: 14px;
                }
                .banimal-wp-sidebar-item {
                    padding: 8px 10px;
                    margin: 4px 0;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .banimal-wp-sidebar-item:hover {
                    background-color: rgba(255,255,255,0.1);
                }
                .banimal-wp-content {
                    width: 65%;
                    padding: 20px;
                    background: #f5f5f5;
                }
                .banimal-content-bar {
                    height: 16px;
                    background: #ddd;
                    border-radius: 4px;
                    margin-bottom: 12px;
                }
                @media (max-width: 768px) {
                    .banimal-grid-2 { grid-template-columns: 1fr; }
                }
            </style>

            <div class="banimal-id-finder">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="font-size: 36px; margin-bottom: 10px;">🦍 Banimal ID Finder</h1>
                    <h2 style="color: #666; font-size: 20px; font-weight: normal;">Find User and Product IDs for API Integration</h2>
                    <p style="max-width: 700px; margin: 20px auto; color: #666;">
                        To connect your data using the Banimal API, you need the right WordPress IDs.
                        This interactive guide shows you exactly where to find them.
                    </p>
                </div>

                <div class="banimal-card">
                    <div style="text-center; margin-bottom: 20px;">
                        <p style="font-weight: 600; font-size: 18px; margin-bottom: 15px;">Step 1: What ID do you need to find?</p>
                    </div>
                    <div class="banimal-grid-2">
                        <button id="banimal-user-btn" class="banimal-btn-primary">👤 User ID</button>
                        <button id="banimal-product-btn" class="banimal-btn-primary">📦 Product ID</button>
                    </div>
                </div>

                <div id="banimal-instruction-view" class="banimal-instruction-card hidden-view">
                    <div class="banimal-card">
                        <h3 style="font-size: 24px; text-align: center; margin-bottom: 30px;">Step 2: Follow the Visual Guide</h3>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                            <div>
                                <h4 id="banimal-instruction-title" style="font-size: 18px; font-weight: 600; margin-bottom: 15px;"></h4>
                                <ol style="padding-left: 20px; line-height: 1.8;">
                                    <li id="banimal-instruction-step-1"></li>
                                    <li id="banimal-instruction-step-2"></li>
                                    <li id="banimal-instruction-step-3"></li>
                                </ol>
                            </div>

                            <div>
                                <p style="text-align: center; font-weight: 600; color: #666; margin-bottom: 10px; font-size: 12px;">VISUAL EXAMPLE</p>
                                <div class="banimal-wp-mockup">
                                    <div class="banimal-wp-sidebar">
                                        <div style="font-weight: 600; color: white; margin-bottom: 10px;">WordPress</div>
                                        <div id="banimal-wp-users" class="banimal-wp-sidebar-item">👤 Users</div>
                                        <div id="banimal-wp-woocommerce" class="banimal-wp-sidebar-item">🛒 WooCommerce</div>
                                        <div id="banimal-wp-products" class="banimal-wp-sidebar-item" style="padding-left: 20px;">📦 Products</div>
                                        <div class="banimal-wp-sidebar-item">⚙️ Settings</div>
                                    </div>
                                    <div class="banimal-wp-content">
                                        <div class="banimal-content-bar" style="width: 70%;"></div>
                                        <div class="banimal-content-bar" style="width: 100%; height: 12px;"></div>
                                        <div class="banimal-content-bar" style="width: 85%; height: 12px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="border-top: 2px solid #f0f0f0; padding-top: 30px;">
                            <h3 style="font-size: 24px; text-align: center; margin-bottom: 15px;">Step 3: Find the ID in the URL</h3>
                            <p style="text-align: center; color: #666; margin-bottom: 20px;">
                                Hover over or edit the item, then look at your browser's address bar. The ID is the number highlighted below.
                            </p>
                            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center;">
                                <p style="font-size: 12px; color: #666; margin-bottom: 10px;">EXAMPLE URL</p>
                                <code id="banimal-url-example" style="font-size: 14px; word-break: break-all; background: white; padding: 10px; display: inline-block; border-radius: 4px;"></code>
                            </div>
                        </div>

                        <div style="margin-top: 30px; text-align: center; padding: 20px; background: #e8f4f8; border-radius: 8px;">
                            <p style="font-weight: 600; font-size: 16px; margin-bottom: 10px;">💡 Pro Tip</p>
                            <p style="color: #666;">This ID number is what you'll use in your API calls to connect user or product data to the Banimal ecosystem.</p>
                        </div>
                    </div>
                </div>
            </div>

            <script>
                (function() {
                    var guideData = {
                        user: {
                            title: 'Finding a User ID',
                            steps: [
                                "In the WordPress sidebar, click on <strong>Users &rarr; All Users</strong>.",
                                "Find the user you need and hover over their name.",
                                "Look at the bottom left of your browser (or the address bar when you click Edit). You'll see the URL."
                            ],
                            urlPrefix: 'yoursite.com/wp-admin/user-edit.php?',
                            urlHighlight: 'user_id=123',
                            urlSuffix: '&amp;wp_http_referer=...'
                        },
                        product: {
                            title: 'Finding a Product ID',
                            steps: [
                                "In the WordPress sidebar, click on <strong>WooCommerce &rarr; Products</strong> (or just <strong>Products</strong>).",
                                "Find the product you need and hover over its name.",
                                "Look at the bottom left of your browser (or the address bar when you click Edit). You'll see the URL."
                            ],
                            urlPrefix: 'yoursite.com/wp-admin/post.php?',
                            urlHighlight: 'post=456',
                            urlSuffix: '&amp;action=edit'
                        }
                    };

                    var userBtn = document.getElementById('banimal-user-btn');
                    var productBtn = document.getElementById('banimal-product-btn');
                    var instructionView = document.getElementById('banimal-instruction-view');

                    var instructionTitle = document.getElementById('banimal-instruction-title');
                    var instructionStep1 = document.getElementById('banimal-instruction-step-1');
                    var instructionStep2 = document.getElementById('banimal-instruction-step-2');
                    var instructionStep3 = document.getElementById('banimal-instruction-step-3');

                    var wpUsers = document.getElementById('banimal-wp-users');
                    var wpProducts = document.getElementById('banimal-wp-products');
                    var wpWooCommerce = document.getElementById('banimal-wp-woocommerce');
                    var urlExample = document.getElementById('banimal-url-example');

                    function updateGuide(idType) {
                        var data = guideData[idType];

                        instructionView.classList.remove('hidden-view');

                        instructionTitle.textContent = data.title;
                        instructionStep1.innerHTML = data.steps[0];
                        instructionStep2.innerHTML = data.steps[1];
                        instructionStep3.innerHTML = data.steps[2];

                        // Build the URL example using DOM methods to avoid an innerHTML
                        // XSS sink for the prefix and suffix segments.
                        urlExample.textContent = '';
                        urlExample.appendChild(document.createTextNode(data.urlPrefix));
                        var highlight = document.createElement('span');
                        highlight.className = 'banimal-url-highlight';
                        highlight.textContent = data.urlHighlight;
                        urlExample.appendChild(highlight);
                        urlExample.appendChild(document.createTextNode(data.urlSuffix));

                        wpUsers.classList.remove('highlight');
                        wpProducts.classList.remove('highlight');
                        wpWooCommerce.classList.remove('highlight');

                        if (idType === 'user') {
                            wpUsers.classList.add('highlight');
                            userBtn.classList.add('active');
                            productBtn.classList.remove('active');
                        } else {
                            wpProducts.classList.add('highlight');
                            wpWooCommerce.classList.add('highlight');
                            productBtn.classList.add('active');
                            userBtn.classList.remove('active');
                        }
                    }

                    userBtn.addEventListener('click', function() { updateGuide('user'); });
                    productBtn.addEventListener('click', function() { updateGuide('product'); });
                })();
            </script>
        </div>
        <?php
    }
}
