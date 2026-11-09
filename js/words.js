// بنك الكلمات والجمل المستخدم في توليد التمارين.
window.K = window.K || {};

K.WORDS = {
  ar: `
بت نبت بنت بيت بين نبي يبني تين تبني يبيت بني
سن سنن سمين يمين سنين نسي نسيت مني منى ميت بنيت سمي تسمي سميت
مس يمس سيم نسيم تنسي منيب يسمن ستين
شمس شبت مشي تمشي يمشي نشب شيب شيبت شمسي
كم كن بك تك كتب كتبت يكتب تكتب سكت يسكت نكتب كبش كيس منك كمين سكين مسكين سكن يسكن مسكن تسكن يشك نشك بنك بنكي شبك
لا لي ما يا
باب بال بات بان تاب تال سال سام ساب شاب شال شام شاي شاكي ناب نام نال ناس ناي مال مات ماس مان كان كال كاس كتاب كاتب كامل كلام كلب كلبي كل كلي كلها
لبس لبن لمس لسان ليل لين لكن لكم لنا لما لست ليت ليس ليلي
يلبس تلبس بلال بلا بلس سلام سلم سلمي سليم سليمان سامي سالم ساكن سباك سماك سمك اسم اسمي اسمك
ملك مالك ملكي مكان مكتب مكاتب ملابس منا منال ميل ميلان اكتب ابن ابنك ابني
نبات نبيل نسي نملي نمل نام ينام تنام نلبس ناسك نسيان
شباب شباك شمال شامل تمام تمشيت بسام باسم بيان بيتي بيتك بنات بنتي بنتك يتيم يتامى
كمال ماسك كتابي كتابك كتبي مكتبي مكتبك مالي مالك لاسلكي اليابان باكستان لبنان سينما
قلم قلب قمر قبل قول قال قام قريب قليل قديم قوي قرية قرن قصر قصة قطار قوم قلت يقول قمح قميص قبيلة قاعة قاموس قادم قائد
عين عم عمل علم عام عالم عمر عرب عربي عشب عشر عسل عقل علي عليك عند عنب عنك عنه عالي عامل عمان عيد عادل عادة عمارة عمق عدد عرض عطر عظيم عصفور عصير عشاء عاصمة عرف عبد
فيل فم فن فوق في فيه فيها فتح فكر فصل فرس فرح فقط فقير فريق فلم فندق فهم فاكهة فكرة فنان فارس فجر فراش فضل فطور
غيم غني غنم غرب غريب غرفة غدا غير غابة غالي غداء غزال غصن غسل غضب غيث
ثوب ثلج ثلاث ثمن ثمر ثقة ثقيل ثاني ثور ثعلب ثامن ثمانية
هم هو هي هنا هل هذا هذه هناك هدف هدية هاتف هلال هواء هادي هبة هندي
صبر صيف صف صوت صورة صلاة صديق صغير صباح صحيح صحراء صناعة صحة صعب صفر صيام صقر صلح صاحب صنع
خبز خير خط خطاب خال خالد خاتم خيل خيمة خشب خلف خليج خروف خضار خريف خمس خبر خاص خادم خارج
ضيف ضوء ضرب ضمير ضعيف ضخم ضابط ضاحية ضفة ضرورة ضحك
حب حر حق حل حلم حليب حديث حديقة حرب حرف حسن حصان حياة حمد حامد حجر حوت حكمة حكيم حاسوب حال حاضر حافلة حسين حلو حزن حمام
جمل جميل جبل جار جدا جديد جامعة جيش جسر جيب جلس جهاز جواب جوال جدار جريدة جائزة جمعة جنة جنوب جوهر جزيرة جهد
مدينة مدرسة شجرة سيارة طاولة نافذة حديقة شركة مكتبة ساعة سنة سمكة كلمة جملة لغة رحلة فكرة قصة زهرة وردة ليلة بيضة نخلة نجمة دولة قوة صورة عائلة قهوة غرفة طائرة دراسة تجربة خدمة تجارة حركة مجلة
دار درس دين دم دب دفتر دقيقة دواء دجاج دخل دور دائما ديك دولار
ورد ولد وقت وطن وجه وزن واد واحد وزير ودود وسط وادي وعد ورق وجبة وصل وجد ويل
زيت زرع زمن زهر زوج زار زيارة زميل زجاج زينة زبدة زيتون زرافة
ذهب ذكر ذيل ذكي ذلك ذراع ذرة ذوق
طفل طريق طعام طير طالب طبيب طبخ طويل طيب طين طرب طلب طماطم طاقة طبيعة طلاب طائر طازج
ظل ظهر ظرف ظبي ظلام ظلم ظهير ظن
رجل رمل رمان ريح ريال رسم رسالة رأس ركن رقم رياض رياضة راتب رحيم رفيق رحمة رغيف ربيع رخيص رائع
بحر بدر برد برج بعد بعيد بلد بلاد بقرة بحث بذور بطل بطيخ بستان بريد بناء برنامج
تمر تعب تاجر تعلم تعليم تفاح تاريخ تحت ترك تلميذ تقرير تدريب تمرين تركي تونس
نور نار نهر نجم نظر نهار نعم نوم نقل نصر نسر نخل نظيف ناجح نشيط نادر نافع
سوق سفر سفينة سرير سرعة سبب سؤال سعيد سعد سيف سور سمع سهل سريع سماء سحاب سلطان سحر سجل
شهر شعر شرق شارع شجاع شكر شباط شراب شركة شاطئ شريف شيخ شوق شجر
كرسي كرة كبير كريم كثير كيف كوب كف كنز كمية
لون لعب لغة لحم لوح لطيف ليمون لاعب لؤلؤ ليالي
ماء موز مطر محمد مريم مصر مكة مسجد مطعم معلم مفتاح مجلس مدير مشروع مساء مركز موقع مستقبل مريض ممتاز موعد ميناء منزل مطار
ولد يوم يد يوسف يعمل يدرس يحب يجلس يذهب يأكل يشرب يلعب يفتح يسمع يعرف يريد ينظر يرسم يساعد

أب أم أخ أخت أنا أنت أهل أول أخر أسد أرض أرز أسبوع أستاذ أبيض أسود أخضر أحمر أزرق أحمد أمل أمين أمام أكل أكبر أحسن أجمل أفضل أسرة أمس ألم أمير أخبار أرقام أغنية أشجار أقلام أصدقاء أطفال أبواب أيام
إلى إن إذا إبراهيم إسماعيل إنسان إيمان إدارة إجابة إصبع إبرة إمام إسلام إنجاز إجازة إعلان إرادة إكرام
آدم آمن آخر آلة آن آسيا آية آلام آمال آثار آباء
مؤمن رؤية سؤال مسؤول مؤتمر فؤاد لؤلؤ يؤمن مؤلف مؤسسة شؤون رؤوس مؤقت
قائد طائرة مائدة بيئة فئة رئيس سائق نائم صائم جائزة عائلة هادئ شاطئ ذئب بئر لئيم مئة
ماء سماء هواء دواء شتاء مساء عشاء غداء بناء نساء أصدقاء جزء شيء ضوء بدء رداء وفاء صفاء
على إلى حتى مصطفى يحيى موسى عيسى ليلى سلمى منى هدى ندى مستشفى مقهى معنى مبنى كبرى صغرى بشرى سعى رمى مشى
`.trim().split(/\s+/),

  en: `
ad add all as ask dad fad fall flag flash glad gag gas had half hall has hash jag lad lag lash salad sash sad shall shag slag slash
at ate are arm art air aid ear eat era fat far fair fare fear feet fire fit first fast free fresh friend get girl give go good great green had hair hand hard hat have he head hear heart heat help her here high hill him his hit hold home hope hot hour house how
it its idea if in into is jet job join joke joy jug just keep key kid kind king kiss kit knee know lake land large last late laugh law lay lead learn leave left leg let letter life light like line list listen little live long look lose lost lot love low
red ride rise road rock roof room root rose round rule run rush safe said sail salt same sand save say school sea seat see seed sell send set seven shade she ship shop short should show side sight sign since sing sister sit six size skill skin sky sleep slow small smile snow so soft some son song soon sort sound south speak speed spend sport spring stand star start state stay step still stone stop store story street strong study such sugar summer sun sure sweet
take talk tall teach team tell ten test than thank that the their them then there these they thing think this those three through time to today together told tomorrow too took top town tree trip true try turn two under until up us use usual very view visit voice wait walk wall want warm wash watch water wave way we wear week well went were west what wheel when where which while white who whole why wide wife wild will wind window wish with woman wood word work world would write wrong year yes yet you young your
about above across act add after again age ago agree ahead air allow almost alone along already also always among and animal another answer any apple area around arrive
baby back bad bag ball bank base be bear beat beautiful because become bed before begin behind believe below best better between big bird bit black blue board boat body book born both bottom box boy bread break bring brother brown build burn bus busy but buy by
call came camp can car card care carry case cat catch cause center chair change child city class clean clear close cloud coffee cold color come common company complete cook cool corner could country course cover cross cry cup cut
dance dark day dear decide deep desk did different dinner do doctor does dog done door down draw dream dress drink drive drop dry during each early earth easy edge egg eight either else end enough even evening ever every example eye
face fact family farm father feel few field fight fill final find fine finger finish fish five floor flower fly follow food foot for forest forget form forward found four from front fruit full fun future
game garden gave glass gold gone got grass ground group grow guess
happy heavy history hold honey horse huge hundred hungry
ice important inside island jump kitchen knife
ladder language lemon lesson level library lunch machine made main make man many map mark market may me mean meet men middle might mile milk mind minute miss modern moment money month moon more morning most mother mountain mouth move much music must my name near need never new next nice night nine no north not note nothing now number
ocean of off offer office often oil old on once one only open or orange other our out over own page paper parent park part pass past pay people perfect person phone picture piece place plan plant play please point poor possible power present pretty price problem program pull push put
queen question quick quiet quite quiz rain reach read ready real reason remember rest rich right river
`.trim().split(/\s+/),
};

