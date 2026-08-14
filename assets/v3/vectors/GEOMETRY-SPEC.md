# DMG logo origin assets: geometry spec

Reconstructed from screenshots by measuring the shapes and fitting circles and arcs.
Every number below is a ratio, so the mark can be rebuilt at any size.

**Verification:** the reconstruction was rendered at the source screenshot's exact pixel
scale and overlaid on it. Agreement was 94.5% (figures) and 92.2% (triangle) by
intersection-over-union, with the remaining difference being a sub-pixel edge fringe.
The single figure element's width-to-height ratio came out at 2.5526 against the
screenshot's measured 2.5530, which independently confirms the arm geometry.

## Reference unit

All mark dimensions are expressed against **Rc**, the radius of the circle that the three
arms are centred on. In the supplied SVGs, Rc = 200 in a 512 x 512 viewBox centred at
(256, 256).

## The mark

| Element | Value | As supplied (Rc = 200) |
|---|---|---|
| Arm centreline radius | Rc | 200 |
| Arm stroke width | 0.2150 x Rc | 43.0 |
| Arm cap | round | round |
| Arm angular span | 92 degrees (plus or minus 46 from its head) | 92 deg |
| Head circle radius | 0.2350 x Rc | 47.0 |
| Head centre | on the arm centreline circle | radius 200 |
| Head positions | 270, 30 and 150 degrees | 12, 4 and 8 o'clock |
| Visible gap between figures | 15.7 degrees | 15.7 deg |

## The triangle

A curved triangle: three outward-bulging arcs, corners filleted. Its centroid sits on the
centre of the mark. Point up.

| Element | Value | As supplied |
|---|---|---|
| Bounding box width (W) | 0.98260 x Rc | 196.5 |
| Bounding box W/H | 1.079 | 1.079 |
| Vertex circumradius | 0.59000 x W | 115.9 |
| Edge arc radius | 2.16640 x W | 425.7 |
| Corner fillet radius | 0.03500 x W | 6.88 |

## The Venn diagram

Both of the source graphics use the same proportions, and they are cleaner than expected:

- Three circles of equal radius **R**
- Centres at distance **D = R / sqrt(2)** from the centre (measured 0.7074 in one
  graphic and 0.7071 in the other)
- Centres sit at **270, 30 and 150 degrees**, which is exactly where the three figures'
  heads end up. Each circle has a person standing on it.
- The three arms sit at the **outer pole** of their own circle, at radius D + R, measured
  at 95.6% of that
- Venn-stage arm stroke width 0.218 x R, head radius 0.216 x R

The central intersection region of those three circles has an edge arc radius of R and a
vertex circumradius of 0.4370 x R.

## One thing worth knowing about the triangle

The logo's triangle is **not** the literal Venn intersection. The true intersection has
edge arcs at 1.32 x its own width; the logo's triangle has them at 2.17, so its sides are
noticeably flatter. The logo triangle is a stylised version of the shape, not a
mathematical crop of it. The vertex positions are nearly identical (0.577 versus 0.590),
so it is only the side curvature that was changed.

For the animation this is a feature, not a problem: the sides flattening as the circles
fall away is an honest extra beat, and it is what the supplied animated file does.

## Colour

Files are supplied in two navy variants because the sources disagree:

- `#1A518E` Dark Blue, the primary palette value in both style guides
- `#283C64`, which is what the actual logo pixels measure in every screenshot supplied

Light Blue `#2DB9E1` matched the documented value exactly in the lockup screenshot.

## Type

Labels are live `<text>` set in Nunito Sans (Bold 700 for the first word, Regular 400 for
the second) so they stay editable. Convert to outlines before handing off to anyone who
may not have the font installed.

Both label words are set in Dark Blue rather than the original's Light Blue. Light Blue
text on white measures roughly 2.2:1 contrast, which fails WCAG AA for body text.
