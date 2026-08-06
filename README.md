# DMG homepage — directional prototype

A single-page prototype of the District Management Group homepage, built to test a
new look and feel with stakeholders before a freelance designer ports it into
Webflow. Vanilla HTML, CSS, and JavaScript. No build step, no framework, no npm.

---

## How to run it

Any static file server works. From inside this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

The machine this was built on had no Python installed, so there is also a
zero-dependency PowerShell server in this folder. On Windows:

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
```

Then open `http://localhost:8130`. Pass `-Port 9000` to change the port.

**Do not open `index.html` by double-clicking it.** Over `file://` the browser
blocks the video and the page loses the hero. Use a server.

---

## The three files

| File | What it holds |
|---|---|
| `index.html` | All markup. Section order matches the page top to bottom, each with a comment banner. |
| `styles.css` | All styling. Every token is declared once in `:root`; nothing below that block hard-codes a color or a pixel value. |
| `main.js` | Nav scroll state, dropdowns, hero rotator, count-ups, accordion, testimonials, scroll reveals. Every animated behavior is gated on `prefers-reduced-motion`. |

---

## Where each asset lives

```
assets/
  video/
    hero.mp4                        supplied (8.4 MB, see "Video" below)
    hero-poster.jpg                 MISSING — see below
  img/
    approach-summit.jpg             supplied, 880x1100 portrait
    trio-working-session.jpg        supplied, cropped 3:4
    trio-students.jpg               supplied, cropped 3:4
    trio-software.jpg               supplied, cropped 3:4
    logos/                          42 district logos, normalized to 180px tall
      _manifest.json                slug / display name / width for each logo
      suffern-central.webp          kept from the first batch (not in the new set)
    headshots/
      erik-gundersen.png            supplied, already background-free, 900x900
      mark-sullivan.png             supplied, already background-free, 900x900
  brand/
    dmg-logo-white.png              supplied, 1844x333, white on transparent
    dmg-logo-stacked.svg            PLACEHOLDER mark, used as the favicon
```

All photography is now real. The only remaining placeholder is the favicon mark.

**One asset, two colorways.** `dmg-logo-white.png` is white artwork on a real
alpha channel, so it is used directly over the hero video and re-tinted to Dark
Blue via a CSS `mask` for the scrolled nav and the footer. There is no separate
dark logo file to keep in sync. If you replace it, keep the transparency.

**Headshots were already cut out** when supplied (47% and 56% transparent), which
is what makes the new testimonial treatment possible. They are PNG, not JPG, and
must stay PNG: a JPG would flatten the transparency onto white.

### Missing assets

1. **`assets/video/hero-poster.jpg`** — still not supplied, and the only 404 on
   the page. Nothing breaks: the hero has a Dark Blue ground underneath, so
   there is no flash and no layout shift, and the video fades up over it.
   Extract it with the command under "Video" below and it is picked up
   automatically.
2. **A stacked logo for the favicon.** Currently a placeholder mark.
3. **Two district logo files are named ambiguously**: `lc.png` and `nf.png`,
   from `LC Logo.png` and `NF Logo.png`. Their alt text is currently just "LC"
   and "NF", which a screen reader will read as initials. `NF` is very likely
   New Fairfield (CT) and `LC` is unclear. Send the real district names and the
   alt text can be fixed. `utica.png` is also ambiguous between the city school
   district and the community school district.

---

## How to swap an asset

**The Summit photo.** Overwrite `assets/img/approach-summit.jpg`. The container
is **height-capped** rather than locked to an aspect ratio (`--approach-photo-h`)
because the supplied photo is portrait, so any orientation will crop sensibly
via `object-fit: cover`. Adjust `object-position` if the crop misses the subject.

**A hero trio photo.** Overwrite the file in `assets/img/`. All three are
cropped to **3:4 portrait**; the CSS sets `aspect-ratio: 3 / 4`, so a 3:4 image
needs no CSS change. The three source photos had very different native shapes
(6048x4024 landscape, 3840x5760 portrait, 1200x800 landscape) and were
center-cropped with a slight upward bias to keep faces in frame.

**The brand logo.** Overwrite `assets/brand/dmg-logo-white.png`, keeping white
artwork on transparency. It drives both the reversed nav logo and, through a
CSS mask, the Dark Blue version in the scrolled nav and footer. Sizes come from
`--logo-h` and `--logo-h-footer`; `--logo-ratio` must match the file's own
aspect ratio.

**A district logo.** Add the file to `assets/img/logos/` and add one
`<li class="mlogo">` to *both* marquee tracks. The second track is the duplicate
that makes the loop seamless and is `aria-hidden="true"`, so its copies must
carry `alt=""`. Keep the `width` and `height` attributes on every logo `<img>`:
they are load-bearing. Without them a lazy-loaded image has no intrinsic size,
`width: auto` collapses to zero, and the logo disappears entirely. `_manifest.json`
lists every slug, display name, and width if you need to regenerate the markup.

