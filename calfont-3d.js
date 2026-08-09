// calfont-3d.js — CSS 3D renderer for CalFont
// Uses CSS transform-style:preserve-3d + backdrop-filter:blur() instead of WebGL.
// Public API unchanged: CF3D.open() / .close() / .toggle() / .isOpen()

// ── Constants ──────────────────────────────────────────────────────────────
const LAYER_STEP    = 14;    // px between Z layers (after display scaling)
const DEPTH_PX      = 5;     // extrusion depth of each panel (CSS px, constant)
const BLUR_PX       = 4;     // backdrop-filter blur radius (used when fancy graphics on)
const BLOCK_OPACITY = 0.18;  // block fill opacity — 0.0 = pure glass, 1.0 = fully opaque
const INIT_ROT_X    = 0;     // straight on — matches 2D view exactly
const INIT_ROT_Y    = 0;     // no side yaw
const MORPH_MS      = 500;   // open / close fade duration
const TILT_MS       = 650;   // 2D→3D camera tilt animation duration

// Tile appear / disappear animation (test mode only)
const ANIM_DIST      = 90;   // z-travel distance for enter/exit (CSS px toward/away camera)
const ANIM_ENTER_MS  = 370;  // enter transition duration
const ANIM_EXIT_MS   = 260;  // exit transition duration (slightly faster feels snappier)
const LAYER_STAGGER  = 55;   // extra delay per layer index (ms)
const ROW_STAGGER    = 18;   // extra delay per row within a layer, top-to-bottom (ms)

// ── State ──────────────────────────────────────────────────────────────────
let overlay  = null;   // #cf-3d-overlay div
let sceneEl  = null;   // perspective container
let stackEl  = null;   // preserve-3d rotatable group
let active   = false;
let initialized = false;
let lastSceneHash = -1;
let hashTimer     = null;
let rebuildScheduled = false;
let fancyGraphics    = false;   // backdrop-filter blur — off by default for performance
let fancyToggleEl    = null;    // the toggle pill element
let isMakeMode       = false;   // true = glyph editor, false = assembly/test view
let ghostEl          = null;    // persistent ghost block element for drag preview
let ghostRafId       = null;    // requestAnimationFrame id for ghost updates

// Make mode hover tracking — populated by buildScene, used by doc-level mousemove
let hoverTrackMap    = [];      // [{front, nubEl, nubColor, nubH, r, g, blue, rx, ry, rw, rh, nubTopY, nubBotY}]
let hoveredEntry     = null;    // currently highlighted entry
let makeHoverListener = null;   // document mousemove fn (so we can remove it)
let lastMX = 0, lastMY = 0;    // last known mouse coords for re-applying after rebuild

// Tile enter/exit animation tracking (test mode only)
// Maps blockId → { wrapper, front, block, zPos, layer, ry } from the previous buildScene call.
// Used to diff new vs persisting vs leaving blocks for animation, and for export rendering.
let blockWrapperMap = new Map();
let rafLastZoom = -1;   // tracks CF._zoom; change triggers immediate rebuild in Make mode

// Saved test-mode camera state — preserved across make↔test switches so the user
// doesn't lose their orbit/zoom when briefly flipping to make mode and back.
let savedTestRotX  = INIT_ROT_X;
let savedTestRotY  = INIT_ROT_Y;
let savedTestZoom  = 1;

function blockId(b) {
  // Use zoom=1 normalised position — unique per block across columns.
  // b.d is an internal engine field not present in snapshot blocks, so we
  // cannot use it here. x/y/w/h are stable across zoom changes.
  return `${Math.round(b.x * 100)}_${Math.round(b.y * 100)}_${Math.round(b.w)}_${Math.round(b.h)}`;
}

let rotX      = INIT_ROT_X;
let rotY      = INIT_ROT_Y;
let zoomScale = 1;

// Drag
let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let dragRotX   = 0, dragRotY   = 0;

// Touch pinch
let lastPinchDist = 0;

// ── Helpers ────────────────────────────────────────────────────────────────
function toHHMM(h) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
}

// Parse any CSS color string → {r,g,b} using an offscreen 1×1 canvas.
function colorToRgb(color) {
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  const ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return { r, g, b };
}

function quickHash(snap) {
  let h = snap.blocks.length * 7919;
  // Include zoom so view-only changes (no block data change) still trigger a rebuild.
  h = (h * 31 + Math.round((snap.zoom || 1) * 1000)) | 0;
  snap.blocks.forEach(b => {
    h = (h * 31 + ((b.x + b.y + b.w + b.h) | 0)) | 0;
    for (let i = 0; i < b.color.length; i++) h = (h * 31 + b.color.charCodeAt(i)) | 0;
    for (let i = 0; i < b.title.length; i++) h = (h * 31 + b.title.charCodeAt(i)) | 0;
    h = (h * 31 + (b.outlined ? 1 : 0)) | 0;
  });
  return h >>> 0;
}

// ── Layer assignment ───────────────────────────────────────────────────────
// Identical logic to the Three.js version — pixel-y overlap only, baseX quantised.
function colKey(block, baseX) {
  const colW = (window.CF && window.CF.config && window.CF.config.baseDayWidth) || 140;
  return Math.floor((block.x - baseX + block.w * 0.5) / colW);
}

function conflictsInColumn(a, b) {
  return !(a.y + a.h <= b.y || b.y + b.h <= a.y);
}

function assignLayers(blocks) {
  const colW    = (window.CF && window.CF.config && window.CF.config.baseDayWidth) || 140;
  const rawBaseX = blocks.reduce((m, b) => Math.min(m, b.x), Infinity);
  const baseX    = Math.floor(rawBaseX / colW) * colW;
  const colGroups = new Map();
  blocks.forEach((block, i) => {
    const k = colKey(block, baseX);
    if (!colGroups.has(k)) colGroups.set(k, []);
    colGroups.get(k).push({ block, origIdx: i });
  });
  const result = new Array(blocks.length).fill(0);
  colGroups.forEach(group => {
    group.sort((a, b) => (a.block.s - b.block.s) || (a.block.x - b.block.x));
    const layerOccupants = [];
    group.forEach(({ block, origIdx }) => {
      let layer = 0;
      while (layerOccupants[layer] && layerOccupants[layer].some(b => conflictsInColumn(block, b))) layer++;
      if (!layerOccupants[layer]) layerOccupants[layer] = [];
      layerOccupants[layer].push(block);
      result[origIdx] = layer;
    });
  });
  return result;
}

// ── Apply current rotation + zoom to the stack ────────────────────────────
function applyTransform() {
  if (!stackEl) return;
  stackEl.style.transform =
    `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${zoomScale})`;
}

// ── Make mode hover tracking ───────────────────────────────────────────────
// Pointer events are NONE on all block wrappers so p5 receives all gesture
// events (drag, resize, cursor changes). Instead we do AABB hit testing via
// a document-level mousemove listener, using the known viewport rect of each block.

