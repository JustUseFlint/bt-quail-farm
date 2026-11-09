# B & T Quail Farm: concept site

A concept website for **B & T Quail Farm** (Putnam County, Indiana). It's a static multi-page site built with vanilla HTML, CSS and JS. GSAP (ScrollTrigger, SplitText, MotionPath, DrawSVG) and Lenis are vendored in `assets/vendor/`, so there is no build step for hosting.

Live: https://justuseflint.github.io/bt-quail-farm/

## Pages
- `/`: hero built from the farm's cover art, the farm's intro in its own words, a scroll-drawn flight path (hatch → flight pen → flight ready), a 4,300-egg counter tied to the Oct 16, 2026 post, the two uses, a photo contact sheet, and Ethan & Trevor
- `/birds/`: switch between dog training and population/release, with Indiana rule checklists (saved on the device) and field notes
- `/process/`: a hatchery-to-field timeline (pinned and horizontal on desktop) and a bird age calculator
- `/gallery/`: filters, a field-print/original-color toggle, and a lightbox
- `/about/`: Ethan & Trevor, the badge, the numbers, and what the seal says
- `/contact/`: an inquiry builder that writes an SMS to Ethan or Trevor (sms:/tel: links; the site sends nothing), plus an FAQ
- `/404.html`

## Facts used (all from public sources, checked Nov 9, 2026)
- From the Facebook page: the name, the intro text (verbatim), Ethan 765-720-4896, Trevor 765-246-1964, Putnam County IN, 56K followers, the Oct 16, 2026 post about 4,300 eggs, and the logo and cover wording.
- The Crooked Creek Gun Club "Places for game birds" list mentions B&T Quail Farm.
- General bobwhite and Indiana DNR information is cited inline. See `research-notes.md`.
- Nothing has been invented: there are no prices, reviews, addresses, surnames, hours or license claims.

## Images
- All photos come from the farm's public Facebook page. The thumbnails were only about 106 px, so they were upscaled 4× with OpenCV EDSR super-resolution and shown at small sizes, either as a sepia "field print" (tritone with grain) or in warm original color.
- The hero panorama uses the bird from the farm's cover art. The cover's own blurred field background was extended to the left so live text can sit where the cover lettering was.
- The badge logo is a vector redraw of the Facebook profile badge: an engraved quail vectorized from the cover art, with "B&T / QUAIL FARM / EST 2026" set in type. The dog and standing-quail icons were vectorized from the cover's bottom band.
- The flying-quail silhouette is a hand-drawn SVG.
- **No AI-generated images were added.** (The farm's own cover art may itself be generated; it is used as their branding.)

## Owner to confirm
- Prices, availability, minimum order, pickup location and times, delivery, payment
- Species and varieties (the photos show bobwhite), banding, and game breeder license status
- The Crooked Creek list shows 765-**846**-1964 for the second number, but Facebook shows 765-**246**-1964
- Permission to use the photos and artwork, and an original logo file

Concept site · details checked Nov 9, 2026