**A headshot.** Replace the PNG in `assets/img/headshots/`, keeping the
transparent background and roughly square framing. The image is laid out with
`object-fit: contain` bottom-aligned over the Light Blue backdrop, so a cut-out
of any height sits correctly. If a headshot or district logo is ever missing,
use the `.monogram` class already in the stylesheet to render a neutral Pale Blue
initials block at the correct dimensions instead of a broken image.

---

## Video

The supplied `hero.mp4` is **8.4 MB**, slightly over the 8 MB target. It plays
fine and nothing is broken; first load is just a little slow on a weak
connection. To compress it and strip any audio track:

```bash
ffmpeg -i hero.mp4 -an -c:v libx264 -crf 28 -preset slow -vf "scale=1920:-2" -movflags +faststart hero-compressed.mp4
```

To extract the missing poster frame:

```bash
ffmpeg -i hero.mp4 -frames:v 1 -q:v 3 hero-poster.jpg
```

`ffmpeg` was not installed on the build machine, so neither command has been run.

---

## Type scale: every intentional departure from the print style guide

The print style guide is a **document** scale, topping out at H1 = 32px. That is
correct for a printed journal and far too quiet for a web hero. The scale below
keeps the style guide's **weights exactly** and scales the **sizes** up for
screen. Nunito Sans throughout, no second family.

| Role | Print guide | Used here | Why |
|---|---|---|---|
| Hero H1 | 32px, 800 | `clamp(2.5rem, 6.4vw, 6rem)`, 800, line-height 0.98, tracking −0.02em, `white-space: nowrap` | Up to 96px. This is the single biggest departure and the main answer to "nothing pops." Weight unchanged. The `6.4vw` is tuned so "Supporting K-12 districts" holds **one line** at every width down to 704px, where it is allowed to wrap at a smaller size. |
| Accordion blurb | not in guide | `clamp(1.25rem, 1.9vw, 1.6rem)`, 600 | New. Row photos were removed, so the blurb is the focal point of an open row and is set well above body size. |
| Section H2 | 24px, 800 | `clamp(2rem, 3.5vw, 3rem)`, 800, line-height 1.05 | Up to 48px so section starts are legible without a label. Weight unchanged. |
| H3 / accordion row | 20px, 700 | `clamp(1.35rem, 2vw, 1.85rem)`, 700 | Up to ~30px. Weight unchanged. |
| Accordion row, open | not in guide | `clamp(1.6rem, 2.4vw, 2.2rem)`, **800** | New state. An open row steps up in both size and weight so the open row is unmistakable. This is the fix for "product, product, product, it's all blurring together." |
| H4 | 17px, 600 | `1.0625rem`, 600 | Unchanged. |
| Body | 17px, 400 | `1.0625rem`, 400, line-height 1.6, max 62ch | Size unchanged. Leading is generous and the measure is capped at 62ch. |
| Body small | 14px, 400 | `0.875rem`, 400 | Unchanged. |
| Label / eyebrow | 12px, 700 | `0.75rem`, 700, uppercase, tracking 0.12em | Unchanged. The only letterspaced text on the page. |
| Stat numeral | not in guide | `clamp(3rem, 7vw, 5.5rem)`, 800, tabular-nums | New. Up to 88px. The review decided the number itself should be the thing that pops, so the old icons were removed. |
| Stat numeral, spelled | not in guide | `clamp(1.75rem, 4vw, 3.25rem)`, 800, tabular-nums | New. `1,000s` and `1,000,000s` are much longer strings than `34`, so they take their own step (52px against 88px) to fit five columns without wrapping. |
| Pull quote | not in guide | `clamp(1.5rem, 2.6vw, 2.25rem)`, 400, line-height 1.3 | New. The quote is the hero of the testimonial section, not a small italic line. |
| Accordion preview | not in guide | `0.9375rem`, 400, 78% opacity | New. 15px sits deliberately between body and body-small so a closed row reads as subordinate. |
| Accordion program links | not in guide | `clamp(1.0625rem, 1.35vw, 1.3rem)`, 700 | New. Raised to ~19px so the program names carry weight, sitting clearly below the 26px blurb but well above body-small. |
| Hero jump links | not in guide | `clamp(1rem, 1.15vw, 1.125rem)`, 700 | New. Raised from 14px. Carries a resting 1px underline and a `arrow_downward` icon so it reads as an in-page jump link rather than decoration. |
| Value title | 20px, 700 | `clamp(1.35rem, 1.9vw, 1.75rem)`, **800** | Up to 28px, and the weight steps from 700 to 800. The values row is now a composition of four numbered columns rather than four cards, so the titles carry it. |
| Value index numeral | not in guide | `clamp(2.5rem, 3.4vw, 3.5rem)`, 800, Light Blue at 28% | New. Ghosted `01`–`04` give the row rhythm without adding another colour. |

Two rules hold the whole system together: **tight leading on display type,
generous leading on body type**, and **no letterspacing on body copy** ever.
That contrast is a large part of how "warm gravitas" is built.