function applyHoverState(mx, my) {
  if (!active || !isMakeMode) return;

  // Find topmost block under cursor — iterate reverse so highest-layer wins
  let found = null;
  let foundIsNub = false;
  for (let i = hoverTrackMap.length - 1; i >= 0; i--) {
    const e = hoverTrackMap[i];
    if (mx >= e.rx && mx <= e.rx + e.rw && my >= e.ry && my <= e.nubBotY) {
      found = e;
      foundIsNub = my >= e.nubTopY;
      break;
    }
  }

  if (found === hoveredEntry && found === null) return; // nothing changed

  // Clear previous hover
  if (hoveredEntry && hoveredEntry !== found) {
    hoveredEntry.front.style.borderColor = '';
    hoveredEntry.front.style.boxShadow   = '';
    if (hoveredEntry.nubEl) {
      hoveredEntry.nubEl.style.height     = hoveredEntry.nubH + 'px';
      hoveredEntry.nubEl.style.background = hoveredEntry.nubColor;
    }
  }

  hoveredEntry = found;
  if (!found) return;

  // Apply hover highlight to front face
  const { front, nubEl, r, g, blue, nubH, nubColor } = found;
  front.style.borderColor = `rgba(${r},${g},${blue},0.85)`;
  front.style.boxShadow   = `0 0 0 1px rgba(${r},${g},${blue},0.35), 0 2px 12px rgba(0,30,80,0.18)`;

  // Nub highlight when cursor is in nub zone
  if (nubEl) {
    if (foundIsNub) {
      nubEl.style.height     = Math.round(nubH * 1.6) + 'px';
      nubEl.style.background = 'rgba(11,11,11,0.47)';
    } else {
      nubEl.style.height     = nubH + 'px';
      nubEl.style.background = nubColor;
    }
  }
}

function setupMakeHover() {
  if (makeHoverListener) return;
  makeHoverListener = e => {
    lastMX = e.clientX;
    lastMY = e.clientY;
    applyHoverState(lastMX, lastMY);
  };
  document.addEventListener('mousemove', makeHoverListener, { passive: true });
}

function teardownMakeHover() {
  if (makeHoverListener) {
    document.removeEventListener('mousemove', makeHoverListener);
    makeHoverListener = null;
  }
  // Clear any residual hover highlight
  if (hoveredEntry) {
    hoveredEntry.front.style.borderColor = '';
    hoveredEntry.front.style.boxShadow   = '';
    if (hoveredEntry.nubEl) {
      hoveredEntry.nubEl.style.height     = hoveredEntry.nubH + 'px';
      hoveredEntry.nubEl.style.background = hoveredEntry.nubColor;
    }
    hoveredEntry = null;
  }
  hoverTrackMap = [];
}

