import { PEOPLE, FB, SRC } from './data.mjs';
import { page, img, btn, eb, src, use, arr, grassSvg, smsHref, telHref, personRow, esc } from './shell.mjs';

const [ETHAN, TREVOR] = PEOPLE;
const INTRO = 'B&T Quail Farm is proud to offer quality flight ready birds! Hatched and raised with the utmost care, our birds are readily available for dog training or population purposes! Call or text for more details';
const pic = (root, n, alt, cap, { cls = '', fig = '' } = {}) => `<figure class="print ${cls}" data-wipe>${fig ? `<span class="print-fig">${fig}</span>` : ''}<div class="print-im">${img(root, n, alt)}</div>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
const ppl = (cls = '') => `<div class="ppl ${cls}">${PEOPLE.map(p => `<article class="person" data-reveal>
  <p class="eb">Call or text</p><h3 class="person-n">${p.name}</h3><a class="person-ph" href="${telHref(p)}">${p.phone}</a>
  <div class="person-a">${btn(telHref(p), 'Call ' + p.name, 'btn-ink', '', use('i-phone', 'i'))}${btn(smsHref(p), 'Text ' + p.name, 'btn-line', '', use('i-sms', 'i'))}</div>
</article>`).join('')}</div>`;

const pageHead = ({ n, label, title, lead, aside = '' }) => `<section class="ph">
  <div class="ph-meta"><span class="ph-n">${n}</span><span>${label}</span></div>
  <h1 class="ph-h" data-chars>${title}</h1>
  <div class="ph-foot"><p class="ph-lead" data-split>${lead}</p>${aside}</div>
</section>`;

/* ---------------- HOME ---------------- */
function home() {
  const root = '';
  const body = `
<section class="hero" data-hero>
  <div class="hero-stage">
  <div class="hero-copy">
      <p class="hero-k" data-hero-k><svg class="i"><use href="#i-quail"/></svg>Raising quality</p>
      <h1 class="hero-h" data-hero-h><span class="hl"><span>Flight ready.</span></span><span class="hl"><span><em>Field proven.</em></span></span></h1>
      <p class="hero-sub" data-hero-sub>Quail hatched and raised in Putnam County, Indiana, for dog training and for starting a population.</p>
      <div class="hero-cta" data-hero-sub>${btn('contact/', 'Build a bird inquiry', 'btn-ink')}<button class="btn btn-line" type="button" data-callbtn aria-controls="callpop" aria-expanded="false" data-magnetic><span class="btn-t" data-roll>Call or text</span><span class="btn-o" aria-hidden="true">${use('i-phone', 'i')}</span></button></div>
    </div>
  <div class="hero-win" data-hero-win>
    <picture class="hero-img"><source media="(min-width: 900px)" srcset="assets/img/pano.webp"><img src="assets/img/hero-quail.webp" alt="A bobwhite quail standing in dry grass, from the farm's cover art" width="1150" height="1250" fetchpriority="high"></picture>
    <div class="hero-haze" aria-hidden="true"></div>
    <div class="seal" data-seal aria-hidden="true">
      <svg viewBox="0 0 200 200"><defs><path id="sealc" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1 -148 0"/></defs><circle cx="100" cy="100" r="96" fill="#E9DCC2" stroke="#2A1F16" stroke-width="2"/><circle cx="100" cy="100" r="88" fill="none" stroke="#2A1F16" stroke-width="1"/><circle cx="100" cy="100" r="58" fill="none" stroke="#2A1F16" stroke-width="1"/><g class="seal-ring"><text font-family="'Barlow Condensed',sans-serif" font-weight="600" font-size="17" letter-spacing="3.2" fill="#2A1F16"><textPath href="#sealc">HEALTHY BIRDS · STRONG STARTS · HEALTHY BIRDS · STRONG STARTS ·</textPath></text></g><text x="100" y="94" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-weight="700" font-size="17" letter-spacing="1.5" fill="#2A1F16">RAISED</text><text x="100" y="114" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-weight="700" font-size="17" letter-spacing="1.5" fill="#2A1F16">WITH CARE</text></svg>
    </div>
    ${grassSvg('hero-grass', { w: 1440, h: 150, n: 300, seed: 9, min: .18, max: .9 })}
  </div>
  </div>
  <div class="band" data-band>
    <a class="band-i" href="birds/#training" data-cursor="Birds"><svg class="band-ic band-dog"><use href="#i-dog"/></svg><span>Perfect for<br>dog training</span>${arr}</a>
    <a class="band-i" href="birds/#population" data-cursor="Birds"><svg class="band-ic band-q"><use href="#i-quail"/></svg><span>Start a population.<br>Enhance your farm.</span>${arr}</a>
  </div>
