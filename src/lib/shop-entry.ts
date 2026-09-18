export const LANGS = ["en", "uz", "tg", "ru", "kk", "ky", "uk"] as const;
export type ShopLang = (typeof LANGS)[number];

export const LANG_LABELS: Record<ShopLang, string> = {
  en: "English",
  uz: "O‘zbekcha",
  tg: "Тоҷикӣ",
  ru: "Русский",
  kk: "Қазақша",
  ky: "Кыргызча",
  uk: "Українська",
};

export type ShopEntryKey =
  | "howCanWeHelp"
  | "lead"
  | "printExisting"
  | "printExistingHint"
  | "createDesign"
  | "createDesignHint"
  | "myOrders"
  | "contactShop"
  | "language"
  | "contactBody"
  | "ordersBody"
  | "printOnlyAsk"
  | "printOnlyGot"
  | "printOnlyBad"
  | "printOnlyExact"
  | "printOnlyNotes"
  | "printOnlyConfirm"
  | "printOnlyPlaced"
  | "printOnlySize"
  | "chooseLanguage"
  | "languageSet"
  | "menuAgain"
  | "helpMenu"
  | "printOnlyTitle"
  | "printOnlyDrop"
  | "printOnlyNeedFile"
  | "printOnlyNeedContact"
  | "printOnlySubmit"
  | "printOnlyWorking"
  | "printOnlyError"
  | "printExactMode"
  | "printNotesMode"
  | "printOnlyUsername"
  | "printOnlyReplace"
  | "backToMenu"
  | "samplesNav"
  | "createNav"
  | "printNav"
  | "contactTitle";

type EntryCopy = Record<ShopEntryKey, string>;

