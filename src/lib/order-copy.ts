import type { PaymentStatus, ProductionStatus } from "@/lib/order-status";
import { LANGS, type ShopLang } from "@/lib/shop-entry";

const PRODUCTION: Record<ShopLang, Record<ProductionStatus, string>> = {
  en: {
    RECEIVED: "Received",
    NEEDS_REVIEW: "Needs review",
    AWAITING_APPROVAL: "Awaiting approval",
    APPROVED: "Approved",
    IN_PRODUCTION: "In production",
    READY_FOR_PAYMENT: "Ready for payment",
    READY_FOR_PICKUP: "Ready for pickup",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  },
  uz: {
    RECEIVED: "Qabul qilindi",
    NEEDS_REVIEW: "Ko‘rik kerak",
    AWAITING_APPROVAL: "Tasdiq kutilmoqda",
    APPROVED: "Tasdiqlandi",
    IN_PRODUCTION: "Chop etilmoqda",
    READY_FOR_PAYMENT: "To‘lovga tayyor",
    READY_FOR_PICKUP: "Olib ketishga tayyor",
    COMPLETED: "Tugadi",
    CANCELLED: "Bekor qilindi",
  },
  tg: {
    RECEIVED: "Қабул шуд",
    NEEDS_REVIEW: "Баррасӣ лозим",
    AWAITING_APPROVAL: "Интизори тасдиқ",
    APPROVED: "Тасдиқ шуд",
    IN_PRODUCTION: "Дар чоп",
    READY_FOR_PAYMENT: "Барои пардохт омода",
    READY_FOR_PICKUP: "Барои гирифтан омода",
    COMPLETED: "Анҷом",
    CANCELLED: "Бекор",
  },
  ru: {
    RECEIVED: "Принято",
    NEEDS_REVIEW: "Нужна проверка",
    AWAITING_APPROVAL: "Ждёт одобрения",
    APPROVED: "Одобрено",
    IN_PRODUCTION: "В печати",
    READY_FOR_PAYMENT: "К оплате",
    READY_FOR_PICKUP: "К выдаче",
    COMPLETED: "Готово",
    CANCELLED: "Отменено",
  },
  kk: {
    RECEIVED: "Қабылданды",
    NEEDS_REVIEW: "Тексеру керек",
    AWAITING_APPROVAL: "Мақұлдау күтілуде",
    APPROVED: "Мақұлданды",
    IN_PRODUCTION: "Басылып жатыр",
    READY_FOR_PAYMENT: "Төлемге дайын",
    READY_FOR_PICKUP: "Алуға дайын",
    COMPLETED: "Аяқталды",
    CANCELLED: "Болдырылмады",
  },
  ky: {
    RECEIVED: "Кабыл алынды",
    NEEDS_REVIEW: "Текшерүү керек",
    AWAITING_APPROVAL: "Бекитүү күтүлүүдө",
    APPROVED: "Бекитилди",
    IN_PRODUCTION: "Басылууда",
    READY_FOR_PAYMENT: "Төлөмгө даяр",
    READY_FOR_PICKUP: "Алууга даяр",
    COMPLETED: "Бүттү",
    CANCELLED: "Жокко чыгарылды",
  },
  uk: {
    RECEIVED: "Прийнято",
    NEEDS_REVIEW: "Потрібна перевірка",
    AWAITING_APPROVAL: "Чекає схвалення",
    APPROVED: "Схвалено",
    IN_PRODUCTION: "У друці",
    READY_FOR_PAYMENT: "До сплати",
    READY_FOR_PICKUP: "До видачі",
    COMPLETED: "Готово",
    CANCELLED: "Скасовано",
  },
};

