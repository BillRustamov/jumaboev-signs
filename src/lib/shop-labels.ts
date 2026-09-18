import type { ShopLang } from "@/lib/shop-entry";
import { uiT, type UiKey } from "@/lib/shop-copy";
import type { CatalogFilter, DriverSample, SampleCategory } from "@/lib/samples";
import type { ArtworkFit } from "@/lib/artwork";
import type { TemplateId } from "@/lib/design/schema";
import type { LogoSize } from "@/lib/logo-size";
import { STYLE_PRESETS } from "@/lib/sign-style";
import { TEMPLATES } from "@/lib/design/schema";

const SAMPLE_LABEL: Record<string, UiKey> = {
  "clean-white": "catWhiteMinimal",
  "logo-spotlight": "catLogoFocused",
  "side-by-side": "catLogoFocused",
  "direct-truck": "catClassic",
  "classic-plaque": "catPremium",
  blank: "catUpload",
};

const SAMPLE_NAME: Record<string, Record<ShopLang, string>> = {
  "clean-white": {
    en: "Clean white",
    uz: "Toza oq",
    tg: "Сафеди тоза",
    ru: "Чистый белый",
    kk: "Таза ақ",
    ky: "Таза ак",
    uk: "Чистий білий",
  },
  "logo-spotlight": {
    en: "Logo spotlight",
    uz: "Logo markazda",
    tg: "Лого дар марказ",
    ru: "Логотип в центре",
    kk: "Логотип ортада",
    ky: "Логотип борбордо",
    uk: "Логотип у центрі",
  },
  "side-by-side": {
    en: "Side by side",
    uz: "Yonma-yon",
    tg: "Паҳлӯ ба паҳлӯ",
    ru: "Рядом",
    kk: "Қатар",
    ky: "Катар",
    uk: "Поруч",
  },
  "direct-truck": {
    en: "Direct lettering",
    uz: "To‘g‘ridan-to‘g‘ri yozuv",
    tg: "Навиштаи мустақим",
    ru: "Прямая надпись",
    kk: "Тікелей жазу",
    ky: "Түз жазуу",
    uk: "Прямий напис",
  },
  "classic-plaque": {
    en: "Classic plaque",
    uz: "Klassik plaketka",
    tg: "Лавҳаи классикӣ",
    ru: "Классическая табличка",
    kk: "Классикалық тақта",
    ky: "Классикалык такта",
    uk: "Класична табличка",
  },
  blank: {
    en: "Blank door",
    uz: "Bo‘sh eshik",
    tg: "Дари холӣ",
    ru: "Пустая дверь",
    kk: "Бос есік",
    ky: "Бош эшик",
    uk: "Порожні двері",
  },
};