K.SENTENCES = {
  ar: [
    "العلم نور والجهل ظلام", "الصبر مفتاح الفرج", "من جد وجد ومن زرع حصد", "العقل السليم في الجسم السليم",
    "الوقت كالسيف إن لم تقطعه قطعك", "خير الكلام ما قل ودل", "اطلب العلم من المهد إلى اللحد",
    "في التأني السلامة وفي العجلة الندامة", "درهم وقاية خير من قنطار علاج", "الصديق وقت الضيق",
    "لكل مجتهد نصيب", "القناعة كنز لا يفنى", "من سار على الدرب وصل", "الكتاب خير جليس في الزمان",
    "قليل دائم خير من كثير منقطع", "اليد الواحدة لا تصفق", "العقل زينة والأدب جمال",
    "ذهب الولد إلى المدرسة في الصباح", "يقرأ محمد كتابا جديدا كل شهر", "تحب سلمى زراعة الورد في الحديقة",
    "جلس الطلاب في الفصل بهدوء", "شربت كوبا من الشاي بعد العشاء", "يسكن خالد في مدينة الرياض منذ سنوات",
    "سافرت العائلة إلى مكة في الإجازة", "يعمل والدي في شركة كبيرة قرب البحر", "تعلم الطباعة باللمس يوفر عليك وقتا طويلا",
    "ضع أصابعك على الصف الأوسط وانظر إلى الشاشة", "الدقة أولا ثم تأتي السرعة مع الوقت", "تدرب كل يوم ربع ساعة فقط",
    "لا تنظر إلى لوحة المفاتيح أثناء الكتابة", "النخلة شجرة طيبة وثمرها حلو", "طلعت الشمس فوق الجبال البعيدة",
    "هطل المطر غزيرا على الوادي", "القهوة العربية رمز الكرم عند العرب", "زرنا السوق القديم واشترينا التمر والعسل",
    "أحب القراءة قبل النوم كل ليلة", "أين وضعت مفتاح السيارة يا أحمد؟", "هل قرأت الرسالة التي وصلت أمس؟",
    "إن مع العسر يسرا", "أسرع الناس إلى الخير أكرمهم", "ماء البئر بارد في فصل الشتاء",
    "رأيت طائرة كبيرة في سماء المدينة", "يؤدي الموظف عمله بإتقان كل يوم", "سأل المعلم سؤالا سهلا عن الأرقام",
    "كيف حالك اليوم يا صديقي؟", "ما اسم المدينة التي ولدت فيها؟", "إذا أردت النجاح فابدأ الآن",
    "تعد المملكة من أكبر الدول في الجزيرة العربية", "استيقظ مبكرا وابدأ يومك بنشاط", "الرياضة تمنح الجسم قوة وتمنح العقل صفاء",
  ],
  en: [
    "Practice a little every day.", "Keep your eyes on the screen.", "Accuracy comes first and speed follows.",
    "The early bird catches the worm.", "A journey of a thousand miles begins with one step.",
    "Actions speak louder than words.", "Knowledge is power.", "Where there is a will there is a way.",
    "Better late than never.", "Time is the most valuable thing you can spend.", "Reading makes a full mind.",
    "She walked to the market before sunrise.", "The children played in the garden all afternoon.",
    "He opened the window and looked at the rain.", "My brother works at a small company near the sea.",
    "We drank coffee and talked about our plans.", "The train leaves from the old station at noon.",
    "Please send me the report by tomorrow morning.", "I would like a glass of cold water.",
    "Can you help me find the right page?", "What time does the meeting start today?",
    "Where did you put the keys to the car?", "Do you know how to type without looking?",
    "Good habits are built one small step at a time.", "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.", "Every student needs a quiet place to study.",
    "Learning a new language opens many doors.", "Our team finished the project ahead of time.",
    "The mountains were covered with fresh snow.", "A good friend listens more than he speaks.",
    "Do not rush; relax your hands and breathe.", "Rest your fingers on the home row.",
    "It's never too late to learn something new.", "They've moved to a bigger house in the city.",
  ],
};