---

## Build notes for the stakeholder review

### Measured contrast, not estimated

Every ratio below was measured in-browser by sampling twelve frames across the
hero video, compositing the actual tint stack over the brightest pixels in the
region where type sits, and computing WCAG contrast.

- **White H1 over the hero video: 5.29:1** (passes AA for both large and small text).
  The brief specified a tint of "roughly 0.72." At 0.72 the measured worst case
  was **4.21:1, which fails**. The tint is therefore **0.82** with the
  bottom-left gradient at 0.60. Tokens: `--hero-tint`, `--hero-shade`.
- **Hero quick-link row: 4.82:1.** The brief asked for these in Light Blue.
  Light Blue cannot clear 4.5:1 over this video at any usable lightness — mixed
  70% toward white it still measured only 4.12:1. The row is therefore **Pale
  Blue**, which measures 4.82:1 and stays in the blue family. Light Blue still
  arrives on this row as the hover rule, so the motif is intact. **This is a
  deliberate departure from the brief and worth a look.**
- **Accordion row preview: 5.29:1.** White at 78% opacity. Note for whoever
  ports this: do *not* also alpha the text color. Doing both multiplies to an
  effective 61% and drops to 3.84:1, which fails.
- **Orange CTA buttons: 5.37:1**, using `--dmg-ink` labels. White on this orange
  fails, so the labels are ink.
- **White type on the closing CTA's background photo: 5.68:1.** The photo is
  tinted with `--cta-tint` at 0.86 plus a gradient; measured against the
  brightest region of the actual image, not estimated.
- Everything on the light grounds measures between 5.5:1 and 15.8:1.

### Palette discipline, and where it was deliberately relaxed

Grounds alternate white → Pale Blue → Dark Blue → white so that every section
boundary is legible without a label, and the page is never one continuous field
of Dark Blue. Light Blue appears only as the measuring rule, emphasis marks,
active states, and hover rules — never as a fill behind text. There is no Yellow
on the page and no floating decorative shape of any kind.

**The original two-appearance cap on warm accents no longer holds, by decision.**
Orange now appears on the two CTAs (`Contact Us`, `Let's Connect`) *and* as the
large quotation marks framing each testimonial, which is four visible
appearances rather than two. This was an explicit direction, not drift. Worth
knowing before the review, because the "one pop of color" argument gets harder
to make with orange in four places alongside Light Blue. If it reads as too
warm, the quote marks are one CSS rule (`.t-mark { color: … }`).

Measured: the orange quote marks sit at **2.68:1** against the Pale Blue ground.
That is not an accessibility failure — they are `aria-hidden` decoration, and no
WCAG contrast rule applies to them — but it is softer than orange on white would
be. At 128px they read clearly; if you want them harder, the section ground would
need to go white.

### The signature motif: a measuring rule

One idea, four appearances, no other decoration:

1. Under the hero's rotating phrase, re-measuring its width as each phrase swaps.
2. Under each stat numeral, drawing in as the number counts up.
3. As the left rule on an open accordion row, growing from zero height.
4. Under the active testimonial's name.

The rule carries small perpendicular end ticks, like the ends of a dimension
line in an architectural drawing. Without them it is a generic underline that
every SaaS site has; with them it reads unmistakably as *measuring*, which is
DMG's actual argument — DMG measures what other firms assert. The ticks are a
one-line revert if they read as fussy: add `class="no-ticks"` to the `<html>`
tag and they disappear everywhere at once.

### The rotator has a static twin, on purpose

The CEO does not trust carousels because they assume the reader waits. So the
five focus areas appear **twice** in the hero: once in the rotating phrase, and
once as a static row of links directly beneath it. The rotator is atmosphere and
is marked `aria-hidden="true"`. The static row is the real navigation — each
link opens its matching accordion row and scrolls to it. Nothing in the hero is
reachable *only* by waiting. The rotator also pauses on hover and on focus, and
under reduced motion it does not run at all, which is exactly why the static row
has to exist.

### The accordion, rebuilt

The feedback was that this section read as boring and as one giant blue backdrop.
Four changes, none of them decorative for its own sake:

1. **Row photos are gone entirely.** They were stock filler and they split the
   reader's attention. The problem statement is now the focal point of an open
   row, set at up to 26px / weight 600 in a two-column panel (blurb, then the
   success-story card).
2. **Key phrases animate.** When a row opens, Light Blue underlines draw
   left-to-right across the phrases that carry the argument, staggered 140ms
   apart. One phrase per row gets a drawn **ellipse** instead of an underline
   (`at what cost`, `8 to 10 weeks`) — an SVG stroke animated by
   `stroke-dashoffset`, using `pathLength="100"` so the dash math stays correct
   even though the ellipse is stretched to fit the text box. This is the same
   Light Blue measuring language as the rest of the page, not a highlighter
   effect, and it is geometric rather than hand-drawn so it does not read as
   playful.