</section>

<section class="intro">
  <div class="intro-side">${eb('B &amp; T Quail Farm')}<p class="intro-src">Putnam County, Indiana</p></div>
  <div>
    <p class="intro-q" data-fill>${esc(INTRO)}.</p>
    <div class="intro-ppl">${PEOPLE.map(p => `<a class="tag" href="${telHref(p)}" data-magnetic><b>${p.name}</b> ${p.phone}</a>`).join('')}</div>
  </div>
</section>

<section class="flush" data-flush>
  <div class="flush-pin">
    <div class="flush-head">
      ${eb('What “flight ready” means')}
      <h2 class="h2" data-split>From the hatcher<br>to a hard flush.</h2>
      <p class="flush-p" data-reveal>Bobwhite eggs take about 23 days to hatch. Chicks are moved into flight pens at around six weeks, away from people and dogs, so they grow into strong, wary flyers. Most buyers want them at 12 to 16 weeks.</p>
      <p class="flush-s" data-reveal>Typical bobwhite timelines, per ${src('msuInc', 'MSU Extension')}, ${src('ext', 'Extension.org')} and ${src('gundog', 'Gun Dog')}. Call or text to hear where the current birds are.</p>
    </div>
    <div class="flush-stage" aria-hidden="true">
      <svg class="flush-svg flush-d" viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid meet"><defs><mask id="mk-flushD" maskUnits="userSpaceOnUse"><path class="flush-reveal" d="M600 700 C 640 610, 700 560, 800 540 S 980 520, 1060 420 S 1180 220, 1330 170" fill="none" stroke="#fff" stroke-width="14"/></mask></defs><path class="flush-path" id="flushD" d="M600 700 C 640 610, 700 560, 800 540 S 980 520, 1060 420 S 1180 220, 1330 170" fill="none"/><path class="flush-trail" d="M600 700 C 640 610, 700 560, 800 540 S 980 520, 1060 420 S 1180 220, 1330 170" fill="none" mask="url(#mk-flushD)"/></svg>
      <svg class="flush-svg flush-m" viewBox="0 0 400 640" preserveAspectRatio="xMidYMid meet"><defs><mask id="mk-flushM" maskUnits="userSpaceOnUse"><path class="flush-reveal" d="M40 610 C 100 590, 120 520, 190 490 S 320 430, 270 330 S 230 170, 350 70" fill="none" stroke="#fff" stroke-width="14"/></mask></defs><path class="flush-path" id="flushM" d="M40 610 C 100 590, 120 520, 190 490 S 320 430, 270 330 S 230 170, 350 70" fill="none"/><path class="flush-trail" d="M40 610 C 100 590, 120 520, 190 490 S 320 430, 270 330 S 230 170, 350 70" fill="none" mask="url(#mk-flushM)"/></svg>
      <div class="wp" data-wp="0.12"><b>Day 23</b><span>Hatch</span></div>
      <div class="wp" data-wp="0.48"><b>Week 6</b><span>Flight pen</span></div>
      <div class="wp" data-wp="0.86"><b>Weeks 12–16</b><span>Flight ready</span></div>
      <div class="bird" data-bird><svg class="bird-u"><use href="#i-fly-up"/></svg><svg class="bird-d"><use href="#i-fly-dn"/></svg></div>
      ${grassSvg('flush-grass', { w: 1440, h: 140, n: 320, seed: 21, min: .15, max: .95 })}
    </div>
  </div>
