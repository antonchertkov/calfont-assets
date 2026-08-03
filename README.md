# calfont-assets

Files for the **CalFont** tool on chertkov.design. Same deployment pattern as
`gradienttype-assets` / `ideascape-assets`: self-contained script on GitHub, served via
jsDelivr, embedded natively in a Webflow page (no iframe, no backend).

## v2.0 — clean self-contained build (current)

`calfont.js` is the **whole tool in one isolated bundle**: it injects its own styles and
UI into a single `<div id="cf-root">`, so there are no hand-built Webflow UI elements and
no dependency on the Webflow component library. Includes the V2 **3D view** (pure CSS
`preserve-3d` — no three.js) and the calendar-export (`.ics`) feature.

| File | Role |
|------|------|
| `calfont.js` | The whole tool — styles, UI, engine, presets, tones, CSS-3D view, all isolated. |
| `p5.min.js` | p5.js 1.9.0 (vendor) — the 2D canvas library. Load before `calfont.js`. |

**Embed** (`calfont-embed.html`): one container div + p5 + the bundle. That's it.

### Isolation
- JS namespaced (`window.CF` / `window.CF3D`); engine internals are IIFE-wrapped (no leaks).
- All CSS scoped under `#cf-root` (your `calfont-webflow.css` + inline styles), so the tool
  can't touch the rest of the page. `@font-face` rules stay global (fonts load from your
  Webflow CDN via absolute URLs). Verified against a hostile host page.
- Full-viewport tool (the 3D overlay needs the viewport), so it mounts a fixed full-screen
  layer — give its Webflow page a blank layout with the nav hidden.
- **Note:** because it reuses your `cf-*` / `p3` class names (scoped), a cleanest end-state
  is to remove the old CalFont component-library classes from the Webflow project once you
  cut over — then there is zero chance of overlap.

### Versioning
Embed pins to `@v2.0`. To update: push, `git tag v2.1 && git push origin v2.1`, bump the
version in the embed. Nothing changes live until you do.

## v1.x — original build (still present, for the currently-live embed)

`calfont-engine.js`, `calfont-presets.js`, `calfont-tones.js` — the original files loaded
by the old Webflow embed (UI built in Webflow). Tags `v1.0`–`v1.7`. Kept so the live site
keeps working until the v2.0 cutover; safe to retire afterwards.

## Local preview
Open `index.html` from a local web server (`python3 -m http.server`).
