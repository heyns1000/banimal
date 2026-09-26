// ===== Translations: English / Simplified Chinese (Mainland) / Spanish =====
// Persists the chosen language in localStorage and re-applies it on every
// load — the language fox-head toggle in the header cycles through the
// three. Verified brand terms (Fruitful™, Sam Fox™, Banimal™, "Shock
// Launch", the nine CI-Guide colour names, the welcome.fruitful.co.za
// domain, and code-tagged filenames) are never translated, per the same
// CI Guide compliance discipline documented in BUILD-VERIFICATION.md —
// a brand name in Chinese or Spanish copy is still that same brand name.

var TRANSLATIONS = {
  en: {
    'nav.reveal': 'The Reveal',
    'nav.portals': 'Portals',
    'nav.merge': 'Global Merge',
    'nav.verified': 'Verified',
    'nav.welcome': 'Welcome Page',
    'a11y.brandHome': 'Fruitful home',
    'a11y.langToggle': 'Switch language',
    'a11y.themeToDark': 'Switch to dark mode',
    'a11y.themeToLight': 'Switch to light mode',
    'header.cta': 'Get Notified',

    'hero.eyebrow': 'Launching soon · Flag status: standing by',
    'hero.title': 'Welcome to {{LOGO:hero}}',
    'hero.lede': 'Something iconic is about to break through. The Fruitful Portals are merging into one arrival — bigger, bolder, unleashed.',
    'hero.btn.activate': 'Activate the flag',
    'hero.btn.seePortals': 'See the Portals',
    'hero.scrollCue': 'Stay wild',

    'flag.eyebrow': 'The reveal',
    'flag.title': 'Flag activation',
    'flag.desc': "The flag means exactly what it says. When it's raised, the Fruitful ecosystem is live — every portal, every page, one signal.",
    'flag.pill.standing': 'Standing by',
    'flag.pill.active': 'Flag activated — ecosystem live',
    'flag.btn.raise': 'Raise the flag',
    'flag.btn.lower': 'Lower the flag',
    'flag.legacy': 'This mark carries decades of history — a flag illustration built and refined over 30 years within the Fruitful environment, now standing at the front of the Shock Launch.',
    'flag.caption': 'Flag raised = ecosystem live · flag lowered = standing by',

    'portals.eyebrow': 'Now visible',
    'portals.title': 'The {{LOGO:portalsTitle}} Portals',
    'portals.desc': 'The physical front door of the ecosystem — self-contained kiosks carrying the Fruitful mark into the field, each one a node in the wider network.',
    'portals.card1.tag': 'Portal · Sealed',
    'portals.card1.title': 'Street-ready kiosk',
    'portals.card1.desc': 'Compact teal-and-coral shell, illuminated signage, built for public spaces.',
    'portals.card1.alt': 'Fruitful portal kiosk, closed, teal shell with coral canopy and glowing logo sign',
    'portals.card2.tag': 'Portal · Open',
    'portals.card2.title': 'Service & access bay',
    'portals.card2.desc': 'Rear door swings wide for restocking, wiring, and on-site maintenance.',
    'portals.card2.alt': 'Fruitful portal kiosk opened, showing rear service door and interactive screen',
    'portals.card3.tag': 'Portal · Interface',
    'portals.card3.title': 'Onboard control panel',
    'portals.card3.desc': 'Wireless, wired, media, HDMI, Wi‑Fi and settings — the same menu, every portal.',
    'portals.card3.alt': 'Fruitful portal kiosk interior screen showing wireless, wired, media, HDMI, wifi and settings menu',

    'merge.label.syncing': 'Portals: syncing',
    'merge.label.target': 'Target: one Welcome page',
    'merge.eyebrow': 'Global data merge',
    'merge.title': 'Every portal, one arrival',
    'merge.desc': 'Instead of separate logins and separate front pages, every Fruitful gateway routes into a single "Welcome to Fruitful" experience.',
    'merge.step1.title': 'Collect',
    'merge.step1.desc': 'Each portal and micro-site reports its status into one shared feed.',
    'merge.step2.title': 'Reconcile',
    'merge.step2.desc': 'Duplicate or conflicting entries are merged before anything goes live.',
    'merge.step3.title': 'Publish',
    'merge.step3.desc': 'One consistent "Welcome to Fruitful" page renders everywhere, in sync.',

    'verify.eyebrow': 'Never redrawn, never approximated',
    'verify.title': 'Verified at the source',
    'verify.desc': "The mark this page is built around is Sam Fox™'s own hand — not an AI approximation of it. Everything below traces to one real, checkable file, the same discipline this whole ecosystem runs on.",
    'verify.markAlt': 'Sam Fox™ verified fox-head mark',
    'verify.markCap': "Verified asset · reverses to cream automatically on ink backgrounds, per the CI Guide's own rule — never recoloured by hand.",
    'verify.accentLabel': 'Click a colour below',
    'verify.check1.title': 'Fox-head icon',
    'verify.check1.desc': 'Byte-matched against <code>samfox-icon-verified-ink.png</code> &amp; <code>-cream.png</code> in this repo&rsquo;s own <code>docs/brand/assets/</code> — the same two files, unaltered.',
    'verify.check2.title': 'Palette',
    'verify.check2.desc': 'Nine verified hex values below, read straight from the Core CI Guide Master — nothing approximated, nothing swapped.',
    'verify.check3.title': 'Compliance',
    'verify.check3.desc': '™ only, never ®. The marks are never redrawn, retyped, or recoloured — her art stays her art.',
    'verify.paletteLabel': 'The nine verified Sam Fox™ colours',
    'verify.card1.title': 'Sam Fox™ Core CI Guide Master',
    'verify.card1.desc': 'The single, exclusive master of the brand identity this whole ecosystem runs on.',
    'verify.card2.title': 'Banimal™ Connector',
    'verify.card2.desc': 'The product this brand system now runs through — your store relays, the Worker decides.',

    'welcome.eyebrow': 'Preview',
    'welcome.title': 'The Welcome to {{LOGO:welcomeTitle}} page',
    'welcome.desc': 'A single arrival template every portal and property will share once the merge completes.',
    'mock.eyebrow': 'Welcome',
    'mock.title': 'Welcome to {{LOGO:mockTitle}}',
    'mock.desc': 'One entrance for every portal, brand, and page in the ecosystem — synced, current, and unmistakably Fruitful.',
    'mock.chip1': 'Street Portals',
    'mock.chip2': 'Retail Network',
    'mock.chip3': 'Digital Storefronts',
    'mock.chip4': 'Partner Sites',

    'cta.eyebrow': 'The Shock Launch',
    'cta.title': 'Bigger. Bolder. Unleashed.',
    'cta.desc': "Be first to see the flag go up. Leave your email and we'll signal the moment the Welcome to Fruitful merge goes live.",
    'cta.btn': 'Notify me',
    'cta.note.default': 'Launching soon. Stay wild.',
    'cta.note.success': "You're on the list. We'll signal the moment the flag goes up.",

    'footer.rights': '© 2026 Fruitful Shops (Pty) Ltd. All rights reserved.',
    'footer.tagline': 'Stay wild. The Shock Launch is coming.',
  },

  zh: {
    'nav.reveal': '揭幕时刻',
    'nav.portals': '网点',
    'nav.merge': '全球融合',
    'nav.verified': '已验证',
    'nav.welcome': '欢迎页',
    'a11y.brandHome': 'Fruitful 首页',
    'a11y.langToggle': '切换语言',
    'a11y.themeToDark': '切换至深色模式',
    'a11y.themeToLight': '切换至浅色模式',
    'header.cta': '获取通知',

    'hero.eyebrow': '即将上线 · 旗帜状态：待命中',
    'hero.title': '欢迎来到 {{LOGO:hero}}',
    'hero.lede': '标志性的时刻即将来临。Fruitful 各网点正在融合为一次全新登场——更宏大、更大胆、全面释放。',
    'hero.btn.activate': '激活旗帜',
    'hero.btn.seePortals': '查看网点',
    'hero.scrollCue': '保持野性',

    'flag.eyebrow': '揭幕时刻',
    'flag.title': '旗帜激活',
    'flag.desc': '这面旗帜所代表的意义十分明确：一旦升起，Fruitful 生态系统即正式上线——每一个网点、每一个页面，同一个信号。',
    'flag.pill.standing': '待命中',
    'flag.pill.active': '旗帜已激活——生态系统已上线',
    'flag.btn.raise': '升起旗帜',
    'flag.btn.lower': '降下旗帜',
    'flag.legacy': '这枚标志承载着数十年的历史——这幅旗帜插画在 Fruitful 体系中历经 30 多年打磨与传承，如今矗立于 Shock Launch 的最前沿。',
    'flag.caption': '旗帜升起 = 生态系统上线 · 旗帜降下 = 待命中',

    'portals.eyebrow': '现已上线',
    'portals.title': '{{LOGO:portalsTitle}} 网点',
    'portals.desc': '生态系统的实体门户——自成一体的智能站亭，将 Fruitful 标志带入现场，成为更广阔网络中的一个节点。',
    'portals.card1.tag': '网点 · 封闭状态',
    'portals.card1.title': '即用型街边站亭',
    'portals.card1.desc': '小巧的青绿与珊瑚色外壳，配备发光标识，专为公共空间打造。',
    'portals.card1.alt': 'Fruitful 网点站亭，关闭状态，青绿色外壳搭配珊瑚色顶棚与发光标志',
    'portals.card2.tag': '网点 · 开启状态',
    'portals.card2.title': '维护检修舱',
    'portals.card2.desc': '后舱门大开，方便补货、布线与现场维护。',
    'portals.card2.alt': 'Fruitful 网点站亭打开状态，展示后方维护舱门与交互屏幕',
    'portals.card3.tag': '网点 · 操作界面',
    'portals.card3.title': '内置控制面板',
    'portals.card3.desc': '无线、有线、媒体、HDMI、Wi-Fi 与设置——每个网点都是同一套菜单。',
    'portals.card3.alt': 'Fruitful 网点站亭内置屏幕，显示无线、有线、媒体、HDMI、Wi-Fi 与设置菜单',

    'merge.label.syncing': '网点：同步中',
    'merge.label.target': '目标：统一欢迎页',
    'merge.eyebrow': '全球数据融合',
    'merge.title': '所有网点，一次抵达',
    'merge.desc': '无需各自独立登录、各自独立首页——每一个 Fruitful 入口，都将汇聚成同一个「欢迎来到 Fruitful」体验。',
    'merge.step1.title': '汇集',
    'merge.step1.desc': '每个网点与微站点都会将自身状态汇入同一条共享数据流。',
    'merge.step2.title': '核对',
    'merge.step2.desc': '重复或冲突的条目会在上线前完成合并处理。',
    'merge.step3.title': '发布',
    'merge.step3.desc': '一个统一的「欢迎来到 Fruitful」页面将同步呈现于每一处。',

    'verify.eyebrow': '从未重绘，从未近似',
    'verify.title': '源头已验证',
    'verify.desc': '本页所围绕的标志出自 Sam Fox™ 本人之手——并非 AI 的近似仿制。以下内容均可追溯至同一份真实、可核查的文件，这也是整个生态系统所遵循的同一准则。',
    'verify.markAlt': 'Sam Fox™ 已验证狐头标志',
    'verify.markCap': '已验证素材 · 依照 CI 指南自身的规则，在墨黑色背景上会自动反转为奶白色——绝不手动改色。',
    'verify.accentLabel': '点击下方任意颜色',
    'verify.check1.title': '狐头图标',
    'verify.check1.desc': '已与本仓库 <code>docs/brand/assets/</code> 目录中的 <code>samfox-icon-verified-ink.png</code> 与 <code>-cream.png</code> 逐字节比对——完全相同的两份文件，未经任何改动。',
    'verify.check2.title': '色板',
    'verify.check2.desc': '下方九种色值均已验证，直接取自《核心 CI 指南母本》——毫无近似，毫无替换。',
    'verify.check3.title': '合规',
    'verify.check3.desc': '仅使用 ™，绝不使用 ®。标志绝不重绘、重制或改色——她的作品，始终是她的作品。',
    'verify.paletteLabel': '九种已验证的 Sam Fox™ 色彩',
    'verify.card1.title': 'Sam Fox™ 核心 CI 指南母本',
    'verify.card1.desc': '整个生态系统所依据的唯一、专属品牌形象母本。',
    'verify.card2.title': 'Banimal™ 连接器',
    'verify.card2.desc': '这套品牌体系如今所依托的产品——你的门店负责传递，Worker 负责决策。',

    'welcome.eyebrow': '预览',
    'welcome.title': '「欢迎来到 {{LOGO:welcomeTitle}}」页面',
    'welcome.desc': '融合完成后，每个网点与站点都将共用同一套到达页模板。',
    'mock.eyebrow': '欢迎',
    'mock.title': '欢迎来到 {{LOGO:mockTitle}}',
    'mock.desc': '生态系统中每一个网点、品牌与页面的统一入口——同步、实时，绝对 Fruitful 出品。',
    'mock.chip1': '街边网点',
    'mock.chip2': '零售网络',
    'mock.chip3': '数字门店',
    'mock.chip4': '合作站点',

    'cta.eyebrow': 'The Shock Launch',
    'cta.title': '更宏大。更大胆。全面释放。',
    'cta.desc': '抢先见证旗帜升起的一刻。留下你的邮箱，「欢迎来到 Fruitful」融合上线时，我们会第一时间通知你。',
    'cta.btn': '通知我',
    'cta.note.default': '即将上线。保持野性。',
    'cta.note.success': '你已加入名单。旗帜升起的那一刻，我们会立即通知你。',

    'footer.rights': '© 2026 Fruitful Shops (Pty) Ltd. 保留所有权利。',
    'footer.tagline': '保持野性。Shock Launch 即将到来。',
  },

  es: {
    'nav.reveal': 'La Revelación',
    'nav.portals': 'Portales',
    'nav.merge': 'Fusión Global',
    'nav.verified': 'Verificado',
    'nav.welcome': 'Página de Bienvenida',
    'a11y.brandHome': 'Inicio de Fruitful',
    'a11y.langToggle': 'Cambiar idioma',
    'a11y.themeToDark': 'Cambiar a modo oscuro',
    'a11y.themeToLight': 'Cambiar a modo claro',
    'header.cta': 'Recibir Aviso',

    'hero.eyebrow': 'Lanzamiento próximo · Estado de la bandera: en espera',
    'hero.title': 'Bienvenido a {{LOGO:hero}}',
    'hero.lede': 'Algo icónico está a punto de irrumpir. Los Portales Fruitful se están fusionando en una sola llegada: más grande, más audaz, desatada.',
    'hero.btn.activate': 'Activar la bandera',
    'hero.btn.seePortals': 'Ver los Portales',
    'hero.scrollCue': 'Mantente salvaje',

    'flag.eyebrow': 'La revelación',
    'flag.title': 'Activación de la bandera',
    'flag.desc': 'La bandera significa exactamente lo que dice. Cuando está izada, el ecosistema Fruitful está en vivo: cada portal, cada página, una sola señal.',
    'flag.pill.standing': 'En espera',
    'flag.pill.active': 'Bandera activada — ecosistema en vivo',
    'flag.btn.raise': 'Izar la bandera',
    'flag.btn.lower': 'Bajar la bandera',
    'flag.legacy': 'Esta marca lleva décadas de historia: una ilustración de bandera creada y perfeccionada durante más de 30 años dentro del entorno Fruitful, hoy al frente de Shock Launch.',
    'flag.caption': 'Bandera izada = ecosistema en vivo · bandera bajada = en espera',

    'portals.eyebrow': 'Ahora visible',
    'portals.title': 'Los Portales {{LOGO:portalsTitle}}',
    'portals.desc': 'La puerta física del ecosistema: quioscos autónomos que llevan la marca Fruitful al terreno, cada uno un nodo dentro de la red más amplia.',
    'portals.card1.tag': 'Portal · Cerrado',
    'portals.card1.title': 'Quiosco listo para la calle',
    'portals.card1.desc': 'Carcasa compacta en verde azulado y coral, señalización iluminada, diseñada para espacios públicos.',
    'portals.card1.alt': 'Quiosco portal Fruitful, cerrado, carcasa verde azulado con dosel coral y letrero de logotipo iluminado',
    'portals.card2.tag': 'Portal · Abierto',
    'portals.card2.title': 'Compartimento de servicio y acceso',
    'portals.card2.desc': 'La puerta trasera se abre por completo para reabastecimiento, cableado y mantenimiento en el sitio.',
    'portals.card2.alt': 'Quiosco portal Fruitful abierto, mostrando la puerta de servicio trasera y la pantalla interactiva',
    'portals.card3.tag': 'Portal · Interfaz',
    'portals.card3.title': 'Panel de control integrado',
    'portals.card3.desc': 'Inalámbrico, cableado, multimedia, HDMI, Wi-Fi y configuración: el mismo menú en cada portal.',
    'portals.card3.alt': 'Pantalla interior del quiosco portal Fruitful mostrando el menú de inalámbrico, cableado, multimedia, HDMI, wifi y configuración',

    'merge.label.syncing': 'Portales: sincronizando',
    'merge.label.target': 'Objetivo: una sola página de bienvenida',
    'merge.eyebrow': 'Fusión global de datos',
    'merge.title': 'Cada portal, una sola llegada',
    'merge.desc': 'En lugar de inicios de sesión y páginas de inicio separados, cada puerta de enlace Fruitful se dirige a una única experiencia "Bienvenido a Fruitful".',
    'merge.step1.title': 'Recopilar',
    'merge.step1.desc': 'Cada portal y micrositio reporta su estado en un único feed compartido.',
    'merge.step2.title': 'Conciliar',
    'merge.step2.desc': 'Las entradas duplicadas o en conflicto se combinan antes de que nada se publique.',
    'merge.step3.title': 'Publicar',
    'merge.step3.desc': 'Una única página "Bienvenido a Fruitful" se muestra en todas partes, sincronizada.',

    'verify.eyebrow': 'Nunca redibujado, nunca aproximado',
    'verify.title': 'Verificado en la fuente',
    'verify.desc': 'La marca en torno a la cual se construye esta página es obra de la propia mano de Sam Fox™, no una aproximación de IA. Todo lo que sigue remite a un único archivo real y verificable, la misma disciplina que rige todo este ecosistema.',
    'verify.markAlt': 'Marca de cabeza de zorro verificada de Sam Fox™',
    'verify.markCap': 'Recurso verificado · se invierte automáticamente a color crema sobre fondos tinta, según la propia norma de la Guía CI — nunca recoloreado a mano.',
    'verify.accentLabel': 'Haz clic en un color abajo',
    'verify.check1.title': 'Icono de cabeza de zorro',
    'verify.check1.desc': 'Coincide byte a byte con <code>samfox-icon-verified-ink.png</code> y <code>-cream.png</code> en el propio <code>docs/brand/assets/</code> de este repositorio: los mismos dos archivos, sin alteraciones.',
    'verify.check2.title': 'Paleta',
    'verify.check2.desc': 'Nueve valores hexadecimales verificados a continuación, tomados directamente de la Guía CI Master — nada aproximado, nada sustituido.',
    'verify.check3.title': 'Cumplimiento',
    'verify.check3.desc': 'Solo ™, nunca ®. Las marcas nunca se redibujan, retipografían ni recolorean: su arte sigue siendo su arte.',
    'verify.paletteLabel': 'Los nueve colores verificados de Sam Fox™',
    'verify.card1.title': 'Guía CI Master de Sam Fox™',
    'verify.card1.desc': 'El único y exclusivo maestro de la identidad de marca sobre el que corre todo este ecosistema.',
    'verify.card2.title': 'Conector Banimal™',
    'verify.card2.desc': 'El producto a través del cual ahora funciona este sistema de marca: tu tienda transmite, el Worker decide.',

    'welcome.eyebrow': 'Vista previa',
    'welcome.title': 'La página Bienvenido a {{LOGO:welcomeTitle}}',
    'welcome.desc': 'Una única plantilla de llegada que compartirán todos los portales y propiedades una vez completada la fusión.',
    'mock.eyebrow': 'Bienvenido',
    'mock.title': 'Bienvenido a {{LOGO:mockTitle}}',
    'mock.desc': 'Una sola entrada para cada portal, marca y página del ecosistema: sincronizada, actual e inconfundiblemente Fruitful.',
    'mock.chip1': 'Portales Callejeros',
    'mock.chip2': 'Red Minorista',
    'mock.chip3': 'Tiendas Digitales',
    'mock.chip4': 'Sitios Asociados',

    'cta.eyebrow': 'The Shock Launch',
    'cta.title': 'Más grande. Más audaz. Desatada.',
    'cta.desc': 'Sé el primero en ver la bandera izarse. Déjanos tu correo y te avisaremos en el instante en que la fusión Bienvenido a Fruitful se active.',
    'cta.btn': 'Avísame',
    'cta.note.default': 'Lanzamiento próximo. Mantente salvaje.',
    'cta.note.success': 'Ya estás en la lista. Te avisaremos en el momento en que la bandera se ice.',

    'footer.rights': '© 2026 Fruitful Shops (Pty) Ltd. Todos los derechos reservados.',
    'footer.tagline': 'Mantente salvaje. Shock Launch está por llegar.',
  },
};