// ── Build / rebuild the CSS 3D scene ──────────────────────────────────────
// skipAnim=true suppresses enter/exit animations (used on mode switches so the
// camera tilt transition carries the visual weight instead of tile animations).
function buildScene(snapshot, skipAnim = false) {
  if (!stackEl) return;

  hoverTrackMap = [];
  hoveredEntry  = null;

  const shouldAnimate = !isMakeMode && !skipAnim;

  // Capture the previous wrapper map before we reset it. Any block id in
  // prevMap that is not in the new snapshot is a "leaving" block.
  const prevMap = blockWrapperMap;
  blockWrapperMap = new Map();

  const blocks = snapshot.blocks;

  // ── Exit animation for leaving blocks ─────────────────────────────────────
  // Must happen BEFORE stackEl.innerHTML='' so we can re-parent the wrappers.
  if (shouldAnimate && prevMap.size > 0) {
    const currentIds = new Set(blocks.map(b => blockId(b)));
    const leaving = [];
    prevMap.forEach((entry, id) => {
      if (!currentIds.has(id)) leaving.push(entry);
    });
    if (leaving.length > 0) {
      // Layer 0 first, then top-to-bottom within each layer
      leaving.sort((a, b) => a.layer - b.layer || a.ry - b.ry);
      let layerRow = new Map();
      leaving.forEach(e => {
        const cnt = layerRow.get(e.layer) || 0;
        e.rowIdx = cnt;
        layerRow.set(e.layer, cnt + 1);
      });

      // Re-parent leaving wrappers into a temporary container that mirrors
      // stackEl's current camera transform exactly. Without this, moving them
      // to sceneEl would strip the rotateX/rotateY/scale, making blocks jump
      // to the default (unrotated) position before animating out.
      const exitContainer = document.createElement('div');
      exitContainer.style.cssText = [
        `position:absolute`,
        `left:${stackEl.style.left || '0'};top:${stackEl.style.top || '0'}`,
        `width:${stackEl.style.width};height:${stackEl.style.height}`,
        `transform-style:preserve-3d`,
        `transform:rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${zoomScale})`,
      ].join(';');
      sceneEl.appendChild(exitContainer);

      let maxDelay = 0;
      leaving.forEach(({ wrapper, zPos, layer, rowIdx }) => {
        if (!wrapper.parentNode) return;
        exitContainer.appendChild(wrapper);
        const delay = layer * LAYER_STAGGER + rowIdx * ROW_STAGGER;
        if (delay > maxDelay) maxDelay = delay;
        requestAnimationFrame(() => {
          wrapper.style.transition =
            `transform ${ANIM_EXIT_MS}ms cubic-bezier(0.4,0,1,1) ${delay}ms,` +
            `opacity ${ANIM_EXIT_MS}ms ease ${delay}ms`;
          wrapper.style.transform = `translateZ(${zPos - ANIM_DIST}px)`;
          wrapper.style.opacity   = '0';
        });
      });

      setTimeout(() => exitContainer.remove(), ANIM_EXIT_MS + maxDelay + 80);
    }
  }

  // Clear the scene (leaving blocks have already been re-parented above)
  stackEl.innerHTML = '';

  // Mirror the 2D background color so the overlay matches exactly
  if (overlay && snapshot.bgColor) overlay.style.background = snapshot.bgColor;


  // ── Column guides ────────────────────────────────────────────────────────
  if (snapshot.colWidthPx && snapshot.colWidthPx > 0) {
    const colW = snapshot.colWidthPx;
    const ox   = snapshot.originVX || 0;
    const vTop = snapshot.canvasVY || 0;
    const vh   = window.innerHeight;
    const vw2  = window.innerWidth;

    // Guide vertical extent:
    // Make mode — extend far beyond the viewport so lines feel infinite.
    // Test mode — cover the full screen plus all block bounds plus generous
    //             padding so the tilted camera never reveals an edge.
    let guideTop, guideH;
    if (isMakeMode) {
      const ext = vh * 3;
      guideTop = vTop - ext;
      guideH   = vh + ext * 2;
    } else {
      let minY = vTop, maxY = vTop + vh;
      blocks.forEach(b => {
        if (b.ry           < minY) minY = b.ry;
        if (b.ry + b.rh    > maxY) maxY = b.ry + b.rh;
      });
      const pad = vh * 0.55; // generous padding handles any camera tilt
      guideTop = minY - pad;
      guideH   = (maxY - minY) + pad * 2;
    }

    const firstCol = Math.floor(-ox / colW) - 1;
    const lastCol  = Math.ceil((vw2 - ox) / colW) + 1;

    // Test mode: fade parameters for per-guide gradients (never touches blocks).
    // Make mode: solid, infinite guides — no fade needed.
    const FADE_W = vw2 * 0.10; // horizontal edge fade zone (10 % of viewport width)
    const fy     = !isMakeMode ? Math.round(vh * 0.14) : 0; // vertical fade zone height

    for (let col = firstCol; col <= lastCol; col++) {
      const x = ox + col * colW;
      if (x < -colW || x > vw2 + colW) continue;

      let bgStyle;
      if (isMakeMode) {
        bgStyle = 'rgba(0,0,0,0.06)';
      } else {
        // Left/right edge fade: guides near the viewport edges fade out.
        const distFromEdge = Math.min(Math.max(0, x), Math.max(0, vw2 - x));
        const edgeFade = Math.max(0.05, Math.min(1, distFromEdge / FADE_W));
        const ga = (0.06 * edgeFade).toFixed(4);

        // Top/bottom gradient: transparent outside the viewport, fades in over fy px.
        // All percentages are relative to the guide's total height (guideH).
        const vsY = -guideTop; // y-offset within the guide where the viewport top sits
        const clamp = (v) => Math.max(0, Math.min(100, v));
        const p1 = clamp(vsY / guideH * 100).toFixed(2);
        const p2 = clamp((vsY + fy) / guideH * 100).toFixed(2);
        const p3 = clamp((vsY + vh - fy) / guideH * 100).toFixed(2);
        const p4 = clamp((vsY + vh) / guideH * 100).toFixed(2);

        bgStyle = `linear-gradient(to bottom,transparent 0%,transparent ${p1}%,rgba(0,0,0,${ga}) ${p2}%,rgba(0,0,0,${ga}) ${p3}%,transparent ${p4}%,transparent 100%)`;
      }

      const guide = document.createElement('div');
      guide.style.cssText = [
        `position:absolute`,
        `left:${x}px; top:${guideTop}px`,
        `width:1px; height:${guideH}px`,
        `background:${bgStyle}`,
        `pointer-events:none`,
        `transform:translateZ(0px)`,
      ].join(';');
      stackEl.appendChild(guide);
    }
  }

  if (!blocks.length) return;

  // Use raw viewport coords so the flat (rotX=0,rotY=0) starting frame is a
  // pixel-perfect match of the 2D view. stackEl fills the full viewport;
  // each block sits at its actual screen position.
  const vw = window.innerWidth, vh = window.innerHeight;
  stackEl.style.width    = vw + 'px';
  stackEl.style.height   = vh + 'px';
  stackEl.style.position = 'absolute';
  stackEl.style.left     = '0';
  stackEl.style.top      = '0';

  // Perspective centred on viewport — 2.5× diagonal keeps perspective subtle.
  sceneEl.style.perspective = (Math.hypot(vw, vh) * 2.5) + 'px';
  sceneEl.style.perspectiveOrigin = '50% 50%';

  // Text/padding metrics scale with the actual 2D zoom so they match exactly.
  const ds = snapshot.zoom || 1;
  const C        = (window.CF && window.CF.config) || {};
  const fontSize = (C.blockFontSize || 10) * ds;
  const padSide  = (C.blockPadSide  || 10) * ds;
  const padTop   = (C.blockPadTop   ||  6) * ds;
  const borderR  = (C.blockRadius   || 5.6) * ds;

  const { r: bgR, g: bgG, b: bgB } = colorToRgb(snapshot.bgColor || '#D9D9D9');

  const layers = assignLayers(blocks);

  // Append back-to-front so DOM painter order is correct when preserve-3d is unavailable.
  const order = blocks.map((_, i) => i).sort((a, b) => layers[a] - layers[b]);

  // Blocks identified as new (not in prevMap) are collected here so we can
  // apply staggered enter animations after all elements are in the DOM.
  const enterQueue = [];

  order.forEach(i => {
    const block = blocks[i];
    const L = layers[i];
    const { r, g, b: blue } = colorToRgb(block.color);

    // Use raw viewport-space position so start frame matches 2D exactly
    const w    = block.rw;
    const h    = block.rh;
    const cx   = block.rx + w / 2;   // block centre X in viewport space
    const cy   = block.ry + h / 2;   // block centre Y in viewport space
    const zPos = L * LAYER_STEP + i * 0.05;
    const D    = DEPTH_PX;

    // ── Wrapper — zero-size anchor at block centre, owns all faces ───────
    const wrapper = document.createElement('div');
    // transform is set separately so animation code can override it cleanly.
    wrapper.style.cssText = [
      `position:absolute`,
      `left:${cx}px; top:${cy}px`,
      `width:0; height:0`,
      `transform-style:preserve-3d`,
      `pointer-events:none`,
    ].join(';');
    wrapper.style.transform = `translateZ(${zPos}px)`;

    // ── Front face ─────────────────────────────────────────────────────────
    const isOutlined = !!block.outlined;
    const front = document.createElement('div');

    if (isOutlined) {
      // Outlined variant: same transparent glass as filled, colored border rim, dark text
      front.style.cssText = [
        `position:absolute`,
        `left:${-w / 2}px; top:${-h / 2}px`,
        `width:${w}px; height:${h}px`,
        `background:linear-gradient(rgba(${bgR},${bgG},${bgB},0.88),rgba(${bgR},${bgG},${bgB},0.88)) padding-box,linear-gradient(135deg,rgba(${r},${g},${blue},0.80),rgba(${r},${g},${blue},0.30)) border-box`,
        ...(fancyGraphics ? [`backdrop-filter:blur(${BLUR_PX}px)`,`-webkit-backdrop-filter:blur(${BLUR_PX}px)`] : []),
        `border:1.5px solid transparent`,
        `border-radius:${borderR}px`,
        `box-shadow:0 2px 10px rgba(0,30,80,0.10)`,
        `padding:${padTop}px ${padSide}px`,
        `box-sizing:border-box`,
        `overflow:hidden`,
        `color:rgba(${r},${g},${blue},0.90)`,
        `font-family:"DM Sans",Arial,sans-serif`,
        `user-select:none`,
      ].join(';');
    } else {
      // Filled variant: transparent glass with colored gradient border rim, light text
      front.style.cssText = [
        `position:absolute`,
        `left:${-w / 2}px; top:${-h / 2}px`,
        `width:${w}px; height:${h}px`,
        `background:linear-gradient(transparent,transparent) padding-box,linear-gradient(135deg,rgba(${r},${g},${blue},0.80),rgba(${r},${g},${blue},0.30)) border-box`,
        ...(fancyGraphics ? [`backdrop-filter:blur(${BLUR_PX}px)`,`-webkit-backdrop-filter:blur(${BLUR_PX}px)`] : []),
        `border:1.5px solid transparent`,
        `border-radius:${borderR}px`,
        `box-shadow:0 2px 10px rgba(0,30,80,0.12)`,
        `padding:${padTop}px ${padSide}px`,
        `box-sizing:border-box`,
        `overflow:hidden`,
        `color:rgba(255,255,255,0.90)`,
        `font-family:"DM Sans",Arial,sans-serif`,
        `user-select:none`,
      ].join(';');

      // Colour tint with multiply blend — separate div keeps text rendering crisp
      const tint = document.createElement('div');
      tint.style.cssText =
        `position:absolute;inset:0;` +
        `background:rgba(3,155,229,0.10);` +
        `mix-blend-mode:multiply;` +
        `border-radius:${borderR}px;` +
        `pointer-events:none`;
      front.appendChild(tint);
    }

    // Title
    if (block.title) {
      const t = document.createElement('div');
      t.style.cssText =
        `font-size:${fontSize}px;font-weight:400;line-height:1.3;` +
        `white-space:nowrap`;
      t.textContent = block.title;
      front.appendChild(t);
    }

    // Time row — same visibility guard as 2D drawBlock()
    const timeRowY = padTop + fontSize + fontSize * 1.35;
    if (block.e - block.s > 0 && timeRowY + fontSize < h - padTop * 0.5) {
      const tm = document.createElement('div');
      tm.style.cssText =
        `font-size:${fontSize}px;font-weight:400;opacity:0.65;` +
        `margin-top:${fontSize * 0.05}px;white-space:nowrap`;
      tm.textContent = toHHMM(block.s) + ' – ' + toHHMM(block.e);
      front.appendChild(tm);
    }

    // Nub drag handle — only in Make mode, matches 2D drawBlock() nub
    let nubEl    = null;
    let nubColor = null;
    let nubH     = 0;
    if (isMakeMode) {
      nubH     = Math.max(2, 3 * ds);
      const nubW = Math.round(w * 0.38);
      nubColor = isOutlined
        ? `rgba(${r},${g},${blue},0.22)`
        : `rgba(${bgR},${bgG},${bgB},0.45)`;
      nubEl = document.createElement('div');
      nubEl.style.cssText = [
        `position:absolute`,
        `bottom:${nubH}px`,
        `left:${Math.round((w - nubW) / 2)}px`,
        `width:${nubW}px`,
        `height:${nubH}px`,
        `background:${nubColor}`,
        `border-radius:${nubH / 2}px`,
        `pointer-events:none`,
      ].join(';');
      front.appendChild(nubEl);
    }

    // ── Side faces (CSS 3D box recipe) ────────────────────────────────────
    // Outlined blocks: lighter alpha on sides to match white interior
    const SIDE_ALPHA = isOutlined ? 0.50 : 0.72;
    const dim = (f) => `rgba(${Math.round(r*f)},${Math.round(g*f)},${Math.round(blue*f)},${SIDE_ALPHA})`;

    function makeSide(styles) {
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;backface-visibility:hidden;${styles}`;
      return el;
    }

    const br = borderR;

    const rightFace = makeSide(
      `left:${-D/2}px;top:${-h/2+br}px;width:${D}px;height:${h-2*br}px;` +
      `background:${dim(0.68)};transform:rotateY(90deg) translateZ(${w/2}px)`
    );
    const leftFace = makeSide(
      `left:${-D/2}px;top:${-h/2+br}px;width:${D}px;height:${h-2*br}px;` +
      `background:${dim(0.84)};transform:rotateY(-90deg) translateZ(${w/2}px)`
    );
    const topFace = makeSide(
      `left:${-w/2+br}px;top:${-D/2}px;width:${w-2*br}px;height:${D}px;` +
      `background:${dim(0.92)};transform:rotateX(-90deg) translateZ(${h/2}px)`
    );
    const bottomFace = makeSide(
      `left:${-w/2+br}px;top:${-D/2}px;width:${w-2*br}px;height:${D}px;` +
      `background:${dim(0.58)};transform:rotateX(90deg) translateZ(${h/2}px)`
    );

    wrapper.appendChild(front);
    wrapper.appendChild(leftFace);
    wrapper.appendChild(rightFace);
    wrapper.appendChild(topFace);
    wrapper.appendChild(bottomFace);

    // Make mode hover: register this block for AABB hit-testing in the
    // document mousemove listener (pointer-events:none means CSS hover won't fire).
    if (isMakeMode) {
      const rx = block.rx, ry = block.ry, rw = block.rw, rh = block.rh;
      hoverTrackMap.push({
        front, nubEl, nubColor, nubH, r, g, blue: blue,
        rx, ry, rw, rh,
        nubTopY: ry + rh - 10 * ds,
        nubBotY: ry + rh +  6 * ds,
      });
    }

    // Track for animation diffing, hover, and export rendering
    const id = blockId(block);
    blockWrapperMap.set(id, { wrapper, front, block, zPos, layer: L, ry: block.ry });
    if (shouldAnimate && !prevMap.has(id)) {
      enterQueue.push({ wrapper, zPos, layer: L, ry: block.ry });
    }

    stackEl.appendChild(wrapper);
  });

  // ── Enter animation for new blocks ────────────────────────────────────────
  // Stagger order: layer 0 first, then top-to-bottom within each layer.
  // Elements are already in the DOM so transitions will trigger correctly.
  if (shouldAnimate && enterQueue.length > 0) {
    enterQueue.sort((a, b) => a.layer - b.layer || a.ry - b.ry);
    let layerRow = new Map();
    enterQueue.forEach(e => {
      const cnt = layerRow.get(e.layer) || 0;
      e.rowIdx = cnt;
      layerRow.set(e.layer, cnt + 1);
    });
    enterQueue.forEach(({ wrapper, zPos, layer, rowIdx }) => {
      const delay = layer * LAYER_STAGGER + rowIdx * ROW_STAGGER;
      // Set off-screen starting position (toward camera = +Z)
      wrapper.style.transform = `translateZ(${zPos + ANIM_DIST}px)`;
      wrapper.style.opacity   = '0';
      // Double-RAF ensures the initial state is painted before the transition starts
      requestAnimationFrame(() => requestAnimationFrame(() => {
        wrapper.style.transition =
          `transform ${ANIM_ENTER_MS}ms cubic-bezier(0.2,0,0,1) ${delay}ms,` +
          `opacity ${Math.round(ANIM_ENTER_MS * 0.8)}ms ease ${delay}ms`;
        wrapper.style.transform = `translateZ(${zPos}px)`;
        wrapper.style.opacity   = '1';
      }));
    });
  }
}

// ── Ghost block RAF loop ───────────────────────────────────────────────────
function startGhostLoop() {
  if (ghostRafId) return;
  rafLastZoom = -1; // force sync on first tick
  // Parent to sceneEl, not stackEl — sceneEl is never cleared by buildScene
  // so the ghost survives every scene rebuild triggered by block placement.
  ghostEl = document.createElement('div');
  ghostEl.style.cssText = `position:absolute;pointer-events:none;display:none;`;
  if (sceneEl) sceneEl.appendChild(ghostEl);
  setupMakeHover();

  function tick() {
    if (!active || !isMakeMode) { stopGhostLoop(); return; }

    // Ghost create preview
    const gr = window.CF && window.CF._ghostRect;
    if (gr && ghostEl) {
      const { rx, ry, rw, rh, color } = gr;
      const { r, g, b } = colorToRgb(color);
      ghostEl.style.cssText = [
        `position:absolute`,
        `left:${rx}px;top:${ry}px`,
        `width:${rw}px;height:${rh}px`,
        `border:1.5px solid rgba(${r},${g},${b},0.6)`,
        `background:rgba(${r},${g},${b},0.12)`,
        `border-radius:${Math.round((window.CF.config && window.CF.config.blockRadius || 5.6))}px`,
        `box-sizing:border-box`,
        `pointer-events:none`,
        `display:block`,
      ].join(';');
    } else if (ghostEl) {
      ghostEl.style.display = 'none';
    }

    // Fast rebuild during active drag/resize/create, AND whenever zoom changes.
    // CF._zoom is a cheap scalar set every p5 draw frame — no DOM reads required.
    // The hash guard means we only touch the DOM when something actually changed.
    const cfZoom = window.CF && window.CF._zoom;
    const zoomChanged = cfZoom !== rafLastZoom;
    if (zoomChanged) rafLastZoom = cfZoom;

    if (window.CF && (window.CF._interacting || zoomChanged)) {
      try {
        const snap = window.CF.getSnapshot();
        const h = quickHash(snap);
        if (h !== lastSceneHash) {
          lastSceneHash = h;
          buildScene(snap);
          applyHoverState(lastMX, lastMY);
        }
      } catch(_) {}
    }

    ghostRafId = requestAnimationFrame(tick);
  }
  ghostRafId = requestAnimationFrame(tick);
}

function stopGhostLoop() {
  if (ghostRafId) { cancelAnimationFrame(ghostRafId); ghostRafId = null; }
  if (ghostEl) { ghostEl.remove(); ghostEl = null; }
  teardownMakeHover();
}

// ── Input handlers ─────────────────────────────────────────────────────────
function onPointerDown(e) {
  if (e.button !== 0) return;
  if (isMakeMode) return;
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  dragRotX   = rotX;
  dragRotY   = rotY;
  overlay.setPointerCapture(e.pointerId);
}

function onPointerMove(e) {
  if (!isDragging) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  rotY = dragRotY + dx * 0.35;
  rotX = Math.max(-70, Math.min(70, dragRotX - dy * 0.35));
  applyTransform();
}

function onPointerUp() { isDragging = false; }

function onWheel(e) {
  e.preventDefault();
  // Multiplicative zoom — feels natural, prevents runaway acceleration.
  const factor = Math.pow(0.999, e.deltaY);
  zoomScale = Math.max(0.3, Math.min(3.0, zoomScale * factor));
  applyTransform();
}

function onTouchStart(e) {
  if (e.touches.length === 2) {
    lastPinchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }
}

function onTouchMove(e) {
  if (e.touches.length === 2 && lastPinchDist) {
    const d = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    zoomScale = Math.max(0.3, Math.min(3.0, zoomScale * (d / lastPinchDist)));
    lastPinchDist = d;
    applyTransform();
  }
}

// ── Input-driven rebuild (debounced) ──────────────────────────────────────
// Typing fires many input events per second. We wait 220ms after the last
// keystroke before rebuilding — avoids tearing down + recreating all DOM
// elements on every character while still feeling near-instant on pauses.
let rebuildDebounceTimer = null;
function scheduleRebuild() {
  if (!active) return;
  clearTimeout(rebuildDebounceTimer);
  rebuildDebounceTimer = setTimeout(() => {
    if (!active) return;
    try {
      const snap = window.CF.getSnapshot();
      const h = quickHash(snap);
      if (h !== lastSceneHash) { lastSceneHash = h; buildScene(snap); }
    } catch (_) {}
  }, 220);
}

// ── DOM setup (once) ───────────────────────────────────────────────────────
function setup() {
  overlay = document.getElementById('cf-3d-overlay');
  if (!overlay) throw new Error('CF3D: #cf-3d-overlay missing');

  // Background gradient (the overlay div is already position:fixed inset:0 z-50)
  // Background is set per-snapshot in buildScene() to match the 2D view
  overlay.style.opacity     = '0';
  overlay.style.transition  = `opacity ${MORPH_MS}ms ease`;

  // Perspective container — fills overlay, centres the stack
  sceneEl = document.createElement('div');
  sceneEl.style.cssText = 'position:absolute;inset:0;';
  overlay.appendChild(sceneEl);

  // The rotatable 3D group
  stackEl = document.createElement('div');
  stackEl.style.transformStyle = 'preserve-3d';
  stackEl.style.position       = 'relative';
  sceneEl.appendChild(stackEl);

  // Pointer / wheel / touch
  overlay.addEventListener('pointerdown',   onPointerDown);
  overlay.addEventListener('pointermove',   onPointerMove);
  overlay.addEventListener('pointerup',     onPointerUp);
  overlay.addEventListener('pointercancel', onPointerUp);
  overlay.addEventListener('wheel', onWheel, { passive: false });
  overlay.addEventListener('touchstart', onTouchStart, { passive: true });
  overlay.addEventListener('touchmove',  onTouchMove,  { passive: true });

  window.addEventListener('resize', () => {
    if (!active) return;
    try { buildScene(window.CF.getSnapshot()); applyTransform(); } catch (_) {}
  });

  initialized = true;
}

// ── Fancy-graphics toggle pill ─────────────────────────────────────────────
function buildFancyToggle() {
  // Position below the top menu bar
  const menuEl = document.getElementById('cf-top-bar') ||
                 document.querySelector('.tools-cf-wrapper-menu');
  const menuBottom = menuEl ? menuEl.getBoundingClientRect().bottom : 56;

  const pill = document.createElement('div');
  pill.id = 'cf-3d-fancy-toggle';
  pill.className = 'cf-btn-sm';
  // Positional overrides only — visual styling comes from cf-btn-sm
  pill.style.cssText =
    `position:fixed;top:${menuBottom + 8}px;left:50%;` +
    `transform:translateX(-50%);z-index:65;gap:8px;white-space:nowrap;user-select:none;`;

  // Switch track
  const track = document.createElement('div');
  track.style.cssText =
    `width:28px;height:16px;border-radius:8px;position:relative;` +
    `background:#b0b0b0;transition:background 0.25s;flex-shrink:0`;
  const knob = document.createElement('div');
  knob.style.cssText =
    `width:12px;height:12px;border-radius:50%;background:#fff;` +
    `position:absolute;top:2px;left:2px;transition:transform 0.25s;box-shadow:0 1px 3px rgba(0,0,0,0.25)`;
  track.appendChild(knob);

  const label = document.createElement('span');
  label.textContent = 'Fancy graphics';

  pill.appendChild(track);
  pill.appendChild(label);

  function setOn(on) {
    fancyGraphics = on;
    knob.style.transform   = on ? 'translateX(12px)' : 'translateX(0)';
    track.style.background = on ? 'var(--cf-active-color, #0b0b0b)' : '#b0b0b0';
    try {
      const snap = window.CF.getSnapshot();
      lastSceneHash = quickHash(snap);
      buildScene(snap);
    } catch (_) {}
  }

  // Sync visual state to current fancyGraphics value (persists across 2D↔3D switches)
  knob.style.transform   = fancyGraphics ? 'translateX(12px)' : 'translateX(0)';
  track.style.background = fancyGraphics ? 'var(--cf-active-color, #0b0b0b)' : '#b0b0b0';

  // Stop propagation on pointerdown so the overlay drag handler doesn't
  // swallow the interaction before the click fires.
  pill.addEventListener('pointerdown', e => e.stopPropagation());
  pill.addEventListener('click', () => setOn(!fancyGraphics));

  // Mount on body so it sits above the menu bar (z-index 65 > menu z-index 60)
  document.body.appendChild(pill);
  return pill;
}

// ── Public API ─────────────────────────────────────────────────────────────
function open() {
  if (!window.CF || typeof window.CF.getSnapshot !== 'function') {
    console.error('CF3D: CF.getSnapshot not available'); return;
  }
  if (!initialized) setup();
  if (active) return;
  active = true;

  // Start flat (matching the 2D top-down view), then tilt into perspective.
  // Also reset saved test state so each 3D session starts from a known position.
  rotX = 0; rotY = 0; zoomScale = 1;
  savedTestRotX = INIT_ROT_X; savedTestRotY = INIT_ROT_Y; savedTestZoom = 1;

  const snap = window.CF.getSnapshot();
  isMakeMode = !!snap.isMakeMode;
  lastSceneHash = quickHash(snap);
  buildScene(snap);
  applyTransform();

  overlay.style.pointerEvents = isMakeMode ? 'none' : 'auto';
  if (isMakeMode) startGhostLoop();

  fancyToggleEl = buildFancyToggle();

  setSvgExportVisibility(false);

  overlay.style.display = 'block';
  // Double-RAF ensures display:block has been painted before transitions fire.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    overlay.style.opacity = '1';

    // In make mode stay flat (straight-on = the drawing surface).
    // In test mode animate to the standard 3D perspective tilt.
    stackEl.style.transition = `transform ${TILT_MS}ms cubic-bezier(0.4,0,0.2,1)`;
    rotX = isMakeMode ? 0 : INIT_ROT_X;
    rotY = isMakeMode ? 0 : INIT_ROT_Y;
    applyTransform();
    setTimeout(() => { if (stackEl) stackEl.style.transition = ''; }, TILT_MS);
  }));

  document.addEventListener('input', scheduleRebuild);

  // Polling fallback for changes not triggered by input events
  hashTimer = setInterval(() => {
    if (!active) return;
    try {
      const snap = window.CF.getSnapshot();
      const h = quickHash(snap);
      if (h !== lastSceneHash) { lastSceneHash = h; buildScene(snap); }
    } catch (_) {}
  }, 250);
}