3. **Card stats count up** exactly like the stat bar — 73,000 with comma
   formatting, 43%, 56% — firing when the row opens, once. Row 1 is open on load,
   so its count is deferred until the row actually scrolls into view rather than
   animating unseen.
4. **The flat blue field is broken up** by the arc texture at 5–10% opacity and
   by a very slight white wash (`--open-row-wash`) behind any open row, so open
   rows read as lifted rather than as more blue.

### Things fixed that were visibly wrong

- **The faint square outline around every district logo is gone.** The cause was
  the marquee's Dark Blue duotone: it put a coloured box behind each logo and
  blended the artwork over it, and the logos' near-white backgrounds let that box
  show through as a rectangle. The tint is now done with
  `filter: grayscale(1)` plus `mix-blend-mode: multiply`, which makes a white logo
  background disappear into the white page ground. No box, and it works whether a
  logo has transparency or not. The marquee also has a soft mask at each edge so
  logos enter and leave rather than being chopped.
- **The testimonial disc sits behind the head now.** The photo box was 4:5 while
  the headshots and the backdrop viewBox are both square, so the disc floated
  above the head. The box is 1:1 throughout; the disc centre lands at about 38%
  of the image height, behind the head and shoulders.
- **The testimonial district logos no longer show a white box.** Same `multiply`
  trick against the Pale Blue ground, so no asset editing was needed and it will
  keep working if transparent versions arrive.
- **Testimonial logos sit in a fixed box** (`--t-logo-w` x `--t-logo-h`, 190x76)
  with `object-fit: contain`. Without a fixed *width*, Birmingham's logo (920x180)
  rendered vastly wider than Suffern's (368x175) at the same height. Any future
  logo of any aspect ratio now occupies the same footprint.
- **The name outranks the title.** Name is 800 weight at up to 26px; the title and
  district line dropped to 14px regular grey. It was the other way round before.
- **The backdrop disc is larger than the headshot and offset up and to the right**,
  so it reads as a section graphic rather than a halo pinned to one head. Two
  gotchas were involved: the base `svg { max-width: 100% }` rule silently clamped
  the disc to the photo's width, and anchoring the oversized box from its right
  edge dragged the disc leftward as it grew. It is now centred on the photo and
  nudged with a transform. The solid disc is kept clear of the quote column (17px
  to 37px depending on width) because dark blue bold text on Light Blue only
  measures 3.29:1; the thin rings do sweep behind the text, which is intentional
  and has no meaningful effect on legibility.
- **The headshot frame is a fixed 1:1 box, and its bottom lands on the last line
  of the quote** — not on the bottom of the whole text column, which is a
  different line and was the earlier mistake. The mechanism: the testimonial is a
  two-row grid with the quote in row 1 and the attribution in row 2, so **row 1's
  bottom edge IS the quote's last line**. The photo lives in a `.t-photo-cell`
  that holds it absolutely positioned, which keeps the photo out of the row-height
  calculation — row 1 is sized by the quote alone, the photo's bottom lands on it,
  and the name, title and logo continue below the photo. Verified against the real
  last-line position using `Range.getClientRects()`, not the block box: photo
  bottom and last-line bottom match exactly at 1024, 1280, 1440 and 1700px.
  The `figcaption` also moved to being a direct child of `<figure>`, which it
  should have been all along.
- **The photo is sized `min(row height, column width)`, not just column width.**
  The row's height comes from the quote, whose height changes with the fluid quote
  font, while the column width barely changes. So at some widths a width-driven
  square was *taller* than the quote, overflowed upward out of its row, and dragged
  the backdrop disc up over the section heading. Capping to the row height keeps
  the artwork below the heading at every width. `object-position: bottom` on the
  image keeps the subject's feet on the row's bottom edge when the box is not
  perfectly square.
- **The text group and the artwork are positioned independently.** The quote marks,
  quote and attribution sit tight under the heading — the *visible top* of the
  opening quote mark lines up with the *visible bottom* of the "Testimonials"
  glyphs. Box edges are not sufficient for that: the mark's `line-height: 0.5`
  lets its glyph overflow about 0.382em above its own box, and the heading's
  descenders fall about 0.167em below its box, so `--t-heading-lead` is built from
  both terms against the live font sizes. Verified to 0–1px at 900, 1024, 1280,
  1440 and 1700px using `Range.getClientRects()`.
  `--t-photo-offset` then pushes the headshot and disc back down by exactly the
  amount the text was raised, so moving the words does not drag the artwork.
  Two implementation traps, both of which silently did nothing:
  `calc(-1 * var(--x))` where `--x` is itself a `calc()` is dropped as invalid, so
  the offset is stored as a negative length and used directly; and the override
  lives in a media query *above* the base `.t-photo` rule, so it needs two class
  selectors (`.testimonial .t-photo`) to win the cascade rather than relying on
  order.
- **The section heading sits in front of the artwork** (`position: relative;
  z-index: 3`), and the disc's top edge clears it by 18–56px at every width. Verified no overlap at 900, 1024, 1150, 1280, 1440 and 1700px, with
  the z-index as a second line of defence. Ink on Light Blue is 6.88:1, so even if
  a future change lets them cross, the words stay legible.
