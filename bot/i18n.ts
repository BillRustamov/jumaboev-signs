export const LANGS = ["en", "uz", "tg", "ru", "kk", "ky", "uk"] as const;

export type Lang = (typeof LANGS)[number];

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  uz: "O‘zbekcha",
  tg: "Тоҷикӣ",
  ru: "Русский",
  kk: "Қазақша",
  ky: "Кыргызча",
  uk: "Українська",
};

type Copy = {
  chooseLanguage: string;
  languageSet: string;
  askUsername: string;
  badUsername: string;
  askCompany: string;
  askLegal: string;
  askDot: string;
  askMc: string;
  askFleet: string;
  askLogo: string;
  gotLogo: string;
  badLogo: string;
  logoWrongStep: string;
  askStyle: string;
  askStylePhotos: string;
  skip: string;
  numbersOnly: string;
  confirmTitle: string;
  confirmBody: string;
  yes: string;
  no: string;
  placed: string;
  shopPosted: string;
  cancelled: string;
  help: string;
  shopUnreachable: string;
};

export const COPY: Record<Lang, Copy> = {
  en: {
    chooseLanguage:
      "Jumaboev Signs\nUSDOT truck door vinyl\n\nEach pair is about 10×20 in for each side of the cab — left and right match. MCS-150 name and USDOT required. MC and logo optional. Unit numbers are a separate small print.\n\nChoose a language:",
    languageSet:
      "English selected. Jumaboev Signs prints vinyl DOT doors, about 10×20 in for each cab side.",
    askUsername: "Create a shop username (3–24 letters, numbers, or _).",
    badUsername: "That username does not work. Use 3–24 letters, numbers, or _.",
    askCompany: "Door name as on MCS-150 (legal or one trade name)? Example: ELBRUS",
    askLegal: "Second line if you also print the LLC name? Send it, or tap Skip.",
    askDot: "USDOT number? Digits only. Prints as USDOT plus the number.",
    askMc: "MC number? Optional — FMCSA does not require it. Send digits or tap Skip.",
    askFleet: "Fleet or unit number? Send it, or tap Skip.",
    askLogo: "Send a logo photo or PNG file, or tap Skip.",
    gotLogo:
      "Got the logo. Building four looks on a white cab — tap a color after the photos.",
    badLogo:
      "That file is not an image I can print. Send a PNG, JPEG, or WebP, or tap Skip.",
    logoWrongStep:
      "Attach the logo when I ask for it. Send /start, then send the PNG at the logo step.",
    askStyle:
      "Tap a look. Photos above are that color on a white cab — same mockup as the cart.",
    askStylePhotos:
      "Here are four looks on a white sleeper cab — same truck as the cart. Your name and USDOT are on the door. Tap a color after the photos.",
    skip: "Skip",
    numbersOnly: "Digits only, please.",
    confirmTitle: "Review this pair",
    confirmBody:
      "Size: ~10×20 in each cab side (left + right)\nShop user: {username}\nDoor name: {company}\nSecond line: {legal}\nUSDOT: {dot}\nMC: {mc}\nLogo: {logo}\nColors: {style}",
    yes: "✅ Confirm order",
    no: "↺ Start over",
    placed:
      "Order {id} received. Khurshid will print two vinyl doors, about 10×20 in for each cab side.",
    shopPosted: "The ticket is on the shop print desk.",
    cancelled: "Cleared. Send /start to design again.",
    help: "Jumaboev Signs prints USDOT door vinyl, about 10×20 in each cab side.\n\nSend /start to order. Pick a language, then your door name, USDOT, optional MC and logo, and a color set. Confirm to send the ticket to the shop.",
    shopUnreachable:
      "Telegram kept the ticket, but the website list was unreachable. Keep the shop site running, then send /start and confirm again.",
  },
  uz: {
    chooseLanguage:
      "Jumaboev Signs\nUSDOT kabina vinili\n\nHar bir juftlik kabinaning har tomoni uchun taxminan 10×20 dyuym. Chap va o‘ng mos. /start dan keyin tilni tanlang.",
    languageSet:
      "O‘zbekcha tanlandi. Jumaboev Signs har bir kabina tomoni uchun taxminan 10×20 dyuym vinil DOT eshik chop etadi.",
    askUsername: "Do‘kon foydalanuvchi nomini yozing (3–24 harf, raqam yoki _).",
    badUsername: "Bu nom mos emas. 3–24 harf, raqam yoki _ yozing.",
    askCompany: "Eshikdagi kompaniya nomi? Masalan: ELBRUS",
    askLegal: "Yuridik nom? Masalan: ELBRUS FREIGHTLINES LLC",
    askDot: "DOT raqami? Faqat raqam.",
    askMc: "MC raqami? Faqat raqam. O‘tkazish deb yozishingiz mumkin.",
    askFleet: "Avtopark / unit raqami? Yozing yoki O‘tkazish ni bosing.",
    askLogo: "Logo rasmini yoki PNG faylni yuboring, yoki O‘tkazish ni bosing.",
    gotLogo: "Logo qabul qilindi. Oq kabinada to‘rtta ko‘rinish tayyorlanmoqda.",
    badLogo: "Bu rasm emas. PNG, JPEG yoki WebP yuboring, yoki O‘tkazish ni bosing.",
    logoWrongStep: "Logo so‘ralganda yuboring. /start yuboring, keyin PNG ni logo qadamida yuboring.",
    askStyle: "Rangni tanlang. Yuqoridagi suratlar — o‘sha rang oq kabinada, savatchadagi kabi.",
    askStylePhotos:
      "To‘rtta rang oq kabinada. Savatchadagi yuk mashinasi. Suratdan keyin nomini bosing.",
    skip: "O‘tkazish",
    numbersOnly: "Faqat raqam yozing.",
    confirmTitle: "Shu juftlikni tasdiqlaysizmi (~10×20 har tomon):",
    confirmBody:
      "Foydalanuvchi: {username}\nNom: {company}\nYuridik: {legal}\nUSDOT: {dot}\nMC: {mc}\nLogo: {logo}\nRang: {style}",
    yes: "✅ Buyurtmani tasdiqlash",
    no: "↺ Qaytadan",
    placed:
      "{id} qabul qilindi. Khurshid har tomon uchun taxminan 10×20 vinil eshik chop etadi.",
    shopPosted: "Chipta do‘kon chop etish stolida.",
    cancelled: "Tozalandi. Qayta boshlash uchun /start yuboring.",
    help: "Jumaboev Signs dan DOT eshik vinili uchun /start yuboring.",
    shopUnreachable:
      "Telegramda saqlandi, lekin sayt ro‘yxatiga yetib bo‘lmadi. Saytni ishga tushirib, qayta tasdiqlang.",
  },
  tg: {
    chooseLanguage:
      "Jumaboev Signs\nВинили дари USDOT\n\nҲар ҷуфт тақрибан 10×20 дюйм барои ҳар тарафи кабина. Чап ва рост мувофиқанд.\n\nЗабонро интихоб кунед:",
    languageSet:
      "Тоҷикӣ интихоб шуд. Jumaboev Signs дарҳои винили DOT тақрибан 10×20 дюйм барои ҳар тарафи кабина чоп мекунад.",
    askUsername: "Номи корбар созед (3–24 ҳарф, рақам ё _).",
    badUsername: "Ин ном мувофиқ нест. 3–24 ҳарф, рақам ё _ нависед.",
    askCompany: "Номи ширкат дар дар? Намуна: ELBRUS",
    askLegal: "Номи ҳуқуқӣ? Намуна: ELBRUS FREIGHTLINES LLC",
    askDot: "Рақами DOT? Танҳо рақам.",
    askMc: "Рақами MC? Танҳо рақам ё Нодида гирифтан.",
    askFleet: "Рақами парк/юнит? Нависед ё Нодида гирифтанро пахш кунед.",
    askLogo: "Акси лого ё файли PNG-ро фиристед, ё Нодида гирифтанро пахш кунед.",
    gotLogo: "Лого қабул шуд. Чор намуд дар кабинаи сафед тайёр мешавад.",
    badLogo: "Ин тасвир нест. PNG, JPEG ё WebP фиристед, ё Нодида гирифтанро пахш кунед.",
    logoWrongStep: "Логоро вақте ки мепурсам фиристед. /start фиристед, баъд PNG-ро дар қадами лого фиристед.",
    askStyle: "Рангро интихоб кунед. Аксҳои боло ҳамон ранг дар кабинаи сафед аст.",
    askStylePhotos:
      "Чор намуд дар кабинаи сафед — мисли сабад. Пас аз акс номро пахш кунед.",
    skip: "Нодида гирифтан",
    numbersOnly: "Лутфан танҳо рақам.",
    confirmTitle: "Ин ҷуфтро тасдиқ мекунед (~10×20 ҳар тараф):",
    confirmBody:
      "Корбар: {username}\nНом: {company}\nҲуқуқӣ: {legal}\nUSDOT: {dot}\nMC: {mc}\nЛого: {logo}\nРанг: {style}",
    yes: "✅ Тасдиқи фармоиш",
    no: "↺ Аз нав",
    placed:
      "Фармоиши {id} қабул шуд. Хуршид ду дарҳои винилӣ, тақрибан 10×20 барои ҳар тараф, чоп мекунад.",
    shopPosted: "Чипта дар мизи чопи дӯкон аст.",
    cancelled: "Пок шуд. Барои аз нав /start фиристед.",
    help: "Барои фармоиши винили дар /start фиристед.",
    shopUnreachable:
      "Дар Telegram монд, аммо рӯйхати сайт дастнорас буд. Сайтро кушоед ва дубора тасдиқ кунед.",
  },
  ru: {
    chooseLanguage:
      "Jumaboev Signs\nВиниловые USDOT-двери\n\nКаждая пара — около 10×20 дюймов на сторону кабины, левая и правая совпадают.\n\nВыберите язык:",
    languageSet:
      "Русский выбран. Jumaboev Signs печатает виниловые DOT-двери около 10×20 дюймов на каждую сторону кабины.",
    askUsername: "Придумайте имя в магазине (3–24 буквы, цифры или _).",
    badUsername: "Так нельзя. 3–24 буквы, цифры или _.",
    askCompany: "Название на двери? Пример: ELBRUS",
    askLegal: "Юридическое название? Пример: ELBRUS FREIGHTLINES LLC",
    askDot: "Номер DOT? Только цифры.",
    askMc: "Номер MC? Только цифры, или напишите Пропустить.",
    askFleet: "Номер парка / борта? Напишите или нажмите Пропустить.",
    askLogo: "Пришлите фото логотипа или PNG-файл, или нажмите Пропустить.",
    gotLogo: "Логотип получен. Готовлю четыре вида на белой кабине.",
    badLogo: "Это не картинка. Пришлите PNG, JPEG или WebP, или нажмите Пропустить.",
    logoWrongStep: "Пришлите логотип, когда я его попрошу. Отправьте /start, затем PNG на шаге логотипа.",
    askStyle: "Выберите цвет. Фото выше — этот набор на белой кабине, как в корзине.",
    askStylePhotos:
      "Четыре вида на белой кабине — тот же грузовик, что в корзине. После фото нажмите название.",
    skip: "Пропустить",
    numbersOnly: "Только цифры.",
    confirmTitle: "Подтвердите пару (~10×20 на каждую сторону кабины):",
    confirmBody:
      "Пользователь: {username}\nИмя: {company}\nЮр. имя: {legal}\nUSDOT: {dot}\nMC: {mc}\nЛого: {logo}\nЦвета: {style}",
    yes: "✅ Подтвердить заказ",
    no: "↺ Начать заново",
    placed:
      "Заказ {id} принят. Хуршид напечатает две виниловые двери, около 10×20 на каждую сторону кабины.",
    shopPosted: "Заявка на печатном столе мастерской.",
    cancelled: "Сброшено. Отправьте /start, чтобы начать снова.",
    help: "Отправьте /start, чтобы заказать DOT-виниль у Jumaboev Signs.",
    shopUnreachable:
      "Заявка осталась в Telegram, список на сайте недоступен. Запустите сайт и подтвердите снова.",
  },
  kk: {
    chooseLanguage:
      "Jumaboev Signs\nUSDOT винил есік\n\nӘр жұп кабинаның әр жағына шамамен 10×20. Сол және оң сәйкес.\n\nТілді таңдаңыз:",
    languageSet:
      "Қазақша таңдалды. Jumaboev Signs кабинаның әр жағына шамамен 10×20 винил DOT есік басады.",
    askUsername: "Дүкен пайдаланушы атын жазыңыз (3–24 әріп, сан немесе _).",
    badUsername: "Бұл ат жарамайды. 3–24 әріп, сан немесе _ жазыңыз.",
    askCompany: "Есіктегі компания атауы? Мысалы: ELBRUS",
    askLegal: "Заңды атауы? Мысалы: ELBRUS FREIGHTLINES LLC",
    askDot: "DOT нөмірі? Тек цифр.",
    askMc: "MC нөмірі? Тек цифр немесе Өткізу деп жазыңыз.",
    askFleet: "Автопарк / борт нөмірі? Жазыңыз немесе Өткізуді басыңыз.",
    askLogo: "Логотип суретін немесе PNG файлды жіберіңіз, немесе Өткізуді басыңыз.",
    gotLogo: "Логотип қабылданды. Ақ кабинадағы төрт көрініс дайындалуда.",
    badLogo: "Бұл сурет емес. PNG, JPEG немесе WebP жіберіңіз, немесе Өткізуді басыңыз.",
    logoWrongStep: "Логотипті сұрағанда жіберіңіз. /start жіберіңіз, содан кейін PNG-ны логотип қадамында жіберіңіз.",
    askStyle: "Түсті таңдаңыз. Жоғарыдағы сурет — сол түс ақ кабинада, себеттегідей.",
    askStylePhotos:
      "Ақ кабинадағы төрт түс — себеттегі жүк көлігі. Суреттен кейін атауын басыңыз.",
    skip: "Өткізу",
    numbersOnly: "Тек цифр жазыңыз.",
    confirmTitle: "Осы жұпты растаңыз (~10×20 әр жақ):",
    confirmBody:
      "Пайдаланушы: {username}\nАтауы: {company}\nЗаңды: {legal}\nUSDOT: {dot}\nMC: {mc}\nЛого: {logo}\nТүс: {style}",
    yes: "✅ Тапсырысты растау",
    no: "↺ Қайта бастау",
    placed:
      "{id} қабылданды. Хуршид екі винил есік басады, әр кабина жағына шамамен 10×20.",
    shopPosted: "Билет дүкеннің басып шығару үстелінде.",
    cancelled: "Тазартылды. Қайта бастау үшін /start жіберіңіз.",
    help: "DOT есік винилі үшін /start жіберіңіз.",
    shopUnreachable:
      "Telegram-да сақталды, сайт тізімі қолжетімсіз. Сайтты іске қосып, қайта растаңыз.",
  },
  ky: {
    chooseLanguage:
      "Jumaboev Signs\nUSDOT винил эшик\n\nАр бир жуп кабинанын ар тарабына болжол менен 10×20. Сол жана оң дал келет.\n\nТилди тандаңыз:",
    languageSet:
      "Кыргызча тандалды. Jumaboev Signs кабинанын ар бир тарабына болжол менен 10×20 винил DOT эшик басат.",
    askUsername: "Дүкөн колдонуучу атын жазыңыз (3–24 тамга, сан же _).",
    badUsername: "Бул ат туура эмес. 3–24 тамга, сан же _ жазыңыз.",
    askCompany: "Эшиктеги компаниянын аты? Мисалы: ELBRUS",
    askLegal: "Юридикалык аталышы? Мисалы: ELBRUS FREIGHTLINES LLC",
    askDot: "DOT номери? Сандар гана.",
    askMc: "MC номери? Сандар гана же Өткөрүү деп жазыңыз.",
    askFleet: "Автопарк / борт номери? Жазыңыз же Өткөрүүнү басыңыз.",
    askLogo: "Логотип сүрөтүн же PNG файлды жибериңиз, же Өткөрүүнү басыңыз.",
    gotLogo: "Логотип кабыл алынды. Ак кабинадагы төрт көрүнүш даярдалууда.",
    badLogo: "Бул сүрөт эмес. PNG, JPEG же WebP жибериңиз, же Өткөрүүнү басыңыз.",
    logoWrongStep: "Логотипти сураганда жибериңиз. /start жибериңиз, андан кийин PNG'ни логотип кадамында жибериңиз.",
    askStyle: "Түстү тандаңыз. Жогорку сүрөт — ошол түс ак кабинада, себеттегидей.",
    askStylePhotos:
      "Ак кабинадагы төрт көрүнүш — себеттеги жүк ташуучу. Сүрөттөн кийин атын басыңыз.",
    skip: "Өткөрүү",
    numbersOnly: "Сандар гана жазыңыз.",
    confirmTitle: "Бул жупту ырастаңыз (~10×20 ар тарап):",
    confirmBody:
      "Колдонуучу: {username}\nАты: {company}\nЮрид.: {legal}\nUSDOT: {dot}\nMC: {mc}\nЛого: {logo}\nТүс: {style}",
    yes: "✅ Заказды ырастоо",
    no: "↺ Кайра баштоо",
    placed:
      "{id} кабыл алынды. Хуршид эки винил эшик басат, ар кабина тарабына болжол менен 10×20.",
    shopPosted: "Билет дүкөндүн басып чыгаруу столунда.",
    cancelled: "Тазаланды. Кайра баштоо үчүн /start жибериңиз.",
    help: "DOT эшик винили үчүн /start жибериңиз.",
    shopUnreachable:
      "Telegramда сакталды, сайттын тизмеси жеткиликсиз. Сайтты иштетип, кайра ырастаңыз.",
  },
  uk: {
    chooseLanguage:
      "Jumaboev Signs\nВінілові USDOT-двері\n\nКожна пара — близько 10×20 дюймів на бік кабіни, ліва і права збігаються.\n\nОберіть мову:",
    languageSet:
      "Українську вибрано. Jumaboev Signs друкує вінілові DOT-двері близько 10×20 дюймів на кожен бік кабіни.",
    askUsername: "Придумайте ім’я в майстерні (3–24 літери, цифри або _).",
    badUsername: "Так не можна. 3–24 літери, цифри або _.",
    askCompany: "Назва на дверях? Приклад: ELBRUS",
    askLegal: "Юридична назва? Приклад: ELBRUS FREIGHTLINES LLC",
    askDot: "Номер DOT? Лише цифри.",
    askMc: "Номер MC? Лише цифри, або напишіть Пропустити.",
    askFleet: "Номер парку / борту? Надішліть або натисніть Пропустити.",
    askLogo: "Надішліть фото логотипа або PNG-файл, або натисніть Пропустити.",
    gotLogo: "Логотип отримано. Готую чотири вигляди на білій кабіні.",
    badLogo: "Це не зображення. Надішліть PNG, JPEG або WebP, або натисніть Пропустити.",
    logoWrongStep:
      "Надішліть логотип, коли я його попрошу. Надішліть /start, потім PNG на кроці логотипа.",
    askStyle: "Оберіть колір. Фото вище — цей набір на білій кабіні, як у кошику.",
    askStylePhotos:
      "Чотири вигляди на білій кабіні — та сама вантажівка, що в кошику. Після фото натисніть назву.",
    skip: "Пропустити",
    numbersOnly: "Лише цифри.",
    confirmTitle: "Підтвердіть пару (~10×20 на кожен бік кабіни):",
    confirmBody:
      "Користувач: {username}\nНазва: {company}\nЮр. назва: {legal}\nUSDOT: {dot}\nMC: {mc}\nЛого: {logo}\nКолір: {style}",
    yes: "✅ Підтвердити замовлення",
    no: "↺ Почати знову",
    placed:
      "Замовлення {id} прийнято. Хуршид надрукує дві вінілові двері, близько 10×20 на кожен бік кабіни.",
    shopPosted: "Заявку додано на друкарський стіл майстерні.",
    cancelled: "Скинуто. Надішліть /start, щоб почати знову.",
    help: "Надішліть /start, щоб замовити DOT-вініл у Jumaboev Signs.",
    shopUnreachable:
      "Заявку збережено в Telegram, список на сайті недоступний. Запустіть сайт і підтвердіть знову.",
  },
};

export function t(
  lang: Lang,
  key: keyof Copy,
  vars?: Record<string, string>,
): string {
  let text = COPY[lang][key];
  if (!vars) return text;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, value);
  }
  return text;
}

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

export function isSkipText(text: string, lang: Lang): boolean {
  const n = text.trim().toLowerCase();
  if (!n) return false;
  if (n === "skip" || n === "/skip") return true;
  return n === t(lang, "skip").toLowerCase();
}
