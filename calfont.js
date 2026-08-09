/* ============================================================================
   CalFont V2 — self-contained engine bundle
   Everything (styles, UI, engine, CSS-3D view) in one isolated bundle that
   mounts into <div id="cf-root">. Styles scoped under #cf-root; JS namespaced
   (window.CF / window.CF3D). No importmap, no three.js. Requires p5.js loaded
   before this file.
   ============================================================================ */
(function(){
  var ROOT = document.getElementById('cf-root');
  if(!ROOT){ console.error('[CalFont] No container — add <div id="cf-root"></div> to the page.'); return; }
  if(ROOT.getAttribute('data-cf-mounted')){ return; }
  ROOT.setAttribute('data-cf-mounted','1');


  /* ---- styles (scoped under #cf-root) ---- */
  var CF_CSS = `
#cf-root {
  --colors--black: black;
  --colors--smoke-white: #d9d9d9;
  --colors--blue: #0f0bf3;
  --colors--gelb: #ff9c1a;
  --colors--white: white;
  --colors--red: #ff2d02;
  --colors--dark-grey: #161616;
  --colors--fire-red: #cc3e1b;
}


@font-face {
  font-family: Denim INK Trial;
  src: url("https://cdn.prod.website-files.com/613d225736aa8c9edc6c0a24/68472fefcaf8c30c127645b6_DenimINK-TRIAL-SemiBold.otf") format("opentype");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Denim Trial;
  src: url("https://cdn.prod.website-files.com/613d225736aa8c9edc6c0a24/6847300370c47cb1aa03cb43_Denim-TRIAL-Regular.otf") format("opentype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Denim INK Trial;
  src: url("https://cdn.prod.website-files.com/613d225736aa8c9edc6c0a24/6861c5f57980194612a7efb7_DenimINK-TRIAL-Regular.otf") format("opentype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Denim INK Trial;
  src: url("https://cdn.prod.website-files.com/613d225736aa8c9edc6c0a24/6861c5f5ff9273e1b52620cf_DenimINK-TRIAL-Bold.otf") format("opentype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Denim INK Trial;
  src: url("https://cdn.prod.website-files.com/613d225736aa8c9edc6c0a24/6886a985eaa76c813f4bebc1_DenimINK-TRIAL-Light.otf") format("opentype");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}


#cf-root *, #cf-root *::before, #cf-root *::after { box-sizing: border-box; }

#cf-root {
  margin: 0;
  color: var(--colors--black);
  background-color: var(--colors--smoke-white);
  font-family: Denim Trial, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.3;
}


#cf-root .txt-white { color: var(--colors--smoke-white); }
#cf-root .txt-grey { color: #868686; }
#cf-root .txt-caps { text-transform: uppercase; }

#cf-root .p3 {
  font-size: 14px;
  line-height: 1.4;
}

#cf-root .p3.txt-caps { text-transform: uppercase; }
#cf-root .p3.txt-caps.txt-grey { color: #868686; }


#cf-root .tools-cf-canvas {
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  display: flex;
  position: relative;
}


#cf-root .tools-cf-wrapper-menu {
  justify-content: center;
  align-items: center;
  display: flex;
  position: absolute;
  inset: 100px 0% auto;
}

#cf-root .tools-cf-div-menu {
  grid-column-gap: 6px;
  grid-row-gap: 6px;
  background-color: #0b0b0b66;
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;
  padding: 2px 4px;
  display: flex;
}

#cf-root .cf-top-btn {
  color: var(--colors--smoke-white);
  padding: 8px 6px;
  text-decoration: none;
  display: inline-block;
}

#cf-root .cf-top-btn:hover { color: var(--colors--white); }

#cf-root .tools-cf-txt-h5-menu {
  letter-spacing: -1px;
  text-transform: uppercase;
  flex-flow: row;
  font-family: Denim INK Trial, Arial, sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: .9;
  display: block;
}


#cf-root .tools-cf-wrapper-controls {
  grid-column-gap: 40px;
  grid-row-gap: 40px;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  display: flex;
  position: absolute;
  inset: auto 0% 8vh;
}


#cf-root .tools-cf-wrapper-small-controls {
  grid-column-gap: 40px;
  grid-row-gap: 40px;
  justify-content: center;
  align-items: center;
  display: flex;
}

#cf-root .tools-cf-small-controls-section {
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  flex: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
}

#cf-root .tools-cf-small-controls-section-fixed {
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  flex: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
}

#cf-root .cf-zone { flex: 1; }


#cf-root .tools-cf-wrapper-large-controls {
  grid-column-gap: 24px;
  grid-row-gap: 24px;
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  background-color: #0b0b0b14;
  border-radius: 8px;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 24px;
  display: flex;
  position: relative;
}

#cf-root .tools-cf-large-controls-section {
  grid-column-gap: 12px;
  grid-row-gap: 12px;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  display: flex;
}

#cf-root .tools-cf-large-controls-section.tools-cf-wrapper-savedglyphs { max-width: 600px; }

#cf-root .tools-cf-large-controls-section-cta {
  grid-column-gap: 4px;
  grid-row-gap: 4px;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  display: flex;
}

#cf-root .tools-cf-large-controls-section-chips {
  grid-column-gap: 4px;
  grid-row-gap: 4px;
  flex-flow: wrap;
  place-content: flex-start center;
  align-items: flex-start;
  display: flex;
}

#cf-root .tools-cf-vertical-devider {
  background-color: #b8b8b8;
  flex: 1;
  align-self: stretch;
  width: 1px;
  height: 100%;
  min-height: 64px;
}


#cf-root .tools-cf-icon-lg { width: 20px; height: 20px; }
#cf-root .tools-cf-icon-sm { align-self: center; width: 16px; height: 16px; margin-top: auto; margin-bottom: auto; }
#cf-root .tools-cf-icon-md { width: 22px; height: 22px; }


#cf-root .cf-btn-lg {
  grid-column-gap: 4px;
  grid-row-gap: 4px;
  border: 1px solid var(--colors--dark-grey);
  background-color: var(--colors--smoke-white);
  color: var(--colors--dark-grey);
  cursor: pointer;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  height: 42px;
  padding-left: 10px;
  padding-right: 10px;
  font-family: Denim INK Trial, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  text-decoration: none;
}

#cf-root .cf-btn-lg.cf-active {
  background-color: var(--cf-active-color, var(--colors--dark-grey));
  color: #D9D9D9;
  border-color: var(--cf-active-color, var(--colors--dark-grey));
}

#cf-root .cf-btn-lg.cf-active:hover {
  background-color: var(--colors--dark-grey);
  color: var(--colors--smoke-white);
}


#cf-root .cf-btn-add {
  grid-column-gap: 4px;
  grid-row-gap: 4px;
  background-color: var(--colors--smoke-white);
  color: var(--colors--dark-grey);
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #b0b0b0;
  border-radius: 100px;
  flex: 0 auto;
  justify-content: center;
  align-items: center;
  height: 42px;
  padding-left: 10px;
  padding-right: 10px;
  font-family: Denim INK Trial, Arial, sans-serif;
  font-size: 14px;
  display: flex;
  text-decoration: none;
}

#cf-root .cf-btn-add:hover { border-color: var(--colors--dark-grey); }


#cf-root .cf-btn-sm {
  background-color: var(--colors--smoke-white);
  color: var(--colors--dark-grey);
  cursor: pointer;
  border: 1px solid #b0b0b0;
  border-radius: 100px;
  justify-content: center;
  align-self: center;
  align-items: center;
  height: 32px;
  padding-left: 10px;
  padding-right: 10px;
  font-family: Denim INK Trial, Arial, sans-serif;
  font-size: 13px;
  display: flex;
  text-decoration: none;
}

#cf-root .cf-btn-sm:hover {
  background-color: var(--colors--dark-grey);
  color: var(--colors--smoke-white);
}

#cf-root .cf-btn-sm.cf-icon-only { width: 32px; padding: 0; }

#cf-root .cf-btn-sm.cf-red {
  background-color: #ff4a36;
  color: #fff;
  border-style: none;
}

#cf-root .cf-btn-sm.cf-red:hover { background-color: var(--colors--dark-grey); }


#cf-root .cf-chip {
  background-color: var(--colors--smoke-white);
  color: var(--colors--dark-grey);
  border: 1px solid #b0b0b0;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  height: 32px;
  padding-left: 8px;
  padding-right: 8px;
  font-family: Denim Trial, Arial, sans-serif;
  font-size: 13px;
  display: flex;
  text-decoration: none;
  cursor: pointer;
}

#cf-root .cf-chip:hover {
  background-color: var(--colors--dark-grey);
  color: var(--colors--smoke-white);
}

#cf-root .cf-chip.cf-chip-lg {
  cursor: pointer;
  width: 44px;
  padding-top: 0;
  padding-bottom: 1px;
  font-family: Denim INK Trial, Arial, sans-serif;
  font-size: 22px;
  font-weight: 700;
}


#cf-root .cf-pal-display {
  border-radius: 100px;
  width: 32px;
  height: 32px;
}


#cf-root .cf-input {
  background-color: var(--colors--smoke-white);
  border: 1px solid #b0b0b0;
  border-radius: 4px;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 42px;
  padding-left: 12px;
  display: flex;
  font-family: Denim Trial, Arial, sans-serif;
  font-size: 13px;
  outline: none;
}

#cf-root .cf-input.cf-input-mono {
  font-family: DM Mono, monospace;
  font-size: 13px;
  text-transform: uppercase;
}


#cf-root .tools-cf-toast {
  z-index: 100;
  opacity: 0;
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  pointer-events: none;
  color: var(--colors--smoke-white);
  background-color: #0b0b0b66;
  border-radius: 4px;
  padding: 8px 16px;
  display: flex;
  position: fixed;
  inset: auto;
  transition: opacity 0.2s;
}

#cf-root .tools-cf-toast.cf-show { opacity: 1; }


#cf-root .cf-modal {
  z-index: 100;
  opacity: 0;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  pointer-events: none;
  background-color: #d9d9d9b3;
  justify-content: center;
  align-items: center;
  display: flex;
  position: fixed;
  inset: 0%;
  transition: opacity 0.15s;
}

#cf-root .cf-modal.cf-modal-open {
  opacity: 1;
  pointer-events: auto;
}


#cf-root .cf-modal-box {
  z-index: 100;
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  color: var(--colors--smoke-white);
  background-color: #0b0b0b66;
  border-radius: 8px;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  max-width: 92vw;
  padding: 12px;
  display: flex;
  gap: 16px;
  position: relative;
}

#cf-root .cf-modal-title {
  text-indent: -1px;
  text-transform: uppercase;
  font-family: Denim INK Trial, Arial, sans-serif;
  font-weight: 600;
  font-size: 16px;
}

#cf-root .cf-modal-close {
  color: var(--colors--white);
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: 100px;
  flex: none;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  padding: 4px;
  display: flex;
  position: absolute;
  top: 12px;
  right: 12px;
}

#cf-root .cf-modal-close:hover { background-color: #cfcfcf4d; }
#cf-root .cf-modal-close img { width: 100%; height: 100%; }


#cf-root .tools-panel-header {
  grid-column-gap: 40px;
  grid-row-gap: 40px;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  display: flex;
}

#cf-root .tools-panel-section {
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  display: flex;
}

#cf-root .tools-panel-devider {
  background-color: var(--colors--smoke-white);
  opacity: .3;
  width: 100%;
  height: 1px;
}

#cf-root .tools-panel-section-controls {
  grid-column-gap: 40px;
  grid-row-gap: 40px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  display: flex;
}

#cf-root .tools-info-controls {
  color: var(--colors--dark-grey);
  text-transform: uppercase;
  background-color: #b8b8b8;
  border-radius: 3px;
  justify-content: center;
  align-items: center;
  padding: 4px 3px 2px;
  font-family: Denim Trial, Arial, sans-serif;
  font-size: 13px;
  font-weight: 400;
  display: flex;
}


#cf-root .tools-modal-tab-row {
  grid-column-gap: 4px;
  grid-row-gap: 4px;
  background-color: #fff3;
  border-radius: 12px;
  padding: 4px;
  display: flex;
  width: 100%;
}

#cf-root .tools-modal-btn {
  background-color: var(--colors--smoke-white);
  color: var(--colors--black);
  text-transform: uppercase;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.3;
  cursor: pointer;
  flex: 1;
}

#cf-root .tools-modal-btn:hover { background-color: var(--colors--white); }

#cf-root .tools-modal-btn.tools-modal-btn-ghost {
  border: 1px solid var(--colors--white);
  color: var(--colors--white);
  background-color: transparent;
}

#cf-root .tools-modal-btn.tools-modal-btn-ghost:hover { background-color: #d9d9d933; }


#cf-root .tools-modal-textarea {
  background-color: #3f3f3fe6;
  border-radius: 4px;
  width: 100%;
  height: 164px;
  padding: 12px 16px;
  color: #9ecf9e;
  border: 1px solid rgba(255,255,255,0.08);
  font-family: DM Mono, monospace;
  font-size: 10px;
  line-height: 1.55;
  resize: none;
  outline: none;
}

#cf-root .tools-modal-textarea.cf-blue { color: #9ec4ef; }
    
    #cf-root * {
      font-smooth: always;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #cf-root ::selection { background: #FF4C3F; color: #5F1111; text-shadow: none; }

    
    #cf-root #cf-name-input {
      width: 280px;
      height: 42px;
      padding: 0 16px;
    }

    
    #cf-root .tools-cf-wrapper-menu, #cf-root .tools-cf-wrapper-controls { z-index: 60; }

    
    #cf-root #cf-type-input {
      width: 320px;
      height: 42px;
      min-height: 42px;
      max-height: 42px;
      resize: none;
      overflow: hidden;
      padding: 12px 16px;
    }
  #cf-root .cf-modal.cf-modal-open .cf-modal-box { transform: translateY(0); }
  #cf-root .cf-modal-btns { display: flex; gap: 8px; }
  #cf-root .tools-modal-btn {
    flex: 1; border: none;
    cursor: pointer; transition: all 0.14s;
  }
  #cf-root .cf-modal-btn.cf-ghost { background: transparent; color: #aaa; border: 1px solid white; }
  #cf-root .cf-modal-btn.cf-ghost:hover { background: rgba(255,255,255,0.06); }
  #cf-root .cf-modal-btn.cf-danger { background: #c0392b; color: #f0f0f0; }
  #cf-root .cf-modal-btn.cf-danger:hover { background: #e74c3c; }
  #cf-root .cf-modal-btn.cf-primary { background: #4a4a4a; color: #f0f0f0; }
  #cf-root .cf-modal-btn.cf-primary:hover { background: #5a5a5a; }
  #cf-root .cf-check-row {
    display: flex; align-items: center; gap: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: #ddd; padding: 2px 0;
  }
  #cf-root .cf-check-row input { width: 16px; height: 16px; accent-color: #7A86CB; cursor: pointer; }
  #cf-root .cf-check-hint { margin-left: auto; font-size: 11px; color: #666; }
  #cf-root .tools-modal-textarea {
    color: #9ecf9e; border: 1px solid rgba(255,255,255,0.08);
    font-family: 'DM Mono', monospace; font-size: 10px; line-height: 1.55;
    resize: none; outline: none;
  }
  #cf-root .cf-modal-textarea.cf-blue { color: #9ec4ef; }
  #cf-root .tools-modal-tab-row {}
  #cf-root .tools-modal-tab { border: none; cursor: pointer; transition: all 0.12s; }

/* ---- engine: full-viewport layer ---- */
#cf-root{position:fixed;inset:0;z-index:2147483000;}

`;
  var _st=document.createElement('style');_st.setAttribute('data-cf-style','1');_st.textContent=CF_CSS;document.head.appendChild(_st);

  /* ---- markup ---- */
  var CF_HTML = `
<div id="cf-canvas" class="tools-cf-canvas">

  <!-- Toast notification -->
  <div id="cf-toast" class="tools-cf-toast"><p>Text</p></div>

  <!-- Top menu bar: Save / Controls / About -->
  <div class="tools-cf-wrapper-menu">
    <div id="cf-top-bar" class="tools-cf-div-menu">
      <a id="cf-session-btn" href="#" class="cf-top-btn">
        <div class="tools-cf-txt-h5-menu">Save</div>
      </a>
      <div class="txt-white">/</div>
      <a id="cf-menu-btn-controls" href="#" class="cf-top-btn">
        <div class="tools-cf-txt-h5-menu">Controls</div>
      </a>
      <div class="txt-white">/</div>
      <a id="cf-menu-btn-about" href="#" class="cf-top-btn">
        <div class="tools-cf-txt-h5-menu">About</div>
      </a>
      <div class="txt-white">/</div>
      <a id="cf-btn-3d" href="#" class="cf-top-btn">
        <div class="tools-cf-txt-h5-menu" id="cf-btn-3d-label">3D</div>
      </a>
    </div>
  </div>

  <!-- Main controls -->
  <div class="tools-cf-wrapper-controls">

    <!-- Row 1: Mode buttons + inputs -->
    <div class="tools-cf-wrapper-small-controls">
      <div class="tools-cf-small-controls-section">
        <div id="cf-btn-make" class="cf-btn-lg cf-active">
          <div class="tools-cf-icon-lg">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.6667 8C11.4015 8 11.1471 7.89464 10.9596 7.70711C10.772 7.51957 10.6667 7.26522 10.6667 7C10.6667 6.73478 10.772 6.48043 10.9596 6.29289C11.1471 6.10536 11.4015 6 11.6667 6C11.9319 6 12.1862 6.10536 12.3738 6.29289C12.5613 6.48043 12.6667 6.73478 12.6667 7C12.6667 7.26522 12.5613 7.51957 12.3738 7.70711C12.1862 7.89464 11.9319 8 11.6667 8ZM9.66667 5.33333C9.40145 5.33333 9.1471 5.22798 8.95956 5.04044C8.77202 4.8529 8.66667 4.59855 8.66667 4.33333C8.66667 4.06812 8.77202 3.81376 8.95956 3.62623C9.1471 3.43869 9.40145 3.33333 9.66667 3.33333C9.93188 3.33333 10.1862 3.43869 10.3738 3.62623C10.5613 3.81376 10.6667 4.06812 10.6667 4.33333C10.6667 4.59855 10.5613 4.8529 10.3738 5.04044C10.1862 5.22798 9.93188 5.33333 9.66667 5.33333ZM6.33333 5.33333C6.06812 5.33333 5.81376 5.22798 5.62623 5.04044C5.43869 4.8529 5.33333 4.59855 5.33333 4.33333C5.33333 4.06812 5.43869 3.81376 5.62623 3.62623C5.81376 3.43869 6.06812 3.33333 6.33333 3.33333C6.59855 3.33333 6.8529 3.43869 7.04044 3.62623C7.22798 3.81376 7.33333 4.06812 7.33333 4.33333C7.33333 4.59855 7.22798 4.8529 7.04044 5.04044C6.8529 5.22798 6.59855 5.33333 6.33333 5.33333ZM4.33333 8C4.06812 8 3.81376 7.89464 3.62623 7.70711C3.43869 7.51957 3.33333 7.26522 3.33333 7C3.33333 6.73478 3.43869 6.48043 3.62623 6.29289C3.81376 6.10536 4.06812 6 4.33333 6C4.59855 6 4.8529 6.10536 5.04044 6.29289C5.22798 6.48043 5.33333 6.73478 5.33333 7C5.33333 7.26522 5.22798 7.51957 5.04044 7.70711C4.8529 7.89464 4.59855 8 4.33333 8ZM8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14C8.26522 14 8.51957 13.8946 8.70711 13.7071C8.89464 13.5196 9 13.2652 9 13C9 12.74 8.9 12.5067 8.74 12.3333C8.58667 12.1533 8.48667 11.92 8.48667 11.6667C8.48667 11.4015 8.59202 11.1471 8.77956 10.9596C8.9671 10.772 9.22145 10.6667 9.48667 10.6667H10.6667C11.5507 10.6667 12.3986 10.3155 13.0237 9.69036C13.6488 9.06523 14 8.21739 14 7.33333C14 4.38667 11.3133 2 8 2Z"/>
            </svg>
          </div>
          <div>Design</div>
        </div>
        <div id="cf-btn-test" class="cf-btn-lg cf-active">
          <div class="tools-cf-icon-lg">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.11221 8.39998H5.48581L6.79941 4.65198L8.11221 8.39998ZM8.53301 9.59998L8.79701 10.3552L9.73941 9.41358L7.44021 2.85518C7.22741 2.24798 6.36901 2.24798 6.15701 2.85518L3.23221 11.2024C3.17959 11.3526 3.1888 11.5176 3.25782 11.661C3.32683 11.8044 3.44999 11.9146 3.60021 11.9672C3.75043 12.0198 3.9154 12.0106 4.05883 11.9416C4.20225 11.8726 4.31239 11.7494 4.36501 11.5992L5.06421 9.59998H8.53301ZM12.645 7.63838L8.78181 11.5024C8.55671 11.7275 8.3969 12.0096 8.31941 12.3184L8.02021 13.5168C8.01116 13.5536 8.00475 13.591 8.00101 13.6288C7.70299 13.6414 7.40453 13.6178 7.11221 13.5584C7.05381 13.5448 7.03221 13.4704 7.05941 13.416C7.20341 13.1376 7.24581 12.5576 6.73621 12.352C6.04821 12.076 5.15381 12.452 4.44661 12.7504C4.15381 12.8736 3.89301 12.9824 3.69141 13.0272C3.38181 13.096 3.01301 12.9752 2.71861 12.828C2.54901 12.7432 2.33301 12.8936 2.43061 13.0568C2.60581 13.3496 2.92181 13.6464 3.49141 13.7168C4.14741 13.7984 4.60421 13.5952 5.07141 13.3888C5.39141 13.2464 5.71541 13.1024 6.11141 13.0464C6.18021 13.0368 6.22741 13.1184 6.20101 13.1824C6.07941 13.468 6.09461 13.8976 6.45381 14.1776C6.86821 14.5016 8.20661 14.5864 9.10421 14.324L10.081 14.08C10.3906 14.0024 10.673 13.8432 10.8978 13.6176L14.7618 9.75358C14.9025 9.61503 15.0143 9.45001 15.0909 9.26804C15.1675 9.08606 15.2073 8.89073 15.208 8.6933C15.2087 8.49587 15.1704 8.30024 15.0951 8.11771C15.0199 7.93517 14.9093 7.76933 14.7696 7.62975C14.63 7.49017 14.4641 7.37962 14.2816 7.30445C14.099 7.22928 13.9034 7.191 13.7059 7.1918C13.5085 7.1926 13.3132 7.23247 13.1312 7.30912C12.9493 7.38577 12.7843 7.49767 12.6458 7.63838"/>
            </svg>
          </div>
          <div>Test</div>
        </div>
      </div>

      <div class="tools-cf-small-controls-section-fixed">
        <div id="cf-make-zone" class="cf-zone">
          <input id="cf-name-input" class="cf-input" type="text" placeholder="Name your letter or creation …" maxlength="24">
        </div>
        <div id="cf-type-zone" class="cf-zone">
          <textarea id="cf-type-input" class="cf-input cf-input-mono" placeholder="Type your message or _Symbol-Name_" rows="1" autocomplete="off" spellcheck="false"></textarea>
        </div>
        <div id="cf-add-btn" class="cf-btn-add"><div>+ Add</div></div>
      </div>
    </div>

    <!-- Row 2: Color / Naming / Saved Symbols / Export -->
    <div class="tools-cf-wrapper-large-controls">

      <div class="tools-cf-large-controls-section">
        <div class="p3 txt-caps txt-grey">Color</div>
        <div class="tools-cf-large-controls-section-cta">
          <div id="cf-pal-btn" class="cf-btn-sm">
            <div class="tools-cf-icon-sm">
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_2187_2778)">
                  <path d="M10.75 4.50003C10.4212 3.49969 9.78498 2.62869 8.93204 2.0112C8.07911 1.39372 7.05299 1.06128 6 1.06128C4.94701 1.06128 3.9209 1.39372 3.06796 2.0112C2.21502 2.62869 1.5788 3.49969 1.25 4.50003M1 2.50003V4.50003H3M9 7.50003H11V9.50003M1.25 7.50003C1.5788 8.50037 2.21502 9.37138 3.06796 9.98886C3.9209 10.6063 4.94701 10.9388 6 10.9388C7.05299 10.9388 8.07911 10.6063 8.93204 9.98886C9.78498 9.37138 10.4212 8.50037 10.75 7.50003" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs><clipPath id="clip0_2187_2778"><rect width="12" height="12" fill="white"/></clipPath></defs>
              </svg>
            </div>
          </div>
          <div id="cf-pal-display" class="cf-pal-display"></div>
        </div>
      </div>

      <div class="tools-cf-vertical-devider"></div>

      <div class="tools-cf-large-controls-section">
        <div class="p3 txt-caps txt-grey">Naming</div>
        <div class="tools-cf-large-controls-section-cta">
          <div id="cf-tone-btn" class="cf-btn-sm">
            <div class="tools-cf-icon-sm">
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip1_2187_2778)">
                  <path d="M10.75 4.50003C10.4212 3.49969 9.78498 2.62869 8.93204 2.0112C8.07911 1.39372 7.05299 1.06128 6 1.06128C4.94701 1.06128 3.9209 1.39372 3.06796 2.0112C2.21502 2.62869 1.5788 3.49969 1.25 4.50003M1 2.50003V4.50003H3M9 7.50003H11V9.50003M1.25 7.50003C1.5788 8.50037 2.21502 9.37138 3.06796 9.98886C3.9209 10.6063 4.94701 10.9388 6 10.9388C7.05299 10.9388 8.07911 10.6063 8.93204 9.98886C9.78498 9.37138 10.4212 8.50037 10.75 7.50003" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs><clipPath id="clip1_2187_2778"><rect width="12" height="12" fill="white"/></clipPath></defs>
              </svg>
            </div>
          </div>
          <a id="cf-tone-label" href="#" class="cf-chip">Standard</a>
        </div>
      </div>

      <div class="tools-cf-vertical-devider"></div>

      <div class="tools-cf-large-controls-section tools-cf-wrapper-savedglyphs">
        <div class="p3 txt-caps txt-grey">Saved Symbols</div>
        <div id="cf-glyph-chips" class="tools-cf-large-controls-section-chips">
          <a href="#" class="cf-chip cf-chip-lg">H</a>
        </div>
      </div>

      <div class="tools-cf-vertical-devider"></div>

      <div class="tools-cf-large-controls-section">
        <div class="p3 txt-caps txt-grey">Export</div>
        <div class="tools-cf-large-controls-section-cta">
          <a id="cf-export-svg" href="#" class="cf-btn-sm">SVG</a>
          <a id="cf-export-png" href="#" class="cf-btn-sm">PNG</a>
          <div id="cf-cal-export-btn" class="cf-btn-sm cf-red">
            <div class="tools-cf-icon-md">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.99935 14H3.99935C3.64573 14 3.30659 13.8595 3.05654 13.6095C2.80649 13.3594 2.66602 13.0203 2.66602 12.6667V4.66667C2.66602 4.31304 2.80649 3.97391 3.05654 3.72386C3.30659 3.47381 3.64573 3.33333 3.99935 3.33333H11.9993C12.353 3.33333 12.6921 3.47381 12.9422 3.72386C13.1922 3.97391 13.3327 4.31304 13.3327 4.66667V8.66667M10.666 2V4.66667M5.33268 2V4.66667M2.66602 7.33333H13.3327M10.666 14.6667L13.9993 11.3333M13.9993 11.3333V14.3333M13.9993 11.3333H10.9993" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div><!-- /tools-cf-wrapper-controls -->

</div><!-- /cf-canvas -->
<div class="cf-modal" id="cf-export-modal">
  <div class="cf-modal-box" style="width:320px;">
    <div class="cf-modal-title" id="cf-export-modal-title">Export</div>
    <button class="cf-modal-close cf-close-export">
      <img src="https://cdn.prod.website-files.com/613d225736aa8c9edc6c0a24/69add1803de8f4df322497ab_x.svg" alt="icon">
    </button>
    <p class="p3">Choose what to include:</p>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
      <label class="cf-check-row"><input type="checkbox" id="cf-exp-plain" checked><span>Plain</span><span class="cf-check-hint">Solid filled blocks</span></label>
      <label class="cf-check-row"><input type="checkbox" id="cf-exp-strokes" checked><span>Strokes</span><span class="cf-check-hint">White separator between blocks</span></label>
      <label class="cf-check-row"><input type="checkbox" id="cf-exp-type" checked><span>Type</span><span class="cf-check-hint">Calendar text inside blocks</span></label>
    </div>
    <div class="cf-modal-btns">
      <button class="tools-modal-btn tools-modal-btn-ghost cf-close-export">Cancel</button>
      <button class="tools-modal-btn" id="cf-export-confirm">Download</button>
    </div>
  </div>
</div>

<!-- Calendar export modal -->
<div class="cf-modal" id="cf-cal-modal">
  <div class="cf-modal-box" style="width:340px;">
    <div class="tools-panel-header">
      <div class="cf-modal-title">Export to Calendar</div>
      <button class="cf-modal-close cf-close-cal">
        <img src="https://cdn.prod.website-files.com/613d225736aa8c9edc6c0a24/69add1803de8f4df322497ab_x.svg" alt="icon">
      </button>
    </div>
    <div class="tools-panel-section">
      <p class="p3">Pick a start date. Each column becomes a day starting from the date you choose.</p>
      <input type="date" id="cf-cal-date" style="width:100%;background:#272727;color:#e0e0e0;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px 12px;font-family:'DM Mono',monospace;font-size:13px;outline:none;color-scheme:dark;margin-bottom:16px;">
    </div>
    <div class="cf-modal-btns">
      <button class="tools-modal-btn tools-modal-btn-ghost cf-close-cal">Cancel</button>
      <button class="tools-modal-btn" id="cf-cal-confirm">Download .ics</button>
    </div>
  </div>
</div>

<!-- Overwrite confirmation -->
<div class="cf-modal" id="cf-overwrite-modal">
  <div class="cf-modal-box" style="width:480px;">
    <div class="cf-modal-title">Overwrite Glyph?</div>
    <button class="cf-modal-close cf-cancel-overwrite">
      <img src="https://cdn.prod.website-files.com/613d225736aa8c9edc6c0a24/69add1803de8f4df322497ab_x.svg" alt="icon">
    </button>
    <p class="p3">You are about to replace an existing saved glyph. Compare the versions below.</p>
    <div style="display:flex;gap:12px;margin-bottom:16px;">
      <div style="flex:1;text-align:center;">
        <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.12em;color:#888;text-transform:uppercase;margin-bottom:6px;">Current</div>
        <canvas id="cf-preview-old" width="180" height="180" style="width:100%;border-radius:8px;background:#2a2a2a;display:block;"></canvas>
      </div>
      <div style="flex:1;text-align:center;">
        <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.12em;color:#888;text-transform:uppercase;margin-bottom:6px;">New</div>
        <canvas id="cf-preview-new" width="180" height="180" style="width:100%;border-radius:8px;background:#2a2a2a;display:block;"></canvas>
      </div>
    </div>
    <div class="cf-modal-btns">
      <button class="tools-modal-btn tools-modal-btn-ghost cf-cancel-overwrite">Keep current glyph</button>
      <button class="tools-modal-btn cf-danger" id="cf-overwrite-confirm">Update Glyph</button>
    </div>
  </div>
</div>

<!-- Save / Load session -->
<div class="cf-modal" id="cf-saveload-modal">
  <div class="cf-modal-box">
    <div class="tools-panel-header">
      <div class="cf-modal-title">Session</div>
      <button class="cf-modal-close cf-close-saveload">
        <img src="https://cdn.prod.website-files.com/613d225736aa8c9edc6c0a24/69add1803de8f4df322497ab_x.svg" alt="icon">
      </button>
    </div>
    <div class="tools-panel-devider"></div>
    <div class="tools-modal-tab-row">
      <button class="tools-modal-btn tools-modal-tab" id="cf-tab-save">Save</button>
      <button class="tools-modal-btn tools-modal-tab" id="cf-tab-load">Load</button>
    </div>
    <div class="tools-panel-devider"></div>
    <div id="cf-panel-save">
      <div class="tools-panel-section">
        <p class="p3">Copy this JSON to save your session:</p>
      </div>
      <textarea class="tools-modal-textarea" id="cf-export-textarea" readonly onclick="this.select()"></textarea>
      <div class="cf-modal-btns" style="margin-top:12px;">
        <button class="tools-modal-btn" id="cf-copy-export">Copy JSON</button>
      </div>
    </div>
    <div id="cf-panel-load" style="display:none;">
      <div class="tools-panel-section">
        <p class="p3">Paste a saved session JSON to restore it:</p>
      </div>
      <textarea class="tools-modal-textarea cf-blue" id="cf-import-textarea" placeholder="Paste JSON here…"></textarea>
      <div class="cf-modal-btns" style="margin-top:12px;">
        <button class="tools-modal-btn" id="cf-load-session">Load Session</button>
      </div>
    </div>
  </div>
</div>

<!-- About -->
<div class="cf-modal" id="cf-about-modal">
  <div class="cf-modal-box">
    <div class="tools-panel-header">
      <div class="cf-modal-title">About</div>
      <button class="cf-modal-close" onclick="this.closest('.cf-modal').classList.remove('cf-modal-open')">
        <img src="https://cdn.prod.website-files.com/613d225736aa8c9edc6c0a24/69add1803de8f4df322497ab_x.svg" alt="icon">
      </button>
    </div>
    <div class="tools-panel-section">
      <p class="p3">In the modern office, we live by the grid. We are makers, dreamers, and thinkers, yet our days are diced into 30-minute increments of "Alignment Syncs" and "Status Updates." This tool was born in that moment of silent cry for help — a realization that the boxes meant to contain us could be the very tools we use to break free.</p>
      <p class="p3">This is a literal interpretation of "thinking outside the box" by staying within them. The message is a glitch in the system: stop taking the grind so seriously.</p>
    </div>
  </div>
</div>

<!-- Controls -->
<div class="cf-modal" id="cf-controls-modal">
  <div class="cf-modal-box">
    <div class="tools-panel-header">
      <div class="cf-modal-title">Controls</div>
      <button class="cf-modal-close" onclick="this.closest('.cf-modal').classList.remove('cf-modal-open')">
        <img src="https://cdn.prod.website-files.com/613d225736aa8c9edc6c0a24/69add1803de8f4df322497ab_x.svg" alt="icon">
      </button>
    </div>
    <div class="tools-panel-devider"></div>
    <div class="tools-panel-section">
      <div class="tools-panel-section-controls">
        <span>Draw block</span><span class="tools-info-controls">Drag on canvas</span>
      </div>
      <div class="tools-panel-section-controls">
        <span>Resize block</span><span class="tools-info-controls">Drag bottom nub</span>
      </div>
      <div class="tools-panel-section-controls">
        <span>Zoom</span><span class="tools-info-controls">Scroll wheel</span>
      </div>
      <div class="tools-panel-section-controls">
        <span>Clear canvas</span><span class="tools-info-controls">Esc</span>
      </div>
      <div class="tools-panel-section-controls">
        <span>Delete glyph</span><span class="tools-info-controls">Right-click chip</span>
      </div>
      <div class="tools-panel-section-controls">
        <span>Use a named glyph in Test mode</span><span class="tools-info-controls">_name_</span>
      </div>
      <div class="p3">e.g. type <code style="font-family:'Denim Trial';background:rgba(255,255,255,0.2);padding:1px 5px;border-radius:3px;">_SMILE_</code> to render a glyph saved as "SMILE"</div>
    </div>
  </div>
</div>
<div id="cf-3d-overlay" style="display:none; position:fixed; inset:0; z-index:50; overflow:hidden;"></div>
`;
  ROOT.innerHTML = CF_HTML;

  /* ============================ presets ============================ */
(function(){
//
// calfont-presets.js
//
// Starter glyphs loaded when CalFont opens for the first time.
// Edit this file freely — it never affects calfont-engine.js.
//
// FORMAT: human-readable HH:MM — same as the session JSON export.
// Each entry: { col, from, to, title, outlined }
// col   : column index (1 = leftmost column of the glyph)
// from  : start time "HH:MM"
// to    : end time   "HH:MM"
// title : calendar meeting label shown inside the block
// outlined: true = outlined style, false = filled style
//
// To add a new glyph, copy an existing entry and edit.
// Upload this file to GitHub alongside calfont-engine.js.
// No engine changes needed.
//


window.CF = window.CF || {};

window.CF.presets = {
    "H": [
      {
        "col": 1,
        "from": "09:00",
        "to": "17:00",
        "title": "Brand Alignment",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:15",
        "to": "09:45",
        "title": "Alignment with Steve",
        "outlined": false
      },
      {
        "col": 1,
        "from": "11:45",
        "to": "13:15",
        "title": "Standup",
        "outlined": false
      },
      {
        "col": 2,
        "from": "11:15",
        "to": "13:00",
        "title": "Design Review",
        "outlined": false
      },
      {
        "col": 2,
        "from": "11:30",
        "to": "17:00",
        "title": "Onboarding",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:00",
        "to": "17:00",
        "title": "Feasibility Workshop",
        "outlined": false
      }
    ],
    "E": [
      {
        "col": 1,
        "from": "09:00",
        "to": "17:00",
        "title": "1:1 with Manager",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:15",
        "to": "17:00",
        "title": "Design Review",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "10:45",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:45",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 1,
        "from": "12:15",
        "to": "13:30",
        "title": "1:1 with Manager",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:15",
        "to": "13:30",
        "title": "Standup",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:15",
        "to": "17:00",
        "title": "Sprint Workshop",
        "outlined": false
      }
    ],
    "L": [
      {
        "col": 1,
        "from": "09:00",
        "to": "15:15",
        "title": "Standup",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:30",
        "to": "17:00",
        "title": "Brand Alignment",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:00",
        "to": "17:00",
        "title": "Feasibility Workshop",
        "outlined": false
      }
    ],
    "!": [
      {
        "col": 1,
        "from": "09:00",
        "to": "14:30",
        "title": "Stakeholder Update",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:15",
        "to": "17:00",
        "title": "1:1 with Manager",
        "outlined": false
      }
    ],
    "P": [
      {
        "col": 1,
        "from": "09:00",
        "to": "17:00",
        "title": "Retro",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:15",
        "title": "Roadmap Sync",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:15",
        "to": "13:30",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:15",
        "to": "13:45",
        "title": "Strategy Meeting",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:45",
        "to": "13:00",
        "title": "Design Review",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "10:15",
        "title": "Team Introduction",
        "outlined": false
      },
      {
        "col": 1,
        "from": "12:15",
        "to": "13:45",
        "title": "Budget Review",
        "outlined": false
      }
    ],
    "A": [
      {
        "col": 1,
        "from": "09:00",
        "to": "17:00",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "10:30",
        "title": "OKR Review",
        "outlined": false
      },
      {
        "col": 1,
        "from": "12:45",
        "to": "14:00",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:30",
        "title": "Client Call",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:15",
        "to": "17:00",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:45",
        "to": "17:00",
        "title": "Quarterly Review",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:45",
        "to": "14:00",
        "title": "Standup",
        "outlined": false
      }
    ],
    "F": [
      {
        "col": 1,
        "from": "09:00",
        "to": "17:00",
        "title": "1:1 with Manager",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "10:45",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:45",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:15",
        "to": "13:45",
        "title": "Strategy Meeting",
        "outlined": false
      },
      {
        "col": 1,
        "from": "12:15",
        "to": "13:45",
        "title": "Retro",
        "outlined": false
      }
    ],
    "I": [
      {
        "col": 1,
        "from": "11:45",
        "to": "17:00",
        "title": "Feasibility Workshop",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "11:00",
        "title": "Roadmap Sync",
        "outlined": false
      }
    ],
    "R": [
      {
        "col": 1,
        "from": "09:00",
        "to": "17:00",
        "title": "1:1 with Manager",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "10:30",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:30",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:15",
        "to": "12:45",
        "title": "Strategy Meeting",
        "outlined": false
      },
      {
        "col": 1,
        "from": "12:15",
        "to": "13:30",
        "title": "Retro",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:15",
        "to": "12:30",
        "title": "Alignment with Steve",
        "outlined": false
      },
      {
        "col": 2,
        "from": "13:00",
        "to": "14:00",
        "title": "Feasibility Workshop",
        "outlined": false
      },
      {
        "col": 2,
        "from": "13:15",
        "to": "17:00",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 2,
        "from": "13:45",
        "to": "17:00",
        "title": "Sprint Workshop",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:45",
        "to": "12:15",
        "title": "Budget Review",
        "outlined": false
      }
    ],
    "T": [
      {
        "col": 1,
        "from": "09:00",
        "to": "10:45",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "17:00",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "10:45",
        "title": "Client Call",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "17:00",
        "title": "Team Introduction",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:45",
        "title": "Client Call",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:45",
        "title": "Check-In with Client",
        "outlined": false
      }
    ],
    "S": [
      {
        "col": 1,
        "from": "09:00",
        "to": "12:45",
        "title": "Stakeholder Update",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:30",
        "title": "All Hands",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "10:30",
        "title": "Onboarding",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:00",
        "to": "13:30",
        "title": "Standup",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:15",
        "to": "17:00",
        "title": "1:1 with Manager",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:15",
        "to": "17:00",
        "title": "Brand Alignment",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:15",
        "to": "17:00",
        "title": "Tech Deep Dive",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:45",
        "to": "16:30",
        "title": "Tech Deep Dive",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "11:00",
        "title": "Client Call",
        "outlined": false
      },
      {
        "col": 1,
        "from": "11:45",
        "to": "13:15",
        "title": "Product Sync",
        "outlined": false
      }
    ],
    "M": [
      {
        "col": 1,
        "from": "09:00",
        "to": "17:00",
        "title": "Onboarding",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:30",
        "title": "Design Review",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:15",
        "to": "17:00",
        "title": "Check-In with Client",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:45",
        "to": "17:00",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 3,
        "from": "09:00",
        "to": "10:30",
        "title": "Quarterly Review",
        "outlined": false
      },
      {
        "col": 3,
        "from": "09:15",
        "to": "17:00",
        "title": "Stakeholder Update",
        "outlined": false
      },
      {
        "col": 3,
        "from": "09:45",
        "to": "17:00",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:30",
        "to": "10:45",
        "title": "Strategy Meeting",
        "outlined": false
      }
    ],
    "O": [
      {
        "col": 1,
        "from": "09:00",
        "to": "16:00",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "10:45",
        "title": "Stakeholder Update",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:15",
        "to": "16:45",
        "title": "Product Sync",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:30",
        "title": "Team Introduction",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:30",
        "to": "17:00",
        "title": "Onboarding",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:15",
        "to": "16:30",
        "title": "Feasibility Workshop",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:30",
        "to": "16:00",
        "title": "Brand Alignment",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "10:30",
        "title": "All Hands",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:30",
        "to": "17:00",
        "title": "All Hands",
        "outlined": false
      }
    ],
    "C": [
      {
        "col": 1,
        "from": "09:00",
        "to": "16:00",
        "title": "1:1 with Manager",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:15",
        "to": "17:00",
        "title": "Design Review",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "10:45",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:30",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:15",
        "to": "17:00",
        "title": "Sprint Workshop",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:15",
        "to": "11:30",
        "title": "OKR Review",
        "outlined": false
      }
    ],
    "B": [
      {
        "col": 1,
        "from": "09:00",
        "to": "17:00",
        "title": "1:1 with Manager",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "10:30",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:30",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:00",
        "to": "13:15",
        "title": "Strategy Meeting",
        "outlined": false
      },
      {
        "col": 1,
        "from": "12:00",
        "to": "13:15",
        "title": "Retro",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:15",
        "to": "12:00",
        "title": "Alignment with Steve",
        "outlined": false
      },
      {
        "col": 2,
        "from": "13:00",
        "to": "16:30",
        "title": "Sprint Workshop",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:45",
        "to": "11:30",
        "title": "Budget Review",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:30",
        "to": "17:00",
        "title": "Roadmap Sync",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:30",
        "to": "17:00",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:30",
        "to": "16:45",
        "title": "Planning Session",
        "outlined": false
      }
    ],
    "D": [
      {
        "col": 1,
        "from": "09:00",
        "to": "15:15",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "10:45",
        "title": "Stakeholder Update",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:15",
        "to": "17:00",
        "title": "Product Sync",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:45",
        "title": "Team Introduction",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:15",
        "to": "17:00",
        "title": "Onboarding",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:15",
        "to": "16:30",
        "title": "Feasibility Workshop",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:45",
        "to": "15:45",
        "title": "Brand Alignment",
        "outlined": false
      }
    ],
    "?": [
      {
        "col": 1,
        "from": "09:00",
        "to": "11:00",
        "title": "Retro",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:15",
        "title": "Onboarding",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:15",
        "to": "13:30",
        "title": "Standup",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:45",
        "to": "12:45",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:30",
        "to": "13:45",
        "title": "Design Review",
        "outlined": false
      },
      {
        "col": 1,
        "from": "12:15",
        "to": "14:15",
        "title": "All Hands",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:00",
        "to": "17:00",
        "title": "Alignment with Steve",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "10:30",
        "title": "Retro",
        "outlined": false
      },
      {
        "col": 1,
        "from": "12:15",
        "to": "13:30",
        "title": "Design Review",
        "outlined": false
      },
      {
        "col": 1,
        "from": "12:30",
        "to": "13:30",
        "title": "Tech Deep Dive",
        "outlined": false
      }
    ],
    "Z": [
      {
        "col": 1,
        "from": "09:00",
        "to": "10:30",
        "title": "Client Call",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:30",
        "title": "1:1 with Manager",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "13:00",
        "title": "OKR Review",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:00",
        "to": "13:30",
        "title": "Brand Alignment",
        "outlined": false
      },
      {
        "col": 1,
        "from": "12:30",
        "to": "15:15",
        "title": "Tech Deep Dive",
        "outlined": false
      },
      {
        "col": 1,
        "from": "12:30",
        "to": "14:00",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:15",
        "to": "17:00",
        "title": "OKR Review",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:15",
        "to": "17:00",
        "title": "OKR Review",
        "outlined": false
      }
    ],
    "J": [
      {
        "col": 1,
        "from": "09:00",
        "to": "10:30",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:30",
        "title": "Stakeholder Update",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "15:15",
        "title": "Roadmap Sync",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:15",
        "to": "17:00",
        "title": "Sprint Workshop",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:15",
        "to": "17:00",
        "title": "Product Sync",
        "outlined": false
      },
      {
        "col": 1,
        "from": "14:45",
        "to": "16:45",
        "title": "Check-In with Client",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:15",
        "to": "17:00",
        "title": "Roadmap Sync",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:15",
        "to": "16:15",
        "title": "Retro",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "15:15",
        "title": "Product Sync",
        "outlined": false
      }
    ],
    "G": [
      {
        "col": 2,
        "from": "15:30",
        "to": "17:00",
        "title": "Stakeholder Update",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:15",
        "to": "13:30",
        "title": "Alignment with Steve",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:15",
        "to": "17:00",
        "title": "Retro",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "16:00",
        "title": "Feasibility Workshop",
        "outlined": false
      },
      {
        "col": 1,
        "from": "14:45",
        "to": "17:00",
        "title": "Feasibility Workshop",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:15",
        "to": "17:00",
        "title": "All Hands",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:30",
        "title": "Retro",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "11:00",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "11:00",
        "title": "Feasibility Workshop",
        "outlined": false
      }
    ],
    "U": [
      {
        "col": 1,
        "from": "09:00",
        "to": "16:00",
        "title": "Alignment with Steve",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "09:15",
        "title": "All Hands",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:00",
        "to": "17:00",
        "title": "Alignment with Steve",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "17:00",
        "title": "Client Call",
        "outlined": false
      },
      {
        "col": 1,
        "from": "14:45",
        "to": "16:45",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:00",
        "to": "17:00",
        "title": "Planning Session",
        "outlined": false
      }
    ],
    "V": [
      {
        "col": 1,
        "from": "09:00",
        "to": "15:30",
        "title": "Alignment with Steve",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "09:15",
        "title": "All Hands",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:00",
        "to": "17:00",
        "title": "Alignment with Steve",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "17:00",
        "title": "Client Call",
        "outlined": false
      },
      {
        "col": 1,
        "from": "14:15",
        "to": "16:00",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 1,
        "from": "14:45",
        "to": "16:30",
        "title": "1:1 with Manager",
        "outlined": false
      }
    ],
    "K": [
      {
        "col": 1,
        "from": "09:00",
        "to": "17:00",
        "title": "1:1 with Manager",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "09:15",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 2,
        "from": "11:30",
        "to": "12:15",
        "title": "Strategy Meeting",
        "outlined": false
      },
      {
        "col": 1,
        "from": "12:15",
        "to": "13:30",
        "title": "Retro",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "11:45",
        "title": "Alignment with Steve",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:30",
        "to": "13:45",
        "title": "Feasibility Workshop",
        "outlined": false
      },
      {
        "col": 2,
        "from": "13:00",
        "to": "17:00",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 2,
        "from": "13:30",
        "to": "17:00",
        "title": "Sprint Workshop",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "11:45",
        "title": "Budget Review",
        "outlined": false
      }
    ],
    "Y": [
      {
        "col": 1,
        "from": "09:00",
        "to": "12:30",
        "title": "Product Sync",
        "outlined": false
      },
      {
        "col": 1,
        "from": "11:45",
        "to": "13:15",
        "title": "Strategy Meeting",
        "outlined": false
      },
      {
        "col": 1,
        "from": "12:15",
        "to": "13:45",
        "title": "Design Review",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:30",
        "to": "17:00",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "09:15",
        "title": "Quarterly Review",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:30",
        "to": "17:00",
        "title": "All Hands",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:30",
        "to": "16:30",
        "title": "Quarterly Review",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "09:15",
        "title": "Quarterly Review",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "15:30",
        "title": "Onboarding",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:15",
        "to": "13:45",
        "title": "Budget Review",
        "outlined": false
      }
    ],
    "N": [
      {
        "col": 1,
        "from": "09:00",
        "to": "17:00",
        "title": "Onboarding",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:30",
        "title": "Design Review",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:15",
        "to": "17:00",
        "title": "Check-In with Client",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:45",
        "to": "17:00",
        "title": "Kick-off",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:30",
        "to": "10:45",
        "title": "Strategy Meeting",
        "outlined": false
      }
    ],
    "Q": [
      {
        "col": 1,
        "from": "09:00",
        "to": "15:15",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "10:45",
        "title": "Team Introduction",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:15",
        "to": "17:00",
        "title": "Onboarding",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:15",
        "to": "15:15",
        "title": "Feasibility Workshop",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:30",
        "to": "14:00",
        "title": "Brand Alignment",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "10:45",
        "title": "All Hands",
        "outlined": false
      },
      {
        "col": 1,
        "from": "14:30",
        "to": "16:30",
        "title": "All Hands",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:45",
        "to": "17:30",
        "title": "Check-In with Client",
        "outlined": false
      },
      {
        "col": 1,
        "from": "14:45",
        "to": "17:00",
        "title": "1:1 with Manager",
        "outlined": false
      }
    ],
    "W": [
      {
        "col": 1,
        "from": "09:00",
        "to": "15:15",
        "title": "Quarterly Review",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:15",
        "to": "17:00",
        "title": "Feasibility Workshop",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:15",
        "to": "17:00",
        "title": "Brand Alignment",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "09:15",
        "title": "All Hands",
        "outlined": false
      },
      {
        "col": 3,
        "from": "09:00",
        "to": "09:15",
        "title": "1:1 with Manager",
        "outlined": false
      },
      {
        "col": 3,
        "from": "15:15",
        "to": "17:00",
        "title": "Client Call",
        "outlined": false
      },
      {
        "col": 3,
        "from": "15:15",
        "to": "16:15",
        "title": "Strategy Meeting",
        "outlined": false
      },
      {
        "col": 2,
        "from": "15:15",
        "to": "16:15",
        "title": "Standup",
        "outlined": false
      },
      {
        "col": 1,
        "from": "15:15",
        "to": "16:00",
        "title": "Budget Review",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "15:30",
        "title": "Stakeholder Update",
        "outlined": false
      },
      {
        "col": 3,
        "from": "09:00",
        "to": "15:30",
        "title": "Design Review",
        "outlined": false
      }
    ],
    "X": [
      {
        "col": 1,
        "from": "09:00",
        "to": "11:45",
        "title": "1:1 with Manager",
        "outlined": false
      },
      {
        "col": 1,
        "from": "09:00",
        "to": "09:15",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 1,
        "from": "11:45",
        "to": "12:30",
        "title": "Retro",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:45",
        "to": "14:00",
        "title": "Feasibility Workshop",
        "outlined": false
      },
      {
        "col": 2,
        "from": "13:15",
        "to": "17:00",
        "title": "Planning Session",
        "outlined": false
      },
      {
        "col": 2,
        "from": "13:45",
        "to": "17:00",
        "title": "Sprint Workshop",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "09:15",
        "title": "Budget Review",
        "outlined": false
      },
      {
        "col": 1,
        "from": "13:30",
        "to": "17:00",
        "title": "Design Review",
        "outlined": false
      },
      {
        "col": 1,
        "from": "12:00",
        "to": "14:00",
        "title": "Product Sync",
        "outlined": false
      },
      {
        "col": 2,
        "from": "09:00",
        "to": "12:30",
        "title": "Sprint Workshop",
        "outlined": false
      },
      {
        "col": 2,
        "from": "12:15",
        "to": "12:45",
        "title": "Alignment with Steve",
        "outlined": false
      }
    ]
  };
})();

  /* ============================ tones ============================ */
(function(){
// ─────────────────────────────────────────────────────────────────────────────
//  CALFONT — TONE LIBRARY
//  Loaded before calfont-engine.js. Engine reads window.CF.tones on init.
//
//  TO ADD A TONE:
//    Add a new key to the object below. The key is used internally.
//    label  → what appears in the UI when cycling tones
//    titles → pool of meeting names randomly drawn for each block
//
//  TO EDIT A TONE:
//    Just edit the titles array. Changes take effect on next page load.
//
//  TO REMOVE A TONE:
//    Delete its key entirely. The engine handles any number of tones.
//
//  ORDER:
//    Tones cycle in the order they appear here.
// ─────────────────────────────────────────────────────────────────────────────

window.CF = window.CF || {};

window.CF.tones = {

  STANDARD: {
    label: 'STANDARD',
    titles: [
      'Check-In with Client',
      'Kick-off',
      'Alignment with Steve',
      'Sprint Workshop',
      'Team Introduction',
      'Standup',
      'Quarterly Review',
      '1:1 with Manager',
      'Product Sync',
      'Stakeholder Update',
      'Design Review',
      'All Hands',
      'Retro',
      'Planning Session',
      'Client Call',
      'Strategy Meeting',
      'OKR Review',
      'Onboarding',
      'Tech Deep Dive',
      'Brand Alignment',
      'Budget Review',
      'Roadmap Sync',
      'Feasibility Workshop',
    ]
  },

  HOPEFUL: {
    label: 'HOPEFUL',
    titles: [
      'Me Time',
      'Taking a Break',
      'Going for a Walk',
      'Coffee Date',
      'Gym',
      'Working from Home',
      'Read a Book',
      'Lunch with a Friend',
      'No Meetings Please',
      'Focus Block',
      'Digital Detox',
      'Creative Time',
      'Mindful Moment',
      'Fresh Air',
      'Power Nap',
      'Garden Break',
      'Journaling',
      'Cook Something Nice',
      'Call Mum',
      'Do Nothing',
      'Stretch Break',
      'Bike Ride',
      'Long Lunch',
    ]
  },

  PARODY: {
    label: 'PARODY',
    titles: [
      'Go Cry',
      'Ignoring Slack Messages',
      'Not Available',
      'Browse LinkedIn for New Job',
      'Important Smoke Break',
      'Pretend to Work',
      'Stare at Wall',
      'Avoid Everyone',
      'Fake Commute',
      'Reply Later (Never)',
      'Doomscrolling',
      'Apply to 10 Jobs',
      'Question Life Choices',
      'Rethink Career',
      'Be Perceived',
      'Touch Grass',
      'Existential Lunch',
      'Hide in Bathroom',
      'Update CV Again',
      'Cry but Make it Scrum',
      'Silent Resignation',
      'Ctrl+Z My Career',
      'Out of Office (Forever)',
    ]
  },

  // ── ADD NEW TONES BELOW ───────────────────────────────────────────────────
  //
  // Example:
  //
  // CORPORATE: {
  //   label: 'CORPORATE',
  //   titles: [
  //     'Synergy Session',
  //     'Move the Needle',
  //     'Low-Hanging Fruit Review',
  //     'Boil the Ocean Workshop',
  //     'Circle Back',
  //     'Take This Offline',
  //     'Bandwidth Check',
  //   ]
  // },

};
})();

  /* ============================ engine ============================ */
(function(){
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

  toneLabels: [],  // populated from calfont-tones.js
  toneTitles: {},   // populated from calfont-tones.js


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
  calExportBtn:     '#cf-cal-export-btn', // click → open calendar export modal
  calModal:         '#cf-cal-modal',       // calendar export modal wrapper
  calDateInput:     '#cf-cal-date',         // date picker input
  calConfirmBtn:    '#cf-cal-confirm',      // click → download .ics
  calCloseBtns:     '.cf-close-cal',        // click → close calendar modal

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
    [4,3,2,5],[5,0,7,4],[6,1,7,5],[6,3,2,5] // colorful sets
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
  function randTitle() {
    const key = C.toneLabels[toneMode];
    const list = C.toneTitles[key] || [];
    return list.length ? list[Math.floor(Math.random() * list.length)] : '';
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
  function loadTones() {
    // CF.tones is set by calfont-tones.js (loaded before engine).
    // Falls back to built-in defaults if file not present.
    const DEFAULT_TONES = {
      STANDARD: {
        label: 'STANDARD',
        titles: ['Check-In with Client','Kick-off','Alignment with Steve','Sprint Workshop',
          'Team Introduction','Standup','Quarterly Review','1:1 with Manager','Product Sync',
          'Stakeholder Update','Design Review','All Hands','Retro','Planning Session','Client Call',
          'Strategy Meeting','OKR Review','Onboarding','Tech Deep Dive','Brand Alignment',
          'Budget Review','Roadmap Sync','Feasibility Workshop']
      },
      HOPEFUL: {
        label: 'HOPEFUL',
        titles: ['Me Time','Taking a Break','Going for a Walk','Coffee Date','Gym',
          'Working from Home','Read a Book','Lunch with a Friend','No Meetings Please',
          'Focus Block','Digital Detox','Creative Time','Mindful Moment','Fresh Air','Power Nap',
          'Garden Break','Journaling','Cook Something Nice','Call Mum','Do Nothing','Stretch Break',
          'Bike Ride','Long Lunch']
      },
      PARODY: {
        label: 'PARODY',
        titles: ['Go Cry','Ignoring Slack Messages','Not Available','Browse LinkedIn for New Job',
          'Important Smoke Break','Pretend to Work','Stare at Wall','Avoid Everyone','Fake Commute',
          'Reply Later (Never)','Doomscrolling','Apply to 10 Jobs','Question Life Choices',
          'Rethink Career','Be Perceived','Touch Grass','Existential Lunch','Hide in Bathroom',
          'Update CV Again','Cry but Make it Scrum','Silent Resignation','Ctrl+Z My Career',
          'Out of Office (Forever)']
      }
    };
    const source = (window.CF && window.CF.tones) ? window.CF.tones : DEFAULT_TONES;
    const keys = Object.keys(source);
    C.toneLabels = keys.map(k => source[k].label || k);
    C.toneTitles = {};
    keys.forEach(k => { C.toneTitles[k] = source[k].titles; });
  }

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
    // Notify 3D renderer of mode change
    try { if (window.CF3D && CF3D.onModeChange) CF3D.onModeChange(!isTypeMode); } catch(_) {}
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
  function saveTitleMap() {
    const m = {};
    blocks.forEach(b => { if (b.title) m[`${b.d},${b.s},${b.e}`] = b.title; });
    return m;
  }
  function restoreTitleMap(m) {
    blocks.forEach(b => { const t = m[`${b.d},${b.s},${b.e}`]; if (t) b.title = t; });
  }

  function advancePalette() {
    paletteStep = (paletteStep + 1) % PALETTE_TOTAL;
    updatePaletteUI();
    blocks.forEach((b, i) => applyStyle(b, i, true));
    if (isTypeMode) {
      const saved = saveTitleMap();
      renderTypedText();
      restoreTitleMap(saved);
    }
  }

  function rotateTone() {
    toneMode = (toneMode + 1) % C.toneLabels.length;
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
    // STRIDE = GLYPH_SPAN * (1 + lineGapRatio) = 8 * 1.5 = 12hrs.
    // This gives a content gap of GLYPH_SPAN * lineGapRatio = 4hrs
    // between 17:00 of one line and 09:00 of the next.
    const STRIDE = GLYPH_SPAN * (1 + C.lineGapRatio);
    const lineWidths = lines.map(l => lineColWidth(l));
    const maxCols = Math.max(...lineWidths, 1);
    lines.forEach((line, li) => {
      const lineShift = li * STRIDE;
      const offset = Math.ceil((maxCols - lineWidths[li]) / 2);
      let col = offset;
      for (const token of tokeniseLine(line)) {
        const glyph = token.glyph;
        if (token.type === 'space') {
          col += 1;
        } else if (glyph) {
          glyph.forEach(g => {
            const b = {
              d: col + g.relD,
              s: g.relS + lineShift,   e: g.relE + lineShift,
              _renderS: g.relS + lineShift, _renderE: g.relE + lineShift,
              _origS: g.relS, _origE: g.relE,
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
  function showCalExport() {
    if (!blocks.length && !currentTypedText) { toast('Nothing on canvas to export'); return; }
    openModal(H.calModal);
    // Default to next Monday
    const d = new Date();
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
    const iso = d.toISOString().slice(0,10);
    const inp = q(H.calDateInput);
    if (inp && !inp.value) inp.value = iso;
  }

  function downloadICS() {
    const inp = q(H.calDateInput);
    if (!inp || !inp.value) { toast('Please pick a start date'); return; }
    const [yr, mo, dy] = inp.value.split('-').map(Number);

    // Collect all visible blocks (make mode: blocks array; test mode: same)
    const allBlocks = [...blocks];
    if (!allBlocks.length) { toast('No blocks to export'); return; }

    function pad2(n) { return String(n).padStart(2,'0'); }
    function icsDate(col, hourFloat) {
      // col = day offset (0-based), hourFloat = e.g. 9.5 = 09:30
      const base = new Date(yr, mo-1, dy + col);
      const hh = Math.floor(hourFloat);
      const mm = Math.round((hourFloat - hh) * 60);
      return `${base.getFullYear()}${pad2(base.getMonth()+1)}${pad2(base.getDate())}T${pad2(hh)}${pad2(mm)}00`;
    }
    function escICS(s) { return (s||'').replace(/[\\,;]/g, c => '\\'+c).replace(/\n/g,'\\n'); }

    const uid_base = Date.now();
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CalFont//CalFont Export//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    allBlocks.forEach((b, i) => {
      const col  = b.d || 0;
      const s    = b._origS != null ? b._origS : b.s;
      const e    = b._origE != null ? b._origE : b.e;
      const title = escICS(b.title || 'CalFont Event');
      lines.push(
        'BEGIN:VEVENT',
        `UID:calfont-${uid_base}-${i}@calfont`,
        `DTSTART:${icsDate(col, s)}`,
        `DTEND:${icsDate(col, e)}`,
        `SUMMARY:${title}`,
        'END:VEVENT'
      );
    });

    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'calfont-events.ics';
    a.click();
    URL.revokeObjectURL(a.href);
    closeModal(H.calModal);
    toast('Calendar file downloaded');
  }

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

    // In 3D view: SVG not available; PNG becomes a JPEG screenshot of the 3D scene.
    if (window.CF3D && window.CF3D.isOpen()) {
      if (fmt === 'svg') { toast('SVG export is not available in 3D view'); return; }
      // PNG button → 3D JPEG (bypass the options modal — no stroke/type toggles apply)
      const canvas = window.CF3D.renderExport3D();
      if (!canvas) { toast('Nothing to export'); return; }
      const dataURL = canvas.toDataURL('image/jpeg', 0.93);
      const a = document.createElement('a'); a.href = dataURL; a.download = 'calfont.jpg';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      toast('calfont.jpg @2x downloaded');
      return;
    }

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
      }
      if (b._exportType && b.title) {
        const fs=C.blockFontSize*zoom, ps=C.blockPadSide*zoom, pt=C.blockPadTop*zoom;
        ctx.font=`500 ${fs}px "DM Sans",Arial,sans-serif`;
        ctx.fillStyle=b.outlined?col:BG_COL; ctx.globalAlpha=0.9;
        ctx.beginPath(); ctx.roundRect(x,y,w,h,rad); ctx.clip();
        ctx.fillText(b.title,x+ps,y+pt+fs);
        if (b.e-b.s>0.5) { ctx.globalAlpha=0.65; const _d1=b._origS!=null?b._origS:b.s,_d2=b._origE!=null?b._origE:b.e; ctx.fillText(toHHMM(_d1)+' – '+toHHMM(_d2),x+ps,y+pt+fs*2.35); }
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
    const zr=zoom;

    // Group blocks by glyph (column d + line index) in type mode,
    // or treat each block as its own group in make mode.
    // Structure: letter group > block group > rect + texts
    // No clipPaths — use nested <svg> with overflow=hidden for text clipping.
    // Result in Figma: one group per letter, one group per block,
    // each block group has exactly: background rect, title text, time text.

    function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    function blockToSVG(b, idx) {
      const bx=(b.renderX-minX+PAD).toFixed(2);
      const by=(b.renderY-minY+PAD).toFixed(2);
      const w=b.renderW.toFixed(2), h=b.renderH.toFixed(2);
      const r=(C.blockRadius*zr).toFixed(2);
      const col=blockColor(b);
      const fs=(C.blockFontSize*zr).toFixed(2);
      const padS=(C.blockPadSide*zr).toFixed(2);
      const padT=(C.blockPadTop*zr).toFixed(2);
      const textCol=b.outlined?col:BG_COL;
      const sw=(C.blockStroke*zr).toFixed(2);

      // Background rect
      let rectEl;
      if (b.outlined) {
        rectEl=`<rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${BG_COL}" stroke="${col}" stroke-width="${sw}"/>`;
      } else {
        rectEl=`<rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${col}"/>`;
      }

      // Text elements — only if type export enabled and block tall enough
      let textEls='';
      if (b._exportType && b.title) {
        const tx=parseFloat(padS).toFixed(2);
        const ty=(parseFloat(padT)+parseFloat(fs)).toFixed(2);
        const safeTitle=esc(b.title);
        const _s=b._origS!=null?b._origS:b.s, _e=b._origE!=null?b._origE:b.e;
        const safeTime=esc(toHHMM(_s)+' – '+toHHMM(_e));
        textEls+=`\n    <text x="${tx}" y="${ty}" font-family="'DM Sans',Arial,sans-serif" font-size="${fs}" font-weight="500" fill="${textCol}" fill-opacity="0.9">${safeTitle}</text>`;
        if (b.e-b.s>0.5) {
          const ty2=(parseFloat(ty)+parseFloat(fs)*1.35).toFixed(2);
          textEls+=`\n    <text x="${tx}" y="${ty2}" font-family="'DM Sans',Arial,sans-serif" font-size="${fs}" fill="${textCol}" fill-opacity="0.65">${safeTime}</text>`;
        }
      }

      // Each block = one <g> translated to position.
      // Inner <svg> clips text to block bounds without a clipPath element.
      return `  <g id="block-${idx}" transform="translate(${bx},${by})">\n` +
             `    <svg width="${w}" height="${h}" overflow="hidden">\n` +
             `    ${rectEl}${textEls}\n` +
             `    </svg>\n` +
             `  </g>`;
    }

    let svgContent;
    if (isTypeMode && currentTypedText) {
      // Group blocks by letter position (column d + line)
      const STRIDE = GLYPH_SPAN * (1 + C.lineGapRatio);
      const groups = new Map();
      sorted.forEach((b, idx) => {
        const li = b._origS != null ? Math.round((b.s - b._origS) / STRIDE) : 0;
        const key = `${li}_${b.d}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push({b, idx});
      });
      const letterGroups = [...groups.entries()].map(([key, items], gi) => {
        const blockEls = items.map(({b, idx}) => blockToSVG(b, idx)).join('\n');
        return `<g id="letter-${gi}">
${blockEls}
</g>`;
      });
      svgContent = letterGroups.join('\n');
    } else {
      svgContent = sorted.map((b, idx) => blockToSVG(b, idx)).join('\n');
    }

    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${svgW.toFixed(0)}" height="${svgH.toFixed(0)}" viewBox="0 0 ${svgW.toFixed(0)} ${svgH.toFixed(0)}">\n${svgContent}\n</svg>`;
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
        const STRIDE = GLYPH_SPAN * (1 + C.lineGapRatio);
        const totalContent = (nLines - 1) * STRIDE + GLYPH_SPAN;
        const midHr = GLYPH_START + totalContent / 2;
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
        const _ts=b._origS!=null?b._origS:b.s,_te=b._origE!=null?b._origE:b.e;
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
        const nLines=currentTypedText.split('\n').length;
        const STRIDE=GLYPH_SPAN*(1+C.lineGapRatio);
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
      p.pixelDensity(window.devicePixelRatio || 1);
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
      // In 3D test mode the overlay owns scroll for camera zoom.
      // In 3D Make mode allow p5 zoom through — it scales the glyph and 3D syncs.
      if (window.CF3D && window.CF3D.isOpen() && !window.CF3D.isMakeMode()) return false;
      zoom-=e.delta*C.zoomStep;
      zoom=Math.max(C.zoomMin,Math.min(C.zoomMax,zoom));
      return false;
    };

    p.draw = function() {
      // Expose origin to CF.getSnapshot (which lives outside this closure).
      CF._ox = originX();
      CF._oy = originY();
      // Expose interaction state — 3D uses this to switch to 60fps rebuild during gestures.
      CF._interacting = !isTypeMode && !!(dragging || resizing || isCreating);
      CF._zoom = zoom;
      // Expose live ghost rect for 3D renderer — updated every frame while dragging.
      if (!isTypeMode && isCreating) {
        const sh = snapHour(createY0), eh = snapHour(p.mouseY);
        if (sh !== eh) {
          const canvasEl = p5ref ? p5ref.elt : null;
          const cr = canvasEl ? canvasEl.getBoundingClientRect() : { left: 0, top: 0 };
          const d = xToCol(createX0), gx = colToX(d);
          const y1 = hourToY(Math.min(sh, eh)), y2 = hourToY(Math.max(sh, eh));
          CF._ghostRect = {
            rx: cr.left + gx + 1,
            ry: cr.top  + y1,
            rw: dw() - 11,
            rh: y2 - y1,
            color: PALETTE[getPaletteState().palIdx || 0]
          };
        } else {
          CF._ghostRect = null;
        }
      } else {
        CF._ghostRect = null;
      }
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
      if (isTypeMode) {
        // In type mode each line is independent — never mix blocks from
        // different lines in the same processPhysics call.
        const STRIDE = GLYPH_SPAN * (1 + C.lineGapRatio);
        for (let d=minD;d<=maxD;d++) {
          const col = blocks.filter(b=>b.d===d);
          if (!col.length) continue;
          const seen = new Set();
          col.forEach(b => {
            const li = b._origS != null ? Math.round((b.s - b._origS) / STRIDE) : 0;
            seen.add(li);
          });
          seen.forEach(li => {
            const evts = col.filter(b => {
              const bLi = b._origS != null ? Math.round((b.s - b._origS) / STRIDE) : 0;
              return bLi === li;
            });
            if (evts.length) processPhysics(evts, colToX(d));
          });
        }
      } else {
        for (let d=minD;d<=maxD;d++) {
          const evts=blocks.filter(b=>b.d===d);
          if (evts.length) processPhysics(evts,colToX(d));
        }
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
      if (isTypeMode) {
        if(canvasEl) canvasEl.style.cursor='';
      } else if (!dragging && !resizing && !isCreating) {
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
  on(H.calExportBtn,   'click', showCalExport);
  on(H.sessionBtn,     'click', showSaveLoad);
  on(H.calConfirmBtn,  'click', downloadICS);
  onAll(H.calCloseBtns,'click', ()=>closeModal(H.calModal));
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
  loadTones();
  loadPresets();
  updatePaletteUI();
  const lbl=q(H.toneLabel); if(lbl) lbl.textContent=C.toneLabels[toneMode];
  setMode(C.defaultMode);
  const inp=q(H.typeInput);
  if (inp) { inp.value=C.defaultText; currentTypedText=C.defaultText; }
  renderTypedText();


  // ── 3D renderer bridge ────────────────────────────────────
  // Returns a plain-data snapshot of all currently rendered blocks.
  // Called by calfont-3d.js when entering 3D view.
  CF.getSnapshot = function() {
    const rendered = blocks.filter(b => b.renderX != null);
    // Normalise to zoom=1 so the 3D renderer is independent of the 2D zoom level.
    // renderX includes originX() which is CW/2 - 6*dw(). Simply dividing by zoom
    // leaves a CW/(2*zoom) residual that shifts with zoom. Fix: subtract the
    // origin (written into CF._ox/_oy by p.draw each frame, since originX/Y live
    // inside the p5 sketch closure and can't be called from here directly).
    const z  = zoom || 1;
    const ox = CF._ox != null ? CF._ox : 0;
    const oy = CF._oy != null ? CF._oy : 0;
    // Canvas offset in viewport — needed for viewport-space positioning in 3D
    const canvasEl   = p5ref ? p5ref.elt : null;
    const canvasRect = canvasEl ? canvasEl.getBoundingClientRect() : { left: 0, top: 0 };
    return {
      blocks: rendered.map(b => ({
        // Zoom=1 normalised coords — used for layer assignment
        x:  (b.renderX - ox) / z,
        y:  (b.renderY - oy) / z,
        w:  b.renderW / z,
        h:  b.renderH / z,
        // Raw viewport-space coords — used for 2D-matched initial positioning
        rx: b.renderX + canvasRect.left,
        ry: b.renderY + canvasRect.top,
        rw: b.renderW,
        rh: b.renderH,
        color:   blockColor(b),
        title:   b.title  || '',
        s:       b._origS != null ? b._origS : b.s,
        e:       b._origE != null ? b._origE : b.e,
        outlined: !!b.outlined
      })),
      bgColor:    C.bgColor,
      canvasW:    p5ref ? p5ref.width  : window.innerWidth,
      canvasH:    p5ref ? p5ref.height : window.innerHeight,
      zoom:       z,
      isMakeMode: !isTypeMode,
      // Column guide data — viewport x of column-0 left edge + per-column width
      colWidthPx: C.baseDayWidth * z,
      originVX:   canvasRect.left + (CF._ox != null ? CF._ox : 0),
      canvasVY:   canvasRect.top,
      canvasVH:   p5ref ? p5ref.height : window.innerHeight
    };
  };

}; // end CF.init
})();

  /* ============================ 3d (CSS preserve-3d) ============================ */
(function(){
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
  ROOT.appendChild(pill);
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
})();

  /* ============================ boot ============================ */
  function _boot(){
  CF.config.baseDayWidth   = 140;
  CF.config.baseHourHeight = 40;

  CF.init();

  document.querySelector('#cf-name-input').style.height = '42px';
  document.querySelector('#cf-type-input').style.height = '42px';
  document.querySelector('#cf-type-input').style.minHeight = '42px';

  // 3D toggle. CF3D is set by calfont-3d.js when the module loads.
  // Checking on click (not here) ensures the module has evaluated by then.
  document.getElementById('cf-btn-3d').addEventListener('click', function(e) {
    e.preventDefault();
    if (!window.CF3D) { console.error('CF3D: module not loaded yet'); return; }
    CF3D.toggle();
    document.getElementById('cf-btn-3d-label').textContent = CF3D.isOpen() ? '2D' : '3D';
  });


/* --- modal open/close listeners --- */
document.getElementById('cf-menu-btn-about').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('cf-about-modal').classList.add('cf-modal-open');
  });
  document.getElementById('cf-menu-btn-controls').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('cf-controls-modal').classList.add('cf-modal-open');
  });
  document.getElementById('cf-session-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('cf-saveload-modal').classList.add('cf-modal-open');
  });
  document.getElementById('cf-cal-modal').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('cf-modal-open');
  });
  ['cf-about-modal', 'cf-controls-modal'].forEach(function(id) {
    document.getElementById(id).addEventListener('click', function(e) {
      if (e.target === this) this.classList.remove('cf-modal-open');
    });
  });
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', _boot); } else { _boot(); }
})();