const SAMPLE_HINT: Record<string, Record<ShopLang, string>> = {
  "clean-white": {
    en: "20 × 12 in · white vinyl · black lettering",
    uz: "20 × 12 dyuym · oq vinil · qora yozuv",
    tg: "20 × 12 дюйм · винили сафед · навиштаи сиёҳ",
    ru: "20 × 12 дюймов · белый винил · чёрная надпись",
    kk: "20 × 12 дюйм · ақ винил · қара жазу",
    ky: "20 × 12 дюйм · ак винил · кара жазуу",
    uk: "20 × 12 дюймів · білий вініл · чорний напис",
  },
  "logo-spotlight": {
    en: "20 × 12 in · large mark, name and IDs below",
    uz: "20 × 12 dyuym · katta belgi, nom va ID pastida",
    tg: "20 × 12 дюйм · нишони калон, ном ва ID дар поён",
    ru: "20 × 12 дюймов · крупный знак, имя и ID снизу",
    kk: "20 × 12 дюйм · үлкен белгі, атау мен ID төменде",
    ky: "20 × 12 дюйм · чоң белги, ат жана ID ылдыйда",
    uk: "20 × 12 дюймів · великий знак, назва й ID знизу",
  },
  "side-by-side": {
    en: "20 × 12 in · wide mark left, lettering right",
    uz: "20 × 12 dyuym · keng belgi chapda, yozuv o‘ngda",
    tg: "20 × 12 дюйм · нишони васеъ чап, навиштаҷот рост",
    ru: "20 × 12 дюймов · широкий знак слева, надпись справа",
    kk: "20 × 12 дюйм · кең белгі солда, жазу оңда",
    ky: "20 × 12 дюйм · кең белги солдо, жазуу оңдо",
    uk: "20 × 12 дюймів · широкий знак ліворуч, напис праворуч",
  },
  "direct-truck": {
    en: "20 × 12 in · cut type, no filled plaque",
    uz: "20 × 12 dyuym · kesilgan yozuv, to‘ldirilgan plaketka yo‘q",
    tg: "20 × 12 дюйм · навиштаи бурида, лавҳаи пур нест",
    ru: "20 × 12 дюймов · вырезанный шрифт, без заливки",
    kk: "20 × 12 дюйм · кесілген жазу, толтырылған тақта жоқ",
    ky: "20 × 12 дюйм · кесилген жазуу, толтурулган такта жок",
    uk: "20 × 12 дюймів · вирізаний шрифт, без заливки",
  },
  "classic-plaque": {
    en: "20 × 12 in · navy ID bands on a printed board",
    uz: "20 × 12 dyuym · chop taxtada to‘q ko‘k ID tasmalar",
    tg: "20 × 12 дюйм · тасмаҳои ID-и тӯсӣ дар лавҳаи чоп",
    ru: "20 × 12 дюймов · тёмно-синие полосы ID на печатной доске",
    kk: "20 × 12 дюйм · баспа тақтада қою көк ID жолақтар",
    ky: "20 × 12 дюйм · басма тактада кочкул көк ID тилкелер",
    uk: "20 × 12 дюймів · темно-сині смуги ID на друкованій дошці",
  },
  blank: {
    en: "Start with your numbers",
    uz: "Raqamlaringizdan boshlang",
    tg: "Аз рақамҳои худ оғоз кунед",
    ru: "Начните со своих номеров",
    kk: "Нөмірлеріңізден бастаңыз",
    ky: "Номерлериңизден баштаңыз",
    uk: "Почніть зі своїх номерів",
  },
};

const PRESET_NAME: Record<string, Record<ShopLang, string>> = {
  "white-black": {
    en: "White",
    uz: "Oq",
    tg: "Сафед",
    ru: "Белый",
    kk: "Ақ",
    ky: "Ак",
    uk: "Білий",
  },
  "white-navy": {
    en: "White navy",
    uz: "Oq-ko‘k",
    tg: "Сафед-тӯсӣ",
    ru: "Белый синий",
    kk: "Ақ-көк",
    ky: "Ак-көк",
    uk: "Білий синій",
  },
  "white-red": {
    en: "White red",
    uz: "Oq-qizil",
    tg: "Сафед-сурх",
    ru: "Белый красный",
    kk: "Ақ-қызыл",
    ky: "Ак-кызыл",
    uk: "Білий червоний",
  },
  "white-gold": {
    en: "White gold",
    uz: "Oq-oltin",
    tg: "Сафед-тилло",
    ru: "Белый золотой",
    kk: "Ақ-алтын",
    ky: "Ак-алтын",
    uk: "Білий золотий",
  },
  "cut-black": {
    en: "Cut black",
    uz: "Kesilgan qora",
    tg: "Сиёҳи бурида",
    ru: "Вырезанный чёрный",
    kk: "Кесілген қара",
    ky: "Кесилген кара",
    uk: "Вирізаний чорний",
  },
  "gold-navy": {
    en: "Navy gold",
    uz: "To‘q ko‘k oltin",
    tg: "Тиллои тӯсӣ",
    ru: "Золото на синем",
    kk: "Алтын қою көк",
    ky: "Алтын кочкул көк",
    uk: "Золото на синьому",
  },
  black: {
    en: "Black plaque",
    uz: "Qora plaketka",
    tg: "Лавҳаи сиёҳ",
    ru: "Чёрная табличка",
    kk: "Қара тақта",
    ky: "Кара такта",
    uk: "Чорна табличка",
  },
  "red-line": {
    en: "Red plaque",
    uz: "Qizil plaketka",
    tg: "Лавҳаи сурх",
    ru: "Красная табличка",
    kk: "Қызыл тақта",
    ky: "Кызыл такта",
    uk: "Червона табличка",
  },
  asphalt: {
    en: "Charcoal",
    uz: "Ko‘mir rang",
    tg: "Ангишт",
    ru: "Уголь",
    kk: "Көмір",
    ky: "Көмүр",
    uk: "Вугілля",
  },
};