function close() {
  if (!active) return;
  active = false;
  document.removeEventListener('input', scheduleRebuild);
  if (hashTimer) { clearInterval(hashTimer); hashTimer = null; }
  stopGhostLoop();
  teardownMakeHover();
  blockWrapperMap = new Map();

  if (fancyToggleEl) { fancyToggleEl.remove(); fancyToggleEl = null; }

  // Tilt back to flat before fading out; reset zoomScale so the close
  // animation doesn't pop to an unexpected scale.
  if (stackEl) {
    stackEl.style.transition = `transform ${Math.round(TILT_MS * 0.7)}ms cubic-bezier(0.4,0,0.2,1)`;
    rotX = 0; rotY = 0; zoomScale = 1;
    applyTransform();
  }

  setSvgExportVisibility(true);
  overlay.style.opacity = '0';
  setTimeout(() => {
    if (!active) overlay.style.display = 'none';
    if (stackEl) stackEl.style.transition = '';
  }, MORPH_MS);
}

function toggle() { active ? close() : open(); }
function isOpen()  { return active; }

// Called by the engine when the user switches between Make and Test mode.
// Resets camera to straight-on for Make, re-enables orbit for Test.
function onModeChange(newIsMakeMode) {
  if (!active) return;

  // When leaving test mode, save its camera state so re-entering restores it.
  if (!isMakeMode && newIsMakeMode) {
    savedTestRotX = rotX;
    savedTestRotY = rotY;
    savedTestZoom = zoomScale;
  }

  isMakeMode = newIsMakeMode;

  if (overlay) overlay.style.pointerEvents = isMakeMode ? 'none' : 'auto';
  if (isMakeMode) startGhostLoop(); else stopGhostLoop();

  // Animate camera to straight-on for Make; restore saved orbit/zoom for Test.
  if (stackEl) {
    stackEl.style.transition = `transform ${TILT_MS}ms cubic-bezier(0.4,0,0.2,1)`;
    if (isMakeMode) {
      rotX = 0; rotY = 0; zoomScale = 1;
    } else {
      rotX = savedTestRotX; rotY = savedTestRotY; zoomScale = savedTestZoom;
    }
    applyTransform();
    setTimeout(() => { if (stackEl) stackEl.style.transition = ''; }, TILT_MS);
  }

  // Clear animation tracking — mode switch is its own visual transition
  blockWrapperMap = new Map();

  // Rebuild so column guides re-render at correct opacity and hover states update
  try {
    const snap = window.CF.getSnapshot();
    lastSceneHash = quickHash(snap);
    buildScene(snap, true); // skipAnim — camera tilt carries the visual weight
  } catch(_) {}
}

