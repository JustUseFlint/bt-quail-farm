import asyncio, sys, json
from playwright.async_api import async_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8822/bt-quail-farm/'
OUT='/workspace/bt-quail/site/shots/'
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); r = {}
        ctx = await b.new_context(viewport={'width': 393, 'height': 852}, device_scale_factor=3, is_mobile=True, has_touch=True)
        pg = await ctx.new_page(); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(BASE + 'contact/?use=population', wait_until='networkidle'); await pg.wait_for_timeout(1500)
        await pg.click('[data-qset="100"]'); await pg.click('text=In a certain month'); await pg.select_option('[data-month-sel]', index=2)
        await pg.fill('[data-f=name]', 'Sam Test'); await pg.fill('[data-f=town]', 'Greencastle')
        await pg.click('.who-o:has-text("Trevor")')
        r['msg'] = await pg.text_content('[data-msg]'); r['sms'] = await pg.get_attribute('[data-sms]', 'href'); r['tel'] = await pg.get_attribute('[data-tel]', 'href')
        r['monthVisible'] = await pg.is_visible('[data-month]')
        await pg.locator('.iq-out').scroll_into_view_if_needed(); await pg.wait_for_timeout(800)
        await pg.locator('.iq-out').screenshot(path=OUT+'func-contact-note-m.png')
        # menu
        await pg.goto(BASE, wait_until='networkidle'); await pg.wait_for_timeout(1500)
        await pg.click('[data-menubtn]'); await pg.wait_for_timeout(1300); await pg.screenshot(path=OUT+'func-menu-m.png')
        r['menuOpen'] = await pg.is_visible('#menu')
        await pg.click('.menu-nav a:has-text("About")'); await pg.wait_for_timeout(2500)
        r['navUrl'] = pg.url
        await pg.screenshot(path=OUT+'func-after-nav-m.png')
        # call popover
        await pg.click('.bar-call'); await pg.wait_for_timeout(700); await pg.screenshot(path=OUT+'func-callpop-m.png'); r['pop']=await pg.is_visible('#callpop')
        r['errs_m']=errs
        await ctx.close()
        ctx = await b.new_context(viewport={'width': 1440, 'height': 900})
        pg = await ctx.new_page(); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(BASE + 'birds/#population', wait_until='networkidle'); await pg.wait_for_timeout(2000)
        r['popTabSel'] = await pg.get_attribute('#t-population', 'aria-selected')
        await pg.click('.ck >> nth=7'); r['ckSaved'] = await pg.evaluate('Object.keys(localStorage).filter(k=>k.startsWith("bt-ck")).length')
        await pg.screenshot(path=OUT+'func-birds-pop-d.png')
        await pg.goto(BASE, wait_until='networkidle'); await pg.wait_for_timeout(1500)
        await pg.click('.bar-nav a:has-text("About")'); await pg.wait_for_timeout(450); await pg.screenshot(path=OUT+'func-transition-d.png'); await pg.wait_for_timeout(2500); r['navUrl2']=pg.url
        r['errs_d']=errs
        await b.close(); print(json.dumps(r, indent=1))
asyncio.run(run())