const PRESET_HINT: Record<string, Record<ShopLang, string>> = {
  "white-black": {
    en: "White vinyl · black lettering",
    uz: "Oq vinil · qora yozuv",
    tg: "Винили сафед · навиштаи сиёҳ",
    ru: "Белый винил · чёрная надпись",
    kk: "Ақ винил · қара жазу",
    ky: "Ак винил · кара жазуу",
    uk: "Білий вініл · чорний напис",
  },
  "white-navy": {
    en: "White vinyl · navy type",
    uz: "Oq vinil · to‘q ko‘k yozuv",
    tg: "Винили сафед · ҳуруфи тӯсӣ",
    ru: "Белый винил · синий шрифт",
    kk: "Ақ винил · қою көк жазу",
    ky: "Ак винил · кочкул көк жазуу",
    uk: "Білий вініл · синій шрифт",
  },
  "white-red": {
    en: "White vinyl · red type",
    uz: "Oq vinil · qizil yozuv",
    tg: "Винили сафед · ҳуруфи сурх",
    ru: "Белый винил · красный шрифт",
    kk: "Ақ винил · қызыл жазу",
    ky: "Ак винил · кызыл жазуу",
    uk: "Білий вініл · червоний шрифт",
  },
  "white-gold": {
    en: "White vinyl · black type · gold rules",
    uz: "Oq vinil · qora yozuv · oltin chiziqlar",
    tg: "Винили сафед · ҳуруфи сиёҳ · хатҳои тилло",
    ru: "Белый винил · чёрный шрифт · золотые линии",
    kk: "Ақ винил · қара жазу · алтын сызықтар",
    ky: "Ак винил · кара жазуу · алтын сызыктар",
    uk: "Білий вініл · чорний шрифт · золоті лінії",
  },
  "cut-black": {
    en: "Black lettering · no vinyl plaque",
    uz: "Qora yozuv · vinil plaketka yo‘q",
    tg: "Навиштаи сиёҳ · лавҳаи винил нест",
    ru: "Чёрная надпись · без виниловой таблички",
    kk: "Қара жазу · винил тақта жоқ",
    ky: "Кара жазуу · винил такта жок",
    uk: "Чорний напис · без вінілової таблички",
  },
  "gold-navy": {
    en: "Printed plaque · gold on navy",
    uz: "Chop plaketka · to‘q ko‘kda oltin",
    tg: "Лавҳаи чоп · тилло дар тӯсӣ",
    ru: "Печатная табличка · золото на синем",
    kk: "Баспа тақта · қою көкте алтын",
    ky: "Басма такта · кочкул көктө алтын",
    uk: "Друкована табличка · золото на синьому",
  },
  black: {
    en: "Printed plaque · white on black",
    uz: "Chop plaketka · qorada oq",
    tg: "Лавҳаи чоп · сафед дар сиёҳ",
    ru: "Печатная табличка · белое на чёрном",
    kk: "Баспа тақта · қарада ақ",
    ky: "Басма такта · карада ак",
    uk: "Друкована табличка · біле на чорному",
  },
  "red-line": {
    en: "Printed plaque · white on red",
    uz: "Chop plaketka · qizilda oq",
    tg: "Лавҳаи чоп · сафед дар сурх",
    ru: "Печатная табличка · белое на красном",
    kk: "Баспа тақта · қызылда ақ",
    ky: "Басма такта · кызылда ак",
    uk: "Друкована табличка · біле на червоному",
  },
  asphalt: {
    en: "Printed plaque · charcoal with orange",
    uz: "Chop plaketka · ko‘mir rang va apelsin",
    tg: "Лавҳаи чоп · ангишт бо норанҷӣ",
    ru: "Печатная табличка · уголь с оранжевым",
    kk: "Баспа тақта · көмір және қызғылт сары",
    ky: "Басма такта · көмүр жана кызгылт сары",
    uk: "Друкована табличка · вугілля з помаранчевим",
  },
};