const PAYMENT: Record<ShopLang, Record<PaymentStatus, string>> = {
  en: {
    UNPAID: "Unpaid",
    PAYMENT_PENDING: "Payment pending",
    PAID: "Paid",
    PAYMENT_FAILED: "Payment failed",
    REFUNDED: "Refunded",
    PARTIALLY_REFUNDED: "Partially refunded",
  },
  uz: {
    UNPAID: "To‘lanmagan",
    PAYMENT_PENDING: "To‘lov kutilmoqda",
    PAID: "To‘langan",
    PAYMENT_FAILED: "To‘lov xato",
    REFUNDED: "Qaytarildi",
    PARTIALLY_REFUNDED: "Qisman qaytarildi",
  },
  tg: {
    UNPAID: "Пардохт нашуд",
    PAYMENT_PENDING: "Пардохт дар интизор",
    PAID: "Пардохт шуд",
    PAYMENT_FAILED: "Пардохт нашуд",
    REFUNDED: "Бозгардонд",
    PARTIALLY_REFUNDED: "Қисман бозгардонд",
  },
  ru: {
    UNPAID: "Не оплачено",
    PAYMENT_PENDING: "Оплата ожидается",
    PAID: "Оплачено",
    PAYMENT_FAILED: "Оплата не прошла",
    REFUNDED: "Возврат",
    PARTIALLY_REFUNDED: "Частичный возврат",
  },
  kk: {
    UNPAID: "Төленбеген",
    PAYMENT_PENDING: "Төлем күтілуде",
    PAID: "Төленді",
    PAYMENT_FAILED: "Төлем қате",
    REFUNDED: "Қайтарылды",
    PARTIALLY_REFUNDED: "Ішінара қайтарылды",
  },
  ky: {
    UNPAID: "Төлөнгөн эмес",
    PAYMENT_PENDING: "Төлөм күтүлүүдө",
    PAID: "Төлөндү",
    PAYMENT_FAILED: "Төлөм ката",
    REFUNDED: "Кайтарылды",
    PARTIALLY_REFUNDED: "Жарым-жартылай кайтарылды",
  },
  uk: {
    UNPAID: "Не сплачено",
    PAYMENT_PENDING: "Очікується оплата",
    PAID: "Сплачено",
    PAYMENT_FAILED: "Оплата не пройшла",
    REFUNDED: "Повернено",
    PARTIALLY_REFUNDED: "Частково повернено",
  },
};

export type PayCopyKey =
  | "payTitle"
  | "payLead"
  | "payInvalid"
  | "payNoPrice"
  | "payNotReady"
  | "payDue"
  | "payOffline"
  | "payMissingKeys"
  | "payLiveBlocked"
  | "payInvalidKey"
  | "payCard"
  | "payContinue"
  | "payWaitWebhook"
  | "payConfirmed"
  | "payReturnTitle"
  | "payReturnLead"
  | "payFailed"
  | "payPending"
  | "payStartError"
  | "payRefunded"
  | "payCardHint"
  | "payCancelled"
  | "paySize"
  | "productionLabel"
  | "paymentLabel"
  | "priceLabel"
  | "priceHint"
  | "setPrice"
  | "readyPay"
  | "payLink"
  | "copyLink"
  | "moveStatus"
  | "syncUnpaid"
  | "syncEmpty"
  | "syncPayHint"
  | "ordersSiteLead"
  | "adminSiteLead";

