# Personal Page Redesign — "Studio Minimal × Depth Sim"

Date: 2026-07-05 (updated 2026-07-06: crafted figures v2, agent tint palettes, walk mode)
Target: `index.html` (single-file personal landing page, ImIntheMiddle.github.io)
Status: Approved by user (design + mockup iterations complete)

## Context

The current `index.html` (1015 lines) implements the full personal-page concept: bilingual (EN/JA) content, light/dark themes, and a canvas Social-Force-Model crowd simulation as the visual identity. The user judged the concept good but the execution too handmade, specifically in all four visual pillars: the canvas figures, the beige/nostalgic palette, the single-column glass-panel layout, and the typography/spacing.

Decision after mockup review: adopt **Direction A (Studio Minimal)** for the page design, keep the crowd simulation as the visual centerpiece, and raise agent rendering quality using the **Depth style** (refined filled figures). Site toggles are reduced to language (EN/JA) and theme (light/dark) only.

Content (bilingual text, links, placeholders pending the `_questionnaire.md` answers) is preserved as-is; this redesign changes presentation only.

## Design Tokens

| Token | Light | Dark |
|---|---|---|
| paper | `#fbfbfa` | `#121110` (warm near-black) |
| ink | `#16150f` | `#ece9e2` |
| ink-dim | `#6b6a63` | `#a5a29a` |
| ink-faint | `#a3a29a` | `#6f6c66` |
| accent (single) | `#e8500a` | `#ff6a2b` |
| hairline | `#e3e2dc` | `rgba(255,255,255,0.12)` |

- Fonts: **Inter** (display 700, letter-spacing −0.045em; body 400/500) + **IBM Plex Mono** (micro labels, uppercase, letter-spacing 0.12–0.14em) + **Noto Sans JP** (JA text).
- Removed: Sora, Newsreader, Fraunces, noise texture overlay, glassmorphism (`backdrop-filter` panels), 3-color agent palette.
- Spacing on an 8pt scale. `border-radius` only on pill buttons and image corners.
- Background: Swiss dot grid on the canvas (64px pitch, ~5% ink alpha), replaces noise texture.

## Layout

- **Header**: sticky, opaque paper background, bottom hairline. Left: name mark. Center/right: section nav (mono, 12.5px). Right: two pill toggles — `EN/JA`, `Light/Dark`. Existing `data-lang` / `data-theme` toggle logic is reused unchanged.
- **Hero**: 12-column grid. Name spans cols 1–8 (clamp 56–104px, Inter 700). Meta rail cols 9–12 with `border-left` hairline: Affiliation / Fellowship / Base as mono-label + value pairs. Below: lede (21px, accent `em`), chip-style link row (pill buttons, first one filled ink), then Mission as a full-width band framed by hairlines.
- **Sections** (order unchanged): Bio, News, Research Focus, Publications, Awards, Talks, Media, Blog, Life, Contact.
  - **Blog**: kept in markup, hidden via `display:none` (section and nav link), per earlier decision.
  - No card boxes: information is structured with hairline rules, whitespace, and mono section labels (`01 — Research` style indices retained).
  - Research Focus: 3 hairline-separated columns (no filled cells).
  - Publications: rows with venue mono label / title / authors / links; thumbnail frame kept (thin hairline box) for future teaser images; text placeholder inside until images provided.
  - Awards / Media / News: hairline-divided rows, mono dates.
  - Talks / Life photos: hairline-framed boxes, no filled panels.
- **Canvas placement**: `#field` canvas stays `position: fixed`, full viewport, behind everything. Rather than mixing canvas and content via transparency, the paper background is applied **only to `.wrap` (the 1200px content column)**. Sections themselves are transparent. This gives spatial separation: text always sits on fully opaque paper (perfectly readable) while the simulation is visible in the **side margins outside the content column** (on viewports wider than 1200px) and in the **short vertical gaps between sections**. On narrow viewports the content column fills the screen, so the canvas is only visible in the section gaps. No blur, no ghosting under text. The SFM footer credit stays.

## Responsive Behavior (mobile + tablet)

The reference mockup is desktop-only. The final `index.html` must scale down cleanly. Two breakpoints:

- **`≤ 900px`** — tablet compression: nav link row hidden (only theme + language toggles remain in header), section-gap heights reduced from ~120px to ~60px, section indent tightened.
- **`≤ 640px`** — phone layout: single-column, canvas throttled, walk mode disabled.

### Layout adaptations at `≤ 640px`