</section>

<section class="hatch" data-hatch>
  <div class="hatch-in">
    <div class="hatch-copy">
      ${eb('October 16, 2026')}
      <p class="hatch-n" aria-label="4,300"><span data-count>4,300</span></p>
      <p class="hatch-l">eggs moved to the hatchers in one day.</p>
      <blockquote class="hatch-q" data-reveal>“4,300 eggs just moved to the hatchers today. In a couple of days we will have a ton of little fur babies running around.”</blockquote>
      <a class="lnk" href="${FB}" target="_blank" rel="noopener">See the post on Facebook ${use('i-ext', 'i')}</a>
    </div>
    <div class="hatch-grid"><canvas data-eggs aria-hidden="true"></canvas><p class="hatch-cap">Every dot is one egg, in trays of 100.</p></div>
  </div>
</section>

<section class="uses">
  <div class="sec-h">${eb('Two reasons people call')}<h2 class="h2" data-split>Birds that leave the farm ready to work.</h2></div>
  <div class="uses-g">
    <a class="use" href="birds/#training" data-cursor="Read">
      <div class="use-im" data-wipe>${img(root, 'p-hand-wing', 'A quail held with one wing spread out')}</div>
      <div class="use-b"><svg class="use-ic"><use href="#i-dog"/></svg><h3>Dog training</h3><p>Flight-ready birds for pointing, flushing and retrieving work. Tell them how many you need and when.</p><span class="lnk">Training notes for Indiana ${arr}</span></div>
    </a>
    <a class="use" href="birds/#population" data-cursor="Read">
      <div class="use-im" data-wipe>${img(root, 'p-hand-profile', 'A bobwhite quail held up beside a metal-sided building')}</div>
      <div class="use-b"><svg class="use-ic"><use href="#i-quail"/></svg><h3>Population &amp; release</h3><p>Birds for starting a population on land you manage. Good cover, food and water make the biggest difference.</p><span class="lnk">Release checklist ${arr}</span></div>
    </a>
  </div>
</section>

<section class="sheet">
  <div class="sec-h sec-h-row">${eb('On the farm')}<h2 class="h2" data-split>Hatched, handled, checked.</h2></div>
  <div class="rail" data-rail data-cursor="Drag" tabindex="0" aria-label="Photos from the farm, scroll sideways">
    ${pic(root, 'p-hand-head', 'Close-up of a quail’s head, held in a hand', 'Head check', { fig: 'Fig. 01' })}
    ${pic(root, 'p-trays', 'Blue and red egg trays filled with eggs', 'Setter trays', { fig: 'Fig. 02' })}
    ${pic(root, 'p-hand-wing-2', 'A quail held outdoors with its wing spread', 'Wing check', { fig: 'Fig. 03' })}
    ${pic(root, 'p-hatcher', 'Inside a cabinet incubator with racks of trays', 'Cabinet incubator', { fig: 'Fig. 04' })}
    ${pic(root, 'p-hand-profile', 'A bobwhite quail held upright', 'Ready to go', { fig: 'Fig. 05' })}
    ${pic(root, 'p-egg-flats', 'Egg flats stacked on a table by a window', 'Egg flats', { fig: 'Fig. 06' })}
  </div>
</section>

<section class="talk">
  <div class="sec-h">${eb('No forms, no waiting on an inbox')}<h2 class="h2" data-split>Talk to Ethan or Trevor.</h2></div>
  ${ppl()}
</section>

