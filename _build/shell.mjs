import { BASE, CHECKED, FB, PEOPLE, DIMS, V, SRC } from './data.mjs';
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// deterministic grass silhouette
export function grass({ w = 1440, h = 160, n = 140, seed = 3, min = .35, max = 1 } = {}) {
  let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  let d = `M0 ${h}`;
  for (let i = 0; i < n; i++) {
    const x = (i + r() * .8) * (w / n), bw = 2.5 + r() * 5, bh = h * (min + r() * (max - min)), lean = (r() - .5) * bh * .55;
    d += `M${(x - bw / 2).toFixed(1)} ${h}Q${(x - bw * .2 + lean * .4).toFixed(1)} ${(h - bh * .55).toFixed(1)} ${(x + lean).toFixed(1)} ${(h - bh).toFixed(1)}Q${(x + bw * .25 + lean * .45).toFixed(1)} ${(h - bh * .5).toFixed(1)} ${(x + bw / 2).toFixed(1)} ${h}Z`;
  }
  return d;
}
export const grassSvg = (cls = '', o = {}) => { const w = o.w || 1440, h = o.h || 160; return `<svg class="grass ${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><path d="${grass(o)}"/></svg>`; };

const tuft = (x, flip = 1) => { let p = ''; [[0, 34, -6], [6, 46, 2], [12, 30, 10], [-6, 26, -12], [16, 22, 16]].forEach(([dx, hh, lean]) => { const bx = x + dx * flip; p += `M${bx - 2} 172Q${bx + lean * flip * .3} ${172 - hh * .6} ${bx + lean * flip} ${172 - hh}Q${bx + lean * flip * .4 + 1} ${172 - hh * .5} ${bx + 2} 172Z`; }); return p; };
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<symbol id="i-dog" viewBox="0 0 200 180"><path fill="currentColor" d="${V.dog}"/></symbol>
<symbol id="i-quail" viewBox="0 0 185 210"><path fill="currentColor" d="${V.quail}"/></symbol>
<symbol id="i-engr" viewBox="0 0 430 274"><path fill="currentColor" d="${V.engr}"/></symbol>
<symbol id="i-fly-up" viewBox="0 0 120 82"><g fill="currentColor"><path d="${V.wfar}" opacity=".55"/><path d="${V.tail}"/><path d="${V.body}"/></g><path d="M86.5 30.5 C 91 28.5, 97 29, 101.5 33" fill="none" stroke="var(--stripe,#EEDFC4)" stroke-width="1.8" stroke-linecap="round"/><path d="M93 42.5 C 97 44, 100 43.5, 102 42" fill="none" stroke="var(--stripe,#EEDFC4)" stroke-width="1.6" stroke-linecap="round"/><path fill="currentColor" d="${V.wup}"/></symbol>
<symbol id="i-fly-dn" viewBox="0 0 120 82"><g fill="currentColor"><path d="${V.tail}"/><path d="${V.body}"/></g><path d="M86.5 30.5 C 91 28.5, 97 29, 101.5 33" fill="none" stroke="var(--stripe,#EEDFC4)" stroke-width="1.8" stroke-linecap="round"/><path d="M93 42.5 C 97 44, 100 43.5, 102 42" fill="none" stroke="var(--stripe,#EEDFC4)" stroke-width="1.6" stroke-linecap="round"/><path fill="currentColor" d="${V.wdn}"/></symbol>
<symbol id="badge" viewBox="0 0 400 400">
 <circle cx="200" cy="200" r="198" fill="#2A1F16"/><circle cx="200" cy="200" r="191" fill="#EEDFC4"/><circle cx="200" cy="200" r="178" fill="none" stroke="#2A1F16" stroke-width="2.5"/>
 <g fill="#2A1F16"><path d="${tuft(96)}${tuft(304, -1)}"/></g>
 <g transform="translate(104 44) scale(.45)" fill="#2A1F16"><path d="${V.engr}"/></g>
 <line x1="74" y1="173" x2="326" y2="173" stroke="#2A1F16" stroke-width="3"/>
 <text x="200" y="262" text-anchor="middle" font-family="'Zilla Slab',Georgia,serif" font-weight="700" font-size="92" fill="#2A1F16" letter-spacing="-2">B&amp;T</text>
 <line x1="60" y1="226" x2="100" y2="226" stroke="#2A1F16" stroke-width="3"/><line x1="300" y1="226" x2="340" y2="226" stroke="#2A1F16" stroke-width="3"/>
 <text x="200" y="301" text-anchor="middle" font-family="'Zilla Slab',Georgia,serif" font-weight="600" font-size="38" fill="#2A1F16" letter-spacing="3">QUAIL FARM</text>
 <line x1="96" y1="317" x2="304" y2="317" stroke="#2A1F16" stroke-width="2"/>
 <text x="200" y="349" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-weight="600" font-size="22" fill="#2A1F16" letter-spacing="4">· EST 2026 ·</text>