- `.wrap` padding drops to `clamp(18px, 5vw, 28px)`.
- **Hero** collapses to one column: eyebrow → name (`<br>` between "Hiromu" and "Taketsugu" removed) → lede → meta rail rendered as three horizontal mono-label rows below lede (no `border-left`, hairline `border-top` instead) → chip row wraps.
- `h1` clamp minimum drops to `40px` (upper bound unchanged).
- **Research Focus**: 3 columns → 1 column, hairline `border-top` between cells replaces the vertical rules.
- **Publications**: 168px thumb + 1fr → stacked, thumb becomes full-width (max 240px), text below.
- **Awards / Media / News**: keep the date/label + body two-line stack (current-style single-column rows).
- **Talks**: 3-col grid → 1-col.
- **Life photos**: 4-col grid → 2-col.

### Header on mobile

- Section-anchor nav links (`Research / Publications / …`) are hidden below 900px — this is a single-scroll LP so anchor jumping loses value. The `EN/JA` + `Light/Dark` pill toggles remain visible in the header at all widths.
- No hamburger menu (kept out of scope; avoids the complexity for a page whose entire content is one scroll).

### Canvas adaptations at `≤ 640px`

- Cap `DPR` at `1.5` (down from 2) — high-DPI phones save GPU work while keeping figures crisp.
- Agent counts scale down: `nPed` uses `Math.round(W * H / 200000)` (was `/150000`); at most one robot, and the car is dropped entirely at very narrow widths (< 480px).
- Object count uses `/ 260000` (was `/ 200000`).
- Trail sample cap `maxTail` reduced to `20` (was `30`).
- Prediction fan step count reduced to `22` (was `32`).

### Canvas power management (all widths)

- Add a `visibilitychange` listener: pause `requestAnimationFrame` scheduling when `document.hidden === true`; resume on visible. Prevents background-tab drain.
- `IntersectionObserver` on the canvas element pauses rendering when the canvas is entirely scrolled out of view (rare in practice but cheap safety).

### Walk mode on mobile

- The 🎮 button is hidden at `≤ 640px` (arrow keys / WASD unavailable on touch devices). No touch-drag controls implemented (out of scope for this redesign).
- Also hidden when `prefers-reduced-motion` is set.

### Verification (mobile-specific)

- Chrome DevTools "iPhone 12 Pro" (390×844) and "iPad Mini" (768×1024) presets: full page renders without horizontal scroll, hero collapses, canvas figures visible and animating without jank.
- With DevTools throttling to "Mid-tier mobile": frame rate stays reasonable; no > 8 ms scripting stall per frame during typical scroll.
- Toggle `document.hidden` (open a new tab and return): confirm rAF pauses/resumes.
- 🎮 button absent below 640px width and under `prefers-reduced-motion`.

## Crowd Simulation (Depth style v2, fixed)

Reference implementation: `_design_mockup_A.html` (approved by user; port its sim code, adapting colors to CSS-variable theming).

- **Unified side-view perspective** for all elements. The current top-down car is replaced with a side-view car profile. People, robots, cars, and scene objects share one stage-like viewpoint with depth scaling (`0.6 + (y/H) * 0.85`).
- Painter's-order depth sort across objects + movers (sorted by ground y). Radial-gradient ground shadows everywhere (replaces flat ellipses).
- `prefers-reduced-motion`: render a static settled frame (current behavior preserved); hide the walk-mode button.

### Agent color system

- **Muted tint palettes** (desaturated so the single ACCENT still leads):
  - Pedestrians `PED_TINTS`: neutral ink ×2, terracotta `[176,96,62]`, ochre `[146,122,60]`, sage `[104,124,88]`, slate blue `[88,108,134]`, plum `[122,96,124]` — one per agent, assigned at spawn.
  - Cars `CAR_TINTS`: slate blue, brick `[146,90,78]`, muted green `[110,128,100]`, grey `[120,120,128]` — body fill at 0.30 alpha, outline `mix(tint, INK, 0.5)`.
  - Robots: neutral ink body; `ROBOT_LIGHTS` (teal `[64,160,150]`, orange, sky `[96,140,200]`, amber `[180,130,60]`) color the LED eye bar, antenna flag, and blinking tip.
- **Trails and prediction fans use the owner's tint** (trail alpha ≤0.16, fan alpha 0.24), so each trajectory is attributable at a glance.
- Exactly **one accent pedestrian** (the "prediction subject") uses full ACCENT with a stronger fan (alpha 0.5).
- **Dark theme**: tints lightened by `mix(tint, white, ~0.2)`; ACCENT switches to the dark-theme token. Reload palette on theme change via the existing MutationObserver pattern.

### Pedestrians (crafted v2)