export const SHOP_ENTRY: Record<ShopLang, EntryCopy> = {
  en: {
    howCanWeHelp: "How can we help you today?",
    lead: "Jumaboev Signs prints a matched 20 × 12 in pair for each cab side. Pick a service — you do not type commands.",
    printExisting: "I already have a design",
    printExistingHint:
      "Upload your PDF, SVG, PNG, JPEG, or WebP. We print it at 20 × 12 in. No designer wizard.",
    createDesign: "Create a new design",
    createDesignHint:
      "Build USDOT door vinyl here: name, city and state, USDOT, MC, optional logo, then preview.",
    myOrders: "My orders",
    contactShop: "Contact the shop",
    language: "Language",
    contactBody:
      "Khurshid Jumaboev prints the vinyl. Questions about size, pickup, or a ticket stay in this Telegram chat, or open the website counter.",
    ordersBody:
      "Tickets from this Telegram chat, with production and payment from the shop store. Paid only after Stripe confirms — never guessed.",
    printOnlyAsk:
      "Send the artwork file now — PDF, SVG, PNG, JPEG, or WebP. Company name is not needed before the file. We print a 20 × 12 in pair (left and right).",
    printOnlyGot:
      "Got the file. Default is 20 × 12 in, one pair. Tap Print exactly as sent, or send a short note if something must change (needs review — flattened type is not editable).",
    printOnlyBad:
      "That file is not a print file I can keep. Send a PDF, SVG, PNG, JPEG, or WebP (under 8 MB).",
    printOnlyExact: "Print exactly as sent",
    printOnlyNotes: "I have a short note",
    printOnlyConfirm: "File: {file}\nSize: 20 × 12 in · 1 pair (left + right)\n{mode}",
    printOnlyPlaced:
      "Ticket {id} received as print-existing. Khurshid will review the original file for a 20 × 12 in pair.",
    printOnlySize: "20 × 12 in each side · 1 pair",
    chooseLanguage: "Choose a language. The shop menu stays on screen.",
    languageSet: "Language set.",
    menuAgain: "How can we help you today?",
    helpMenu:
      "Jumaboev Signs prints USDOT door vinyl, 20 × 12 in each cab side.\n\nTap I already have a design to send a file, or Create a new design to build one here. Use My orders or Contact the shop anytime. The Start button on Telegram opens this menu — you do not type commands.",
    printOnlyTitle: "Print a file you already have",
    printOnlyDrop:
      "Drop a PDF, SVG, PNG, JPEG, or WebP here — or choose a file. We keep the original and do not run it. Default size is 20 × 12 in, one pair.",
    printOnlyNeedFile: "Add a print file before the ticket.",
    printOnlyNeedContact: "Add a shop username so Khurshid can find this ticket.",
    printOnlySubmit: "Send the print ticket",
    printOnlyWorking: "Sending the file to the print desk…",
    printOnlyError: "The shop list did not take that ticket. Keep the file and try again.",
    printExactMode: "Print exactly as sent",
    printNotesMode: "Change note: {notes}",
    printOnlyUsername: "Shop username (3–24 letters, numbers, or _)",
    printOnlyReplace: "Replace file",
    backToMenu: "Shop menu",
    samplesNav: "Samples",
    createNav: "Create a design",
    printNav: "Print a file",
    contactTitle: "Contact the shop",
  },
  uz: {
    howCanWeHelp: "Bugun qanday yordam beraylik?",
    lead: "Jumaboev Signs har bir kabina tomoni uchun 20 × 12 dyuym juftlik chop etadi. Xizmatni bosing — buyruq yozmang.",
    printExisting: "Menda tayyor dizayn bor",
    printExistingHint:
      "PDF, SVG, PNG, JPEG yoki WebP yuboring. 20 × 12 dyuymda chop etamiz. Dizayner yo‘q.",
    createDesign: "Yangi dizayn yaratish",
    createDesignHint:
      "USDOT eshik vinilini shu yerda yarating: nom, shahar va shtat, USDOT, MC, ixtiyoriy logo.",
    myOrders: "Buyurtmalarim",
    contactShop: "Do‘kon bilan bog‘lanish",
    language: "Til",
    contactBody:
      "Vinilni Khurshid Jumaboev chop etadi. O‘lcham, olib ketish yoki chipta shu Telegram chatda yoki saytda.",
    ordersBody:
      "Shu Telegram chat chiptalari — ishlab chiqarish va to‘lov do‘kon omboridan. To‘langan faqat Stripe tasdiqlagach, taxmin emas.",
    printOnlyAsk:
      "Hozir faylni yuboring — PDF, SVG, PNG, JPEG yoki WebP. Fayldan oldin kompaniya nomi shart emas. 20 × 12 juftlik chop etamiz.",
    printOnlyGot:
      "Fayl qabul qilindi. Standart: 20 × 12, bitta juft. Aynan shu holda chop etishni bosing yoki qisqa izoh yozing.",
    printOnlyBad:
      "Bu chop fayli emas. PDF, SVG, PNG, JPEG yoki WebP yuboring (8 MB gacha).",
    printOnlyExact: "Aynan shu holda chop eting",
    printOnlyNotes: "Qisqa izohim bor",
    printOnlyConfirm:
      "Fayl: {file}\nO‘lcham: 20 × 12 dyuym · 1 juft (chap + o‘ng)\n{mode}",
    printOnlyPlaced:
      "{id} chiptasi tayyor dizayn sifatida qabul qilindi. Khurshid asl faylni 20 × 12 juftlik uchun ko‘radi.",
    printOnlySize: "Har tomon 20 × 12 dyuym · 1 juft",
    chooseLanguage: "Tilni tanlang. Menyu ochiq qoladi.",
    languageSet: "Til tanlandi.",
    menuAgain: "Bugun qanday yordam beraylik?",
    helpMenu:
      "Jumaboev Signs USDOT eshik vinilini chop etadi, har tomon 20 × 12.\n\nTayyor dizayn yoki Yangi dizayn ni bosing. Buyruq yozmang.",
    printOnlyTitle: "Tayyor faylni chop etish",
    printOnlyDrop:
      "PDF, SVG, PNG, JPEG yoki WebP tashlang yoki tanlang. Aslini saqlaymiz, ishga tushirmaymiz. Standart: 20 × 12, bitta juft.",
    printOnlyNeedFile: "Chiptadan oldin chop faylini qo‘shing.",
    printOnlyNeedContact: "Khurshid chiptani topsin — do‘kon nomini yozing.",
    printOnlySubmit: "Chop chiptasini yuborish",
    printOnlyWorking: "Fayl chop stoliga yuborilmoqda…",
    printOnlyError: "Ro‘yxat qabul qilmadi. Faylni saqlab, qayta urinib ko‘ring.",
    printExactMode: "Aynan shu holda chop eting",
    printNotesMode: "Izoh: {notes}",
    printOnlyUsername: "Do‘kon nomi (3–24 harf, raqam yoki _)",
    printOnlyReplace: "Faylni almashtirish",
    backToMenu: "Do‘kon menyusi",
    samplesNav: "Namunalar",
    createNav: "Dizayn yaratish",
    printNav: "Fayl chop etish",
    contactTitle: "Do‘kon bilan bog‘lanish",
  },
  tg: {
    howCanWeHelp: "Имрӯз чӣ кумак кунем?",
    lead: "Jumaboev Signs як ҷуфт 20 × 12 дюйм барои ҳар тарафи кабина чоп мекунад. Хизматро пахш кунед — фармон нанависед.",
    printExisting: "Ман тарҳи тайёр дорам",
    printExistingHint:
      "PDF, SVG, PNG, JPEG ё WebP фиристед. Дар 20 × 12 чоп мекунем. Тарроҳ нест.",
    createDesign: "Тарҳи нав сохтан",
    createDesignHint:
      "Винили дари USDOT-ро ин ҷо созед: ном, шаҳр ва иёлат, USDOT, MC, логои ихтиёрӣ.",
    myOrders: "Фармоишҳои ман",
    contactShop: "Бо дӯкон тамос",
    language: "Забон",
    contactBody:
      "Винилро Хуршид Ҷумабоев чоп мекунад. Андоза, гирифтан ё чипта дар ҳамин чати Telegram ё сайт.",
    ordersBody:
      "Чиптаҳои ҳамин чати Telegram — истеҳсол ва пардохт аз анбори дӯкон. Пардохтшуда танҳо пас аз тасдиқи Stripe.",
    printOnlyAsk:
      "Акнун файлро фиристед — PDF, SVG, PNG, JPEG ё WebP. Пеш аз файл номи ширкат лозим нест.",
    printOnlyGot:
      "Файл қабул шуд. Стандарт: 20 × 12, як ҷуфт. Айнан ҳамин тавр чоп ё эзоҳи кӯтоҳ.",
    printOnlyBad:
      "Ин файли чоп нест. PDF, SVG, PNG, JPEG ё WebP фиристед (то 8 МБ).",
    printOnlyExact: "Айнан ҳамин тавр чоп кунед",
    printOnlyNotes: "Эзоҳи кӯтоҳ дорам",
    printOnlyConfirm:
      "Файл: {file}\nАндоза: 20 × 12 дюйм · 1 ҷуфт\n{mode}",
    printOnlyPlaced:
      "Чиптаи {id} ҳамчун тарҳи тайёр қабул шуд.",
    printOnlySize: "Ҳар тараф 20 × 12 дюйм · 1 ҷуфт",
    chooseLanguage: "Забонро интихоб кунед. Меню мемонад.",
    languageSet: "Забон интихоб шуд.",
    menuAgain: "Имрӯз чӣ кумак кунем?",
    helpMenu:
      "Jumaboev Signs винили дари USDOT чоп мекунад, 20 × 12 ҳар тараф.\n\nТарҳи тайёр ё Тарҳи навро пахш кунед. Фармон нанависед.",
    printOnlyTitle: "Файли тайёрро чоп кардан",
    printOnlyDrop:
      "PDF, SVG, PNG, JPEG ё WebP гузоред ё интихоб кунед. Аслиро нигоҳ медорем, иҷро намекунем. Стандарт: 20 × 12, як ҷуфт.",
    printOnlyNeedFile: "Пеш аз чипта файли чопро илова кунед.",
    printOnlyNeedContact: "Номи корбар нависед, то Хуршид чиптаро ёбад.",
    printOnlySubmit: "Чиптаи чопро фиристодан",
    printOnlyWorking: "Файл ба мизи чоп фиристода мешавад…",
    printOnlyError: "Рӯйхат қабул накард. Файлро нигоҳ доред ва дубора кӯшиш кунед.",
    printExactMode: "Айнан ҳамин тавр чоп кунед",
    printNotesMode: "Эзоҳ: {notes}",
    printOnlyUsername: "Номи корбар (3–24 ҳарф, рақам ё _)",
    printOnlyReplace: "Иваз кардани файл",
    backToMenu: "Менюи дӯкон",
    samplesNav: "Намунаҳо",
    createNav: "Тарҳ сохтан",
    printNav: "Чоп кардани файл",
    contactTitle: "Бо дӯкон тамос",
  },
  ru: {
    howCanWeHelp: "Чем помочь сегодня?",
    lead: "Jumaboev Signs печатает пару 20 × 12 дюймов на каждую сторону кабины. Нажмите услугу — команды вводить не нужно.",
    printExisting: "У меня уже есть макет",
    printExistingHint:
      "Загрузите PDF, SVG, PNG, JPEG или WebP. Печатаем 20 × 12. Без конструктора.",
    createDesign: "Создать новый макет",
    createDesignHint:
      "Соберите USDOT-винил здесь: имя, город и штат, USDOT, MC, логотип по желанию.",
    myOrders: "Мои заказы",
    contactShop: "Связаться с цехом",
    language: "Язык",
    contactBody:
      "Винил печатает Хуршид Джумабоев. Размер, самовывоз и заявки — в этом чате Telegram или на сайте.",
    ordersBody:
      "Заявки из этого чата Telegram — производство и оплата со склада цеха. Оплачено только после Stripe, не наугад.",
    printOnlyAsk:
      "Пришлите файл сейчас — PDF, SVG, PNG, JPEG или WebP. Имя компании до файла не нужно. Печатаем пару 20 × 12.",
    printOnlyGot:
      "Файл получен. По умолчанию 20 × 12, одна пара. Нажмите Печатать как есть или пришлите короткую заметку.",
    printOnlyBad:
      "Это не файл для печати. Пришлите PDF, SVG, PNG, JPEG или WebP (до 8 МБ).",
    printOnlyExact: "Печатать как есть",
    printOnlyNotes: "Есть короткая заметка",
    printOnlyConfirm:
      "Файл: {file}\nРазмер: 20 × 12 дюймов · 1 пара\n{mode}",
    printOnlyPlaced:
      "Заявка {id} принята как готовый макет. Хуршид проверит исходный файл для пары 20 × 12.",
    printOnlySize: "20 × 12 дюймов на сторону · 1 пара",
    chooseLanguage: "Выберите язык. Меню останется на экране.",
    languageSet: "Язык выбран.",
    menuAgain: "Чем помочь сегодня?",
    helpMenu:
      "Jumaboev Signs печатает USDOT-винил, 20 × 12 на сторону кабины.\n\nНажмите У меня уже есть макет или Создать новый макет. Команды вводить не нужно.",
    printOnlyTitle: "Печать готового файла",
    printOnlyDrop:
      "Перетащите PDF, SVG, PNG, JPEG или WebP — или выберите файл. Храним оригинал, не запускаем. По умолчанию 20 × 12, одна пара.",
    printOnlyNeedFile: "Сначала добавьте файл для печати.",
    printOnlyNeedContact: "Укажите имя в магазине, чтобы Хуршид нашёл заявку.",
    printOnlySubmit: "Отправить заявку на печать",
    printOnlyWorking: "Отправляем файл на печатный стол…",
    printOnlyError: "Список не принял заявку. Сохраните файл и попробуйте снова.",
    printExactMode: "Печатать как есть",
    printNotesMode: "Заметка: {notes}",
    printOnlyUsername: "Имя в магазине (3–24 буквы, цифры или _)",
    printOnlyReplace: "Заменить файл",
    backToMenu: "Меню магазина",
    samplesNav: "Образцы",
    createNav: "Создать макет",
    printNav: "Печать файла",
    contactTitle: "Связаться с цехом",
  },
  kk: {
    howCanWeHelp: "Бүгін қалай көмектесейік?",
    lead: "Jumaboev Signs кабинаның әр жағына 20 × 12 дюйм жұп басады. Қызметті басыңыз — команда жазбаңыз.",
    printExisting: "Дайын макетім бар",
    printExistingHint:
      "PDF, SVG, PNG, JPEG немесе WebP жіберіңіз. 20 × 12 басамыз. Дизайнер жоқ.",
    createDesign: "Жаңа макет жасау",
    createDesignHint:
      "USDOT есік винилін осында жасаңыз: атау, қала мен штат, USDOT, MC, логотип.",
    myOrders: "Тапсырыстарым",
    contactShop: "Дүкенге хабарласу",
    language: "Тіл",
    contactBody:
      "Винилді Хуршид Джумабоев басады. Өлшем, алу немесе билет осы Telegram чатта немесе сайтта.",
    ordersBody:
      "Осы Telegram чат билеттері — өндіріс пен төлем дүкен қоймасынан. Төленді тек Stripe растағаннан кейін.",
    printOnlyAsk:
      "Файлды қазір жіберіңіз — PDF, SVG, PNG, JPEG немесе WebP. Файлдан бұрын компания аты керек емес.",
    printOnlyGot:
      "Файл қабылданды. Әдепкі: 20 × 12, бір жұп. Дәл осылай басу немесе қысқа ескертпе.",
    printOnlyBad:
      "Бұл баспа файлы емес. PDF, SVG, PNG, JPEG немесе WebP жіберіңіз (8 МБ дейін).",
    printOnlyExact: "Дәл осылай басыңыз",
    printOnlyNotes: "Қысқа ескертпем бар",
    printOnlyConfirm:
      "Файл: {file}\nӨлшем: 20 × 12 дюйм · 1 жұп\n{mode}",
    printOnlyPlaced:
      "{id} билеті дайын макет ретінде қабылданды.",
    printOnlySize: "Әр жақ 20 × 12 дюйм · 1 жұп",
    chooseLanguage: "Тілді таңдаңыз. Мәзір ашық қалады.",
    languageSet: "Тіл таңдалды.",
    menuAgain: "Бүгін қалай көмектесейік?",
    helpMenu:
      "Jumaboev Signs USDOT есік винилін басады, әр жақ 20 × 12.\n\nДайын макет немесе Жаңа макет-ті басыңыз. Команда жазбаңыз.",
    printOnlyTitle: "Дайын файлды басу",
    printOnlyDrop:
      "PDF, SVG, PNG, JPEG немесе WebP тастаңыз не таңдаңыз. Түпнұсқаны сақтаймыз, іске қоспаймыз. Әдепкі: 20 × 12, бір жұп.",
    printOnlyNeedFile: "Билеттен бұрын баспа файлын қосыңыз.",
    printOnlyNeedContact: "Хуршид билетті тапсын — дүкен атын жазыңыз.",
    printOnlySubmit: "Баспа билетін жіберу",
    printOnlyWorking: "Файл басып шығару үстеліне жіберілуде…",
    printOnlyError: "Тізім қабылдамады. Файлды сақтап, қайта көріңіз.",
    printExactMode: "Дәл осылай басыңыз",
    printNotesMode: "Ескертпе: {notes}",
    printOnlyUsername: "Дүкен аты (3–24 әріп, сан немесе _)",
    printOnlyReplace: "Файлды ауыстыру",
    backToMenu: "Дүкен мәзірі",
    samplesNav: "Үлгілер",
    createNav: "Макет жасау",
    printNav: "Файл басу",
    contactTitle: "Дүкенге хабарласу",
  },
  ky: {
    howCanWeHelp: "Бүгүн кантип жардам берели?",
    lead: "Jumaboev Signs кабинанын ар тарабына 20 × 12 дюйм жуп басат. Кызматты басыңыз — буйрук жазбаңыз.",
    printExisting: "Даяр макетим бар",
    printExistingHint:
      "PDF, SVG, PNG, JPEG же WebP жибериңиз. 20 × 12 басабыз. Дизайнер жок.",
    createDesign: "Жаңы макет жасоо",
    createDesignHint:
      "USDOT эшик винилин ушул жерде жасаңыз: ат, шаар жана штат, USDOT, MC, логотип.",
    myOrders: "Буйрутмаларым",
    contactShop: "Дүкөнгө байланыш",
    language: "Тил",
    contactBody:
      "Винилди Хуршид Жумабоев басат. Өлчөм, алуу же билет ушул Telegram чатта же сайтта.",
    ordersBody:
      "Бул Telegram чат билеттери — өндүрүш менен төлөм дүкөн кампасынан. Төлөндү тек Stripe ырастагандан кийин.",
    printOnlyAsk:
      "Файлды азыр жибериңиз — PDF, SVG, PNG, JPEG же WebP. Файлдан мурун компания аты керек эмес.",
    printOnlyGot:
      "Файл кабыл алынды. Демейки: 20 × 12, бир жуп. Так ошондой басуу же кыска эскертме.",
    printOnlyBad:
      "Бул басма файлы эмес. PDF, SVG, PNG, JPEG же WebP жибериңиз (8 МБ чейин).",
    printOnlyExact: "Так ошондой басыңыз",
    printOnlyNotes: "Кыска эскертмем бар",
    printOnlyConfirm:
      "Файл: {file}\nӨлчөм: 20 × 12 дюйм · 1 жуп\n{mode}",
    printOnlyPlaced:
      "{id} билети даяр макет катары кабыл алынды.",
    printOnlySize: "Ар тарап 20 × 12 дюйм · 1 жуп",
    chooseLanguage: "Тилди тандаңыз. Меню ачык калат.",
    languageSet: "Тил тандалды.",
    menuAgain: "Бүгүн кантип жардам берели?",
    helpMenu:
      "Jumaboev Signs USDOT эшик винилин басат, ар тарап 20 × 12.\n\nДаяр макет же Жаңы макетти басыңыз. Буйрук жазбаңыз.",
    printOnlyTitle: "Даяр файлды басуу",
    printOnlyDrop:
      "PDF, SVG, PNG, JPEG же WebP таштаңыз же тандаңыз. Түпнусканы сактайбыз, иштетпейбиз. Демейки: 20 × 12, бир жуп.",
    printOnlyNeedFile: "Билеттен мурун басма файлды кошуңуз.",
    printOnlyNeedContact: "Хуршид билетти тапсын — дүкөн атын жазыңыз.",
    printOnlySubmit: "Басма билетин жиберүү",
    printOnlyWorking: "Файл басып чыгаруу столуна жиберилип жатат…",
    printOnlyError: "Тизме кабыл алган жок. Файлды сактап, кайра аракет кылыңыз.",
    printExactMode: "Так ошондой басыңыз",
    printNotesMode: "Эскертме: {notes}",
    printOnlyUsername: "Дүкөн аты (3–24 тамга, сан же _)",
    printOnlyReplace: "Файлды алмаштыруу",
    backToMenu: "Дүкөн менюсу",
    samplesNav: "Үлгүлөр",
    createNav: "Макет жасоо",
    printNav: "Файл басуу",
    contactTitle: "Дүкөнгө байланыш",
  },
  uk: {
    howCanWeHelp: "Чим допомогти сьогодні?",
    lead: "Jumaboev Signs друкує пару 20 × 12 дюймів на кожен бік кабіни. Натисніть послугу — команди вводити не потрібно.",
    printExisting: "У мене вже є макет",
    printExistingHint:
      "Надішліть PDF, SVG, PNG, JPEG або WebP. Друкуємо 20 × 12. Без конструктора.",
    createDesign: "Створити новий макет",
    createDesignHint:
      "Зберіть USDOT-вініл тут: назва, місто й штат, USDOT, MC, логотип за бажанням.",
    myOrders: "Мої замовлення",
    contactShop: "Зв’язатися з цехом",
    language: "Мова",
    contactBody:
      "Вініл друкує Хуршид Джумабоєв. Розмір, самовивіз і заявки — в цьому чаті Telegram або на сайті.",
    ordersBody:
      "Заявки з цього чату Telegram — виробництво й оплата зі складу цеху. Сплачено лише після Stripe, не навмання.",
    printOnlyAsk:
      "Надішліть файл зараз — PDF, SVG, PNG, JPEG або WebP. Назва компанії до файла не потрібна. Друкуємо пару 20 × 12.",
    printOnlyGot:
      "Файл отримано. Типово 20 × 12, одна пара. Натисніть Друкувати як є або надішліть коротку нотатку.",
    printOnlyBad:
      "Це не файл для друку. Надішліть PDF, SVG, PNG, JPEG або WebP (до 8 МБ).",
    printOnlyExact: "Друкувати як є",
    printOnlyNotes: "Є коротка нотатка",
    printOnlyConfirm:
      "Файл: {file}\nРозмір: 20 × 12 дюймів · 1 пара\n{mode}",
    printOnlyPlaced:
      "Заявку {id} прийнято як готовий макет. Хуршид перевірить вихідний файл для пари 20 × 12.",
    printOnlySize: "20 × 12 дюймів на бік · 1 пара",
    chooseLanguage: "Оберіть мову. Меню залишиться на екрані.",
    languageSet: "Мову вибрано.",
    menuAgain: "Чим допомогти сьогодні?",
    helpMenu:
      "Jumaboev Signs друкує USDOT-вініл, 20 × 12 на бік кабіни.\n\nНатисніть У мене вже є макет або Створити новий макет. Команди вводити не потрібно.",
    printOnlyTitle: "Друк готового файла",
    printOnlyDrop:
      "Перетягніть PDF, SVG, PNG, JPEG або WebP — або оберіть файл. Зберігаємо оригінал, не запускаємо. Типово 20 × 12, одна пара.",
    printOnlyNeedFile: "Спочатку додайте файл для друку.",
    printOnlyNeedContact: "Вкажіть ім’я в майстерні, щоб Хуршид знайшов заявку.",
    printOnlySubmit: "Надіслати заявку на друк",
    printOnlyWorking: "Надсилаємо файл на друкарський стіл…",
    printOnlyError: "Список не прийняв заявку. Збережіть файл і спробуйте знову.",
    printExactMode: "Друкувати як є",
    printNotesMode: "Нотатка: {notes}",
    printOnlyUsername: "Ім’я в майстерні (3–24 літери, цифри або _)",
    printOnlyReplace: "Замінити файл",
    backToMenu: "Меню майстерні",
    samplesNav: "Зразки",
    createNav: "Створити макет",
    printNav: "Друк файла",
    contactTitle: "Зв’язатися з цехом",
  },
};

export function shopT(
  lang: ShopLang,
  key: ShopEntryKey,
  vars?: Record<string, string>,
): string {
  let text = SHOP_ENTRY[lang][key];
  if (!vars) return text;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, value);
  }
  return text;
}

export function isShopLang(value: string): value is ShopLang {
  return (LANGS as readonly string[]).includes(value);
}
