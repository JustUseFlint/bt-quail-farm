"""Hard mobile check: scroll every page in steps on WebKit (iPhone) and Chromium (Android),
at 375/393/430 widths; at every step check horizontal overflow, escaping elements, scrollBy(x) lock,
and at the end that no reveal content is stuck invisible."""
import asyncio, sys, json
from playwright.async_api import async_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8822/bt-quail-farm/'
PAGES = ['', 'birds/', 'process/', 'gallery/', 'about/', 'contact/', '404.html']
if len(sys.argv) > 2 and sys.argv[2]: PAGES = [p if p != 'home' else '' for p in sys.argv[2].split(',')]
WIDTHS = [375, 393, 430]
ENGINES = sys.argv[3].split(',') if len(sys.argv) > 3 else ['webkit', 'chromium']
PROBE = r'''() => {
  const W = innerWidth, out = [];
  const contained = el => { for (let a = el.parentElement; a && a !== document.body && a !== document.documentElement; a = a.parentElement) { const s = getComputedStyle(a); if (s.overflowX !== 'visible' || (s.clipPath && s.clipPath !== 'none' && s.position === 'fixed')) { const cr = a.getBoundingClientRect(); if (cr.right <= W + 0.5 && cr.left >= -0.5) return true; } } return false; };
  for (const el of document.querySelectorAll('body *')) {
    const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    if (r.right > W + 0.5 || r.left < -0.5) {
      if (contained(el)) continue;
      out.push(((el.className && el.className.baseVal !== undefined) ? el.className.baseVal : el.className || el.tagName) + ` [${Math.round(r.left)},${Math.round(r.right)}] ${s.position}`);
    }
  }
  return { sw: document.documentElement.scrollWidth, bw: document.body.scrollWidth, W, sx: scrollX, bad: out.slice(0, 6) };
}'''
STUCK = r'''() => [...document.querySelectorAll('[data-reveal],[data-split],[data-chars],[data-wipe],.hero-h .hl>span,[data-hero-sub],[data-hero-k],.tl-c,.print,.use,.person')].filter(el => {
  const s = getComputedStyle(el); const r = el.getBoundingClientRect(); if (!r.height || el.closest('[hidden]')) return false;
  return +s.opacity < .95 || s.visibility === 'hidden' || (s.clipPath && s.clipPath !== 'none' && !/inset\(0(px|%)? ?0?/.test(s.clipPath));
}).map(el => (el.className || el.tagName) + ' op=' + getComputedStyle(el).opacity + ' clip=' + getComputedStyle(el).clipPath + ' vis=' + getComputedStyle(el).visibility).slice(0, 8)'''
async def run():
    async with async_playwright() as p:
        summary = []
        for eng in ENGINES:
            br = await getattr(p, eng).launch()
            for W in WIDTHS:
                if eng == 'webkit': dev = dict(p.devices['iPhone 15']); dev['viewport'] = {'width': W, 'height': 800}
                else: dev = dict(p.devices['Pixel 7']); dev['viewport'] = {'width': W, 'height': 800}
                ctx = await br.new_context(**dev)
                for pg_ in PAGES:
                    page = await ctx.new_page(); errs = []
                    page.on('pageerror', lambda e, x=errs: x.append('PAGEERR ' + str(e)[:200]))
                    page.on('console', lambda m, x=errs: x.append('CONSOLE ' + m.text[:200]) if m.type == 'error' else None)
                    page.on('requestfailed', lambda r, x=errs: x.append('REQFAIL ' + r.url))
                    await page.goto(BASE + pg_, wait_until='networkidle'); await page.wait_for_timeout(1200)
                    H = await page.evaluate('document.documentElement.scrollHeight'); y = 0; issues = []; steps = 0
                    while True:
                        res = await page.evaluate(PROBE)
                        await page.evaluate('window.scrollBy(200,0)'); await page.wait_for_timeout(60)
                        sx = await page.evaluate('scrollX')
                        if res['sw'] > res['W'] or res['bad'] or sx != 0:
                            issues.append({'y': y, 'sw': res['sw'], 'sx_after_scrollBy': sx, 'bad': res['bad']})
                            await page.evaluate('window.scrollTo(0, scrollY)')
                        if y >= H - 800: break
                        y = min(y + 360, H - 800); steps += 1
                        await page.evaluate(f'window.scrollTo(0,{y})'); await page.wait_for_timeout(280)
                        H = await page.evaluate('document.documentElement.scrollHeight')
                    await page.wait_for_timeout(1500)
                    # second pass back up so once-triggers have finished, then look for stuck content
                    stuck = await page.evaluate(STUCK)
                    summary.append({'eng': eng, 'w': W, 'page': pg_ or '/', 'steps': steps, 'issues': issues[:4], 'n_issue_steps': len(issues), 'stuck': stuck, 'errs': errs})
                    await page.close()
                await ctx.close()
            await br.close()
        bad = 0
        for s in summary:
            ok = not s['issues'] and not s['stuck'] and not s['errs']
            bad += not ok
            print(('OK  ' if ok else 'FAIL'), s['eng'], s['w'], s['page'], 'steps', s['steps'], '' if ok else json.dumps({k: s[k] for k in ('n_issue_steps', 'issues', 'stuck', 'errs')})[:900])
        print('FAILURES', bad, 'of', len(summary))
asyncio.run(run())
