"""Record WebKit iPhone 15 scroll-through videos + a jump-to-bottom stuck-content test."""
import asyncio, sys, os, shutil
from playwright.async_api import async_playwright
BASE = sys.argv[1]; OUT = sys.argv[2]; os.makedirs(OUT, exist_ok=True)
PAGES = [('home', ''), ('birds', 'birds/'), ('process', 'process/'), ('contact', 'contact/')]
STUCK = open(os.path.join(os.path.dirname(__file__), 'mobile_check.py')).read().split("STUCK = r'''")[1].split("'''")[0]
async def run():
    async with async_playwright() as p:
        br = await p.webkit.launch()
        dev = dict(p.devices['iPhone 15'])
        for name, path in PAGES:
            ctx = await br.new_context(**dev, record_video_dir=OUT, record_video_size={'width': 393, 'height': 852})
            pg = await ctx.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto(BASE + path, wait_until='networkidle'); await pg.wait_for_timeout(2200)
            H = await pg.evaluate('document.documentElement.scrollHeight'); y = 0
            # finger-like scrolling: mouse.wheel in small increments ~ 60fps
            while y < H - 852:
                y += 28; await pg.evaluate(f'window.scrollTo(0,{y})'); await pg.wait_for_timeout(16)
                if y % 1400 < 28: await pg.wait_for_timeout(700)
                H = await pg.evaluate('document.documentElement.scrollHeight')
            await pg.wait_for_timeout(1500)
            st = await pg.evaluate(STUCK)
            v = pg.video; await ctx.close()
            dst = os.path.join(OUT, f'mobile-{name}.webm'); shutil.move(await v.path(), dst)
            print(name, 'stuck', st, 'errs', errs, dst)
        # jump test
        ctx = await br.new_context(**dev)
        for name, path in PAGES + [('about', 'about/'), ('gallery', 'gallery/')]:
            pg = await ctx.new_page(); await pg.goto(BASE + path, wait_until='networkidle'); await pg.wait_for_timeout(400)
            await pg.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)'); await pg.wait_for_timeout(2600)
            st = await pg.evaluate(STUCK); print('jump', name, 'stuck', st); await pg.close()
        await br.close()
asyncio.run(run())
