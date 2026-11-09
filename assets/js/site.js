/* B & T Quail Farm — interactions */
(() => {
  const d = document, w = window, H = d.documentElement;
  const $ = (s, r = d) => r.querySelector(s), $$ = (s, r = d) => [...r.querySelectorAll(s)];
  const RM = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = w.gsap, ST = w.ScrollTrigger;
  const motion = !RM && !!G && H.classList.contains('motion');
  const fine = w.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const desk = () => w.innerWidth >= 900;
  w.__btReady = true;
  if (!G) { H.classList.remove('motion', 'pt-in'); H.classList.add('no-motion'); }
  if (G) G.registerPlugin(...[ST, w.SplitText, w.MotionPathPlugin, w.DrawSVGPlugin].filter(Boolean));

  /* ---------- roll text ---------- */
  $$('[data-roll]').forEach(el => { if (el.dataset.rolled) return; const t = el.innerHTML; el.dataset.rolled = 1; el.innerHTML = `<span class="rl rl-1">${t}</span><span class="rl rl-2" aria-hidden="true">${t}</span>`; });

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (motion && w.Lenis) {
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

  /* ---------- page transitions: tall grass ---------- */
  const sweep = $('.sweep'), blades = $$('.sweep-b i'), sBadge = $('.sweep-badge');
  const order = blades.map((b, i) => Math.abs(i - (blades.length - 1) / 2));
  if (G) G.set(blades, { y: 0, yPercent: H.classList.contains('pt-in') ? -8 : 105 });
  if (motion && H.classList.contains('pt-in')) {
    try { sessionStorage.removeItem('bt-pt'); } catch (e) {}
    G.set(sweep, { visibility: 'visible' });
    G.timeline({ onComplete: () => { H.classList.remove('pt-in'); G.set(sweep, { visibility: 'hidden' }); } })
      .to(sBadge, { opacity: 0, scale: .8, duration: .3 }, .05)
      .to(blades, { yPercent: -112, duration: .9, ease: 'expo.inOut', stagger: i => order[i] * .035 }, .1);
  }
  const internal = a => a.origin === location.origin && !a.hasAttribute('download') && a.target !== '_blank' && !/^(tel|sms|mailto):/.test(a.protocol) && !(a.pathname === location.pathname && a.hash);
  d.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    if (!internal(a) || !motion) return;
    e.preventDefault(); const href = a.href;
    if (!menu.hidden) H.classList.remove('is-menu');
    G.set(sweep, { visibility: 'visible' }); G.set(blades, { yPercent: 105 }); G.set(sBadge, { opacity: 0, scale: .8, rotate: -30 });
    G.timeline({ onComplete: () => { try { sessionStorage.setItem('bt-pt', '1'); } catch (e) {} location.href = href; } })
      .to(blades, { yPercent: -8, duration: .62, ease: 'expo.inOut', stagger: i => (order.length / 2 - order[i]) * .025 })
      .to(sBadge, { opacity: 1, scale: 1, rotate: 0, duration: .45, ease: 'back.out(2)' }, '-=.3');
  });
  w.addEventListener('pageshow', e => { if (e.persisted && G) { G.set(sweep, { visibility: 'hidden' }); H.classList.remove('pt-in'); } });

  /* ---------- text splitting ---------- */
  const splitLines = el => {
    if (!w.SplitText) return null;
    const s = new w.SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'ln' }); el.classList.add('is-split'); return s;
  };
  const reveals = () => {
  if (motion) {
    $$('[data-split]').forEach(el => {
      const s = splitLines(el); if (!s) return;
      G.from(s.lines, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: .09, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    $$('[data-chars]').forEach(el => {
      const s = new w.SplitText(el, { type: 'words,chars', mask: 'words', wordsClass: 'wd' }); el.classList.add('is-split');
      G.from(s.chars, { yPercent: 110, rotate: 6, duration: 1.1, ease: 'expo.out', stagger: .022, delay: el.closest('.ph') ? .25 : 0, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    $$('[data-reveal]').forEach(el => G.to(el, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
    $$('[data-wipe]').forEach(el => {
      const im = $('img', el);
      G.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.25, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 92%', once: true }, onComplete: () => { el.style.clipPath = 'none'; } });
      if (im) G.from(im, { scale: 1.3, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    // scroll-filled words
    $$('[data-fill]').forEach(el => {
      const s = new w.SplitText(el, { type: 'words', wordsClass: 'w' });
      G.to(s.words, { color: 'inherit', stagger: .1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    });
  }
  ST && ST.refresh();
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
  if (motion) $$('.grass').forEach(g => {
    G.to(g, { skewX: 2.5, duration: 3 + Math.random() * 2, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 100%' });
  });
  if (motion && fine) { const hg = $('.hero-grass'); if (hg) { const sx = G.quickTo(hg, 'x', { duration: 1.2, ease: 'power3.out' }); w.addEventListener('pointermove', e => sx((e.clientX / w.innerWidth - .5) * -24), { passive: true }); } }

  /* ---------- HOME hero ---------- */
  const hero = $('[data-hero]');
  if (hero) {
    const win = $('[data-hero-win]', hero), seal = $('[data-seal]', hero), img = $('.hero-img img', hero);
    if (motion) {
      const tl = G.timeline({ delay: H.classList.contains('pt-in') ? .55 : .15 });
      tl.to(win, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.5, ease: 'expo.inOut' }, 0)
        .from(img, { scale: 1.35, duration: 2.2, ease: 'expo.out' }, .1)
        .to('[data-hero-k]', { opacity: 1, duration: .8 }, .5)
        .to('.hero-h .hl>span', { y: 0, yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: .12 }, .55)
        .to('[data-hero-sub]', { opacity: 1, duration: 1, stagger: .1 }, 1)
        .fromTo(seal, { opacity: 0, scale: .4, rotate: -120 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: 'back.out(1.4)' }, .9)
        .from('.hero-grass', { yPercent: 60, duration: 1.6, ease: 'expo.out' }, .6)
        .from('[data-band] .band-i', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1 }, 1);
      tl.eventCallback('onComplete', () => win.style.clipPath = 'none');
      // scroll: arch flattens, image drifts, seal turns
      G.to(win, { borderRadius: '24px 24px 24px 24px', ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      G.to(img, { yPercent: 10, scale: 1.08, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      G.to('.seal-ring', { rotate: 220, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      G.to('.hero-copy', { yPercent: -18, opacity: .2, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
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
        const svg = desk() ? $('.flush-d', flush) : $('.flush-m', flush), path = $('.flush-path', svg), trail = $('.flush-reveal', svg);
        const len = path.getTotalLength(), M = svg.getScreenCTM(), sr = $('.flush-stage', flush).getBoundingClientRect();
        const pt = t => { const p = path.getPointAtLength(len * t); const q = new DOMPoint(p.x, p.y).matrixTransform(M); return [q.x - sr.left, q.y - sr.top]; };
        wps.forEach(el => { const [x, y] = pt(+el.dataset.wp); el.style.left = x + 'px'; el.style.top = y + 'px'; });
        if (!motion) { const [x, y] = pt(.62); G.set(bird, { x: x - bird.offsetWidth / 2, y: y - bird.offsetHeight / 2, rotate: -18 }); return; }
        G.set(wps, { opacity: 0, scale: .8 });
        const tl = G.timeline({ scrollTrigger: { trigger: flush, start: desk() ? 'top top' : 'top 70%', end: desk() ? '+=150%' : 'bottom 60%', scrub: .6, pin: desk() ? $('.flush-pin', flush) : false } });
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
    const cv = $('[data-eggs]', hatch), cnt = $('[data-count]', hatch), N = 4300, T = 43; let tc, tr, ord, ctx2, cw, ch, tw, gap, dpr;
    const setup = () => {
      tc = desk() ? 9 : 6; tr = Math.ceil(T / tc); dpr = Math.min(w.devicePixelRatio || 1, 2);
      cw = cv.clientWidth; gap = Math.max(4, cw * .012); tw = (cw - gap * (tc - 1)) / tc; ch = tr * tw + (tr - 1) * gap;
      cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr); cv.style.height = ch + 'px'; ctx2 = cv.getContext('2d'); ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
      let s = 42; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
      ord = new Float32Array(N); for (let i = 0; i < N; i++) { const t = (i / 100) | 0; ord[i] = (t + r() * 1.6) / (T + 1.6); }
      draw(motion ? 0 : 1);
    };
    const draw = p => {
      ctx2.clearRect(0, 0, cw, ch); let n = 0; const c = tw / 10, rx = c * .3, ry = c * .38;
      for (let t = 0; t < T; t++) {
        const tx = (t % tc) * (tw + gap), ty = ((t / tc) | 0) * (tw + gap);
        ctx2.strokeStyle = 'rgba(243,233,213,.16)'; ctx2.lineWidth = 1; ctx2.beginPath(); ctx2.roundRect ? ctx2.roundRect(tx + .5, ty + .5, tw - 1, tw - 1, 4) : ctx2.rect(tx + .5, ty + .5, tw - 1, tw - 1); ctx2.stroke();
        for (let k = 0; k < 100; k++) {
          const i = t * 100 + k, on = ord[i] <= p; if (on) n++;
          ctx2.beginPath(); ctx2.ellipse(tx + (k % 10) * c + c / 2, ty + ((k / 10) | 0) * c + c / 2, rx, ry, 0, 0, Math.PI * 2);
          ctx2.fillStyle = on ? (k % 9 === 0 ? '#C9A57A' : '#E9DCC2') : 'rgba(243,233,213,.1)'; ctx2.fill();
        }
      }
      cnt.textContent = n.toLocaleString('en-US');
    };
    const go = () => { setup(); if (motion) ST.create({ trigger: hatch, start: 'top 70%', end: 'bottom 85%', scrub: .5, onUpdate: s => draw(s.progress) }); };
    if (d.readyState === 'complete') go(); else w.addEventListener('load', go);
    let rw2 = w.innerWidth; w.addEventListener('resize', () => { if (Math.abs(w.innerWidth - rw2) > 40) { rw2 = w.innerWidth; const st = ST && ST.getAll().find(t => t.trigger === hatch); setup(); if (st) draw(st.progress); } });
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

  /* ---------- PROCESS timeline ---------- */
  const tlS = $('[data-tl]');
  if (tlS && motion) {
    const mm = G.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const track = $('[data-tl-track]', tlS), fill = $('[data-tl-fill]', tlS), pin = $('.tl-pin', tlS);
      const dist = () => track.scrollWidth - w.innerWidth;
      const tw = G.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .7, invalidateOnRefresh: true } });
      G.to(fill, { width: '100%', ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: () => '+=' + dist(), scrub: true } });
      $$('.tl-im img', tlS).forEach(im => G.fromTo(im, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: im, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } }));
    });
    mm.add('(max-width: 899px)', () => {
      $$('.tl-c', tlS).forEach(c => G.from(c, { opacity: 0, x: 30, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 85%', once: true } }));
    });
  }
  const calc = $('[data-calc]');
  if (calc) {
    const inp = $('[data-calc-in]', calc), fmt = dt => dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const S = [[0, 'Just hatched'], [1, 'Brooding'], [42, 'In the flight pen'], [84, 'Flight ready (12 weeks +)'], [112, 'Mature (16 weeks +)']];
    const run = () => {
      const v = inp.value; if (!v) return; const [y, m, dd] = v.split('-').map(Number); const h = new Date(y, m - 1, dd);
      const now = new Date(); now.setHours(0, 0, 0, 0); const days = Math.round((now - h) / 864e5);
      const add = n => { const x = new Date(h); x.setDate(x.getDate() + n); return x; };
      $('[data-calc-12]', calc).textContent = fmt(add(84)); $('[data-calc-16]', calc).textContent = fmt(add(112));
      if (days < 0) { $('[data-calc-w]', calc).textContent = '0'; $('[data-calc-d]', calc).textContent = `Hatches in ${-days} day${days === -1 ? '' : 's'}`; $('[data-calc-s]', calc).textContent = 'Still in the egg'; $('[data-calc-bar]', calc).style.width = '0%'; return; }
      const wk = Math.floor(days / 7); $('[data-calc-w]', calc).textContent = wk; $('.calc-u', calc).textContent = wk === 1 ? 'week old' : 'weeks old';
      $('[data-calc-d]', calc).textContent = `${days} day${days === 1 ? '' : 's'} since hatch`;
      let st = S[0][1]; S.forEach(([n, t]) => { if (days >= n) st = t; }); $('[data-calc-s]', calc).textContent = st;
      $('[data-calc-bar]', calc).style.width = Math.min(100, (days + 23) / 135 * 100) + '%';
    };
    inp.addEventListener('input', run); run();
  }

  /* ---------- GALLERY ---------- */
  const gal = $('[data-gal]');
  if (gal) {
    const items = $$('.gi', gal), data = JSON.parse($('#gal-data').textContent), root = d.querySelector('link[rel=stylesheet][href*="site.css"]').getAttribute('href').replace('assets/css/site.css', '');
    $$('[data-filter]', gal).forEach(b => b.addEventListener('click', () => {
      $$('[data-filter]', gal).forEach(x => x.setAttribute('aria-pressed', x === b)); const f = b.dataset.filter;
      items.forEach(it => { const show = f === 'All' || it.dataset.cat === f; it.hidden = !show; });
      if (motion) G.fromTo(items.filter(i => !i.hidden), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'expo.out', stagger: .04 });
      ST && ST.refresh();
    }));
    const tone = $('[data-tone]', gal); const setTone = () => gal.classList.toggle('is-color', tone.checked); tone.addEventListener('change', setTone);
    const lb = $('[data-lbox]'), li = $('[data-lb-img]', lb); let at = 0, opener = null;
    const show = i => { at = (i + data.length) % data.length; const x = data[at]; li.src = `${root}assets/img/${tone.checked ? x.c : x.p}.webp`; li.alt = x.alt; $('[data-lb-n]', lb).textContent = String(at + 1).padStart(2, '0') + ' / ' + data.length; $('[data-lb-cap]', lb).textContent = x.cap; if (motion) G.fromTo('.lb-im', { opacity: 0, scale: .96 }, { opacity: 1, scale: 1, duration: .5, ease: 'expo.out' }); };
    const open = (i, el) => { opener = el; lb.hidden = false; lock(true); show(i); $('[data-lb-x]', lb).focus(); };
    const close = () => { lb.hidden = true; lock(false); opener && opener.focus(); };
    $$('[data-lb]', gal).forEach(b => b.addEventListener('click', () => open(+b.dataset.lb, b)));
    $('[data-lb-x]', lb).addEventListener('click', close);
    $('[data-lb-prev]', lb).addEventListener('click', () => show(at - 1)); $('[data-lb-next]', lb).addEventListener('click', () => show(at + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    d.addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(at + 1); if (e.key === 'ArrowLeft') show(at - 1); if (e.key === 'Tab') { const f = $$('button', lb); const i = f.indexOf(d.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } } });
    let tx = 0; lb.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true }); lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1)); });
  }

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