- **`.partners` is `overflow: hidden`** so the oversized backdrop cannot push the
  page into horizontal scroll at phone widths.
- **The prev/next/dot controls were completely unclickable.** The oversized
  backdrop SVG is a positioned element with `z-index: 0`, and a positioned element
  paints above statically positioned content that comes *later* in the DOM. Its
  box overlapped the controls and swallowed every click. Confirmed by hit-testing
  with `elementFromPoint`: before the fix the next arrow reported "blocked by"
  the SVG; after it, all four controls are the topmost element at their own
  centre. Fixed twice over: `pointer-events: none` on the decorative backdrop, and
  `position: relative; z-index: 2` on `.t-controls`. **If you add any oversized
  decorative artwork near an interactive control, check it with `elementFromPoint`
  — it will look fine and silently eat clicks.**
- **The attribution sat far below the quote.** The closing quote mark was in
  normal flow and, at 128px with a 0.6 line-height, contributed about 77px of
  height between the quote and the name. It is now absolutely positioned inside a
  `.t-quote-block` wrapper, so the name, title and logo sit directly under the
  quote. Measured gap dropped from about 101px to 24px.
- **The logo needed `object-position: left bottom`.** Inside its fixed box a wide
  logo letterboxes, so with centre alignment its visible edge floated ~20px above
  the box bottom and the headshot looked misaligned against it even though the
  boxes were flush.
- **The Summit photo is the new, less yellow file**, re-cropped to 820x1100.

### Two treatments to choose between

- **Logo marquee.** Currently showing the **normalized** treatment: every logo
  reduced to a single Dark Blue tint at 70%, going full color on hover. This is
  the more Bain-like of the two. To see full color instead, delete
  `marquee--tinted` from the `<section class="logo-marquee …">` tag. Speed is one
  token, `--marquee-duration` (currently 160s); raise it to slow the drift further.
  Implementation note: the supplied logos are opaque with white backgrounds and
  **no usable alpha**, so the tint could not be done with a mask. It is a blend
  duotone instead — a Dark Blue ground with the grayscaled logo in `lighten`
  mode. This works on opaque and transparent art alike. All 42 districts are in
  the loop now, at 76px tall, with no repeats.
- **Hero trio.** The HBS-style cluster is **on**. To see the hero without it,
  delete `hero--trio` from the `<section class="hero hero--trio" …>` tag; a
  sibling selector hides the band automatically. Hidden below 1152px, where it
  would crowd the type.

### The faint square around the logos, twice

Worth recording because it came back after the first fix. Two separate causes:

1. **The Dark Blue tint box.** The tint works by putting a Dark Blue ground under
   each logo and blending the grayscaled artwork over it in `lighten` mode. Any
   pixel in the logo that was *semi*-transparent let that ground bleed through as
   a blue rectangle. Fixed by flattening all 42 logo files onto opaque white.
2. **Off-white logo backgrounds.** Even flattened, the source art carried
   backgrounds at 254,254,254 rather than pure white, which reads as a faint box
   against the white page, and it showed most on hover where the tint is removed.
   Fixed by thresholding every near-white pixel (min channel ≥ 246) to pure
   #FFFFFF. All 42 files needed it.

**If the box ever returns after swapping in new logos**, the new file either has a
transparent/semi-transparent background or an off-white one. Flatten it onto
white and force the background to pure white.

### The hero trio, and the size ceiling on it

The cluster is **anchored to the hero's bottom edge and deliberately runs off it**,
clipped by the hero's `overflow: hidden`. Images are 165–216px wide depending on
viewport, all the same size, level with each other, and never overlapping
(`flex: 0 0` so they cannot squeeze). The last one is flush with the content
column's right edge.

`--trio-clip` sets how much is cut off, expressed as a multiple of `--trio-w` so
the clipped *fraction* stays constant at every size. Measured at 15.6–17.3% of the
image height, inside the "no more than a fifth" limit. Raise the coefficient to
cut more. The hero reserves matching bottom padding
(`calc(var(--trio-w) * 1.093 + var(--sp-2xl))` — the visible height plus breathing
room), and that reservation is what keeps the cluster off the jump links.

Three approaches were tried and abandoned first, and the reasons matter if anyone
wants to resize it:

1. **Absolutely positioned in the lower right.** This is what covered the jump
   links. Its vertical position depended on the hero's height, so on a short wide
   window (1700x780) it rose into the link rows. No combination of offsets fixed
   that at every viewport height, because the collision is caused by the viewport
   being short, not by the offsets being wrong.
2. **Beside the type in a two-column grid.** Safe from overlap, but the nowrap
   rotator phrase reserves about 730px of the 1072px container, leaving under
   300px for three images — 95px each, and it forced the rotator onto two lines.