- Anatomical filled silhouette: torso path with shoulder/chest/waist/hip widths (chest nudged forward), neck, filled head.
- **Tapered limbs** via joint-chain polygons with round joints: thigh→knee→ankle widths `0.052h/0.038h/0.024h`, arm `0.036h/0.030h/0.020h`; hands as small circles.
- **Shoes** (filled wedges) with gait roll: pitch `0.28 * stride * sin(phase − 0.7) * runK`; knee bend swing-linked `0.10 + 0.45 * stride * max(0, cos(phase))`; forward lean and bob proportional to speed.
- Back-side limbs at 0.40 alpha of the same tint.
- **Individuality**: height, build factor (0.85–1.18 on widths), gait frequency (0.26–0.34), hair variant {none, cap, ponytail (sways with gait), bun}, prop variant {none ×2, backpack, shoulder bag (paper strap + hip pouch), briefcase (swings with front hand)}.

### Robot (side-view delivery bot)

Tires + paper rims + 3 rotating spokes + hub; suspension forks; rounded chassis with panel seam, vents, front bumper strip, cargo-lid line; trapezoid head with LED eye bar (light color, forward) + rear sensor dot; curved whip antenna with flag + blinking tip (light color).

### Car (sedan profile)

Single body path with **wheel-arch arc cutouts**; hood → A-pillar → roof → C-pillar → trunk in bezier curves; front/rear windows split by B-pillar; door seam + handle; side mirror; warm headlight wedge + accent taillight; tires + rims + 4 rotating spokes.

### Scene objects

- Tree: flared S-curve trunk (filled), two branches, 6-disc layered translucent canopy with partial outline arcs, grass tufts at base.
- Bench: cast-iron curved legs with foot plates, 2 seat slats + 2 reclined backrest slats, armrest.
- Street lamp: plinth + tapered filled pole + curved arm + trapezoid housing; accent lamp dot with radial **light halo**.
- Planter: ribbed trapezoid pot, grass blades + 2 broad leaves.
- Bollard: rounded post with accent reflective band.
- Objects participate in avoidance as now.

### Walk mode (mini-game)

- Fixed pill button (bottom-right, mono font): toggles control of the accent pedestrian.
- **Arrow keys / WASD** steer (input force replaces goal-seeking; avoidance forces stay active), **Esc** exits, max speed ×1.5 while controlled.
- Pulsing dashed ground ring (accent, perspective-squashed) marks the player.
- `preventDefault` on arrow keys **only while active** (page scroll unaffected otherwise); key state cleared on exit.
- The prediction fan keeps tracking the player — interactive demo of the research theme.

## Implementation Approach

- Rewrite `index.html` in place: new CSS, new canvas JS, new markup skeleton.
- **Port all existing content verbatim**: every `.en`/`.ja` text pair, links, placeholder markers (`[verify]`, `[confirm]`, `#` hrefs). Placeholder cleanup happens later when `_questionnaire.md` answers arrive — not part of this redesign.
- Reuse unchanged: lang toggle IIFE, theme toggle IIFE (`data-lang`/`data-theme` attributes, `prefers-color-scheme` detection), IntersectionObserver reveal pattern, MutationObserver palette reload on theme change.
- Keep everything in the single `index.html` file (no build step, no external CSS/JS).
- Reference artifact: `_design_mockup_A.html` (Depth v2 figures + tint palettes + walk mode, user-approved) — port its sim code into `index.html`, converting hardcoded light-theme colors to CSS-variable-driven theme colors. Delete or ignore the mockup files before publishing.

## Out of Scope

- Filling questionnaire placeholders (separate task, pending user answers).
- Publication teaser images, portrait, photos (placeholders keep working without them).
- Blog content system.

## Verification

1. Open `index.html` in a browser; confirm hero, all sections, and footer render on both themes and both languages (4 combinations).
2. Confirm canvas: unified side-view agents, exactly one accent pedestrian, objects avoided by agents, depth sort correct (no figure drawn over a nearer one).
3. Color system: pedestrian/car tints varied, trails/fans match their owner's tint, robot lights varied; on dark theme tints lighten and remain legible.
4. Walk mode: button toggles control; arrows/WASD steer the accent pedestrian with walking animation; Esc exits; page scroll works normally when inactive; ground ring visible while active; button hidden under `prefers-reduced-motion`.
5. Toggle `prefers-reduced-motion` (devtools emulation): static frame renders.
6. Resize window: sim re-seeds, layout reflows to mobile widths (single-column hero, nav collapse as current).
7. `grep` checks: no `backdrop-filter`, no `Sora|Newsreader|Fraunces` font references, no `feTurbulence` noise, `display:none` on Blog section + nav link.
8. Confirm all bilingual content pairs survived the port (spot-check News, Life, Mission).
9. JS syntax check of the inline script via `node --check` (extract script block).