</symbol>
<symbol id="i-arr" viewBox="0 0 24 24"><path d="M3 12h17M14 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6"/></symbol>
<symbol id="i-ext" viewBox="0 0 24 24"><path d="M7 17L17 7M8.5 7H17v8.5" fill="none" stroke="currentColor" stroke-width="1.6"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path d="M6.6 3.5l2.6.3 1.2 4-2 1.6a12 12 0 006.2 6.2l1.6-2 4 1.2.3 2.6c0 1-.9 2-2 2C10.8 19.4 4.6 13.2 4.6 5.5c0-1.1 1-2 2-2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></symbol>
<symbol id="i-sms" viewBox="0 0 24 24"><path d="M4 5.5h16v11H9.5L5 20v-3.5H4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 11h.01M12 11h.01M16 11h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.6"/></symbol>
<symbol id="i-minus" viewBox="0 0 24 24"><path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="1.6"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.6"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
<symbol id="i-copy" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M16 8V5.5A1.5 1.5 0 0014.5 4h-9A1.5 1.5 0 004 5.5v9A1.5 1.5 0 005.5 16H8" fill="none" stroke="currentColor" stroke-width="1.6"/></symbol>
<symbol id="i-feather" viewBox="0 0 64 20"><path d="M2 14C14 4 40 0 62 6 46 8 30 12 14 14 22 16 30 17 40 16 28 20 12 20 2 14z" fill="currentColor"/><path d="M4 14C22 10 42 7 60 6" stroke="var(--paper,#EFE4CF)" stroke-width=".8" fill="none"/></symbol>
</defs></svg>`;

export const use = (id, cls = '', vb = '') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#${id}"/></svg>`;
export const arr = use('i-arr', 'i i-arr');
export const img = (root, n, alt = '', cls = '', { eager = false, sizes = '100vw', srcset = '' } = {}) => {
  const [w, h] = DIMS[n] || [800, 800];
  return `<img src="${root}assets/img/${n}.webp"${srcset ? ` srcset="${srcset}" sizes="${sizes}"` : ''} alt="${esc(alt)}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${cls ? ` class="${cls}"` : ''}>`;
};
export const btn = (href, label, cls = '', attrs = '', icon = arr) => `<a class="btn ${cls}" href="${href}" data-magnetic ${attrs}><span class="btn-t" data-roll>${label}</span><span class="btn-o" aria-hidden="true">${icon}</span></a>`;
export const eb = (t, cls = '') => `<p class="eb ${cls}">${t}</p>`;
export const src = (k, label) => `<a class="src" href="${SRC[k][1]}" target="_blank" rel="noopener">${label || SRC[k][0]}${use('i-ext', 'i')}</a>`;
export const smsHref = (p, body = '') => `sms:${p.e164}${body ? `?&body=${encodeURIComponent(body)}` : ''}`;
export const telHref = p => `tel:${p.e164}`;

const NAV = [['Birds', 'birds/'], ['Process', 'process/'], ['Gallery', 'gallery/'], ['About', 'about/']];
const FONTS = 'https://fonts.googleapis.com/css2?family=Zilla+Slab:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600&display=swap';

export function head({ root, title, desc, path = '' }) {
  const url = BASE + path;
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#EFE4CF">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:image" content="${BASE}assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="format-detection" content="telephone=no">
<link rel="canonical" href="${url}">
<link rel="icon" href="${root}assets/img/favicon.png" type="image/png"><link rel="apple-touch-icon" href="${root}assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${root}assets/css/site.css?v=20261109b">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"B & T Quail Farm","description":"Flight ready quail for dog training or population purposes.","telephone":"+1-765-246-1964","areaServed":"Putnam County, Indiana","address":{"@type":"PostalAddress","addressRegion":"IN","addressCountry":"US"},"sameAs":["${FB}"]}</script>
<script>(function(d,w){var h=d.documentElement;h.className=h.className.replace('no-js','js');var rm=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!rm){h.classList.add('motion');try{if(sessionStorage.getItem('bt-pt')==='1')h.classList.add('pt-in')}catch(e){}}else{h.classList.add('no-motion')}setTimeout(function(){if(!w.__btReady){h.classList.remove('motion','pt-in');h.classList.add('no-motion')}},4500)})(document,window)</script>
</head>`;
}

const personRow = (p, cls = '') => `<div class="pp ${cls}"><span class="pp-n">${p.name}</span><a class="pp-ph" href="${telHref(p)}">${p.phone}</a><span class="pp-a"><a class="chip-b" href="${telHref(p)}" aria-label="Call ${p.name}">${use('i-phone', 'i')}<span>Call</span></a><a class="chip-b" href="${smsHref(p)}" aria-label="Text ${p.name}">${use('i-sms', 'i')}<span>Text</span></a></span></div>`;
export { personRow };

export function chrome(root, path) {
  const cur = p => (path.startsWith(p) ? ' aria-current="page"' : '');
  const blades = Array.from({ length: 22 }, (_, i) => `<i style="--i:${i}"></i>`).join('');
  return `${SPRITE}
