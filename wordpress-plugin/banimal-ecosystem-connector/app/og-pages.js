/*
 * Shared renderer for OmniGrid detail pages (admin metrics and friends).
 * Each page sets window.OG_PAGE = { kind, figure, figureLabel, ... } and includes
 * <div id="og-page"></div>. Data comes from ecosystem-manifest.json and
 * omnigrid-pulse.json (counts only). Dashboard figures are shown as dashboard
 * figures; live counts are shown as the live snapshot. Nothing is invented.
 */
(function () {
    'use strict';
    var cfg = window.OG_PAGE || {};
    var root = document.getElementById('og-page');
    var base = cfg.base || '';
    var STATUS = { green: 'var(--secondary-color)', amber: 'var(--amber-color)', red: 'var(--tertiary-color)' };
    var LABEL = { built: 'Built', 'in-app': 'In-app', missing: 'Not built yet' };
    var CLASS = { built: 'ok', 'in-app': 'warn', missing: 'bad' };

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function fmt(n) { return n == null ? '—' : Number(n).toLocaleString('en-ZA'); }
    function get(url) {
        return fetch(base + url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
            .catch(function () { return null; });
    }
    function card(title, body, extra) {
        return '<div class="card' + (extra ? ' ' + extra : '') + '"><h3>' + esc(title) + '</h3>' + body + '</div>';
    }
    function badge(cls, text) { return '<span class="badge ' + cls + '">' + esc(text) + '</span>'; }
    function led(status) { return '<i class="dot" style="background:' + (STATUS[status] || '#999') + '"></i>'; }
    function list(items) { return '<ul class="list">' + items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'; }
    function station(pulse, id) { return pulse && pulse.stations.filter(function (s) { return s.id === id; })[0]; }
    function stationCard(s) {
        if (!s) return '';
        return card(s.title, '<p class="big">' + led(s.status) + esc(s.headline) + '</p>' +
            list(s.lines.map(esc)));
    }
    function pageLink(file, text) { var href = /^([a-z]+:)?\/\//i.test(file) ? file : base + file; return '<a href="' + esc(href) + '">' + esc(text || file) + '</a>'; }

    function sectorName(g, key) {
        var sl = (g && g.sectorList) || {};
        return sl[key] || (key.charAt(0).toUpperCase() + key.slice(1)).replace(/-/g, ' ');
    }
    function sectorRows(g) {
        return Object.keys((g && g.sectors) || {}).map(function (k) {
            var s = g.sectors[k], nodes = 0;
            (s.subNodes || []).forEach(function (x) { nodes += (x && x.length) || 0; });
            return { key: k, name: sectorName(g, k), brands: s.brands.length, nodes: nodes, zone: (g.zoneIndex || {})[k] || null, data: s };
        });
    }
    function table(head, rows) {
        return '<div class="tbl"><table><thead><tr>' + head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') +
            '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
            '</tbody></table></div>';
    }
    function bars(labels, data, suffix) {
        var max = Math.max.apply(null, data.concat([1]));
        return '<div class="bars">' + labels.map(function (l, i) {
            return '<div class="barrow"><span class="bl">' + esc(l) + '</span><span class="bt"><span style="width:' + (data[i] * 100 / max) + '%"></span></span><b>' + fmt(data[i]) + (suffix || '') + '</b></div>';
        }).join('') + '</div>';
    }
    var ALIAS = { 'education': 'education-ip', 'health-hygiene': 'health', 'payroll': 'payroll-mining', 'culture': 'ritual',
        'design': 'creative', 'finance': 'banking', 'food': 'fsf', 'retail': 'trade', 'packaging-logistics': 'logistics', 'pro-services': 'professional' };
    function dataKey(slug) { return ALIAS[slug] || slug; }
    function param(n) { try { return new URLSearchParams(location.search).get(n); } catch (e) { return null; } }
    function brandHref(key, b) { return base + 'brand.html?s=' + encodeURIComponent(key) + '&b=' + encodeURIComponent(b); }
    function sectorHref(key) { return base + 'sectors/' + key + '/index.html'; }
    function intelFor(intel, key) { return intel && intel.sectors && intel.sectors[key]; }
    function brandIntel(intel, b) { return intel && intel.brands && intel.brands[String(b).replace(/[™®]/g, '').trim().toLowerCase()]; }
    function intelCard(i, what) {
        if (!i) return '';
        return card('Intelligence · ' + what, list([fmt(i.claude_chats) + ' Claude chats', fmt(i.claude_project_files) + ' Claude Project files',
            fmt(i.claude_artifacts) + ' Claude artifacts', fmt(i.perplexity_records) + ' Perplexity index records', fmt(i.applications) + ' registered applications']) +
            '<p class="muted">Counts of sources that mention this sector. Content stays private.</p>');
    }
    function searchable(inputId, itemSel, groupSel) {
        setTimeout(function () {
            var q = document.getElementById(inputId); if (!q) return;
            q.addEventListener('input', function () {
                var v = q.value.trim().toLowerCase();
                document.querySelectorAll(groupSel).forEach(function (g) {
                    var any = false;
                    g.querySelectorAll(itemSel).forEach(function (x) { var hit = !v || (x.getAttribute('data-q') || '').indexOf(v) !== -1; x.style.display = hit ? '' : 'none'; any = any || hit; });
                    g.style.display = any ? '' : 'none';
                });
            });
        }, 0);
    }
    var SRC_NAME = { grid: 'FAA.zone catalogue', fpc: 'FruitfulPlanetChange', base44: 'Base44 FRUITFUL' };
    var SRC_LEGEND = '<b>G</b> FAA.zone catalogue · <b>F</b> FruitfulPlanetChange · <b>B</b> Base44 FRUITFUL';
    function srcTags(src, long) { return (src || []).map(function (k) { return long ? esc(SRC_NAME[k] || k) : ({ grid: 'G', fpc: 'F', base44: 'B' }[k] || k); }).join(long ? ', ' : ''); }
    function usd(n) { return n == null || n === '' ? '—' : '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }); }
    function tile(t) { return '<div class="tile"><b>' + (typeof t[0] === 'number' ? fmt(t[0]) : esc(t[0] == null ? '—' : t[0])) + '</b><span>' + esc(t[1]) + '</span></div>'; }
    function priceOf(p) { var o = []; if (p && p.ZAR) o.push('R' + Number(p.ZAR).toLocaleString('en-ZA')); if (p && p.USD) o.push(usd(p.USD)); return o.join(' · ') || '—'; }
    function normName(n) { return String(n || '').replace(/[™®]/g, '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
    function titleOf(k) { return k.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
    function noGrid() { return [card('Catalogue', '<p class="muted">Catalogue data unavailable right now.</p>')]; }
    function joinCards() {
        return [card('Where to next', list([pageLink('admin/admin-portal-approval.html', '🔑 Request portal access'),
            pageLink('ecosystem.html', '🌍 Explore the Global Ecosystem'), pageLink('omnigrid.html', '🕸️ Enter the OmniGrid')]))];
    }

    var THIRD = ['Google Fonts and gstatic (typefaces)', 'jsDelivr, cdnjs and the Tailwind CDN (page libraries)',
        'PayPal (payments on the checkout page only)', 'Google Generative Language / Gemini (terminal chat, only when you use it)',
        'ExchangeRate-API (currency conversion on pages that show prices)', 'placehold.co (placeholder images)'];
    function legalCards(doc) {
        var draft = card('Draft · pending review', '<p class="muted">This page describes how the site works today. It is a draft awaiting review by the owner and legal counsel, and is not yet a binding agreement.</p>');
        var D = {
            privacy: [
                card('What we collect', list(['This site has <b>no sign-up or contact forms</b> and collects no personal information through its pages.',
                    'No analytics or advertising trackers are used.', 'Access requests are made through the FAA.zone contact channels, which have their own notice.'])),
                card('Stored in your browser', list(['Your light/dark theme choice (<code>eco-theme</code>).', 'The Seedwave™ Admin page keeps its working data in your own browser only.',
                    'You can clear this at any time from your browser settings.'])),
                card('Third-party services', list(THIRD.map(esc))),
                card('Your choices', list(['Clear site data in your browser to remove stored settings.', 'Contact us through ' + pageLink('contact-support.html', 'Contact Support') + ' with privacy questions.']))],
            terms: [
                card('Using the site', list(['The Fruitful™ Global Ecosystem pages are provided for information and navigation.', 'Figures marked "Dashboard figure" are published targets and display values, not audited results.',
                    'Payments, where offered, are handled by PayPal under its own terms.'])),
                card('Brands and content', list(['Fruitful™, FAA.zone™, OmniGrid™, Seedwave™, Baobab™ and related marks belong to their owner.', 'Catalogue content is shown as published by the owner.'])),
                card('Availability', list(['Some pages are marked "Not built yet" and open as placeholders until launch.', 'Hosting of the public domains is paused until the ecosystem launch.']))],
            cookies: [
                card('Cookies', list(['These pages set <b>no cookies of their own</b>.', 'Embedded services (PayPal on checkout, Google Fonts) may set their own cookies under their policies.'])),
                card('Browser storage', list(['<code>eco-theme</code>: remembers light or dark mode.', 'Seedwave™ Admin working data (that page only, on your device).'])),
                card('Third parties', list(THIRD.map(esc)))],
            'legal-privacy': [
                card('Legal & privacy', list([pageLink('privacy-policy.html', 'Privacy Policy'), pageLink('terms-of-service.html', 'Terms of Service'), pageLink('cookies.html', 'Cookies'), pageLink('compliance.html', 'Compliance')]))],
            compliance: [
                card('Security practice', list(['Every repository is scanned for live keys; exposed keys are removed and rotated.', 'Public repositories carry no secrets; private work stays private.',
                    'Database access policies are under review.'])),
                card('Data practice', list(['Public data files carry counts and published catalogue only.', 'No personal data is collected through these pages.'])),
                card('Related', list([pageLink('audit-tracker.html', '📈 Audit Tracker'), pageLink('privacy-policy.html', 'Privacy Policy')]))]
        };
        return [draft].concat(D[doc] || []);
    }

    var RENDER = {
        deployments: function (m, p) {
            var pages = m ? m.pages : [];
            return [stationCard(station(p, 'branches')),
                card('Deployable pages', '<p class="big">' + fmt(pages.length) + ' pages</p>' +
                    '<p class="muted">' + fmt(pages.filter(function (x) { return x.wired; }).length) + ' on the in-app OmniGrid layer. Hosting is paused by design until the ecosystem launch.</p>'),
                card('Release packages', list(['Fruitful WordPress Core 1.1.0: built and verified', 'Banimal Ecosystem Connector 5.1.1: built and verified']))];
        },
        audits: function (m, p) {
            return [card('Audits completed · 26 Sep 2026', list([
                'Live-key scan across every repository',
                'Public / private visibility review of every repository',
                'Banimal read-only release audit (5-state evidence model)',
                'Database access-policy review',
                'Claude Project consolidation check (nothing reduced)'])),
                stationCard(station(p, 'guardian')),
                card('Intelligence intakes', m && m.intelligence ? list([
                    'Claude: ' + fmt(m.intelligence.claude && m.intelligence.claude.chats) + ' chats indexed',
                    'Perplexity: ' + fmt(m.intelligence.perplexity && m.intelligence.perplexity.records) + ' records indexed',
                    'Applications: ' + fmt(m.intelligence.applications && m.intelligence.applications.applications) + ' in the registry']) : '<p class="muted">Snapshot unavailable.</p>')];
        },
        grid: function (m) {
            if (!m) return [card('Grid index', '<p class="muted">Snapshot unavailable.</p>')];
            function rowsOf(kind) {
                return m.pages.filter(function (x) { return (x.kind || 'portal') === kind; }).map(function (x) {
                    return '<div class="row"><span>' + pageLink(x.file, x.title) + '<span class="sub">' + esc(x.file) + '</span></span>' +
                        (x.noodle ? badge('ok', 'Pulse') : '') + badge(x.wired ? 'ok' : 'warn', x.wired ? 'In-app' : 'Viewer') + '</div>';
                });
            }
            var portals = rowsOf('portal'), details = rowsOf('detail'), sectorsP = rowsOf('sector');
            var rows = portals.join('');
            var groups = m.groups.map(function (g) {
                var ok = g.items.filter(function (i) { return i.status !== 'missing'; }).length;
                return '<div class="row"><span><b>' + esc(g.id) + '</b> · ' + esc(g.name) + '</span>' + badge(ok === g.items.length ? 'ok' : 'warn', ok + ' / ' + g.items.length) + '</div>';
            }).join('');
            return [card('Portals · ' + portals.length, '<div class="rows">' + rows + '</div>', 'wide'),
                card('Detail pages · ' + details.length, '<details class="pack"><summary>Show all</summary><div class="rows">' + details.join('') + '</div></details>', 'wide'),
                card('Sector pages · ' + sectorsP.length, '<details class="pack"><summary>Show all</summary><div class="rows">' + sectorsP.join('') + '</div></details>', 'wide'),
                card('Concept pages · ' + rowsOf('concept').length, '<details class="pack"><summary>Show all</summary><div class="rows">' + rowsOf('concept').join('') + '</div></details>', 'wide'),
                m.conceptBacklog && m.conceptBacklog.count ? card('Concept backlog · ' + m.conceptBacklog.count, '<p class="muted">Pages the imported concept pages link to that were never built. They open as "not built yet" in-app; they do not count against launch readiness.</p>' +
                    '<details class="pack"><summary>Show all</summary><div class="rows">' + m.conceptBacklog.items.map(function (i) { return '<div class="row"><span>' + esc(i.page) + '<span class="sub">linked from ' + esc(i.linked_from.join(', ')) + '</span></span>' + badge('bad', 'Not built yet') + '</div>'; }).join('') + '</div></details>', 'wide') : '',
                card('Launch groups · ' + m.readiness.total + ' items', '<div class="rows">' + groups + '</div>')];
        },
        logs: function (m, p) {
            var ev = (m && m.milestones || []).map(function (x) {
                return '<div class="milestone"><div class="d">' + esc(x.date) + '</div><strong>' + esc(x.title) + '</strong><div>' + esc(x.detail) + '</div></div>';
            }).join('');
            var snaps = [];
            if (m) snaps.push('Ecosystem manifest · ' + esc(m.generated_at.replace('T', ' ').replace('Z', ' UTC')));
            if (p) snaps.push('Pulse snapshot · ' + esc(p.generated_at.replace('T', ' ').replace('Z', ' UTC')));
            return [card('Sync events', '<div class="timeline">' + (ev || '<p class="muted">No events.</p>') + '</div>', 'wide'),
                card('Latest syncs', list(snaps.length ? snaps : ['Snapshot unavailable']))];
        },
        licenses: function (m) {
            var a = m && m.intelligence && m.intelligence.applications;
            return [card('License registry', '<p class="muted">The license registry is not connected to the grid yet. The dashboard figure above is shown as published.</p>'),
                card('Licensable surfaces', a ? '<p class="big">' + fmt(a.applications) + ' applications</p><p class="muted">' + fmt(a.instances) + ' instances across platforms, from the application registry.</p>' : '<p class="muted">Snapshot unavailable.</p>'),
                card('Release packages', list(['Fruitful WordPress Core 1.1.0', 'Banimal Ecosystem Connector 5.1.1']))];
        },
        zones: function (m, p) {
            var sectors = m ? m.sectors : [];
            var grid = sectors.map(function (s) {
                return '<a class="chip" href="' + esc(base + 'sectors/' + s.slug + '/index.html') + '">' + esc(s.name) + badge(CLASS[s.status], LABEL[s.status]) + '</a>';
            }).join('');
            var flow = p ? '<p class="big">' + led('green') + p.flow.green + ' green · ' + led('amber') + p.flow.amber + ' amber · ' + led('red') + p.flow.red + ' red</p>' : '';
            return [card('Global signal', flow + '<p class="muted">Across the six pulse stations. Hover the noodle for detail.</p>'),
                card('Sectors in the grid · ' + sectors.length, '<div class="chips">' + grid + '</div>', 'wide')];
        },
        nodes: function (m, p) {
            var i = (m && m.intelligence) || {};
            var st = p ? p.stations.map(stationCard) : [card('Pulse', '<p class="muted">Snapshot unavailable.</p>')];
            return [card('Grid nodes', list([
                fmt(i.repos && i.repos.total) + ' repositories',
                fmt(i.applications && i.applications.applications) + ' applications · ' + fmt(i.applications && i.applications.instances) + ' instances',
                fmt(m && m.pages.length) + ' portal pages · ' + fmt(m && m.sectors.length) + ' sectors']))].concat(st);
        },
        brandmetrics: function (m, p, g) {
            if (!g) return noGrid();
            var a = g.admin || {}, gm = a.globalMetrics || {}, bd = a.brandDistribution;
            var rows = sectorRows(g).filter(function (r) { return r.brands; }).sort(function (x, y) { return y.brands - x.brands; });
            return [card('Global brand metrics', list(['<b>' + fmt(gm.totalBrands) + '</b> total brands', '<b>' + fmt(gm.coreBrands) + '</b> core brands',
                    '<b>' + fmt(gm.totalNodes) + '</b> nodes', '<b>' + fmt(gm.totalPages) + '</b> pages'])),
                bd ? card('Brand distribution', bars(bd.labels, bd.data)) : '',
                card('Catalogued brands by sector · ' + fmt(rows.reduce(function (t, r) { return t + r.brands; }, 0)), bars(rows.map(function (r) { return r.name; }), rows.map(function (r) { return r.brands; })), 'wide')];
        },
        clauses: function (m, p, g) {
            var c = g && g.admin && g.admin.licenseLedger && g.admin.licenseLedger.clauses;
            if (!c) return noGrid();
            var total = c.data.reduce(function (t, x) { return t + x; }, 0);
            return [card('FAA™ clause allocation · ' + fmt(total), bars(c.labels, c.data), 'wide'),
                card('Clause register', table(['Clause', 'Allocations', 'Share'], c.labels.map(function (l, i) {
                    return [esc(l), fmt(c.data[i]), Math.round(c.data[i] * 100 / total) + '%'];
                })), 'wide')];
        },
        distributor: function (m, p, g) {
            if (!g) return noGrid();
            var rows = sectorRows(g).filter(function (r) { return r.zone; });
            return [card('Distributor tariff index · ' + rows.length + ' sectors', table(['Sector', 'Monthly', 'Annual', 'Payout tier', 'Region', 'Brands'],
                rows.map(function (r) { return [pageLink('sectors/' + r.key + '/index.html', r.name), esc(r.zone.monthlyFee), esc(r.zone.annualFee), esc(r.zone.payoutTier), esc(r.zone.region), fmt(r.brands)]; })), 'wide')];
        },
        hardware: function (m, p, g) {
            var t = g && g.admin && g.admin.techStack;
            if (!t) return noGrid();
            return Object.keys(t).map(function (k) {
                var x = t[k];
                return card((x.icon ? x.icon + ' ' : '') + x.title, '<p class="muted">' + esc(x.details) + '</p>' + list((x.features || []).map(esc)));
            });
        },
        owner: function (m, p, g) {
            var r = m && m.readiness, i = (m && m.intelligence) || {};
            return [card('Launch readiness', r ? '<p class="big">' + (r.built + r.in_app) + ' of ' + r.total + ' reachable</p>' +
                    list([fmt(r.built) + ' built', fmt(r.in_app) + ' in-app', fmt(r.missing) + ' not built yet', pageLink('ecosystem.html#readiness', 'Open the launch board →')]) : '<p class="muted">Snapshot unavailable.</p>'),
                card('Owner tools', list([pageLink('dashboard.html', '⚙️ Dashboard'), pageLink('seedwave_admin.html', '🌱 Seedwave™ Admin'),
                    pageLink('audit-tracker.html', '📈 Audit Tracker'), pageLink('grid-index.html', '📊 Scroll Grid Index'), pageLink('quick-view.html', '🏁 Quick View')])),
                card('Estate', list([fmt(i.repos && i.repos.total) + ' repositories', fmt(i.applications && i.applications.applications) + ' applications',
                    fmt(g && g.admin && g.admin.globalMetrics && g.admin.globalMetrics.totalBrands) + ' brands', fmt(m && m.sectors.length) + ' sectors']))];
        },
        ledger: function (m, p, g) {
            var gr = g && g.admin && g.admin.licenseLedger && g.admin.licenseLedger.growth;
            if (!gr) return noGrid();
            var head = ['Tier'].concat(gr.labels);
            return [card('License growth by tier', table(head, gr.datasets.map(function (d) { return [esc(d.label)].concat(d.data.map(fmt)); })), 'wide'),
                card('Latest month', bars(gr.datasets.map(function (d) { return d.label; }), gr.datasets.map(function (d) { return d.data[d.data.length - 1]; }))),
                card('Related', list([pageLink('license-grid.html', '🔐 License Grid'), pageLink('clause-index.html', '📜 FAA Clauses')]))];
        },
        nodepacks: function (m, p, g) {
            if (!g) return noGrid();
            var rows = sectorRows(g).filter(function (r) { return r.brands; });
            var html = rows.map(function (r) {
                var packs = r.data.brands.map(function (b, i) {
                    var sub = r.data.subNodes[i] || [];
                    return '<li data-q="' + esc((b + ' ' + sub.join(' ')).toLowerCase()) + '"><a href="' + esc(brandHref(r.key, b)) + '"><b>' + esc(b) + '</b></a>' + (sub.length ? ' · ' + esc(sub.join(', ')) : '') + '</li>';
                }).join('');
                return '<details class="pack"><summary>' + esc(r.name) + ' <span class="badge">' + fmt(r.brands) + ' packs · ' + fmt(r.nodes) + ' nodes</span></summary><ul class="list">' + packs + '</ul></details>';
            }).join('');
            setTimeout(function () {
                var q = document.getElementById('pack-q');
                if (!q) return;
                q.addEventListener('input', function () {
                    var v = q.value.trim().toLowerCase();
                    document.querySelectorAll('details.pack').forEach(function (d) {
                        var any = false;
                        d.querySelectorAll('li').forEach(function (li) { var hit = !v || li.getAttribute('data-q').indexOf(v) !== -1; li.style.display = hit ? '' : 'none'; any = any || hit; });
                        d.style.display = any ? '' : 'none';
                        if (v) d.open = any;
                    });
                });
            }, 0);
            return [card('Node packs · ' + fmt(rows.reduce(function (t, r) { return t + r.brands; }, 0)) + ' brands',
                '<input id="pack-q" class="search" type="search" placeholder="Search brands and nodes…" aria-label="Search node packs">' + html, 'wide')];
        },
        nodestatus: function (m, p, g) {
            if (!g) return noGrid();
            var built = {}; (m ? m.sectors : []).forEach(function (s) { built[s.slug] = s.status; });
            var rows = sectorRows(g).sort(function (x, y) { return y.nodes - x.nodes; });
            return [card('Node index · ' + fmt(rows.reduce(function (t, r) { return t + r.nodes; }, 0)) + ' sub-nodes', table(['Sector', 'Brands', 'Sub-nodes', 'Sector page'],
                rows.map(function (r) { return [pageLink('sectors/' + r.key + '/index.html', r.name), fmt(r.brands), fmt(r.nodes), badge('ok', 'Built')]; })), 'wide')];
        },
        pulse: function (m, p) {
            if (!p) return [card('Signal', '<p class="muted">Pulse snapshot unavailable.</p>')];
            return [card('Signal sync', '<p class="big">' + led('green') + p.flow.green + ' · ' + led('amber') + p.flow.amber + ' · ' + led('red') + p.flow.red + '</p>' +
                list(['Pulse snapshot ' + esc(p.generated_at.replace('T', ' ').replace('Z', ' UTC')), m ? 'Ecosystem manifest ' + esc(m.generated_at.replace('T', ' ').replace('Z', ' UTC')) : 'Manifest unavailable']))]
                .concat(p.stations.map(stationCard));
        },
        quick: function (m, p, g) {
            var r = m && m.readiness, gm = g && g.admin && g.admin.globalMetrics;
            var tiles = [[r ? (r.built + r.in_app) + ' / ' + r.total : '—', 'launch items reachable'], [m ? m.pages.length : '—', 'pages'],
                [m ? m.sectors.length : '—', 'sectors'], [gm ? gm.totalBrands : '—', 'brands'], [p ? p.flow.green + p.flow.amber + p.flow.red : '—', 'pulse stations']];
            return [card('At a glance', '<div class="tiles">' + tiles.map(function (t) { return '<div class="tile"><b>' + (typeof t[0] === 'number' ? fmt(t[0]) : esc(t[0])) + '</b><span>' + esc(t[1]) + '</span></div>'; }).join('') + '</div>', 'wide'),
                card('Jump to', list([pageLink('ecosystem.html', '🌍 Ecosystem'), pageLink('dashboard.html', '⚙️ Dashboard'), pageLink('seedwave_admin.html', '🌱 Seedwave Admin'),
                    pageLink('sector-grid.html', '🏙️ Sector Grid'), pageLink('brandmetrics.html', '🔍 Brand Metrics'), pageLink('pulse-monitor.html', '📡 Signal Sync')]))];
        },
        layers: function (m, p, g) {
            if (!g) return noGrid();
            var ss = (g.admin && g.admin.sovereignScrolls) || {};
            var rows = sectorRows(g).filter(function (r) { return r.brands; });
            return [card('Sovereign scrolls', '<p class="big">' + fmt(ss.generated) + ' of ' + fmt(ss.total) + ' generated</p>' +
                    '<div class="bt big-bt"><span style="width:' + ((ss.generated || 0) * 100 / (ss.total || 1)) + '%"></span></div>'),
                card('Scroll layers by sector', table(['Sector', 'Brand layer', 'Node layer'], rows.map(function (r) { return [pageLink('sectors/' + r.key + '/index.html', r.name), fmt(r.brands), fmt(r.nodes)]; })), 'wide')];
        },
        scrollmap: function (m) {
            if (!m) return [card('ScrollMap', '<p class="muted">Snapshot unavailable.</p>')];
            var pages = m.pages.map(function (x) { return pageLink(x.file, x.title); });
            var groups = m.groups.map(function (gr) {
                return card(gr.id + ' · ' + gr.name, list(gr.items.map(function (i) { return pageLink(i.page, i.page) + ' ' + badge(CLASS[i.status], LABEL[i.status]); })));
            });
            return [card('Pages · ' + m.pages.length, list(pages), 'wide')].concat(groups);
        },
        sectorgrid: function (m, p, g) {
            if (!g) return noGrid();
            var built = {}; (m ? m.sectors : []).forEach(function (s) { built[s.slug] = s.status; });
            var rows = sectorRows(g);
            return [card('Sector grid · ' + rows.length + ' sectors', '<div class="chips">' + rows.map(function (r) {
                var z = r.zone || {};
                return '<a class="chip col" href="' + esc(base + 'sectors/' + r.key + '/index.html') + '"><span>' + esc(r.name) + '</span>' +
                    '<span class="sub">' + fmt(r.brands) + ' brands · ' + fmt(r.nodes) + ' nodes' + (z.payoutTier ? ' · tier ' + esc(z.payoutTier) : '') + (z.region ? ' · ' + esc(z.region) : '') + '</span></a>';
            }).join('') + '</div>', 'wide')];
        },
        signin: function () {
            return [card('Admin sign-in', '<p class="muted">Admin sign-in opens with the ecosystem launch. No credentials are collected on this page.</p>' +
                '<a class="cta" href="' + esc(base + 'admin/admin-portal-approval.html') + '">Request admin access</a>')].concat(joinCards());
        },
        signup: function () {
            return [card('Join the ecosystem', '<p class="muted">Sign-up opens with the ecosystem launch. Until then, choose an access tier and request access.</p>' +
                '<a class="cta" href="' + esc(base + 'admin/admin-portal-approval.html') + '">Choose an access tier</a>')].concat(joinCards());
        },
        about: function (m, p, g) {
            var gm = g && g.admin && g.admin.globalMetrics, i = (m && m.intelligence) || {};
            return [card('FAA Systems™', '<p class="muted">FAA.zone™ is the Fruitful™ grid of brands, sectors and portals, run as one OmniGrid™. Every brand sits in a sector, every sector in the grid, and every page is reachable in-app.</p>'),
                card('The grid in numbers', list([fmt(gm && gm.totalBrands) + ' brands (' + fmt(gm && gm.coreBrands) + ' core)', fmt(m && m.sectors.length) + ' sectors',
                    fmt(m && m.pages.length) + ' portal and detail pages', fmt(i.repos && i.repos.total) + ' repositories', fmt(i.applications && i.applications.applications) + ' applications'])),
                card('Explore', list([pageLink('ecosystem.html', '🌍 Global Ecosystem'), pageLink('omnigrid_zone.html', '📦 7,000+ brands'), pageLink('sector-grid.html', '🏙️ Sector Grid'), pageLink('faa-hardware.html', '🖥️ Infrastructure')]))];
        },
        archive: function (m) {
            var ev = (m && m.milestones || []).map(function (x) { return '<div class="milestone"><div class="d">' + esc(x.date) + '</div><strong>' + esc(x.title) + '</strong><div>' + esc(x.detail) + '</div></div>'; }).join('');
            return [card('Baobab network', list([pageLink('baobab.html', '🌳 Baobab portal'), pageLink('baobab_terminal.html', '🛡️ Baobab Security Terminal'), pageLink('https://baobab.faa.zone', '🌐 baobab.faa.zone')])),
                card('Archive of milestones', '<div class="timeline">' + (ev || '<p class="muted">No entries yet.</p>') + '</div>', 'wide')];
        },
        connect: function (m, p) {
            var r = m && m.readiness;
            return [card('Live grid status', (p ? '<p class="big">' + led('green') + p.flow.green + ' green · ' + led('amber') + p.flow.amber + ' amber · ' + led('red') + p.flow.red + ' red</p>' : '') +
                    (r ? '<p class="muted">' + (r.built + r.in_app) + ' of ' + r.total + ' launch items reachable.</p>' : '') + pageLink('pulse-monitor.html', '📡 Open Signal Sync →')),
                card('Ways to connect', list([pageLink('admin/admin-portal-approval.html', '🔑 Request portal access'), pageLink('partner-program.html', '🤝 Partner Program'),
                    pageLink('developer-api.html', '🧬 Developer API'), pageLink('contact-support.html', '🆘 Contact Support')]))].concat(p ? p.stations.map(stationCard) : []);
        },
        contact: function () {
            return [card('Contact', '<p class="muted">Reach the FAA.zone™ team through the official contact and support pages.</p>' +
                    list([pageLink('https://faa.zone/contact-us.html', '✉️ Contact us'), pageLink('https://faa.zone/support.html', '🆘 Support')])),
                card('Access requests', '<p class="muted">For portal access tiers (Family, Shareholder, Service Provider, Loyalty):</p>' + pageLink('admin/admin-portal-approval.html', '🔑 Portal Access Approval →'))];
        },
        devapi: function (m, p, g) {
            var eps = [
                ['ecosystem-manifest.json', 'Pages, launch groups and readiness, sectors, domains, intelligence counts, milestones', m ? m.generated_at : null],
                ['omnigrid-pulse.json', 'The six pulse stations and the global green/amber/red flow', p ? p.generated_at : null],
                ['grid-data.json', 'Sector catalogue: brands, sub-nodes, tariff index, license ledger, clauses, tech stack', null]];
            return [card('Public data endpoints', '<p class="muted">Static JSON files served next to the pages. Read-only, counts and public catalogue only, no keys required.</p>' +
                    table(['File', 'Contains', 'Snapshot'], eps.map(function (e) { return [pageLink(e[0], e[0]), esc(e[1]), esc(e[2] ? e[2].slice(0, 10) : '—')]; })), 'wide'),
                card('Example', '<pre class="code">fetch(\'/ecosystem-manifest.json\')\n  .then(r =&gt; r.json())\n  .then(d =&gt; console.log(d.readiness));</pre>'),
                card('Front-end layer', list(['<code>omnigrid-app.js</code>: in-app routing, terminals, pulse hover', '<code>og-pages.js</code>: detail-page renderer']))];
        },
        partners: function (m, p, g) {
            var gr = g && g.admin && g.admin.licenseLedger && g.admin.licenseLedger.growth;
            return [card('Partner tracks', list(['🤝 Service Providers and distributors', '📦 Brand owners joining a sector', '🧬 Developers building on the public data'])),
                card('Commercial terms', list([pageLink('faa-distributor.html', '🤝 Distributor tariff index'), pageLink('licensing.html', '🔐 License tiers') + (gr ? ' · ' + gr.datasets.map(function (d) { return esc(d.label); }).join(', ') : '')])),
                card('Apply', '<p class="muted">Partner applications go through portal access.</p><a class="cta" href="' + esc(base + 'admin/admin-portal-approval.html') + '">Apply as a partner</a>')];
        },
        modules: function (m) {
            if (!m) return [card('Modules', '<p class="muted">Snapshot unavailable.</p>')];
            return m.groups.filter(function (gr) { return gr.id !== 'G'; }).map(function (gr) {
                var ok = gr.items.filter(function (i) { return i.status !== 'missing'; }).length;
                return card(gr.id + ' · ' + gr.name + ' (' + ok + '/' + gr.items.length + ')', list(gr.items.map(function (i) { return pageLink(i.page, i.page.replace(/\.html$/, '')) + ' ' + badge(CLASS[i.status], LABEL[i.status]); })));
            });
        },
        brands: function (m, p, g) {
            if (!g) return noGrid();
            var rows = sectorRows(g).filter(function (r) { return r.brands; });
            var html = rows.map(function (r) {
                return '<details class="pack"><summary>' + esc(r.name) + ' <span class="badge">' + fmt(r.brands) + ' brands</span></summary><div class="chips">' +
                    r.data.brands.map(function (b) { return '<a class="chip" data-q="' + esc(String(b).toLowerCase()) + '" href="' + esc(brandHref(r.key, b)) + '">' + esc(b) + '</a>'; }).join('') + '</div></details>';
            }).join('');
            setTimeout(function () {
                var q = document.getElementById('brand-q'); if (!q) return;
                q.addEventListener('input', function () {
                    var v = q.value.trim().toLowerCase();
                    document.querySelectorAll('details.pack').forEach(function (d) {
                        var any = false;
                        d.querySelectorAll('.chip').forEach(function (c) { var hit = !v || c.getAttribute('data-q').indexOf(v) !== -1; c.style.display = hit ? '' : 'none'; any = any || hit; });
                        d.style.display = any ? '' : 'none'; if (v) d.open = any;
                    });
                });
            }, 0);
            return [card('Global brands · ' + fmt(rows.reduce(function (t, r) { return t + r.brands; }, 0)) + ' catalogued',
                '<input id="brand-q" class="search" type="search" placeholder="Search brands…" aria-label="Search brands">' + html, 'wide')];
        },
        codenest: function (m) {
            var r = m && m.intelligence && m.intelligence.repos;
            return [card('CodeNest™', '<p class="muted">The code behind the grid: every portal, page and tool lives in version control.</p>' +
                    (r ? list([fmt(r.total) + ' repositories', fmt(r.public) + ' public · ' + fmt(r.private) + ' private', 'Every repository scanned for live keys']) : '')),
                card('New project', '<span id="new-project"></span><p class="muted">New projects start with portal access, then a repository and a sector.</p><a class="cta" href="' + esc(base + 'admin/admin-portal-approval.html') + '">Start a new project</a>'),
                card('Build blocks', list([pageLink('developer-api.html', '🧬 Developer API'), pageLink('plotvault.html', '🧩 Modules'), pageLink('faa-hardware.html', '🖥️ Infrastructure')]))];
        },
        legal: function () { return legalCards(cfg.doc); },
        terminal: function (m, p, g) {
            var d = cfg.doc || '', out = [];
            if (d.indexOf('view:') === 0) {
                var target = d.slice(5);
                out.push(card('Terminal', '<p class="muted">This terminal opens the full view.</p><a class="cta" href="' + esc(base + target) + '">Open ' + esc(target.replace(/\.html$/, '')) + ' →</a>'));
            } else if (d === 'flow') {
                out = out.concat(RENDER.pulse(m, p));
            } else {
                var st = station(p, d);
                out.push(st ? stationCard(st) : card('Terminal', '<p class="muted">Pulse snapshot unavailable.</p>'));
            }
            out.push(card('All terminals', list([['vault-master', '🦍 VaultMaster'], ['cube-lattice', '🧱 Cube Lattice'], ['global-view', '🌍 Global View'], ['freight-ops', '🚚 Freight Ops'],
                ['loop-watch', '♻️ Loop Watch'], ['seedwave', '🌱 Seedwave'], ['distribution', '📦 Distribution'], ['signal', '🔐 Signal'], ['faa-brands', '📦 7038 FAA Brands']]
                .map(function (t) { return pageLink(t[0] + '.html', t[1]); }))));
            return out;
        },
        adminhub: function (m) {
            var r = m && m.readiness;
            return [card('Administration', list([pageLink('seedwave_admin.html', '🌱 Seedwave™ Admin Portal'), pageLink('dashboard.html', '⚙️ Dashboard'), pageLink('faa-owner.html', '🧑‍✈️ FAA Owner'),
                    pageLink('admin/admin-portal-approval.html', '🔑 Portal Access Approval'), pageLink('audit-tracker.html', '📈 Audit Tracker')])),
                card('Grid data', list([pageLink('grid-index.html', '📊 Scroll Grid Index'), pageLink('sector-map.html', '🗺️ Sector Map'), pageLink('scroll-grid.html', '🧱 Scroll Grid'), pageLink('developer-api.html', '🧬 Data files')])),
                card('Launch', r ? '<p class="big">' + (r.built + r.in_app) + ' of ' + r.total + ' reachable</p>' + pageLink('ecosystem.html#readiness', 'Open the launch board →') : '<p class="muted">Snapshot unavailable.</p>')];
        },
        connector: function (m, p, g, intel, atlas, lic, concept, bk, brand) {
            if (!brand || !brand.guide) return [card('Banimal Connector', '<p class="muted">Brand source unavailable right now.</p>')];
            var G = brand.guide, L = brand.ledger || {}, B = base + 'brand/';
            var img = function (f, alt, cls) { return '<img class="' + (cls || 'mark') + '" src="' + esc(B + f) + '" alt="' + esc(alt) + '">'; };
            var sw = (G.palette || []).map(function (c) {
                return '<div class="swatch"><span class="chip-c" style="background:' + esc(c.hex) + '"></span><b>' + esc(c.name) + '</b><code>' + esc(c.hex) + '</code><span class="sub">' + esc(c.role) + '</span></div>';
            }).join('');
            var r = G.paletteRatio || {};
            var files = (L.files || []).map(function (f) { return [esc(f.published), esc(f.role), '<code>' + esc(String(f.gitBlobSha).slice(0, 10)) + '</code>', f.pinnedByManifest ? badge('ok', 'Pinned') : badge('warn', 'Verified master')]; });
            var banimalMarket = 0;
            if (atlas) Object.keys(atlas.sectors).forEach(function (k) { (atlas.sectors[k].market || []).forEach(function (x) { if (normName(x.b) === 'banimal') banimalMarket++; }); });
            return [card('One brand source, pulled everywhere',
                    '<div class="brandfield"><p>The Banimal Connector carries the single Sam Fox™ Core CI Guide Master. Every surface <b>pulls</b> the verified marks and rules from <code>heyns1000/banimal</code>; nothing is redrawn, recoloured or retyped.</p>' +
                    img('banimal-logo-ink.png', 'Banimal™ · Kind Creatures', 'mark wide-mark') + '<span class="brand-corner">' + img('samfox-icon-verified-ink.png', 'Sam Fox™ fox-head icon', 'mark icon-mark') + '</span></div>', 'wide'),
                card('Sam Fox™ · the hand, always kept', '<div class="brandfield small">' + img('samfox-icon-verified-ink.png', 'Sam Fox™ fox-head icon (ink)', 'mark icon-mark') + '</div>' +
                    '<p class="muted">The verified fox-head icon. The "o" in "fox" is this icon, never a typed letter.</p>'),
                card('Fruitful™ · the ecosystem brand', '<div class="brandfield small">' + img('fruitful-lockup-verified.png', 'Fruitful™ lockup (verified master)', 'mark wide-mark') + '</div>' +
                    '<div class="brandrow">' + img('fruitful-wordmark-verified.png', 'Fruitful™ wordmark', 'mark mini') + img('fruitful-pear-verified.png', 'Fruitful™ pear icon', 'mark mini') + '</div>' +
                    '<p class="muted">Verified master marks: pear icon, wordmark and lockup, sticker style, ™ only.</p>'),
                card('Banimal™ · Kind Creatures', '<div class="brandfield small">' + img('banimal-logo-ink.png', 'Banimal™ logo (ink)', 'mark wide-mark') + '</div>' +
                    '<div class="brandfield small inkfield">' + img('banimal-logo-white.png', 'Banimal™ logo (white)', 'mark wide-mark') + '</div>' +
                    '<p class="muted">' + fmt(banimalMarket) + ' Banimal marketplace products in the grid. ' + pageLink('sectors/fashion/index.html', 'Open them →') + '</p>'),
                card('Verified palette', '<div class="swatches">' + sw + '</div><p class="muted">Ratio across any composition: Cream ' + r.cream + ' · Body ' + r.body + ' · Accent ' + r.accent + ' · Ink ' + r.ink + '. Red is reserved for alerts.</p>', 'wide'),
                card('Rules that protect the brand', list((G.compliance || []).map(esc).concat(['Placement bottom-right, one script "S" of clear space, on white, cream or ink only.', 'Legal entity line (locked): ' + esc(brand.legalEntity || 'Fruitful Shops (Pty) Ltd') + '.']))),
                card('Connected surfaces', list(['🧠 Claude Code: the <code>samfox-ci-guide</code> skill (the machine master), installed for every session',
                    '🧩 WordPress: Banimal Ecosystem Connector 5.1.1 applies the guide to the theme', '☁️ Worker: <code>/api/brand-guide</code>, live with the ecosystem launch',
                    '🕸️ This grid: marks pulled into <code>brand/</code>, checked against the pinned SHAs'])),
                card('Build ledger · ' + esc(L.policyId || ''), '<p class="muted">Pulled from ' + esc(L.source || '') + ' @ <code>' + esc(String(L.sourceCommit || '').slice(0, 7)) + '</code> on ' + esc(String(L.pulled_at || '').slice(0, 10)) + '. ' + esc(L.audit || '') + '.</p>' +
                    table(['Published file', 'Role', 'Git blob', 'Status'], files), 'wide'),
                card('Legal', '<p class="muted">© ' + new Date().getFullYear() + ' ' + esc(brand.legalEntity || 'Fruitful Shops (Pty) Ltd') + ' · Artwork © Sam Fox™ · All rights reserved. Reproduction beyond the Fruitful project requires commission or licence.</p>')];
        },
        backlog: function (m, p, g, intel, atlas, lic, concept, bk) {
            var path = decodeURIComponent(location.pathname.replace(/^\/+/, ''));
            var d = bk && bk.pages && bk.pages[path];
            if (!d) return [card('Not built yet', '<p class="muted">This page has not been built yet.</p>' + pageLink('ecosystem.html', '🌍 Back to the ecosystem'))];
            cfg.title = d.title; cfg.intro = d.label && d.label !== d.title ? d.label : '';
            document.title = d.title + ' · Fruitful™ OmniGrid™';
            var folder = path.split('/')[1] || '';
            return [card(d.title, d.paragraphs.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join(''), 'wide'),
                card('From', '<p class="muted">Built from the description on the concept page that links here.</p>' + list([pageLink(d.source, '↩ ' + d.source.split('/').slice(1).join('/'))])),
                card('Sector', list([pageLink('sectors/' + folder + '/index.html', '🏙️ ' + titleOf(folder) + ' sector'), pageLink('grid-index.html', '📊 Grid Index')]))];
        },
        sector: function (m, p, g, intel, atlas, lic, concept) {
            if (!g) return noGrid();
            var slug = cfg.sector, key = dataKey(slug), s = g.sectors[key];
            var A = atlas && atlas.sectors && atlas.sectors[key], X = atlas && atlas.extraSectors && atlas.extraSectors[slug];
            if (!s && !A) {
                if (X) {
                    return [card('Sector at a glance', '<div class="tiles">' + [[usd(X.monthly), 'per month'], [usd(X.annual), 'per year'], [X.tier, 'plan tier']].map(tile).join('') + '</div>' +
                            '<p class="muted">Part of the Fruitful Crate Dance ecosystem price book (FruitfulPlanetChange). No brands catalogued in this sector yet.</p>', 'wide'),
                        card('Take part', list([pageLink('partner-program.html', '🤝 Bring a brand into this sector'), pageLink('sector-map.html', '🗺️ Sector Map')]))];
                }
                return [card('Sector', '<p class="muted">This sector is not in the catalogue yet.</p>' + pageLink('sector-grid.html', '🏙️ Sector Grid →'))];
            }
            var brands = A ? A.brands : s.brands.map(function (b, i) { return { n: b, s: s.subNodes[i] || [], src: ['grid'] }; });
            var z = (g.zoneIndex || {})[key] || {}, pr = A && A.pricing, nodes = 0;
            brands.forEach(function (b) { nodes += (b.s || []).length; });
            var tiles = [[brands.length, 'brands'], [nodes, 'sub-nodes'], [pr ? usd(pr.monthly) : (z.monthlyFee || '—'), 'per month'], [pr ? usd(pr.annual) : (z.annualFee || '—'), 'per year'],
                [pr ? pr.tier : '—', 'plan tier'], [z.payoutTier || '—', 'payout tier'], [z.region || '—', 'region']];
            var chips = brands.map(function (b) {
                var bi = brandIntel(intel, b.n);
                return '<a class="chip col" data-q="' + esc((b.n + ' ' + (b.s || []).join(' ') + ' ' + (b.d || '')).toLowerCase()) + '" href="' + esc(brandHref(key, b.n)) + '"><span>' + esc(b.n) + '</span>' +
                    '<span class="sub">' + fmt((b.s || []).length) + ' nodes · ' + srcTags(b.src) + (bi && (bi.claude || bi.perplexity) ? ' · ' + fmt(bi.claude + bi.perplexity) + ' mentions' : '') + '</span></a>';
            }).join('');
            searchable('sector-q', '.chip', '.brand-group');
            var peers = sectorRows(g).filter(function (r) { return r.key !== key && r.zone && z.payoutTier && r.zone.payoutTier === z.payoutTier; });
            var alias = slug !== key ? '<p class="muted">Also known as <b>' + esc(slug) + '</b>; this is the ' + esc(sectorName(g, key)) + ' sector.</p>' : '';
            var out = [card('Sector at a glance', alias + '<div class="tiles">' + tiles.map(tile).join('') + '</div>', 'wide'),
                brands.length ? card('Brands · ' + fmt(brands.length), '<p class="muted">Sources: ' + SRC_LEGEND + '</p><input id="sector-q" class="search" type="search" placeholder="Search this sector…" aria-label="Search brands in this sector"><div class="chips brand-group">' + chips + '</div>', 'wide')
                    : card('Brands', '<p class="muted">No brands catalogued in this sector yet.</p>' + pageLink('partner-program.html', '🤝 Bring a brand into this sector →'))];
            if (pr || z.monthlyFee) out.push(card('Price book', table(['Source', 'Monthly', 'Annual', 'Tier'], [].concat(
                pr ? [['FruitfulPlanetChange price book', usd(pr.monthly), usd(pr.annual), esc(pr.tier)]] : [],
                z.monthlyFee ? [['FAA.zone tariff index', esc(z.monthlyFee), esc(z.annualFee || '—'), esc(z.payoutTier || '—')]] : []))));
            if (A && A.licence) {
                var L = A.licence;
                out.push(card('FAA™ brand licences · ' + fmt(L.count), list([
                    'Categories: ' + Object.keys(L.categories).map(function (c) { return esc(c) + ' (' + fmt(L.categories[c]) + ')'; }).join(', '),
                    'Tiers: ' + Object.keys(L.tiers).map(function (t) { return esc(t) + ' ' + fmt(L.tiers[t]); }).join(' · '),
                    'Licence fee ' + usd(L.feeUSD.min) + ' – ' + usd(L.feeUSD.max) + ' (median ' + usd(L.feeUSD.median) + ')']) +
                    '<p class="muted">From the FAA™ Brand Licensing System, mapped to this sector by licence category.</p>' + pageLink('faa-licenses.html?sector=' + encodeURIComponent(key), 'Open these licences →')));
            }
            if (A && A.market && A.market.length) {
                var hasBanimal = A.market.some(function (x) { return normName(x.b) === 'banimal'; });
                out.push(card('Marketplace · ' + fmt(A.market.length) + ' products', (hasBanimal ? '<a class="brandfield small" href="' + esc(base + 'banimal-connector.html') + '"><img class="mark wide-mark" src="' + esc(base + 'brand/banimal-logo-ink.png') + '" alt="Banimal™ · Kind Creatures"></a>' : '') + table(['Product', 'Brand', 'Type', 'Price'], A.market.map(function (x) {
                    return [esc(x.n), esc(x.b) + (x.mapped ? ' <span class="sub">(mapped)</span>' : ''), esc(String(x.c || '').replace(/_/g, ' ')), priceOf(x.p)];
                })), 'wide'));
            }
            var C = concept && concept.sectors && concept.sectors[key];
            if (C && C.length) out.push(card('Concept pages · ' + fmt(C.length), '<p class="muted">Hand-built sector concept pages from faa.zone, kept as designed.</p>' +
                list(C.map(function (c) { return pageLink(c.file, c.title) + ' <span class="sub">' + esc(c.file.split('/').slice(2).join('/')) + '</span>'; })), 'wide'));
            if (A && A.hubs && A.hubs.length) out.push(card('Sector hubs', list(A.hubs.map(function (h) { return h.url ? pageLink(h.url, h.n) : esc(h.n); }))));
            if (A) out.push(card('Sources', list(Object.keys(A.counts.bySource).map(function (k) { return SRC_NAME[k] + ': ' + fmt(A.counts.bySource[k]) + ' brands'; }))));
            out.push(intelCard(intelFor(intel, key), sectorName(g, key)),
                card('Same payout tier' + (z.payoutTier ? ' · ' + z.payoutTier : ''), peers.length ? list(peers.map(function (r) { return pageLink('sectors/' + r.key + '/index.html', r.name); })) : '<p class="muted">No other sectors in this tier.</p>'),
                card('Navigate', list([pageLink('sector-map.html', '🗺️ Sector Map'), pageLink('scroll-grid.html', '🧱 Scroll Grid'), pageLink('faa-licenses.html', '📜 FAA Licences'), pageLink('hubs.html', '🌍 Global Hubs'), pageLink('faa-distributor.html', '🤝 Tariffs')])));
            return out;
        },
        brand: function (m, p, g, intel, atlas) {
            if (!g) return noGrid();
            var key = dataKey(param('s') || ''), name = param('b') || '', s = g.sectors[key], A = atlas && atlas.sectors && atlas.sectors[key];
            var list_ = A ? A.brands : (s ? s.brands.map(function (b, i) { return { n: b, s: s.subNodes[i] || [], src: ['grid'] }; }) : []);
            var idx = -1, nn = normName(name);
            list_.forEach(function (b, i) { if (idx < 0 && (b.n === name || normName(b.n) === nn)) idx = i; });
            if (!name || idx < 0) {
                return [card(name ? 'Brand not found' : 'Choose a brand', '<p class="muted">Pick a brand from the grid.</p>' + list([pageLink('scroll-grid.html', '🧱 Scroll Grid'), pageLink('global_brands.html', '🌍 Global Brands'), pageLink('faa-licenses.html', '📜 FAA Licences')]))];
            }
            var B = list_[idx];
            document.title = B.n + ' · ' + sectorName(g, key) + ' · Fruitful™ OmniGrid™';
            cfg.title = B.n; cfg.intro = sectorName(g, key) + ' · brand scroll';
            var z = (g.zoneIndex || {})[key] || {}, pr = A && A.pricing, bi = brandIntel(intel, B.n), sub = B.s || [];
            var near = list_.slice(Math.max(0, idx - 6), idx + 7).filter(function (b) { return b !== B; });
            var market = (A && A.market || []).filter(function (x) { return normName(x.b) === normName(B.n); });
            var out = [card('Brand scroll', (B.d ? '<p>' + esc(B.d) + '</p>' : '') + list(['Sector: ' + pageLink('sectors/' + key + '/index.html', sectorName(g, key)), 'Position ' + fmt(idx + 1) + ' of ' + fmt(list_.length) + ' in the sector',
                    'Sector plan ' + (pr ? usd(pr.monthly) + ' / month · ' + usd(pr.annual) + ' / year · ' + esc(pr.tier) : esc(z.monthlyFee || '—') + ' / month'),
                    'Payout tier ' + esc(z.payoutTier || '—') + ' · ' + esc(z.region || '—'), 'Sources: ' + srcTags(B.src, true)])),
                card('Sub-nodes · ' + fmt(sub.length), sub.length ? '<div class="chips">' + sub.map(function (n) { return '<span class="chip">' + esc(n) + '</span>'; }).join('') + '</div>' : '<p class="muted">No sub-nodes catalogued.</p>', 'wide')];
            if (market.length) out.push(card('Marketplace', table(['Product', 'Type', 'Price'], market.map(function (x) { return [esc(x.n), esc(String(x.c || '').replace(/_/g, ' ')), priceOf(x.p)]; })), 'wide'));
            out.push(card('Intelligence', bi ? list([fmt(bi.claude) + ' Claude sources mention this brand', fmt(bi.perplexity) + ' Perplexity index records']) : '<p class="muted">No mentions found in the Claude or Perplexity records.</p>'),
                card('Neighbouring brands', '<div class="chips">' + near.map(function (b) { return '<a class="chip" href="' + esc(brandHref(key, b.n)) + '">' + esc(b.n) + '</a>'; }).join('') + '</div>'),
                card('Take part', list([pageLink('admin/admin-portal-approval.html', '🔑 Request access'), pageLink('partner-program.html', '🤝 Partner Program'), pageLink('faa-licenses.html?sector=' + encodeURIComponent(key), '📜 Licences in this sector')])));
            return out;
        },
        sectormap: function (m, p, g, intel, atlas) {
            if (!g) return noGrid();
            var rows = sectorRows(g).map(function (r) { var A = atlas && atlas.sectors && atlas.sectors[r.key]; if (A) { r.brands = A.counts.brands; r.nodes = A.counts.subnodes; } return r; }), tiers = {};
            rows.forEach(function (r) { var t = (r.zone && r.zone.payoutTier) || 'Unrated'; (tiers[t] = tiers[t] || []).push(r); });
            var order = Object.keys(tiers).sort(function (a, b) { var o = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'Unrated']; return (o.indexOf(a) + 99) % 99 - (o.indexOf(b) + 99) % 99; });
            var max = Math.max.apply(null, rows.map(function (r) { return r.brands; }).concat([1]));
            var cols = order.map(function (t) {
                return '<div class="tiercol"><h4>Tier ' + esc(t) + ' · ' + tiers[t].length + '</h4>' + tiers[t].sort(function (a, b) { return b.brands - a.brands; }).map(function (r) {
                    var d = 44 + Math.round(76 * Math.sqrt(r.brands / max)), i = intelFor(intel, r.key);
                    return '<a class="bubble" href="' + esc(sectorHref(r.key)) + '" title="' + esc(r.name + ' · ' + r.brands + ' brands · ' + r.nodes + ' nodes') + '">' +
                        '<span class="orb" style="width:' + d + 'px;height:' + d + 'px"></span><span class="bl">' + esc(r.name) + '</span><span class="sub">' + fmt(r.brands) + ' brands · ' + esc((r.zone && r.zone.region) || '') +
                        (i ? ' · ' + fmt(i.claude_chats) + ' chats' : '') + '</span></a>';
                }).join('') + '</div>';
            }).join('');
            var extras = atlas && atlas.extraSectors ? Object.keys(atlas.extraSectors) : [];
            var out = [card('Sector map · ' + rows.length + ' sectors by payout tier', '<p class="muted">Orb size is the number of catalogued brands across all sources. Select a sector to open it.</p><div class="tiermap">' + cols + '</div>', 'wide')];
            if (extras.length) out.push(card('Fruitful Crate Dance ecosystem · ' + extras.length, '<div class="chips">' + extras.map(function (k) { return '<a class="chip" href="' + esc(sectorHref(k)) + '">' + esc(titleOf(k)) + ' · ' + usd(atlas.extraSectors[k].monthly) + '/mo</a>'; }).join('') + '</div>', 'wide'));
            return out;
        },
        scrollgrid: function (m, p, g, intel, atlas) {
            if (!g) return noGrid();
            var rows = sectorRows(g).map(function (r) {
                var A = atlas && atlas.sectors && atlas.sectors[r.key];
                r.names = A ? A.brands.map(function (b) { return b.n; }) : r.data.brands.map(String); r.brands = r.names.length; return r;
            }).filter(function (r) { return r.brands; }), total = 0;
            var html = rows.map(function (r, ri) {
                total += r.brands;
                var hue = Math.round(ri * 360 / rows.length);
                return '<div class="brand-group sg"><div class="sg-h"><a href="' + esc(sectorHref(r.key)) + '">' + esc(r.name) + '</a> <span class="badge">' + fmt(r.brands) + '</span></div><div class="sg-cells">' +
                    r.names.map(function (b) { return '<a class="cell" data-q="' + esc(String(b).toLowerCase()) + '" style="--h:' + hue + '" href="' + esc(brandHref(r.key, b)) + '" title="' + esc(b) + '"></a>'; }).join('') + '</div></div>';
            }).join('');
            searchable('grid-q', '.cell', '.brand-group');
            return [card('Scroll Grid · ' + fmt(total) + ' brand scrolls', '<p class="muted">Every catalogued brand, from every source, is one tile coloured by sector. Select a tile to open its scroll.</p>' +
                '<input id="grid-q" class="search" type="search" placeholder="Find a brand…" aria-label="Find a brand">' + html, 'wide')];
        },
        licenses: function (m, p, g, intel, atlas, lic) {
            if (!lic) return [card('FAA™ licences', '<p class="muted">Licence data unavailable right now.</p>')];
            var F = lic.fields, B = lic.brands, meta = lic.metadata || {};
            var pre = param('sector') || '';
            function uniq(i) { var o = {}; B.forEach(function (r) { if (r[i]) o[r[i]] = (o[r[i]] || 0) + 1; }); return Object.keys(o).sort(); }
            function sel(id, label, vals, cur) { return '<select id="' + id + '" class="search" aria-label="' + esc(label) + '"><option value="">All ' + esc(label) + '</option>' + vals.map(function (v) { return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(v) + '</option>'; }).join('') + '</select>'; }
            setTimeout(function () {
                var q = document.getElementById('lic-q'), t = document.getElementById('lic-tier'), c = document.getElementById('lic-cat'), d = document.getElementById('lic-div'), s = document.getElementById('lic-sec');
                var body = document.getElementById('lic-body'), more = document.getElementById('lic-more'), count = document.getElementById('lic-count'), shown = 0, rows = [];
                function row(r) { return '<tr><td>' + esc(r[0]) + '<span class="sub"> ' + esc(r[1]) + '</span></td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td><td>' + esc(r[4]) + '</td><td>' + usd(r[5]) + '</td><td>' + fmt(r[6]) + ' ECR</td><td>' + r[7] + '%</td><td>' + (r[8] ? pageLink('sectors/' + r[8] + '/index.html', r[8]) : '—') + '</td></tr>'; }
                function page() { var next = rows.slice(shown, shown + 200); body.insertAdjacentHTML('beforeend', next.map(row).join('')); shown += next.length; more.style.display = shown < rows.length ? '' : 'none'; }
                function apply() {
                    var v = q.value.trim().toLowerCase();
                    rows = B.filter(function (r) { return (!t.value || r[2] === t.value) && (!c.value || r[3] === c.value) && (!d.value || r[4] === d.value) && (!s.value || r[8] === s.value) && (!v || (String(r[0]) + ' ' + r[1]).toLowerCase().indexOf(v) !== -1); });
                    body.innerHTML = ''; shown = 0; count.textContent = fmt(rows.length) + ' of ' + fmt(B.length) + ' licences'; page();
                }
                [q, t, c, d, s].forEach(function (el) { el.addEventListener(el === q ? 'input' : 'change', apply); });
                more.addEventListener('click', page);
                apply();
            }, 0);
            var br = meta.breakdown || {};
            var verified = (lic.verified || []).map(function (v) {
                return '<details class="pack"><summary>' + esc(v.n) + ' <span class="badge">' + esc(v.t) + '</span> <span class="sub">' + esc(v.g || '') + '</span></summary>' +
                    list([esc(v.type || ''), 'Master licence: ' + esc(v.master || '—'), 'Monthly: ' + esc(v.monthly || '—'), 'Royalty: ' + esc(v.royalty || '—'), 'OmniDrop kit: ' + esc(v.kit || '—'),
                        'Region: ' + esc(v.region || '—'), v.phrase ? '<i>' + esc(v.phrase) + '</i>' : '']) + (v.d ? '<p class="muted">' + esc(v.d) + '</p>' : '') + '</details>';
            }).join('');
            return [card('FAA™ Brand Licensing System · ' + fmt(B.length) + ' licences', '<div class="tiles">' + [[B.length, 'licensed brands'], [br.sovereign, 'sovereign'], [br.dynastic, 'dynastic'], [br.operational, 'operational'], [br.market, 'market'], [(meta.geographicDivisions || []).length, 'divisions']].map(tile).join('') + '</div>' +
                    '<p class="muted">Exported ' + esc(String(meta.exportDate || '').slice(0, 10)) + ' from the codenest LicenseVault. Fees in USD and ECR; sector is mapped from the licence category.</p>', 'wide'),
                card('Directory', '<div class="filters"><input id="lic-q" class="search" type="search" placeholder="Search licences…" aria-label="Search licences">' +
                    sel('lic-tier', 'tiers', uniq(2)) + sel('lic-cat', 'categories', uniq(3)) + sel('lic-div', 'divisions', uniq(4)) + sel('lic-sec', 'sectors', uniq(8), pre) + '</div>' +
                    '<p class="muted" id="lic-count"></p><div class="tbl"><table><thead><tr><th>Brand</th><th>Tier</th><th>Category</th><th>Div</th><th>Fee USD</th><th>Fee ECR</th><th>Royalty</th><th>Sector</th></tr></thead><tbody id="lic-body"></tbody></table></div>' +
                    '<button id="lic-more" class="cta" type="button">Show more</button>', 'wide'),
                card('Seedwave™ Verified brands · ' + fmt((lic.verified || []).length), '<p class="muted">Premium brands with full licence terms.</p>' + verified, 'wide')];
        },
        hubs: function (m, p, g, intel, atlas) {
            var H = (atlas && atlas.hubs) || [];
            if (!H.length) return [card('Global hubs', '<p class="muted">Hub data unavailable right now.</p>')];
            function hubList(k) { return H.filter(function (h) { return h.kind === k; }).map(function (h) { return '<div class="row"><span>' + (h.url ? pageLink(h.url, h.n) : esc(h.n)) + '<span class="sub">' + esc(h.d || '') + '</span></span>' + badge(h.status === 'active' ? 'ok' : 'warn', h.status || '—') + '</div>'; }).join(''); }
            return [card('Regional hubs · ' + H.filter(function (h) { return h.kind === 'region'; }).length, '<div class="rows">' + hubList('region') + '</div>', 'wide'),
                card('Platforms and portals · ' + H.filter(function (h) { return h.kind !== 'region'; }).length, '<div class="rows">' + hubList('platform') + '</div>', 'wide'),
                card('About', '<p class="muted">From the codenest global sector index (52 repositories). Hub sites open in-app and go live with the launch.</p>')];
        },
        fse: function () {
            var sheet = [['Product ID', 'FRU-CRE-3102'], ['VaultID', 'VAULT-939V'], ['Zone', 'C 2'], ['Security', 'FAA-SEC A+'],
                ['Active nodes', '1,580'], ['Pulse activity', '43,792 / sec'], ['Latency', '109 ms'], ['Compliance', 'Active & Certified']];
            return [card('The behavioural nervous system of the ecosystem',
                    '<p class="muted">Not a feature product: a <b>Human Volatility Dampener™</b> embedded inside VaultMesh™. Without it, governance becomes mechanical; with it, governance becomes adaptive.</p>', 'wide'),
                card('Product sheet', table(['Field', 'Value'], sheet.map(function (r) { return [esc(r[0]), esc(r[1])]; })) +
                    '<p class="muted">Figures as published in the FAA Actuary Mastery™ Final Loop Directive (13 Feb 2026).</p>'),
                card('What it governs', list(['Trust Velocity', 'Conflict Containment', 'Authenticity Stability', 'Relational Risk'])),
                card('Strategic position', list(['ContractCast™ governs agreements', 'Heat Map governs capital', 'REI governs entropy', '<b>Fruitful Social Engin™ governs the human signal</b>'])),
                card('The final loop', '<p class="big">Code → Governance → Human Signal</p>' +
                    list(['Build Phase', 'Ecosystem Governance Phase', 'Signal Intelligence Phase'])),
                card('Related', list([pageLink('pulse-monitor.html', '📡 Signal Sync'), pageLink('compliance.html', '🛡️ Compliance'), pageLink('ecosystem.html', '🌍 Global Ecosystem')]))];
        },
        hat: function () {
            var H = cfg.__hat || {}, S = H.summary, D = H.letter || { systems: [], files: [], folders: [] }, L = H.L;
            if (!S) return [card('A–Z Ecosystem Index', '<p class="muted">The index data is not available yet.</p>', 'wide')];
            var letters = Object.keys(S.letters).sort();
            var bar = '<div class="hat-bar">' + letters.map(function (k) {
                var n = S.letters[k]; return '<a class="hat-l' + (k === L ? ' on' : '') + '" href="#' + esc(k) + '" title="' + esc(n.systems + ' systems · ' + n.files + ' files · ' + n.folders + ' folders') + '">' + esc(k) + '</a>';
            }).join('') + '</div>';
            var search = '<input id="hat-q" class="hat-q" type="search" placeholder="Find any page, file or folder name you remember…" aria-label="Search the index">' +
                '<div id="hat-r" class="rows"></div>';
            var tot = [['Repos', fmt(S.repos.total) + ' (' + fmt(S.repos.heyns1000) + ' heyns1000 + ' + fmt(S.repos['Fruitful-Global-Planet']) + ' Fruitful-Global-Planet)'],
                ['Systems (pages and apps)', fmt(S.systems) + ' · ' + fmt(S.systems_multi_version) + ' with several versions · ' + fmt(S.versions) + ' versions'],
                ['File groups', fmt(S.file_groups)], ['Folder names', fmt(S.folders)], ['Commits', fmt(S.commits)],
                ['Files indexed', S.file_rows ? fmt(S.file_rows) + ' rows · ' + fmt(S.distinct_files) + ' distinct' : 'building'], ['Atom branches', fmt(S.atom_branches)]];
            var sys = D.systems.map(function (x) {
                return [esc(x.name), fmt(x.versions), esc(x.repos.slice(0, 3).join(', ') + (x.repos.length > 3 ? ' +' + (x.repos.length - 3) : '')),
                    esc((x.first || '?') + ' → ' + (x.last || '?')), esc(x.tail.repo + ' / ' + x.tail.path.split('/').slice(-2).join('/')), esc(x.home),
                    x.branch_url ? pageLink(x.branch_url, x.branch.replace('atoms/', '')) : '—'];
            });
            var fl = D.files.slice(0, 60).map(function (x) { return [esc(x.name), esc(x.kind), fmt(x.versions), fmt(x.repo_count), esc((x.first || '?') + ' → ' + (x.last || '?'))]; });
            var fo = D.folders.slice(0, 40).map(function (x) { return [esc(x.name + '/'), fmt(x.repos), fmt(x.files)]; });
            var a = S.atlas || {};
            return [card('A–Z', bar + search, 'wide'),
                card(esc(L) + ' · systems (' + D.systems.length + ')', sys.length ? table(['System', 'Versions', 'Repos', 'Seen', 'Tail (best version)', 'Proposed home', 'Atom branch'], sys) : '<p class="muted">No systems under ' + esc(L) + '.</p>', 'wide'),
                card(esc(L) + ' · files (' + D.files.length + (D.files.length >= 200 ? '+' : '') + ')', fl.length ? table(['File', 'Kind', 'Versions', 'Repos', 'Seen'], fl) : '<p class="muted">None.</p>'),
                card(esc(L) + ' · folders (' + D.folders.length + ')', fo.length ? table(['Folder', 'Repos', 'Files'], fo) : '<p class="muted">None.</p>'),
                card('Totals', table(['', ''], tot.map(function (r) { return [esc(r[0]), r[1]]; }))),
                card('Sector atlas refresh', '<p>' + badge(a.status === 'blocked' ? 'warn' : 'ok', a.status || 'unknown') + ' Last run ' + esc(a.last_refresh || '—') + '</p><p class="muted">' + esc(a.reason || '') + '</p>')];
        },
        access: function () {
            var tiers = ['👨‍👩‍👧‍👦 Family Access', '📊 Shareholder Access', '🤝 Service Provider', '🪙 Loyalty Access'];
            return tiers.map(function (t) {
                return card(t, '<p class="muted">Requests are reviewed before access is granted.</p>' +
                    '<a class="cta" href="https://faa.zone/contact-us.html">Request access</a>');
            });
        }
    };

    var NEEDS_GRID = /^(brandmetrics|clauses|distributor|hardware|owner|ledger|nodepacks|nodestatus|quick|layers|sectorgrid|about|partners|brands|sector|brand|sectormap|scrollgrid|hubs)$/.test(cfg.kind || '');
    var NEEDS_INTEL = /^(sector|brand|sectormap)$/.test(cfg.kind || '');
    var NEEDS_ATLAS = /^(sector|brand|sectormap|scrollgrid|hubs|connector)$/.test(cfg.kind || '');
    var NEEDS_LIC = cfg.kind === 'licenses';
    var NEEDS_CONCEPT = cfg.kind === 'sector';
    var NEEDS_BACKLOG = cfg.kind === 'backlog';
    var NEEDS_BRAND = cfg.kind === 'connector' || cfg.kind === 'sector';
    var HAT_L = (location.hash.replace('#', '') || 'A').toUpperCase().replace(/[^A-Z0-9#-]/g, '') || 'A';
    Promise.all([get('ecosystem-manifest.json'), get('omnigrid-pulse.json'), NEEDS_GRID ? get('grid-data.json') : Promise.resolve(null),
        NEEDS_INTEL ? get('sector-intel.json') : Promise.resolve(null), NEEDS_ATLAS ? get('sector-atlas.json') : Promise.resolve(null),
        NEEDS_LIC ? get('faa-licenses.json') : Promise.resolve(null), NEEDS_CONCEPT ? get('concept-pages.json') : Promise.resolve(null),
        NEEDS_BACKLOG ? get('backlog-pages.json') : Promise.resolve(null),
        cfg.kind === 'hat' ? Promise.all([get('hat/summary.json'), get('hat/letters/' + (HAT_L === '#' ? '0-9' : HAT_L) + '.json')]) : Promise.resolve(null),
        NEEDS_BRAND ? Promise.all([get('brand/brand-guide.json'), get('brand/brand-ledger.json')]).then(function (x) { return x[0] ? Object.assign({}, x[0], { ledger: x[1] }) : null; }) : Promise.resolve(null)]).then(function (res) {
        var m = res[0], p = res[1], g = res[2], intel = res[3], atlas = res[4], lic = res[5], concept = res[6], bk = res[7], hatd = res[8], brand = res[9];
        if (hatd) cfg.__hat = { summary: hatd[0], letter: hatd[1], L: HAT_L };
        cfg.__brand = brand;
        var cards = (RENDER[cfg.kind] || function () { return []; })(m, p, g, intel, atlas, lic, concept, bk, brand).filter(Boolean);
        var head = '<section class="page-hero"><div class="container">' +
            '<p class="kicker"><a href="' + esc(base + 'dashboard.html') + '">⚙️ Dashboard</a> · <a href="' + esc(base + 'ecosystem.html') + '">🌍 Ecosystem</a></p>' +
            '<h1>' + esc(cfg.title) + '</h1>' + (cfg.intro ? '<p class="tagline">' + esc(cfg.intro) + '</p>' : '') +
            (cfg.figure ? '<div class="figure"><b>' + esc(cfg.figure) + '</b><span>Dashboard figure</span></div>' : '') +
            '</div></section>';
        root.innerHTML = head + '<section><div class="container"><div class="cards">' + cards.join('') + '</div>' +
            '<p class="snapshot">Live snapshot ' + esc(m ? m.generated_at.slice(0, 10) : 'unavailable') + ' · counts only</p></div></section>';
        if (cfg.kind === 'hat') hatWire();
    });
    function hatWire() {
        var st = document.createElement('style'); st.textContent = '.hat-bar{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 14px}.hat-l{min-width:2.2em;text-align:center;padding:6px 8px;border-radius:10px;border:1px solid var(--border-color-light);text-decoration:none;font-weight:700}.dark-mode .hat-l{border-color:var(--border-color-dark)}.hat-l.on{background:var(--primary-color);color:#fff;border-color:var(--primary-color)}.hat-q{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--border-color-light);font:inherit;background:transparent;color:inherit}.dark-mode .hat-q{border-color:var(--border-color-dark)}'; document.head.appendChild(st);
        window.addEventListener('hashchange', function () { location.reload(); });
        var q = document.getElementById('hat-q'), out = document.getElementById('hat-r'), idx = null;
        if (!q) return;
        q.addEventListener('input', function () {
            var v = q.value.trim().toLowerCase();
            if (v.length < 2) { out.innerHTML = ''; return; }
            (idx ? Promise.resolve(idx) : get('hat/search.json').then(function (d) { idx = d || []; return idx; })).then(function (d) {
                var hits = d.filter(function (e) { return e[0].toLowerCase().indexOf(v) !== -1; }).slice(0, 25);
                out.innerHTML = hits.length ? hits.map(function (e) {
                    var t = e[1].indexOf('system:') === 0 ? 'title of ' + e[1].slice(7) : e[1];
                    return '<div class="row"><span><a href="#' + esc(e[2]) + '">' + esc(e[0]) + '</a><span class="sub">' + esc(t) + ' · ' + esc(e[2]) + '</span></span></div>';
                }).join('') : '<p class="muted">No match.</p>';
            });
        });
    }
})();