K.PARAGRAPHS = {
  ar: [
    "الطباعة باللمس مهارة يمكن لكل شخص أن يتعلمها مع قليل من الصبر. تعتمد الفكرة على أن يعرف كل إصبع مكانه على لوحة المفاتيح دون النظر إليها. في البداية تكون الحركة بطيئة، ثم تصبح سهلة مع التدريب اليومي.",
    "تقع الجزيرة العربية في جنوب غرب قارة آسيا، وتحيط بها المياه من ثلاث جهات. تتميز بصحاريها الواسعة وجبالها العالية وسواحلها الطويلة. وقد كانت منذ القدم طريقا مهما للقوافل والتجارة بين الشرق والغرب.",
    "النخلة من أكثر الأشجار فائدة في بلادنا. نأكل ثمرها رطبا وتمرا، ونصنع من سعفها الحصير والسلال، ونستظل بها في حر الصيف. وقد ارتبطت حياة الناس بها منذ زمن بعيد.",
    "القراءة غذاء العقل وزاد الروح. من يقرأ كل يوم صفحات قليلة يجمع في السنة علما كثيرا. اختر كتابا تحبه، وخصص له وقتا ثابتا، وستجد أن القراءة صارت عادة جميلة لا تستغني عنها.",
    "النوم الكافي من أهم أسباب الصحة والنشاط. يحتاج الإنسان البالغ إلى سبع ساعات على الأقل كل ليلة. ومن المفيد أن تبتعد عن الشاشات قبل النوم بساعة، وأن تنام وتستيقظ في وقت ثابت.",
    "إذا أردت أن تتقن أي مهارة فعليك بالتدرب المنتظم. ربع ساعة كل يوم أفضل من ساعتين في آخر الأسبوع. ركز على الدقة أولا، ولا تقلق من الأخطاء، فكل خطأ يعلمك شيئا جديدا.",
  ],
  en: [
    "Touch typing is a skill that anyone can learn with a little patience. The idea is simple: every finger has its own group of keys, and you find them by feel. At first it will seem slow, but your hands will soon remember the way.",
    "The desert looks empty from far away, but it is full of life. Small animals hide from the sun during the day and come out at night. After a rare rain, green plants and tiny flowers cover the sand for a few short weeks.",
    "Coffee has a long history in Arabia. Traders carried the beans across the sea, and cafes soon opened in many cities. People met there to talk, to read, and to share news. Today it is still a sign of welcome in many homes.",
    "A good night of sleep helps you learn. While you rest, your brain sorts what you practiced during the day. That is why short daily lessons work better than one long session at the end of the week.",
    "Good writing is clear and simple. Choose short words when you can, and say one thing in each sentence. Read your work out loud before you send it. If a line sounds strange to your ear, it will seem strange to your reader too.",
    "If you want to get faster, slow down first. Type each letter with the right finger, even when it feels awkward. Speed grows on its own once your hands stop making mistakes, and your new habits will last for years.",
  ],
};
