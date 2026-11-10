// لوحة المفاتيح على الشاشة، رسم اليدين، ومحرك الكتابة.
window.K = window.K || {};

(function () {
  const FINGER_OF = {};
  const assign = (f, codes) => codes.split(" ").forEach((c) => (FINGER_OF[c] = f));
  assign("lp", "Backquote IntlBackslash Digit1 Tab KeyQ CapsLock KeyA ShiftLeft KeyZ");
  assign("lr", "Digit2 KeyW KeyS KeyX");
  assign("lm", "Digit3 KeyE KeyD KeyC");
  assign("li", "Digit4 Digit5 KeyR KeyT KeyF KeyG KeyV KeyB");
  assign("ri", "Digit6 Digit7 KeyY KeyU KeyH KeyJ KeyN KeyM");
  assign("rm", "Digit8 KeyI KeyK Comma");
  assign("rr", "Digit9 KeyO KeyL Period");
  assign("rp", "Digit0 Minus Equal KeyP BracketLeft BracketRight Backslash Semicolon Quote Slash Backspace Enter ShiftRight");
  assign("th", "Space");
  K.FINGER_OF = FINGER_OF;

  // توزيع خاص بالتخطيط العربي للماك: الذال للسبابة، والطاء للوسطى، والظاء للبنصر.
  const FINGER_OVERRIDES = { ar_mac: { KeyC: "li", KeyX: "lm", KeyZ: "lr" } };
  K.fingerOf = (course, code) => (FINGER_OVERRIDES[course] || {})[code] || FINGER_OF[code];

  // العربية: Shift بالخنصر الأيسر، إلا إذا كان الحرف نفسه على الخنصر الأيسر.
  // الإنجليزية: Shift باليد المقابلة لليد التي تكتب الحرف.
  K.shiftFor = function (course, finger) {
    if (course === "en") return finger && finger[0] === "l" ? "ShiftRight" : "ShiftLeft";
    return finger === "lp" ? "ShiftRight" : "ShiftLeft";
  };

  K.FINGER_NAMES = {
    lp: "الخنصر الأيسر", lr: "البنصر الأيسر", lm: "الوسطى اليسرى", li: "السبابة اليسرى",
    ri: "السبابة اليمنى", rm: "الوسطى اليمنى", rr: "البنصر الأيمن", rp: "الخنصر الأيمن", th: "الإبهام",
  };

  K.getLayout = function (course, shape) {
    return shape === "ansi" ? { ...K.LAYOUTS[course], ...(K.ANSI_OVERRIDES[course] || {}) } : K.LAYOUTS[course];
  };

  const num = (...codes) => codes.map((c) => ({ code: c, w: 4 }));
  const digits = ["Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal"];
  const top = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"];
  const home = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"];
  const bottom = ["KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash"];
  const fn = (code, label, w, cls) => ({ code, label, w, fn: true, cls });
  const lastRow = [
    fn("", "fn", 4), fn("", "control", 4), fn("", "option", 4), fn("", "command", 5),
    { code: "Space", label: "", w: 20, fn: true },
    fn("", "command", 5), fn("", "option", 4), fn("", "←", 4), fn("", "↑↓", 4), fn("", "→", 4),
  ];

  const SHAPES = {
    iso: [
      [...num("IntlBackslash"), ...num(...digits), fn("Backspace", "delete", 6)],
      [fn("Tab", "tab", 7), ...num(...top), { code: "Enter", label: "↩", w: 3, fn: true, tall: true }],
      [fn("CapsLock", "caps lock", 7), ...num(...home), ...num("Backslash")],
      [fn("ShiftLeft", "shift", 5), ...num("Backquote"), ...num(...bottom), fn("ShiftRight", "shift", 9)],
      lastRow,
    ],
    ansi: [
      [...num("Backquote"), ...num(...digits), fn("Backspace", "delete", 6)],
      [fn("Tab", "tab", 6), ...num(...top), ...num("Backslash")],
      [fn("CapsLock", "caps lock", 7), ...num(...home), fn("Enter", "return", 7)],
      [fn("ShiftLeft", "shift", 9), ...num(...bottom), fn("ShiftRight", "shift", 9)],
      lastRow,
    ],
  };

  K.Keyboard = class {
    constructor(el, course, shape) {
      this.el = el; this.course = course; this.shape = shape;
      this.layout = K.getLayout(course, shape);
      this.en = K.LAYOUTS.en;
      this.layer = 0;
      this.render();
    }
    render() {
      let html = "";
      SHAPES[this.shape].forEach((row, r) => {
        let x = 1;
        row.forEach((k) => {
          const f = k.code ? K.fingerOf(this.course, k.code) : "";
          const fnCls = k.fn ? " fn" : "";
          const rows = k.tall ? `${r + 1}/span 2` : r + 1;
          const bump = k.code === "KeyF" || k.code === "KeyJ" ? '<i class="bump"></i>' : "";
          html += `<div class="key${fnCls}${f ? " f-" + f : ""}" data-code="${k.code}" style="grid-column:${x}/span ${k.w};grid-row:${rows}">`
            + `${k.fn ? `<span class="fnl">${k.label}</span>` : '<span class="m"></span><span class="s"></span>'}${bump}</div>`;
          x += k.w;
        });
      });
      this.el.className = "kb";
      this.el.setAttribute("dir", "ltr");
      this.el.innerHTML = html;
      this.keys = {};
      this.el.querySelectorAll(".key").forEach((n) => { if (n.dataset.code) this.keys[n.dataset.code] = n; });
      this.paint();
    }
    paint() {
      const isEn = this.course === "en";
      for (const [code, n] of Object.entries(this.keys)) {
        const m = n.querySelector(".m");
        if (!m) continue;
        const pair = this.layout[code] || ["", ""];
        let main = this.layer ? pair[1] : pair[0];
        if (isEn && /^[a-z]$/.test(pair[0])) main = pair[0].toUpperCase();
        m.textContent = main && K.isMark(main) ? K.charLabel(main) : main || "";
        const s = n.querySelector(".s");
        if (isEn) {
          s.textContent = /^[a-z]$/.test(pair[0]) || this.layer ? "" : pair[1] || "";
        } else {
          const e = this.en[code];
          s.textContent = e ? e[0].toUpperCase() : "";
        }
      }
    }
    setLayer(v) { if (this.layer !== (v ? 1 : 0)) { this.layer = v ? 1 : 0; this.paint(); } }
    clear() { this.el.querySelectorAll(".next,.next-shift,.bad").forEach((n) => n.classList.remove("next", "next-shift", "bad")); }
    highlight(code, shiftCode) {
      this.el.querySelectorAll(".next,.next-shift").forEach((n) => n.classList.remove("next", "next-shift"));
      if (code && this.keys[code]) this.keys[code].classList.add("next");
      if (shiftCode && this.keys[shiftCode]) this.keys[shiftCode].classList.add("next-shift");
    }
    flash(code) {
      const n = this.keys[code];
      if (!n) return;
      n.classList.add("bad");
      setTimeout(() => n.classList.remove("bad"), 180);
    }
    heat(fnForCode) {
      for (const [code, n] of Object.entries(this.keys)) {
        const r = fnForCode(code);
        n.className = n.className.replace(/\bf-\w+|\bh-\d\b/g, "").trim();
        n.classList.add("h-" + r.level);
        n.title = r.title;
      }
    }
    marks(codes) {
      codes.forEach((c) => this.keys[c] && this.keys[c].classList.add("next"));
    }
  };

  // رسم اليدين: مربعات مستديرة بسيطة لكل إصبع، وتتلوّن بالإصبع النشط.
  const FINGERS = [
    ["p", 58, 56, 32, 84], ["r", 96, 30, 34, 108], ["m", 136, 18, 34, 120], ["i", 176, 34, 34, 104],
  ];
  function handSvg(side, tx, flip) {
    let s = `<g transform="translate(${tx},0)${flip ? " scale(-1,1)" : ""}">`;
    s += `<rect class="palm" x="54" y="122" width="160" height="70" rx="26"/>`;
    FINGERS.forEach(([f, x, y, w, h]) => {
      s += `<rect class="finger" data-f="${side}${f}" x="${x}" y="${y}" width="${w}" height="${h}" rx="16"/>`;
    });
    s += `<g transform="rotate(38 222 146)"><rect class="finger" data-f="th" x="206" y="104" width="32" height="84" rx="16"/></g>`;
    return s + "</g>";
  }
  K.handsHtml = function () {
    return `<svg class="hands" viewBox="0 -28 700 228" aria-hidden="true">${handSvg("l", 30, false)}${handSvg("r", 670, true)}</svg>`;
  };
  // موضع كل مفتاح أفقيًا وصفّه، لحساب مقدار تمدد الإصبع وميله نحو المفتاح.
  const KEY_POS = {};
  digits.forEach((c, i) => (KEY_POS[c] = { x: i - 0.75, row: 0 }));
  top.forEach((c, i) => (KEY_POS[c] = { x: i - 0.25, row: 1 }));
  home.forEach((c, i) => (KEY_POS[c] = { x: i, row: 2 }));
  bottom.forEach((c, i) => (KEY_POS[c] = { x: i + 0.5, row: 3 }));
  KEY_POS.Backslash = { x: 11.75, row: 1 };
  const FINGER_HOME = { lp: 0, lr: 1, lm: 2, li: 3, ri: 6, rm: 7, rr: 8, rp: 9 };
  const ROW_STRETCH = [1.28, 1.16, 1.05, 0.88];

  K.reachOf = function (code, finger) {
    if (code === "Space") return { s: 0.96, r: 0 };
    if (code === "ShiftLeft" || code === "ShiftRight") return { s: 0.9, r: -14 };
    const p = KEY_POS[code];
    if (!p || FINGER_HOME[finger] == null) return { s: 1, r: 0 };
    const dx = (p.x - FINGER_HOME[finger]) * (finger[0] === "l" ? 1 : -1);
    return { s: ROW_STRETCH[p.row], r: Math.max(-16, Math.min(16, Math.round(dx * 9))) };
  };

  K.setActiveFinger = function (root, finger, reach) {
    const list = Array.isArray(finger) ? finger : [finger];
    root.querySelectorAll(".finger").forEach((n) => {
      const f = n.dataset.f, on = list.includes(f), r = on && reach && reach[f];
      n.setAttribute("class", "finger" + (on ? " on on-" + f : ""));
      n.style.setProperty("--s", r ? r.s : 1);
      n.style.setProperty("--r", (r ? r.r : 0) + "deg");
    });
  };

  // ضغطة قصيرة تُظهر حركة الإصبع حتى لو تكرر المفتاح نفسه.
  K.tapFinger = function (root, fingers) {
    fingers.forEach((f) => root.querySelectorAll(`.finger[data-f="${f}"]`).forEach((n) => {
      n.classList.add("tap");
      setTimeout(() => n.classList.remove("tap"), 80);
    }));
  };

  // ---- ترتيب النص ----
  const MARK = /[ً-ْ]/;
  const ALEFS = "اأإآ";
  const DUAL = "بتثجحخسشصضطظعغفقكلمنهيئى";
  const ARABIC_LETTER = /[ء-ي]/;

  function clusterize(text) {
    const out = [];
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const prev = out[out.length - 1];
      if (prev && MARK.test(c)) { prev.s += c; prev.end = i + 1; continue; }
      if (prev && ALEFS.includes(c) && prev.s === "ل") { prev.s += c; prev.end = i + 1; prev.ligature = true; continue; }
      out.push({ s: c, start: i, end: i + 1 });
    }
    return out;
  }
  const baseChar = (s) => s.replace(/[ً-ْ]/g, "");
  function joins(a, b) {
    const left = baseChar(a).slice(-1), right = baseChar(b)[0];
    return DUAL.includes(left) && ARABIC_LETTER.test(right) && right !== "ء";
  }
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  K.Typer = class {
    constructor(opts) {
      Object.assign(this, opts);
      this.i = 0; this.correct = 0; this.errors = 0; this.activeMs = 0; this.last = 0; this.started = false; this.done = false;
      this.missed = {};
      this.render();
      this.emit();
    }
    render() {
      const clusters = clusterize(this.text);
      this.clusters = clusters;
      this.indexToCluster = new Array(this.text.length);
      let html = "", inWord = false;
      clusters.forEach((c, n) => {
        for (let k = c.start; k < c.end; k++) this.indexToCluster[k] = n;
        if (c.s === " ") {
          if (inWord) { html += "</span>"; inWord = false; }
          html += `<span class="c sp${n === clusters.length - 1 ? " last" : ""}" data-c="${n}"> </span>`;
          return;
        }
        if (!inWord) { html += '<span class="w">'; inWord = true; }
        const prev = clusters[n - 1], next = clusters[n + 1];
        const zwjBefore = prev && prev.s !== " " && joins(prev.s, c.s) ? "‍" : "";
        const zwjAfter = next && next.s !== " " && joins(c.s, next.s) ? "‍" : "";
        html += `<span class="c" data-c="${n}">${zwjBefore}${esc(c.s)}${zwjAfter}</span>`;
      });
      if (inWord) html += "</span>";
      this.el.innerHTML = `<div class="t-inner">${html}</div>`;
      this.inner = this.el.firstChild;
      this.nodes = [...this.el.querySelectorAll(".c")];
      this.mark();
    }
    expected() { return this.text[this.i]; }
    mark() {
      const cur = this.indexToCluster[this.i];
      if (this.prevCur != null && this.nodes[this.prevCur]) this.nodes[this.prevCur].classList.remove("cur", "err");
      for (let n = this.doneUpTo || 0; n < (cur == null ? this.nodes.length : cur); n++) this.nodes[n].classList.add("done");
      this.doneUpTo = cur == null ? this.nodes.length : cur;
      if (cur != null) {
        this.nodes[cur].classList.add("cur");
        this.prevCur = cur;
        this.scroll(this.nodes[cur]);
      }
    }
    scroll(node) {
      const lh = this.lineHeight || (this.lineHeight = parseFloat(getComputedStyle(this.inner).lineHeight));
      const y = node.offsetTop;
      const offset = Math.max(0, Math.round(y / lh) - 1) * lh;
      if (offset !== this.offset) { this.offset = offset; this.inner.style.transform = `translateY(${-offset}px)`; }
    }
    tick() {
      const now = performance.now();
      if (this.started) this.activeMs += Math.min(now - this.last, 5000);
      else this.started = true;
      this.last = now;
    }
    // يعيد true إذا عالج الضغطة.
    press(e) {
      if (this.done) return false;
      const exp = this.expected();
      const pair = this.layout[e.code];
      const got = e.code === "Space" ? " " : pair ? pair[e.shiftKey ? 1 : 0] : "";
      if (!got && e.key.length !== 1) return false;
      this.tick();
      if (got && got.length > 1 && this.text.startsWith(got, this.i)) {
        for (let n = 0; n < got.length; n++) this.accept();
      } else if (got === exp || e.key === exp) {
        this.accept();
      } else {
        this.reject(e.code);
        return true;
      }
      if (this.i >= this.text.length) this.finish();
      else { this.mark(); this.emit(); }
      return true;
    }
    accept() {
      const ch = this.text[this.i];
      this.correct++;
      if (ch !== " ") K.store.recordKey(this.lang, ch, true);
      this.i++;
    }
    reject(code) {
      const ch = this.expected();
      this.errors++;
      if (ch !== " ") { K.store.recordKey(this.lang, ch, false); this.missed[ch] = (this.missed[ch] || 0) + 1; }
      const node = this.nodes[this.indexToCluster[this.i]];
      node.classList.add("err");
      if (this.onError) this.onError(code, ch);
      this.emit();
    }
    emit() { if (this.onChange) this.onChange(this); }
    finish() {
      this.done = true;
      this.mark();
      if (this.onDone) this.onDone(this);
    }
    wpm() { return K.wpm(this.correct, this.activeMs); }
    accuracy() { return K.accuracy(this.correct, this.errors); }
  };

  K.wpm = (chars, ms) => (ms < 400 ? 0 : Math.round((chars / 5) / (ms / 60000)));
  K.accuracy = (c, e) => (c + e === 0 ? 100 : Math.floor((c / (c + e)) * 100));

  // ---- الأصوات ----
  let audio;
  K.beep = function () {
    if (!K.store.settings.sound) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = "square"; o.frequency.value = 170; g.gain.value = 0.035;
      o.connect(g); g.connect(audio.destination);
      o.start(); o.stop(audio.currentTime + 0.07);
    } catch (_) { /* الصوت اختياري */ }
  };
})();
