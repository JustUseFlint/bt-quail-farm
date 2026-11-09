"""Record page-transition videos (desktop Chromium 1440, iPhone WebKit) and time them."""
import asyncio, sys, os, shutil, time
from playwright.async_api import async_playwright
BASE = sys.argv[1]; OUT = sys.argv[2]; FALLBACK = len(sys.argv) > 3 and sys.argv[3] == 'fallback'; os.makedirs(OUT, exist_ok=True)
INIT = "delete Window.prototype.onpagereveal; delete window.onpagereveal;" if FALLBACK else ""
async def run():
    async with async_playwright() as p:
        for name, eng, dev in [('desktop', 'chromium', None), ('mobile', 'webkit', 'iPhone 15')]:
            br = await getattr(p, eng).launch()
            kw = dict(p.devices[dev]) if dev else {'viewport': {'width': 1440, 'height': 900}}
            vs = {'width': 393, 'height': 852} if dev else {'width': 1440, 'height': 900}
            ctx = await br.new_context(**kw, record_video_dir=OUT, record_video_size=vs)
            if INIT: await ctx.add_init_script(INIT)
            pg = await ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto(BASE, wait_until='networkidle'); await pg.wait_for_timeout(2500)
            steps = [('nav Birds', '.bar-nav a[href$="birds/"]'), ('nav About', '.bar-nav a[href$="about/"]')] if not dev else [('menu Birds', 'menu:birds/'), ('menu Contact', 'menu:contact/')]
            for label, sel in steps:
                t0 = time.time()
                if sel.startswith('menu:'):
                    await pg.click('[data-menubtn]'); await pg.wait_for_timeout(1100); t0 = time.time(); await pg.click(f'#menu a[href$="{sel[5:]}"]')
                else: await pg.click(sel)
                await pg.wait_for_load_state('load'); t1 = time.time()
                await pg.wait_for_timeout(2200)
                print(name, label, 'url', pg.url.split('bt-quail-farm')[1], 'click->load %.0fms' % ((t1 - t0) * 1000))
            await pg.go_back(); await pg.wait_for_timeout(1800)
            st = await pg.evaluate("({url:location.pathname, leaving:document.documentElement.classList.contains('is-leaving'), mainOp:getComputedStyle(document.querySelector('main')).opacity, menu:!document.querySelector('#menu').hidden})")
            print(name, 'after back', st, 'errs', errs)
            v = pg.video; await ctx.close(); dst = os.path.join(OUT, f'transition-{name}{"-fallback" if FALLBACK else ""}.webm'); shutil.move(await v.path(), dst); print(dst)
            await br.close()
asyncio.run(run())
