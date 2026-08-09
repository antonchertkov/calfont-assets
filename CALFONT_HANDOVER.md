# CalFont — Developer Handover Brief

## What This Is

CalFont is a browser-based font design tool where users draw letterforms using Google Calendar meeting blocks as the building primitive. Calendar blocks (with physics-based overlap logic) are arranged to form glyphs, which can be saved, typed with, exported as SVG/PNG, or sent to Google Calendar as real .ics events.

The tool is built as a self-contained p5.js sketch embedded in a Webflow page via a custom embed snippet. There is no backend.

**Live URL:** [insert your Webflow URL here]

---

## File Structure

Three JS files are loaded in this exact order:

```html
<script src="...p5.js"></script>
<script src="...calfont-presets.js"></script>
<script src="...calfont-tones.js"></script>
<script src="...calfont-engine.js"></script>
```

### `calfont-presets.js`
Populates `window.CF.presets` with starter glyphs (full alphabet A–Z plus punctuation) in human-readable HH:MM format. The engine reads this on init and converts to internal format via `humanToRelative()`. If absent, the engine starts with an empty alphabet.

### `calfont-tones.js`
Populates `window.CF.tones` with named tone modes (STANDARD, HOPEFUL, PARODY, VACATION). Each tone has a `label` (shown in UI) and a `titles` array (pool of meeting names randomly assigned to blocks). Engine reads this on init via `loadTones()`. Falls back to built-in defaults if absent. Add new tones by adding keys — no engine changes needed.

### `calfont-engine.js`
The entire application. 1471 lines. Exposes two globals:
- `CF.config` — configuration object (override before calling `CF.init()`)
- `CF.hooks` — CSS selector map for all UI elements (IDs the engine binds to)
- `CF.init()` — initialises the p5 sketch and binds all DOM events

---

## Architecture

### Coordinate System
- Time is stored as decimal hours: `9.5` = 09:30, `17.0` = 17:00
- Each glyph occupies hours 9–17 (GLYPH_START=9, GLYPH_END=17, GLYPH_SPAN=8)
- Block `s` and `e` properties are absolute hours (NOT normalised 0–1 fractions)
- `relS` / `relE` on saved glyphs = absolute hours (e.g. 9.0–17.0)
- `_origS` / `_origE` on rendered blocks = original hours before multiline shift (used for time display)

### Multiline Rendering (Test Mode)
Each line of typed text occupies its own coordinate window. Key constants:
```js
STRIDE = GLYPH_SPAN * (1 + C.lineGapRatio)  // = 8 * 1.5 = 12hrs
lineShift = li * STRIDE                       // line 0: 0, line 1: 12, line 2: 24
```
Blocks on line 1 have `s = origS + 12`, `e = origE + 12`. The `_origS`/`_origE` fields preserve the original hours for display and export.

**Critical:** In the physics/draw loop, blocks from different lines must never be processed together in the same `processPhysics()` call. They are separated by line index using `Math.round((b.s - b._origS) / STRIDE)`.

### Physics (processPhysics)
Called once per column per frame. Assigns `renderX`, `renderY`, `renderW`, `renderH` to each block based on time overlap (lane assignment). Up to 3 lanes. This is the layout engine — never read `b.s`/`b.e` for rendering, always use `b.renderX` etc.

### Glyph Storage (`rawAlphabet`)
```js
rawAlphabet['H'] = [
  { relD: 0, relS: 9.0, relE: 17.0, title: '...', outlined: false },
  ...
]
```
`relD` = column offset (0-based). `relS`/`relE` = absolute hours.

### Tokeniser (`tokeniseLine`)
Parses typed text into tokens. Supports:
- Single characters → look up `rawAlphabet[CHAR]`
- `_NAME_` syntax → look up `rawAlphabet['NAME']` (multi-char named glyphs)
- Space → advance column

---

## UI Hook System

The engine binds to DOM elements by CSS selector via `CF.hooks`. Key IDs:

