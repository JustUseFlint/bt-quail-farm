"""Transitions + back/forward + desktop pin sanity."""
import asyncio, sys
from playwright.async_api import async_playwright
BASE = sys.argv[1]
async def run():
    async with async_playwright() as p:
        for eng, dev in [('webkit', 'iPhone 15'), ('chromium', 'Pixel 7'), ('chromium', None)]:
            br = await getattr(p, eng).launch()
            ctx = await (br.new_context(**p.devices[dev]) if dev else br.new_context(viewport={'width': 1440, 'height': 900}))
            pg = await ctx.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto(BASE, wait_until='networkidle'); await pg.wait_for_timeout(1500)
            st = lambda: pg.evaluate("({sweep:getComputedStyle(document.querySelector('.sweep')).visibility, pt:document.documentElement.classList.contains('pt-in'), url:location.pathname, lenis:document.documentElement.classList.contains('lenis'), touch:document.documentElement.classList.contains('is-touch')})")
            print(eng, dev or 'desktop', 'home', await st())
            if dev:
                await pg.click('[data-menubtn]'); await pg.wait_for_timeout(900); await pg.click('#menu a[href*="birds"]')
            else:
                await pg.click('.bar-nav a[href*="birds"]')
            await pg.wait_for_url('**/birds/**'); await pg.wait_for_timeout(1800); print('  birds', await st())
            await pg.go_back(); await pg.wait_for_timeout(1500); print('  back', await st())
            await pg.go_forward(); await pg.wait_for_timeout(1500); print('  fwd', await st())
            if not dev:
                for W in (1440, 1024):
                    await pg.set_viewport_size({'width': W, 'height': 900 if W == 1440 else 768})
                    await pg.goto(BASE, wait_until='networkidle'); await pg.wait_for_timeout(1200)
                    r = await pg.evaluate("""async () => { const f = document.querySelector('[data-flush]'); const y = f.getBoundingClientRect().top + scrollY; window.scrollTo(0, y + innerHeight*.7); await new Promise(r => setTimeout(r, 1400)); const pin = document.querySelector('.flush-pin').getBoundingClientRect(); return { pinTop: Math.round(pin.top), pinned: !!document.querySelector('.pin-spacer'), sw: document.documentElement.scrollWidth, W: innerWidth } }""")
                    await pg.screenshot(path=f'shots/local-d-flush-{W}.png')
                    print('  desktop', W, r)
            print('  errs', errs); await br.close()
asyncio.run(run())
