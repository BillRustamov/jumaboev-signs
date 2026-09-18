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
  | "paySize"
  | "productionLabel"
  | "paymentLabel"
  | "priceLabel"
  | "priceHint"
  | "setPrice"
  | "readyPay"
  | "payLink"
  | "copyLink"
  | "moveStatus";

const PAY: Record<ShopLang, Record<PayCopyKey, string>> = {
  en: {
    payTitle: "Pay for ticket {id}",
    payLead: "Jumaboev Signs · 20 × 12 in pair.",
    payInvalid: "This pay link is not valid.",
    payNoPrice: "Khurshid has not set a shop price yet.",
    payNotReady: "This ticket is not ready for payment.",
    payDue: "Amount due {amount} for one 20 × 12 in pair.",
    payOffline:
      "Card checkout is not open on this shop yet. Do not type a card number here. The ticket stays unpaid.",
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
  },
  uz: {
    payTitle: "{id} chiptasi uchun to‘lov",
    payLead: "Jumaboev Signs · 20 × 12 juft.",
    payInvalid: "Bu to‘lov havolasi yaroqsiz.",
    payNoPrice: "Khurshid hali narx qo‘ymagan.",
    payNotReady: "Chipta to‘lovga tayyor emas.",
    payDue: "Bir 20 × 12 juft uchun {amount}.",
    payOffline:
      "Karta to‘lovi hali ochilmagan. Bu yerga karta raqamini yozmang. Chipta to‘lanmagan qoladi.",
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
  },
  tg: {
    payTitle: "Пардохт барои чиптаи {id}",
    payLead: "Jumaboev Signs · ҷуфти 20 × 12.",
    payInvalid: "Ин пайванди пардохт нодуруст аст.",
    payNoPrice: "Хуршид ҳанӯз нарх нагузоштааст.",
    payNotReady: "Чипта барои пардохт омода нест.",
    payDue: "Барои як ҷуфти 20 × 12 {amount}.",
    payOffline:
      "Пардохти корт ҳанӯз кушода нест. Рақами корт нанависед. Чипта пардохтнашуда мемонад.",
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
  },
  ru: {
    payTitle: "Оплата заявки {id}",
    payLead: "Jumaboev Signs · пара 20 × 12.",
    payInvalid: "Эта ссылка на оплату недействительна.",
    payNoPrice: "Хуршид ещё не назначил цену.",
    payNotReady: "Заявка не готова к оплате.",
    payDue: "К оплате {amount} за одну пару 20 × 12.",
    payOffline:
      "Оплата картой в этом цехе ещё не включена. Не вводите номер карты. Заявка остаётся неоплаченной.",
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
  },
  kk: {
    payTitle: "{id} билетіне төлем",
    payLead: "Jumaboev Signs · 20 × 12 жұп.",
    payInvalid: "Бұл төлем сілтемесі жарамсыз.",
    payNoPrice: "Хуршид әлі баға қоймады.",
    payNotReady: "Билет төлемге дайын емес.",
    payDue: "Бір 20 × 12 жұп үшін {amount}.",
    payOffline:
      "Карта төлемі әлі ашық емес. Карта нөмірін жазбаңыз. Билет төленбеген күйде қалады.",
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
  },
  ky: {
    payTitle: "{id} билетине төлөм",
    payLead: "Jumaboev Signs · 20 × 12 жуп.",
    payInvalid: "Бул төлөм шилтемеси жараксыз.",
    payNoPrice: "Хуршид азырынча баа койгон жок.",
    payNotReady: "Билет төлөмгө даяр эмес.",
    payOffline:
      "Карта төлөмү ачыла элек. Карта номерин жазбаңыз. Билет төлөнбөй калат.",
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
  },
  uk: {
    payTitle: "Оплата заявки {id}",
    payLead: "Jumaboev Signs · пара 20 × 12.",
    payInvalid: "Це посилання на оплату недійсне.",
    payNoPrice: "Хуршид ще не призначив ціну.",
    payNotReady: "Заявка не готова до оплати.",
    payDue: "До сплати {amount} за одну пару 20 × 12.",
    payOffline:
      "Оплата карткою в цьому цеху ще не ввімкнена. Не вводьте номер картки. Заявка лишається несплаченою.",
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