| Hook | ID | Purpose |
|------|----|---------|
| Canvas container | `#cf-canvas` | p5 sketch parent |
| Make mode button | `#cf-btn-make` | mode toggle |
| Test mode button | `#cf-btn-test` | mode toggle |
| Name input | `#cf-name-input` | glyph name in Make mode |
| Type textarea | `#cf-type-input` | text in Test mode |
| Add/save button | `#cf-add-btn` | save glyph |
| Palette button | `#cf-pal-btn` | cycle colour palette |
| Tone button | `#cf-tone-btn` | cycle tone |
| Tone label | `#cf-tone-label` | displays current tone name |
| Glyph chips | `#cf-glyph-chips` | engine injects chip HTML here |
| SVG export | `#cf-export-svg` | opens export modal |
| PNG export | `#cf-export-png` | opens export modal |
| Calendar export | `#cf-cal-export-btn` | opens .ics date picker modal |
| Session button | `#cf-session-btn` | opens save/load JSON modal |
| Toast | `#cf-toast` | notification div |

Any hook the engine can't find is silently skipped.

---

## Modals

All modals live in the Webflow embed snippet HTML, not in Webflow's canvas. They use the class `cf-modal` + `cf-modal-open` for show/hide. The engine manages open/close via `openModal()` / `closeModal()`.

Modal IDs:
- `#cf-export-modal` — SVG/PNG export options
- `#cf-overwrite-modal` — glyph overwrite confirmation with preview canvases
- `#cf-saveload-modal` — session JSON save/load
- `#cf-cal-modal` — calendar export date picker (NEW — may not be in current Webflow embed yet)
- `#cf-about-modal` — about text
- `#cf-controls-modal` — keyboard/mouse controls reference

**The calendar modal (`#cf-cal-modal`) may need to be added to the Webflow embed snippet.** It contains a date input `#cf-cal-date` and confirm button `#cf-cal-confirm`.

---

## Export System

### SVG Export (`doExportSVG`)
Output structure:
```
<svg>
  <g id="letter-0">          ← one per glyph (test mode only)
    <g id="block-0">         ← one per calendar block
      <svg overflow="hidden"> ← clips text to block bounds (no clipPath elements)
        <rect/>              ← background
        <text/>              ← meeting title
        <text/>              ← time range
      </svg>
    </g>
  </g>
</svg>
```
In Make mode there are no letter groups — just block groups at top level. This structure is intentionally flat for easy editing in Figma.

### PNG Export (`doExportPNG`)
Uses an offscreen canvas at 4× scale with 32px padding.

### Calendar Export (`downloadICS`)
Generates a `.ics` file. Column `d` maps to days offset from the user-picked start date. Uses `_origS`/`_origE` for event times so multiline blocks show correct hours.

### Session Save/Load (`showSaveLoad`)
JSON format:
```json
{
  "version": 2,
  "alphabet": {
    "H": [{ "col": 1, "from": "09:00", "to": "17:00", "title": "...", "outlined": false }]
  },
  "typedText": "HELLO",
  "paletteStep": 0,
  "toneMode": 0
}
```

---

## Colour System

Three modes cycled via palette button: SOLID, MIXED, COLORFUL. The active palette colour is written to `--cf-active-color` CSS variable on `:root`. Make/Test buttons use `cf-active` combo class that reads this variable.

---

## Known Constraints / Things Not To Break

1. **Never normalise glyph hours.** Old versions stored `relS`/`relE` as 0–1 fractions scaled by GLYPH_SPAN. Current version stores absolute hours (9.0–17.0). `showSaveLoad` exports `toHHMM(g.relS)` directly — do not add `GLYPH_START + g.relS * GLYPH_SPAN`.

2. **Never use `WIN = 24` for stride.** The stride between multiline lines is `GLYPH_SPAN * (1 + lineGapRatio) = 12`, not `WIN + GAP = 36`. Using 24 as the window caused a major spacing bug.

3. **Physics isolation between lines.** In type mode, `processPhysics` must be called separately per line. Mixing blocks from different lines causes overlap logic to fire across lines visually.

4. **`TONE_KEYS` must not be a const assigned at parse time.** It was previously `const TONE_KEYS = C.toneLabels` which captured the empty array before `loadTones()` ran. It's now removed — use `C.toneLabels` directly everywhere.

