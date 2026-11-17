# Week 6 illustration credits

Every file in this folder is a crop of the author's own AI-generated mockups
(`mockups/week6-v2/demo-v2.png` and `dashboard-v2.png`), cut with a script
(Pillow), edge-feathered and re-encoded as WebP (each under 30 KB).

`straw-lg.webp` is keyed out rather than feathered: it sits on the dark
green banner, where a feathered crop showed its pale background as a
rectangle. Its mask comes from the same script, by how close each pixel is
to the mockup's near-white page.

The six `-lg` files replaced smaller first-round crops of the same
illustrations: the rebuilt pages show these pictures much larger, so they
were re-cut from the mockups at the size they are rendered at. The crops
they replaced were deleted rather than left behind unused.

They are decoration only: each one is rendered with `next/image`, an empty
`alt`, `aria-hidden`, and `loading="lazy"` (the two hero images are the first
paint). None of them carries a number, a UI label or a claim. The handwritten
words on the notepad ("Lunch Plan"), clipboard ("Testing Checklist") and
"User testing" pad are part of the illustration, not page data.

Not used on purpose: the "Shop" and "Cook" illustrations (those features do not
exist), the phone showing an app (the mobile app is only a V2 idea) and the
"Pending" figures from the mockups.

| File | Cropped from | Shown on |
| --- | --- | --- |
| `demo-hero-lg.webp` | demo-v2 | /demo hero |
| `dash-hero-lg.webp` | dashboard-v2 | /dashboard hero |
| `tour-plan.webp`, `tour-personalize.webp`, `tour-research.webp`, `tour-market.webp` | demo-v2 | /demo product tour cards |
| `impact-lunchbox-lg.webp` | demo-v2 | /demo practical impact |
| `testing-clipboard-lg.webp` | demo-v2 | /demo testing |
| `dash-notepad-lg.webp` | dashboard-v2 | /dashboard testing summary |
| `straw-lg.webp` | dashboard-v2 | /demo closing banner, /dashboard saved records |
| `rec-lunch/laptop/calc/note/paper/chat.webp` | dashboard-v2 | /dashboard saved-records tiles, /demo Ask and Price cards |
