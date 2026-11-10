// الواجهة: التنقل بين الصفحات وعرض الدروس والنتائج.
window.K = window.K || {};

(function () {
  const app = document.getElementById("app");
  const $ = (s, r = document) => r.querySelector(s);
  const store = K.store;
  let cleanup = null;
  let keyHandler = null;
  const courses = {};

  const getCourse = (id) => (courses[id] = courses[id] || K.buildCourse(id));
  const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6.2 6.8.8-5 4.6 1.3 6.7-6-3.3-6 3.3 1.3-6.7-5-4.6 6.8-.8z"/></svg>';
  const LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0110 0v3h1.5v11h-13V10zm2 0h6V7a3 3 0 00-6 0z"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 16.2L5 11.7l-1.8 1.8 6.3 6.3L21 8.3l-1.8-1.8z"/></svg>';
  const stars = (n, total = 3) => `<span class="stars" aria-label="${n} من ${total} نجوم">${Array.from({ length: total }, (_, i) => `<span class="${i < n ? "on" : ""}">${STAR}</span>`).join("")}</span>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function setView(html, nav) {
    if (cleanup) { cleanup(); cleanup = null; }
    keyHandler = null;
    app.innerHTML = html;
    document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("active", a.dataset.nav === nav));
    window.scrollTo(0, 0);
  }

  function courseSwitch() {
    const lang = store.settings.lang;
    return `<div class="seg" role="group" aria-label="لغة التدريب">
      <button data-lang="ar" class="${lang === "ar" ? "on" : ""}">العربية</button>
      <button data-lang="en" class="${lang === "en" ? "on" : ""}">English</button>
    </div>`;
  }
  function bindCourseSwitch(rerender) {
    document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => { store.setSetting("lang", b.dataset.lang); rerender(); }));
  }

  // ---- خريطة الدروس ----
  function isUnlocked(course, lessons, i) {
    if (store.settings.unlockAll || i === 0) return true;
    const prev = store.lessonState(course, lessons[i - 1].index);
    return !!(prev && prev.done);
  }

  function renderCourse() {
    const courseId = store.course();
    const c = getCourse(courseId);
    const flat = c.lessons;
    const nextIdx = flat.findIndex((l, i) => isUnlocked(courseId, flat, i) && !(store.lessonState(courseId, l.index) || {}).done);
    const total = flat.length;
    const doneCount = flat.filter((l) => (store.lessonState(courseId, l.index) || {}).done).length;
    const pct = Math.round((doneCount / total) * 100);

    const units = c.units.map((u, ui) => {
      const d = u.lessons.filter((l) => (store.lessonState(courseId, l.index) || {}).done).length;
      const tiles = u.lessons.map((l) => {
        const i = flat.indexOf(l);
        const st = store.lessonState(courseId, l.index);
        const unlocked = isUnlocked(courseId, flat, i);
        const isNext = i === nextIdx;
        const cls = ["tile", isNext ? "next" : "", st && st.done ? "done" : "", unlocked ? "" : "locked"].join(" ");
        const labelDir = c.lang === "en" && l.kind === "keys" ? "ltr" : "rtl";
        const label = l.kind === "keys"
          ? `<span class="tl-keys" dir="${labelDir}">${esc(l.title)}</span>`
          : `<span class="tl-text">${esc(l.title)}</span>`;
        const footer = !unlocked ? `<span class="lock">${LOCK}</span>` : l.kind === "guide" ? (st && st.done ? `<span class="ok">${CHECK}</span>` : "<span></span>") : stars(st ? st.stars : 0);
        const inner = `<span class="tl-n">${l.index + 1}</span>${label}<span class="tl-f">${footer}</span>`;
        return unlocked ? `<a class="${cls}" href="#/lesson/${l.index}">${inner}</a>` : `<div class="${cls}">${inner}</div>`;
      }).join("");
      return `<section class="unit">
        <header class="unit-h"><h2><span class="unit-n">${ui + 1}</span>${esc(u.title)}</h2><span class="count">${d} / ${u.lessons.length}</span></header>
        <p class="unit-note">${esc(u.note)}</p>
        <div class="tiles">${tiles}</div>
      </section>`;
    }).join("");

    const next = flat[nextIdx];
    setView(`<div class="wrap">
      <div class="course-top">
        <div>
          <h1>${c.lang === "en" ? "منهج الكتابة بالإنجليزية" : "منهج الكتابة بالعربية"}</h1>
          <div class="prog"><div class="bar"><i style="width:${pct}%"></i></div><span>${doneCount} من ${total} درسًا</span></div>
        </div>
        <div class="course-actions">
          ${courseSwitch()}
          ${next ? `<a class="btn primary" href="#/lesson/${next.index}">${doneCount ? "تابع التدريب" : "ابدأ من هنا"}</a>` : ""}
        </div>
      </div>
      ${units}
    </div>`, "course");
    bindCourseSwitch(renderCourse);
  }

  // ---- صفحة «قبل أن تبدأ» ----
  const GUIDE_PAGES = [
    {
      title: "اجلس بطريقة صحيحة",
      body: `<ul class="guide-list">
        <li>اجعل ظهرك مستقيمًا وقدميك على الأرض.</li>
        <li>اجعل مرفقيك قريبين من جسمك وبزاوية قائمة تقريبًا.</li>
        <li>اجعل الشاشة أمام عينيك، ولا تنظر إلى يديك.</li>
        <li>أرخِ أصابعك، فالضغط الخفيف أسرع وأريح.</li>
      </ul>`, marks: [],
    },
    {
      title: "مكان أصابعك على الصف الأوسط",
      body: `<p data-guide-home></p>`,
      marks: ["KeyA", "KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL", "Semicolon", "Space"],
    },
    {
      title: "لكل إصبع مفاتيحه",
      body: `<p>كل لون على لوحة المفاتيح يدل على إصبع واحد. بعد كل ضغطة تعود الأصابع إلى الصف الأوسط. إذا أخطأت يتوقف المؤشر حتى تضغط المفتاح الصحيح، وتحتسب الأخطاء في نسبة الدقة.</p>`,
      marks: [],
    },
    {
      title: "تنبيهات مهمة على جهازك الماك",
      body: `<ul class="guide-list">
        <li>هذا التدريب مبني على تخطيط <b>Arabic</b> الأصلي في macOS. يمكنك اختيار تخطيط <b>Arabic – PC</b> من الإعدادات.</li>
        <li>لا تحتاج إلى تغيير لغة الجهاز أثناء التدريب، فالتطبيق يقرأ موضع المفتاح الذي ضغطته.</li>
        <li>لتغيير لغة الكتابة في برامجك الأخرى اضغط مفتاح <b>fn</b> الذي عليه رمز الكرة الأرضية، أو <b>control + مسافة</b>.</li>
        <li>تدرّب ربع ساعة يوميًا، فالاستمرار أهم من طول الجلسة. الدقة أولًا ثم السرعة.</li>
      </ul>`, marks: [],
    },
  ];

  function renderGuide(courseId, lesson) {
    let page = 0;
    function paint() {
      const p = GUIDE_PAGES[page];
      setView(`<div class="wrap narrow">
        <div class="lesson-head"><a class="back" href="#/">‹ الدروس</a><h1>قبل أن تبدأ</h1><span class="muted">${page + 1} / ${GUIDE_PAGES.length}</span></div>
        <div class="panel guide">
          <h2>${p.title}</h2>
          ${p.body}
          <div id="kb"></div>
          <div class="hands-wrap">${K.handsHtml()}</div>
          <div class="guide-nav">
            ${page ? '<button class="btn" id="prev">السابق</button>' : "<span></span>"}
            <button class="btn primary" id="next">${page === GUIDE_PAGES.length - 1 ? "ابدأ الدرس الأول" : "التالي"}<kbd>return</kbd></button>
          </div>
        </div>
      </div>`, "course");
      const homeText = $("[data-guide-home]");
      if (homeText) {
        const keys = K.courseLang(courseId) === "en" ? ["A S D F", "J K L ;"] : ["ش س ي ب", "ت ن م ك"];
        homeText.innerHTML = `ضع أصابع يدك اليسرى على <b>${keys[0]}</b>، وأصابع يدك اليمنى على <b>${keys[1]}</b>. ستجد نتوءًا صغيرًا على مفتاحي F وJ، تعرف به مكان السبابتين دون نظر، والإبهام يبقى على مفتاح المسافة.`;
      }
      const kb = new K.Keyboard($("#kb"), courseId, store.settings.shape);
      kb.marks(p.marks);
      const handsRoot = $(".hands-wrap");
      K.setActiveFinger(handsRoot, p.marks.length ? ["lp", "lr", "lm", "li", "ri", "rm", "rr", "rp", "th"] : []);
      const next = () => {
        if (page === GUIDE_PAGES.length - 1) {
          store.saveLesson(courseId, lesson.index, { stars: 3, wpm: 0, acc: 0 });
          location.hash = "#/lesson/" + (lesson.index + 1);
        } else { page++; paint(); }
      };
      $("#next").addEventListener("click", next);
      const prev = $("#prev");
      if (prev) prev.addEventListener("click", () => { page--; paint(); });
      keyHandler = (e) => { if (e.code === "Enter") { e.preventDefault(); next(); } };
    }
    paint();
  }

  // ---- شاشات الكتابة ----
  function fingerHint(course, ch) {
    const rev = K.revCache[course] = K.revCache[course] || K.reverseLayout(K.getLayout(course, store.settings.shape));
    const k = rev[ch];
    if (!k) return null;
    const finger = K.fingerOf(course, k.code);
    const shiftCode = k.shift ? K.shiftFor(course, finger) : null;
    return { code: k.code, finger, shiftCode };
  }
  K.revCache = {};

  function playHtml(meta) {
    return `<div class="wrap play">
      <div class="lesson-head">
        <a class="back" href="#/">‹ الدروس</a>
        <h1>${esc(meta.heading)}</h1>
        <div class="steps" id="steps"></div>
        <div class="live"><span><b id="live-wpm">0</b> كلمة/د</span><span><b id="live-acc">100</b>٪ دقة</span></div>
      </div>
      <div class="panel stage">
        <div class="screen-title" id="s-title"></div>
        <div class="hint" id="hint"></div>
        <div class="typing" id="typing"></div>
      </div>
      <div id="visual">
        <div id="kb"></div>
        <div class="hands-wrap" id="hands">${K.handsHtml()}</div>
      </div>
      <div class="blind-msg" id="blind" hidden>لوحة المفاتيح مخفية في هذه الخطوة. اعتمد على أصابعك.</div>
    </div>`;
  }

  function runScreens(meta) {
    const course = meta.course;
    const lang = K.courseLang(course);
    const layout = K.getLayout(course, store.settings.shape);
    const settings = store.settings;
    setView(playHtml(meta), meta.nav || "course");
    const kb = new K.Keyboard($("#kb"), course, settings.shape);
    const hands = $("#hands");
    if (!settings.showKeyboard) $("#kb").hidden = true;
    if (!settings.showHands) hands.hidden = true;

    const screens = meta.screens;
    const totals = { correct: 0, errors: 0, ms: 0, missed: {} };
    let idx = 0, typer = null, lastIndex = -1;
    const typing = $("#typing");
    typing.dir = lang === "ar" ? "rtl" : "ltr";
    typing.className = "typing " + (lang === "ar" ? "ar" : "en");

    function updateLive() {
      const c = totals.correct + (typer ? typer.correct : 0), e = totals.errors + (typer ? typer.errors : 0);
      const ms = totals.ms + (typer ? typer.activeMs : 0);
      $("#live-wpm").textContent = K.wpm(c, ms);
      $("#live-acc").textContent = K.accuracy(c, e);
    }

    function onChange(t) {
      updateLive();
      if (t.done) return;
      const ch = t.expected();
      const h = fingerHint(course, ch);
      if (!h) { kb.clear(); $("#hint").innerHTML = ""; return; }
      kb.setLayer(!!h.shiftCode);
      kb.highlight(h.code, h.shiftCode);
      const reach = { [h.finger]: K.reachOf(h.code, h.finger) };
      if (h.shiftCode) {
        const shiftFinger = h.shiftCode === "ShiftRight" ? "rp" : "lp";
        reach[shiftFinger] = K.reachOf(h.shiftCode, shiftFinger);
      }
      K.setActiveFinger(hands, Object.keys(reach), reach);
      if (t.i !== lastIndex) K.tapFinger(hands, Object.keys(reach));
      lastIndex = t.i;
      // المؤشر يأخذ لون الإصبع المطلوب، إلا في خطوات الكتابة بلا لوحة.
      if (screens[idx].blind) typing.style.removeProperty("--cur");
      else typing.style.setProperty("--cur", `var(--${h.finger})`);
      const screen = screens[idx];
      if (screen.blind) { $("#hint").textContent = ""; return; }
      const label = ch === " " ? "المسافة" : K.charLabel(ch);
      const shiftTxt = h.shiftCode ? ` مع <b dir="ltr">shift</b> ${h.shiftCode === "ShiftRight" ? "اليمنى" : "اليسرى"}` : "";
      $("#hint").innerHTML = `اضغط <span class="kbd-chip hl" style="--chip:var(--${h.finger})" dir="auto">${esc(label)}</span> بإصبع <b>${K.FINGER_NAMES[h.finger]}</b>${shiftTxt}`;
    }

    function showScreen() {
      const s = screens[idx];
      $("#s-title").textContent = s.title;
      $("#steps").innerHTML = screens.map((_, i) => `<i class="${i < idx ? "d" : i === idx ? "c" : ""}"></i>`).join("");
      const blind = !!s.blind;
      $("#visual").hidden = blind;
      $("#blind").hidden = !blind;
      typing.classList.toggle("large", s.kind === "intro");
      typer = new K.Typer({
        el: typing, text: s.text.trimEnd() + " ", lang, layout, // المسافة الأخيرة هي التي تنهي التمرين
        onChange,
        onError: (code) => { K.beep(); kb.flash(code); },
        onDone: finishScreen,
      });
    }

    function finishScreen(t) {
      totals.correct += t.correct; totals.errors += t.errors; totals.ms += t.activeMs;
      for (const [k, v] of Object.entries(t.missed)) totals.missed[k] = (totals.missed[k] || 0) + v;
      typer = null;
      idx++;
      if (idx < screens.length) setTimeout(() => { if (cleanupToken === cleanup) showScreen(); }, 260);
      else meta.onFinish(totals);
    }

    keyHandler = (e) => {
      if (e.code === "Escape") { location.hash = "#/"; return; }
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if (!typer) return;
      if (typer.press(e)) e.preventDefault();
      else if (["Tab", "Backspace", "Enter"].includes(e.code)) e.preventDefault();
    };
    const cleanupToken = () => { typer = null; idx = screens.length; };
    cleanup = cleanupToken;
    showScreen();
  }

  function calcStars(wpm, acc, target) {
    if (acc >= 97 && wpm >= target) return 3;
    if (acc >= 93 && wpm >= target * 0.7) return 2;
    if (acc >= 85) return 1;
    return 0;
  }

  function renderResult(lessonMeta, totals) {
    const { course, lesson } = lessonMeta;
    const wpm = K.wpm(totals.correct, totals.ms);
    const acc = K.accuracy(totals.correct, totals.errors);
    const secs = Math.round(totals.ms / 1000);
    const star = calcStars(wpm, acc, lesson.target);
    store.saveLesson(course, lesson.index, { stars: star, wpm, acc });
    store.addHistory({ kind: "lesson", lang: lesson.lang, course, title: lesson.title, lessonIdx: lesson.index, wpm, acc, ms: Math.round(totals.ms) });

    const c = getCourse(course);
    const hasNext = c.lessons[c.lessons.indexOf(c.lessons.find((l) => l.index === lesson.index)) + 1];
    const canNext = hasNext && star > 0;
    const missed = Object.entries(totals.missed).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const msg = star === 0 ? "تحتاج إلى دقة 85٪ على الأقل لفتح الدرس التالي. أعد المحاولة ببطء." :
      star === 3 ? "ممتاز، أتقنت هذا الدرس." : star === 2 ? "جيد جدًا. ارفع دقتك وسرعتك لتنال النجمة الثالثة." : "اجتزت الدرس. أعده لترفع دقتك وتثبّت المفاتيح.";

    setView(`<div class="wrap narrow">
      <div class="panel result">
        <h1>${esc(lesson.kind === "keys" ? "نتيجة الدرس " + (lesson.index + 1) : lesson.title)}</h1>
        <div class="big-stars">${stars(star)}</div>
        <p class="res-msg">${msg}</p>
        <div class="res-grid">
          <div><b>${wpm}</b><span>كلمة في الدقيقة</span></div>
          <div><b>${acc}٪</b><span>الدقة</span></div>
          <div><b>${totals.errors}</b><span>أخطاء</span></div>
          <div><b>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}</b><span>الوقت</span></div>
        </div>
        <p class="target">للحصول على ثلاث نجوم: دقة 97٪ وسرعة ${lesson.target} كلمة في الدقيقة.</p>
        ${missed.length ? `<div class="missed"><span>أكثر المفاتيح خطأً:</span>${missed.map(([k, v]) => `<span class="kbd-chip" dir="auto">${esc(K.charLabel(k))} <small>${v}</small></span>`).join("")}</div>` : ""}
        <div class="res-actions">
          <a class="btn" href="#/lesson/${lesson.index}" id="again">أعد الدرس</a>
          ${canNext ? `<a class="btn primary" href="#/lesson/${hasNext.index}" id="nextl">الدرس التالي<kbd>return</kbd></a>` : `<a class="btn" href="#/">الدروس</a>`}
        </div>
      </div>
    </div>`, "course");
    if (location.hash === `#/lesson/${lesson.index}`) $("#again").addEventListener("click", (e) => { e.preventDefault(); renderLesson(lesson.index); });
    keyHandler = (e) => {
      if (e.code !== "Enter") return;
      e.preventDefault();
      if (canNext) location.hash = `#/lesson/${hasNext.index}`;
      else renderLesson(lesson.index);
    };
  }

  function renderLesson(index) {
    const courseId = store.course();
    const c = getCourse(courseId);
    const pos = c.lessons.findIndex((l) => l.index === index);
    if (pos < 0 || !isUnlocked(courseId, c.lessons, pos)) { location.hash = "#/"; return; }
    const lesson = c.lessons[pos];
    if (lesson.kind === "guide") return renderGuide(courseId, lesson);
    const heading = `الدرس ${lesson.index + 1}: ${lesson.kind === "keys" ? lesson.title : lesson.title}`;
    runScreens({
      course: courseId, heading, screens: K.buildScreens(lesson),
      onFinish: (totals) => renderResult({ course: courseId, lesson }, totals),
    });
  }

  // ---- اختبار السرعة ----
  function renderTest(sec) {
    const lang = store.settings.lang;
    const course = store.course();
    const duration = sec || 60;
    const layout = K.getLayout(course, store.settings.shape);
    const text = K.buildTestText(lang, 900 * Math.ceil(duration / 60));
    setView(`<div class="wrap narrow">
      <div class="course-top">
        <div><h1>اختبار السرعة</h1><p class="muted">ابدأ الكتابة وسيبدأ العدّ. أفضل نتيجة لك: <b>${store.best(lang, duration)}</b> كلمة في الدقيقة.</p></div>
        <div class="course-actions">${courseSwitch()}
          <div class="seg">${[60, 120, 180].map((s) => `<button data-sec="${s}" class="${s === duration ? "on" : ""}">${s / 60} د</button>`).join("")}</div>
        </div>
      </div>
      <div class="panel stage">
        <div class="test-bar"><span class="timer" id="timer">${Math.floor(duration / 60)}:00</span><span class="live"><span><b id="live-wpm">0</b> كلمة/د</span><span><b id="live-acc">100</b>٪ دقة</span></span></div>
        <div class="typing test ${lang}" id="typing" dir="${lang === "ar" ? "rtl" : "ltr"}"></div>
      </div>
    </div>`, "test");
    bindCourseSwitch(() => renderTest(duration));
    document.querySelectorAll("[data-sec]").forEach((b) => b.addEventListener("click", () => renderTest(+b.dataset.sec)));

    let startedAt = 0, ended = false, tick = null;
    const typer = new K.Typer({
      el: $("#typing"), text, lang, layout,
      onChange: (t) => {
        $("#live-acc").textContent = t.accuracy();
        if (startedAt) $("#live-wpm").textContent = K.wpm(t.correct, performance.now() - startedAt);
      },
      onError: () => K.beep(),
      onDone: () => finish(),
    });

    function finish() {
      if (ended) return;
      ended = true;
      clearInterval(tick);
      const ms = Math.min(duration * 1000, performance.now() - startedAt);
      const wpm = K.wpm(typer.correct, ms), acc = typer.accuracy();
      const isBest = store.setBest(lang, duration, wpm);
      store.addHistory({ kind: "test", lang, course, title: `اختبار ${duration / 60} د`, wpm, acc, ms: Math.round(ms) });
      setView(`<div class="wrap narrow"><div class="panel result">
        <h1>نتيجة الاختبار</h1>
        ${isBest ? '<p class="res-msg best">رقم قياسي جديد لك.</p>' : ""}
        <div class="res-grid">
          <div><b>${wpm}</b><span>كلمة في الدقيقة</span></div>
          <div><b>${acc}٪</b><span>الدقة</span></div>
          <div><b>${typer.errors}</b><span>أخطاء</span></div>
          <div><b>${typer.correct}</b><span>حرفًا صحيحًا</span></div>
        </div>
        <div class="res-actions"><button class="btn primary" id="retest">اختبار جديد<kbd>return</kbd></button></div>
      </div></div>`, "test");
      const again = () => renderTest(duration);
      $("#retest").addEventListener("click", again);
      keyHandler = (e) => { if (e.code === "Enter") { e.preventDefault(); again(); } };
    }

    keyHandler = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || ended) return;
      const handled = typer.press(e);
      if (handled) {
        e.preventDefault();
        if (!startedAt) {
          startedAt = performance.now();
          tick = setInterval(() => {
            const left = Math.max(0, duration - (performance.now() - startedAt) / 1000);
            const el = $("#timer");
            if (el) el.textContent = `${Math.floor(left / 60)}:${String(Math.ceil(left) % 60).padStart(2, "0")}`;
            if (left <= 0) finish();
          }, 200);
        }
      } else if (["Tab", "Backspace", "Enter"].includes(e.code)) e.preventDefault();
    };
    cleanup = () => { ended = true; clearInterval(tick); };
  }

  // ---- الإحصائيات ----
  function fmtDuration(ms) {
    const m = Math.round(ms / 60000);
    if (m < 60) return `${m} د`;
    return `${Math.floor(m / 60)} س ${m % 60} د`;
  }

  function speedChart(el, hist) {
    if (hist.length < 2) { el.innerHTML = '<p class="muted empty">أكمل درسين على الأقل ليظهر منحنى سرعتك.</p>'; return; }
    const W = 760, H = 220, pad = { l: 36, r: 14, t: 14, b: 26 };
    const items = hist.slice(-40);
    const maxV = Math.max(10, ...items.map((h) => h.wpm));
    const top = Math.ceil(maxV / 20) * 20; // مضاعفات 20 لتكون تدريجات المحور أعدادًا صحيحة
    const x = (i) => pad.l + (i * (W - pad.l - pad.r)) / (items.length - 1);
    const y = (v) => pad.t + (1 - v / top) * (H - pad.t - pad.b);
    let grid = "";
    for (let v = 0; v <= top; v += top / 4) {
      grid += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${pad.l - 8}" y="${y(v) + 4}" text-anchor="end" class="axis">${Math.round(v)}</text>`;
    }
    const path = items.map((h, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(h.wpm).toFixed(1)}`).join(" ");
    el.innerHTML = `<div class="chart" dir="ltr">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="منحنى السرعة لآخر ${items.length} جلسة">
        ${grid}
        <path d="${path}" class="line"/>
        <line id="cross" class="cross" y1="${pad.t}" y2="${H - pad.b}" visibility="hidden"/>
        <circle id="dot" r="5" class="dot" visibility="hidden"/>
        <rect id="hit" x="${pad.l}" y="${pad.t}" width="${W - pad.l - pad.r}" height="${H - pad.t - pad.b}" fill="transparent"/>
      </svg>
      <div class="tip" id="tip" dir="rtl" hidden></div>
    </div>`;
    const svg = $("svg", el), hit = $("#hit", el), cross = $("#cross", el), dot = $("#dot", el), tip = $("#tip", el);
    hit.addEventListener("mousemove", (e) => {
      const r = svg.getBoundingClientRect();
      const vx = ((e.clientX - r.left) / r.width) * W;
      const i = Math.max(0, Math.min(items.length - 1, Math.round(((vx - pad.l) / (W - pad.l - pad.r)) * (items.length - 1))));
      const h = items[i], px = x(i), py = y(h.wpm);
      cross.setAttribute("x1", px); cross.setAttribute("x2", px); cross.setAttribute("visibility", "visible");
      dot.setAttribute("cx", px); dot.setAttribute("cy", py); dot.setAttribute("visibility", "visible");
      tip.hidden = false;
      tip.innerHTML = `<b>${h.wpm} كلمة/د</b><br>دقة ${h.acc}٪<br><span>${esc(h.title)}</span>`;
      const left = (px / W) * r.width;
      tip.style.left = Math.min(r.width - 150, Math.max(0, left - 70)) + "px";
      tip.style.top = Math.max(0, (py / H) * r.height - 86) + "px";
    });
    hit.addEventListener("mouseleave", () => { tip.hidden = true; cross.setAttribute("visibility", "hidden"); dot.setAttribute("visibility", "hidden"); });
  }

  function weakKeys(lang, course) {
    const stats = store.keyStats(lang);
    const rev = K.reverseLayout(K.getLayout(course, store.settings.shape));
    return Object.entries(stats)
      .filter(([ch, s]) => rev[ch] && s.h + s.m >= 8 && s.m > 0)
      .map(([ch, s]) => ({ ch, rate: s.m / (s.h + s.m) }))
      .sort((a, b) => b.rate - a.rate);
  }

  function renderStats() {
    const lang = store.settings.lang;
    const course = store.course();
    const hist = store.history(lang);
    const totalMs = hist.reduce((a, h) => a + h.ms, 0);
    const recent = hist.slice(-10);
    const avg = (k) => (recent.length ? Math.round(recent.reduce((a, h) => a + h[k], 0) / recent.length) : 0);
    const best = hist.reduce((m, h) => Math.max(m, h.wpm), 0);
    const c = getCourse(course);
    const done = c.lessons.filter((l) => (store.lessonState(course, l.index) || {}).done).length;
    const weak = weakKeys(lang, course).slice(0, 8);
    const rows = hist.slice(-12).reverse().map((h) => {
      const d = new Date(h.t);
      return `<tr><td>${d.getDate()}/${d.getMonth() + 1}</td><td>${esc(h.title)}</td><td>${h.wpm}</td><td>${h.acc}٪</td><td>${Math.round(h.ms / 1000)} ث</td></tr>`;
    }).join("");

    setView(`<div class="wrap">
      <div class="course-top"><h1>إحصائياتك</h1><div class="course-actions">${courseSwitch()}</div></div>
      <div class="stat-row">
        <div class="panel stat"><b>${avg("wpm")}</b><span>متوسط السرعة لآخر 10 جلسات</span></div>
        <div class="panel stat"><b>${avg("acc")}٪</b><span>متوسط الدقة</span></div>
        <div class="panel stat"><b>${best}</b><span>أعلى سرعة</span></div>
        <div class="panel stat"><b>${done} / ${c.lessons.length}</b><span>الدروس المكتملة</span></div>
        <div class="panel stat"><b>${fmtDuration(totalMs)}</b><span>وقت التدريب</span></div>
      </div>
      <div class="panel"><h2>تطور السرعة (كلمة في الدقيقة)</h2><div id="chart"></div></div>
      <div class="panel">
        <div class="panel-h"><h2>أخطاؤك على لوحة المفاتيح</h2>
          <div class="legend"><span>أقل</span><i class="h-1"></i><i class="h-2"></i><i class="h-3"></i><i class="h-4"></i><i class="h-5"></i><span>أكثر</span></div>
        </div>
        <div id="kb"></div>
        <div class="weak">
          ${weak.length ? `<div class="missed"><span>نقاط ضعفك:</span>${weak.map((w) => `<span class="kbd-chip" dir="auto">${esc(K.charLabel(w.ch))} <small>${Math.round(w.rate * 100)}٪</small></span>`).join("")}</div>
          <a class="btn primary" href="#/weak">تدرّب على نقاط ضعفك</a>` : '<p class="muted">ستظهر نقاط ضعفك بعد عدة دروس.</p>'}
        </div>
      </div>
      ${rows ? `<div class="panel"><h2>آخر الجلسات</h2><table class="table"><thead><tr><th>التاريخ</th><th>النشاط</th><th>السرعة</th><th>الدقة</th><th>المدة</th></tr></thead><tbody>${rows}</tbody></table></div>` : ""}
    </div>`, "stats");
    bindCourseSwitch(renderStats);
    speedChart($("#chart"), hist);

    const kb = new K.Keyboard($("#kb"), course, store.settings.shape);
    const stats = store.keyStats(lang);
    const layout = K.getLayout(course, store.settings.shape);
    kb.heat((code) => {
      const pair = layout[code];
      if (!pair) return { level: 0, title: "" };
      let h = 0, m = 0;
      pair.forEach((c) => {
        const k = stats[c] || (lang === "en" && c && stats[c.toLowerCase()]);
        if (k) { h += k.h; m += k.m; }
      });
      if (h + m === 0) return { level: 0, title: "لا توجد بيانات" };
      const r = m / (h + m);
      const level = m === 0 ? 1 : r < 0.03 ? 2 : r < 0.07 ? 3 : r < 0.15 ? 4 : 5;
      return { level, title: `${h + m} ضغطة، ${m} خطأ (${Math.round(r * 100)}٪)` };
    });
  }

  function renderWeak() {
    const lang = store.settings.lang;
    const course = store.course();
    const weak = weakKeys(lang, course).slice(0, 6).map((w) => w.ch);
    if (!weak.length) { location.hash = "#/stats"; return; }
    runScreens({
      course, heading: "تدريب نقاط الضعف", nav: "stats", screens: K.buildWeakScreens(course, weak),
      onFinish: (totals) => {
        const wpm = K.wpm(totals.correct, totals.ms), acc = K.accuracy(totals.correct, totals.errors);
        store.addHistory({ kind: "weak", lang, course, title: "نقاط الضعف", wpm, acc, ms: Math.round(totals.ms) });
        location.hash = "#/stats";
      },
    });
  }

  // ---- الإعدادات ----
  function renderSettings() {
    const s = store.settings;
    const radio = (name, val, label, sub) => `<label class="opt"><input type="radio" name="${name}" value="${val}" ${s[name] === val ? "checked" : ""}><span><b>${label}</b>${sub ? `<small>${sub}</small>` : ""}</span></label>`;
    const check = (name, label) => `<label class="opt"><input type="checkbox" name="${name}" ${s[name] ? "checked" : ""}><span><b>${label}</b></span></label>`;
    setView(`<div class="wrap narrow">
      <div class="course-top"><h1>الإعدادات</h1></div>
      <div class="panel">
        <h2>المظهر</h2>
        ${radio("theme", "auto", "تلقائي", "يتبع مظهر جهازك.")}
        ${radio("theme", "light", "فاتح", "")}
        ${radio("theme", "dark", "داكن", "خلفية سوداء مريحة، وكل مفتاح بلون إصبعه.")}
      </div>
      <div class="panel">
        <h2>تخطيط العربية</h2>
        ${radio("arLayout", "ar_mac", "Arabic (ماك)", "التخطيط الأصلي في macOS، وهو الأنسب لأجهزة الماك.")}
        ${radio("arLayout", "ar_pc", "Arabic – PC", "مطابق للوحات الويندوز المعتادة، ويتوفر في macOS أيضًا.")}
      </div>
      <div class="panel">
        <h2>شكل لوحة المفاتيح</h2>
        ${radio("shape", "iso", "ISO", "مفتاح return كبير، ومفتاح إضافي بجانب shift اليسرى.")}
        ${radio("shape", "ansi", "ANSI", "مفتاح return عريض، وshift اليسرى طويلة.")}
      </div>
      <div class="panel">
        <h2>أثناء التدريب</h2>
        ${check("showKeyboard", "إظهار لوحة المفاتيح")}
        ${check("showHands", "إظهار اليدين")}
        ${check("sound", "صوت عند الخطأ")}
        ${check("unlockAll", "فتح جميع الدروس دون تدرّج")}
      </div>
      <div class="panel">
        <h2>البيانات</h2>
        <p class="muted">يُحفظ تقدمك في هذا المتصفح فقط، ولا يُرسل إلى أي مكان.</p>
        <button class="btn danger" id="reset">مسح كل التقدم</button>
      </div>
    </div>`, "settings");
    document.querySelectorAll('input[type="radio"]').forEach((i) => i.addEventListener("change", () => { store.setSetting(i.name, i.value); K.revCache = {}; applyTheme(); }));
    document.querySelectorAll('input[type="checkbox"]').forEach((i) => i.addEventListener("change", () => store.setSetting(i.name, i.checked)));
    $("#reset").addEventListener("click", () => {
      if (confirm("سيُحذف كل تقدمك وإحصائياتك نهائيًا. هل تريد المتابعة؟")) { store.reset(); K.revCache = {}; applyTheme(); location.hash = "#/"; renderCourse(); }
    });
  }

  // ---- المظهر ----
  const darkQuery = matchMedia("(prefers-color-scheme: dark)");
  const themeBtn = $("#theme-btn");
  const currentTheme = () => {
    const s = store.settings.theme;
    return s === "auto" ? (darkQuery.matches ? "dark" : "light") : s;
  };
  function applyTheme() {
    const t = currentTheme();
    document.documentElement.dataset.theme = t;
    $("#theme-color").content = t === "dark" ? "#16191e" : "#1b76d1";
    const label = t === "dark" ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن";
    themeBtn.title = label;
    themeBtn.setAttribute("aria-label", label);
  }
  darkQuery.addEventListener("change", applyTheme);
  themeBtn.addEventListener("click", () => {
    store.setSetting("theme", currentTheme() === "dark" ? "light" : "dark");
    applyTheme();
    themeBtn.blur(); // حتى لا تُفعّله المسافة أثناء الكتابة
    if (location.hash.startsWith("#/settings")) renderSettings();
  });
  applyTheme();

  // ---- التوجيه ----
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/");
    if (parts[0] === "lesson" && parts[1]) return renderLesson(+parts[1]);
    if (parts[0] === "test") return renderTest();
    if (parts[0] === "stats") return renderStats();
    if (parts[0] === "weak") return renderWeak();
    if (parts[0] === "settings") return renderSettings();
    renderCourse();
  }

  window.addEventListener("hashchange", route);
  document.addEventListener("keydown", (e) => { if (keyHandler) keyHandler(e); });
  route();

  // تفعيل العمل دون إنترنت عند التشغيل من الموقع (لا يعمل عند فتح الملف مباشرة).
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
