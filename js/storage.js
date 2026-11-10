// حفظ التقدم والإعدادات في متصفح المستخدم.
window.K = window.K || {};

(function () {
  const KEY = "keyboardi.v1";
  const defaults = () => ({
    settings: { lang: "ar", arLayout: "ar_mac", shape: "iso", showKeyboard: true, showHands: true, sound: true, unlockAll: false, theme: "auto" },
    progress: {}, keys: { ar: {}, en: {} }, history: [], best: {},
  });

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (!raw) return defaults();
      const d = defaults();
      return { ...d, ...raw, settings: { ...d.settings, ...raw.settings }, keys: { ...d.keys, ...raw.keys } };
    } catch (_) { return defaults(); }
  }

  let state = load();
  let timer = null;
  function save() {
    clearTimeout(timer);
    timer = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* التخزين ممتلئ أو معطل */ } }, 150);
  }

  K.store = {
    get settings() { return state.settings; },
    setSetting(k, v) { state.settings[k] = v; save(); },
    course() { return state.settings.lang === "en" ? "en" : state.settings.arLayout; },
    progress(course) { return (state.progress[course] = state.progress[course] || {}); },
    lessonState(course, index) { return this.progress(course)[index] || null; },
    saveLesson(course, index, r) {
      const p = this.progress(course);
      const old = p[index] || { stars: 0, wpm: 0, acc: 0, done: false };
      p[index] = { stars: Math.max(old.stars, r.stars), wpm: Math.max(old.wpm, r.wpm), acc: Math.max(old.acc, r.acc), done: old.done || r.stars > 0 };
      save();
    },
    recordKey(lang, ch, ok) {
      const m = state.keys[lang];
      const e = (m[ch] = m[ch] || { h: 0, m: 0 });
      if (ok) e.h++; else e.m++;
      save();
    },
    keyStats(lang) { return state.keys[lang]; },
    addHistory(item) {
      state.history.push({ t: Date.now(), ...item });
      if (state.history.length > 500) state.history.splice(0, state.history.length - 500);
      save();
    },
    history(lang) { return state.history.filter((h) => h.lang === lang); },
    best(lang, sec) { return state.best[lang + sec] || 0; },
    setBest(lang, sec, wpm) { if (wpm > this.best(lang, sec)) { state.best[lang + sec] = wpm; save(); return true; } return false; },
    reset() { state = defaults(); localStorage.removeItem(KEY); },
  };
})();