<section class="cta">
  <svg class="cta-feather" aria-hidden="true"><use href="#i-feather"/></svg>
  <h2 class="cta-h" data-chars>Know how many you need?</h2>
  <p class="cta-p" data-reveal>Pick the use, the count and the timing, and your text to Ethan or Trevor is ready to send.</p>
  <a class="bigbtn" href="contact/" data-magnetic data-cursor="Start"><span>Build an<br>inquiry</span></a>
</section>`;
  return page({ root, path: '', id: 'home', title: 'B & T Quail Farm · Flight ready quail · Putnam County, Indiana', desc: 'Flight ready quail, hatched and raised in Putnam County, Indiana, for dog training and population purposes. Call or text Ethan or Trevor.', body });
}

/* ---------------- BIRDS ---------------- */
function birds() {
  const root = '../';
  const check = (k, t, s, sk) => `<li><label class="ck"><input type="checkbox" data-ck="${k}"><span class="ck-b">${use('i-check', 'i')}</span><span class="ck-t"><b>${t}</b>${s ? `<span>${s}</span>` : ''}</span></label></li>`;
  const body = `
${pageHead({ n: '01', label: 'The birds', title: 'Flight&nbsp;ready <em>birds</em>', lead: 'Bobwhite quail, hatched and raised with care for two jobs: training dogs and starting populations.', aside: `<figure class="oval" data-wipe>${img(root, 'p-hand-head', 'Close-up of a bobwhite quail held in a hand')}</figure>` })}

<section class="pick" data-tabs>
  <div class="pick-bar" role="tablist" aria-label="Choose a use">
    <button role="tab" id="t-training" aria-controls="training" aria-selected="true" class="pick-t" data-tab="training"><svg class="pick-ic"><use href="#i-dog"/></svg><span><small>For</small>Dog training</span></button>
    <button role="tab" id="t-population" aria-controls="population" aria-selected="false" class="pick-t" data-tab="population" tabindex="-1"><svg class="pick-ic"><use href="#i-quail"/></svg><span><small>For</small>Population &amp; release</span></button>
    <span class="pick-ink" aria-hidden="true"></span>
  </div>

  <div class="pick-p" role="tabpanel" id="training" aria-labelledby="t-training">
    <div class="pick-g">
      <div class="pick-copy">
        <h2 class="h3">Perfect for dog training.</h2>
        <p>Pen-raised birds that have been flight conditioned flush hard and fly straight, which is what a young dog needs to learn on and what a finished dog needs to stay sharp. Text the farm with how many birds you want and when you plan to work your dog.</p>
        <ul class="facts">
          <li><b>12–16 weeks</b><span>The age most trainers and preserves buy flight-ready bobwhite. ${src('gundog', 'Gun Dog')}</span></li>
          <li><b>16 weeks</b><span>When bobwhite are considered mature. ${src('msuRaise', 'MSU Extension')}</span></li>
        </ul>
        ${btn('../contact/?use=training', 'Start a training inquiry', 'btn-ink')}
      </div>
      <div class="pick-list">
        <p class="eb">Training on your own ground in Indiana</p>
        <p class="pick-note">Indiana asks for a Dog Training Ground Permit to take pen-raised bobwhite while training. Tick off what you have; your list is saved on this device.</p>
        <ul class="cks" data-cklist="training">
          ${check('t1', 'A Dog Training Ground Permit', 'From Indiana DNR, Division of Fish &amp; Wildlife.')}
          ${check('t2', '5 to 20 contiguous acres', 'Not within one mile of a state public hunting area.')}
          ${check('t3', 'Boundary signs', 'White, at least 16 × 16 in, “dog training ground” in 1 in letters, no more than 500 ft apart.')}
          ${check('t4', 'Leg bands on every bird', 'Metal or plastic, put on before release.')}
          ${check('t5', 'A bill of sale', 'Or a copy of the breeder’s game breeder license, kept with you.')}
          ${check('t6', 'A daily log', 'Trainer name and address, birds released, birds taken.')}
          ${check('t7', 'Train between sunrise and sunset', '')}
        </ul>
        <p class="pick-src">Summary of ${src('dtg', '312 IAC 9-10-16')}. Rules change, so check with Indiana DNR before you train.</p>
      </div>
    </div>
  </div>

  <div class="pick-p" role="tabpanel" id="population" aria-labelledby="t-population" hidden>
    <div class="pick-g">
      <div class="pick-copy">
        <h2 class="h3">Start a population. Enhance your farm.</h2>
        <p>Released birds do best where there is thick cover, food and water close together. Flight-pen birds are usually held in the pen for about a month or more before release so they arrive wary and strong.</p>
        <ul class="facts">
          <li><b>~1 month</b><span>In flight pens before release. ${src('msuRaise', 'MSU Extension')}</span></li>
          <li><b>Habitat</b><span>Native grasses and brushy cover matter most for bobwhite. ${src('nbgiPen', 'NBGI')}</span></li>
        </ul>
        ${btn('../contact/?use=population', 'Start a release inquiry', 'btn-ink')}
      </div>
      <div class="pick-list">
        <p class="eb">Before you release in Indiana</p>
        <p class="pick-note">What Indiana DNR says about holding and releasing bobwhite. Tick off as you go; your list is saved on this device.</p>
        <ul class="cks" data-cklist="population">
          ${check('p1', 'Permission for the land', 'Bobwhite may be released on property where you have permission.')}
          ${check('p2', 'Healthy birds only', 'Sick or diseased birds may not be released.')}
          ${check('p3', 'A game breeder license if you’ll hold birds more than 5 days', '$25 a year to raise, possess or release. Apply within 5 days of getting birds.')}
          ${check('p4', 'Keep your receipt', 'You need documentation for birds you acquire.')}
          ${check('p5', 'Cover, food and water at the release spot', '')}
        </ul>
        <p class="pick-src">From ${src('dnrGB', 'Indiana DNR')} and ${src('gb', '312 IAC 9-10-4')}. Check current rules with Indiana DNR.</p>
      </div>
    </div>
  </div>