5. **`GLYPH_END` must be defined.** It was missing in v1.5 which caused `undefined` in all coordinate calculations and a blank canvas. It's defined as `const GLYPH_END = HOUR_E` near the other glyph constants.

6. **Script load order matters.** presets → tones → engine. The engine reads `window.CF.presets` and `window.CF.tones` synchronously on init.

---

## 3D Mode (`calfont-3d.js`)

A pure CSS 3D view — no Three.js or WebGL. Each calendar block becomes a DOM element positioned with `translateZ()` inside a `transform-style: preserve-3d` container. The scene is orbit-controlled via mouse drag (rotX/rotY) and scroll zoom.

### Key details
- **Side faces** are additional `<div>` elements rotated 90° via `rotateX`/`rotateY` + `translateZ` to form a shallow box (5px deep). Four faces: left (0.84), right (0.68), top (0.92), bottom (0.58) brightness multipliers.
- **Glass tile effect**: tile interior is `transparent` padding-box; only the 1.5px border carries the 135° gradient (`rgba(r,g,b,0.80)` → `rgba(r,g,b,0.30)`). Fancy graphics adds `backdrop-filter: blur(4px)`.
- **Fancy graphics toggle** persists across 2D↔3D mode switches — state is held in `fancyGraphics` module variable; the pill re-syncs its visual on each `open()`.
- **JPEG export** (`renderExport3D`) replicates the CSS 3D projection on a canvas using a manual `project()` function with the same transform order as CSS (`scale → rotateY → rotateX`), affine text warping, gradient fills, per-face extrusion with gradients, and optional backdrop-blur simulation.

### API
```js
CF3D.open()           // switch to 3D
CF3D.close()          // return to 2D
CF3D.toggle()         // toggle
CF3D.isOpen()         // boolean
CF3D.renderExport3D() // returns a canvas element (JPEG source)
```

---

## What's Built vs What's Pending

### Done ✅
- Full Make mode: draw, resize, drag, right-click delete, save glyphs
- Full Test mode: type text, multiline with line breaks, `_name_` syntax for named glyphs
- Physics-based block overlap (up to 3 lanes per column)
- Palette system (SOLID / MIXED / COLORFUL, 5 colour sets)
- Tone system (dynamic, data-driven from calfont-tones.js)
- Preset alphabet (A–Z + punctuation, from calfont-presets.js)
- SVG export (flat grouped structure, Figma-friendly)
- PNG export (4× resolution)
- Calendar export to .ics (date picker, col→day mapping)
- Session save/load (JSON)
- Glyph overwrite confirmation with preview
- Cursor feedback (crosshair/grab/grabbing/ns-resize)
- Zoom (scroll wheel)
- Toast notifications
- 3D mode (CSS 3D, orbit controls, fancy graphics blur, JPEG export)
- HiDPI/Retina canvas rendering (`p.pixelDensity(window.devicePixelRatio)`)

### Pending / Not Yet Implemented
- **Calendar modal in Webflow embed** — the engine supports it (`#cf-cal-modal`) but the modal HTML may not be in the current Webflow embed snippet yet. See snippet in handover for what to add.
- **Session button in Webflow menu** — session save/load was moved from the calendar button to a menu item (`#cf-session-btn`). A "Session" button needs to be added to the Webflow nav alongside About and Controls, with a click listener opening `#cf-saveload-modal`.
- **Gallery / collective archive** — described in concept but not built
- **Google Calendar API (Option B)** — currently using .ics download (Option A). Direct API integration would require OAuth and a Google Cloud project.

---

## Webflow-Specific Notes

- The tool lives inside a Webflow custom embed component
- All modal CSS is in the embed snippet (not Webflow's style panel) because modals are injected HTML
- UI element styling (buttons, inputs, chips) uses Webflow native classes: `cf-btn-lg`, `cf-btn-sm`, `cf-btn-add`, `cf-chip`, `cf-input` with combo classes for variants
- `CF.config.baseDayWidth` and `CF.config.baseHourHeight` are set inside `DOMContentLoaded` before `CF.init()`
- The `#cf-type-input` textarea height is fixed at 42px via inline style after init (prevents auto-grow)
