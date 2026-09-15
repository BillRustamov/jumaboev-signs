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
  skip: string;
  numbersOnly: string;
  confirmTitle: string;
  confirmBody: string;
  yes: string;
  no: string;
  placed: string;
  cancelled: string;
  help: string;
  shopUnreachable: string;
};

export const COPY: Record<Lang, Copy> = {
  en: {
    chooseLanguage: "Choose a language for this order.",
    languageSet: "English selected. Jumaboev Signs prints 24×24 vinyl DOT doors.",
    askUsername: "Create a shop username (3–24 letters, numbers, or _).",
    badUsername: "That username does not work. Use 3–24 letters, numbers, or _.",
    askCompany: "Company name on the door? Example: ELBRUS",
    askLegal: "Legal business name? Example: ELBRUS FREIGHTLINES LLC",
    askDot: "DOT number? Digits only.",
    askMc: "MC number? Digits only.",
    askFleet: "Fleet or unit number? Send it, or tap Skip.",
    askLogo: "Send a logo photo, or tap Skip.",
    skip: "Skip",
    numbersOnly: "Digits only, please.",
    confirmTitle: "Confirm this 24×24 pair:",
    confirmBody:
      "User: {username}\nName: {company}\nLegal: {legal}\nDOT: {dot}\nMC: {mc}\nFleet: {fleet}\nLogo: {logo}",
    yes: "Confirm order",
    no: "Start over",
    placed: "Order {id} received. Khurshid will print two 24×24 vinyl doors.",
    cancelled: "Cleared. Send /start to design again.",
    help: "Send /start to order US DOT door vinyl from Jumaboev Signs.",
    shopUnreachable:
      "Telegram kept the ticket, but the website list was unreachable. Khurshid still has this chat.",
  },
  uz: {
    chooseLanguage: "Buyurtma tili ni tanlang.",
    languageSet: "O‘zbekcha tanlandi. Jumaboev Signs 24×24 vinil DOT eshik yozuvlarini chop etadi.",
    askUsername: "Do‘kon foydalanuvchi nomini yozing (3–24 harf, raqam yoki _).",
    badUsername: "Bu nom mos emas. 3–24 harf, raqam yoki _ yozing.",
    askCompany: "Eshikdagi kompaniya nomi? Masalan: ELBRUS",
    askLegal: "Yuridik nom? Masalan: ELBRUS FREIGHTLINES LLC",
    askDot: "DOT raqami? Faqat raqam.",
    askMc: "MC raqami? Faqat raqam.",
    askFleet: "Avtopark / unit raqami? Yozing yoki O‘tkazish ni bosing.",
    askLogo: "Logo rasmini yuboring yoki O‘tkazish ni bosing.",
    skip: "O‘tkazish",
    numbersOnly: "Faqat raqam yozing.",
    confirmTitle: "Shu 24×24 juftlikni tasdiqlaysizmi:",
    confirmBody:
      "Foydalanuvchi: {username}\nNom: {company}\nYuridik: {legal}\nDOT: {dot}\nMC: {mc}\nAvtopark: {fleet}\nLogo: {logo}",
    yes: "Buyurtmani tasdiqlash",
    no: "Qaytadan",
    placed: "{id} qabul qilindi. Khurshid ikkita 24×24 vinil eshik chop etadi.",
    cancelled: "Tozalandi. Qayta boshlash uchun /start yuboring.",
    help: "Jumaboev Signs dan DOT eshik vinili uchun /start yuboring.",
    shopUnreachable:
      "Telegramda saqlandi, lekin sayt ro‘yxatiga yetib bo‘lmadi. Khurshid shu suhbatni ko‘radi.",
  },
  tg: {
    chooseLanguage: "Забонро барои фармоиш интихоб кунед.",
    languageSet: "Тоҷикӣ интихоб шуд. Jumaboev Signs дарҳои винили DOT 24×24 чоп мекунад.",
    askUsername: "Номи корбар созед (3–24 ҳарф, рақам ё _).",
    badUsername: "Ин ном мувофиқ нест. 3–24 ҳарф, рақам ё _ нависед.",
    askCompany: "Номи ширкат дар дар? Намуна: ELBRUS",
    askLegal: "Номи ҳуқуқӣ? Намуна: ELBRUS FREIGHTLINES LLC",
    askDot: "Рақами DOT? Танҳо рақам.",
    askMc: "Рақами MC? Танҳо рақам.",
    askFleet: "Рақами парк/юнит? Нависед ё Нодида гирифтанро пахш кунед.",
    askLogo: "Акси логоро фиристед ё Нодида гирифтанро пахш кунед.",
    skip: "Нодида гирифтан",
    numbersOnly: "Лутфан танҳо рақам.",
    confirmTitle: "Ин ҷуфти 24×24-ро тасдиқ мекунед:",
    confirmBody:
      "Корбар: {username}\nНом: {company}\nҲуқуқӣ: {legal}\nDOT: {dot}\nMC: {mc}\nПарк: {fleet}\nЛого: {logo}",
    yes: "Тасдиқи фармоиш",
    no: "Аз нав",
    placed: "Фармоиши {id} қабул шуд. Хуршид ду дарҳои винили 24×24 чоп мекунад.",
    cancelled: "Пок шуд. Барои аз нав /start фиристед.",
    help: "Барои фармоиши винили дар /start фиристед.",
    shopUnreachable:
      "Дар Telegram монд, аммо рӯйхати сайт дастнорас буд. Хуршид ҳамин чатро мебинад.",
  },
  ru: {
    chooseLanguage: "Выберите язык для заказа.",
    languageSet: "Русский выбран. Jumaboev Signs печатает виниловые DOT-двери 24×24.",
    askUsername: "Придумайте имя в магазине (3–24 буквы, цифры или _).",
    badUsername: "Так нельзя. 3–24 буквы, цифры или _.",
    askCompany: "Название на двери? Пример: ELBRUS",
    askLegal: "Юридическое название? Пример: ELBRUS FREIGHTLINES LLC",
    askDot: "Номер DOT? Только цифры.",
    askMc: "Номер MC? Только цифры.",
    askFleet: "Номер парка / борта? Напишите или нажмите Пропустить.",
    askLogo: "Пришлите фото логотипа или нажмите Пропустить.",
    skip: "Пропустить",
    numbersOnly: "Только цифры.",
    confirmTitle: "Подтвердите пару 24×24:",
    confirmBody:
      "Пользователь: {username}\nИмя: {company}\nЮр. имя: {legal}\nDOT: {dot}\nMC: {mc}\nПарк: {fleet}\nЛого: {logo}",
    yes: "Подтвердить заказ",
    no: "Начать заново",
    placed: "Заказ {id} принят. Хуршид напечатает две виниловые двери 24×24.",
    cancelled: "Сброшено. Отправьте /start, чтобы начать снова.",
    help: "Отправьте /start, чтобы заказать DOT-виниль у Jumaboev Signs.",
    shopUnreachable:
      "Заявка осталась в Telegram, список на сайте недоступен. Хуршид видит этот чат.",
  },
  kk: {
    chooseLanguage: "Тапсырыс тілін таңдаңыз.",
    languageSet: "Қазақша таңдалды. Jumaboev Signs 24×24 винил DOT есіктерін басады.",
    askUsername: "Дүкен пайдаланушы атын жазыңыз (3–24 әріп, сан немесе _).",
    badUsername: "Бұл ат жарамайды. 3–24 әріп, сан немесе _ жазыңыз.",
    askCompany: "Есіктегі компания атауы? Мысалы: ELBRUS",
    askLegal: "Заңды атауы? Мысалы: ELBRUS FREIGHTLINES LLC",
    askDot: "DOT нөмірі? Тек цифр.",
    askMc: "MC нөмірі? Тек цифр.",
    askFleet: "Автопарк / борт нөмірі? Жазыңыз немесе Өткізуді басыңыз.",
    askLogo: "Логотип суретін жіберіңіз немесе Өткізуді басыңыз.",
    skip: "Өткізу",
    numbersOnly: "Тек цифр жазыңыз.",
    confirmTitle: "Осы 24×24 жұпты растаңыз:",
    confirmBody:
      "Пайдаланушы: {username}\nАтауы: {company}\nЗаңды: {legal}\nDOT: {dot}\nMC: {mc}\nПарк: {fleet}\nЛого: {logo}",
    yes: "Тапсырысты растау",
    no: "Қайта бастау",
    placed: "{id} қабылданды. Хуршид екі 24×24 винил есік басады.",
    cancelled: "Тазартылды. Қайта бастау үшін /start жіберіңіз.",
    help: "DOT есік винилі үшін /start жіберіңіз.",
    shopUnreachable:
      "Telegram-да сақталды, сайт тізімі қолжетімсіз. Хуршид осы чатты көреді.",
  },
  ky: {
    chooseLanguage: "Заказ үчүн тилди тандаңыз.",
    languageSet: "Кыргызча тандалды. Jumaboev Signs 24×24 винил DOT эшиктерин басат.",
    askUsername: "Дүкөн колдонуучу атын жазыңыз (3–24 тамга, сан же _).",
    badUsername: "Бул ат туура эмес. 3–24 тамга, сан же _ жазыңыз.",
    askCompany: "Эшиктеги компаниянын аты? Мисалы: ELBRUS",
    askLegal: "Юридикалык аталышы? Мисалы: ELBRUS FREIGHTLINES LLC",
    askDot: "DOT номери? Сандар гана.",
    askMc: "MC номери? Сандар гана.",
    askFleet: "Автопарк / борт номери? Жазыңыз же Өткөрүүнү басыңыз.",
    askLogo: "Логотип сүрөтүн жибериңиз же Өткөрүүнү басыңыз.",
    skip: "Өткөрүү",
    numbersOnly: "Сандар гана жазыңыз.",
    confirmTitle: "Бул 24×24 жупту ырастаңыз:",
    confirmBody:
      "Колдонуучу: {username}\nАты: {company}\nЮрид.: {legal}\nDOT: {dot}\nMC: {mc}\nПарк: {fleet}\nЛого: {logo}",
    yes: "Заказды ырастоо",
    no: "Кайра баштоо",
    placed: "{id} кабыл алынды. Хуршид эки 24×24 винил эшик басат.",
    cancelled: "Тазаланды. Кайра баштоо үчүн /start жибериңиз.",
    help: "DOT эшик винили үчүн /start жибериңиз.",
    shopUnreachable:
      "Telegramда сакталды, сайттын тизмеси жеткиликсиз. Хуршид бул чатты көрөт.",
  },
  uk: {
    chooseLanguage: "Оберіть мову для замовлення.",
    languageSet: "Українську вибрано. Jumaboev Signs друкує вінілові DOT-двері 24×24.",
    askUsername: "Придумайте ім’я в майстерні (3–24 літери, цифри або _).",
    badUsername: "Так не можна. 3–24 літери, цифри або _.",
    askCompany: "Назва на дверях? Приклад: ELBRUS",
    askLegal: "Юридична назва? Приклад: ELBRUS FREIGHTLINES LLC",
    askDot: "Номер DOT? Лише цифри.",
    askMc: "Номер MC? Лише цифри.",
    askFleet: "Номер парку / борту? Надішліть або натисніть Пропустити.",
    askLogo: "Надішліть фото логотипа або натисніть Пропустити.",
    skip: "Пропустити",
    numbersOnly: "Лише цифри.",
    confirmTitle: "Підтвердіть пару 24×24:",
    confirmBody:
      "Користувач: {username}\nНазва: {company}\nЮр. назва: {legal}\nDOT: {dot}\nMC: {mc}\nПарк: {fleet}\nЛого: {logo}",
    yes: "Підтвердити замовлення",
    no: "Почати знову",
    placed: "Замовлення {id} прийнято. Хуршид надрукує дві вінілові двері 24×24.",
    cancelled: "Скинуто. Надішліть /start, щоб почати знову.",
    help: "Надішліть /start, щоб замовити DOT-вініл у Jumaboev Signs.",
    shopUnreachable:
      "Заявку збережено в Telegram, список на сайті недоступний. Хуршид бачить цей чат.",
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