</section>

<section class="spec">
  <div class="sec-h">${eb('Field notes')}<h2 class="h2" data-split>What to look for in a bird.</h2></div>
  <div class="spec-g">
    <figure class="spec-plate" data-wipe>${img(root, 'hero-quail-s', 'Illustrated northern bobwhite quail')}<figcaption>Plate · Northern bobwhite</figcaption></figure>
    <ol class="spec-l">
      <li data-reveal><span>01</span><div><h3>Full feathering</h3><p>Good feathering matters for looks and for flying ability. ${src('ext', 'Extension.org')}</p></div></li>
      <li data-reveal><span>02</span><div><h3>Wary of people</h3><p>Birds raised away from people, pets and traffic respond to an approaching dog like wild birds do. ${src('ext', 'Extension.org')}</p></div></li>
      <li data-reveal><span>03</span><div><h3>Strong on the wing</h3><p>Flight pens let birds build the muscle for a fast covey rise. ${src('msuRaise', 'MSU Extension')}</p></div></li>
    </ol>
  </div>
</section>

<section class="cta cta-s">
  <h2 class="cta-h" data-chars>Not sure which you need?</h2>
  <p class="cta-p" data-reveal>Pick “not sure yet” in the inquiry and ask. Ethan and Trevor can talk it through.</p>
  <a class="bigbtn" href="../contact/" data-magnetic data-cursor="Start"><span>Build an<br>inquiry</span></a>
</section>`;
  return page({ root, path: 'birds/', id: 'birds', title: 'Birds · B & T Quail Farm', desc: 'Flight ready bobwhite quail for dog training or population release, with Indiana permit checklists.', body });
}

/* ---------------- ABOUT ---------------- */
function about() {
  const root = '../';
  const body = `
