// ════════════════════════════════════════════════════════════════════════════
//  CalFont Engine  ·  v5
//  Pure logic — no HTML, no CSS. Talks to the outside world only via CF.*
//  Drop calfont-engine.js into any page, configure CF.config + CF.hooks,
//  then call CF.init().
// ════════════════════════════════════════════════════════════════════════════

window.CF = window.CF || {};

// ─────────────────────────────────────────────────────────────────────────────
//  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗
// ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝
// ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
// ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
// ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
//  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝
//
//  ╔══════════════════════════════════════════════════════════╗
//  ║  CONFIGURATION  —  safe to edit these values            ║
//  ╚══════════════════════════════════════════════════════════╝
// ─────────────────────────────────────────────────────────────────────────────
CF.config = {

  // ── Canvas ────────────────────────────────────────────────
  canvasContainerId: 'cf-canvas',   // ID of the div that gets the p5 canvas
  verticalFocus:      0.45,          // 0.5 = center, 0.45 = slightly above center

  // ── Grid ──────────────────────────────────────────────────
  workDayStart:  9,    // first hour shown (09:00)
  workDayEnd:   17,    // last  hour shown (17:00)
  baseDayWidth: 55,    // column width in px at zoom=1
  baseHourHeight: 20,  // row  height in px at zoom=1

  // ── Block visuals ─────────────────────────────────────────
  blockRadius:    5.6,  // corner radius at zoom=1
  blockStroke:    0.75, // separator stroke weight at zoom=1
  blockPadTop:    6,    // text padding top  at zoom=1
  blockPadSide:   10,   // text padding side at zoom=1
  blockFontSize:  10,   // text size at zoom=1

  // ── Zoom ──────────────────────────────────────────────────
  zoomDefault: 1.0,
  zoomMin:     0.22,
  zoomMax:     3.5,
  zoomStep:    0.001,

  // ── Type mode ─────────────────────────────────────────────
  lineGapRatio: 0.5,   // gap between typed lines as fraction of line height

  // ── Gradient overlay ──────────────────────────────────────
  gradientHeightRatio: 0.33,  // fraction of canvas height covered by gradient

  // ── Default state ─────────────────────────────────────────
  defaultText:      'HELP !',
  defaultMode:      'test',    // 'make' | 'test'
  defaultPaletteStep: 0,
  defaultToneMode:    0,

  // ── Palette & tones ───────────────────────────────────────
  palette: ['#7A86CB','#E67D73','#AD1457','#8E24AA','#00897B','#039BE5','#F4511E','#33B679'],
  bgColor: '#D9D9D9',   // canvas background = also used as block text/separator color

  toneLabels: ['STANDARD','HOPEFUL','PARODY'],
  toneTitles: {
    STANDARD: ['Check-In with Client','Kick-off','Alignment with Steve','Sprint Workshop',
      'Team Introduction','Standup','Quarterly Review','1:1 with Manager','Product Sync',
      'Stakeholder Update','Design Review','All Hands','Retro','Planning Session','Client Call',
      'Strategy Meeting','OKR Review','Onboarding','Tech Deep Dive','Brand Alignment',
      'Budget Review','Roadmap Sync','Feasibility Workshop'],
    HOPEFUL:  ['Me Time','Taking a Break','Going for a Walk','Coffee Date','Gym',
      'Working from Home','Read a Book','Lunch with a Friend','No Meetings Please',
      'Focus Block','Digital Detox','Creative Time','Mindful Moment','Fresh Air','Power Nap',
      'Garden Break','Journaling','Cook Something Nice','Call Mum','Do Nothing','Stretch Break',
      'Bike Ride','Long Lunch'],
    PARODY:   ['Go Cry','Ignoring Slack Messages','Not Available','Browse LinkedIn for New Job',
      'Important Smoke Break','Pretend to Work','Stare at Wall','Avoid Everyone','Fake Commute',
      'Reply Later (Never)','Doomscrolling','Apply to 10 Jobs','Question Life Choices',
      'Rethink Career','Be Perceived','Touch Grass','Existential Lunch','Hide in Bathroom',
      'Update CV Again','Cry but Make it Scrum','Silent Resignation','Ctrl+Z My Career',
      'Out of Office (Forever)']
  },

  // ── Preset glyphs (the default alphabet shipped with the tool) ────────────
  presetAlphabet: {}  // populated from calfont-presets.js if loaded, else empty

}; // end CF.config


// ─────────────────────────────────────────────────────────────────────────────
//  ██╗  ██╗ ██████╗  ██████╗ ██╗  ██╗███████╗
//  ██║  ██║██╔═══██╗██╔═══██╗██║ ██╔╝██╔════╝
//  ███████║██║   ██║██║   ██║█████╔╝ ███████╗
//  ██╔══██║██║   ██║██║   ██║██╔═██╗ ╚════██║
//  ██║  ██║╚██████╔╝╚██████╔╝██║  ██╗███████║
//  ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝
//
//  ╔══════════════════════════════════════════════════════════════════════════╗
//  ║  DOM HOOKS — wire these to your Webflow elements                        ║
//  ║                                                                          ║
//  ║  Each hook is { selector, event?, handler? }                            ║
//  ║  'selector' can be any CSS selector or element ID.                      ║
//  ║  For OUTPUT hooks (e.g. tone-label), the engine writes to them.         ║
//  ║  For INPUT hooks (e.g. palette-btn), the engine listens to them.        ║
//  ║                                                                          ║
//  ║  In Webflow: give your elements these exact class names or IDs,         ║
//  ║  OR change the selectors below to match your existing classes.          ║
//  ╚══════════════════════════════════════════════════════════════════════════╝
// ─────────────────────────────────────────────────────────────────────────────
CF.hooks = {

  // ── Canvas container ─────────────────────────────────────
  // The div where the p5 canvas is injected. Must exist on page.
  canvasWrap:       '#cf-canvas',

  // ── Mode buttons ─────────────────────────────────────────
  btnMake:          '#cf-btn-make',    // click → enter Make mode
  btnTest:          '#cf-btn-test',    // click → enter Test mode
  activeClass:      'cf-active',       // CSS class applied to the active mode button

  // ── Make mode inputs ──────────────────────────────────────
  nameInput:        '#cf-name-input',  // text input: glyph name
  addBtn:           '#cf-add-btn',     // click → save glyph (shows "Overwrite" when name exists)
  makeZone:         '#cf-make-zone',   // container shown only in Make mode
  typeZone:         '#cf-type-zone',   // container shown only in Test mode

  // ── Test mode ─────────────────────────────────────────────
  typeInput:        '#cf-type-input',  // textarea: typed text

  // ── Palette ───────────────────────────────────────────────
  palBtn:           '#cf-pal-btn',     // click → advance palette
  palDisplay:       '#cf-pal-display', // OUTPUT: engine writes SVG swatch here

  // ── Tone ──────────────────────────────────────────────────
  toneBtn:          '#cf-tone-btn',    // click → rotate tone
  toneLabel:        '#cf-tone-label',  // OUTPUT: engine writes tone name here

  // ── Saved glyphs ─────────────────────────────────────────
  glyphChips:       '#cf-glyph-chips', // OUTPUT: engine writes chip HTML here

  // ── Export ────────────────────────────────────────────────
  exportSvgBtn:     '#cf-export-svg',  // click → open export modal (SVG)
  exportPngBtn:     '#cf-export-png',  // click → open export modal (PNG)
  sessionBtn:       '#cf-session-btn', // click → open save/load modal

  // ── Export modal (can be any overlay element) ─────────────
  exportModal:      '#cf-export-modal',        // the modal wrapper
  exportModalTitle: '#cf-export-modal-title',  // OUTPUT: "Export SVG" / "Export PNG"
  exportConfirmBtn: '#cf-export-confirm',      // click → run export
  exportCloseBtns:  '.cf-close-export',        // click → close export modal
  expPlain:         '#cf-exp-plain',           // checkbox: include solid blocks
  expStrokes:       '#cf-exp-strokes',         // checkbox: include white separator stroke
  expType:          '#cf-exp-type',            // checkbox: include text labels

  // ── Overwrite modal ───────────────────────────────────────
  overwriteModal:   '#cf-overwrite-modal',     // the modal wrapper
  previewOld:       '#cf-preview-old',         // <canvas> element for "current" preview
  previewNew:       '#cf-preview-new',         // <canvas> element for "new" preview
  overwriteConfirm: '#cf-overwrite-confirm',   // click → confirm overwrite
  overwriteCancel:  '.cf-cancel-overwrite',    // click → cancel overwrite

  // ── Save/Load modal ───────────────────────────────────────
  saveLoadModal:    '#cf-saveload-modal',
  savePanel:        '#cf-panel-save',
  loadPanel:        '#cf-panel-load',
  tabSave:          '#cf-tab-save',      // click → show save panel
  tabLoad:          '#cf-tab-load',      // click → show load panel
  exportTextarea:   '#cf-export-textarea',
  importTextarea:   '#cf-import-textarea',
  copyExportBtn:    '#cf-copy-export',   // click → copy session JSON
  loadSessionBtn:   '#cf-load-session',  // click → load from textarea
  closeSaveLoadBtns: '.cf-close-saveload',

  // ── Toast notification ────────────────────────────────────
  toast:            '#cf-toast',   // OUTPUT: engine writes message + adds cf-show class
  toastShowClass:   'cf-show',

  // ── Active pill color ─────────────────────────────────────
  // Engine sets CSS custom property --cf-active-color on document root.
  // Use it in your Webflow element styles: background: var(--cf-active-color)
  // activeColorVar: '--cf-active-color'  ← always applied, no config needed

}; // end CF.hooks


