import asyncio, sys, json
from playwright.async_api import async_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] else 'http://localhost:8822/bt-quail-farm/'
OUT = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] else '/workspace/bt-quail/site/shots/'
ONLY = sys.argv[3].split(',') if len(sys.argv) > 3 and sys.argv[3] else None
PAGES = ['', 'birds/', 'process/', 'gallery/', 'about/', 'contact/', '404.html']
VPS = [('m', 393, 852, 3), ('d', 1440, 900, 1)]
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        res = []
        for tag, w, h, dpr in VPS:
            ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=dpr, is_mobile=(tag == 'm'), has_touch=(tag == 'm'))
            for pg in PAGES:
                name = (pg.strip('/').replace('.html', '') or 'home')
                if ONLY and name not in ONLY: continue
                page = await ctx.new_page(); errs = []
                page.on('console', lambda m, e=errs: e.append(m.text) if m.type == 'error' else None)
                page.on('pageerror', lambda x, e=errs: e.append('PAGEERR ' + str(x)))
                page.on('requestfailed', lambda r, e=errs: e.append('REQFAIL ' + r.url))
                r = await page.goto(BASE + pg, wait_until='networkidle')
                await page.wait_for_timeout(2600)
                await page.screenshot(path=f'{OUT}{name}-{tag}-0.png')
                H = await page.evaluate('document.documentElement.scrollHeight'); y = 0; i = 1
                while y < H - h:
                    y = min(y + int(h * .9), H - h)
                    await page.evaluate(f'window.scrollTo(0,{y})'); await page.wait_for_timeout(900)
                    await page.screenshot(path=f'{OUT}{name}-{tag}-{i}.png'); i += 1
                    H = await page.evaluate('document.documentElement.scrollHeight')
                    if i > 30: break
                ov = await page.evaluate('[window.innerWidth, document.documentElement.scrollWidth, [...document.querySelectorAll("body *")].filter(e=>{const r=e.getBoundingClientRect();return r.width && r.right>window.innerWidth+1 && getComputedStyle(e).position!=="fixed" && !e.closest(".rail,.sweep,.seg,.tl-track,.menu,.lb,.grass,.hero-grass")}).slice(0,6).map(e=>e.className.baseVal!==undefined?e.className.baseVal:(e.className||e.tagName))]')
                res.append({'page': pg or '/', 'vp': tag, 'status': r.status if r else None, 'errs': errs, 'overflow': ov, 'shots': i})
                await page.close()
            await ctx.close()
        await b.close()
        for x in res: print(json.dumps(x))
asyncio.run(run())