// ===== Apply + persist =====
(function () {
  var LANGS = ['en', 'zh', 'es'];
  var LANG_HTML = { en: 'en', zh: 'zh-CN', es: 'es' };
  var LANG_BADGE = { en: 'EN', zh: '中', es: 'ES' };
  var STORAGE_KEY = 'fox-lang';
  var root = document.documentElement;
  var listeners = [];
  var lang = 'en';

  // Capture each logo <img>'s real markup once, from the static (English,
  // pre-translation) DOM, before anything overwrites it via innerHTML.
  // data-i18n-html strings reference it as a {{LOGO:slot}} token instead of
  // repeating the <img> (and its src — a base64 data URI in the standalone
  // artifact build) three times over, once per language.
  var LOGO = {};
  document.querySelectorAll('[data-logo-slot]').forEach(function (el) {
    LOGO[el.getAttribute('data-logo-slot')] = el.outerHTML;
  });
  function fillLogos(html) {
    return html.replace(/\{\{LOGO:([a-zA-Z0-9_]+)\}\}/g, function (_, key) {
      return LOGO[key] || '';
    });
  }

  function readStored() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    return 'en';
  }

  function dict() {
    return TRANSLATIONS[lang] || TRANSLATIONS.en;
  }

  function apply() {
    var d = dict();
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (d[key] != null) el.textContent = d[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (d[key] != null) el.innerHTML = fillLogos(d[key]);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      if (d[key] != null) el.setAttribute('alt', d[key]);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (d[key] != null) el.setAttribute('aria-label', d[key]);
    });

    root.setAttribute('lang', LANG_HTML[lang] || 'en');
    root.setAttribute('data-lang', lang);

    var badge = document.getElementById('langBadge');
    if (badge) badge.textContent = LANG_BADGE[lang];
    var langBtn = document.querySelector('[data-lang-toggle]');
    if (langBtn) langBtn.setAttribute('aria-label', d['a11y.langToggle']);

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    listeners.forEach(function (fn) {
      fn(lang);
    });
  }

  window.foxI18n = {
    t: function (key) {
      var d = dict();
      return d[key] != null ? d[key] : key;
    },
    getLang: function () {
      return lang;
    },
    setLang: function (next) {
      if (LANGS.indexOf(next) === -1 || next === lang) return;
      lang = next;
      apply();
    },
    cycle: function () {
      var idx = LANGS.indexOf(lang);
      lang = LANGS[(idx + 1) % LANGS.length];
      apply();
    },
    onChange: function (fn) {
      listeners.push(fn);
    },
  };

  lang = readStored();
  apply();

  var langToggle = document.querySelector('[data-lang-toggle]');
  langToggle &&
    langToggle.addEventListener('click', function () {
      window.foxI18n.cycle();
    });
})();