// ════════════════════════════════════════════════════════════════════════════
//  ENGINE  —  do not edit below this line unless you know what you're doing
// ════════════════════════════════════════════════════════════════════════════

CF.init = function() {
  const C = CF.config;
  const H = CF.hooks;

  // ── Shorthand DOM helpers ──────────────────────────────────
  const q  = s => document.querySelector(s);
  const qa = s => document.querySelectorAll(s);
  const on = (sel, evt, fn) => { const el = typeof sel === 'string' ? q(sel) : sel; if (el) el.addEventListener(evt, fn); };
  const onAll = (sel, evt, fn) => qa(sel).forEach(el => el.addEventListener(evt, fn));
  const set = (sel, html) => { const el = typeof sel === 'string' ? q(sel) : sel; if (el) el.innerHTML = html; };
  const val = sel => { const el = typeof sel === 'string' ? q(sel) : sel; return el ? el.value : ''; };
  const show = (sel, vis) => { const el = typeof sel === 'string' ? q(sel) : sel; if (el) el.style.display = vis ? '' : 'none'; };

  // ── Constants derived from config ─────────────────────────
  const PALETTE   = C.palette;
  const BG_COL    = C.bgColor;
  const BG_NUM    = parseInt(BG_COL.slice(1),16);
  const BGr = (BG_NUM>>16)&255, BGg = (BG_NUM>>8)&255, BGb = BG_NUM&255;
  const PALETTE_SETS = [
    [0,1,2,3],[1,2,3,4],[2,3,4,5],[3,4,5,6] // colorful sets
  ];
  const PALETTE_TOTAL = PALETTE.length * 2 + PALETTE_SETS.length;
  const HOUR_S  = C.workDayStart;
  const HOUR_E  = C.workDayEnd;
  const BASE_DW = C.baseDayWidth;
  const BASE_HH = C.baseHourHeight;
  const GLYPH_START = HOUR_S;
  const GLYPH_END   = HOUR_E;
  const GLYPH_SPAN  = HOUR_E - HOUR_S;

  // ── State ──────────────────────────────────────────────────
  let blocks        = [];
  let ghostBlocks   = [];
  let placeholderBlocks = [];
  let editingGlyphName  = null;
  let pendingOverwriteName = null;
  let rawAlphabet   = {};
  let isTypeMode    = false;
  let currentTypedText = '';
  let paletteStep   = C.defaultPaletteStep;
  let toneMode      = C.defaultToneMode;
  let zoom          = C.zoomDefault;
  let dragging = null, resizing = null, dragOffY = 0;
  let isCreating = false, createY0 = 0, createX0 = 0;
  let p5ref  = null;
  let canvasEl = null; // raw DOM canvas element, set in p.setup
  let _exportFormat = 'png';

  // ── Palette helpers ────────────────────────────────────────
  function getPaletteState() {
    const n = PALETTE.length;
    const s = PALETTE_SETS.length;
    if (paletteStep < n * 2) {
      const idx  = Math.floor(paletteStep / 2);
      const mode = paletteStep % 2 === 0 ? 'solid' : 'mixed';
      return { mode, palIdx: idx, colorfulSet: null };
    }
    const si = paletteStep - n * 2;
    return { mode: 'colorful', palIdx: null, colorfulSet: PALETTE_SETS[si % s] };
  }

  function blockColor(b) {
    const state = getPaletteState();
    if (state.mode === 'colorful') {
      const idx = b._colorfulIdx !== undefined ? b._colorfulIdx : 0;
      return PALETTE[state.colorfulSet[idx % state.colorfulSet.length]];
    }
    return PALETTE[state.palIdx];
  }

  function applyStyle(b, idx, recolor) {
    if (!b.title) b.title = randTitle();
    const state = getPaletteState();
    if (state.mode === 'solid') {
      b.outlined = false;
    } else if (state.mode === 'mixed') {
      if (recolor || b.outlined === undefined) b.outlined = Math.random() < 0.27;
    } else {
      b._colorfulIdx = idx !== undefined ? idx : blocks.length;
      b.outlined = false;
    }
  }

  // ── Text helpers ───────────────────────────────────────────
  const TONE_KEYS = ['STANDARD','HOPEFUL','PARODY'];
  function randTitle() {
    const list = C.toneTitles[TONE_KEYS[toneMode]];
    return list[Math.floor(Math.random() * list.length)];
  }
  function toHHMM(h) {
    const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
  }
  function fromHHMM(s) {
    const [h, m] = s.split(':').map(Number);
    return h + m / 60;
  }

  // ── Glyph helpers ──────────────────────────────────────────
  function humanToRelative(items) {
    if (!items || items.length === 0) return [];
    const minCol = Math.min(...items.map(i => i.col));
    // Store actual hours as relS/relE — no normalisation.
    // glyphToBlocks uses these directly so proportions are always preserved.
    return items.map(i => ({
      relD: i.col - minCol,
      relS: fromHHMM(i.from),
      relE: fromHHMM(i.to),
      title: i.title || '', outlined: i.outlined || false
    }));
  }

  function blockToHuman(b, minD) {
    // Store actual hours directly — no normalisation into 9-17 window.
    // This preserves overshoot, ascenders and descenders freely.
    return {
      col:   b.d - minD + 1,
      from:  toHHMM(Math.max(0, b.s)),   // clamp to 00:00 min
      to:    toHHMM(Math.min(24, b.e)),   // clamp to 24:00 max
      title: b.title || '',
      outlined: b.outlined || false
    };
  }

  function glyphToBlocks(glyphDef) {
    const items = glyphDef.filter(g => g.relD !== undefined);
    if (!items.length) return [];
    const glyphCols = Math.max(...items.map(g => g.relD)) + 1;
    const startCol  = Math.ceil((12 - glyphCols) / 2);
    // relS/relE are now actual hours — use them directly
    return items.map((g, i) => ({
      d: g.relD + startCol,
      s: g.relS,
      e: g.relE,
      outlined: g.outlined || false,
      _colorfulIdx: i,
      title: g.title || randTitle()
    }));
  }

  // ── Tokeniser ─────────────────────────────────────────────
  // Splits a line string into typed tokens, recognising _name_ multi-glyph syntax.
  // Returns array of: { type:'named'|'char'|'space', key:string, glyph:array|null }
  // Named tokens:  _smile_ → looks up rawAlphabet['SMILE']
  // Char tokens:   single character → looks up rawAlphabet[CHAR]
  // Space tokens:  space character → no glyph, just advance column
  function tokeniseLine(line) {
    const tokens = [];
    const upper = line.toUpperCase();
    let i = 0;
    while (i < upper.length) {
      // Check for _name_ pattern
      if (upper[i] === '_') {
        const close = upper.indexOf('_', i + 1);
        if (close > i + 1) {
          const name = upper.slice(i + 1, close);
          const glyph = rawAlphabet[name];
          if (glyph) {
            tokens.push({ type: 'named', key: name, glyph });
            i = close + 1;
            continue;
          }
          // No glyph found for _name_ — fall through and emit _ as a char
        }
      }
      const ch = upper[i];
      if (ch === ' ') {
        tokens.push({ type: 'space', key: ' ', glyph: null });
      } else {
        const glyph = rawAlphabet[ch] || rawAlphabet[ch.toLowerCase()] || null;
        tokens.push({ type: 'char', key: ch, glyph });
      }
      i++;
    }
    return tokens;
  }

  function lineColWidth(line) {
    let col = 0;
    for (const token of tokeniseLine(line)) {
      if (token.type === 'space') { col += 1; continue; }
      if (token.glyph) col += Math.max(...token.glyph.map(g => g.relD)) + 1;
      else col += 1; // unknown char or unsaved named glyph = 1 col placeholder
    }
    return col;
  }

  // ── Presets ────────────────────────────────────────────────
  function loadPresets() {
    // CF.presets is populated by calfont-presets.js (loaded before this file).
    // Falls back to C.presetAlphabet if the external file isn't present.
    const source = (window.CF && window.CF.presets) ? window.CF.presets : C.presetAlphabet;
    for (const [name, items] of Object.entries(source)) {
      if (!rawAlphabet[name]) rawAlphabet[name] = humanToRelative(items);
    }
    rebuildChips();
  }

  // ── UI updaters ────────────────────────────────────────────
  function updatePaletteUI() {
    const state = getPaletteState();
    const el = q(H.palDisplay);
    if (el) {
      if (state.mode === 'solid') {
        el.innerHTML = `<div style="width:30px;height:30px;border-radius:50%;background:${PALETTE[state.palIdx]};border:1.5px solid rgba(11,11,11,0.18);"></div>`;
      } else if (state.mode === 'mixed') {
        const col = PALETTE[state.palIdx];
        el.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><clipPath id="lh"><rect x="0" y="0" width="12" height="24"/></clipPath><circle cx="12" cy="12" r="11" fill="${col}" clip-path="url(#lh)"/><clipPath id="rh"><rect x="12" y="0" width="12" height="24"/></clipPath><circle cx="12" cy="12" r="11" fill="${BG_COL}" stroke="${col}" stroke-width="1.5" clip-path="url(#rh)"/><circle cx="12" cy="12" r="11" fill="none" stroke="rgba(11,11,11,0.15)" stroke-width="1"/></svg>`;
      } else {
        const cols = state.colorfulSet.map(i => PALETTE[i]);
        el.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="cc"><circle cx="12" cy="12" r="11"/></clipPath></defs><g clip-path="url(#cc)"><rect x="0" y="0" width="12" height="12" fill="${cols[0]}"/><rect x="12" y="0" width="12" height="12" fill="${cols[1]}"/><rect x="0" y="12" width="12" height="12" fill="${cols[2]}"/><rect x="12" y="12" width="12" height="12" fill="${cols[3]}"/></g><circle cx="12" cy="12" r="11" fill="none" stroke="rgba(11,11,11,0.15)" stroke-width="1"/></svg>`;
      }
    }
    // Publish active color as CSS custom property so Webflow can use it
    const solidColor = state.mode !== 'colorful' ? PALETTE[state.palIdx] : '#0B0B0B';
    document.documentElement.style.setProperty('--cf-active-color', solidColor);
    // Also toggle active class styling on mode pills
    updateModePillColor(state.mode !== 'colorful' ? PALETTE[state.palIdx] : null);
  }

  function updateModePillColor(color) {
    // Reset both buttons individually (avoids combined ID+class selector issues)
    const makeEl = q(H.btnMake), testEl = q(H.btnTest);
    [makeEl, testEl].forEach(el => {
      if (!el) return;
      el.style.removeProperty('background');
      el.style.removeProperty('color');
      el.style.removeProperty('border-color');
    });
    // Find active button by checking classList directly, not combined selector
    const active = (makeEl && makeEl.classList.contains(H.activeClass)) ? makeEl
                 : (testEl && testEl.classList.contains(H.activeClass))  ? testEl
                 : null;
    if (!active) return;
    if (color) {
      active.style.background  = color;
      active.style.color       = BG_COL;
      active.style.borderColor = color;
    } else {
      active.style.background  = '#0B0B0B';
      active.style.color       = BG_COL;
      active.style.borderColor = '#0B0B0B';
    }
  }

  function rebuildChips() {
    const wrap = q(H.glyphChips);
    if (!wrap) return;
    const keys = Object.keys(rawAlphabet).sort();
    wrap.innerHTML = keys.map(k => {
      const isSingle = [...k].length === 1;
      // Single-char glyphs get combo class cf-chip-lg; multi-char stay as plain cf-chip
      const cls = isSingle ? 'cf-chip cf-chip-lg' : 'cf-chip';
      return `<div class="${cls}" data-glyph="${k.replace(/"/g,'&quot;')}">${k}</div>`;
    }).join('') || '';
    // Bind chip events
    wrap.querySelectorAll('.cf-chip').forEach(chip => {
      chip.addEventListener('click', () => loadGlyphForEdit(chip.dataset.glyph));
      chip.addEventListener('contextmenu', e => { e.preventDefault(); chipRightClick(chip.dataset.glyph); });
    });
  }

  function toast(msg) {
    const el = q(H.toast);
    if (!el) return;
    el.textContent = msg;
    el.classList.add(H.toastShowClass);
    clearTimeout(el._tt);
    el._tt = setTimeout(() => el.classList.remove(H.toastShowClass), 2400);
  }

  function openModal(sel) {
    const el = q(sel); if (el) { el.style.opacity='1'; el.style.pointerEvents='all'; el.classList.add('cf-modal-open'); }
  }
  function closeModal(sel) {
    const el = q(sel); if (el) { el.style.opacity='0'; el.style.pointerEvents='none'; el.classList.remove('cf-modal-open'); }
  }

  // ── Mode ───────────────────────────────────────────────────
  function setMode(m) {
    isTypeMode = m === 'test';
    const make = q(H.btnMake), test = q(H.btnTest);
    if (make) make.classList.toggle(H.activeClass, !isTypeMode);
    if (test) test.classList.toggle(H.activeClass,  isTypeMode);
    show(H.makeZone, !isTypeMode);
    const tz = q(H.typeZone);
    if (tz) tz.style.display = isTypeMode ? '' : 'none';
    const ab = q(H.addBtn);
    if (ab) ab.style.display = isTypeMode ? 'none' : '';
    blocks = []; ghostBlocks = []; placeholderBlocks = []; editingGlyphName = null;
    const state = getPaletteState();
    updateModePillColor(state.mode !== 'colorful' ? PALETTE[state.palIdx] : null);
    if (isTypeMode) renderTypedText();
  }

  // ── Glyph management ───────────────────────────────────────
  function loadGlyphForEdit(name) {
    const glyph = rawAlphabet[name];
    if (!glyph) return;
    if (isTypeMode) setMode('make');
    blocks = glyphToBlocks(glyph);
    ghostBlocks = glyphToBlocks(glyph).map(b => ({ ...b, isGhost: true }));
    editingGlyphName = name;
    const inp = q(H.nameInput);
    if (inp) { inp.value = name; checkOverwriteMode(); }
  }

  function checkOverwriteMode() {
    const name = (val(H.nameInput) || '').trim().toUpperCase();
    const btn  = q(H.addBtn);
    const isExisting = name && rawAlphabet[name] !== undefined;
    if (btn) {
      btn.textContent = isExisting ? 'Overwrite' : '+ Add';
      btn.dataset.overwrite = isExisting ? '1' : '';
    }
  }

  function saveGlyph() {
    const name = (val(H.nameInput) || '').trim().toUpperCase();
    if (!name || blocks.length === 0) { toast('Enter a name and draw something first'); return; }
    if (rawAlphabet[name]) { pendingOverwriteName = name; showOverwriteModal(name); return; }
    commitSaveGlyph(name);
  }

  function commitSaveGlyph(name) {
    const minD = Math.min(...blocks.map(b => b.d));
    const humanItems = blocks.map(b => blockToHuman(b, minD));
    rawAlphabet[name] = humanToRelative(humanItems);
    rawAlphabet[name]._human = humanItems;
    const inp = q(H.nameInput);
    if (inp) inp.value = '';
    blocks = []; ghostBlocks = []; placeholderBlocks = []; editingGlyphName = null; pendingOverwriteName = null;
    rebuildChips(); checkOverwriteMode();
    toast('"' + name + '" saved');
  }

  function buildCurrentGlyphDef() {
    if (!blocks.length) return [];
    const minD = Math.min(...blocks.map(b => b.d));
    return humanToRelative(blocks.map(b => blockToHuman(b, minD)));
  }

  function chipRightClick(name) {
    // Simple delete — Webflow version could show a confirmation
    delete rawAlphabet[name];
    rebuildChips();
    toast('"' + name + '" deleted');
  }

  // ── Overwrite modal ────────────────────────────────────────
  function showOverwriteModal(name) {
    openModal(H.overwriteModal);
    setTimeout(() => {
      renderGlyphPreview(H.previewOld, rawAlphabet[name]);
      renderGlyphPreview(H.previewNew, buildCurrentGlyphDef());
    }, 40);
  }

  function renderGlyphPreview(sel, glyphDef) {
    const canvas = typeof sel === 'string' ? q(sel) : sel;
    if (!canvas || !glyphDef || !glyphDef.length) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H2 = canvas.height, PAD = 12;
    ctx.clearRect(0, 0, W, H2);
    ctx.fillStyle = '#2a2a2a'; ctx.fillRect(0, 0, W, H2);

    const items = glyphDef.filter(g => g.relD !== undefined);
    if (!items.length) return;

    // Normalise hours to 0-1 within the glyph bounding box for layout
    const minHr  = Math.min(...items.map(g => g.relS));
    const maxHr  = Math.max(...items.map(g => g.relE));
    const hrSpan = maxHr - minHr || 1;

    const maxD   = Math.max(...items.map(g => g.relD));
    const cols   = maxD + 1;
    const availW = W - PAD * 2;
    const availH = H2 - PAD * 2;
    const colW   = availW / cols;
    const COL_MARGIN = colW * 0.065;
    const fullCol = colW - COL_MARGIN;

    // Fake coordinate helpers matching processPhysics signature
    function pxY(hr)  { return PAD + ((hr - minHr) / hrSpan) * availH; }
    function pxH(s,e) { return ((e - s) / hrSpan) * availH; }

    // ── Exact copy of processPhysics logic, operating on preview coords ──
    function previewPhysicsForCol(colItems, colX) {
      colItems.sort((a,b) => a.relS - b.relS);
      let lanes = [];
      colItems.forEach(ev => {
        let l = 0;
        while (lanes[l] && lanes[l].some(e => ev.relS < e.relE && ev.relE > e.relS)) l++;
        if (!lanes[l]) lanes[l] = [];
        lanes[l].push(ev); ev._lane = l;
      });

      colItems.forEach(ev => {
        const conc = colItems.filter(e => ev.relS < e.relE && ev.relE > e.relS && e !== ev);
        let x = 0, w = fullCol;

        if (ev._lane === 0) {
          const h2 = conc.find(e => e._lane === 1);
          const h3 = conc.find(e => e._lane === 2);
          if (h2 && h2.relS - ev.relS <= (0.5/hrSpan)*hrSpan)
            w = h3 ? fullCol * 0.57 : fullCol * 0.85;
        } else if (ev._lane === 1) {
          const h1 = conc.find(e => e._lane === 0);
          const h3 = conc.find(e => e._lane === 2);
          if (h1 && ev.relS - h1.relS <= (0.5/hrSpan)*hrSpan) {
            x = fullCol * 0.34; const seg = fullCol - x;
            if (!h3) { x = fullCol * 0.5; w = fullCol * 0.5; }
            else w = h3.relS - ev.relS <= (0.5/hrSpan)*hrSpan ? seg * 0.85 : seg;
          } else {
            x = fullCol * 0.05;
            const seg = fullCol - x;
            w = h3 && h3.relS - ev.relS <= (0.5/hrSpan)*hrSpan ? seg * 0.85 : seg;
          }
        } else if (ev._lane === 2) {
          const h2 = conc.find(e => e._lane === 1);
          if (h2) {
            const h2x = h2._px - colX;
            x = ev.relS - h2.relS <= (0.5/hrSpan)*hrSpan
              ? h2x + (fullCol - h2x) * 0.5
              : h2x + (fullCol - h2x) * 0.05;
            w = fullCol - x;
          }
        }

        ev._px = colX + x;
        ev._py = pxY(ev.relS);
        ev._pw = w;
        ev._ph = pxH(ev.relS, ev.relE);
      });
    }

    for (let d = 0; d <= maxD; d++) {
      const colItems = items.filter(g => g.relD === d);
      if (colItems.length) previewPhysicsForCol(colItems, PAD + d * colW);
    }

    const sorted = [...items].sort((a,b) => (a._px||0) - (b._px||0));
    sorted.forEach(b => {
      const col = blockColor(b);
      const r = 3;
      ctx.save();
      ctx.beginPath(); ctx.roundRect(b._px, b._py, b._pw, b._ph, r);
      if (b.outlined) {
        ctx.fillStyle = BG_COL; ctx.fill();
        ctx.strokeStyle = col; ctx.lineWidth = 0.8; ctx.stroke();
      } else {
        ctx.fillStyle = col; ctx.fill();
        ctx.strokeStyle = BG_COL; ctx.lineWidth = 0.8; ctx.stroke();
      }
      ctx.restore();
    });
  }

  // ── Palette / Tone ────────────────────────────────────────
  function advancePalette() {
    paletteStep = (paletteStep + 1) % PALETTE_TOTAL;
    updatePaletteUI();
    blocks.forEach((b, i) => applyStyle(b, i, true));
    if (isTypeMode) renderTypedText();
  }

  function rotateTone() {
    toneMode = (toneMode + 1) % 3;
    const lbl = q(H.toneLabel);
    if (lbl) lbl.textContent = C.toneLabels[toneMode];
    blocks.forEach(b => b.title = randTitle());
  }

  // ── Type mode ─────────────────────────────────────────────
  function renderTypedText() {
    if (!isTypeMode) return;
    const el = q(H.typeInput);
    currentTypedText = el ? el.value : currentTypedText;
    blocks = []; placeholderBlocks = [];
    const lines = currentTypedText.toUpperCase().split('\n');

    // Each line is a full 24hr window. Glyphs keep their absolute hours (e.g. 9-17).
    // Line 0: hours 0-24 (no shift — glyphs render at their saved times).
    // Line 1: hours 24+GAP to 48+GAP (shift = 24 + GAP).
    // GAP_HRS = visual space between windows = half a 24hr window = 12hrs.
    // This means glyphs near the edges of their window can visually bleed
    // into the adjacent line's space — intentional, they don't physically overlap.
    const WIN = 24;                        // each line's hour window
    const GAP_HRS = WIN * C.lineGapRatio;  // gap between windows (default: 12hrs)
    const STRIDE = WIN + GAP_HRS;          // hours per line stride (default: 36)

    const lineWidths = lines.map(l => lineColWidth(l));
    const maxCols = Math.max(...lineWidths, 1);

    lines.forEach((line, li) => {
      const lineShift = li * STRIDE;  // line 0: 0, line 1: 36, line 2: 72 …
      const offset = Math.ceil((maxCols - lineWidths[li]) / 2);
      let col = offset;

      for (const token of tokeniseLine(line)) {
        const glyph = token.glyph;
        if (token.type === 'space') {
          col += 1;
        } else if (glyph) {
          // Shift glyph into this line's window — absolute hours preserved within window
          glyph.forEach(g => {
            const b = {
              d: col + g.relD,
              s: g.relS + lineShift,
              e: g.relE + lineShift,
              _renderS: g.relS + lineShift,
              _renderE: g.relE + lineShift,
              _colorfulIdx: blocks.length,
              outlined: g.outlined || false,
              title: g.title || randTitle(),
              fromType: true
            };
            applyStyle(b, blocks.length, true);
            blocks.push(b);
          });
          col += Math.max(...glyph.map(g => g.relD)) + 1;
        } else {
          // Unknown char — placeholder spans 9-17 of this line's window
          placeholderBlocks.push({
            d: col,
            s: GLYPH_START + lineShift, e: GLYPH_END + lineShift,
            _renderS: GLYPH_START + lineShift, _renderE: GLYPH_END + lineShift,
            char: token.key, isPlaceholder: true
          });
          col += 1;
        }
      }
    });
  }

  // ── Save / Load ────────────────────────────────────────────
  function showSaveLoad() {
    const humanAlphabet = {};
    for (const [name, glyphs] of Object.entries(rawAlphabet)) {
      humanAlphabet[name] = (glyphs._human || glyphs).map(g => {
        if (g.col !== undefined) return g;
        return { col: g.relD+1, from: toHHMM(g.relS),
                 to: toHHMM(g.relE), title: g.title||'', outlined: g.outlined||false };
      });
    }
    const data = { version:2, note:"CalFont session", alphabet:humanAlphabet,
                   typedText:currentTypedText, paletteStep, toneMode };
    const ta = q(H.exportTextarea);
    if (ta) ta.value = JSON.stringify(data, null, 2);
    openModal(H.saveLoadModal);
    showTab('save');
  }

  function showTab(tab) {
    const isSave = tab === 'save';
    show(H.savePanel, isSave); show(H.loadPanel, !isSave);
    const ts = q(H.tabSave), tl = q(H.tabLoad);
    if (ts) ts.dataset.active = isSave ? '1' : '';
    if (tl) tl.dataset.active = isSave ? '' : '1';
  }

  function copyExport() {
    const ta = q(H.exportTextarea);
    if (!ta) return;
    ta.select();
    try { document.execCommand('copy'); toast('Copied to clipboard!'); }
    catch { toast('Select all + copy manually'); }
  }

  function loadFromTextarea() {
    const raw = (val(H.importTextarea) || '').trim();
    if (!raw) { toast('Paste your JSON first'); return; }
    try {
      const data = JSON.parse(raw);
      if (!data.alphabet) throw new Error();
      rawAlphabet = {};
      for (const [name, items] of Object.entries(data.alphabet)) {
        if (!items.length) continue;
        const isV2 = items[0].col !== undefined;
        if (isV2) { const rel = humanToRelative(items); rel._human = items; rawAlphabet[name] = rel; }
        else rawAlphabet[name] = items;
      }
      currentTypedText = data.typedText || '';
      paletteStep = data.paletteStep ?? 0;
      toneMode = data.toneMode ?? 0;
      updatePaletteUI();
      const lbl = q(H.toneLabel); if (lbl) lbl.textContent = C.toneLabels[toneMode];
      rebuildChips();
      if (currentTypedText) {
        setMode('test');
        const inp = q(H.typeInput); if (inp) inp.value = currentTypedText;
        renderTypedText();
      } else { setMode('make'); }
      const ita = q(H.importTextarea); if (ita) ita.value = '';
      closeModal(H.saveLoadModal);
      toast('Session loaded!');
    } catch { toast('Invalid JSON — check your pasted data'); }
  }

  // ── Export ─────────────────────────────────────────────────
  function openExportModal(fmt) {
    if (!blocks.length) { toast('Nothing to export'); return; }
    _exportFormat = fmt;
    const t = q(H.exportModalTitle);
    if (t) t.textContent = fmt === 'svg' ? 'Export SVG' : 'Export PNG';
    const b = q(H.exportConfirmBtn);
    if (b) b.textContent = fmt === 'svg' ? 'Download SVG' : 'Download PNG';
    openModal(H.exportModal);
  }

  function getExportBlocks() {
    const plain   = q(H.expPlain)   ? q(H.expPlain).checked   : true;
    const strokes = q(H.expStrokes) ? q(H.expStrokes).checked : true;
    const type    = q(H.expType)    ? q(H.expType).checked    : true;
    return blocks.filter(() => plain).map(b => ({ ...b, _exportType: type, _exportStroke: strokes }));
  }

  function runExport() {
    closeModal(H.exportModal);
    if (_exportFormat === 'svg') doExportSVG(); else doExportPNG();
  }

  function doExportPNG() {
    const allBlocks = getExportBlocks();
    if (!allBlocks.length) { toast('No blocks to export'); return; }
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    allBlocks.forEach(b => {
      if (b.renderX==null) return;
      minX=Math.min(minX,b.renderX); minY=Math.min(minY,b.renderY);
      maxX=Math.max(maxX,b.renderX+b.renderW); maxY=Math.max(maxY,b.renderY+b.renderH);
    });
    if (!isFinite(minX)) { toast('Nothing rendered yet'); return; }
    const SCALE=4, PAD=32;
    const logW=maxX-minX+PAD*2, logH=maxY-minY+PAD*2;
    const offX=minX-PAD, offY=minY-PAD;
    const out=document.createElement('canvas');
    out.width=Math.ceil(logW*SCALE); out.height=Math.ceil(logH*SCALE);
    const ctx=out.getContext('2d');
    ctx.scale(SCALE,SCALE); ctx.clearRect(0,0,logW,logH);
    const sorted=[...allBlocks].filter(b=>b.renderX!=null).sort((a,b)=>(a.renderX||0)-(b.renderX||0));
    const BASE_RADIUS=C.blockRadius, rad=BASE_RADIUS*zoom;
    sorted.forEach(b => {
      const x=b.renderX-offX, y=b.renderY-offY, w=b.renderW, h=b.renderH;
      const col=blockColor(b);
      ctx.save(); ctx.beginPath(); ctx.roundRect(x,y,w,h,rad);
      if (b.outlined) {
        ctx.fillStyle=BG_COL; ctx.fill(); ctx.strokeStyle=col; ctx.lineWidth=C.blockStroke*zoom; ctx.stroke();
      } else {
        ctx.fillStyle=col; ctx.fill();
        if (b._exportStroke) { ctx.strokeStyle=BG_COL; ctx.lineWidth=C.blockStroke*zoom; ctx.stroke(); }
      }
      if (b._exportType && b.title) {
        const fs=C.blockFontSize*zoom, ps=C.blockPadSide*zoom, pt=C.blockPadTop*zoom;
        ctx.font=`500 ${fs}px "DM Sans",Arial,sans-serif`;
        ctx.fillStyle=b.outlined?col:BG_COL; ctx.globalAlpha=0.9;
        ctx.beginPath(); ctx.roundRect(x,y,w,h,rad); ctx.clip();
        ctx.fillText(b.title,x+ps,y+pt+fs);
        if (b.e-b.s>0.5) { ctx.globalAlpha=0.65; const _d1=b.fromType?b.s%24:b.s,_d2=b.fromType?b.e%24:b.e; ctx.fillText(toHHMM(_d1)+' – '+toHHMM(_d2),x+ps,y+pt+fs*2.35); }
      }
      ctx.restore();
    });
    const dataURL=out.toDataURL('image/png');
    const a=document.createElement('a'); a.href=dataURL; a.download='calfont.png';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast('calfont.png @4x downloaded');
  }

  function doExportSVG() {
    const allBlocks=getExportBlocks();
    if (!allBlocks.length) { toast('No blocks to export'); return; }
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    allBlocks.forEach(b => {
      if (b.renderX==null) return;
      minX=Math.min(minX,b.renderX); minY=Math.min(minY,b.renderY);
      maxX=Math.max(maxX,b.renderX+b.renderW); maxY=Math.max(maxY,b.renderY+b.renderH);
    });
    const PAD=24, svgW=maxX-minX+PAD*2, svgH=maxY-minY+PAD*2;
    const sorted=[...allBlocks].filter(b=>b.renderX!=null).sort((a,b)=>(a.renderX||0)-(b.renderX||0));
    const BASE_RADIUS=C.blockRadius, zr=zoom;
    const rects=sorted.map(b => {
      const bx=(b.renderX-minX+PAD).toFixed(2), by=(b.renderY-minY+PAD).toFixed(2);
      const w=b.renderW.toFixed(2), h=b.renderH.toFixed(2), r=(BASE_RADIUS*zr).toFixed(2);
      const col=blockColor(b);
      let rectEl;
      if (b.outlined) {
        rectEl=`<rect x="${bx}" y="${by}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${BG_COL}" stroke="${col}" stroke-width="${(C.blockStroke*zr).toFixed(2)}"/>`;
      } else {
        const sa=b._exportStroke?` stroke="${BG_COL}" stroke-width="${(C.blockStroke*zr).toFixed(2)}"`:'';
        rectEl=`<rect x="${bx}" y="${by}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${col}"${sa}/>`;
      }
      let textEls='';
      if (b._exportType && b.title) {
        const fs=(C.blockFontSize*zr).toFixed(2);
        const tx=(parseFloat(bx)+C.blockPadSide*zr).toFixed(2);
        const ty=(parseFloat(by)+C.blockPadTop*zr+C.blockFontSize*zr).toFixed(2);
        const textCol=b.outlined?col:BG_COL;
        const safeTitle=b.title.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        const _s=b.fromType?b.s%24:b.s,_e=b.fromType?b.e%24:b.e;
        const safeTime=(toHHMM(_s)+' \u2013 '+toHHMM(_e)).replace(/&/g,'&amp;');
        const clipId='cl'+Math.round(parseFloat(bx))+'_'+Math.round(parseFloat(by));
        textEls=`<clipPath id="${clipId}"><rect x="${bx}" y="${by}" width="${w}" height="${h}" rx="${r}"/></clipPath>`+
          `<text x="${tx}" y="${ty}" font-family="'DM Sans',Arial,sans-serif" font-size="${fs}" font-weight="500" fill="${textCol}" fill-opacity="0.9" clip-path="url(#${clipId})">${safeTitle}</text>`;
        if (b.e-b.s>0.5) {
          const ty2=(parseFloat(ty)+C.blockFontSize*zr*1.35).toFixed(2);
          textEls+=`<text x="${tx}" y="${ty2}" font-family="'DM Sans',Arial,sans-serif" font-size="${fs}" fill="${textCol}" fill-opacity="0.65" clip-path="url(#${clipId})">${safeTime}</text>`;
        }
      }
      return rectEl+textEls;
    }).join('\n  ');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${svgW.toFixed(0)}" height="${svgH.toFixed(0)}" viewBox="0 0 ${svgW.toFixed(0)} ${svgH.toFixed(0)}">\n  ${rects}\n</svg>`;
    const b64=btoa(unescape(encodeURIComponent(svg)));
    const a=document.createElement('a'); a.href='data:image/svg+xml;base64,'+b64; a.download='calfont.svg';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast('calfont.svg downloaded');
  }

  // ── p5 sketch ──────────────────────────────────────────────
  new p5(function(p) {
    p5ref = p;
    let CW, CH;
    const dw = () => BASE_DW * zoom;
    const hh = () => BASE_HH * zoom;

    function originX() {
      if (!isTypeMode) return CW/2 - 6*dw();
      const allCols = [
        ...(blocks.length ? blocks.map(b=>b.d) : []),
        ...(placeholderBlocks.length ? placeholderBlocks.map(b=>b.d) : [])
      ];
      if (!allCols.length) return CW/2 - 6*dw();
      return CW/2 - ((Math.max(...allCols)+1)/2)*dw();
    }
    function originY() {
      if (isTypeMode && currentTypedText) {
        const nLines = currentTypedText.split('\n').length;
        const WIN = 24, GAP_HRS = WIN * C.lineGapRatio, STRIDE = WIN + GAP_HRS;
        const totalHrs = (nLines - 1) * STRIDE + WIN; // full stack height
        // Midpoint of the stack, measured from hour 0
        const midHr = totalHrs / 2;
        // We want hourToY(midHr) = CH * verticalFocus
        // hourToY(h) = originY + (h - HOUR_S)*hh()
        // → originY = CH*verticalFocus - (midHr - HOUR_S)*hh()
        return CH * C.verticalFocus - (midHr - HOUR_S) * hh();
      }
      return CH * C.verticalFocus - (13 - HOUR_S) * hh();
    }
    function colToX(c) { return originX()+c*dw(); }
    function hourToY(h) { return originY()+(h-HOUR_S)*hh(); }
    function xToCol(x)  { return Math.floor((x-originX())/dw()); }
    function yToHour(y) { return (y-originY())/hh()+HOUR_S; }
    function snapHour(y){ return Math.max(0, Math.min(24, Math.round(yToHour(y)*4)/4)); }

    function processPhysics(events, dayX) {
      events.sort((a,b)=>(a._renderS??a.s)-(b._renderS??b.s)||blocks.indexOf(a)-blocks.indexOf(b));
      let lanes=[];
      events.forEach(ev => {
        const evS=ev._renderS??ev.s, evE=ev._renderE??ev.e;
        let l=0;
        while (lanes[l]&&lanes[l].some(e=>evS<(e._renderE??e.e)&&evE>(e._renderS??e.s))) l++;
        if (!lanes[l]) lanes[l]=[];
        lanes[l].push(ev); ev.lane=l;
      });
      const COL_MARGIN=10*zoom;
      const fullCol=dw()-COL_MARGIN;
      events.forEach(ev => {
        const evS=ev._renderS??ev.s, evE=ev._renderE??ev.e;
        const conc=events.filter(e=>evS<(e._renderE??e.e)&&evE>(e._renderS??e.s)&&e!==ev);
        let x=0,w=fullCol;
        if (ev.lane===0) {
          const h2=conc.find(e=>e.lane===1),h3=conc.find(e=>e.lane===2);
          if (h2&&h2.s-ev.s<=0.5) w=h3?fullCol*0.57:fullCol*0.85;
        } else if (ev.lane===1) {
          const h1=conc.find(e=>e.lane===0),h3=conc.find(e=>e.lane===2);
          if (h1&&ev.s-h1.s<=0.5) {
            x=fullCol*0.34; const seg=fullCol-x;
            if (!h3){x=fullCol*0.5;w=fullCol*0.5;}
            else w=h3.s-ev.s<=0.5?seg*0.85:seg;
          } else { x=fullCol*0.05; const seg=fullCol-x; w=h3&&h3.s-ev.s<=0.5?seg*0.85:seg; }
        } else if (ev.lane===2) {
          const h2=conc.find(e=>e.lane===1);
          if (h2) { const h2x=h2.renderX-dayX; x=ev.s-h2.s<=0.5?h2x+(fullCol-h2x)*0.5:h2x+(fullCol-h2x)*0.05; w=fullCol-x; }
        }
        const rs=ev._renderS!==undefined?ev._renderS:ev.s;
        const re=ev._renderE!==undefined?ev._renderE:ev.e;
        ev.renderX=dayX+x; ev.renderY=hourToY(rs); ev.renderW=w; ev.renderH=(re-rs)*hh();
      });
    }

    function hexToRgb(hex) { return{r:parseInt(hex.slice(1,3),16),g:parseInt(hex.slice(3,5),16),b:parseInt(hex.slice(5,7),16)}; }

    function drawBlock(b, isGhost) {
      const col=blockColor(b);
      const {r,g,b:bv}=hexToRgb(col);
      const isDrag=dragging===b;
      const radius=C.blockRadius*zoom;
      const PAD_TOP=C.blockPadTop*zoom;
      const PAD_SIDE=C.blockPadSide*zoom;
      const fontSize=C.blockFontSize*zoom;
      const sw=C.blockStroke*zoom;
      if (b.outlined) { p.fill(BGr,BGg,BGb); p.stroke(r,g,bv); p.strokeWeight(isDrag?sw*1.6:sw); }
      else             { p.fill(r,g,bv);     p.stroke(BGr,BGg,BGb); p.strokeWeight(isDrag?sw*2:sw); }
      p.rect(b.renderX,b.renderY,b.renderW,b.renderH,radius);
      if (!isTypeMode&&!isGhost) {
        const ry=b.renderY+b.renderH;
        p.noStroke(); p.fill(b.outlined?r:BGr,b.outlined?g:BGg,b.outlined?bv:BGb,55);
        const nubW=b.renderW*0.38, nubH=3*zoom;
        p.rect(b.renderX+(b.renderW-nubW)/2,ry-nubH*2,nubW,nubH,nubH*0.5);
      }
      const minShowH=PAD_TOP*2+fontSize;
      if (b.renderH<minShowH||isGhost) return;
      p.noStroke();
      const tr=b.outlined?r:BGr, tg=b.outlined?g:BGg, tb=b.outlined?bv:BGb;
      p.push();
      p.drawingContext.save(); p.drawingContext.beginPath();
      p.drawingContext.roundRect(b.renderX,b.renderY,b.renderW,b.renderH,radius);
      p.drawingContext.clip();
      p.textFont('DM Sans, sans-serif'); p.textSize(fontSize); p.textStyle(p.NORMAL);
      p.fill(tr,tg,tb,230);
      p.text(b.title||'',b.renderX+PAD_SIDE,b.renderY+PAD_TOP+fontSize);
      const timeRowY=b.renderY+PAD_TOP+fontSize+fontSize*1.35;
      if (timeRowY+fontSize<b.renderY+b.renderH-PAD_TOP*0.5) {
        p.fill(tr,tg,tb,160);
        const _ts=b.fromType?b.s%24:b.s,_te=b.fromType?b.e%24:b.e;
        p.text(toHHMM(_ts)+' \u2013 '+toHHMM(_te),b.renderX+PAD_SIDE,timeRowY);
      }
      p.drawingContext.restore(); p.pop();
    }

    function drawGrid() {
      p.background(BGr,BGg,BGb);
      const ox=originX();
      const fc=Math.floor(-ox/dw())-1;
      const lc=fc+Math.ceil(CW/dw())+2;
      const colSW=Math.max(0.5,Math.min(2,zoom));
      p.stroke(200); p.strokeWeight(colSW);
      for (let c=fc;c<=lc;c++) p.line(ox+c*dw(),0,ox+c*dw(),CH);
    }

    function drawHourLabels() {
      const LX=14;
      const colSW=Math.max(0.5,Math.min(2,zoom));
      p.push();
      p.textFont('DM Mono, monospace'); p.textSize(11); p.textAlign(p.LEFT,p.CENTER);
      function drawLabel(txt,y) {
        const tw=p.textWidth(txt);
        p.fill(BGr,BGg,BGb,210); p.noStroke();
        p.rect(LX-4,y-9,tw+10,18,4);
        p.fill(155); p.text(txt,LX,y);
      }
      function drawLinePair(yTop,yBot) {
        p.stroke(178); p.strokeWeight(colSW);
        p.line(0,yTop,CW,yTop); p.line(0,yBot,CW,yBot);
        drawLabel('09:00',yTop); drawLabel('17:00',yBot);
      }
      if (isTypeMode && currentTypedText) {
        // Guide lines at 9am and 5pm of each line's 24hr window
        const nLines=currentTypedText.split('\n').length;
        const WIN=24, GAP_HRS=WIN*C.lineGapRatio, STRIDE=WIN+GAP_HRS;
        for (let li=0;li<nLines;li++) {
          const shift=li*STRIDE;
          drawLinePair(hourToY(GLYPH_START+shift),hourToY(GLYPH_END+shift));
        }
      } else {
        drawLinePair(hourToY(HOUR_S),hourToY(HOUR_E));
      }
      p.pop();
    }

    function drawPlaceholders() {
      placeholderBlocks.forEach(b => {
        const x=colToX(b.d), y=hourToY(b._renderS??b.s), h=(b._renderE??b.e)-(b._renderS??b.s);
        const rh=h*hh(), rw=dw()-10*zoom;
        p.push();
        // Semi-transparent grey fill
        p.fill(11,11,11,28); p.stroke(11,11,11,60); p.strokeWeight(1);
        p.rect(x,y,rw,rh,C.blockRadius*zoom);
        // Text
        p.noStroke();
        p.textFont('DM Sans,sans-serif'); p.textSize(9*zoom); p.textAlign(p.CENTER,p.TOP);
        const cx=x+rw/2, cy=y+rh/2-12*zoom;
        p.fill(11,11,11,160); p.text(b.char,cx,cy);
        p.fill(11,11,11,90); p.textSize(8*zoom);
        p.text('Build this glyph',cx,cy+11*zoom);
        p.text('in Make mode first',cx,cy+21*zoom);
        p.pop();
      });
    }

    p.setup = function() {
      const wrap = document.getElementById(C.canvasContainerId);
      CW = wrap.offsetWidth; CH = wrap.offsetHeight;
      const cnv = p.createCanvas(CW, CH);
      cnv.parent(C.canvasContainerId);
      canvasEl = cnv.elt; // cache DOM element for cursor control
      // Right-click on a block deletes it; suppress browser context menu
      cnv.elt.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        if (isTypeMode) return;
        // Find topmost block under cursor (iterate reverse for z-order)
        for (let i=blocks.length-1; i>=0; i--) {
          const b=blocks[i];
          if (b.renderW==null) continue;
          if (e.offsetX>=b.renderX && e.offsetX<=b.renderX+b.renderW &&
              e.offsetY>=b.renderY && e.offsetY<=b.renderY+b.renderH) {
            blocks.splice(i,1);
            return;
          }
        }
      });
      p.textFont('DM Sans, sans-serif');
      positionMidBar();
    };

    p.windowResized = function() {
      const wrap = document.getElementById(C.canvasContainerId);
      CW=wrap.offsetWidth; CH=wrap.offsetHeight;
      p.resizeCanvas(CW,CH); positionMidBar();
    };

    function positionMidBar() {
      const X=48, bottomBarH=75;
      const el=q(H.midBar||'#cf-mid-bar');
      if (el) el.style.bottom=(X+bottomBarH+2*X)+'px';
    }

    p.mouseWheel = function(e) {
      if (document.querySelector('.cf-modal-open')) return;
      zoom-=e.delta*C.zoomStep;
      zoom=Math.max(C.zoomMin,Math.min(C.zoomMax,zoom));
      return false;
    };

    p.draw = function() {
      drawGrid();
      // Gradient overlay — bottom fraction, grid lines behind it
      p.push(); p.noStroke();
      const gradH=CH*C.gradientHeightRatio, gradY=CH-gradH;
      const gc=p.drawingContext.createLinearGradient(0,gradY,0,CH);
      gc.addColorStop(0,`rgba(${BGr},${BGg},${BGb},0)`);
      gc.addColorStop(1,`rgba(${BGr},${BGg},${BGb},1)`);
      p.drawingContext.fillStyle=gc;
      p.drawingContext.fillRect(0,gradY,CW,gradH);
      p.pop();

      drawHourLabels();

      const minD=blocks.length?Math.min(...blocks.map(b=>b.d)):0;
      const maxD=blocks.length?Math.max(...blocks.map(b=>b.d)):0;
      for (let d=minD;d<=maxD;d++) {
        const evts=blocks.filter(b=>b.d===d);
        if (evts.length) processPhysics(evts,colToX(d));
      }
      if (!isTypeMode&&ghostBlocks.length) {
        const gMinD=Math.min(...ghostBlocks.map(b=>b.d));
        const gMaxD=Math.max(...ghostBlocks.map(b=>b.d));
        for (let d=gMinD;d<=gMaxD;d++) {
          const evts=ghostBlocks.filter(b=>b.d===d);
          if (evts.length) processPhysics(evts,colToX(d));
        }
        p.push(); p.drawingContext.globalAlpha=0.30;
        [...ghostBlocks].sort((a,b)=>(a.renderX||0)-(b.renderX||0)).forEach(b=>drawBlock(b,true));
        p.drawingContext.globalAlpha=1.0; p.pop();
      }
      [...blocks].sort((a,b)=>(a.renderX||0)-(b.renderX||0)).forEach(b=>drawBlock(b,false));
      if (!isTypeMode&&isCreating) {
        const sh=snapHour(createY0),eh=snapHour(p.mouseY);
        if (sh!==eh) {
          const d=xToCol(createX0),x=colToX(d);
          const y1=hourToY(Math.min(sh,eh)),y2=hourToY(Math.max(sh,eh));
          const {r,g,b:bv}=hexToRgb(PALETTE[getPaletteState().palIdx||0]);
          p.fill(r,g,bv,48);p.stroke(r,g,bv,100);p.strokeWeight(1);
          p.rect(x+1,y1,dw()-11,y2-y1,6);
        }
      }
      drawPlaceholders();

      // ── Cursor feedback & nub highlight ──────────────────────────
      if (!isTypeMode && !dragging && !resizing && !isCreating) {
        const sorted=[...blocks].filter(b=>b.renderW!=null).sort((a,b)=>(b.renderX||0)-(a.renderX||0));
        let cursor='crosshair'; // default: drawing mode
        let nubHoverBlock=null;
        let bodyHoverBlock=null;
        for (const b of sorted) {
          const nubY=b.renderY+b.renderH;
          if (p.mouseX>=b.renderX&&p.mouseX<=b.renderX+b.renderW&&p.mouseY>=nubY-10*zoom&&p.mouseY<=nubY+6*zoom) {
            nubHoverBlock=b; cursor='ns-resize'; break;
          }
          if (p.mouseX>=b.renderX&&p.mouseX<=b.renderX+b.renderW&&p.mouseY>=b.renderY&&p.mouseY<=b.renderY+b.renderH) {
            bodyHoverBlock=b; cursor='grab'; break;
          }
        }
        // Highlight hovered nub
        if (nubHoverBlock) {
          const nb=nubHoverBlock;
          const nubW=nb.renderW*0.38, nubH=3*zoom;
          const nx=nb.renderX+(nb.renderW-nubW)/2, ny=nb.renderY+nb.renderH-nubH*2;
          p.noStroke(); p.fill(11,11,11,120);
          p.rect(nx,ny,nubW,nubH*1.6,nubH*0.5);
        }
        if(canvasEl) canvasEl.style.cursor=cursor;
      } else if (dragging) {
        if(canvasEl) canvasEl.style.cursor='grabbing';
      } else if (resizing) {
        if(canvasEl) canvasEl.style.cursor='ns-resize';
      } else if (isCreating) {
        if(canvasEl) canvasEl.style.cursor='crosshair';
      }
    };

    p.mousePressed = function() {
      if (document.querySelector('.cf-modal-open')) return;
      if (isTypeMode) return;
      // Hit-test in reverse draw order (sorted by renderX descending = topmost visible first)
      const sorted=[...blocks].filter(b=>b.renderW!=null).sort((a,b)=>(b.renderX||0)-(a.renderX||0));
      // Check resize nub first
      for (const b of sorted) {
        const nubY=b.renderY+b.renderH;
        if (p.mouseX>=b.renderX&&p.mouseX<=b.renderX+b.renderW&&p.mouseY>=nubY-10*zoom&&p.mouseY<=nubY+6*zoom) {
          resizing=b; dragOffY=p.mouseY-hourToY(b.e); return;
        }
      }
      // Check drag body
      for (const b of sorted) {
        if (p.mouseX>=b.renderX&&p.mouseX<=b.renderX+b.renderW&&p.mouseY>=b.renderY&&p.mouseY<=b.renderY+b.renderH) {
          dragging=b; dragOffY=p.mouseY-hourToY(b.s); return;
        }
      }
      // Nothing hit — create new block
      isCreating=true; createY0=p.mouseY; createX0=p.mouseX;
    };

    p.mouseDragged = function() {
      if (isTypeMode) return;
      if (resizing) {
        const newE=Math.max(resizing.s+0.25, Math.min(24, snapHour(p.mouseY-dragOffY)));
        resizing.e=newE; resizing._renderE=newE; return;
      }
      if (dragging) {
        const dur=dragging.e-dragging.s;
        let newS=snapHour(p.mouseY-dragOffY);
        // Clamp so block stays within 0-24
        if (newS < 0) newS = 0;
        if (newS + dur > 24) newS = 24 - dur;
        dragging.s=newS; dragging.e=newS+dur;
        dragging._renderS=newS; dragging._renderE=newS+dur;
        dragging.d=xToCol(p.mouseX);
        return;
      }
    };

    p.mouseReleased = function() {
      if (isTypeMode) return;
      if (resizing) { resizing=null; return; }
      if (dragging) { dragging=null; return; }
      if (isCreating) {
        isCreating=false;
        const sh=snapHour(createY0), eh=snapHour(p.mouseY);
        if (Math.abs(eh-sh)>=0.25) {
          const d=xToCol(createX0);
          const b={ d, s:Math.min(sh,eh), e:Math.max(sh,eh), outlined:false, title:randTitle() };
          applyStyle(b,blocks.length,true); blocks.push(b);
        }
      }
    };
  }, C.canvasContainerId);

  // ── Bind all DOM hooks ─────────────────────────────────────
  on(H.btnMake,        'click', ()=>setMode('make'));
  on(H.btnTest,        'click', ()=>setMode('test'));
  on(H.addBtn,         'click', saveGlyph);
  on(H.palBtn,         'click', advancePalette);
  on(H.palDisplay,     'click', advancePalette);
  on(H.toneBtn,        'click', rotateTone);
  on(H.exportSvgBtn,   'click', ()=>openExportModal('svg'));
  on(H.exportPngBtn,   'click', ()=>openExportModal('png'));
  on(H.sessionBtn,     'click', showSaveLoad);
  on(H.exportConfirmBtn,'click', runExport);
  on(H.tabSave,        'click', ()=>showTab('save'));
  on(H.tabLoad,        'click', ()=>showTab('load'));
  on(H.copyExportBtn,  'click', copyExport);
  on(H.loadSessionBtn, 'click', loadFromTextarea);
  on(H.overwriteConfirm,'click',()=>{ if(pendingOverwriteName) commitSaveGlyph(pendingOverwriteName); closeModal(H.overwriteModal); });
  onAll(H.overwriteCancel, 'click', ()=>{ pendingOverwriteName=null; closeModal(H.overwriteModal); });
  onAll(H.exportCloseBtns, 'click', ()=>closeModal(H.exportModal));
  onAll(H.closeSaveLoadBtns,'click',()=>closeModal(H.saveLoadModal));

  on(H.nameInput, 'input', checkOverwriteMode);
  on(H.nameInput, 'keydown', e=>{ if(e.key==='Enter') saveGlyph(); });
  on(H.typeInput, 'input', ()=>{
    const el=q(H.typeInput);
    if (el) { el.style.height='34px'; el.style.height=el.scrollHeight+'px'; }
    renderTypedText();
  });
  on(H.typeInput, 'keydown', e=>{ if(e.key==='Tab') e.preventDefault(); });

  // Close modals on overlay click
  [H.exportModal, H.overwriteModal, H.saveLoadModal].forEach(sel => {
    on(sel, 'click', e=>{ if(e.target===q(sel)) closeModal(sel); });
  });

  // Escape key
  document.addEventListener('keydown', e=>{
    if (document.querySelector('.cf-modal-open')) {
      if (e.key==='Escape') qa('.cf-modal-open').forEach(m=>closeModal('#'+m.id));
      return;
    }
    if (e.key==='Escape'&&!isTypeMode) blocks=[];
  });

  // ── Inject input uppercase styles ────────────────────────
  // Forces typed characters to uppercase while keeping placeholder normal.
  // Uses a <style> tag so it works regardless of how inputs are styled in Webflow.
  (function() {
    const s = document.createElement('style');
    s.textContent = [
      H.nameInput + ' { text-transform: uppercase; }',
      H.typeInput  + ' { text-transform: uppercase; }',
      // ::placeholder pseudo-element needs separate rules per browser
      H.nameInput + '::placeholder { text-transform: none; }',
      H.typeInput  + '::placeholder { text-transform: none; }',
      H.nameInput + '::-webkit-input-placeholder { text-transform: none; }',
      H.typeInput  + '::-webkit-input-placeholder { text-transform: none; }',
    ].join('\n');
    document.head.appendChild(s);
  })();

  // ── Init ──────────────────────────────────────────────────
  loadPresets();
  updatePaletteUI();
  const lbl=q(H.toneLabel); if(lbl) lbl.textContent=C.toneLabels[toneMode];
  setMode(C.defaultMode);
  const inp=q(H.typeInput);
  if (inp) { inp.value=C.defaultText; currentTypedText=C.defaultText; }
  renderTypedText();

}; // end CF.init