<div class="sweep" aria-hidden="true"><div class="sweep-b">${blades}</div><svg class="sweep-badge"><use href="#badge"/></svg></div>
<a class="skip" href="#main">Skip to content</a>
<header class="bar" data-bar>
  <a class="bar-home" href="${root}" aria-label="B &amp; T Quail Farm, home"><svg class="bar-badge" aria-hidden="true"><use href="#badge"/></svg><span class="bar-name"><b>B&amp;T</b> Quail Farm</span></a>
  <nav class="bar-nav" aria-label="Primary">${NAV.map(([t, h]) => `<a href="${root}${h}"${cur(h)} data-navlink><span data-roll>${t}</span></a>`).join('')}<span class="bar-runner" aria-hidden="true">${use('i-quail', 'i')}</span></nav>
  <div class="bar-act">
    <button class="bar-call" type="button" aria-expanded="false" aria-controls="callpop" data-callbtn>${use('i-phone', 'i')}<span>Call or text</span></button>
    <a class="btn btn-ink btn-sm bar-cta" href="${root}contact/" data-magnetic${cur('contact/')}><span class="btn-t" data-roll>Bird inquiry</span><span class="btn-o" aria-hidden="true">${arr}</span></a>
    <button class="bar-menu" type="button" aria-expanded="false" aria-controls="menu" data-menubtn><span class="bar-menu-t">Menu</span><span class="bar-menu-l" aria-hidden="true"><i></i><i></i></span></button>
  </div>
</header>
<div class="callpop" id="callpop" role="dialog" aria-label="Call or text the farm" hidden>
  <p class="eb">Call or text for more details</p>
  ${PEOPLE.map(p => personRow(p)).join('')}
  <p class="callpop-note">Putnam County, Indiana · no storefront hours are posted, so a text is the easy way in.</p>
</div>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <div class="menu-in">
    <nav class="menu-nav" aria-label="Menu">${[['Home', ''], ...NAV, ['Contact', 'contact/']].map(([t, h], i) => `<a href="${root}${h}"${h && cur(h) || (!h && path === '' ? ' aria-current="page"' : '')}><span class="menu-i">${String(i + 1).padStart(2, '0')}</span><span class="menu-t">${t}</span></a>`).join('')}</nav>
    <div class="menu-ppl">${PEOPLE.map(p => personRow(p, 'pp-lg')).join('')}</div>
  </div>
  ${grassSvg('menu-grass', { w: 800, h: 120, n: 90, seed: 11 })}
</div>`;
}

export function footer(root) {
  return `<footer class="ft">
  ${grassSvg('ft-grass', { w: 1440, h: 120, n: 170, seed: 5, min: .25 })}
  <div class="ft-in">
    <div class="ft-top">
      <a class="ft-badge" href="${root}" aria-label="Home"><svg aria-hidden="true"><use href="#badge"/></svg></a>
      <p class="ft-say" data-split>Flight ready.<br><em>Field proven.</em></p>
    </div>
    <div class="ft-cols">
      <div><p class="eb">Call or text</p>${PEOPLE.map(p => `<p class="ft-p"><span>${p.name}</span> <a href="${telHref(p)}">${p.phone}</a> · <a href="${smsHref(p)}">Text</a></p>`).join('')}</div>
      <div><p class="eb">Where</p><p>Putnam County, Indiana</p><p class="ft-dim">No street address is published</p></div>
      <div><p class="eb">Pages</p><nav class="ft-nav" aria-label="Footer">${[...NAV, ['Contact', 'contact/']].map(([t, h]) => `<a href="${root}${h}">${t}</a>`).join('')}</nav></div>
      <div><p class="eb">Follow</p><p><a href="${FB}" target="_blank" rel="noopener">Facebook${use('i-ext', 'i')}</a></p><p class="ft-dim">56K followers</p></div>
    </div>
    <div class="ft-base"><span>Concept site · details checked ${CHECKED}</span><span>Photos &amp; artwork from the B &amp; T Quail Farm Facebook page</span><span>Messages open in your own phone app. This site sends nothing.</span></div>
  </div>
</footer>`;
}

export function page({ root, path, title, desc, id, body }) {
  return `${head({ root, title, desc, path })}
<body data-page="${id}">
${chrome(root, path)}
<main id="main">
${body}
</main>
${footer(root)}
<div class="cursor" aria-hidden="true"><span class="cursor-l"></span></div>
<script src="${root}assets/vendor/gsap.min.js" defer></script>
<script src="${root}assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="${root}assets/vendor/SplitText.min.js" defer></script>
<script src="${root}assets/vendor/MotionPathPlugin.min.js" defer></script>
<script src="${root}assets/vendor/DrawSVGPlugin.min.js" defer></script>
<script src="${root}assets/vendor/lenis.min.js" defer></script>
<script src="${root}assets/js/site.js?v=20261109b" defer></script>
</body>
</html>
`;
}
