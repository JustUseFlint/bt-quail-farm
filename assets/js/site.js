/* B & T Quail Farm — interactions */
(() => {
  const d = document, w = window, H = d.documentElement;
  const $ = (s, r = d) => r.querySelector(s), $$ = (s, r = d) => [...r.querySelectorAll(s)];
  const RM = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = w.gsap, ST = w.ScrollTrigger;
  const motion = !RM && !!G && H.classList.contains('motion');
  const fine = w.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const touch = !fine || w.matchMedia('(hover: none), (pointer: coarse)').matches;
  const desk = () => w.innerWidth >= 900;
  const big = () => desk() && !touch;   // pinned / scrubbed scenes only for desktop mouse users
  w.__btReady = true;
  if (!G) { H.classList.remove('motion', 'pt-in'); H.classList.add('no-motion'); }
  if (G) G.registerPlugin(...[ST, w.SplitText, w.MotionPathPlugin, w.DrawSVGPlugin].filter(Boolean));
  if (ST) ST.config({ ignoreMobileResize: true });
  if (touch) H.classList.add('is-touch');

  /* ---------- roll text ---------- */
  $$('[data-roll]').forEach(el => { if (el.dataset.rolled) return; const t = el.innerHTML; el.dataset.rolled = 1; el.innerHTML = `<span class="rl rl-1">${t}</span><span class="rl rl-2" aria-hidden="true">${t}</span>`; });

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (motion && w.Lenis && !touch) {
    lenis = new w.Lenis({ lerp: .11, smoothWheel: true });
    lenis.on('scroll', ST.update);
    G.ticker.add(t => lenis.raf(t * 1000)); G.ticker.lagSmoothing(0);
  }
  const lock = on => { if (lenis) on ? lenis.stop() : lenis.start(); d.body.style.overflow = on ? 'hidden' : ''; };

  /* ---------- header ---------- */
  const bar = $('[data-bar]'); let lastY = 0;
  const onScroll = () => {
    const y = w.scrollY;
    bar.classList.toggle('is-solid', y > 20);
    if (!H.classList.contains('is-menu')) bar.classList.toggle('is-hid', y > 400 && y > lastY + 2 && !$('#callpop:not([hidden])'));
    if (y < lastY - 2) bar.classList.remove('is-hid');
    lastY = y;
  };
  w.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // quail runner under nav
  const nav = $('.bar-nav'), runner = $('.bar-runner');
  if (nav && runner) {
    const links = $$('[data-navlink]', nav), cur = links.find(a => a.hasAttribute('aria-current'));
    const go = a => { if (!a) { runner.classList.remove('on'); return; } const r = a.getBoundingClientRect(), n = nav.getBoundingClientRect(); runner.style.transform = `translateX(${r.left - n.left + r.width / 2 - 11}px)`; runner.classList.add('on'); };
    requestAnimationFrame(() => { runner.style.transition = 'none'; go(cur); runner.offsetWidth; runner.style.transition = ''; });
    links.forEach(a => a.addEventListener('mouseenter', () => go(a)));
    nav.addEventListener('mouseleave', () => go(cur));
  }

  /* ---------- call popover ---------- */
  const pop = $('#callpop'), callBtns = $$('[data-callbtn]');
  const setPop = open => { pop.hidden = !open; callBtns.forEach(b => b.setAttribute('aria-expanded', open)); if (open) { bar.classList.remove('is-hid'); if (motion) G.fromTo(pop, { opacity: 0, y: -10, scale: .97 }, { opacity: 1, y: 0, scale: 1, duration: .45, ease: 'expo.out' }); $('a', pop).focus({ preventScroll: true }); } };
  callBtns.forEach(b => b.addEventListener('click', e => { e.stopPropagation(); setPop(pop.hidden); }));
  d.addEventListener('click', e => { if (!pop.hidden && !pop.contains(e.target)) setPop(false); });

  /* ---------- menu ---------- */
  const menu = $('#menu'), mbtn = $('[data-menubtn]');
  const setMenu = open => {
    mbtn.setAttribute('aria-expanded', open); H.classList.toggle('is-menu', open); lock(open);
    if (open) { menu.hidden = false; setPop(false); if (motion) { G.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .8, ease: 'expo.inOut' }); G.fromTo($$('.menu-t', menu), { yPercent: 110 }, { yPercent: 0, duration: .9, ease: 'expo.out', stagger: .05, delay: .25 }); G.fromTo('.menu-grass', { yPercent: 100 }, { yPercent: 0, duration: 1, ease: 'expo.out', delay: .3 }); } }
    else if (motion) G.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: .6, ease: 'expo.inOut', onComplete: () => { menu.hidden = true; } });
    else menu.hidden = true;
  };
  mbtn && mbtn.addEventListener('click', () => setMenu(menu.hidden));
  d.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!menu.hidden) { setMenu(false); mbtn.focus(); } if (!pop.hidden) setPop(false); } });

  /* ---------- page transitions ----------
     Browsers with cross-document View Transitions get them from CSS (@view-transition).
     Everyone else: the page content fades and lifts out (260ms), then the next page fades up (CSS, .pt-in). */
  const nativeVT = 'onpagereveal' in w && !!(w.CSS && CSS.supports && CSS.supports('view-transition-name: a'));
  let leaving = false;
  const internal = a => a.origin === location.origin && !a.hasAttribute('download') && a.target !== '_blank' && !/^(tel|sms|mailto):/.test(a.protocol) && !(a.pathname === location.pathname && a.hash);
  if (motion && !nativeVT) d.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    if (!internal(a)) return;
    e.preventDefault(); const href = a.href; if (leaving) return; leaving = true;
    try { sessionStorage.setItem('bt-pt', '1'); } catch (x) {}
    H.classList.add('is-leaving');
    setTimeout(() => { location.href = href; }, 260);
  });
  try { sessionStorage.removeItem('bt-pt'); } catch (x) {}
  setTimeout(() => H.classList.remove('pt-in'), 900);
  w.addEventListener('pageshow', e => { if (e.persisted) { leaving = false; H.classList.remove('is-leaving', 'pt-in'); if (menu && !menu.hidden) { menu.hidden = true; H.classList.remove('is-menu'); mbtn.setAttribute('aria-expanded', false); lock(false); } if (pop && !pop.hidden) setPop(false); } });

  /* ---------- text splitting ---------- */
  const splitLines = el => {
    if (!w.SplitText) return null;
    const s = new w.SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'ln' }); el.classList.add('is-split'); return s;
  };
  // every entrance tween is registered here so it can be forced visible if its trigger never fires
  const pending = [];
  const track = (el, tw) => { pending.push([el, tw]); return tw; };
  const sweepPending = () => {
    for (let i = pending.length - 1; i >= 0; i--) {
      const [el, tw] = pending[i];
      if (tw.progress() === 1) { pending.splice(i, 1); continue; }
      const r = el.getBoundingClientRect();
      if (r.bottom < 0) { tw.progress(1); pending.splice(i, 1); }                 // scrolled past without firing
      else if (r.top < w.innerHeight * .98 && !tw.isActive() && tw.progress() === 0) tw.play();
    }
  };
  const reveals = () => {
  if (motion) {
    $$('[data-split]').forEach(el => {
      const s = splitLines(el); if (!s) { el.classList.add('is-split'); return; }
      track(el, G.from(s.lines, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: .09, scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
    });
    $$('[data-chars]').forEach(el => {
      if (!w.SplitText) { el.classList.add('is-split'); return; }
      const s = new w.SplitText(el, { type: 'words,chars', mask: 'words', wordsClass: 'wd' }); el.classList.add('is-split');
      track(el, G.from(s.chars, { yPercent: 110, rotate: touch ? 0 : 6, duration: 1.1, ease: 'expo.out', stagger: touch ? .015 : .022, delay: el.closest('.ph') ? .25 : 0, scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
    });
    $$('[data-reveal]').forEach(el => track(el, G.to(el, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } })));
    $$('[data-wipe]').forEach(el => {
      // only scale an image whose parent clips it, so the scaled image can never widen the page
      const im = $('img', el), clips = im && getComputedStyle(im.parentElement).overflow !== 'visible' && im.parentElement !== el;
      const tl = G.timeline({ scrollTrigger: { trigger: el, start: 'top 94%', once: true }, onComplete: () => { el.style.clipPath = 'none'; } });
      tl.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'expo.inOut' }, 0);
      if (clips) tl.fromTo(im, { scale: 1.2 }, { scale: 1, duration: 1.5, ease: 'expo.out', immediateRender: false }, 0);
      track(el, tl);
    });
    // scroll-filled words (opacity only: compositor-friendly)
    $$('[data-fill]').forEach(el => {
      if (!w.SplitText) return;
      const s = new w.SplitText(el, { type: 'words', wordsClass: 'w' });
      if (touch) { G.set(s.words, { opacity: .2 }); track(el, G.to(s.words, { opacity: 1, duration: .5, stagger: .035, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', once: true } })); }
      else G.fromTo(s.words, { opacity: .2 }, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    });
  }
  H.classList.add('rv-ready');
  ST && ST.refresh();
  if (motion) { sweepPending(); w.addEventListener('scroll', () => { clearTimeout(w.__sp); w.__sp = setTimeout(sweepPending, 140); }, { passive: true }); setInterval(sweepPending, 1500); }
  };
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(reveals); else reveals();

  /* ---------- magnetic ---------- */
  if (fine && motion) $$('[data-magnetic]').forEach(el => {
    const xT = G.quickTo(el, 'x', { duration: .6, ease: 'power3.out' }), yT = G.quickTo(el, 'y', { duration: .6, ease: 'power3.out' });
    const k = el.classList.contains('bigbtn') ? .35 : .22;
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); xT((e.clientX - r.left - r.width / 2) * k); yT((e.clientY - r.top - r.height / 2) * k); });
    el.addEventListener('pointerleave', () => { xT(0); yT(0); });
  });

  /* ---------- cursor ---------- */
  const cur = $('.cursor');
  if (fine && cur && G) {
    const cx = G.quickTo(cur, 'x', { duration: .35, ease: 'power3.out' }), cy = G.quickTo(cur, 'y', { duration: .35, ease: 'power3.out' }), lab = $('.cursor-l', cur);
    let seen = false;
    w.addEventListener('pointermove', e => {
      if (!seen) { seen = true; G.set(cur, { x: e.clientX, y: e.clientY }); G.to(cur, { opacity: 1, duration: .3 }); }
      cx(e.clientX); cy(e.clientY);
      const t = e.target.closest ? e.target : null; if (!t) return;
      const L = t.closest('[data-cursor]'), A = t.closest('a,button,label,input,select,textarea,summary');
      cur.classList.toggle('is-l', !!L); lab.textContent = L ? L.dataset.cursor : '';
      cur.classList.toggle('is-a', !L && !!A);
      cur.classList.toggle('is-dark', !!t.closest('.hatch,.ft,.calc-in,.band,.lb'));
    }, { passive: true });
    d.addEventListener('pointerleave', () => G.to(cur, { opacity: 0, duration: .2 })); d.addEventListener('pointerenter', () => G.to(cur, { opacity: 1, duration: .2 }));
  }

  /* ---------- grass sway ---------- */
  if (motion && !touch) $$('.grass').forEach(g => {
    G.to(g, { skewX: 2.5, duration: 3 + Math.random() * 2, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 100%' });
  });
  if (motion && fine) { const hg = $('.hero-grass'); if (hg) { const sx = G.quickTo(hg, 'x', { duration: 1.2, ease: 'power3.out' }); w.addEventListener('pointermove', e => sx((e.clientX / w.innerWidth - .5) * -24), { passive: true }); } }

  /* ---------- HOME hero ---------- */
  const hero = $('[data-hero]');
  if (hero) {
    const win = $('[data-hero-win]', hero), seal = $('[data-seal]', hero), img = $('.hero-img img', hero);
    if (motion) {
      const tl = G.timeline({ delay: .15 });
      tl.to(win, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.5, ease: 'expo.inOut' }, 0)
        .from(img, { scale: 1.35, duration: 2.2, ease: 'expo.out' }, .1)
        .to('[data-hero-k]', { opacity: 1, duration: .8 }, .5)
        .to('.hero-h .hl>span', { y: 0, yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: .12 }, .55)
        .to('[data-hero-sub]', { opacity: 1, duration: 1, stagger: .1 }, 1)
        .fromTo(seal, { opacity: 0, scale: .4, rotate: -120 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: 'back.out(1.4)' }, .9)
        .from('.hero-grass', { yPercent: 60, duration: 1.6, ease: 'expo.out' }, .6)
        .from('[data-band] .band-i', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1 }, 1);
      tl.eventCallback('onComplete', () => { win.style.clipPath = 'none'; });
      setTimeout(() => { if (tl.progress() < 1) tl.progress(1); }, 5000);
      // scroll: arch flattens, image drifts, seal turns
      G.matchMedia().add('(min-width: 900px) and (hover: hover)', () => {
        const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
        G.to(img, { yPercent: 8, ease: 'none', scrollTrigger: st });
        G.to('.seal-ring', { rotate: 220, ease: 'none', scrollTrigger: { ...st } });
        G.to('.hero-copy', { y: -60, opacity: .25, ease: 'none', scrollTrigger: { ...st } });
      });
    }
  }

  /* ---------- HOME flush: flight path ---------- */
  const flush = $('[data-flush]');
  if (flush) {
    const bird = $('[data-bird]', flush), wps = $$('[data-wp]', flush);
    let ctx = null;
    const build = () => {
      ctx && ctx.revert();
      ctx = G ? G.context(() => {
        const svg = big() ? $('.flush-d', flush) : $('.flush-m', flush), path = $('.flush-path', svg), trail = $('.flush-reveal', svg);
        const len = path.getTotalLength(), M = svg.getScreenCTM(), sr = $('.flush-stage', flush).getBoundingClientRect();
        const pt = t => { const p = path.getPointAtLength(len * t); const q = new DOMPoint(p.x, p.y).matrixTransform(M); return [q.x - sr.left, q.y - sr.top]; };
        wps.forEach(el => { const [x, y] = pt(+el.dataset.wp); el.style.left = x + 'px'; el.style.top = y + 'px'; });
        if (!motion) { const [x, y] = pt(.62); G.set(bird, { x: x - bird.offsetWidth / 2, y: y - bird.offsetHeight / 2, rotate: -18 }); return; }
        G.set(wps, { opacity: 0, scale: .8 });
        const tl = G.timeline({ scrollTrigger: big() ? { trigger: flush, start: 'top top', end: '+=150%', scrub: .6, pin: $('.flush-pin', flush) } : { trigger: $('.flush-stage', flush), start: 'top 85%', end: 'bottom 55%', scrub: true } });
        tl.fromTo(trail, { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', duration: 1 }, 0)
          .to(bird, { motionPath: { path, align: path, alignOrigin: [.5, .5], autoRotate: true }, ease: 'none', duration: 1 }, 0);
        wps.forEach(el => tl.to(el, { opacity: 1, scale: 1, duration: .08, ease: 'back.out(2)' }, +el.dataset.wp - .04));
        let last = 0, f = false;
        tl.eventCallback('onUpdate', () => { const p = tl.progress(); if (Math.abs(p - last) > .012) { f = !f; bird.classList.toggle('flap', f); last = p; } });
      }) : null;
    };
    const ready = () => { build(); ST && ST.refresh(); };
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(ready); else ready();
    let rw = w.innerWidth; w.addEventListener('resize', () => { if (Math.abs(w.innerWidth - rw) > 40) { rw = w.innerWidth; build(); } });
  }

  /* ---------- HOME hatch counter (4,300 eggs) ---------- */
  const hatch = $('[data-hatch]');
  if (hatch) {
    const cv = $('[data-eggs]', hatch), cnt = $('[data-count]', hatch), N = 4300, T = 43;
    let tc, tr, ctx2, cw, ch, tw, gap, dpr, order, pos, shown = 0;
    const setup = () => {
      tc = cv.clientWidth >= 520 ? 9 : 6; tr = Math.ceil(T / tc); dpr = Math.min(w.devicePixelRatio || 1, 2);
      cw = cv.clientWidth; gap = Math.max(4, cw * .012); tw = (cw - gap * (tc - 1)) / tc; ch = tr * tw + (tr - 1) * gap;
      cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr); cv.style.height = ch + 'px'; ctx2 = cv.getContext('2d'); ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
      let s = 42; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
      const key = new Float32Array(N); for (let i = 0; i < N; i++) key[i] = ((i / 100) | 0) + r() * 1.6;
      order = Array.from({ length: N }, (_, i) => i).sort((a, b) => key[a] - key[b]);
      pos = i => { const t = (i / 100) | 0, k = i % 100, c = tw / 10; return [(t % tc) * (tw + gap) + (k % 10) * c + c / 2, ((t / tc) | 0) * (tw + gap) + ((k / 10) | 0) * c + c / 2, c]; };
      base(); shown = 0; fill(motion ? 0 : N);
    };
    const egg = (i, col) => { const [x, y, c] = pos(i); ctx2.beginPath(); ctx2.ellipse(x, y, c * .3, c * .38, 0, 0, Math.PI * 2); ctx2.fillStyle = col; ctx2.fill(); };
    const base = () => {
      ctx2.clearRect(0, 0, cw, ch);
      for (let t = 0; t < T; t++) { const tx = (t % tc) * (tw + gap), ty = ((t / tc) | 0) * (tw + gap); ctx2.strokeStyle = 'rgba(243,233,213,.16)'; ctx2.lineWidth = 1; ctx2.beginPath(); ctx2.roundRect ? ctx2.roundRect(tx + .5, ty + .5, tw - 1, tw - 1, 4) : ctx2.rect(tx + .5, ty + .5, tw - 1, tw - 1); ctx2.stroke(); }
      for (let i = 0; i < N; i++) egg(i, 'rgba(243,233,213,.1)');
    };
    // draw only the eggs that changed since the last frame
    const fill = n => {
      n = Math.round(n);
      if (n < shown) { base(); shown = 0; }
      for (let j = shown; j < n; j++) { const i = order[j]; egg(i, i % 9 === 0 ? '#C9A57A' : '#E9DCC2'); }
      shown = n; cnt.textContent = n.toLocaleString('en-US');
    };
    const go = () => {
      setup(); if (!motion) return;
      if (big()) ST.create({ trigger: hatch, start: 'top 70%', end: 'bottom 85%', scrub: .5, onUpdate: s => fill(s.progress * N) });
      else { const o = { n: 0 }; const tw2 = G.to(o, { n: N, duration: 2.4, ease: 'power2.inOut', paused: true, onUpdate: () => fill(o.n) }); ST.create({ trigger: cv, start: 'top 85%', once: true, onEnter: () => tw2.play() }); track(cv, tw2); }
    };
    if (d.readyState === 'complete') go(); else w.addEventListener('load', go);
    let rw2 = w.innerWidth; w.addEventListener('resize', () => { if (Math.abs(w.innerWidth - rw2) > 40) { rw2 = w.innerWidth; const n = shown; setup(); fill(n); } });
  }

  /* ---------- drag rail ---------- */
  $$('[data-rail]').forEach(r => {
    if (!fine) return; let down = false, sx = 0, sl = 0, moved = false;
    r.addEventListener('pointerdown', e => { down = true; moved = false; sx = e.clientX; sl = r.scrollLeft; });
    w.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) { moved = true; r.classList.add('is-drag'); } r.scrollLeft = sl - dx; });
    w.addEventListener('pointerup', () => { down = false; setTimeout(() => r.classList.remove('is-drag'), 0); });
    r.addEventListener('click', e => { if (moved) e.preventDefault(); }, true);
    if (motion) G.from($$('.print', r), { x: 120, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: r, start: 'top 85%', once: true } });
  });

  /* ---------- CTA feather ---------- */
  if (motion) $$('.cta-feather').forEach(f => G.fromTo(f, { x: -60, rotate: -20, y: -30 }, { x: 60, rotate: 15, y: 20, ease: 'none', scrollTrigger: { trigger: f.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

  /* ---------- BIRDS tabs + checklists ---------- */
  const tabs = $('[data-tabs]');
  if (tabs) {
    const bt = $$('[data-tab]', tabs);
    const sel = (id, focus) => {
      tabs.dataset.on = id;
      bt.forEach(b => { const on = b.dataset.tab === id; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; $('#' + b.dataset.tab).hidden = !on; if (on && focus) b.focus(); });
      if (motion) G.fromTo(`#${id} .pick-g > *`, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'expo.out', stagger: .08 });
      ST && ST.refresh();
    };
    bt.forEach((b, i) => { b.addEventListener('click', () => { sel(b.dataset.tab); history.replaceState(null, '', '#' + b.dataset.tab); }); b.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = bt[(i + 1) % bt.length]; sel(n.dataset.tab, true); } }); });
    const h = location.hash.slice(1); sel(h === 'population' ? 'population' : 'training');
    if (h) setTimeout(() => { const y = tabs.getBoundingClientRect().top + w.scrollY - 100; lenis ? lenis.scrollTo(y, { immediate: true }) : w.scrollTo(0, y); }, 60);
  }
  $$('[data-ck]').forEach(c => { const k = 'bt-ck-' + c.dataset.ck; try { c.checked = localStorage.getItem(k) === '1'; } catch (e) {} c.addEventListener('change', () => { try { localStorage.setItem(k, c.checked ? '1' : '0'); } catch (e) {} }); });

  /* ---------- ABOUT ---------- */
  if (motion) $$('[data-spin]').forEach(b => G.fromTo(b, { rotate: -25 }, { rotate: 25, ease: 'none', scrollTrigger: { trigger: b, start: 'top bottom', end: 'bottom top', scrub: true } }));
  $$('[data-to]').forEach(el => {
    if (!motion) return; const to = +el.dataset.to, suf = el.dataset.suf || '', o = { v: el.dataset.plain ? to - 30 : 0 };
    G.to(o, { v: to, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { const v = Math.round(o.v); el.textContent = (el.dataset.sep ? v.toLocaleString('en-US') : v) + suf; } });
  });

  /* ---------- CONTACT inquiry builder ---------- */
  const iq = $('[data-iq]');
  if (iq) {
    const P = { ethan: { n: 'Ethan', p: '765-720-4896', e: '+17657204896' }, trevor: { n: 'Trevor', p: '765-246-1964', e: '+17652461964' } };
    const f = $('[data-iq-form]', iq), qin = $('[data-qty-in]', iq), uns = $('[data-qty-unsure]', iq), qty = $('.qty', iq), msel = $('[data-month-sel]', iq), mwrap = $('[data-month]', iq);
    const q = new URLSearchParams(location.search).get('use'); if (q) { const r = f.querySelector(`input[name=use][value="${q}"]`); if (r) r.checked = true; }
    const val = n => (iq.querySelector(`input[name=${n}]:checked`) || {}).value;
    const field = k => ($(`[data-f=${k}]`, iq).value || '').trim();
    const build = () => {
      const who = P[val('who')], use = val('use'), when = val('when'), pick = val('pickup'), n = Math.max(1, Math.min(5000, parseInt(qin.value, 10) || 1));
      mwrap.hidden = when !== 'month'; qty.classList.toggle('is-off', uns.checked);
      $$('.opt-q2', iq).forEach(b => b.classList.toggle('on', !uns.checked && +b.dataset.qset === n));
      const count = uns.checked ? 'some flight-ready quail' : `${n} flight-ready quail`;
      const purpose = { training: 'for dog training', population: 'to release and start a population', unsure: "and I'm not sure yet if it's for training or release" }[use];
      const timing = { asap: "I'd like them as soon as possible.", month: `I'm looking at ${msel.value}.`, asking: 'Just asking for now, no set date.' }[when];
      const pk = pick === 'pickup' ? 'I can pick up in Putnam County.' : 'Can we talk about pickup or other options?';
      const name = field('name'), town = field('town'), notes = field('notes');
      let m = `Hi ${who.n}, I'm interested in ${count} ${purpose}. ${timing} ${pk}`;
      if (uns.checked) m += ' Not sure on numbers yet.';
      if (town) m += ` I'm in ${town}.`;
      if (notes) m += `\n\n${notes}`;
      m += `\n\nWhat's available, and what's the price?${name ? `\n– ${name}` : ''}`;
      $('[data-msg]', iq).textContent = m;
      $$('[data-to-n]', iq).forEach(x => x.textContent = who.n); $('[data-to-p]', iq).textContent = who.p;
      const sms = $('[data-sms]', iq); sms.href = `sms:${who.e}?&body=${encodeURIComponent(m)}`; $('[data-tel]', iq).href = `tel:${who.e}`;
      $$('[data-sms] .rl', iq).forEach(r => { const s = r.querySelector('[data-to-n]'); if (s) s.textContent = who.n; });
      return m;
    };
    iq.addEventListener('input', build); iq.addEventListener('change', build);
    $$('[data-qty]', iq).forEach(b => b.addEventListener('click', () => { const step = (parseInt(qin.value, 10) || 0) >= 100 ? 10 : 5; qin.value = Math.max(1, (parseInt(qin.value, 10) || 0) + step * +b.dataset.qty); build(); }));
    $$('[data-qset]', iq).forEach(b => b.addEventListener('click', () => { qin.value = b.dataset.qset; uns.checked = false; build(); if (motion) G.fromTo(qin, { scale: 1.12 }, { scale: 1, duration: .5, ease: 'back.out(3)' }); }));
    $('[data-copy]', iq).addEventListener('click', async () => { const t = $('[data-copy-t]', iq); try { await navigator.clipboard.writeText(build()); t.textContent = 'Copied'; } catch (e) { t.textContent = 'Select and copy'; } setTimeout(() => t.textContent = 'Copy text', 2200); });
    f.addEventListener('submit', e => e.preventDefault());
    build();
  }

  /* ---------- FAQ smooth open ---------- */
  $$('.fq').forEach(dt => {
    const s = $('summary', dt), a = $('.fq-a', dt);
    s.addEventListener('click', e => {
      if (!motion) return; e.preventDefault();
      if (dt.open) { G.to(a, { height: 0, duration: .45, ease: 'expo.inOut', onComplete: () => { dt.open = false; G.set(a, { clearProps: 'height' }); ST.refresh(); } }); }
      else { dt.open = true; G.fromTo(a, { height: 0 }, { height: 'auto', duration: .6, ease: 'expo.out', onComplete: () => ST.refresh() }); }
    });
  });

  /* ---------- 404 bird ---------- */
  const nb = $('.nf-bird');
  if (nb && motion) { setInterval(() => nb.classList.toggle('flap'), 140); G.to(nb, { x: () => w.innerWidth * .2, y: -w.innerHeight * .3, duration: 7, ease: 'sine.in', repeat: -1, onRepeat: () => {} }); }

  if (motion) { w.addEventListener('load', () => ST.refresh()); }
})();
