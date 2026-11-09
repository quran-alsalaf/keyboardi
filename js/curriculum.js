// المنهج: يحدد ترتيب المفاتيح، ويولّد نصوص كل درس مما تعلّمه المتدرب حتى تلك اللحظة.
window.K = window.K || {};

(function () {
  const TASHKEEL = "ًٌٍَُِّْ";

  // وحدة واحدة = صف أو مجموعة مفاتيح. كل عنصر في groups درس لمفاتيح جديدة.
  const COMMON_AR_TAIL = [
    { title: "التشكيل", note: "الحركات على الماك تُكتب مع Shift.", groups: ["َُ", "ِْ", "ًٌ", "ٍّ"], tashkeel: true },
    { title: "الأرقام", note: "الأرقام في الصف العلوي.", groups: ["١٢٣", "٤٥", "٦٧", "٨٩٠"], digits: true },
  ];

  const UNITS = {
    ar_mac: [
      { title: "الصف الأوسط", note: "أهم صف في لوحة المفاتيح، ومنه تنطلق أصابعك وإليه تعود.", groups: ["بت", "ين", "سم", "شك", "لا"] },
      { title: "الصف العلوي", note: "مدّ إصبعك إلى الأعلى ثم أعده إلى مكانه.", groups: ["قع", "فغ", "ثه", "صخ", "ضح", "جة"] },
      { title: "الصف السفلي", note: "ثنية خفيفة للإصبع إلى الأسفل ثم عودة.", groups: ["دو", "زر", "ذ،", "ط.", "ظ"] },
      { title: "الهمزات وShift", note: "اضغط Shift باليد المقابلة لليد التي تكتب الحرف.", groups: ["أإ", "آؤ", "ئء", "ى؟"] },
      ...COMMON_AR_TAIL,
    ],
    ar_pc: [
      { title: "الصف الأوسط", note: "أهم صف في لوحة المفاتيح، ومنه تنطلق أصابعك وإليه تعود.", groups: ["بت", "ين", "سم", "شك", "لا", "ط"] },
      { title: "الصف العلوي", note: "مدّ إصبعك إلى الأعلى ثم أعده إلى مكانه.", groups: ["قع", "فغ", "ثه", "صخ", "ضح", "جد"] },
      { title: "الصف السفلي", note: "ثنية خفيفة للإصبع إلى الأسفل ثم عودة.", groups: ["رو", "ةز", "ذظ", "ئء", "ؤى"] },
      { title: "الهمزات وShift", note: "اضغط Shift باليد المقابلة لليد التي تكتب الحرف.", groups: ["أإ", "آ.", "،؟"] },
      ...COMMON_AR_TAIL,
    ],
    en: [
      { title: "Home Row — الصف الأوسط", note: "أهم صف في لوحة المفاتيح، ومنه تنطلق أصابعك وإليه تعود.", groups: ["fj", "dk", "sl", "a;", "gh"] },
      { title: "Top Row — الصف العلوي", note: "مدّ إصبعك إلى الأعلى ثم أعده إلى مكانه.", groups: ["ru", "ei", "wo", "qp", "ty"] },
      { title: "Bottom Row — الصف السفلي", note: "ثنية خفيفة للإصبع إلى الأسفل ثم عودة.", groups: ["vm", "c,", "x.", "z/", "bn"] },
      { title: "الحروف الكبيرة", note: "اضغط Shift باليد المقابلة لليد التي تكتب الحرف.", groups: ["ASDFG", "HJKL", "QWERT", "YUIOP", "ZXCVB", "NM"] },
      { title: "علامات الترقيم", note: "علامات تظهر في كل نص إنجليزي تقريبًا.", groups: ["?!", "'\"", ":-", "()"] },
      { title: "الأرقام", note: "الأرقام في الصف العلوي.", groups: ["123", "45", "67", "890"], digits: true },
      { title: "الرموز", note: "رموز تحتاجها في البريد والأسعار والحساب.", groups: ["@#", "$%", "&*", "+="] },
    ],
  };

  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rand(a.length)];
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const uniq = (a) => [...new Set(a)];

  K.courseLang = (course) => (course === "en" ? "en" : "ar");

  // يعيد خريطة عكسية: الحرف → { code, shift }، ويقدّم المفتاح بلا Shift.
  K.reverseLayout = function (layout) {
    const map = {};
    for (const [code, [plain, shifted]] of Object.entries(layout)) {
      if (code === "IntlBackslash" || code === "Backquote") {
        if (plain && plain !== "§" && plain !== "`" && plain !== "ـ" && !map[plain]) map[plain] = { code, shift: false };
        if (shifted && shifted !== "±" && shifted !== "~" && !map[shifted]) map[shifted] = { code, shift: true };
        continue;
      }
      if (plain && plain.length === 1 && !(map[plain] && !map[plain].shift)) map[plain] = { code, shift: false };
      if (shifted && shifted.length === 1 && !map[shifted]) map[shifted] = { code, shift: true };
    }
    map[" "] = { code: "Space", shift: false };
    return map;
  };

  // ---- مولدات النص ----
  function allowedOnly(text, allowed) {
    return [...text].every((c) => c === " " || allowed.has(c));
  }

  function joinToLength(items, length) {
    const out = [];
    let n = 0, i = 0, bag = shuffle(items);
    while (n < length && items.length) {
      if (i >= bag.length) { bag = shuffle(items); i = 0; }
      const w = bag[i++];
      if (out[out.length - 1] === w && items.length > 1) continue;
      out.push(w); n += w.length + 1;
    }
    return out.join(" ");
  }

  function introText(ch) {
    return K.isMark(ch) ? Array(6).fill("ب" + ch).join(" ") : Array(6).fill(ch).join(" ");
  }

  function pairDrill(chars, length, base) {
    // تمرين تبادلي بين المفاتيح الجديدة
    const display = (c) => (K.isMark(c) ? pick(base) + c : c);
    const groups = [];
    for (const a of chars) {
      groups.push(display(a).repeat(2));
      for (const b of chars) if (a !== b) groups.push(display(a) + display(b), display(b) + display(a), display(a) + display(a) + display(b));
    }
    if (chars.length === 1) groups.push(display(chars[0]).repeat(3));
    return joinToLength(uniq(groups), length);
  }

  function mixDrill(newChars, oldChars, length, base) {
    const display = (c) => (K.isMark(c) ? pick(base) + c : c);
    const out = [];
    let n = 0;
    while (n < length) {
      const size = 2 + rand(3);
      let g = "";
      for (let i = 0; i < size; i++) g += display(Math.random() < 0.55 ? pick(newChars) : pick(oldChars));
      out.push(g); n += [...g].length + 1;
    }
    return out.join(" ");
  }

  function digitDrill(chars, length) {
    const out = [];
    let n = 0;
    while (n < length) {
      const size = 2 + rand(3);
      let g = "";
      for (let i = 0; i < size; i++) g += pick(chars);
      out.push(g); n += g.length + 1;
    }
    return out.join(" ");
  }

  // يبني مصدر الكلمات المتاحة للدرس بعد تصفيتها بما تعلّمه المتدرب.
  function wordPool(lang, allowed) {
    const base = uniq(K.WORDS[lang]);
    let pool = base.filter((w) => allowedOnly(w, allowed));
    if (lang === "en") {
      const caps = base.map((w) => w[0].toUpperCase() + w.slice(1)).filter((w) => allowedOnly(w, allowed));
      pool = pool.concat(caps);
    }
    return pool;
  }

  function decorate(words, newChars) {
    const out = [];
    for (const c of newChars) {
      if (/[a-zA-Zء-ي0-9]/.test(c) || K.isMark(c)) continue;
      for (const w of words.slice(0, 80)) {
        if (c === "(") out.push("(" + w + ")");
        else if (c === ")") continue;
        else if (c === '"') out.push('"' + w + '"');
        else if (c === "'") out.push(w + "'s");
        else if (c === "-") out.push(w + "-" + pick(words));
        else out.push(w + c);
      }
    }
    return out;
  }

  // النص الذي يمكن كتابته بما تعلّمه المتدرب، مع حذف علامات الترقيم غير المتاحة.
  function usable(list, allowed) {
    const out = [];
    for (let t of list) {
      t = t.replace(/[.,،؟?!;:'"\-]/g, (c) => (allowed.has(c) ? c : "")).replace(/\s+/g, " ").trim();
      if (allowedOnly(t, allowed)) out.push(t);
    }
    return out;
  }

  // يربط الكلمات بعلامات حركات في درس التشكيل.
  function vowelize(words, marks) {
    return words.map((w) => {
      const c = [...w];
      const idx = rand(Math.max(1, c.length - 1));
      c[idx] = c[idx] + pick(marks);
      return c.join("");
    });
  }

  // ---- بناء الدروس ----
  function buildLesson(course, unit, group, seen, index, unitIndex) {
    const lang = K.courseLang(course);
    const newChars = [...group];
    return {
      id: `${course}-${index}`,
      course, index, lang, unitIndex, kind: "keys",
      title: newChars.map(K.charLabel).join("  "),
      newChars,
      known: seen.slice(),
      target: Math.round(Math.min(34, 7 + index * 0.65)),
      tashkeel: !!unit.tashkeel, digits: !!unit.digits,
    };
  }

  K.buildCourse = function (course) {
    const lang = K.courseLang(course);
    const lessons = [];
    const units = [];
    lessons.push({ id: `${course}-0`, course, index: 0, lang, unitIndex: 0, kind: "guide", title: "قبل أن تبدأ", target: 0 });
    let seen = [];
    let index = 1;
    UNITS[course].forEach((unit, ui) => {
      const unitLessons = ui === 0 ? [lessons[0]] : [];
      unit.groups.forEach((group) => {
        const l = buildLesson(course, unit, group, seen, index++, ui);
        lessons.push(l); unitLessons.push(l);
        seen = seen.concat([...group]);
      });
      // درس مراجعة في نهاية كل وحدة.
      const review = {
        id: `${course}-${index}`, course, index, lang, unitIndex: ui, kind: "review",
        title: "مراجعة", newChars: [], known: seen.slice(),
        target: Math.round(Math.min(36, 8 + index * 0.65)),
        tashkeel: !!unit.tashkeel, digits: !!unit.digits,
      };
      index++;
      lessons.push(review); unitLessons.push(review);
      units.push({ title: unit.title, note: unit.note, lessons: unitLessons });
    });

    // دروس الجمل والفقرات: تستخدم جميع الحروف.
    const finalLessons = [
      { title: "جمل قصيرة", kind: "sentences", n: 4 },
      { title: "جمل متوسطة", kind: "sentences", n: 6 },
      { title: "جمل طويلة", kind: "sentences", n: 8 },
      { title: "فقرة ١", kind: "paragraph", p: 0 },
      { title: "فقرة ٢", kind: "paragraph", p: 1 },
      { title: "فقرة ٣", kind: "paragraph", p: 2 },
      { title: "فقرة ٤", kind: "paragraph", p: 3 },
      { title: "فقرة ٥", kind: "paragraph", p: 4 },
      { title: "فقرة ٦", kind: "paragraph", p: 5 },
    ];
    const ui = units.length;
    const textLessons = finalLessons.map((f) => {
      const l = { ...f, id: `${course}-${index}`, course, index, lang, unitIndex: ui, known: seen.slice(), newChars: [], target: Math.round(Math.min(40, 10 + index * 0.6)) };
      index++;
      lessons.push(l);
      return l;
    });
    units.push({ title: "جمل وفقرات", note: "الكتابة الحقيقية: نصوص كاملة بلا نظر إلى لوحة المفاتيح.", lessons: textLessons });
    return { course, lang, units, lessons };
  };

  // يولّد شاشات الدرس عند فتحه، فلا يتكرر النص نفسه في كل محاولة.
  K.buildScreens = function (lesson) {
    const { lang, newChars = [], known = [] } = lesson;
    const allowed = new Set(known.concat(newChars));
    allowed.add(" ");
    const old = known.filter((c) => !K.isMark(c) && !/[0-9٠-٩]/.test(c));
    const letterBase = known.filter((c) => /[ء-ي]/.test(c) && !K.isMark(c));
    const screens = [];

    if (lesson.kind === "keys") {
      newChars.forEach((c) => screens.push({ kind: "intro", ch: c, text: introText(c), title: "تعرّف على المفتاح" }));

      if (lesson.digits) {
        screens.push({ kind: "drill", title: "تمرين الأرقام", text: digitDrill(newChars, 44) });
        const allDigits = known.filter((c) => /[0-9٠-٩]/.test(c)).concat(newChars);
        if (allDigits.length > newChars.length) screens.push({ kind: "drill", title: "مزج الأرقام", text: digitDrill(allDigits, 56) });
        return screens;
      }

      if (lesson.tashkeel) {
        screens.push({ kind: "drill", title: "تمرين على الحركات", text: pairDrill(newChars, 34, letterBase) });
        const words = wordPool(lang, new Set(known.filter((c) => !K.isMark(c)).concat([" "])));
        screens.push({ kind: "words", title: "كلمات مشكولة", text: joinToLength(vowelize(shuffle(words).slice(0, 18), newChars), 70) });
        return screens;
      }

      screens.push({ kind: "drill", title: "تمرين على المفاتيح الجديدة", text: pairDrill(newChars, 40, letterBase) });
      if (old.length) screens.push({ kind: "drill", title: "مزج مع ما تعلّمته", text: mixDrill(newChars, old, 50, letterBase) });
      else screens.push({ kind: "drill", title: "تمرين أطول", text: pairDrill(newChars, 56, letterBase) });

      const pool = wordPool(lang, allowed);
      const withNew = pool.filter((w) => newChars.some((c) => w.includes(c)));
      const dec = decorate(pool.length ? pool : [], newChars);
      const source = withNew.concat(dec);
      if (source.length >= 3) {
        screens.push({ kind: "words", title: "كلمات", text: joinToLength(source.concat(shuffle(pool).slice(0, Math.ceil(source.length / 3))), 64) });
      }
      if (source.length >= 6 && pool.length >= 12) {
        screens.push({ kind: "words", title: "كلمات أكثر", text: joinToLength(pool, 72) });
      }
      return screens;
    }

    if (lesson.kind === "review") {
      if (lesson.digits) {
        const d = known.filter((c) => /[0-9٠-٩]/.test(c));
        screens.push({ kind: "drill", title: "مراجعة الأرقام", text: digitDrill(d, 70) });
        screens.push({ kind: "drill", title: "بلا لوحة مفاتيح", text: digitDrill(d, 70), blind: true });
        return screens;
      }
      if (lesson.tashkeel) {
        const marks = known.filter(K.isMark);
        const words = wordPool(lang, new Set(known.filter((c) => !K.isMark(c)).concat([" "])));
        screens.push({ kind: "words", title: "مراجعة التشكيل", text: joinToLength(vowelize(shuffle(words).slice(0, 26), marks), 100) });
        return screens;
      }
      const pool = wordPool(lang, allowed);
      const sent = usable(K.SENTENCES[lang], allowed);
      const recent = lesson.known.slice(-14);
      const drillChars = old.length ? old : recent;
      screens.push({ kind: "drill", title: "مراجعة المفاتيح", text: mixDrill(recent.filter((c) => old.includes(c)), drillChars, 60, letterBase) });
      if (pool.length >= 5) screens.push({ kind: "words", title: "مراجعة الكلمات", text: joinToLength(pool, 90) });
      if (sent.length >= 2) screens.push({ kind: "sentence", title: "جمل", text: joinToLength(sent, 90) });
      else if (pool.length >= 5) screens.push({ kind: "words", title: "كلمات بلا لوحة", text: joinToLength(pool, 70), blind: true });
      if (sent.length >= 2) screens.push({ kind: "sentence", title: "بلا لوحة مفاتيح", text: joinToLength(sent, 70), blind: true });
      return screens;
    }

    if (lesson.kind === "sentences") {
      const sent = usable(K.SENTENCES[lang], allowed);
      const n = lesson.n;
      screens.push({ kind: "sentence", title: "جمل", text: shuffle(sent).slice(0, n).join(" ") });
      screens.push({ kind: "sentence", title: "بلا لوحة مفاتيح", text: shuffle(sent).slice(0, n).join(" "), blind: true });
      return screens;
    }

    if (lesson.kind === "paragraph") {
      const para = usable(K.PARAGRAPHS[lang], allowed);
      screens.push({ kind: "paragraph", title: "نص كامل", text: para[lesson.p % para.length], blind: true });
      return screens;
    }
    return screens;
  };

  // تمرين نقاط الضعف.
  K.buildWeakScreens = function (course, chars) {
    const lang = K.courseLang(course);
    const all = K.buildCourse(course).lessons.filter((l) => l.known).pop().known;
    const allowed = new Set(all.concat([" "]));
    const old = all.filter((c) => !K.isMark(c) && !/[0-9٠-٩]/.test(c));
    const letters = chars.filter((c) => !K.isMark(c));
    const pool = wordPool(lang, allowed);
    const withWeak = pool.filter((w) => letters.some((c) => w.includes(c)));
    const screens = [];
    letters.slice(0, 5).forEach((c) => screens.push({ kind: "intro", ch: c, text: introText(c), title: "ركّز على هذا المفتاح" }));
    screens.push({ kind: "drill", title: "مزج المفاتيح الضعيفة", text: mixDrill(letters, old, 60, old) });
    if (withWeak.length >= 3) screens.push({ kind: "words", title: "كلمات تحوي مفاتيحك الضعيفة", text: joinToLength(withWeak, 110) });
    return screens;
  };

  // نص اختبار السرعة.
  K.buildTestText = function (lang, length) {
    const base = uniq(K.WORDS[lang]).filter((w) => w.length >= 2 && (lang === "en" ? /^[a-z]+$/.test(w) : true));
    return joinToLength(base, length);
  };

  K.isMark = (c) => TASHKEEL.includes(c);
  K.charLabel = (c) => (K.isMark(c) ? "◌" + c : c);
  K.UNITS = UNITS;
})();