// ── 3D JPEG export ─────────────────────────────────────────────────────────
// Replicates the CSS 3D projection in Canvas 2D by manually applying the same
// rotateX/rotateY/scale transform as stackEl and then projecting through the
// CSS perspective value. getBoundingClientRect() is unreliable inside
// transform-style:preserve-3d contexts and returns pre-perspective positions.
function renderExport3D() {
  if (!blockWrapperMap.size) return null;

  const snap     = window.CF && typeof window.CF.getSnapshot === 'function' ? window.CF.getSnapshot() : null;
  const bgCol    = (snap && snap.bgColor) || '#D9D9D9';
  const snapZoom = (snap && snap.zoom)    || 1;
  const cfg      = (window.CF && window.CF.config) || {};
  const { r: bgR, g: bgG, b: bgB } = colorToRgb(bgCol);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // CSS perspective = Math.hypot(vw, vh) * 2.5  (set in buildScene)
  const P  = Math.hypot(vw, vh) * 2.5;
  // Perspective origin is the centre of sceneEl (= full viewport)
  const pcx = vw / 2, pcy = vh / 2;

  const rxRad = rotX * Math.PI / 180;
  const ryRad = rotY * Math.PI / 180;
  const cosX  = Math.cos(rxRad), sinX = Math.sin(rxRad);
  const cosY  = Math.cos(ryRad), sinY = Math.sin(ryRad);

  // Project a viewport-space point (px, py, pz) through the same transform
  // chain as: stackEl[rotateX rotateY scale] → CSS perspective.
  // CSS transform: T1 T2 T3 applied to a point = T1(T2(T3(point))), so the
  // point is transformed right-to-left: scale first, then rotateY, then rotateX.
  // CSS scale(n) = scale3d(n,n,1) — does NOT scale Z.
  function project(px, py, pz) {
    // scale (X/Y only — applied first to the point)
    let x = (px - pcx) * zoomScale;
    let y = (py - pcy) * zoomScale;
    let z = pz;
    // rotateY (applied second)
    const x2 =  x * cosY + z * sinY;
    const y2 =  y;
    const z2 = -x * sinY + z * cosY;
    // rotateX (applied last)
    const x3 =  x2;
    const y3 =  y2 * cosX - z2 * sinX;
    const z3 =  y2 * sinX + z2 * cosX;
    // CSS perspective projection
    const s  = P / (P - z3);
    return { x: x3 * s + pcx, y: y3 * s + pcy };
  }

  // Compute the projected quad for every block — include back corners in bounds
  // so the canvas is large enough for the extrusion side faces.
  const entries = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  blockWrapperMap.forEach(({ block, zPos }) => {
    if (!block) return;
    const bcx = block.rx + block.rw / 2;
    const bcy = block.ry + block.rh / 2;
    const hw  = block.rw / 2, hh = block.rh / 2;

    const tl  = project(bcx - hw, bcy - hh, zPos);
    const tr  = project(bcx + hw, bcy - hh, zPos);
    const br  = project(bcx + hw, bcy + hh, zPos);
    const bl  = project(bcx - hw, bcy + hh, zPos);
    // Back face for extrusion bounds (zPos - DEPTH_PX is behind the front face)
    const tlB = project(bcx - hw, bcy - hh, zPos - DEPTH_PX);
    const trB = project(bcx + hw, bcy - hh, zPos - DEPTH_PX);
    const brB = project(bcx + hw, bcy + hh, zPos - DEPTH_PX);
    const blB = project(bcx - hw, bcy + hh, zPos - DEPTH_PX);

    [tl, tr, br, bl, tlB, trB, brB, blB].forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    });

    const projW = Math.hypot(tr.x - tl.x, tr.y - tl.y);
    const projH = Math.hypot(bl.x - tl.x, bl.y - tl.y);
    entries.push({ tl, tr, br, bl, tlB, trB, brB, blB, projW, projH, zPos, block });
  });

  if (!entries.length) return null;

  // Back-to-front paint order
  entries.sort((a, b) => a.zPos - b.zPos);

  const PAD   = 32, SCALE = 2;
  const offX  = minX - PAD, offY = minY - PAD;
  const logW  = maxX - minX + PAD * 2;
  const logH  = maxY - minY + PAD * 2;

  const out = document.createElement('canvas');
  out.width  = Math.ceil(logW * SCALE);
  out.height = Math.ceil(logH * SCALE);
  const ctx  = out.getContext('2d');
  ctx.scale(SCALE, SCALE);

  ctx.fillStyle = bgCol;
  ctx.fillRect(0, 0, logW, logH);

  // Draw a quadrilateral with rounded corners using quadratic bezier arcs.
  // At each corner, inset `r` px along each adjacent edge, then curve between.
  function roundedQuad(ctx, corners, r) {
    const lerp = (a, b, t) => [a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t];
    const len  = (a, b) => Math.hypot(b[0]-a[0], b[1]-a[1]);
    const n = corners.length;
    for (let i = 0; i < n; i++) {
      const prev = corners[(i + n - 1) % n];
      const curr = corners[i];
      const next = corners[(i + 1) % n];
      const lp   = len(prev, curr), ln = len(curr, next);
      const tp   = Math.min(r / lp, 0.5);
      const tn   = Math.min(r / ln, 0.5);
      const from = lerp(curr, prev, tp);
      const to   = lerp(curr, next, tn);
      if (i === 0) ctx.moveTo(from[0], from[1]);
      else         ctx.lineTo(from[0], from[1]);
      ctx.quadraticCurveTo(curr[0], curr[1], to[0], to[1]);
    }
    ctx.closePath();
  }

  entries.forEach(({ tl, tr, br, bl, tlB, trB, brB, blB, projW, projH, block }) => {
    const p0  = [tl.x  - offX, tl.y  - offY];  // TL front
    const p1  = [tr.x  - offX, tr.y  - offY];  // TR front
    const p2  = [br.x  - offX, br.y  - offY];  // BR front
    const p3  = [bl.x  - offX, bl.y  - offY];  // BL front
    const pb0 = [tlB.x - offX, tlB.y - offY];  // TL back
    const pb1 = [trB.x - offX, trB.y - offY];  // TR back
    const pb2 = [brB.x - offX, brB.y - offY];  // BR back
    const pb3 = [blB.x - offX, blB.y - offY];  // BL back

    const isOutlined  = !!block.outlined;
    const perspScale  = block.rw > 0 ? projW / block.rw : 1;
    const ds          = snapZoom * perspScale;
    const borderR     = Math.min((cfg.blockRadius || 5.6) * ds, projH / 2, projW / 2);
    const { r, g, b: blue } = colorToRgb(block.color);
    const SIDE_ALPHA  = isOutlined ? 0.50 : 0.72;
    const dim = f => `rgba(${Math.round(r*f)},${Math.round(g*f)},${Math.round(blue*f)},${SIDE_ALPHA})`;
    // Gradient variant: fades from full SIDE_ALPHA at the bright end of the face
    // (top/left, where the front face gradient is 0.80 alpha) to ~40% at the dim
    // end (bottom/right, where the front face is 0.30 alpha). Mirrors the variation
    // that CSS glass compositing produces in the live 3D view.
    const dimGrad = (f, fromPt, toPt) => {
      const grd = ctx.createLinearGradient(fromPt[0], fromPt[1], toPt[0], toPt[1]);
      grd.addColorStop(0, `rgba(${Math.round(r*f)},${Math.round(g*f)},${Math.round(blue*f)},${SIDE_ALPHA})`);
      grd.addColorStop(1, `rgba(${Math.round(r*f)},${Math.round(g*f)},${Math.round(blue*f)},${(SIDE_ALPHA * 0.40).toFixed(3)})`);
      return grd;
    };

    // ── Side faces (extrusion) ─────────────────────────────────────────────
    // Drawn before the front face so painter order is correct.
    // Each face is inset by borderR at both ends, matching the CSS rule:
    //   top: -h/2 + br; height: h - 2*br  (left/right faces)
    //   left: -w/2 + br; width: w - 2*br  (top/bottom faces)
    // This leaves the rounded corner areas uncovered, exactly as in the live view.
    function solidFace(corners, color) {
      ctx.beginPath();
      ctx.moveTo(corners[0][0], corners[0][1]);
      for (let i = 1; i < corners.length; i++) ctx.lineTo(corners[i][0], corners[i][1]);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
    const L2 = (a, b, t) => [a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t];
    const tH  = Math.min(borderR / projH, 0.499);  // inset ratio along height edges
    const tW  = Math.min(borderR / projW, 0.499);  // inset ratio along width edges

    // Left face — gradient top→bottom (p0→p3), matching front-face brightness fade
    if (rotY > 0) solidFace([
      L2(p0, p3, tH), L2(pb0, pb3, tH), L2(pb3, pb0, tH), L2(p3, p0, tH)
    ], dimGrad(0.84, p0, p3));
    // Right face — gradient top→bottom (p1→p2)
    if (rotY < 0) solidFace([
      L2(p1, p2, tH), L2(pb1, pb2, tH), L2(pb2, pb1, tH), L2(p2, p1, tH)
    ], dimGrad(0.68, p1, p2));
    // Top/bottom faces are drawn AFTER the front face below — they overlap the
    // front face's edge area in 2D screen space, so drawing them here would
    // let the front face paint over them and make them invisible.

    // ── Front face ─────────────────────────────────────────────────────────
    ctx.save();
    ctx.beginPath();
    roundedQuad(ctx, [p0, p1, p2, p3], borderR);

    if (fancyGraphics) {
      // Simulate CSS backdrop-filter:blur by blurring the canvas-so-far into
      // the block area before drawing the colour overlay on top.
      // We snapshot 'out' at this moment (before the current block is painted),
      // draw it blurred onto a temp canvas, then paint that into the clipped area.
      ctx.save();
      ctx.clip();
      const tmp = document.createElement('canvas');
      tmp.width  = out.width;
      tmp.height = out.height;
      const tCtx = tmp.getContext('2d');
      // Pre-fill with bgCol so edge pixels blend with the background colour
      // rather than transparent black — prevents dark halos on tiles near the
      // canvas boundary (without this, blurring 'out' near its edges mixes in
      // rgba(0,0,0,0) and darkens/desaturates those tiles in the export).
      tCtx.fillStyle = bgCol;
      tCtx.fillRect(0, 0, tmp.width, tmp.height);
      tCtx.filter = `blur(${BLUR_PX * SCALE}px)`;   // SCALE converts CSS px → canvas px
      tCtx.drawImage(out, 0, 0);
      // Must specify (logW, logH) as destination size: ctx has scale(SCALE,SCALE) active,
      // so drawImage without explicit dimensions draws at SCALE² the intended size,
      // placing every tile's blurred pixels at wrong (1/SCALE) coordinates.
      ctx.drawImage(tmp, 0, 0, logW, logH);
      ctx.restore();
      // Re-establish the path so the subsequent fill/stroke/clip still works.
      ctx.beginPath();
      roundedQuad(ctx, [p0, p1, p2, p3], borderR);
    }

    if (isOutlined) {
      ctx.fillStyle = `rgba(${bgR},${bgG},${bgB},0.88)`;
      ctx.fill();
      // Gradient border matching CSS linear-gradient(135deg, …) border-box
      const bGrad = ctx.createLinearGradient(p0[0], p0[1], p2[0], p2[1]);
      bGrad.addColorStop(0, `rgba(${r},${g},${blue},0.80)`);
      bGrad.addColorStop(1, `rgba(${r},${g},${blue},0.30)`);
      ctx.strokeStyle = bGrad;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    } else {
      // Gradient matching CSS linear-gradient(135deg, rgba(r,g,b,0.80), rgba(r,g,b,0.30))
      // p0→p2 is the TL→BR diagonal which maps 135° onto the projected face.
      const grad = ctx.createLinearGradient(p0[0], p0[1], p2[0], p2[1]);
      grad.addColorStop(0, `rgba(${r},${g},${blue},0.80)`);
      grad.addColorStop(1, `rgba(${r},${g},${blue},0.30)`);
      ctx.fillStyle = grad;
      ctx.fill();
      // 1.5px gradient border rim — matches CSS border-box gradient technique
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    }

    ctx.clip();

    // ── Text — full affine transform so content warps with the face ────────
    if (block.title) {
      const fontSize = (cfg.blockFontSize || 10) * ds;
      const padSide  = (cfg.blockPadSide  || 10) * ds;
      const padTop   = (cfg.blockPadTop   ||  6) * ds;

      // ctx.transform(a,b,c,d,e,f) maps tile-local (x,y) to screen:
      //   screen_x = a*x + c*y + e,  screen_y = b*x + d*y + f
      // (0,0)→p0, (projW,0)→p1, (0,projH)→p3 — full perspective warp.
      ctx.transform(
        (p1[0] - p0[0]) / projW, (p1[1] - p0[1]) / projW,
        (p3[0] - p0[0]) / projH, (p3[1] - p0[1]) / projH,
        p0[0], p0[1]
      );

      ctx.font      = `500 ${fontSize}px "DM Sans",Arial,sans-serif`;
      ctx.fillStyle = isOutlined ? block.color : 'rgba(255,255,255,0.9)';
      ctx.fillText(block.title, padSide, padTop + fontSize);

      const timeY = padTop + fontSize * 2.35;
      if (block.e - block.s > 0.5 && timeY + fontSize < projH - padTop * 0.5) {
        ctx.globalAlpha = 0.65;
        ctx.fillText(toHHMM(block.s) + ' – ' + toHHMM(block.e), padSide, timeY);
        ctx.globalAlpha = 1;
      }
    }

    ctx.restore();

    // Top/bottom faces drawn AFTER front face: with rotX, the back-edge corners
    // project inside the front face's screen bounds, so painting these before the
    // front face causes them to be covered. Drawing after makes them visible as a
    // thin dark strip at the tile edge — matching the live CSS 3D view.
    // CSS rotateX(positive) tilts the BOTTOM toward the viewer (positive-y points
    // move toward +Z per right-hand rule), so rotX > 0 → bottom face visible.
    // Bottom face: gradient left→right (p3→p2, i.e. BL→BR)
    if (rotX > 0) solidFace([
      L2(p3, p2, tW), L2(p2, p3, tW), L2(pb2, pb3, tW), L2(pb3, pb2, tW)
    ], dimGrad(0.58, p3, p2));
    // Top face: gradient left→right (p0→p1, i.e. TL→TR)
    if (rotX < 0) solidFace([
      L2(p0, p1, tW), L2(p1, p0, tW), L2(pb1, pb0, tW), L2(pb0, pb1, tW)
    ], dimGrad(0.92, p0, p1));
  });

  return out;
}

function setSvgExportVisibility(visible) {
  const btn = document.querySelector('#cf-export-svg');
  if (btn) btn.style.display = visible ? '' : 'none';
}

window.CF3D = { open, close, toggle, isOpen, onModeChange, isMakeMode: () => isMakeMode, renderExport3D };