${pageHead({ n: '02', label: 'About', title: 'Ethan <em>&amp;</em> Trevor', lead: 'B &amp; T Quail Farm hatches and raises flight-ready quail in Putnam County, Indiana. Established 2026.' })}

<section class="ab">
  <div class="ab-badge" data-spin aria-hidden="true"><svg><use href="#badge"/></svg></div>
  <div class="ab-copy">
    <p class="ab-big" data-fill>Two phone numbers, one farm, and a page that has grown to 56,000 followers. Ask either of them about birds, timing and pickup.</p>
  </div>
</section>

<section class="nums">
  <div class="num" data-reveal><span class="num-v" data-to="56" data-suf="K">56K</span><span class="num-l">Facebook followers</span></div>
  <div class="num" data-reveal><span class="num-v" data-to="4300" data-sep>4,300</span><span class="num-l">eggs to the hatchers on Oct 16, 2026</span></div>
  <div class="num" data-reveal><span class="num-v">2026</span><span class="num-l">established</span></div>
  <div class="num" data-reveal><span class="num-v" data-to="2">2</span><span class="num-l">people to call or text</span></div>
</section>

<section class="vals">
  <div class="sec-h">${eb('On the seal')}<h2 class="h2" data-split>Healthy birds. Strong starts.</h2></div>
  <ol class="vals-l">
    <li data-reveal><span class="vals-n">I</span><h3>Healthy birds</h3><p>Healthy stock from the egg up. Indiana allows only healthy bobwhite to be released.</p></li>
    <li data-reveal><span class="vals-n">II</span><h3>Raised with care</h3><p>Hatched and raised with the utmost care, from setter trays to the flight pen.</p></li>
    <li data-reveal><span class="vals-n">III</span><h3>Strong starts</h3><p>Setter trays, a cabinet incubator and hatchers on site, and birds raised to be flight ready.</p></li>
  </ol>
</section>

<section class="thanks">
  ${pic(root, 'c-thanks-50k', 'The farm’s thank-you graphic for 50,000 Facebook followers', 'Thank you for 50,000 followers', { cls: 'thanks-p' })}
  <div class="thanks-t">${eb('Seen around')}<h2 class="h3">Listed with Indiana game bird sources.</h2><p>Crooked Creek Gun Club lists B&amp;T Quail Farm under “Places for game birds” on its news page.</p>${src('ccgc', 'See the list')}</div>
</section>

<section class="pair">
  ${pic(root, 'c-trays', 'Blue and red setter trays full of eggs', 'Setter trays', { cls: 'pair-a' })}
  <div class="pair-t"><h2 class="h2" data-split>Raised with <em>the utmost care.</em></h2><p data-reveal>Every stage is something you can ask about when you call: how old the birds are, how long they have been in the flight pen, and when the next group is ready.</p>${btn('../contact/', 'Ask about the next group', 'btn-ink')}</div>
  ${pic(root, 'c-hatcher', 'Inside a cabinet incubator with racks of trays', 'Cabinet incubator', { cls: 'pair-b' })}
</section>

<section class="talk">
  <div class="sec-h">${eb('Call or text for more details')}<h2 class="h2" data-split>Pick a name and reach out.</h2></div>
  ${ppl()}