const PAY: Record<ShopLang, Record<PayCopyKey, string>> = {
  en: {
    payTitle: "Pay for ticket {id}",
    payLead: "Jumaboev Signs · 20 × 12 in pair.",
    payInvalid: "This pay link is not valid.",
    payNoPrice: "Khurshid has not set a shop price yet.",
    payNotReady: "This ticket is not ready for payment.",
    payDue: "Amount due {amount} for one 20 × 12 in pair.",
    payOffline:
      "Card checkout is not open on this shop. Do not type a card number here. The ticket stays unpaid.",
    payMissingKeys:
      "Card checkout is not configured. Stripe test keys are missing. Do not type a card number here. The ticket stays unpaid.",
    payLiveBlocked:
      "Live Stripe keys are refused. This shop only accepts test-mode checkout. The ticket stays unpaid.",
    payInvalidKey:
      "The Stripe key on this server is not a test key. Checkout stays closed. The ticket stays unpaid.",
    payCard: "Pay with card",
    payContinue: "Continue to Stripe",
    payWaitWebhook:
      "If you already paid, wait. We only mark the ticket paid after Stripe confirms — never from this page.",
    payConfirmed: "This ticket is paid. Stripe confirmed the approved amount.",
    payReturnTitle: "Returned from Stripe",
    payReturnLead:
      "Opening the success URL does not mark this ticket paid. Waiting for a verified Stripe webhook.",
    payFailed: "Card payment did not go through. You can try again if the ticket is still ready.",
    payPending: "Checkout was started. Finish the Stripe page, then wait for confirmation.",
    payStartError: "Could not start Stripe Checkout.",
    payRefunded: "This ticket was refunded.",
    payCardHint:
      "Pay the approved amount on Stripe. We only mark the ticket paid after Stripe confirms.",
    payCancelled: "This ticket is cancelled and cannot be paid.",
    paySize: "20 × 12 in · 1 pair",
    productionLabel: "Production",
    paymentLabel: "Payment",
    priceLabel: "Shop price (USD)",
    priceHint: "Approved amount in dollars. Never $0.",
    setPrice: "Save price",
    readyPay: "Mark ready for payment",
    payLink: "Customer pay link",
    copyLink: "Copy pay link",
    moveStatus: "Move production",
    syncUnpaid:
      "This ticket is unpaid. Paid is set only after Stripe confirms — never guessed.",
    syncEmpty:
      "No tickets from this Telegram chat yet. Print a file or create a design. Payment stays unpaid until Stripe confirms.",
    syncPayHint:
      "Ready for payment. Open the pay link from this chat — this list does not mark the ticket paid.",
    ordersSiteLead:
      "Tickets from print-existing, the designer, and Telegram. Production and payment come from the shop store. Paid only after Stripe confirms.",
    adminSiteLead:
      "Production and payment are separate. Set an approved price before Ready for payment. Paid is never set by hand. Custom designs still download a 20 × 12 in pair on a 24 in roll.",
  },
  uz: {
    payTitle: "{id} chiptasi uchun to‘lov",
    payLead: "Jumaboev Signs · 20 × 12 juft.",
    payInvalid: "Bu to‘lov havolasi yaroqsiz.",
    payNoPrice: "Khurshid hali narx qo‘ymagan.",
    payNotReady: "Chipta to‘lovga tayyor emas.",
    payDue: "Bir 20 × 12 juft uchun {amount}.",
    payOffline:
      "Karta to‘lovi ochiq emas. Bu yerga karta raqamini yozmang. Chipta to‘lanmagan qoladi.",
    payMissingKeys:
      "Karta to‘lovi sozlanmagan. Stripe test kalitlari yo‘q. Karta raqamini yozmang. Chipta to‘lanmagan qoladi.",
    payLiveBlocked:
      "Jonli Stripe kalitlari rad etiladi. Faqat test to‘lovi. Chipta to‘lanmagan qoladi.",
    payInvalidKey:
      "Bu serverdagi Stripe kaliti test kaliti emas. To‘lov yopiq. Chipta to‘lanmagan qoladi.",
    payCard: "Karta bilan to‘lash",
    payContinue: "Stripe’ga davom etish",
    payWaitWebhook:
      "To‘lagan bo‘lsangiz, kuting. Chipta faqat Stripe tasdiqlagach to‘langan bo‘ladi — bu sahifa belgilamaydi.",
    payConfirmed: "Chipta to‘langan. Stripe tasdiqlangan summani qabul qildi.",
    payReturnTitle: "Stripe’dan qaytdingiz",
    payReturnLead:
      "Muvaffaqiyat sahifasi chiptani to‘langan qilmaydi. Tasdiqlangan webhook kutilmoqda.",
    payFailed: "Karta to‘lovi o‘tmadi. Chipta tayyor bo‘lsa, qayta urinib ko‘ring.",
    payPending: "To‘lov boshlandi. Stripe sahifasini tugating, keyin tasdiqni kuting.",
    payStartError: "Stripe Checkout ochilmadi.",
    payRefunded: "Bu chipta qaytarildi.",
    payCardHint:
      "Tasdiqlangan summani Stripe’da to‘lang. Chipta faqat Stripe tasdiqlagach to‘langan bo‘ladi.",
    payCancelled: "Chipta bekor qilingan, to‘lab bo‘lmaydi.",
    paySize: "20 × 12 · 1 juft",
    productionLabel: "Ishlab chiqarish",
    paymentLabel: "To‘lov",
    priceLabel: "Do‘kon narxi (USD)",
    priceHint: "Tasdiqlangan summa. $0 emas.",
    setPrice: "Narxni saqlash",
    readyPay: "To‘lovga tayyor deb belgilash",
    payLink: "Mijoz to‘lov havolasi",
    copyLink: "Havolani nusxalash",
    moveStatus: "Holatni o‘zgartirish",
    syncUnpaid:
      "Chipta to‘lanmagan. To‘langan deb faqat Stripe tasdiqlagach yoziladi — taxmin qilinmaydi.",
    syncEmpty:
      "Bu Telegram chatdan hali chipta yo‘q. Fayl yuboring yoki dizayn yarating. Stripe tasdiqlamaguncha to‘lanmagan qoladi.",
    syncPayHint:
      "To‘lovga tayyor. Shu chatdagi to‘lov havolasini oching — ro‘yxat chiptani to‘langan qilmaydi.",
    ordersSiteLead:
      "Chop, dizayner va Telegram chiptalari. Holat do‘kon omboridan. To‘langan faqat Stripe tasdiqlagach.",
    adminSiteLead:
      "Ishlab chiqarish va to‘lov alohida. Avval narx, keyin to‘lovga tayyor. To‘langanni qo‘lda qo‘ymang.",
  },
  tg: {
    payTitle: "Пардохт барои чиптаи {id}",
    payLead: "Jumaboev Signs · ҷуфти 20 × 12.",
    payInvalid: "Ин пайванди пардохт нодуруст аст.",
    payNoPrice: "Хуршид ҳанӯз нарх нагузоштааст.",
    payNotReady: "Чипта барои пардохт омода нест.",
    payDue: "Барои як ҷуфти 20 × 12 {amount}.",
    payOffline:
      "Пардохти корт кушода нест. Рақами корт нанависед. Чипта пардохтнашуда мемонад.",
    payMissingKeys:
      "Пардохти корт танзим нашудааст. Калидҳои тестии Stripe нестанд. Рақами корт нанависед. Чипта пардохтнашуда мемонад.",
    payLiveBlocked:
      "Калидҳои зиндаи Stripe рад мешаванд. Танҳо пардохти тестӣ. Чипта пардохтнашуда мемонад.",
    payInvalidKey:
      "Калиди Stripe дар ин сервер тести нест. Пардохт баста аст. Чипта пардохтнашуда мемонад.",
    payCard: "Пардохт бо корт",
    payContinue: "Идома дар Stripe",
    payWaitWebhook:
      "Агар пардохт карда бошед, интизор шавед. Чипта танҳо пас аз тасдиқи Stripe пардохтшуда мешавад — ин саҳифа не.",
    payConfirmed: "Чипта пардохт шуд. Stripe маблағи тасдиқшударо қабул кард.",
    payReturnTitle: "Аз Stripe баргаштед",
    payReturnLead:
      "URL-и муваффақият чиптаро пардохтшуда намекунад. Вебхуки тасдиқшуда интизор аст.",
    payFailed: "Пардохти корт нагузашт. Агар чипта омода бошад, бори дигар кӯшиш кунед.",
    payPending: "Пардохт оғоз шуд. Саҳифаи Stripe-ро анҷом диҳед, сипас тасдиқро интизор шавед.",
    payStartError: "Stripe Checkout кушода нашуд.",
    payRefunded: "Ин чипта бозгардонда шуд.",
    payCardHint:
      "Маблағи тасдиқшударо дар Stripe пардохт кунед. Чипта танҳо пас аз тасдиқи Stripe пардохтшуда мешавад.",
    payCancelled: "Чипта бекор шуд ва пардохт намешавад.",
    paySize: "20 × 12 · 1 ҷуфт",
    productionLabel: "Истеҳсол",
    paymentLabel: "Пардохт",
    priceLabel: "Нархи дӯкон (USD)",
    priceHint: "Маблағи тасдиқшуда. $0 нест.",
    setPrice: "Нархро захира кун",
    readyPay: "Барои пардохт омода",
    payLink: "Пайванди пардохти муштарӣ",
    copyLink: "Нусха",
    moveStatus: "Ҳолатро иваз кун",
    syncUnpaid:
      "Чипта пардохт нашудааст. Пардохтшуда танҳо пас аз тасдиқи Stripe — тахмин нест.",
    syncEmpty:
      "Аз ин чати Telegram ҳанӯз чипта нест. Файл фиристед ё тарҳ созед. То тасдиқи Stripe пардохтнашуда мемонад.",
    syncPayHint:
      "Барои пардохт омода. Пайванди пардохтро аз ҳамин чат кушоед — рӯйхат чиптаро пардохтшуда намекунад.",
    ordersSiteLead:
      "Чиптаҳои чоп, тарроҳ ва Telegram. Ҳолат аз анбори дӯкон. Пардохтшуда танҳо пас аз Stripe.",
    adminSiteLead:
      "Истеҳсол ва пардохт ҷудо. Аввал нарх, баъд барои пардохт омода. Пардохтшударо дастӣ нагузоред.",
  },
  ru: {
    payTitle: "Оплата заявки {id}",
    payLead: "Jumaboev Signs · пара 20 × 12.",
    payInvalid: "Эта ссылка на оплату недействительна.",
    payNoPrice: "Хуршид ещё не назначил цену.",
    payNotReady: "Заявка не готова к оплате.",
    payDue: "К оплате {amount} за одну пару 20 × 12.",
    payOffline:
      "Оплата картой в этом цехе не включена. Не вводите номер карты. Заявка остаётся неоплаченной.",
    payMissingKeys:
      "Оплата картой не настроена. Нет тестовых ключей Stripe. Не вводите номер карты. Заявка остаётся неоплаченной.",
    payLiveBlocked:
      "Боевые ключи Stripe отклоняются. Только тестовая оплата. Заявка остаётся неоплаченной.",
    payInvalidKey:
      "Ключ Stripe на этом сервере не тестовый. Оплата закрыта. Заявка остаётся неоплаченной.",
    payCard: "Оплатить картой",
    payContinue: "Продолжить в Stripe",
    payWaitWebhook:
      "Если вы уже оплатили — подождите. Заявка становится оплаченной только после подтверждения Stripe, не с этой страницы.",
    payConfirmed: "Заявка оплачена. Stripe подтвердил утверждённую сумму.",
    payReturnTitle: "Возврат из Stripe",
    payReturnLead:
      "Страница успеха не отмечает заявку оплаченной. Ждём проверенный webhook Stripe.",
    payFailed: "Оплата картой не прошла. Если заявка ещё к оплате, попробуйте снова.",
    payPending: "Оплата начата. Завершите страницу Stripe и дождитесь подтверждения.",
    payStartError: "Не удалось открыть Stripe Checkout.",
    payRefunded: "По этой заявке сделан возврат.",
    payCardHint:
      "Оплатите утверждённую сумму в Stripe. Заявка станет оплаченной только после подтверждения Stripe.",
    payCancelled: "Заявка отменена и не может быть оплачена.",
    paySize: "20 × 12 · 1 пара",
    productionLabel: "Производство",
    paymentLabel: "Оплата",
    priceLabel: "Цена цеха (USD)",
    priceHint: "Утверждённая сумма. Не $0.",
    setPrice: "Сохранить цену",
    readyPay: "К оплате",
    payLink: "Ссылка для клиента",
    copyLink: "Копировать ссылку",
    moveStatus: "Сменить статус",
    syncUnpaid:
      "Заявка не оплачена. «Оплачено» ставится только после подтверждения Stripe — не наугад.",
    syncEmpty:
      "Из этого чата Telegram заявок ещё нет. Отправьте файл или создайте макет. Без подтверждения Stripe заявка остаётся неоплаченной.",
    syncPayHint:
      "К оплате. Откройте ссылку из этого чата — список не отмечает заявку оплаченной.",
    ordersSiteLead:
      "Заявки с печати, из конструктора и Telegram. Статусы из склада цеха. Оплачено только после Stripe.",
    adminSiteLead:
      "Производство и оплата разделены. Сначала цена, потом «к оплате». Оплачено руками не ставится.",
  },
  kk: {
    payTitle: "{id} билетіне төлем",
    payLead: "Jumaboev Signs · 20 × 12 жұп.",
    payInvalid: "Бұл төлем сілтемесі жарамсыз.",
    payNoPrice: "Хуршид әлі баға қоймады.",
    payNotReady: "Билет төлемге дайын емес.",
    payDue: "Бір 20 × 12 жұп үшін {amount}.",
    payOffline:
      "Карта төлемі ашық емес. Карта нөмірін жазбаңыз. Билет төленбеген күйде қалады.",
    payMissingKeys:
      "Карта төлемі бапталмаған. Stripe тест кілттері жоқ. Карта нөмірін жазбаңыз. Билет төленбеген күйде қалады.",
    payLiveBlocked:
      "Тірі Stripe кілттері қабылданбайды. Тек тест төлемі. Билет төленбеген күйде қалады.",
    payInvalidKey:
      "Осы сервердегі Stripe кілті тест кілті емес. Төлем жабық. Билет төленбеген күйде қалады.",
    payCard: "Картамен төлеу",
    payContinue: "Stripe-та жалғастыру",
    payWaitWebhook:
      "Төлеп қойсаңыз, күтіңіз. Билет тек Stripe растағаннан кейін төленген болады — бұл беттен емес.",
    payConfirmed: "Билет төленді. Stripe бекітілген соманы растады.",
    payReturnTitle: "Stripe-тан оралдыңыз",
    payReturnLead:
      "Сәттілік URL билетті төленген деп белгілемейді. Расталған webhook күтілуде.",
    payFailed: "Карта төлемі өтпеді. Билет әлі дайын болса, қайта көріңіз.",
    payPending: "Төлем басталды. Stripe бетін аяқтап, растауды күтіңіз.",
    payStartError: "Stripe Checkout ашылмады.",
    payRefunded: "Бұл билет қайтарылды.",
    payCardHint:
      "Бекітілген соманы Stripe-та төлеңіз. Билет тек Stripe растағаннан кейін төленген болады.",
    payCancelled: "Билет болдырылмады, төлеуге болмайды.",
    paySize: "20 × 12 · 1 жұп",
    productionLabel: "Өндіріс",
    paymentLabel: "Төлем",
    priceLabel: "Дүкен бағасы (USD)",
    priceHint: "Бекітілген сома. $0 емес.",
    setPrice: "Бағаны сақтау",
    readyPay: "Төлемге дайын",
    payLink: "Клиент сілтемесі",
    copyLink: "Көшіру",
    moveStatus: "Күйді ауыстыру",
    syncUnpaid:
      "Билет төленбеген. Төленді тек Stripe растағаннан кейін жазылады — жорамал емес.",
    syncEmpty:
      "Осы Telegram чаттан әлі билет жоқ. Файл жіберіңіз немесе дизайн жасаңыз. Stripe растамайынша төленбеген қалады.",
    syncPayHint:
      "Төлемге дайын. Осы чаттағы сілтемені ашыңыз — тізім билетті төленген деп белгілемейді.",
    ordersSiteLead:
      "Басып шығару, дизайнер және Telegram билеттері. Күй дүкен қоймасынан. Төленді тек Stripe-тан кейін.",
    adminSiteLead:
      "Өндіріс пен төлем бөлек. Алдымен баға, содан кейін төлемге дайын. Төленді қолмен қойылмайды.",
  },
  ky: {
    payTitle: "{id} билетине төлөм",
    payLead: "Jumaboev Signs · 20 × 12 жуп.",
    payInvalid: "Бул төлөм шилтемеси жараксыз.",
    payNoPrice: "Хуршид азырынча баа койгон жок.",
    payNotReady: "Билет төлөмгө даяр эмес.",
    payOffline:
      "Карта төлөмү ачык эмес. Карта номерин жазбаңыз. Билет төлөнбөй калат.",
    payMissingKeys:
      "Карта төлөмү жөндөлгөн эмес. Stripe тест ачкычтары жок. Карта номерин жазбаңыз. Билет төлөнбөй калат.",
    payLiveBlocked:
      "Жандуу Stripe ачкычтары четке кагылат. Тек тест төлөмү. Билет төлөнбөй калат.",
    payInvalidKey:
      "Бул сервердеги Stripe ачкычы тест ачкычы эмес. Төлөм жабык. Билет төлөнбөй калат.",
    payCard: "Карта менен төлөө",
    payContinue: "Stripe'та улантуу",
    payWaitWebhook:
      "Төлөп койсоңуз, күтүңүз. Билет Stripe ырастагандан кийин гана төлөнгөн болот — бул барактан эмес.",
    payConfirmed: "Билет төлөндү. Stripe бекитилген сумманы ырастады.",
    payReturnTitle: "Stripe'тан кайттыңыз",
    payReturnLead:
      "Ийгилик URL билетти төлөнгөн деп белгилебейт. Текшерилген webhook күтүлүүдө.",
    payFailed: "Карта төлөмү өткөн жок. Билет дагы даяр болсо, кайра аракет кылыңыз.",
    payPending: "Төлөм башталды. Stripe барагын бүтүрүп, ырастоону күтүңүз.",
    payStartError: "Stripe Checkout ачылган жок.",
    payRefunded: "Бул билет кайтарылды.",
    payCardHint:
      "Бекитилген сумманы Stripe'та төлөңүз. Билет Stripe ырастагандан кийин гана төлөнгөн болот.",
    payCancelled: "Билет жокко чыгарылган, төлөөгө болбойт.",
    payDue: "Бир 20 × 12 жуп үчүн {amount}.",
    paySize: "20 × 12 · 1 жуп",
    productionLabel: "Өндүрүш",
    paymentLabel: "Төлөм",
    priceLabel: "Дүкөн баасы (USD)",
    priceHint: "Бекитилген сумма. $0 эмес.",
    setPrice: "Бааны сактоо",
    readyPay: "Төлөмгө даяр",
    payLink: "Кардар шилтемеси",
    copyLink: "Көчүрүү",
    moveStatus: "Абалды жылдыруу",
    syncUnpaid:
      "Билет төлөнбөгөн. Төлөндү деп Stripe ырастагандан кийин гана жазылат — болжол эмес.",
    syncEmpty:
      "Бул Telegram чаттан азырынча билет жок. Файл жөнөтүңүз же дизайн жасаңыз. Stripe ырастамайынча төлөнбөй калат.",
    syncPayHint:
      "Төлөмгө даяр. Ушул чаттагы шилтемени ачыңыз — тизме билетти төлөнгөн деп белгилебейт.",
    ordersSiteLead:
      "Басып чыгаруу, дизайнер жана Telegram билеттери. Абал дүкөн кампасынан. Төлөндү тек Stripe'tан кийин.",
    adminSiteLead:
      "Өндүрүш менен төлөм бөлөк. Адегенде баа, андан кийин төлөмгө даяр. Төлөндү кол менен коюлбайт.",
  },
  uk: {
    payTitle: "Оплата заявки {id}",
    payLead: "Jumaboev Signs · пара 20 × 12.",
    payInvalid: "Це посилання на оплату недійсне.",
    payNoPrice: "Хуршид ще не призначив ціну.",
    payNotReady: "Заявка не готова до оплати.",
    payDue: "До сплати {amount} за одну пару 20 × 12.",
    payOffline:
      "Оплата карткою в цьому цеху не ввімкнена. Не вводьте номер картки. Заявка лишається несплаченою.",
    payMissingKeys:
      "Оплату карткою не налаштовано. Немає тестових ключів Stripe. Не вводьте номер картки. Заявка лишається несплаченою.",
    payLiveBlocked:
      "Бойові ключі Stripe відхиляються. Лише тестова оплата. Заявка лишається несплаченою.",
    payInvalidKey:
      "Ключ Stripe на цьому сервері не тестовий. Оплата закрита. Заявка лишається несплаченою.",
    payCard: "Сплатити карткою",
    payContinue: "Продовжити в Stripe",
    payWaitWebhook:
      "Якщо вже сплатили — зачекайте. Заявка стає сплаченою лише після підтвердження Stripe, не з цієї сторінки.",
    payConfirmed: "Заявку сплачено. Stripe підтвердив затверджену суму.",
    payReturnTitle: "Повернення зі Stripe",
    payReturnLead:
      "Сторінка успіху не позначає заявку сплаченою. Чекаємо перевірений webhook Stripe.",
    payFailed: "Оплата карткою не пройшла. Якщо заявка ще до сплати, спробуйте знову.",
    payPending: "Оплату розпочато. Завершіть сторінку Stripe і дочекайтеся підтвердження.",
    payStartError: "Не вдалося відкрити Stripe Checkout.",
    payRefunded: "За цією заявкою зроблено повернення.",
    payCardHint:
      "Сплатіть затверджену суму в Stripe. Заявка стане сплаченою лише після підтвердження Stripe.",
    payCancelled: "Заявку скасовано і не можна сплатити.",
    paySize: "20 × 12 · 1 пара",
    productionLabel: "Виробництво",
    paymentLabel: "Оплата",
    priceLabel: "Ціна цеху (USD)",
    priceHint: "Затверджена сума. Не $0.",
    setPrice: "Зберегти ціну",
    readyPay: "До сплати",
    payLink: "Посилання для клієнта",
    copyLink: "Копіювати",
    moveStatus: "Змінити статус",
    syncUnpaid:
      "Заявка не сплачена. «Сплачено» ставиться лише після підтвердження Stripe — не навмання.",
    syncEmpty:
      "З цього чату Telegram заявок ще немає. Надішліть файл або створіть макет. Без підтвердження Stripe заявка лишається несплаченою.",
    syncPayHint:
      "До сплати. Відкрийте посилання з цього чату — список не позначає заявку сплаченою.",
    ordersSiteLead:
      "Заявки з друку, конструктора та Telegram. Статуси зі складу цеху. Сплачено лише після Stripe.",
    adminSiteLead:
      "Виробництво й оплата окремо. Спочатку ціна, потім «до сплати». Сплачено руками не ставиться.",
  },
};

function interpolate(text: string, vars?: Record<string, string>): string {
  if (!vars) return text;
  let next = text;
  for (const [name, value] of Object.entries(vars)) {
    next = next.replaceAll(`{${name}}`, value);
  }
  return next;
}

export function productionLabel(lang: ShopLang, status: ProductionStatus): string {
  return PRODUCTION[lang][status];
}

export function paymentLabel(lang: ShopLang, status: PaymentStatus): string {
  return PAYMENT[lang][status];
}

export function payT(
  lang: ShopLang,
  key: PayCopyKey,
  vars?: Record<string, string>,
): string {
  return interpolate(PAY[lang][key], vars);
}

export function isShopLangList(value: string): value is ShopLang {
  return (LANGS as readonly string[]).includes(value);
}