3. **In its own row in normal flow.** Safe and correctly sized, but it could not
   be made to sit flush against the hero's bottom edge: the hero centres its
   content, so whether the row reached the bottom depended on whether the content
   happened to exceed 88vh. Anchoring it absolutely to the hero's bottom *and*
   reserving its height with padding gives both properties at once.

It is gated on `min-width: 72em` **and** `min-height: 44em`: on a short window
there is no vertical room, and forcing it in is exactly what caused the original
overlap bug.

**Ceiling on the size:** `--hero-max-h` is written as `max(900px, fit-content)` so
the hero never clips its own *text*. Pushing `--trio-w` much past 13.5rem starts
to push the hero past 900px tall.

### Copy and proof-point decisions

- **Stat bar** reads 34 states · 700+ districts · 22 years operating. All three
  count up, and the count **replays** every time the bar re-enters the viewport,
  so scrolling back up runs it again. This is the only animation on the page that
  deliberately repeats. Under reduced motion all three render final values
  immediately. The old icons are gone.
- **The "Thousands" and "Millions" stats were removed.** They were tried as
  spelled words and then as `1,000s` / `1,000,000s`; both read as odd next to
  three real numerals, so the bar is now three clean figures. The two proof
  points are still cleared and available if you want them back somewhere else,
  just not as numerals in this row.
- **Section eyebrows were deleted** (`WHO WE ARE`, `WHAT WE DO`, `OUR VALUES`,
  `SUCCESS STORIES`). They competed with the H2s for attention and one of them
  duplicated its own heading word for word. The only remaining eyebrow is
  `FEATURED SUCCESS STORY` inside the success-story cards, which is a card label
  rather than a section header.
- **The testimonial section is titled "Testimonials"** rather than "What our
  partners say". The nav and footer "Success stories" links point at it.
- **Testimonial headshots are cut-outs on a Light Blue backdrop** — a solid disc
  plus concentric arc rings, the same arc language as the hero. No card and no
  drop shadow, because a frame would fight a cut-out figure. Large Orange
  quotation marks frame the quote, and the typographic quotes that used to be
  generated inside the text were removed so the quote is not double-quoted.