</section>`;
  return page({ root, path: 'about/', id: 'about', title: 'About · B & T Quail Farm', desc: 'B & T Quail Farm, Putnam County, Indiana. Est. 2026. Call or text Ethan or Trevor.', body });
}

/* ---------------- CONTACT ---------------- */
const FAQ = [
  ['How much are the birds?', 'Call or text for current pricing. Let Ethan or Trevor know how many birds you need and when.'],
  ['Are birds available right now?', 'Call or text for current availability. On Oct 16, 2026, 4,300 eggs moved to the hatchers, so ask what is ready now and what is coming.'],
  ['What kind of quail are they?', 'Bobwhite quail. Call or text with any questions about the birds.'],
  ['What does “flight ready” mean?', `Birds that have spent time in flight pens building strength, usually 12 to 16 weeks old. ${src('gundog', 'Gun Dog')} · ${src('ext', 'Extension.org')}`],
  ['Where is the farm?', 'Putnam County, Indiana. Call or text to set up a pickup time.'],
  ['Do I need a permit to train dogs on these birds in Indiana?', `To take pen-raised bobwhite while training on your own ground, Indiana requires a Dog Training Ground Permit, with banded birds and a bill of sale. ${src('dtg', '312 IAC 9-10-16')}`],
  ['Can I release quail on my land?', `Indiana allows release of healthy bobwhite on property where you have permission. Holding birds more than five days needs a game breeder license. ${src('dnrGB', 'Indiana DNR')}`],
];
export const faq = (list) => `<div class="faq">${list.map(([q, a], i) => `<details class="fq"${i === 0 ? ' open' : ''}><summary><span>${q}</span><span class="fq-i" aria-hidden="true">${use('i-plus', 'i')}</span></summary><div class="fq-a"><p>${a}</p></div></details>`).join('')}</div>`;
function contact() {
  const root = '../';
  const chips = (name, opts, def) => opts.map(([v, t]) => `<label class="opt"><input type="radio" name="${name}" value="${v}"${v === def ? ' checked' : ''}><span>${t}</span></label>`).join('');
  const months = (() => { const out = []; const d = new Date(2026, 10, 1); for (let i = 0; i < 12; i++) { const m = new Date(d.getFullYear(), d.getMonth() + i, 1); out.push(m.toLocaleString('en-US', { month: 'long', year: 'numeric' })); } return out; })();
  const body = `
${pageHead({ n: '03', label: 'Contact', title: 'Bird <em>inquiry</em>', lead: 'Answer a few questions and your text to Ethan or Trevor is ready to send.' })}