const CATEGORY_LABEL: Record<SampleCategory, UiKey> = {
  "white-minimal": "catWhiteMinimal",
  "logo-focused": "catLogoFocused",
  "classic-lettering": "catClassic",
  "premium-plaque": "catPremium",
  upload: "catUpload",
};

const CATEGORY_BLURB: Record<SampleCategory, UiKey> = {
  "white-minimal": "catWhiteMinimalBlurb",
  "logo-focused": "catLogoFocusedBlurb",
  "classic-lettering": "catClassicBlurb",
  "premium-plaque": "catPremiumBlurb",
  upload: "catUploadBlurb",
};

const FILTER_LABEL: Record<CatalogFilter, UiKey> = {
  all: "filterAll",
  white: "filterWhite",
  dark: "filterDark",
  "with-logo": "filterWithLogo",
  "no-logo": "filterNoLogo",
};

const ARTWORK_FIT_LABEL: Record<ArtworkFit, UiKey> = {
  contain: "fitEntire",
  cover: "cropToFill",
  margins: "addMargins",
  original: "keepAspect",
};

const ARTWORK_FIT_HINT: Record<ArtworkFit, UiKey> = {
  contain: "fitEntireHint",
  cover: "cropToFillHint",
  margins: "addMarginsHint",
  original: "keepAspectHint",
};

const LOGO_SIZE_KEY: Record<LogoSize, UiKey> = {
  1: "logoSmall",
  2: "logoMedium",
  3: "logoLarge",
  4: "logoXl",
  5: "logoFullFace",
};

const NOTE_EXACT: Record<string, UiKey> = {
  "Enter the MCS-150 name (legal name or one trade name) for the door.": "noteNeedName",
  "USDOT number should be 4–12 digits.": "noteUsdotDigits",
  "MC (FMCSA) number should be 4–10 digits.": "noteMcDigits",
  "Username must be 3–24 letters, numbers, or underscores.": "noteUsername",
  "Door name vs background is low contrast for 50-foot daylight reading.":
    "noteContrastName",
  "USDOT and MC vs background is low contrast for 50-foot daylight reading.":
    "noteContrastLegal",
  "ID band lettering vs the band is low contrast for 50-foot daylight reading.":
    "noteContrastPlate",
  "Turned MC back on so the shop-required ID prints.": "noteMcOn",
  "Enlarged the logo so it reads as a major mark.": "noteEnlargedLogo",
  "Switched to white vinyl and black lettering for daylight contrast.": "noteWhiteBlack",
  "Switched to condensed so the company name stays large.": "noteCondensed",
  "Crop-to-fill stays on — it is an explicit choice, not a default.": "noteCropStays",
  "Kept the upload on a 20 × 12 in board. Flattened type was not rewritten.":
    "noteKeptUpload",
  "Pushed the logo to full-face so it is not a postage stamp.": "noteFullFace",
  "Nudged the logo down one size so it does not cover USDOT.": "noteNudgedLogo",
  "Moved to Clean white so USDOT stays fully on the 20 × 12 in board.": "noteCleanWhite",
  "Kept the production sheet at 20 × 12 in.": "noteKeptSheet",
  "Spacing, name fit, logo, and required IDs already look print-ready.": "notePrintReady",
  "Set an approved price in cents before Ready for payment.": "notePriceFirst",
  "A cancelled ticket cannot be ready for payment.": "noteCancelledPay",
  "This ticket is already marked paid.": "noteAlreadyPaid",
  "Payment status is not set by hand. Paid is set only from a verified Stripe webhook.":
    "noteHandPaid",
  "Could not update this ticket.": "couldNotUpdate",
  "Could not reach the shop list.": "couldNotReach",
  "This ticket is not on the shop list.": "ticketNotOnList",
  "Could not open that ticket.": "couldNotOpenTicket",
};