- **Case rules, as amended.** The brief's original rule was sentence case
  everywhere except CTA button labels. It has since been widened by decision:
  **nav bar labels, nav dropdown items, the accordion row titles, the hero jump
  links, and the matching footer link labels are all Title Case.** Section
  headings stay sentence case ("How we help", "Our values", "A multidisciplinary
  approach"), as does all body copy including the accordion problem previews. The
  footer link labels were changed alongside the nav because they mirror the same
  items, and leaving them sentence case would have read as an oversight.
- **Nav type is larger** (`--fs-nav`, 15–17px, up from 14px). That no longer fits
  the desktop row below about 1200px, so two things changed with it: the nav item
  horizontal padding tightened to 8px (worth ~110px across seven items) and the
  hamburger breakpoint moved from 68em to **76em**. Verified no nav overflow at
  1220, 1240, 1300, 1440, or 1700px.
- **Hero quick links are Title Case.** The rotator phrases stay sentence case,
  since they complete the sentence "Supporting K-12 districts with …".
- **Rows 4 and 5 have no cleared stat**, so they use a genuinely different card:
  the district name leads at H3 size and the outcome sentence carries the card.
  There is no invented percentage and no empty numeral slot.
- **Acronyms are spelled out on first use** — PRISM, MTSS, and IEP inline. ACAP
  would have roughly doubled the length of the Huntsville card's one-line
  context, so it is expanded in a small footnote line on that card instead.
  **"Academic ROI Institute" is left unexpanded**: it is a proper noun and
  expanding "ROI" inside the program's own name mangles it. Flagging rather than
  silently dropping, per the brief.
- **Attribution** is phrased so the district moved the number and DMG led the
  work, never the reverse.
- **Both quotes are verbatim**, with only the marked phrases bolded. No words
  changed.
- **"DMGroup" appears nowhere** in the markup except `info@dmgroupK12.com`,
  which is a live email address. "DMCouncil" is kept as a product name.
- **Footer "How we help" column changed.** It used to list products (Consulting
  Services, Professional Development, Accelerated Learning, Strategic Budgeting,
  Scheduling Solutions). It now mirrors the five problem buckets from the nav —
  Student outcomes, Strategic planning and budgeting, Enrollment and attendance,
  Scheduling, Custom requests — to match the site's move to problem-oriented
  buckets. Note that *Custom requests* is the one bucket with no accordion row
  on this page, so nothing here substantiates it yet.
- **Deleted:** the gray "In an era of rising competition" blurb section, the
  purple and yellow blob decorations, the oval image masks, the stat icons, and
  the two-row counter-scrolling marquee.

### The five buckets are in one canonical order everywhere

Hero jump links, the nav "How We Help" dropdown, the accordion rows, and the
footer column all run in the same order:

1. Student Outcomes
2. Strategic Planning and Budgeting
3. Enrollment and Attendance
4. Scheduling
5. Special Education (hero and accordion) / Custom Requests (nav and footer)

The accordion was previously Strategy → Student Performance → Enrollment →
Special Education → Scheduling and has been reordered to match. The "open on load"
state moved with it, so the **first** row is still the one open when the page
loads — that is now Student Performance rather than Strategy and Budgeting.
If you reorder these again, keep all four lists in step and move the `open` class
and its `aria-expanded="true"` to whichever row ends up first.

### One name per bucket, everywhere

This started out inconsistent: the accordion rows were titled *Strategy and
budgeting* and *Student performance* while every link pointing at them said
*Strategic Planning and Budgeting* and *Student Outcomes*, so clicking a link
landed you on a differently-titled row. The accordion titles have been renamed to
match the links exactly. Verified: every hero jump link's text is character-for-
character identical to the title of the row it opens.

The row and panel `id`s were renamed to match (`row-student-outcomes`,
`row-strategic-planning`), so the source no longer carries the old vocabulary
either. Verified after the rename: all 20 internal anchors resolve, all
`aria-controls` resolve, no duplicate ids.

The one remaining wrinkle is by design rather than oversight: the nav and footer
list **Custom Requests** as the fifth bucket while the hero and accordion list
**Special Education**. Custom Requests has no accordion row, so nothing on this
page substantiates it.

### Accessibility and quality floor

- One `<h1>`. Real `<section>` landmarks, `<blockquote>`/`<cite>` for quotes,
  `<address>` for the footer address.
- Accordion rows are real `<button aria-expanded aria-controls>` inside `<h3>`,
  operable by Enter and Space, with every `aria-controls` resolving to a real id.
  Multiple rows can be open at once and an open row never auto-closes. Row 1 is
  open on load.
- Panels animate `grid-template-rows: 0fr → 1fr` over 320ms. Height is never
  animated to `auto`.
- Testimonials advance by arrow buttons, dots, and Left/Right arrow keys.
- Keyboard focus shows a 3px Light Blue ring at 4px offset on every interactive
  element. Nothing suppresses an outline anywhere in the stylesheet.
- Verified no horizontal scroll at 375px with all five accordion rows open.
- Every image has `alt`; below-the-fold images are `loading="lazy"` and carry
  explicit dimensions or a CSS `aspect-ratio` so there is no layout shift.
- `prefers-reduced-motion: reduce` disables the rotator, reveals everything at
  final state, skips the count-ups, pauses the marquee and hides its duplicate
  track, and pauses the hero video while keeping its still frame visible.
- Without JavaScript the page still renders fully: all content is visible, row 1
  is open, and the first testimonial shows.

### Motion

One orchestrated load sequence, not scattered effects: the video fades up over
600ms, then the H1 rises 12px, then the rotator, rule, static row, and CTAs at
90ms intervals. Scroll reveals use one IntersectionObserver at
`threshold: 0.15`, translate 16px with a 60ms stagger inside a group, fire once,
then unobserve. Hover draws the Light Blue rule in from the left; buttons darken
and lift 1px. Nothing scales beyond 1.02, nothing springs, nothing parallaxes,
and there is no scroll-jacking.

Three animations deliberately **repeat** rather than firing once:

1. **Stat count-ups** replay on every re-entry into the viewport.
2. **Testimonial backdrop rings** rotate from −32° into place when the section is
   reached and rotate back out on the way past, so returning replays it. The
   hidden initial state is scoped to `html.js` so that with JavaScript off the
   rings are simply visible rather than permanently invisible. The observer
   watches the **photo**, not the section: watching the section meant the rings
   finished rotating while only the heading was on screen, so the movement was
   over before the artwork was visible. It watches *every* photo rather than only
   the first, because an inactive slide is `display:none` and always reports "not
   intersecting", which hid the rings as soon as the carousel advanced.
3. **Accordion emphasis marks** redraw each time a row is opened, and the
   success-story **stat counts up again on every expand**, not just the first.

**Testimonials auto-advance every 15 seconds** (`AUTO_MS` in `main.js`). The timer
pauses on hover and on focus, pauses when the browser tab is hidden, and any
manual click or arrow key restarts the clock so the slide never changes out from
under someone who just interacted. Off entirely under reduced motion, which is
why the prev/next/dot controls remain the primary mechanism. Verified advancing
0 → 1 at the 15s mark with the dots staying in sync.

Note for the review: the CEO's objection was to **carousels that assume the reader
waits**. Auto-rotation is now on here, so if that objection resurfaces, the fix is
one constant. The hero rotator still has its static twin row, so nothing in the
hero is reachable only by waiting.

---

## Notes for the Webflow port

- Every value is a CSS custom property in `:root`, grouped as color, spacing,
  type, structure, motion. Change a token once and it changes everywhere.
- Layout is a 12-column mental model at `max-width: 75rem` with fluid side
  padding. The asymmetric splits are plain CSS grid: `5fr 7fr` for the approach
  section, `4fr 5fr 4fr` for an open accordion panel, `2fr 3fr` for a
  testimonial. All three map cleanly onto Webflow grid children.
- Breakpoints are at 64em, 56em, 48em, 44em, and 40em.
- The only external requests are the two Google Fonts stylesheets. No CDN
  scripts, no icon font beyond Material Symbols Rounded, no tracking.

---

## Round 5 changes

- **Hero trio removed** entirely, along with its tokens and CSS. An **expertise
  line** ("through leveraging management techniques and education best practices.")
  sits under the rotator rule, capped at 54ch so it holds the H1's measure.
- **Type scale up across the board** except the hero H1: body 17 → 19px, H2 up to
  56px, H3 up to 34px, accordion program links up to 23px, hero jump links up to
  22px. The jump row still resolves to **two lines** at desktop
  (`--quicklinks-max` widened to match).
- **Nav type up to 18px.** That no longer fits one line below ~1280px, so the
  hamburger breakpoint moved 76em → **80em**. Verified zero nav overflow at 1300,
  1440 and 1700px.
- **Nav layer 2**: `Student Outcomes`, `Strategic Planning and Budgeting`,
  `Enrollment and Attendance`, `Scheduling` and `DMCouncil Membership` open a side
  panel on hover/focus-within, with the same hover styling as layer 1. The panels
  flip to open leftward under the right-hand menus so they cannot run off-screen.
  `DMCouncil` now reads Membership (with children) + DMG Summit, per the map.
- **Stat bar**: row 1 is 22 years in practice / 34 states / 700+ districts, row 2
  is 1,000s school and district leaders / 1,000,000s students supported. Built on a
  6-column grid (spans of 2 then 3); spans reset to single columns below 62em.
- **Marquee centre highlight**: the logo nearest the horizontal centre scales to
  1.2x and drops its blue tint, easing in and out as it passes. Implemented as a
  120ms poll in `main.js` rather than per-logo observers, because the track is one
  CSS transform and individual logos generate no events. The poll only runs while
  the marquee is on screen, and never under reduced motion.
- **Values**: numerals dropped; tiles are now floating white cards with a shadow,
  a Light Blue outline arc in the corner that turns **orange** and swings on hover,
  and a Light Blue icon disc that fills on hover.
- **Approach section** gains the same arc motif as the testimonials, including one
  orange arc, behind the Summit photo.
- **Accordion**: all rows **closed on load**, hover now washes the row, tints the
  title, nudges the chevron and indents the row, and the chevron is larger
  (`--fs-h3-up`).
- **Testimonial**: photo bottom now targets the **closing quote mark's** visible
  bottom rather than a point ~50px below it, and the cycle controls moved up
  (`margin-top` `--sp-xl` → `--sp-sm`).

## Round 6 changes

- **Expertise line** forced to one line (`white-space: nowrap`), wrapping again
  below 62em where it cannot fit.
- **All five stat figures share one size** (`--fs-stat`, up to 64px). It had to
  come down from 88px because `1,000,000s` is ten characters and has to fit half a
  row; verified every figure fits its own column. The two magnitudes now **count
  up** like the rest, using the existing comma formatter with an `s` suffix.
- **Marquee crop fixed.** The centred logo scales with `transform`, and
  `.marquee` has `overflow: hidden` for the seamless loop, so the enlarged logo was
  being clipped top and bottom. Block padding on `.marquee` gives the 1.2x box room
  instead of shrinking the effect.
- **Approach copy** gains the same Light Blue emphasis as the accordion: an
  underline on "system-level challenges" and a drawn ellipse on "hundreds of
  districts", both firing on scroll reveal.
- **Values rebuilt as a floating cluster.** No cards, no shadows, no borders. Each
  value is an icon inside a Light Blue disc with a slowly counter-rotating ring and
  a single orange arc, sitting at four different heights so the row reads as a
  drift. The discs bob a few pixels on staggered 6.5–9s cycles; all of it stops
  under reduced motion.
- **Testimonial matched to the Canva mockup**: the closing quote mark is now
  **inline at the end of the last line** (moved inside the paragraph, `line-height:
  0` so it adds no height), and the photo cell spans both grid rows so the
  headshot's base sits level with the bottom of the attribution.

## Round 7 changes

- **The rotating phrase is gone.** The hero now reads "Supporting K-12 districts"
  followed by "through leveraging management techniques and education best
  practices." at the rotator's old scale (`--fs-expertise-lg`, up to 41.6px, weight
  600), wrapping to two lines. All rotator markup, CSS and JS were removed —
  roughly 60 lines of swap timing, pause-on-hover and phrase-width reservation.
- **The measuring rule survives** and now measures the expertise line instead of a
  rotating phrase. It uses a `Range` to get one rect per rendered *line* and takes
  the widest, so the rule hugs the longest line rather than spanning the whole
  column. Verified: 824px rule against an 824px first line.
- Note for the review: this also removes the last carousel-like element from the
  hero, which the CEO objected to on principle. The static jump-link row that was
  introduced as its accessible twin is now simply the navigation.