<section class="iq" data-iq>
  <form class="iq-f" data-iq-form novalidate>
    <fieldset class="iq-s"><legend><span>01</span>What are the birds for?</legend>
      <div class="opts opts-big">${chips('use', [['training', `${use('i-dog', 'opt-ic')}Dog training`], ['population', `${use('i-quail', 'opt-ic')}Population or release`], ['unsure', `<span class="opt-q" aria-hidden="true">?</span>Not sure yet`]], 'training')}</div>
    </fieldset>
    <fieldset class="iq-s"><legend><span>02</span>About how many?</legend>
      <div class="qty">
        <button type="button" class="qty-b" data-qty="-1" aria-label="Fewer">${use('i-minus', 'i')}</button>
        <label class="qty-v"><span class="sr">Number of birds</span><input type="number" inputmode="numeric" min="1" max="5000" value="25" data-qty-in></label>
        <button type="button" class="qty-b" data-qty="1" aria-label="More">${use('i-plus', 'i')}</button>
        <span class="qty-u">birds</span>
      </div>
      <div class="opts opts-sm">${[10, 25, 50, 100, 250].map(n => `<button type="button" class="opt-q2" data-qset="${n}">${n}</button>`).join('')}<label class="opt opt-inline"><input type="checkbox" data-qty-unsure><span>Not sure</span></label></div>
    </fieldset>
    <fieldset class="iq-s"><legend><span>03</span>When do you need them?</legend>
      <div class="opts">${chips('when', [['asap', 'As soon as possible'], ['month', 'In a certain month'], ['asking', 'Just asking for now']], 'asap')}</div>
      <label class="fld fld-month" data-month hidden><span class="fld-l">Month</span><select data-month-sel>${months.map(m => `<option>${m}</option>`).join('')}</select></label>
    </fieldset>
    <fieldset class="iq-s"><legend><span>04</span>Pickup</legend>
      <div class="opts">${chips('pickup', [['pickup', 'I can pick up in Putnam County'], ['ask', 'I’d like to ask about options']], 'pickup')}</div>
    </fieldset>
    <fieldset class="iq-s"><legend><span>05</span>About you</legend>
      <div class="flds">
        <label class="fld"><span class="fld-l">Your name</span><input type="text" autocomplete="name" data-f="name" placeholder="First and last"></label>
        <label class="fld"><span class="fld-l">Town or county</span><input type="text" autocomplete="address-level2" data-f="town" placeholder="e.g. Greencastle"></label>
        <label class="fld fld-w"><span class="fld-l">Anything else <small>(optional)</small></span><textarea rows="3" data-f="notes" placeholder="Dog’s age, breed, how often you train…"></textarea></label>
      </div>
    </fieldset>
  </form>

  <aside class="iq-out" aria-label="Your message">
    <div class="note">
      <div class="note-h"><span class="eb">Your text</span>
        <div class="who" role="radiogroup" aria-label="Send to">${PEOPLE.map((p, i) => `<label class="who-o"><input type="radio" name="who" value="${p.id}"${i === 0 ? ' checked' : ''}><span>${p.name}</span></label>`).join('')}</div>
      </div>
      <p class="note-to">To <b data-to-n>Ethan</b> · <span data-to-p>${ETHAN.phone}</span></p>
      <p class="note-b" data-msg aria-live="polite"></p>
      <div class="note-a">
        <a class="btn btn-ink" href="${smsHref(ETHAN)}" data-sms data-magnetic><span class="btn-t" data-roll>Text <span data-to-n>Ethan</span></span><span class="btn-o" aria-hidden="true">${use('i-sms', 'i')}</span></a>
        <a class="btn btn-line" href="${telHref(ETHAN)}" data-tel data-magnetic><span class="btn-t" data-roll>Call instead</span><span class="btn-o" aria-hidden="true">${use('i-phone', 'i')}</span></a>
        <button class="btn-txt" type="button" data-copy>${use('i-copy', 'i')}<span data-copy-t>Copy text</span></button>
      </div>
    </div>
  </aside>
</section>

<section class="faqs">
  <div class="sec-h">${eb('Questions')}<h2 class="h2" data-split>Before you text.</h2></div>
  ${faq(FAQ)}
</section>

<section class="talk talk-s">
  <div class="sec-h">${eb('Rather just call?')}<h2 class="h2" data-split>Straight to the farm.</h2></div>
  ${ppl()}
</section>`;
  return page({ root, path: 'contact/', id: 'contact', title: 'Bird inquiry · B & T Quail Farm', desc: 'Build a text to Ethan or Trevor at B & T Quail Farm: use, number of birds, timing and pickup.', body });
}

/* ---------------- 404 ---------------- */
function notFound() {
  const root = '/bt-quail-farm/';
  const body = `<section class="nf">
  <div class="nf-bird" aria-hidden="true"><svg class="bird-u"><use href="#i-fly-up"/></svg><svg class="bird-d"><use href="#i-fly-dn"/></svg></div>
  <p class="eb">404 · page not found</p>
  <h1 class="nf-h" data-chars>This one <em>flushed.</em></h1>
  <p class="nf-p">The page you were after isn’t here. Head back to the farm or start an inquiry.</p>
  <div class="nf-a">${btn(root, 'Back to the farm', 'btn-ink')}${btn(root + 'contact/', 'Bird inquiry', 'btn-line')}</div>
  ${grassSvg('nf-grass', { w: 1440, h: 160, n: 300, seed: 33, min: .15 })}
</section>`;
  return page({ root, path: '404.html', id: 'nf', title: 'Page not found · B & T Quail Farm', desc: 'This page flushed.', body });
}

export const PAGES = { 'index.html': home, 'birds/index.html': birds, 'about/index.html': about, 'contact/index.html': contact, '404.html': notFound };