export function sampleName(lang: ShopLang, id: string): string {
  return SAMPLE_NAME[id]?.[lang] ?? SAMPLE_NAME[id]?.en ?? id;
}

export function sampleHint(lang: ShopLang, id: string): string {
  return SAMPLE_HINT[id]?.[lang] ?? SAMPLE_HINT[id]?.en ?? "";
}

export function sampleLabelOf(lang: ShopLang, sample: DriverSample): string {
  return sampleName(lang, sample.id);
}

export function sampleHintOf(lang: ShopLang, sample: DriverSample): string {
  return sampleHint(lang, sample.id);
}

export function presetName(lang: ShopLang, id: string): string {
  return PRESET_NAME[id]?.[lang] ?? STYLE_PRESETS.find((p) => p.id === id)?.label ?? id;
}

export function presetHint(lang: ShopLang, id: string): string {
  return PRESET_HINT[id]?.[lang] ?? STYLE_PRESETS.find((p) => p.id === id)?.hint ?? "";
}

export function templateName(lang: ShopLang, id: TemplateId | string): string {
  return sampleName(lang, id);
}

export function templateNameFromEnglish(lang: ShopLang, english: string): string {
  const match = TEMPLATES.find((item) => item.label === english);
  if (match) return templateName(lang, match.id);
  const bySample = Object.entries(SAMPLE_NAME).find(([, row]) => row.en === english);
  if (bySample) return bySample[1][lang];
  return english;
}

export function categoryLabel(lang: ShopLang, id: SampleCategory): string {
  return uiT(lang, CATEGORY_LABEL[id]);
}

export function categoryBlurb(lang: ShopLang, id: SampleCategory): string {
  return uiT(lang, CATEGORY_BLURB[id]);
}

export function filterLabel(lang: ShopLang, id: CatalogFilter): string {
  return uiT(lang, FILTER_LABEL[id]);
}

export function artworkFitLabel(lang: ShopLang, id: ArtworkFit): string {
  return uiT(lang, ARTWORK_FIT_LABEL[id]);
}

export function artworkFitHint(lang: ShopLang, id: ArtworkFit): string {
  return uiT(lang, ARTWORK_FIT_HINT[id]);
}

export function logoSizeName(lang: ShopLang, size: LogoSize): string {
  return uiT(lang, LOGO_SIZE_KEY[size]);
}

export function productTypeName(lang: ShopLang, sample: DriverSample): string {
  if (sample.id === "blank") return uiT(lang, "typeYourArtwork");
  if (sample.fields.templateId === "direct-truck") return uiT(lang, "typeCutLettering");
  if (sample.fields.templateId === "classic-plaque") return uiT(lang, "typePrintedPlaque");
  return uiT(lang, "typeWhiteVinyl");
}

export function colorNameOf(lang: ShopLang, sample: DriverSample): string {
  const preset = STYLE_PRESETS.find((item) => item.id === sample.fields.paletteId);
  return preset ? presetName(lang, preset.id) : uiT(lang, "typeCustom");
}

export function localizeNote(lang: ShopLang, note: string): string {
  const exact = NOTE_EXACT[note];
  if (exact) return uiT(lang, exact);
  const moved = /^Moved to (.+) so the mark and name share the 20 × 12 in board\.$/.exec(
    note,
  );
  if (moved) {
    return uiT(lang, "noteMovedShare", {
      layout: templateNameFromEnglish(lang, moved[1]),
    });
  }
  const changed =
    /^Changed layout to (.+) so the logo does not cover required lettering\.$/.exec(note);
  if (changed) {
    return uiT(lang, "noteChangedLayout", {
      layout: templateNameFromEnglish(lang, changed[1]),
    });
  }
  return note;
}

export function localizeNotes(lang: ShopLang, notes: string[]): string[] {
  return notes.map((note) => localizeNote(lang, note));
}

void SAMPLE_LABEL;
