import { LANGS, type ShopLang } from "@/lib/shop-entry";

export type UiKey =
  | "headerTagline"
  | "adminNav"
  | "cartNav"
  | "printDeskKicker"
  | "pickLookTitle"
  | "pickLookLead"
  | "tapSample"
  | "tapSampleLead"
  | "tapSampleLeadMobile"
  | "inUse"
  | "liveVinyl"
  | "liveVinylHasName"
  | "liveVinylGhost"
  | "sizeEachSide"
  | "printTicket"
  | "printTicketLead"
  | "stepLettering"
  | "stepColors"
  | "stepLayout"
  | "lettering"
  | "colors"
  | "layout"
  | "letteringHint"
  | "colorsHint"
  | "layoutHint"
  | "done"
  | "must"
  | "layoutReadyBtn"
  | "layoutReadyDone"
  | "addPair"
  | "finishSteps"
  | "autoImprove"
  | "reset"
  | "cartUntilReady"
  | "cartShowsTruck"
  | "couldNotFinish"
  | "pairInCart"
  | "pairInCartLead"
  | "viewCart"
  | "checkout"
  | "demoLettering"
  | "logoTypeError"
  | "logoSizeError"
  | "logoReadError"
  | "needNameDot"
  | "needColors"
  | "needLayout"
  | "doorSamplesAria"
  | "mcs150Name"
  | "mcs150Hint"
  | "doorNamePlaceholder"
  | "cityState"
  | "cityStateHint"
  | "usdotNumber"
  | "usdotHint"
  | "usdotPlaceholder"
  | "mcNumber"
  | "mcHint"
  | "mcPlaceholder"
  | "logoOrDoor"
  | "logoAttached"
  | "logoEmpty"
  | "removeFile"
  | "checkContrast"
  | "onCabDoor"
  | "recutSwatch"
  | "colorDoorName"
  | "colorUsdotMc"
  | "colorFace"
  | "colorBorder"
  | "letteringColor"
  | "accentColor"
  | "moreBackgrounds"
  | "moreLayouts"
  | "accentNone"
  | "logoKeepsIds"
  | "layoutLabel"
  | "layoutCardsHint"
  | "doorFont"
  | "fontCondensed"
  | "fontSans"
  | "fontSerif"
  | "sideChevrons"
  | "sideChevronsHint"
  | "layoutMarkedReady"
  | "layoutTapToLock"
  | "howFilePrints"
  | "companyLogo"
  | "existingDoorSign"
  | "flattenedTitle"
  | "flattenedBody"
  | "originalStored"
  | "placeOnBoard"
  | "cropFillNote"
  | "nudgeH"
  | "nudgeV"
  | "resetPlacement"
  | "logoIsName"
  | "logoIsNameHint"
  | "fitEntire"
  | "fitEntireHint"
  | "cropToFill"
  | "cropToFillHint"
  | "addMargins"
  | "addMarginsHint"
  | "keepAspect"
  | "keepAspectHint"
  | "logoSizeVinyl"
  | "logoSizeNeedUpload"
  | "logoSizeHowLarge"
  | "logoSmall"
  | "logoMedium"
  | "logoLarge"
  | "logoXl"
  | "logoFullFace"
  | "continue"
  | "wizardLetteringLead"
  | "wizardColorsLead"
  | "wizardLayoutLead"
  | "couldNotContinue"
  | "printTicketProgress"
  | "samplesKicker"
  | "samplesTitle"
  | "samplesLead"
  | "allLooks"
  | "allLooksBlurb"
  | "filter"
  | "noDoorsMatch"
  | "noDoorsMatchLead"
  | "clearFilters"
  | "yourLogoOrPhoto"
  | "uploadCardHint"
  | "customizeThis"
  | "onATruck"
  | "inspectLooksOnly"
  | "inspectArt"
  | "inspectTruck"
  | "catWhiteMinimal"
  | "catWhiteMinimalBlurb"
  | "catLogoFocused"
  | "catLogoFocusedBlurb"
  | "catClassic"
  | "catClassicBlurb"
  | "catPremium"
  | "catPremiumBlurb"
  | "catUpload"
  | "catUploadBlurb"
  | "filterAll"
  | "filterWhite"
  | "filterDark"
  | "filterWithLogo"
  | "filterNoLogo"
  | "typeYourArtwork"
  | "typeCutLettering"
  | "typePrintedPlaque"
  | "typeWhiteVinyl"
  | "typeCustom"
  | "cartKicker"
  | "cartTitle"
  | "cartLead"
  | "cartEmpty"
  | "cartEmptyLead"
  | "doorPair"
  | "setOfTwo"
  | "cartItemNote"
  | "editAnother"
  | "remove"
  | "keepDesigning"
  | "checkoutOnTruck"
  | "cartEmptyMini"
  | "openCart"
  | "printDesk"
  | "shoppingCart"
  | "setOfTwoUsdot"
  | "checkoutKicker"
  | "checkoutTitle"
  | "checkoutLead"
  | "nothingCheckout"
  | "nothingCheckoutLead"
  | "sendToShop"
  | "sendToShopLead"
  | "couldNotCheckout"
  | "usernameRejected"
  | "shopUsername"
  | "sendingToShop"
  | "placeOnePair"
  | "placeManyPairs"
  | "orderReceived"
  | "orderReceivedLead"
  | "downloadPrintSheet"
  | "adminPrintDesk"
  | "viewShopOrders"
  | "checkoutPreviewNote"
  | "cartNoComplete"
  | "savedAfterNetwork"
  | "queueKicker"
  | "shopOrdersTitle"
  | "showingSaved"
  | "noDoorOrders"
  | "noOrdersForUser"
  | "noOrdersAnon"
  | "signIn"
  | "createAccount"
  | "accountNav"
  | "accountKicker"
  | "accountTitle"
  | "accountLead"
  | "accountEmail"
  | "accountPassword"
  | "accountPasswordHint"
  | "accountSignIn"
  | "accountSignUp"
  | "accountSignedInAs"
  | "accountHistoryLead"
  | "accountSignOut"
  | "accountSaveHistory"
  | "checkoutSignedIn"
  | "checkoutCreateAccount"
  | "ordersSignInHint"
  | "accountWorking"
  | "accountCreated"
  | "printSheet"
  | "printExistingTag"
  | "adminKicker"
  | "printSheetsTitle"
  | "cutterSheet"
  | "cutterSheetLead"
  | "openSampleSheet"
  | "noTickets"
  | "noTicketsLead"
  | "printOriginalNote"
  | "couldNotUpdate"
  | "couldNotReach"
  | "openingSheet"
  | "shopPrintDesk"
  | "printOriginalTitle"
  | "printOriginalBody"
  | "noTicketPrint"
  | "unknownOrder"
  | "cutterReady"
  | "downloadSheetBtn"
  | "ticketNotOnList"
  | "couldNotOpenTicket"
  | "printOnlyTag"
  | "printFile"
  | "suggestedOnSleeper"
  | "forDrivers"
  | "startFromSample"
  | "startFromSampleLead"
  | "layoutAndFederal"
  | "layoutAndFederalLead"
  | "specCompany"
  | "specCompanyBody"
  | "specUsdot"
  | "specUsdotBody"
  | "specMc"
  | "specMcBody"
  | "specLogo"
  | "specLogoBody"
  | "specColors"
  | "specColorsBody"
  | "specPair"
  | "specPairBody"
  | "step1"
  | "step1Body"
  | "step2"
  | "step2Body"
  | "step3"
  | "step3Body"
  | "telegramSame"
  | "telegramSameLead"
  | "openTelegram"
  | "useThisDoor"
  | "examplePlaque"
  | "replaceWithCarrier"
  | "itemCol"
  | "exampleSizeCol"
  | "stickerWidth"
  | "stickerHeight"
  | "companyNameLetters"
  | "usdotLetters"
  | "mcLetters"
  | "officialFederal"
  | "requirementCol"
  | "fmcsaRuleCol"
  | "minLetterHeight"
  | "minLetterHeightRule"
  | "readability"
  | "readabilityRule"
  | "placementReq"
  | "placementRule"
  | "colorReq"
  | "colorRule"
  | "companyNameReq"
  | "companyNameReqRule"
  | "usdotReq"
  | "usdotReqRule"
  | "mcReq"
  | "mcReqRule"
  | "materialReq"
  | "materialRule"
  | "cfrNote"
  | "inch20"
  | "inch12"
  | "leftDoor"
  | "rightDoor"
  | "signCloseup"
  | "onTheDoor"
  | "driverSide"
  | "otherSide"
  | "artworkPrint"
  | "otherSideLook"
  | "onCabPreview"
  | "doorVinylTitle"
  | "doorVinylDesc"
  | "placement"
  | "nudgeLeft"
  | "nudgeRight"
  | "nudgeUp"
  | "nudgeDown"
  | "nudgeSmaller"
  | "nudgeLarger"
  | "inspectDoorVinyl"
  | "inspectArtwork"
  | "pageNotInShop"
  | "pageNotInShopLead"
  | "home"
  | "printDeskHitSnag"
  | "reloadOrBack"
  | "tryAgain"
  | "doorVinyl"
  | "previewAria"
  | "sourceWeb"
  | "sourceTelegram"
  | "noteNeedName"
  | "noteUsdotDigits"
  | "noteMcDigits"
  | "noteUsername"
  | "noteContrastName"
  | "noteContrastLegal"
  | "noteContrastPlate"
  | "noteMcOn"
  | "noteMovedShare"
  | "noteEnlargedLogo"
  | "noteReducedLogo"
  | "noteReducedLogoHint"
  | "noteLogoSmall"
  | "noteWhiteBlack"
  | "noteCondensed"
  | "noteCropStays"
  | "noteKeptUpload"
  | "noteFullFace"
  | "noteChangedLayout"
  | "noteNudgedLogo"
  | "noteCleanWhite"
  | "noteKeptSheet"
  | "notePrintReady"
  | "notePriceFirst"
  | "noteCancelledPay"
  | "noteAlreadyPaid"
  | "noteHandPaid"
  | "noteEmailInvalid"
  | "notePasswordShort"
  | "noteAccountExists"
  | "noteAccountWrong"
  | "noteTooManyAuth"
  | "size20in"
  | "size12in"
  | "size23in"
  | "size2in"
  | "inches20"
  | "inches12"
  | "cartCount"
  | "cartEmptyAria";

type Row = Record<ShopLang, string>;

function L(
  en: string,
  uz: string,
  tg: string,
  ru: string,
  kk: string,
  ky: string,
  uk: string,
): Row {
  return { en, uz, tg, ru, kk, ky, uk };
}

function pack<K extends string>(
  rows: Record<K, Row>,
): Record<ShopLang, Record<K, string>> {
  const out = Object.fromEntries(
    LANGS.map((lang) => [lang, {} as Record<K, string>]),
  ) as Record<ShopLang, Record<K, string>>;
  for (const key of Object.keys(rows) as K[]) {
    for (const lang of LANGS) {
      out[lang][key] = rows[key][lang];
    }
  }
  return out;
}

const UI_ROWS: Record<UiKey, Row> = {
  headerTagline: L(
    "USDOT door vinyl · 20 × 12 in each side",
    "USDOT eshik vinili · har tomon 20 × 12 dyuym",
    "Винили дари USDOT · ҳар тараф 20 × 12 дюйм",
    "USDOT-винил на дверь · 20 × 12 дюймов на сторону",
    "USDOT есік винилі · әр жақ 20 × 12 дюйм",
    "USDOT эшик винили · ар тарап 20 × 12 дюйм",
    "USDOT-вініл на двері · 20 × 12 дюймів на бік",
  ),
  adminNav: L("Admin", "Admin", "Админ", "Админ", "Әкімші", "Админ", "Адмін"),
  cartNav: L("Cart", "Savat", "Сабад", "Корзина", "Себет", "Себет", "Кошик"),
  printDeskKicker: L(
    "Print desk",
    "Chop stoli",
    "Мизи чоп",
    "Печатный стол",
    "Басу үстелі",
    "Басып чыгаруу столу",
    "Друкарський стіл",
  ),
  pickLookTitle: L(
    "Pick a look, then fill the ticket",
    "Ko‘rinishni tanlang, keyin chiptani to‘ldiring",
    "Намудро интихоб кунед, сипас чиптаро пур кунед",
    "Выберите вид, затем заполните заявку",
    "Көріністі таңдап, билетті толтырыңыз",
    "Көрүнүштү тандап, билетти толтуруңуз",
    "Оберіть вигляд, потім заповніть заявку",
  ),
  pickLookLead: L(
    "A sample is only the style. Before vinyl is cut you must set lettering, colors, and layout on the print ticket — your company name, city and state, USDOT, and MC, not the shop demo. Example cut is 20 × 12 in.",
    "Namuna faqat uslub. Vinil kesilishidan oldin chop chiptasida yozuv, rang va joylashuvni belgilang — kompaniya nomi, shahar va shtat, USDOT va MC, do‘kon namunasini emas. Kesim: 20 × 12 dyuym.",
    "Намуна танҳо услуб аст. Пеш аз буридани винил дар чиптаи чоп навиштаҷот, ранг ва тарҳро гузоред — номи ширкат, шаҳр ва иёлат, USDOT ва MC, на намоиши дӯкон. Андоза: 20 × 12 дюйм.",
    "Образец — только стиль. До резки винила укажите надпись, цвета и макет в заявке — имя компании, город и штат, USDOT и MC, не демо цеха. Пример: 20 × 12 дюймов.",
    "Үлгі тек стиль. Винил кесілмес бұрын билетте жазу, түс және орналасуды қойыңыз — компания атауы, қала мен штат, USDOT және MC, дүкен демосы емес. Өлшем: 20 × 12 дюйм.",
    "Үлгү болгону стиль. Винил кесилгенге чейин билетте жазуу, түс жана жайгашууну коюңуз — компаниянын аты, шаар жана штат, USDOT жана MC, дүкөн демосу эмес. Өлчөм: 20 × 12 дюйм.",
    "Зразок — лише стиль. Перед різкою вінілу вкажіть напис, кольори й макет у заявці — назва компанії, місто й штат, USDOT і MC, не демо цеху. Приклад: 20 × 12 дюймів.",
  ),
  tapSample: L(
    "Tap a sample",
    "Namunani bosing",
    "Намунаро пахш кунед",
    "Нажмите образец",
    "Үлгіні басыңыз",
    "Үлгүнү басыңыз",
    "Натисніть зразок",
  ),
  tapSampleLead: L(
    "This is the 20 × 12 in look. Your name, city and state, colors, and layout get set on the print ticket before we cut vinyl.",
    "Bu 20 × 12 dyuym ko‘rinish. Nom, shahar va shtat, rang va joylashuv chop chiptasida belgilanadi — vinil undan keyin kesiladi.",
    "Ин намуди 20 × 12 дюйм аст. Ном, шаҳр ва иёлат, ранг ва тарҳ дар чиптаи чоп гузошта мешаванд.",
    "Это вид 20 × 12 дюймов. Имя, город и штат, цвета и макет задаются в заявке до резки винила.",
    "Бұл 20 × 12 дюйм көрініс. Атау, қала мен штат, түс пен орналасу билетте қойылады.",
    "Бул 20 × 12 дюйм көрүнүш. Ат, шаар жана штат, түс жана жайгашуу билетте коюлат.",
    "Це вигляд 20 × 12 дюймів. Назва, місто й штат, кольори й макет задаються в заявці до різки.",
  ),
  tapSampleLeadMobile: L(
    "Swipe a look. Your numbers go on the ticket.",
    "Ko‘rinishni suring. Raqamlaringiz chiptaga yoziladi.",
    "Намудро лағжонед. Рақамҳоятон дар чипта мераванд.",
    "Пролистайте вид. Номера — в заявке.",
    "Көріністі сырғытыңыз. Нөмірлер билетте.",
    "Көрүнүштү сыдырыңыз. Номерлер билетте.",
    "Горніть вигляд. Номери — в заявці.",
  ),
  inUse: L(
    "in use",
    "ishlatilmoqda",
    "дар истифода",
    "выбран",
    "қолданылуда",
    "колдонулууда",
    "у виборі",
  ),
  liveVinyl: L(
    "Live vinyl",
    "Jonli vinil",
    "Винили зинда",
    "Живой винил",
    "Тірі винил",
    "Жандуу винил",
    "Живий вініл",
  ),
  liveVinylHasName: L(
    "This is what prints. Finish lettering, colors, and layout on the ticket.",
    "Chop shu. Chiptada yozuv, rang va joylashuvni tugating.",
    "Ин чоп мешавад. Дар чипта навиштаҷот, ранг ва тарҳро анҷом диҳед.",
    "Так и печатаем. Завершите надпись, цвета и макет в заявке.",
    "Осылай басылады. Билетте жазу, түс және орналасуды аяқтаңыз.",
    "Ушундай басылат. Билетте жазуу, түс жана жайгашууну бүтүрүңүз.",
    "Ось що друкуємо. Завершіть напис, кольори й макет у заявці.",
  ),
  liveVinylGhost: L(
    "Sample look is on. Type your MCS-150 name and USDOT to replace the ghost type.",
    "Namuna yoqilgan. MCS-150 nom va USDOT ni yozing — namuna yozuvi o‘rniga chiqadi.",
    "Намуна фурӯзон аст. Номи MCS-150 ва USDOT-ро нависед, то навиштаи намуна иваз шавад.",
    "Показан образец. Введите имя MCS-150 и USDOT, чтобы заменить демо-надпись.",
    "Үлгі қосулы. MCS-150 атауы мен USDOT жазыңыз — үлгі жазуы алмасады.",
    "Үлгү күйүк. MCS-150 аты жана USDOT жазыңыз — үлгү жазуусу алмашат.",
    "Увімкнено зразок. Введіть назву MCS-150 і USDOT, щоб замінити демо-напис.",
  ),
  sizeEachSide: L(
    "20 × 12 in each side",
    "Har tomon 20 × 12 dyuym",
    "Ҳар тараф 20 × 12 дюйм",
    "20 × 12 дюймов на сторону",
    "Әр жақ 20 × 12 дюйм",
    "Ар тарап 20 × 12 дюйм",
    "20 × 12 дюймів на бік",
  ),
  printTicket: L(
    "Print ticket",
    "Chop chiptasi",
    "Чиптаи чоп",
    "Заявка на печать",
    "Баспа билеті",
    "Басма билети",
    "Заявка на друк",
  ),
  printTicketLead: L(
    "Do these three, then add the pair to your cart. Unit numbers are a separate small print.",
    "Shu uchalani bajaring, keyin juftni savatga qo‘shing. Unit raqamlari alohida kichik chop.",
    "Ин серо анҷом диҳед, сипас ҷуфтро ба сабад илова кунед. Рақамҳои юнит чопи алоҳида аст.",
    "Сделайте эти три шага и добавьте пару в корзину. Бортовые номера — отдельная мелкая печать.",
    "Осы үшеуін жасап, жұпты себетке қосыңыз. Борт нөмірлері бөлек кіші баспа.",
    "Ушул үчөнү жасап, жупту себетке кошуңуз. Борт номерлери өзүнчө кичине басма.",
    "Зробіть ці три кроки й додайте пару в кошик. Бортові номери — окремий дрібний друк.",
  ),
  stepLettering: L(
    "1. Lettering",
    "1. Yozuv",
    "1. Навиштаҷот",
    "1. Надпись",
    "1. Жазу",
    "1. Жазуу",
    "1. Напис",
  ),
  stepColors: L(
    "2. Colors",
    "2. Ranglar",
    "2. Рангҳо",
    "2. Цвета",
    "2. Түстер",
    "2. Түстөр",
    "2. Кольори",
  ),
  stepLayout: L(
    "3. Layout",
    "3. Joylashuv",
    "3. Тарҳ",
    "3. Макет",
    "3. Орналасу",
    "3. Жайгашуу",
    "3. Макет",
  ),
  lettering: L("Lettering", "Yozuv", "Навиштаҷот", "Надпись", "Жазу", "Жазуу", "Напис"),
  colors: L("Colors", "Ranglar", "Рангҳо", "Цвета", "Түстер", "Түстөр", "Кольори"),
  layout: L("Layout", "Joylashuv", "Тарҳ", "Макет", "Орналасу", "Жайгашуу", "Макет"),
  letteringHint: L(
    "Required. Put the name, USDOT, and MC that should actually print — not the sample.",
    "Majburiy. Chop etiladigan nom, USDOT va MC ni yozing — namunani emas.",
    "Ҳатмӣ. Ном, USDOT ва MC-и чопшавандаро нависед — намуна не.",
    "Обязательно. Укажите имя, USDOT и MC, которые печатаем — не образец.",
    "Міндетті. Басылатын атау, USDOT және MC жазыңыз — үлгі емес.",
    "Милдеттүү. Басыла турган ат, USDOT жана MC жазыңыз — үлгү эмес.",
    "Обов’язково. Вкажіть назву, USDOT і MC, що друкуємо — не зразок.",
  ),
  colorsHint: L(
    "Required. Pick lettering and a small accent on white vinyl. Dark plaques stay optional.",
    "Majburiy. Oq vinilda yozuv rangi va kichik aksentni tanlang. Qorong‘i plaketkalar ixtiyoriy.",
    "Ҳатмӣ. Ранги навишта ва аксенти хурдро дар винили сафед интихоб кунед. Лавҳаҳои торик ихтиёрӣ мемонанд.",
    "Обязательно. Выберите цвет надписи и небольшой акцент на белом виниле. Тёмные таблички остаются опцией.",
    "Міндетті. Ақ винилде жазу түсі мен кіші акцентті таңдаңыз. Қою тақталар қосымша болып қалады.",
    "Милдеттүү. Ак винилде жазуу түсүн жана кичине акцентти тандаңыз. Кара такталар кошумча бойдон калат.",
    "Обов’язково. Оберіть колір напису і невеликий акцент на білому вінілі. Темні таблички лишаються опцією.",
  ),
  layoutHint: L(
    "Required. Pick a layout, set logo size, and choose a door font. What you see is what prints.",
    "Majburiy. Joylashuvni tanlang, logo o‘lchamini qo‘ying, shriftni belgilang. Ko‘rganingiz chop etiladi.",
    "Ҳатмӣ. Тарҳро интихоб кунед, андозаи лого ва ҳуруфро гузоред. Он чи мебинед, чоп мешавад.",
    "Обязательно. Выберите макет, размер логотипа и шрифт. Что видите — то и печатаем.",
    "Міндетті. Орналасуды, логотип өлшемін және қаріпті таңдаңыз. Көргеніңіз басылады.",
    "Милдеттүү. Жайгашууну, логотип өлчөмүн жана арипти тандаңыз. Көргөнүңүз басылат.",
    "Обов’язково. Оберіть макет, розмір логотипа й шрифт. Що бачите — те й друкуємо.",
  ),
  done: L("Done", "Tayyor", "Тайёр", "Готово", "Дайын", "Даяр", "Готово"),
  must: L("Must", "Shart", "Ҳатмӣ", "Нужно", "Міндетті", "Милдеттүү", "Треба"),
  layoutReadyBtn: L(
    "This layout is ready",
    "Bu joylashuv tayyor",
    "Ин тарҳ омода аст",
    "Этот макет готов",
    "Бұл орналасу дайын",
    "Бул жайгашуу даяр",
    "Цей макет готовий",
  ),
  layoutReadyDone: L(
    "Layout ready for print",
    "Joylashuv chopga tayyor",
    "Тарҳ барои чоп омода",
    "Макет готов к печати",
    "Орналасу басуға дайын",
    "Жайгашуу басууга даяр",
    "Макет готовий до друку",
  ),
  addPair: L(
    "Add pair to cart",
    "Juftni savatga qo‘shish",
    "Ҷуфтро ба сабад илова кун",
    "Добавить пару в корзину",
    "Жұпты себетке қосу",
    "Жупту себетке кошуу",
    "Додати пару в кошик",
  ),
  finishSteps: L(
    "Finish required steps first",
    "Avval majburiy qadamlarni tugating",
    "Аввал қадамҳои ҳатмиро анҷом диҳед",
    "Сначала завершите обязательные шаги",
    "Алдымен міндетті қадамдарды аяқтаңыз",
    "Адегенде милдеттүү кадамдарды бүтүрүңүз",
    "Спочатку завершіть обов’язкові кроки",
  ),
  autoImprove: L(
    "Auto Improve",
    "Avto yaxshilash",
    "Беҳбуди худкор",
    "Автоулучшение",
    "Авто жақсарту",
    "Авто жакшыртуу",
    "Автопокращення",
  ),
  reset: L("Reset", "Qayta", "Аз нав", "Сбросить", "Қалпына", "Кайта", "Скинути"),
  cartUntilReady: L(
    "Vinyl does not go in the cart until lettering, colors, and layout are set.",
    "Yozuv, rang va joylashuv belgilanmaguncha vinil savatga tushmaydi.",
    "То навиштаҷот, ранг ва тарҳ гузошта нашаванд, винил ба сабад намеравад.",
    "Винил не попадёт в корзину, пока не заданы надпись, цвета и макет.",
    "Жазу, түс және орналасу қойылмайынша винил себетке түспейді.",
    "Жазуу, түс жана жайгашуу коюлмайынча винил себетке түшпөйт.",
    "Вініл не потрапить у кошик, доки не задано напис, кольори й макет.",
  ),
  cartShowsTruck: L(
    "Checkout shows this door on a white semi.",
    "Rasmiylashtirish bu eshikni oq yuk mashinasida ko‘rsatadi.",
    "Пардохт ин дарро дар мошини сафед нишон медиҳад.",
    "Оформление покажет эту дверь на белом грузовике.",
    "Рәсімдеу бұл есікті ақ жүк көлігінде көрсетеді.",
    "Тастыктоо бул эшикти ак жүк ташуучуда көрсөтөт.",
    "Оформлення покаже ці двері на білій вантажівці.",
  ),
  couldNotFinish: L(
    "Could not finish that order",
    "Buyurtmani tugatib bo‘lmadi",
    "Фармоиш анҷом наёфт",
    "Не удалось завершить заказ",
    "Тапсырыс аяқталмады",
    "Заказ бүткөн жок",
    "Не вдалося завершити замовлення",
  ),
  pairInCart: L(
    "Pair in the cart",
    "Juft savatda",
    "Ҷуфт дар сабад",
    "Пара в корзине",
    "Жұп себетте",
    "Жуп себетте",
    "Пара в кошику",
  ),
  pairInCartLead: L(
    "{name} · USDOT {dot}. Example cut is 20 × 12 in for each cab side. Checkout shows them on the truck.",
    "{name} · USDOT {dot}. Har kabina tomoni 20 × 12 dyuym. Rasmiylashtirish ularni yuk mashinasida ko‘rsatadi.",
    "{name} · USDOT {dot}. Ҳар тарафи кабина 20 × 12 дюйм. Пардохт онҳоро дар мошин нишон медиҳад.",
    "{name} · USDOT {dot}. Пример: 20 × 12 дюймов на сторону кабины. Оформление покажет их на грузовике.",
    "{name} · USDOT {dot}. Әр кабина жағы 20 × 12 дюйм. Рәсімдеу оларды жүк көлігінде көрсетеді.",
    "{name} · USDOT {dot}. Ар кабина тарабы 20 × 12 дюйм. Тастыктоо аларды жүк ташуучуда көрсөтөт.",
    "{name} · USDOT {dot}. Приклад: 20 × 12 дюймів на бік кабіни. Оформлення покаже їх на вантажівці.",
  ),
  viewCart: L(
    "View cart",
    "Savatni ko‘rish",
    "Дидани сабад",
    "Открыть корзину",
    "Себетті көру",
    "Себетти көрүү",
    "Відкрити кошик",
  ),
  checkout: L(
    "Checkout",
    "Rasmiylashtirish",
    "Пардохт",
    "Оформить",
    "Рәсімдеу",
    "Тастыктоо",
    "Оформити",
  ),
  demoLettering: L(
    "This is still a sample door. Put your MCS-150 name, USDOT, and MC before we print.",
    "Bu hali namuna eshik. Chopdan oldin MCS-150 nom, USDOT va MC ni yozing.",
    "Ин ҳанӯз дари намуна аст. Пеш аз чоп номи MCS-150, USDOT ва MC-ро нависед.",
    "Это всё ещё образец. Укажите имя MCS-150, USDOT и MC до печати.",
    "Бұл әлі үлгі есік. Басудан бұрын MCS-150 атауы, USDOT және MC жазыңыз.",
    "Бул дагы үлгү эшик. Басуудан мурун MCS-150 аты, USDOT жана MC жазыңыз.",
    "Це ще зразок дверей. Вкажіть назву MCS-150, USDOT і MC до друку.",
  ),
  logoTypeError: L(
    "Upload a PNG, JPG, SVG, or WebP logo.",
    "PNG, JPG, SVG yoki WebP logo yuklang.",
    "Логои PNG, JPG, SVG ё WebP бор кунед.",
    "Загрузите логотип PNG, JPG, SVG или WebP.",
    "PNG, JPG, SVG немесе WebP логотип жүктеңіз.",
    "PNG, JPG, SVG же WebP логотип жүктөңүз.",
    "Завантажте логотип PNG, JPG, SVG або WebP.",
  ),
  logoSizeError: L(
    "Logo must be 4 MB or smaller.",
    "Logo 4 MB dan katta bo‘lmasin.",
    "Лого набояд аз 4 МБ калонтар бошад.",
    "Логотип не больше 4 МБ.",
    "Логотип 4 МБ-тан аспасын.",
    "Логотип 4 МБдан ашпасын.",
    "Логотип не більший за 4 МБ.",
  ),
  logoReadError: L(
    "Could not read that file.",
    "Bu faylni o‘qib bo‘lmadi.",
    "Ин файл хонда нашуд.",
    "Не удалось прочитать файл.",
    "Файл оқылмады.",
    "Файл окулган жок.",
    "Не вдалося прочитати файл.",
  ),
  needNameDot: L(
    "Put your name and USDOT on the door.",
    "Nom va USDOT ni eshikka yozing.",
    "Ном ва USDOT-ро дар дар нависед.",
    "Укажите имя и USDOT на двери.",
    "Есікке атау мен USDOT жазыңыз.",
    "Эшикке ат жана USDOT жазыңыз.",
    "Вкажіть назву й USDOT на дверях.",
  ),
  needColors: L(
    "Tap a color set so we know what to print.",
    "Qaysi rangni chop etishni biling — to‘plamni bosing.",
    "Маҷмӯи рангро пахш кунед, то бидонем чӣ чоп кунем.",
    "Нажмите набор цветов, чтобы мы знали, что печатать.",
    "Түс жинағын басыңыз — не басатынымызды білейік.",
    "Түс топтомун басыңыз — эмне басарыбызды билелик.",
    "Натисніть набір кольорів, щоб ми знали, що друкувати.",
  ),
  needLayout: L(
    "Set logo size if you have a mark, then mark the layout ready.",
    "Belgi bo‘lsa logo o‘lchamini qo‘ying, keyin joylashuvni tayyor deb belgilang.",
    "Агар нишон бошад, андозаи логоро гузоред, сипас тарҳро омода кунед.",
    "Если есть знак — задайте размер логотипа и отметьте макет готовым.",
    "Белгі болса логотип өлшемін қойып, орналасуды дайын деп белгілеңіз.",
    "Белги болсо логотип өлчөмүн коюп, жайгашууну даяр деп белгилеңиз.",
    "Якщо є знак — задайте розмір логотипа й позначте макет готовим.",
  ),
  doorSamplesAria: L(
    "Door samples",
    "Eshik namunalari",
    "Намунаҳои дар",
    "Образцы дверей",
    "Есік үлгілері",
    "Эшик үлгүлөрү",
    "Зразки дверей",
  ),
  mcs150Name: L(
    "MCS-150 name (legal or one trade name)",
    "MCS-150 nomi (qonuniy yoki bitta savdo nomi)",
    "Номи MCS-150 (қонунӣ ё як номи тиҷоратӣ)",
    "Имя MCS-150 (юридическое или одно торговое)",
    "MCS-150 атауы (заңды немесе бір сауда атауы)",
    "MCS-150 аты (мыйзамдуу же бир соода аты)",
    "Назва MCS-150 (юридична або одна торгова)",
  ),
  mcs150Hint: L(
    "Must match the name on the motor carrier identification report.",
    "Motor tashuvchi identifikatsiya hisobotidagi nomga mos kelishi kerak.",
    "Бояд ба номи гузориши шиносномаи интиқолдиҳанда мувофиқ бошад.",
    "Должно совпадать с именем в отчёте идентификации перевозчика.",
    "Тасымалдаушы сәйкестендіру есебіндегі атаумен сәйкес болуы керек.",
    "Ташуучу идентификация отчетундагы ат менен дал келиши керек.",
    "Має збігатися з назвою у звіті ідентифікації перевізника.",
  ),
  doorNamePlaceholder: L(
    "Your door name",
    "Eshikdagi nomingiz",
    "Номи дари шумо",
    "Имя на двери",
    "Есіктегі атауыңыз",
    "Эшиктеги атыңыз",
    "Назва на дверях",
  ),
  cityState: L(
    "City, State",
    "Shahar, shtat",
    "Шаҳр, иёлат",
    "Город, штат",
    "Қала, штат",
    "Шаар, штат",
    "Місто, штат",
  ),
  cityStateHint: L(
    "Optional. Prints under the company name. Not a federal marking field.",
    "Ixtiyoriy. Kompaniya nomi ostida chop etiladi. Federal belgi maydoni emas.",
    "Ихтиёрӣ. Дар зери номи ширкат чоп мешавад. Майдони қайдҳои федералӣ нест.",
    "По желанию. Печатается под именем компании. Не федеральное поле.",
    "Міндетті емес. Компания атауының астында басылады. Федералдық өріс емес.",
    "Милдеттүү эмес. Компания атынын астында басылат. Федералдык талаа эмес.",
    "За бажанням. Друкується під назвою компанії. Не федеральне поле.",
  ),
  usdotNumber: L(
    "USDOT number",
    "USDOT raqami",
    "Рақами USDOT",
    "Номер USDOT",
    "USDOT нөмірі",
    "USDOT номери",
    "Номер USDOT",
  ),
  usdotHint: L(
    "Prints as USDOT plus the digits. Required on both sides.",
    "USDOT va raqamlar chop etiladi. Ikkala tomonda majburiy.",
    "Ҳамчун USDOT ва рақамҳо чоп мешавад. Дар ҳар ду тараф ҳатмӣ.",
    "Печатается как USDOT и цифры. Обязательно с обеих сторон.",
    "USDOT және цифрлар басылады. Екі жақта да міндетті.",
    "USDOT жана сандар басылат. Эки тарапта да милдеттүү.",
    "Друкується як USDOT і цифри. Обов’язково з обох боків.",
  ),
  usdotPlaceholder: L(
    "Your USDOT",
    "USDOT raqamingiz",
    "USDOT-и шумо",
    "Ваш USDOT",
    "USDOT нөміріңіз",
    "USDOT номериңиз",
    "Ваш USDOT",
  ),
  mcNumber: L(
    "MC (FMCSA) number",
    "MC (FMCSA) raqami",
    "Рақами MC (FMCSA)",
    "Номер MC (FMCSA)",
    "MC (FMCSA) нөмірі",
    "MC (FMCSA) номери",
    "Номер MC (FMCSA)",
  ),
  mcHint: L(
    "Prints as MC plus the digits under USDOT. Required on this shop ticket. FMCSA does not require MC on the truck.",
    "USDOT ostida MC va raqamlar chop etiladi. Bu do‘kon chiptasida majburiy. FMCSA yuk mashinasida MC talab qilmaydi.",
    "Дар зери USDOT ҳамчун MC ва рақамҳо чоп мешавад. Дар ин чипта ҳатмӣ. FMCSA MC-ро дар мошин талаб намекунад.",
    "Печатается как MC и цифры под USDOT. Обязательно в этой заявке. FMCSA не требует MC на грузовике.",
    "USDOT астында MC және цифрлар басылады. Осы дүкен билетінде міндетті. FMCSA жүк көлігінде MC талап етпейді.",
    "USDOT астында MC жана сандар басылат. Бул дүкөн билетинде милдеттүү. FMCSA жүк ташуучуда MC талап кылбайт.",
    "Друкується як MC і цифри під USDOT. Обов’язково в цій заявці. FMCSA не вимагає MC на вантажівці.",
  ),
  mcPlaceholder: L(
    "Your MC",
    "MC raqamingiz",
    "MC-и шумо",
    "Ваш MC",
    "MC нөміріңіз",
    "MC номериңиз",
    "Ваш MC",
  ),
  logoOrDoor: L(
    "Logo or existing door sign",
    "Logo yoki mavjud eshik belgisi",
    "Лого ё аломати мавҷудаи дар",
    "Логотип или готовый знак на двери",
    "Логотип немесе бар есік белгісі",
    "Логотип же бар эшик белгиси",
    "Логотип або наявний знак на дверях",
  ),
  logoAttached: L(
    "File attached — tap to replace. Original is kept.",
    "Fayl biriktirildi — almashtirish uchun bosing. Asl saqlanadi.",
    "Файл пайваст шуд — барои иваз пахш кунед. Асл нигоҳ дошта мешавад.",
    "Файл прикреплён — нажмите, чтобы заменить. Оригинал хранится.",
    "Файл тіркелді — ауыстыру үшін басыңыз. Түпнұсқа сақталады.",
    "Файл тиркелди — алмаштыру үчүн басыңыз. Түпнуска сакталат.",
    "Файл прикріплено — натисніть, щоб замінити. Оригінал зберігається.",
  ),
  logoEmpty: L(
    "PNG, JPG, SVG, or WebP. Fits 20 × 12 in — never stretched.",
    "PNG, JPG, SVG yoki WebP. 20 × 12 dyuymga sig‘adi — cho‘zilmaydi.",
    "PNG, JPG, SVG ё WebP. Ба 20 × 12 дюйм мувофиқ — ҳеҷ гоҳ кашида намешавад.",
    "PNG, JPG, SVG или WebP. Влезает в 20 × 12 дюймов — без растяжения.",
    "PNG, JPG, SVG немесе WebP. 20 × 12 дюймге сияды — созылмайды.",
    "PNG, JPG, SVG же WebP. 20 × 12 дюймге батат — созулбайт.",
    "PNG, JPG, SVG або WebP. Влізає в 20 × 12 дюймів — без розтягування.",
  ),
  removeFile: L(
    "Remove file",
    "Faylni olib tashlash",
    "Нест кардани файл",
    "Удалить файл",
    "Файлды жою",
    "Файлды өчүрүү",
    "Вилучити файл",
  ),
  checkContrast: L(
    "Check daylight contrast",
    "Kunduzgi kontrastni tekshiring",
    "Контрасти рӯзонаро санҷед",
    "Проверьте дневной контраст",
    "Күндізгі контрастты тексеріңіз",
    "Күндүзгү контрастты текшериңиз",
    "Перевірте денний контраст",
  ),
  onCabDoor: L(
    "On the cab door",
    "Kabina eshigida",
    "Дар дари кабина",
    "На двери кабины",
    "Кабина есігінде",
    "Кабина эшигинде",
    "На дверях кабіни",
  ),
  recutSwatch: L(
    "Recut any swatch",
    "Istalgan rangni qayta kesish",
    "Ҳар намунаро аз нав буридан",
    "Перекрасить любой образец",
    "Кез келген үлгіні қайта кесу",
    "Каалаган үлгүнү кайра кесүү",
    "Перефарбувати будь-який зразок",
  ),
  colorDoorName: L(
    "Door name",
    "Eshik nomi",
    "Номи дар",
    "Имя на двери",
    "Есік атауы",
    "Эшик аты",
    "Назва на дверях",
  ),
  colorUsdotMc: L("USDOT and MC", "USDOT va MC", "USDOT ва MC", "USDOT и MC", "USDOT және MC", "USDOT жана MC", "USDOT і MC"),
  colorFace: L("Face", "Yuzasi", "Рӯя", "Лицо", "Беті", "Бети", "Лице"),
  colorBorder: L("Border", "Chegara", "Марз", "Рамка", "Жиек", "Чек", "Рамка"),
  letteringColor: L(
    "Lettering color",
    "Yozuv rangi",
    "Ранги навишта",
    "Цвет надписи",
    "Жазу түсі",
    "Жазуу түсү",
    "Колір напису",
  ),
  accentColor: L(
    "Accent color",
    "Aksent rangi",
    "Ранги аксент",
    "Цвет акцента",
    "Акцент түсі",
    "Акцент түсү",
    "Колір акценту",
  ),
  moreBackgrounds: L(
    "More backgrounds",
    "Boshqa fonlar",
    "Заминаҳои дигар",
    "Другие фоны",
    "Басқа фондар",
    "Башка фондор",
    "Інші фони",
  ),
  moreLayouts: L(
    "More layouts",
    "Boshqa joylashuvlar",
    "Тарҳҳои дигар",
    "Другие макеты",
    "Басқа орналасулар",
    "Башка жайгашуулар",
    "Інші макети",
  ),
  accentNone: L("None", "Yo‘q", "Нест", "Нет", "Жоқ", "Жок", "Немає"),
  logoKeepsIds: L(
    "USDOT and MC stay at a locked readable size. The logo shrinks first if space is tight.",
    "USDOT va MC o‘qiladigan o‘lchamda qoladi. Joy tor bo‘lsa avval logo kichrayadi.",
    "USDOT ва MC дар андозаи хондашаванда мемонанд. Агар ҷо ҷиддӣ бошад, аввал лого хурд мешавад.",
    "USDOT и MC остаются читаемого размера. Если тесно — сначала уменьшается логотип.",
    "USDOT пен MC оқылатын өлшемде қалады. Орын тар болса, алдымен логотип кішірейеді.",
    "USDOT жана MC окула турган өлчөмдө калат. Жер тар болсо, адегенде логотип кичирейет.",
    "USDOT і MC лишаються читабельного розміру. Якщо тісно — спершу зменшується логотип.",
  ),
  layoutLabel: L("Layout", "Joylashuv", "Тарҳ", "Макет", "Орналасу", "Жайгашуу", "Макет"),
  layoutCardsHint: L(
    "White layouts first. USDOT and MC stay locked; the logo adapts.",
    "Avval oq joylashuvlar. USDOT va MC qulflangan; logo moslashadi.",
    "Аввал тарҳҳои сафед. USDOT ва MC қулфанд; лого мутобиқ мешавад.",
    "Сначала белые макеты. USDOT и MC зафиксированы; логотип подстраивается.",
    "Алдымен ақ орналасулар. USDOT пен MC бекітілген; логотип бейімделеді.",
    "Адегенде ак жайгашуулар. USDOT жана MC кулпуланган; логотип ылайыкташат.",
    "Спочатку білі макети. USDOT і MC зафіксовані; логотип підлаштовується.",
  ),
  doorFont: L(
    "Door font",
    "Eshik shrifti",
    "Ҳуруфи дар",
    "Шрифт двери",
    "Есік қаріпі",
    "Эшик ариби",
    "Шрифт дверей",
  ),
  fontCondensed: L("Condensed", "Siqiq", "Фишурда", "Узкий", "Тығыз", "Жыш", "Вузький"),
  fontSans: L("Bold sans", "Qalin sans", "Санс ғафс", "Жирный гротеск", "Қалың гротеск", "Калың гротеск", "Жирний гротеск"),
  fontSerif: L("Serif", "Serif", "Сериф", "Антиква", "Антиква", "Антиква", "Антиква"),
  sideChevrons: L(
    "Side chevrons",
    "Yon chiziqlar",
    "Хатҳои паҳлӯ",
    "Боковые шевроны",
    "Бүйір шеврондар",
    "Каптал шеврондор",
    "Бічні шеврони",
  ),
  sideChevronsHint: L(
    "Accent marks on the left and right of the plaque.",
    "Plaketka chap va o‘ngidagi belgi chiziqlari.",
    "Аломатҳои таъкид дар чап ва рости лавҳа.",
    "Акцентные знаки слева и справа на табличке.",
    "Тақтаның сол және оң жағындағы белгілер.",
    "Тактанын сол жана оң жагындагы белгилер.",
    "Акцентні знаки ліворуч і праворуч на табличці.",
  ),
  layoutMarkedReady: L(
    "Layout is marked ready for print.",
    "Joylashuv chopga tayyor deb belgilandi.",
    "Тарҳ барои чоп омода қайд шуд.",
    "Макет отмечен готовым к печати.",
    "Орналасу басуға дайын деп белгіленді.",
    "Жайгашуу басууга даяр деп белгиленди.",
    "Макет позначено готовим до друку.",
  ),
  layoutTapToLock: L(
    "Tap a layout or Continue to lock this 20 × 12 in composition.",
    "Joylashuvni bosing yoki Davom etish orqali 20 × 12 kompozitsiyani qulflang.",
    "Тарҳро пахш кунед ё Идома барои қулф кардани таркиби 20 × 12.",
    "Нажмите макет или Продолжить, чтобы зафиксировать композицию 20 × 12.",
    "Орналасуды басыңыз немесе Жалғастыру арқылы 20 × 12 композицияны бекітіңіз.",
    "Жайгашууну басыңыз же Улантуу менен 20 × 12 композицияны кулпулаңыз.",
    "Натисніть макет або Продовжити, щоб зафіксувати композицію 20 × 12.",
  ),
  howFilePrints: L(
    "How should this file print?",
    "Bu fayl qanday chop etilsin?",
    "Ин файл чӣ тавр чоп шавад?",
    "Как печатать этот файл?",
    "Бұл файл қалай басылсын?",
    "Бул файл кантип басылсын?",
    "Як друкувати цей файл?",
  ),
  companyLogo: L(
    "Company logo",
    "Kompaniya logosi",
    "Логои ширкат",
    "Логотип компании",
    "Компания логотипі",
    "Компания логотиби",
    "Логотип компанії",
  ),
  existingDoorSign: L(
    "Existing door sign",
    "Mavjud eshik belgisi",
    "Аломати мавҷудаи дар",
    "Готовый знак на двери",
    "Бар есік белгісі",
    "Бар эшик белгиси",
    "Наявний знак на дверях",
  ),
  flattenedTitle: L(
    "Flattened artwork is not live type",
    "Yassilangan rasm jonli shrift emas",
    "Тасвири ҳамвор ҳуруфи зинда нест",
    "Сведённый файл — не живой шрифт",
    "Тегістелген сурет тірі қаріп емес",
    "Тегизделген сүрөт жандуу арип эмес",
    "Зведений файл — не живий шрифт",
  ),
  flattenedBody: L(
    "JPG and PNG lettering cannot be edited as vinyl type. Put the MCS-150 name and USDOT on the ticket if they are missing from this photo. The original file is kept — fit and crop never overwrite it.",
    "JPG va PNG yozuvini vinil shrift sifatida tahrirlab bo‘lmaydi. Suratda yo‘q bo‘lsa, MCS-150 nom va USDOT ni chiptaga yozing. Asl fayl saqlanadi — moslash va qirqish uni o‘chirmaydi.",
    "Навиштаҷоти JPG ва PNG ҳамчун ҳуруфи винил таҳрир намешавад. Агар дар акс набошанд, номи MCS-150 ва USDOT-ро дар чипта нависед. Файли асл нигоҳ дошта мешавад.",
    "Надпись JPG и PNG нельзя править как винильный шрифт. Если на фото нет имени MCS-150 и USDOT — укажите их в заявке. Оригинал хранится, подгонка его не затирает.",
    "JPG және PNG жазуын винил қарібі ретінде өңдеуге болмайды. Суретте жоқ болса, MCS-150 атауы мен USDOT-ті билетке жазыңыз. Түпнұсқа сақталады.",
    "JPG жана PNG жазуусун винил ариби катары оңдоого болбойт. Сүрөттө жок болсо, MCS-150 аты жана USDOT'ту билетке жазыңыз. Түпнуска сакталат.",
    "Напис JPG і PNG не редагується як вінільний шрифт. Якщо на фото немає назви MCS-150 і USDOT — вкажіть їх у заявці. Оригінал зберігається.",
  ),
  originalStored: L(
    "Original file is stored. Fitting never stretches or overwrites it.",
    "Asl fayl saqlanadi. Moslash uni cho‘zmaydi va o‘chirmaydi.",
    "Файли асл захира мешавад. Мутобиқсозӣ онро намекашад ва нест намекунад.",
    "Оригинал хранится. Подгонка не растягивает и не затирает его.",
    "Түпнұсқа сақталады. Сәйкестендіру оны созбайды және өшірмейді.",
    "Түпнуска сакталат. Тууралоо аны созбойт жана өчүрбөйт.",
    "Оригінал зберігається. Підгонка не розтягує й не затирає його.",
  ),
  placeOnBoard: L(
    "Place on the 20 × 12 in board",
    "20 × 12 dyuym taxtaga joylashtirish",
    "Дар лавҳаи 20 × 12 дюйм ҷойгир кунед",
    "Разместить на доске 20 × 12 дюймов",
    "20 × 12 дюйм тақтаға орналастыру",
    "20 × 12 дюйм тактага жайгаштыру",
    "Розмістити на дошці 20 × 12 дюймів",
  ),
  cropFillNote: L(
    "Crop to fill is an explicit choice. Edges of the file will not print.",
    "To‘ldirish uchun qirqish — ongli tanlov. Fayl chetlari chop etilmaydi.",
    "Буридан барои пур кардан интихоби огоҳона аст. Канорҳои файл чоп намешаванд.",
    "Обрезка в край — явный выбор. Края файла не напечатаются.",
    "Толтыру үшін қию — анық таңдау. Файл жиектері басылмайды.",
    "Толтуруу үчүн кесүү — ачык тандоо. Файл четтери басылбайт.",
    "Обрізка вкрай — явний вибір. Краї файла не надрукуються.",
  ),
  nudgeH: L(
    "Nudge horizontally",
    "Gorizontal siljitish",
    "Ҷойивазкунии уфуқӣ",
    "Сдвинуть по горизонтали",
    "Көлденең жылжыту",
    "Горизонтал жылдыруу",
    "Зсунути горизонтально",
  ),
  nudgeV: L(
    "Nudge vertically",
    "Vertikal siljitish",
    "Ҷойивазкунии амудӣ",
    "Сдвинуть по вертикали",
    "Тігінен жылжыту",
    "Вертикал жылдыруу",
    "Зсунути вертикально",
  ),
  resetPlacement: L(
    "Reset placement",
    "Joylashuvni tiklash",
    "Барқарор кардани ҷойгиршавӣ",
    "Сбросить размещение",
    "Орналасуды қалпына келтіру",
    "Жайгашууну кайтаруу",
    "Скинути розміщення",
  ),
  logoIsName: L(
    "Logo is my company name",
    "Logo — kompaniya nomim",
    "Лого номи ширкати ман аст",
    "Логотип — это имя компании",
    "Логотип — компания атауым",
    "Логотип — компаниямдын аты",
    "Логотип — це назва компанії",
  ),
  logoIsNameHint: L(
    "Keep the registered name readable. Do not print it as a second giant headline.",
    "Ro‘yxatdan o‘tgan nom o‘qiladigan bo‘lsin. Uni ikkinchi katta sarlavha qilib chop etmang.",
    "Номи бақайдгирифтаро хондашаванда нигоҳ доред. Онро сарлавҳаи дуюми калон чоп накунед.",
    "Оставьте зарегистрированное имя читаемым. Не печатайте его вторым гигантским заголовком.",
    "Тіркелген атау оқылатын болсын. Оны екінші үлкен тақырып етіп баспаңыз.",
    "Катталган ат окула турган болсун. Аны экинчи чоң аталыш кылып баспаңыз.",
    "Залиште зареєстровану назву читабельною. Не друкуйте її другим гігантським заголовком.",
  ),
  fitEntire: L(
    "Fit entire",
    "Butunini sig‘dirish",
    "Тамомиро ҷой додан",
    "Вместить целиком",
    "Толығымен сыйғызу",
    "Толугу менен батыруу",
    "Вмістити повністю",
  ),
  fitEntireHint: L(
    "Whole file visible on the 20 × 12 in board. No stretch.",
    "Butun fayl 20 × 12 taxtada ko‘rinadi. Cho‘zilmaydi.",
    "Тамоми файл дар лавҳаи 20 × 12 дида мешавад. Кашида намешавад.",
    "Весь файл виден на доске 20 × 12. Без растяжения.",
    "Бүкіл файл 20 × 12 тақтада көрінеді. Созылмайды.",
    "Бүтүн файл 20 × 12 тактада көрүнөт. Созулбайт.",
    "Увесь файл видно на дошці 20 × 12. Без розтягування.",
  ),
  cropToFill: L(
    "Crop to fill",
    "To‘ldirish uchun qirqish",
    "Буридан барои пур кардан",
    "Обрезать в край",
    "Толтыру үшін қию",
    "Толтуруу үчүн кесүү",
    "Обрізати вкрай",
  ),
  cropToFillHint: L(
    "Fills the board. Edges are cropped — only if you choose this.",
    "Taxtani to‘ldiradi. Chetlar qirqiladi — faqat shu tanlovda.",
    "Лавҳаро пур мекунад. Канорҳо бурида мешаванд — танҳо агар инро интихоб кунед.",
    "Заполняет доску. Края обрезаются — только если вы это выбрали.",
    "Тақтаны толтырады. Жиектер қиылады — тек осыны таңдасаңыз.",
    "Тактаны толтурат. Четтер кесилет — ушуну тандасаңыз гана.",
    "Заповнює дошку. Краї обрізаються — лише якщо ви це обрали.",
  ),
  addMargins: L(
    "Add margins",
    "Chetlarni qo‘shish",
    "Иловаи ҳошия",
    "Добавить поля",
    "Жиек қосу",
    "Чек кошуу",
    "Додати поля",
  ),
  addMarginsHint: L(
    "Whole file visible with extra vinyl around it.",
    "Butun fayl ko‘rinadi, atrofida qo‘shimcha vinil.",
    "Тамоми файл бо винили иловагӣ дар атроф дида мешавад.",
    "Весь файл виден, вокруг лишний винил.",
    "Бүкіл файл көрінеді, айналасында қосымша винил.",
    "Бүтүн файл көрүнөт, айланасында кошумча винил.",
    "Увесь файл видно, навколо зайвий вініл.",
  ),
  keepAspect: L(
    "Keep aspect",
    "Nisbatni saqlash",
    "Нигоҳ доштани таносуб",
    "Сохранить пропорции",
    "Қатынасты сақтау",
    "Катышты сактоо",
    "Зберегти пропорції",
  ),
  keepAspectHint: L(
    "Native proportions, letterboxed. Never stretched or cropped.",
    "Asl nisbat, bo‘sh chetlar. Cho‘zilmaydi va qirqilmaydi.",
    "Таносубҳои аслӣ, бо ҳошия. Ҳеҷ гоҳ кашида ё бурида намешавад.",
    "Родные пропорции, с полями. Без растяжения и обрезки.",
    "Туған пропорция, жиекпен. Созылмайды және қиылмайды.",
    "Туулган пропорция, чек менен. Созулбайт жана кесилбейт.",
    "Рідні пропорції, з полями. Без розтягування й обрізки.",
  ),
  logoSizeVinyl: L(
    "Logo size on the vinyl",
    "Vinildagi logo o‘lchami",
    "Андозаи лого дар винил",
    "Размер логотипа на виниле",
    "Винилдегі логотип өлшемі",
    "Винилдеги логотип өлчөмү",
    "Розмір логотипа на вінілі",
  ),
  logoSizeNeedUpload: L(
    "Upload a logo first, then set how large it prints on the door.",
    "Avval logo yuklang, keyin eshikda qanchalik katta chop etilishini belgilang.",
    "Аввал лого бор кунед, сипас бузургии чопро дар дар гузоред.",
    "Сначала загрузите логотип, затем задайте размер на двери.",
    "Алдымен логотип жүктеңіз, содан кейін есіктегі өлшемді қойыңыз.",
    "Адегенде логотип жүктөңүз, андан кийин эшиктеги өлчөмдү коюңуз.",
    "Спочатку завантажте логотип, потім задайте розмір на дверях.",
  ),
  logoSizeHowLarge: L(
    "How large the mark prints on the door.",
    "Belgi eshikda qanchalik katta chop etiladi.",
    "Нишон дар дар чӣ қадар калон чоп мешавад.",
    "Насколько крупно знак печатается на двери.",
    "Белгі есікте қаншалықты үлкен басылады.",
    "Белги эшикте канчалык чоң басылат.",
    "Наскільки великим знак друкується на дверях.",
  ),
  logoSmall: L("Small", "Kichik", "Хурд", "Малый", "Кіші", "Кичине", "Малий"),
  logoMedium: L("Medium", "O‘rta", "Миёна", "Средний", "Орташа", "Орто", "Середній"),
  logoLarge: L("Large", "Katta", "Калон", "Крупный", "Үлкен", "Чоң", "Великий"),
  logoXl: L("Extra large", "Juda katta", "Хеле калон", "Очень крупный", "Өте үлкен", "Абдан чоң", "Дуже великий"),
  logoFullFace: L(
    "Full face",
    "To‘liq yuz",
    "Тамоми рӯя",
    "На всю плашку",
    "Толық бет",
    "Толук бет",
    "На всю плашку",
  ),
  continue: L("Continue", "Davom etish", "Идома", "Продолжить", "Жалғастыру", "Улантуу", "Продовжити"),
  wizardLetteringLead: L(
    "Put the name and numbers that should actually print. The 20 × 12 in door stays on screen.",
    "Haqiqatan chop etiladigan nom va raqamlarni yozing. 20 × 12 eshik ekranda qoladi.",
    "Ном ва рақамҳои чопшавандаро нависед. Дари 20 × 12 дар экран мемонад.",
    "Укажите имя и номера, которые печатаем. Дверь 20 × 12 остаётся на экране.",
    "Басылатын атау мен нөмірлерді жазыңыз. 20 × 12 есік экранда қалады.",
    "Басыла турган ат жана номерлерди жазыңыз. 20 × 12 эшик экранда калат.",
    "Вкажіть назву й номери, що друкуємо. Двері 20 × 12 лишаються на екрані.",
  ),
  wizardColorsLead: L(
    "Tap a set. Continue keeps the colors on the live door — including the white default.",
    "To‘plamni bosing. Davom etish ranglarni jonli eshikda saqlaydi — oq standart ham.",
    "Маҷмӯаро пахш кунед. Идома рангҳоро дар дари зинда нигоҳ медорад — аз ҷумла сафеди аслӣ.",
    "Нажмите набор. Продолжить оставит цвета на живой двери — включая белый по умолчанию.",
    "Жинақты басыңыз. Жалғастыру түстерді тірі есікте сақтайды — ақ әдепкіні қоса.",
    "Топтомду басыңыз. Улантуу түстөрдү жандуу эшикте сактайт — ак демейкини кошо.",
    "Натисніть набір. Продовжити залишить кольори на живих дверях — зокрема білий типовий.",
  ),
  wizardLayoutLead: L(
    "Pick a composition. Logo size and font stay on this step so the artwork above does not jump away.",
    "Kompozitsiyani tanlang. Logo o‘lchami va shrift shu qadamda qoladi — yuqoridagi rasm sakramaydi.",
    "Таркибро интихоб кунед. Андозаи лого ва ҳуруф дар ҳамин қадам мемонанд.",
    "Выберите композицию. Размер логотипа и шрифт остаются на этом шаге — макет сверху не прыгает.",
    "Композицияны таңдаңыз. Логотип өлшемі мен қаріп осы қадамда қалады.",
    "Композицияны тандаңыз. Логотип өлчөмү жана арип ушул кадамда калат.",
    "Оберіть композицію. Розмір логотипа й шрифт лишаються на цьому кроці.",
  ),
  couldNotContinue: L(
    "Could not continue",
    "Davom ettirib bo‘lmadi",
    "Идома дода нашуд",
    "Не удалось продолжить",
    "Жалғастыру мүмкін болмады",
    "Улантуу мүмкүн болгон жок",
    "Не вдалося продовжити",
  ),
  printTicketProgress: L(
    "Print ticket progress",
    "Chop chiptasi qadamlari",
    "Пешрафти чиптаи чоп",
    "Шаги заявки на печать",
    "Баспа билеті қадамдары",
    "Басма билети кадамдары",
    "Кроки заявки на друк",
  ),
  samplesKicker: L("Samples", "Namunalar", "Намунаҳо", "Образцы", "Үлгілер", "Үлгүлөр", "Зразки"),
  samplesTitle: L(
    "Five layouts. Your numbers.",
    "Besh joylashuv. Sizning raqamlaringiz.",
    "Панҷ тарҳ. Рақамҳои шумо.",
    "Пять макетов. Ваши номера.",
    "Бес орналасу. Сіздің нөмірлеріңіз.",
    "Беш жайгашуу. Сиздин номерлериңиз.",
    "П’ять макетів. Ваші номери.",
  ),
  samplesLead: L(
    "Each card is a 20 × 12 in door — the sign first, truck second. White vinyl, logo-led, cut lettering, or a printed plaque. Open Customize this design to put your MCS-150 name, USDOT, and MC on the print ticket.",
    "Har karta 20 × 12 dyuym eshik — avval belgi, keyin yuk mashinasi. Oq vinil, logo, kesilgan yozuv yoki chop plaketka. MCS-150 nom, USDOT va MC ni chiptaga yozish uchun Shu dizaynni sozlash ni oching.",
    "Ҳар корт дари 20 × 12 дюйм — аввал аломат, баъд мошин. Винили сафед, лого, навиштаи бурида ё лавҳаи чоп. Барои навиштани номи MCS-150, USDOT ва MC «Ин тарҳро танзим кардан»-ро кушоед.",
    "Каждая карточка — дверь 20 × 12: сначала знак, потом грузовик. Белый винил, логотип, вырезанная надпись или печатная табличка. Откройте «Настроить этот макет», чтобы указать имя MCS-150, USDOT и MC.",
    "Әр карта 20 × 12 дюйм есік — алдымен белгі, содан кейін жүк көлігі. Ақ винил, логотип, кесілген жазу немесе баспа тақта. MCS-150 атауы, USDOT және MC жазу үшін Осы дизайнды баптау-ды ашыңыз.",
    "Ар карта 20 × 12 дюйм эшик — адегенде белги, андан кийин жүк ташуучу. Ак винил, логотип, кесилген жазуу же басма такта. MCS-150 аты, USDOT жана MC жазуу үчүн Бул дизайнды ыңгайлаштыруу-ну ачыңыз.",
    "Кожна картка — двері 20 × 12: спочатку знак, потім вантажівка. Білий вініл, логотип, вирізаний напис або друкована табличка. Відкрийте «Налаштувати цей макет», щоб вказати назву MCS-150, USDOT і MC.",
  ),
  allLooks: L("All looks", "Barcha ko‘rinishlar", "Ҳамаи намудҳо", "Все виды", "Барлық көріністер", "Бардык көрүнүштөр", "Усі вигляди"),
  allLooksBlurb: L(
    "Each card is a different 20 × 12 in composition. Color is separate from layout.",
    "Har karta boshqa 20 × 12 kompozitsiya. Rang joylashuvdan alohida.",
    "Ҳар корт таркиби дигари 20 × 12 аст. Ранг аз тарҳ ҷудо аст.",
    "Каждая карточка — другая композиция 20 × 12. Цвет отдельно от макета.",
    "Әр карта басқа 20 × 12 композиция. Түс орналасудан бөлек.",
    "Ар карта башка 20 × 12 композиция. Түс жайгашуудан бөлөк.",
    "Кожна картка — інша композиція 20 × 12. Колір окремо від макета.",
  ),
  filter: L("Filter", "Filtr", "Филтр", "Фильтр", "Сүзгі", "Чыпка", "Фільтр"),
  noDoorsMatch: L(
    "No doors match that filter",
    "Bu filtrga mos eshik yo‘q",
    "Ҳеҷ дар ба ин филтр мувофиқ нест",
    "Нет дверей под этот фильтр",
    "Бұл сүзгіге сәйкес есік жоқ",
    "Бул чыпкага туура келген эшик жок",
    "Немає дверей під цей фільтр",
  ),
  noDoorsMatchLead: L(
    "Try All, or pick White / Dark / logo on a different category. Every look is still 20 × 12 in.",
    "Barchasini sinab ko‘ring yoki Oq / Qora / logoni boshqa toifada tanlang. Har ko‘rinish baribir 20 × 12 dyuym.",
    "Ҳамаро кӯшиш кунед ё Сафед / Торик / логоро дар категорияи дигар интихоб кунед. Ҳар намуд 20 × 12 дюйм аст.",
    "Попробуйте Все или Белый / Тёмный / логотип в другой категории. Каждый вид всё равно 20 × 12.",
    "Барлығын байқаңыз немесе Ақ / Қараңғы / логотипті басқа санатта таңдаңыз. Әр көрініс әлі 20 × 12.",
    "Баарын байкаңыз же Ак / Караңгы / логотипті башка категорияда тандаңыз. Ар көрүнүш дагы 20 × 12.",
    "Спробуйте Усі або Білий / Темний / логотип в іншій категорії. Кожен вигляд усе одно 20 × 12.",
  ),
  clearFilters: L(
    "Clear filters",
    "Filtrlarni tozalash",
    "Пок кардани филтрҳо",
    "Сбросить фильтры",
    "Сүзгілерді тазалау",
    "Чыпкаларды тазалоо",
    "Скинути фільтри",
  ),
  yourLogoOrPhoto: L(
    "Your logo or door photo",
    "Logoingiz yoki eshik surati",
    "Лого ё акси дари шумо",
    "Ваш логотип или фото двери",
    "Логотипіңіз немесе есік суреті",
    "Логотибиңиз же эшик сүрөтү",
    "Ваш логотип або фото дверей",
  ),
  uploadCardHint: L(
    "Fit entire, crop to fill, add margins, or keep aspect on 20 × 12 in. We never stretch a file to fill.",
    "Butunini sig‘diring, to‘ldirish uchun qirqing, chet qo‘shing yoki nisbatni 20 × 12 da saqlang. Faylni cho‘zmaymiz.",
    "Тамомиро ҷой диҳед, барои пур кардан буред, ҳошия илова кунед ё таносубро дар 20 × 12 нигоҳ доред. Файлро намекашем.",
    "Вместить целиком, обрезать в край, добавить поля или сохранить пропорции на 20 × 12. Файл не растягиваем.",
    "Толығымен сыйғызыңыз, толтыру үшін қиыңыз, жиек қосыңыз немесе 20 × 12 қатынасын сақтаңыз. Файлды созбаймыз.",
    "Толугу менен батырыңыз, толтуруу үчүн кесиңиз, чек кошуңуз же 20 × 12 катышын сактаңыз. Файлды созбойбуз.",
    "Вмістити повністю, обрізати вкрай, додати поля або зберегти пропорції на 20 × 12. Файл не розтягуємо.",
  ),
  customizeThis: L(
    "Customize this design",
    "Shu dizaynni sozlash",
    "Ин тарҳро танзим кардан",
    "Настроить этот макет",
    "Осы дизайнды баптау",
    "Бул дизайнды ыңгайлаштыруу",
    "Налаштувати цей макет",
  ),
  onATruck: L(
    "On a truck",
    "Yuk mashinasida",
    "Дар мошин",
    "На грузовике",
    "Жүк көлігінде",
    "Жүк ташуучуда",
    "На вантажівці",
  ),
  inspectLooksOnly: L(
    "{type} · {color} · 20 × 12 in. Looks only — put your MCS-150 name and numbers on the print ticket.",
    "{type} · {color} · 20 × 12 dyuym. Faqat ko‘rinish — MCS-150 nom va raqamlarni chop chiptasiga yozing.",
    "{type} · {color} · 20 × 12 дюйм. Танҳо намуд — номи MCS-150 ва рақамҳоро дар чиптаи чоп нависед.",
    "{type} · {color} · 20 × 12 дюймов. Только вид — укажите имя MCS-150 и номера в заявке.",
    "{type} · {color} · 20 × 12 дюйм. Тек көрініс — MCS-150 атауы мен нөмірлерді билетке жазыңыз.",
    "{type} · {color} · 20 × 12 дюйм. Жөн гана көрүнүш — MCS-150 аты жана номерлерди билетке жазыңыз.",
    "{type} · {color} · 20 × 12 дюймів. Лише вигляд — вкажіть назву MCS-150 і номери в заявці.",
  ),
  inspectArt: L(
    "This is the artwork. Truck placement is a separate preview.",
    "Bu rasmdir. Yuk mashinasidagi joylashuv alohida ko‘rinish.",
    "Ин тасвир аст. Ҷойгиршавӣ дар мошин пешнамоиши алоҳида аст.",
    "Это макет. Размещение на грузовике — отдельный просмотр.",
    "Бұл макет. Жүк көлігіндегі орналасу бөлек алдын ала көрініс.",
    "Бул макет. Жүк ташуучудагы жайгашуу өзүнчө көрүнүш.",
    "Це макет. Розміщення на вантажівці — окремий перегляд.",
  ),
  inspectTruck: L(
    "On-truck placement is a look only. The vinyl we cut is still 20 × 12 in.",
    "Yuk mashinasidagi joylashuv faqat ko‘rinish. Kesiladigan vinil baribir 20 × 12 dyuym.",
    "Ҷойгиршавӣ дар мошин танҳо намуд аст. Винили буридашаванда 20 × 12 дюйм мемонад.",
    "Размещение на грузовике — только вид. Режем всё равно 20 × 12 дюймов.",
    "Жүк көлігіндегі орналасу тек көрініс. Кесілетін винил әлі 20 × 12 дюйм.",
    "Жүк ташуучудагы жайгашуу жөн гана көрүнүш. Кесиле турган винил дагы 20 × 12 дюйм.",
    "Розміщення на вантажівці — лише вигляд. Ріжемо все одно 20 × 12 дюймів.",
  ),
  catWhiteMinimal: L("White & Minimal", "Oq va sodda", "Сафед ва содда", "Белый и простой", "Ақ әрі қарапайым", "Ак жана жөнөкөй", "Білий і простий"),
  catWhiteMinimalBlurb: L(
    "White vinyl, large black type, no extra box.",
    "Oq vinil, katta qora yozuv, qo‘shimcha quti yo‘q.",
    "Винили сафед, навиштаи сиёҳи калон, қуттии иловагӣ нест.",
    "Белый винил, крупный чёрный шрифт, без лишней рамки.",
    "Ақ винил, үлкен қара жазу, қосымша қорап жоқ.",
    "Ак винил, чоң кара жазуу, кошумча куту жок.",
    "Білий вініл, великий чорний шрифт, без зайвої рамки.",
  ),
  catLogoFocused: L("Logo-Focused", "Logo markazda", "Лого дар марказ", "С логотипом", "Логотип ортада", "Логотип борбордо", "З логотипом"),
  catLogoFocusedBlurb: L(
    "The mark leads. Name and USDOT stay readable.",
    "Belgi oldinda. Nom va USDOT o‘qiladigan qoladi.",
    "Нишон пешсаф аст. Ном ва USDOT хондашаванда мемонанд.",
    "Знак впереди. Имя и USDOT остаются читаемыми.",
    "Белгі алдыңғы қатарда. Атау мен USDOT оқылатын қалады.",
    "Белги алдыда. Ат жана USDOT окула турган бойдон калат.",
    "Знак попереду. Назва й USDOT лишаються читабельними.",
  ),
  catClassic: L("Classic Lettering", "Klassik yozuv", "Навиштаи классикӣ", "Классическая надпись", "Классикалық жазу", "Классикалык жазуу", "Класичний напис"),
  catClassicBlurb: L(
    "Cut type on the truck — no filled plaque.",
    "Yuk mashinasida kesilgan yozuv — to‘ldirilgan plaketka yo‘q.",
    "Навиштаи бурида дар мошин — лавҳаи пур нест.",
    "Вырезанный шрифт на грузовике — без заливной таблички.",
    "Жүк көлігінде кесілген жазу — толтырылған тақта жоқ.",
    "Жүк ташуучуда кесилген жазуу — толтурулган такта жок.",
    "Вирізаний шрифт на вантажівці — без заливки таблички.",
  ),
  catPremium: L("Premium Plaques", "Premium plaketkalar", "Лавҳаҳои премиум", "Премиум-таблички", "Премиум тақталар", "Премиум такталар", "Преміум-таблички"),
  catPremiumBlurb: L(
    "Solid printed board with large ID bands.",
    "Katta ID tasmali qattiq chop taxta.",
    "Лавҳаи чопи сахт бо тасмаҳои калони ID.",
    "Сплошная печатная доска с крупными полосами ID.",
    "Үлкен ID жолақтары бар тұтас баспа тақта.",
    "Чоң ID тилкелери бар туташ басма такта.",
    "Суцільна друкована дошка з великими смугами ID.",
  ),
  catUpload: L("Upload Your Own", "O‘zingiznikini yuklang", "Худи худро бор кунед", "Загрузить своё", "Өзіңіздікін жүктеңіз", "Өзүңүздүкүн жүктөңүз", "Завантажити своє"),
  catUploadBlurb: L(
    "Start blank and drop in a logo or existing door photo.",
    "Bo‘shdan boshlang va logo yoki mavjud eshik suratini tashlang.",
    "Аз холӣ оғоз кунед ва лого ё акси дари мавҷударо гузоред.",
    "Начните с пустой двери и добавьте логотип или фото.",
    "Бос есіктен бастап логотип немесе есік суретін тастаңыз.",
    "Бош эшиктен баштап логотип же эшик сүрөтүн таштаңыз.",
    "Почніть з порожніх дверей і додайте логотип або фото.",
  ),
  filterAll: L("All", "Barchasi", "Ҳама", "Все", "Барлығы", "Баары", "Усі"),
  filterWhite: L("White", "Oq", "Сафед", "Белый", "Ақ", "Ак", "Білий"),
  filterDark: L("Dark", "Qora", "Торик", "Тёмный", "Қараңғы", "Караңгы", "Темний"),
  filterWithLogo: L("With logo", "Logo bilan", "Бо лого", "С логотипом", "Логотиппен", "Логотип менен", "З логотипом"),
  filterNoLogo: L("No logo", "Logosiz", "Бе лого", "Без логотипа", "Логотипсіз", "Логотипсиз", "Без логотипа"),
  typeYourArtwork: L("Your artwork", "Sizning rasmingiz", "Тасвири шумо", "Ваш макет", "Сіздің макетіңіз", "Сиздин макетиңиз", "Ваш макет"),
  typeCutLettering: L("Cut lettering", "Kesilgan yozuv", "Навиштаи бурида", "Вырезанная надпись", "Кесілген жазу", "Кесилген жазуу", "Вирізаний напис"),
  typePrintedPlaque: L("Printed plaque", "Chop plaketka", "Лавҳаи чоп", "Печатная табличка", "Баспа тақта", "Басма такта", "Друкована табличка"),
  typeWhiteVinyl: L("White vinyl", "Oq vinil", "Винили сафед", "Белый винил", "Ақ винил", "Ак винил", "Білий вініл"),
  typeCustom: L("Custom", "Maxsus", "Фармоишӣ", "Свой", "Арнайы", "Атайын", "Власний"),
  cartKicker: L("Cart", "Savat", "Сабад", "Корзина", "Себет", "Себет", "Кошик"),
  cartTitle: L(
    "What you are printing",
    "Nimani chop etyapsiz",
    "Чӣ чоп мекунед",
    "Что вы печатаете",
    "Не басасыз",
    "Эмне басасыз",
    "Що ви друкуєте",
  ),
  cartLead: L(
    "Each item is 20 × 12 in for each side of the cab. Checkout shows the vinyl on a white semi before you send it to the shop.",
    "Har mahsulot kabinaning har tomoni uchun 20 × 12 dyuym. Rasmiylashtirish vinilni oq yuk mashinasida ko‘rsatadi.",
    "Ҳар ашё барои ҳар тарафи кабина 20 × 12 дюйм аст. Пардохт винилро дар мошини сафед нишон медиҳад.",
    "Каждый предмет — 20 × 12 дюймов на сторону кабины. Оформление покажет винил на белом грузовике.",
    "Әр зат кабинаның әр жағына 20 × 12 дюйм. Рәсімдеу винилді ақ жүк көлігінде көрсетеді.",
    "Ар нерсе кабинанын ар тарабына 20 × 12 дюйм. Тастыктоо винилди ак жүк ташуучуда көрсөтөт.",
    "Кожна позиція — 20 × 12 дюймів на бік кабіни. Оформлення покаже вініл на білій вантажівці.",
  ),
  cartEmpty: L("Cart is empty", "Savat bo‘sh", "Сабад холӣ аст", "Корзина пуста", "Себет бос", "Себет бош", "Кошик порожній"),
  cartEmptyLead: L(
    "Custom designs go in this cart after the designer. Print-existing files skip the cart and go straight to the shop list.",
    "Maxsus dizaynlar dizaynerdan keyin shu savatga tushadi. Tayyor fayllar savatni o‘tkazib, to‘g‘ridan-to‘g‘ri ro‘yxatga tushadi.",
    "Тарҳҳои фармоишӣ пас аз тарроҳ ба ин сабад мераванд. Файлҳои тайёр сабадро гузашта, ба рӯйхат мераванд.",
    "Новые макеты попадают сюда из конструктора. Готовые файлы минуют корзину и сразу в список цеха.",
    "Жаңа макеттер дизайнерден кейін осы себетке түседі. Дайын файлдар себетті өткізіп, тікелей тізімге түседі.",
    "Жаңы макеттер дизайнерден кийин ушул себетке түшөт. Даяр файлдар себетти өткөрүп, түз тизмеге түшөт.",
    "Нові макети потрапляють сюди з конструктора. Готові файли минають кошик і одразу в список цеху.",
  ),
  doorPair: L("Door pair", "Eshik jufti", "Ҷуфти дар", "Пара дверей", "Есік жұбы", "Эшик жупу", "Пара дверей"),
  setOfTwo: L(
    "Set of two · 20 × 12 in each side",
    "Ikki dona · har tomon 20 × 12 dyuym",
    "Ду адад · ҳар тараф 20 × 12 дюйм",
    "Комплект из двух · 20 × 12 дюймов на сторону",
    "Екі дана · әр жақ 20 × 12 дюйм",
    "Эки даана · ар тарап 20 × 12 дюйм",
    "Комплект із двох · 20 × 12 дюймів на бік",
  ),
  cartItemNote: L(
    "Example cut is 20 × 12 in for each cab side. Use Sign close-up to inspect the art, On the door to see it on the cab. Unit numbers are a separate small print.",
    "Har kabina tomoni 20 × 12 dyuym. Belgini yaqindan ko‘rish — Sign close-up, kabinada ko‘rish — Eshikda. Unit raqamlari alohida kichik chop.",
    "Ҳар тарафи кабина 20 × 12 дюйм. Барои дидани тасвир — наздик, барои дидан дар кабина — Дар дар. Рақамҳои юнит чопи алоҳидаанд.",
    "Пример: 20 × 12 дюймов на сторону. Крупный план — знак, На двери — на кабине. Бортовые номера — отдельная мелкая печать.",
    "Әр кабина жағы 20 × 12 дюйм. Жақыннан — белгі, Есікте — кабинада. Борт нөмірлері бөлек кіші баспа.",
    "Ар кабина тарабы 20 × 12 дюйм. Жакындан — белги, Эшикте — кабинада. Борт номерлери өзүнчө кичине басма.",
    "Приклад: 20 × 12 дюймів на бік. Крупний план — знак, На дверях — на кабіні. Бортові номери — окремий дрібний друк.",
  ),
  editAnother: L(
    "Edit another door",
    "Boshqa eshikni tahrirlash",
    "Таҳрири дари дигар",
    "Править другую дверь",
    "Басқа есікті өңдеу",
    "Башка эшикти оңдоо",
    "Редагувати інші двері",
  ),
  remove: L("Remove", "Olib tashlash", "Нест кардан", "Удалить", "Жою", "Өчүрүү", "Вилучити"),
  keepDesigning: L(
    "Keep designing",
    "Dizaynni davom ettirish",
    "Идомаи тарроҳӣ",
    "Продолжить макет",
    "Дизайнды жалғастыру",
    "Дизайнды улантуу",
    "Продовжити макет",
  ),
  checkoutOnTruck: L(
    "Checkout on the truck",
    "Yuk mashinasida rasmiylashtirish",
    "Пардохт дар мошин",
    "Оформить на грузовике",
    "Жүк көлігінде рәсімдеу",
    "Жүк ташуучуда тастыктоо",
    "Оформити на вантажівці",
  ),
  cartEmptyMini: L(
    "Cart is empty. Add a 20 × 12 in pair from the print desk.",
    "Savat bo‘sh. Chop stolidan 20 × 12 juft qo‘shing.",
    "Сабад холӣ аст. Аз мизи чоп ҷуфти 20 × 12 илова кунед.",
    "Корзина пуста. Добавьте пару 20 × 12 с печатного стола.",
    "Себет бос. Басу үстелінен 20 × 12 жұп қосыңыз.",
    "Себет бош. Басып чыгаруу столунан 20 × 12 жуп кошуңуз.",
    "Кошик порожній. Додайте пару 20 × 12 зі столу друку.",
  ),
  openCart: L("Open cart", "Savatni ochish", "Кушодани сабад", "Открыть корзину", "Себетті ашу", "Себетти ачуу", "Відкрити кошик"),
  printDesk: L("Print desk", "Chop stoli", "Мизи чоп", "Печатный стол", "Басу үстелі", "Басып чыгаруу столу", "Друкарський стіл"),
  shoppingCart: L("Shopping cart", "Savat", "Сабад", "Корзина", "Себет", "Себет", "Кошик"),
  setOfTwoUsdot: L(
    "Set of two · USDOT {dot}",
    "Ikki dona · USDOT {dot}",
    "Ду адад · USDOT {dot}",
    "Комплект из двух · USDOT {dot}",
    "Екі дана · USDOT {dot}",
    "Эки даана · USDOT {dot}",
    "Комплект із двох · USDOT {dot}",
  ),
  checkoutKicker: L("Checkout", "Rasmiylashtirish", "Пардохт", "Оформление", "Рәсімдеу", "Тастыктоо", "Оформлення"),
  checkoutTitle: L(
    "Vinyl on the sleeper door",
    "Spalnik eshigidagi vinil",
    "Винил дар дари хобгоҳ",
    "Винил на двери спальника",
    "Спальня есігіндегі винил",
    "Уктоочу эшигиндеги винил",
    "Вініл на дверях спальника",
  ),
  checkoutLead: L(
    "Each item is 20 × 12 in for each side of the cab. Checkout shows the vinyl on a white semi before you send it to the shop.",
    "Har mahsulot kabinaning har tomoni uchun 20 × 12 dyuym. Rasmiylashtirish vinilni oq yuk mashinasida ko‘rsatadi.",
    "Ҳар ашё барои ҳар тарафи кабина 20 × 12 дюйм аст. Пардохт винилро дар мошини сафед нишон медиҳад.",
    "Каждый предмет — 20 × 12 дюймов на сторону кабины. Оформление покажет винил на белом грузовике.",
    "Әр зат кабинаның әр жағына 20 × 12 дюйм. Рәсімдеу винилді ақ жүк көлігінде көрсетеді.",
    "Ар нерсе кабинанын ар тарабына 20 × 12 дюйм. Тастыктоо винилди ак жүк ташуучуда көрсөтөт.",
    "Кожна позиція — 20 × 12 дюймів на бік кабіни. Оформлення покаже вініл на білій вантажівці.",
  ),
  nothingCheckout: L(
    "Nothing to check out",
    "Rasmiylashtirish uchun hech narsa yo‘q",
    "Барои пардохт чизе нест",
    "Нечего оформлять",
    "Рәсімдейтін ештеңе жоқ",
    "Тастыктай турган эч нерсе жок",
    "Немає що оформлювати",
  ),
  nothingCheckoutLead: L(
    "Add a door pair from the print desk first.",
    "Avval chop stolidan eshik juftini qo‘shing.",
    "Аввал аз мизи чоп ҷуфти дарро илова кунед.",
    "Сначала добавьте пару дверей с печатного стола.",
    "Алдымен басу үстелінен есік жұбын қосыңыз.",
    "Адегенде басып чыгаруу столунан эшик жупун кошуңуз.",
    "Спочатку додайте пару дверей зі столу друку.",
  ),
  sendToShop: L(
    "Send to the shop",
    "Do‘konga yuborish",
    "Фиристодан ба дӯкон",
    "Отправить в цех",
    "Дүкенге жіберу",
    "Дүкөнгө жөнөтүү",
    "Надіслати в цех",
  ),
  sendToShopLead: L(
    "Tag the ticket. Khurshid prints the pair from this checkout.",
    "Chiptani belgilang. Khurshid juftni shu rasmiylashtirishdan chop etadi.",
    "Чиптаро қайд кунед. Хуршид ҷуфтро аз ҳамин пардохт чоп мекунад.",
    "Пометьте заявку. Хуршид напечатает пару с этого оформления.",
    "Билетті белгілеңіз. Хуршид жұпты осы рәсімдеуден басады.",
    "Билетти белгилеңиз. Хуршид жупту ушул тастыктоодон басат.",
    "Позначте заявку. Хуршид надрукує пару з цього оформлення.",
  ),
  couldNotCheckout: L(
    "Could not finish checkout",
    "Rasmiylashtirish tugamadi",
    "Пардохт анҷом наёфт",
    "Не удалось оформить",
    "Рәсімдеу аяқталмады",
    "Тастыктоо бүткөн жок",
    "Не вдалося оформити",
  ),
  usernameRejected: L(
    "Username not accepted",
    "Foydalanuvchi nomi qabul qilinmadi",
    "Номи корбар қабул нашуд",
    "Имя не принято",
    "Пайдаланушы аты қабылданбады",
    "Колдонуучу аты кабыл алынган жок",
    "Ім’я не прийнято",
  ),
  shopUsername: L(
    "Shop username",
    "Do‘kon nomi",
    "Номи корбар",
    "Имя в магазине",
    "Дүкен аты",
    "Дүкөн аты",
    "Ім’я в майстерні",
  ),
  sendingToShop: L(
    "Sending to the shop",
    "Do‘konga yuborilmoqda",
    "Ба дӯкон фиристода мешавад",
    "Отправляем в цех",
    "Дүкенге жіберілуде",
    "Дүкөнгө жөнөтүлүүдө",
    "Надсилаємо в цех",
  ),
  placeOnePair: L(
    "Place 1 vinyl pair",
    "1 vinil juftini yuborish",
    "Фиристодани 1 ҷуфти винил",
    "Отправить 1 виниловую пару",
    "1 винил жұбын жіберу",
    "1 винил жупун жөнөтүү",
    "Надіслати 1 вінілову пару",
  ),
  placeManyPairs: L(
    "Place {n} vinyl pairs",
    "{n} vinil juftini yuborish",
    "Фиристодани {n} ҷуфти винил",
    "Отправить {n} виниловых пар",
    "{n} винил жұбын жіберу",
    "{n} винил жупун жөнөтүү",
    "Надіслати {n} вінілових пар",
  ),
  orderReceived: L("Order received", "Buyurtma qabul qilindi", "Фармоиш қабул шуд", "Заказ принят", "Тапсырыс қабылданды", "Заказ кабыл алынды", "Замовлення прийнято"),
  orderReceivedLead: L(
    "{ids} · 20 × 12 in each cab side for @{user}.",
    "{ids} · @{user} uchun har kabina tomoni 20 × 12 dyuym.",
    "{ids} · 20 × 12 дюйм ҳар тарафи кабина барои @{user}.",
    "{ids} · 20 × 12 дюймов на сторону кабины для @{user}.",
    "{ids} · @{user} үшін әр кабина жағы 20 × 12 дюйм.",
    "{ids} · @{user} үчүн ар кабина тарабы 20 × 12 дюйм.",
    "{ids} · 20 × 12 дюймів на бік кабіни для @{user}.",
  ),
  downloadPrintSheet: L(
    "Download print sheet",
    "Chop varaqasini yuklab olish",
    "Боргирии варақаи чоп",
    "Скачать печатный лист",
    "Баспа парағын жүктеу",
    "Басма барагын жүктөө",
    "Завантажити друкарський аркуш",
  ),
  adminPrintDesk: L(
    "Admin print desk",
    "Admin chop stoli",
    "Мизи чопи админ",
    "Админ-стол печати",
    "Әкімші басу үстелі",
    "Админ басып чыгаруу столу",
    "Адмін-стіл друку",
  ),
  viewShopOrders: L(
    "View shop orders",
    "Do‘kon buyurtmalarini ko‘rish",
    "Дидани фармоишҳои дӯкон",
    "Смотреть заказы цеха",
    "Дүкен тапсырыстарын көру",
    "Дүкөн буйрутмаларын көрүү",
    "Переглянути замовлення цеху",
  ),
  checkoutPreviewNote: L(
    "Sign close-up is the print. On the door is a preview on the cab — not the cut file.",
    "Belgi yaqindan — chop. Eshikda — kabinadagi ko‘rinish, kesilgan fayl emas.",
    "Наздикии аломат — чоп. Дар дар — пешнамоиш дар кабина, на файли бурида.",
    "Крупный план — печать. На двери — превью на кабине, не файл резки.",
    "Жақыннан — баспа. Есікте — кабинадағы алдын ала көрініс, кесу файлы емес.",
    "Жакындан — басма. Эшикте — кабинадагы көрүнүш, кесүү файлы эмес.",
    "Крупний план — друк. На дверях — прев’ю на кабіні, не файл різки.",
  ),
  cartNoComplete: L(
    "Your cart has no complete door pair to print.",
    "Savatda chop etish uchun to‘liq eshik jufti yo‘q.",
    "Дар сабад ҷуфти комили дар барои чоп нест.",
    "В корзине нет готовой пары дверей для печати.",
    "Себетте басуға толық есік жұбы жоқ.",
    "Себетте басууга толук эшик жупу жок.",
    "У кошику немає повної пари дверей для друку.",
  ),
  savedAfterNetwork: L(
    "Saved on this device after a network error.",
    "Tarmoq xatosidan keyin shu qurilmada saqlandi.",
    "Пас аз хатои шабака дар ҳамин дастгоҳ захира шуд.",
    "Сохранено на этом устройстве после сетевой ошибки.",
    "Желі қатесінен кейін осы құрылғыда сақталды.",
    "Тармактык катадан кийин ушул түзмөктө сакталды.",
    "Збережено на цьому пристрої після мережевої помилки.",
  ),
  queueKicker: L("Queue", "Navbat", "Навбат", "Очередь", "Кезек", "Кезек", "Черга"),
  shopOrdersTitle: L("Shop orders", "Do‘kon buyurtmalari", "Фармоишҳои дӯкон", "Заказы цеха", "Дүкен тапсырыстары", "Дүкөн буйрутмалары", "Замовлення цеху"),
  showingSaved: L(
    "Showing saved copies on this device",
    "Shu qurilmadagi saqlangan nusxalar ko‘rsatilmoqda",
    "Нусхаҳои захирашуда дар ҳамин дастгоҳ нишон дода мешаванд",
    "Показаны копии, сохранённые на этом устройстве",
    "Осы құрылғыдағы сақталған көшірмелер көрсетілуде",
    "Ушул түзмөктөгү сакталган көчүрмөлөр көрсөтүлүүдө",
    "Показано копії, збережені на цьому пристрої",
  ),
  noDoorOrders: L(
    "No door orders yet",
    "Hali eshik buyurtmasi yo‘q",
    "Ҳанӯз фармоиши дар нест",
    "Заказов на двери ещё нет",
    "Әлі есік тапсырысы жоқ",
    "Азырынча эшик буйрутмасы жок",
    "Замовлень на двері ще немає",
  ),
  noOrdersForUser: L(
    "Nothing on file for {user}. Print a file you already have, or create a new design.",
    "{user} uchun yozuv yo‘q. Tayyor faylni chop eting yoki yangi dizayn yarating.",
    "Барои {user} сабт нест. Файли тайёрро чоп кунед ё тарҳи нав созед.",
    "Для {user} записей нет. Напечатайте готовый файл или создайте новый макет.",
    "{user} үшін жазба жоқ. Дайын файлды басыңыз немесе жаңа дизайн жасаңыз.",
    "{user} үчүн жазуу жок. Даяр файлды басыңыз же жаңы дизайн жасаңыз.",
    "Для {user} записів немає. Надрукуйте готовий файл або створіть новий макет.",
  ),
  noOrdersAnon: L(
    "Print a file you already have, or create a new design. Confirmed tickets land here.",
    "Tayyor faylni chop eting yoki yangi dizayn yarating. Tasdiqlangan chiptalar shu yerga tushadi.",
    "Файли тайёрро чоп кунед ё тарҳи нав созед. Чиптаҳои тасдиқшуда ин ҷо меоянд.",
    "Напечатайте готовый файл или создайте новый макет. Подтверждённые заявки появятся здесь.",
    "Дайын файлды басыңыз немесе жаңа дизайн жасаңыз. Расталған билеттер осында түседі.",
    "Даяр файлды басыңыз же жаңы дизайн жасаңыз. ырасталган билеттер бул жерге түшөт.",
    "Надрукуйте готовий файл або створіть новий макет. Підтверджені заявки з’являться тут.",
  ),
  signIn: L("Sign in", "Kirish", "Вуруд", "Войти", "Кіру", "Кирүү", "Увійти"),
  createAccount: L(
    "Create account",
    "Hisob ochish",
    "Сохтани ҳисоб",
    "Создать аккаунт",
    "Аккаунт ашу",
    "Аккаунт ачуу",
    "Створити акаунт",
  ),
  accountNav: L("Account", "Hisob", "Ҳисоб", "Аккаунт", "Аккаунт", "Аккаунт", "Акаунт"),
  accountKicker: L("Account", "Hisob", "Ҳисоб", "Аккаунт", "Аккаунт", "Аккаунт", "Акаунт"),
  accountTitle: L(
    "Save your door tickets",
    "Eshik chiptalarini saqlang",
    "Чиптаҳои дарро нигоҳ доред",
    "Сохраните заявки на двери",
    "Есік билеттерін сақтаңыз",
    "Эшик билеттерин сактаңыз",
    "Збережіть заявки на двері",
  ),
  accountLead: L(
    "Email and password keep every confirmed pair on this shop — phone, computer, or a new browser.",
    "Email va parol tasdiqlangan juftlarni shu do‘konda saqlaydi — telefon, kompyuter yoki yangi brauzer.",
    "Почта ва рамз ҳар ҷуфти тасдиқшударо дар ҳамин дӯкон нигоҳ медорад — телефон, компютер ё браузери нав.",
    "Почта и пароль хранят каждую подтверждённую пару в этом цехе — телефон, компьютер или новый браузер.",
    "Email мен құпия сөз расталған жұптарды осы дүкенде сақтайды — телефон, компьютер немесе жаңа браузер.",
    "Email жана сырсөз ырасталган жуптарды ушул дүкөндө сактайт — телефон, компьютер же жаңы браузер.",
    "Пошта й пароль зберігають кожну підтверджену пару в цій майстерні — телефон, комп’ютер чи новий браузер.",
  ),
  accountEmail: L("Email", "Email", "Почта", "Эл. почта", "Email", "Email", "Email"),
  accountPassword: L(
    "Password",
    "Parol",
    "Рамз",
    "Пароль",
    "Құпия сөз",
    "Сырсөз",
    "Пароль",
  ),
  accountPasswordHint: L(
    "At least 8 characters.",
    "Kamida 8 belgi.",
    "Ҳадди ақал 8 аломат.",
    "Не меньше 8 символов.",
    "Кемінде 8 таңба.",
    "Кеминде 8 белги.",
    "Щонайменше 8 символів.",
  ),
  accountSignIn: L("Sign in", "Kirish", "Вуруд", "Войти", "Кіру", "Кирүү", "Увійти"),
  accountSignUp: L(
    "Create account",
    "Hisob ochish",
    "Сохтани ҳисоб",
    "Создать аккаунт",
    "Аккаунт ашу",
    "Аккаунт ачуу",
    "Створити акаунт",
  ),
  accountSignedInAs: L(
    "Signed in as {email}",
    "{email} sifatida kirdingiz",
    "Ҳамчун {email} ворид шудед",
    "Вы вошли как {email}",
    "{email} ретінде кірдіңіз",
    "{email} катары кирдиңиз",
    "Ви увійшли як {email}",
  ),
  accountHistoryLead: L(
    "New tickets and older ones for {user} stay on My orders from any device.",
    "Yangi chiptalar va @{user} ostidagi eskilar istalgan qurilmadan Mening buyurtmalarimda qoladi.",
    "Чиптаҳои нав ва кӯҳнаҳо зери @{user} аз ҳар дастгоҳ дар Фармоишҳои ман мемонанд.",
    "Новые заявки и старые под @{user} остаются в «Мои заказы» с любого устройства.",
    "Жаңа билеттер мен @{user} астындағы ескілері кез келген құрылғыдан Менің тапсырыстарымда қалады.",
    "Жаңы билеттер жана @{user} астындагы эскилери каалаган түзмөктөн Менин буйрутмаларымда калат.",
    "Нові заявки й старі під @{user} лишаються в «Мої замовлення» з будь-якого пристрою.",
  ),
  accountSignOut: L("Sign out", "Chiqish", "Баромад", "Выйти", "Шығу", "Чыгуу", "Вийти"),
  accountSaveHistory: L(
    "Create an account so this ticket stays in your history.",
    "Hisob oching — chipta tarixingizda qoladi.",
    "Ҳисоб созед — чипта дар таърихи шумо мемонад.",
    "Создайте аккаунт — заявка останется в истории.",
    "Аккаунт ашыңыз — билет тарихыңызда қалады.",
    "Аккаунт ачыңыз — билет тарыхыңызда калат.",
    "Створіть акаунт — заявка лишиться в історії.",
  ),
  checkoutSignedIn: L(
    "Saving to {email}. Confirmed pairs stay on My orders.",
    "{email} ga saqlanadi. Tasdiqlangan juftlar Mening buyurtmalarimda qoladi.",
    "Ба {email} захира мешавад. Ҷуфтҳои тасдиқшуда дар Фармоишҳои ман мемонанд.",
    "Сохраняем на {email}. Подтверждённые пары останутся в «Мои заказы».",
    "{email} мекенжайына сақталады. Расталған жұптар Менің тапсырыстарымда қалады.",
    "{email} дарегине сакталат. ырасталган жуптар Менин буйрутмаларымда калат.",
    "Зберігаємо на {email}. Підтверджені пари лишаться в «Мої замовлення».",
  ),
  checkoutCreateAccount: L(
    "Create an account to keep this history on every phone and browser.",
    "Hisob oching — tarix har telefon va brauzerda qoladi.",
    "Ҳисоб созед — таърих дар ҳар телефон ва браузер мемонад.",
    "Создайте аккаунт, чтобы история была на каждом телефоне и в браузере.",
    "Аккаунт ашыңыз — тарих әр телефон мен браузерде қалады.",
    "Аккаунт ачыңыз — тарых ар бир телефон менен браузерде калат.",
    "Створіть акаунт, щоб історія була на кожному телефоні й у браузері.",
  ),
  ordersSignInHint: L(
    "Sign in to see tickets saved to your account. This browser still shows locally saved ones.",
    "Hisobingizdagi chiptalarni ko‘rish uchun kiring. Bu brauzer mahalliy saqlanganlarni ham ko‘rsatadi.",
    "Барои дидани чиптаҳои ҳисоб ворид шавед. Ин браузер ҳанӯз маҳаллиро нишон медиҳад.",
    "Войдите, чтобы видеть заявки аккаунта. Этот браузер всё ещё показывает локально сохранённые.",
    "Аккаунттағы билеттерді көру үшін кіріңіз. Бұл браузер әлі жергілікті сақталғандарын көрсетеді.",
    "Аккаунттагы билеттерди көрүү үчүн кириңиз. Бул браузер дагы жергиликтүү сакталгандарын көрсөтөт.",
    "Увійдіть, щоб бачити заявки акаунта. Цей браузер досі показує збережені локально.",
  ),
  accountWorking: L(
    "Saving account",
    "Hisob saqlanmoqda",
    "Ҳисоб захира мешавад",
    "Сохраняем аккаунт",
    "Аккаунт сақталуда",
    "Аккаунт сакталууда",
    "Зберігаємо акаунт",
  ),
  accountCreated: L(
    "Account saved. Tickets you place now stay in My orders.",
    "Hisob saqlandi. Endi yuborgan chiptalar Mening buyurtmalarimda qoladi.",
    "Ҳисоб захира шуд. Чиптаҳое, ки ҳозир мефиристед, дар Фармоишҳои ман мемонанд.",
    "Аккаунт сохранён. Заявки, которые вы отправите, останутся в «Мои заказы».",
    "Аккаунт сақталды. Қазір жіберген билеттер Менің тапсырыстарымда қалады.",
    "Аккаунт сакталды. Азыр жөнөткөн билеттер Менин буйрутмаларымда калат.",
    "Акаунт збережено. Заявки, які ви надішлете, лишаться в «Мої замовлення».",
  ),
  printSheet: L("Print sheet", "Chop varaqasi", "Варақаи чоп", "Печатный лист", "Баспа парағы", "Басма барагы", "Друкарський аркуш"),
  printExistingTag: L("print-existing", "tayyor-fayl", "тарҳи-тайёр", "готовый-макет", "дайын-файл", "даяр-файл", "готовий-макет"),
  adminKicker: L("Admin", "Admin", "Админ", "Админ", "Әкімші", "Админ", "Адмін"),
  printSheetsTitle: L("Print sheets", "Chop varaqalari", "Варақаҳои чоп", "Печатные листы", "Баспа парақтары", "Басма барактары", "Друкарські аркуші"),
  cutterSheet: L("Cutter sheet", "Kesish varaqasi", "Варақаи буриш", "Лист для резки", "Кесу парағы", "Кесүү барагы", "Аркуш для різки"),
  cutterSheetLead: L(
    "Physical pair is two 20 × 12 in doors, laid out along a 24 in roll. Download places both plaques — left and right — at true size.",
    "Jismoniy juft — 24 dyuym rulonda ikkita 20 × 12 eshik. Yuklab olish chap va o‘ngni haqiqiy o‘lchamda qo‘yadi.",
    "Ҷуфти ҷисмонӣ ду дари 20 × 12 дар рӯйи 24 дюйм аст. Боргирӣ ҳар ду лавҳаро — чап ва рост — дар андозаи аслӣ мегузорад.",
    "Физическая пара — две двери 20 × 12 на рулоне 24 дюйма. Скачивание ставит левую и правую в истинном размере.",
    "Физикалық жұп — 24 дюйм орамда екі 20 × 12 есік. Жүктеу сол және оңды нақты өлшемде қояды.",
    "Физикалык жуп — 24 дюйм оромдо эки 20 × 12 эшик. Жүктөө сол жана оңду чыныгы өлчөмдө коёт.",
    "Фізична пара — двоє дверей 20 × 12 на рулоні 24 дюйми. Завантаження ставить ліву й праву в істинному розмірі.",
  ),
  openSampleSheet: L(
    "Open sample print sheet",
    "Namuna chop varaqasini ochish",
    "Кушодани варақаи намуна",
    "Открыть образец листа",
    "Үлгі баспа парағын ашу",
    "Үлгү басма барагын ачуу",
    "Відкрити зразок аркуша",
  ),
  noTickets: L("No tickets to print", "Chop etiladigan chipta yo‘q", "Чипта барои чоп нест", "Нет заявок на печать", "Басатын билет жоқ", "Басыла турган билет жок", "Немає заявок на друк"),
  noTicketsLead: L(
    "When a driver checks out — or the Telegram bot posts a ticket — the pair lands here for a 20 × 12 in left and right print. The sample sheet above is always available.",
    "Haydovchi rasmiylashtirsa yoki Telegram bot chipta yuborsa, juft shu yerga 20 × 12 chap va o‘ng chop uchun tushadi. Yuqoridagi namuna varaqa doim ochiq.",
    "Вақте ронанда пардохт мекунад ё боти Telegram чипта мефиристад, ҷуфт барои чопи 20 × 12 чап ва рост ин ҷо меояд. Варақаи намуна ҳамеша дастрас аст.",
    "Когда водитель оформляет или бот Telegram присылает заявку, пара появляется здесь для печати 20 × 12 слева и справа. Образец листа выше всегда доступен.",
    "Жүргізуші рәсімдегенде немесе Telegram бот билет жібергенде, жұп осында 20 × 12 сол және оң басу үшін түседі. Үлгі парақ әрқашан ашық.",
    "Айдоочу тастыктаганда же Telegram бот билет жибергенде, жуп бул жерге 20 × 12 сол жана оң басуу үчүн түшөт. Үлгү барак дайыма ачык.",
    "Коли водій оформлює або бот Telegram надсилає заявку, пара з’являється тут для друку 20 × 12 ліворуч і праворуч. Зразок аркуша вище завжди доступний.",
  ),
  printOriginalNote: L(
    "Print the original upload at 20 × 12 in. This is not a designer plaque — the cutter sheet stays for custom designs.",
    "Asl yuklamani 20 × 12 dyuymda chop eting. Bu dizayner plaketkasi emas — kesish varaqasi maxsus dizaynlar uchun.",
    "Боргузории аслро дар 20 × 12 дюйм чоп кунед. Ин лавҳаи тарроҳ нест — варақаи буриш барои тарҳҳои фармоишӣ аст.",
    "Печатайте исходный файл 20 × 12. Это не табличка конструктора — лист резки для новых макетов.",
    "Түпнұсқа жүктемені 20 × 12 дюймде басыңыз. Бұл дизайнер тақтасы емес — кесу парағы жаңа макеттер үшін.",
    "Түпнуска жүктөмөнү 20 × 12 дюймде басыңыз. Бул дизайнер тактасы эмес — кесүү барагы жаңы макеттер үчүн.",
    "Друкуйте вихідне завантаження 20 × 12. Це не табличка конструктора — аркуш різки для нових макетів.",
  ),
  couldNotUpdate: L(
    "Could not update this ticket.",
    "Bu chiptani yangilab bo‘lmadi.",
    "Ин чипта навсозӣ нашуд.",
    "Не удалось обновить заявку.",
    "Бұл билет жаңартылмады.",
    "Бул билет жаңыртылган жок.",
    "Не вдалося оновити заявку.",
  ),
  couldNotReach: L(
    "Could not reach the shop list.",
    "Do‘kon ro‘yxatiga yetib bo‘lmadi.",
    "Рӯйхати дӯкон дастнорас буд.",
    "Список цеха недоступен.",
    "Дүкен тізіміне жетпеді.",
    "Дүкөн тизмесине жеткен жок.",
    "Список цеху недоступний.",
  ),
  openingSheet: L(
    "Opening print sheet",
    "Chop varaqasi ochilmoqda",
    "Варақаи чоп кушода мешавад",
    "Открываем печатный лист",
    "Баспа парағы ашылуда",
    "Басма барагы ачылууда",
    "Відкриваємо друкарський аркуш",
  ),
  shopPrintDesk: L(
    "Shop print desk",
    "Do‘kon chop stoli",
    "Мизи чопи дӯкон",
    "Печатный стол цеха",
    "Дүкен басу үстелі",
    "Дүкөн басып чыгаруу столу",
    "Друкарський стіл цеху",
  ),
  printOriginalTitle: L(
    "Print the original file",
    "Asl faylni chop eting",
    "Файли аслро чоп кунед",
    "Печатайте исходный файл",
    "Түпнұсқа файлды басыңыз",
    "Түпнуска файлды басыңыз",
    "Друкуйте вихідний файл",
  ),
  printOriginalBody: L(
    "Ticket {id} is print-existing. Do not cut a designer plaque. Print the upload at 20 × 12 in, one pair.",
    "{id} chiptasi tayyor fayl. Dizayner plaketkasini kesmang. Yuklamani 20 × 12 dyuym, bitta juft chop eting.",
    "Чиптаи {id} тарҳи тайёр аст. Лавҳаи тарроҳро набуред. Боргузориро дар 20 × 12 дюйм, як ҷуфт чоп кунед.",
    "Заявка {id} — готовый файл. Не режьте табличку конструктора. Печатайте загрузку 20 × 12, одна пара.",
    "{id} билеті дайын файл. Дизайнер тақтасын кеспеңіз. Жүктемені 20 × 12 дюйм, бір жұп басыңыз.",
    "{id} билети даяр файл. Дизайнер тактасын кеспеңиз. Жүктөмөнү 20 × 12 дюйм, бир жуп басыңыз.",
    "Заявка {id} — готовий файл. Не ріжте табличку конструктора. Друкуйте завантаження 20 × 12, одна пара.",
  ),
  noTicketPrint: L(
    "No ticket to print",
    "Chop etiladigan chipta yo‘q",
    "Чипта барои чоп нест",
    "Нет заявки для печати",
    "Басатын билет жоқ",
    "Басыла турган билет жок",
    "Немає заявки для друку",
  ),
  unknownOrder: L("Unknown order.", "Noma’lum buyurtma.", "Фармоиши номаълум.", "Неизвестный заказ.", "Белгісіз тапсырыс.", "Белгисиз заказ.", "Невідоме замовлення."),
  cutterReady: L(
    "Cutter sheet ready",
    "Kesish varaqasi tayyor",
    "Варақаи буриш омода аст",
    "Лист резки готов",
    "Кесу парағы дайын",
    "Кесүү барагы даяр",
    "Аркуш різки готовий",
  ),
  downloadSheetBtn: L(
    "Download sheet",
    "Varaqani yuklab olish",
    "Боргирии варақа",
    "Скачать лист",
    "Парақты жүктеу",
    "Баракты жүктөө",
    "Завантажити аркуш",
  ),
  ticketNotOnList: L(
    "This ticket is not on the shop list.",
    "Bu chipta do‘kon ro‘yxatida yo‘q.",
    "Ин чипта дар рӯйхати дӯкон нест.",
    "Этой заявки нет в списке цеха.",
    "Бұл билет дүкен тізімінде жоқ.",
    "Бул билет дүкөн тизмесинде жок.",
    "Цієї заявки немає в списку цеху.",
  ),
  couldNotOpenTicket: L(
    "Could not open that ticket.",
    "Bu chiptani ochib bo‘lmadi.",
    "Ин чипта кушода нашуд.",
    "Не удалось открыть заявку.",
    "Бұл билет ашылмады.",
    "Бул билет ачылган жок.",
    "Не вдалося відкрити заявку.",
  ),
  printOnlyTag: L("PRINT_ONLY", "FAQAT_CHOP", "ТАНҲО_ЧОП", "ТОЛЬКО_ПЕЧАТЬ", "ТЕК_БАСУ", "ТЕК_БАСУУ", "ЛИШЕ_ДРУК"),
  printFile: L("Print file", "Chop fayli", "Файли чоп", "Файл печати", "Баспа файлы", "Басма файлы", "Файл друку"),
  suggestedOnSleeper: L(
    "Suggested layout on a white sleeper · 20 × 12 in each cab side",
    "Oq spalnıkda tavsiya etilgan joylashuv · har tomon 20 × 12 dyuym",
    "Тарҳи пешниҳодшуда дар хобгоҳи сафед · ҳар тараф 20 × 12 дюйм",
    "Рекомендуемый макет на белом спальнике · 20 × 12 дюймов на сторону",
    "Ақ спальникте ұсынылған орналасу · әр жақ 20 × 12 дюйм",
    "Ак уктоочуда сунушталган жайгашуу · ар тарап 20 × 12 дюйм",
    "Рекомендований макет на білому спальнику · 20 × 12 дюймів на бік",
  ),
  forDrivers: L("For drivers", "Haydovchilar uchun", "Барои ронандагон", "Для водителей", "Жүргізушілерге", "Айдоочуларга", "Для водіїв"),
  startFromSample: L(
    "Creating a new design? Start from a sample",
    "Yangi dizayn yaratayapsizmi? Namunadan boshlang",
    "Тарҳи нав месозед? Аз намуна оғоз кунед",
    "Новый макет? Начните с образца",
    "Жаңа дизайн жасайсыз ба? Үлгіден бастаңыз",
    "Жаңы дизайн жасайсызбы? Үлгүдөн баштаңыз",
    "Новий макет? Почніть зі зразка",
  ),
  startFromSampleLead: L(
    "Each card is a 20 × 12 in color on a white sleeper — same truck the cart uses. Tap one to open the designer. If you already have artwork, use I already have a design instead.",
    "Har karta oq spalnıkdagi 20 × 12 rang — savatdagi yuk mashinasi. Dizaynerni ochish uchun bosing. Tayyor rasm bo‘lsa, Menda tayyor dizayn bor ni ishlating.",
    "Ҳар корт ранги 20 × 12 дар хобгоҳи сафед аст — ҳамон мошини сабад. Барои кушодани тарроҳ пахш кунед. Агар тасвир дошта бошед, Ман тарҳи тайёр дорам-ро истифода баред.",
    "Каждая карточка — цвет 20 × 12 на белом спальнике, тот же грузовик, что в корзине. Нажмите, чтобы открыть конструктор. Если макет уже есть — «У меня уже есть макет».",
    "Әр карта ақ спальниктегі 20 × 12 түс — себеттегі жүк көлігі. Дизайнерді ашу үшін басыңыз. Дайын макет болса, Дайын макетім бар-ды пайдаланыңыз.",
    "Ар карта ак уктоочудагы 20 × 12 түс — себеттеги жүк ташуучу. Дизайнерди ачуу үчүн басыңыз. Даяр макет болсо, Даяр макетим бар-ды колдонуңуз.",
    "Кожна картка — колір 20 × 12 на білому спальнику, та сама вантажівка, що в кошику. Натисніть, щоб відкрити конструктор. Якщо макет уже є — «У мене вже є макет».",
  ),
  layoutAndFederal: L(
    "Layout and federal marking",
    "Joylashuv va federal belgi",
    "Тарҳ ва қайди федералӣ",
    "Макет и федеральная маркировка",
    "Орналасу және федералдық белгі",
    "Жайгашуу жана федералдык белги",
    "Макет і федеральне маркування",
  ),
  layoutAndFederalLead: L(
    "One 20 × 12 in plaque on each cab door: logo, company name, city and state, USDOT, then MC. FMCSA does not set a letter height — it has to read from 50 feet, on both sides of the power unit, in strong contrast. MC is not required on the truck; this shop still prints it.",
    "Har kabina eshigida bitta 20 × 12 plaketka: logo, kompaniya nomi, shahar va shtat, USDOT, keyin MC. FMCSA harf balandligini belgilamaydi — 50 futdan o‘qilishi, kuch qurilmasining ikki tomonida, kuchli kontrast. Yuk mashinasida MC shart emas; bu do‘kon baribir chop etadi.",
    "Як лавҳаи 20 × 12 дар ҳар дари кабина: лого, номи ширкат, шаҳр ва иёлат, USDOT, сипас MC. FMCSA баландии ҳарф муқаррар намекунад — бояд аз 50 фут хонда шавад, дар ҳар ду тараф, бо контрасти қавӣ. MC дар мошин ҳатмӣ нест; ин дӯкон боз ҳам чоп мекунад.",
    "Одна табличка 20 × 12 на каждую дверь кабины: логотип, имя, город и штат, USDOT, затем MC. FMCSA не задаёт высоту букв — читаемость с 50 футов, с обеих сторон тягача, сильный контраст. MC на грузовике не обязателен; этот цех всё равно печатает его.",
    "Әр кабина есігінде бір 20 × 12 тақта: логотип, компания атауы, қала мен штат, USDOT, содан кейін MC. FMCSA әріп биіктігін қоймайды — 50 футтан оқылуы, қуат блогының екі жағында, күшті контраст. Жүк көлігінде MC міндетті емес; бұл дүкен бәрібір басады.",
    "Ар кабина эшигинде бир 20 × 12 такта: логотип, компания аты, шаар жана штат, USDOT, андан кийин MC. FMCSA тамга бийиктигин койбойт — 50 футтан окулушу, күч блогунун эки тарабында, күчтүү контраст. Жүк ташуучуда MC милдеттүү эмес; бул дүкөн баары бир басат.",
    "Одна табличка 20 × 12 на кожні двері кабіни: логотип, назва, місто й штат, USDOT, потім MC. FMCSA не задає висоту літер — читабельність з 50 футів, з обох боків тягача, сильний контраст. MC на вантажівці не обов’язковий; цей цех усе одно його друкує.",
  ),
  specCompany: L("Company name", "Kompaniya nomi", "Номи ширкат", "Имя компании", "Компания атауы", "Компания аты", "Назва компанії"),
  specCompanyBody: L(
    "Legal name or one trade name, as filed with FMCSA. Prints large on the 20 × 12 in plaque. City and state print under the name.",
    "FMCSA ga topshirilgan qonuniy yoki bitta savdo nomi. 20 × 12 plaketkada katta chop etiladi. Shahar va shtat nom ostida.",
    "Номи қонунӣ ё як номи тиҷоратӣ, ки ба FMCSA пешниҳод шудааст. Дар лавҳаи 20 × 12 калон чоп мешавад. Шаҳр ва иёлат дар зери ном.",
    "Юридическое или одно торговое имя, как в FMCSA. Крупно на табличке 20 × 12. Город и штат под именем.",
    "FMCSA-ға берілген заңды немесе бір сауда атауы. 20 × 12 тақтада үлкен басылады. Қала мен штат атаудың астында.",
    "FMCSA'га берилген мыйзамдуу же бир соода аты. 20 × 12 тактада чоң басылат. Шаар жана штат аттын астында.",
    "Юридична або одна торгова назва, як у FMCSA. Велико на табличці 20 × 12. Місто й штат під назвою.",
  ),
  specUsdot: L("USDOT number", "USDOT raqami", "Рақами USDOT", "Номер USDOT", "USDOT нөмірі", "USDOT номери", "Номер USDOT"),
  specUsdotBody: L(
    "Prints as USDOT plus the digits under city and state. Required. Letters 2–3 in, readable from 50 feet.",
    "Shahar va shtat ostida USDOT va raqamlar. Majburiy. Harflar 2–3 dyuym, 50 futdan o‘qiladi.",
    "Дар зери шаҳр ва иёлат ҳамчун USDOT ва рақамҳо. Ҳатмӣ. Ҳарфҳо 2–3 дюйм, аз 50 фут хонда мешаванд.",
    "Печатается как USDOT и цифры под городом и штатом. Обязательно. Буквы 2–3 дюйма, читаются с 50 футов.",
    "Қала мен штат астында USDOT және цифрлар. Міндетті. Әріптер 2–3 дюйм, 50 футтан оқылады.",
    "Шаар жана штат астында USDOT жана сандар. Милдеттүү. Тамгалар 2–3 дюйм, 50 футтан окулат.",
    "Друкується як USDOT і цифри під містом і штатом. Обов’язково. Літери 2–3 дюйми, читаються з 50 футів.",
  ),
  specMc: L("MC number", "MC raqami", "Рақами MC", "Номер MC", "MC нөмірі", "MC номери", "Номер MC"),
  specMcBody: L(
    "Prints as MC plus the digits under USDOT, 2 in letters. Not required on the truck by 49 CFR § 390.21 — required on this shop ticket.",
    "USDOT ostida MC va raqamlar, 2 dyuym harflar. 49 CFR § 390.21 bo‘yicha yuk mashinasida shart emas — bu do‘kon chiptasida majburiy.",
    "Дар зери USDOT ҳамчун MC ва рақамҳо, ҳарфҳои 2 дюйм. Тибқи 49 CFR § 390.21 дар мошин ҳатмӣ нест — дар ин чипта ҳатмӣ.",
    "Печатается как MC и цифры под USDOT, буквы 2 дюйма. По 49 CFR § 390.21 на грузовике не обязательно — в этой заявке обязательно.",
    "USDOT астында MC және цифрлар, 2 дюйм әріп. 49 CFR § 390.21 бойынша жүк көлігінде міндетті емес — осы билетте міндетті.",
    "USDOT астында MC жана сандар, 2 дюйм тамга. 49 CFR § 390.21 боюнча жүк ташуучуда милдеттүү эмес — бул билетте милдеттүү.",
    "Друкується як MC і цифри під USDOT, літери 2 дюйми. За 49 CFR § 390.21 на вантажівці не обов’язково — у цій заявці обов’язково.",
  ),
  specLogo: L("Logo", "Logo", "Лого", "Логотип", "Логотип", "Логотип", "Логотип"),
  specLogoBody: L(
    "Optional. Set how large the mark prints above the name. Unit numbers are not on this vinyl.",
    "Ixtiyoriy. Belgining nom ustida qanchalik katta chop etilishini belgilang. Unit raqamlari bu vinilda yo‘q.",
    "Ихтиёрӣ. Бузургии нишонро дар болои ном гузоред. Рақамҳои юнит дар ин винил нестанд.",
    "По желанию. Задайте размер знака над именем. Бортовые номера на этом виниле не печатаются.",
    "Міндетті емес. Белгінің атау үстінде қаншалықты үлкен басылатынын қойыңыз. Борт нөмірлері осы винилде жоқ.",
    "Милдеттүү эмес. Белгинин аттын үстүндө канчалык чоң басылаарын коюңуз. Борт номерлери бул винилде жок.",
    "За бажанням. Задайте розмір знака над назвою. Бортові номери на цьому вінілі не друкуються.",
  ),
  specColors: L(
    "Colors you can recut",
    "Qayta kesiladigan ranglar",
    "Рангҳое, ки аз нав бурида мешаванд",
    "Цвета, которые можно перекрасить",
    "Қайта кесілетін түстер",
    "Кайра кесиле турган түстөр",
    "Кольори, які можна перефарбувати",
  ),
  specColorsBody: L(
    "Navy gold is the example. Black, red, and asphalt recut the same 20 × 12 in stack. The designer warns if contrast is too weak for 50-foot reading.",
    "Namuna — to‘q ko‘k oltin. Qora, qizil va asfalt xuddi shu 20 × 12 qatlamni qayta kesadi. Dizayner 50 fut o‘qish uchun kontrast zaif bo‘lsa ogohlantiradi.",
    "Намуна — тиллои тӯси. Сиёҳ, сурх ва асфалт ҳамин қабати 20 × 12-ро аз нав мебуранд. Тарроҳ ҳушдор медиҳад, агар контраст барои хондан аз 50 фут заиф бошад.",
    "Пример — золото на тёмно-синем. Чёрный, красный и асфальт перекрашивают тот же набор 20 × 12. Конструктор предупредит, если контраст слаб для чтения с 50 футов.",
    "Мысал — алтын қою көк. Қара, қызыл және асфальт сол 20 × 12 қабатты қайта кеседі. Дизайнер 50 футтан оқу үшін контраст әлсіз болса ескертеді.",
    "Мисал — алтын кочкул көк. Кара, кызыл жана асфальт ошол 20 × 12 катмарды кайра кесет. Дизайнер 50 футтан окуу үчүн контраст алсыз болсо эскертет.",
    "Приклад — золото на темно-синьому. Чорний, червоний і асфальт перефарбовують той самий набір 20 × 12. Конструктор попередить, якщо контраст слабкий для читання з 50 футів.",
  ),
  specPair: L("Pair of doors", "Eshik jufti", "Ҷуфти дар", "Пара дверей", "Есік жұбы", "Эшик жупу", "Пара дверей"),
  specPairBody: L(
    "One design, two prints. Left and right cab doors match. Example size is 20 × 12 in.",
    "Bitta dizayn, ikki chop. Chap va o‘ng kabina eshiklari mos. Namuna o‘lchami 20 × 12 dyuym.",
    "Як тарҳ, ду чоп. Дари чап ва рости кабина мувофиқанд. Андозаи намуна 20 × 12 дюйм.",
    "Один макет, две печати. Левая и правая двери кабины совпадают. Пример размера — 20 × 12 дюймов.",
    "Бір дизайн, екі баспа. Сол және оң кабина есіктері сәйкес. Үлгі өлшемі 20 × 12 дюйм.",
    "Бир дизайн, эки басма. Сол жана оң кабина эшиктери дал келет. Үлгү өлчөмү 20 × 12 дюйм.",
    "Один макет, два друки. Ліві й праві двері кабіни збігаються. Приклад розміру — 20 × 12 дюймів.",
  ),
  step1: L("1. Pick a service", "1. Xizmatni tanlang", "1. Хизматро интихоб кунед", "1. Выберите услугу", "1. Қызметті таңдаңыз", "1. Кызматты тандаңыз", "1. Оберіть послугу"),
  step1Body: L(
    "Print a file you already have, or create a new USDOT door in the designer. You tap — you do not type commands.",
    "Tayyor faylni chop eting yoki dizaynerda yangi USDOT eshik yarating. Bosasiz — buyruq yozmaysiz.",
    "Файли тайёрро чоп кунед ё дар тарроҳ дари нави USDOT созед. Пахш мекунед — фармон наменависед.",
    "Напечатайте готовый файл или создайте новую дверь USDOT в конструкторе. Вы нажимаете — команды не вводите.",
    "Дайын файлды басыңыз немесе дизайнерде жаңа USDOT есік жасаңыз. Басасыз — команда жазбайсыз.",
    "Даяр файлды басыңыз же дизайнерде жаңы USDOT эшик жасаңыз. Басасыз — буйрук жазбайсыз.",
    "Надрукуйте готовий файл або створіть Двері USDOT у конструкторі. Ви натискаєте — команди не вводите.",
  ),
  step2: L("2. Confirm the pair", "2. Juftni tasdiqlang", "2. Ҷуфтро тасдиқ кунед", "2. Подтвердите пару", "2. Жұпты растаңыз", "2. Жупту ырастаңыз", "2. Підтвердіть пару"),
  step2Body: L(
    "Print-existing sends the original file at 20 × 12 in. New designs go through the cart and a white-cab preview.",
    "Tayyor fayl aslini 20 × 12 da yuboradi. Yangi dizaynlar savat va oq kabina ko‘rinishidan o‘tadi.",
    "Тарҳи тайёр файли аслро дар 20 × 12 мефиристад. Тарҳҳои нав аз сабад ва пешнамоиши кабинаи сафед мегузаранд.",
    "Готовый файл уходит как есть, 20 × 12. Новые макеты — через корзину и превью на белой кабине.",
    "Дайын файл түпнұсқаны 20 × 12 жібереді. Жаңа дизайндар себет пен ақ кабина көрінісінен өтеді.",
    "Даяр файл түпнусканы 20 × 12 жөнөтөт. Жаңы дизайндар себет жана ак кабина көрүнүшүнөн өтөт.",
    "Готовий файл іде як є, 20 × 12. Нові макети — через кошик і прев’ю на білій кабіні.",
  ),
  step3: L("3. Print with Khurshid", "3. Khurshid bilan chop eting", "3. Бо Хуршид чоп кунед", "3. Печать у Хуршида", "3. Хуршидпен басыңыз", "3. Хуршид менен басыңыз", "3. Друк у Хуршида"),
  step3Body: L(
    "Tickets land on the print desk. Questions stay on Telegram or the contact page — the Start button opens the same menu.",
    "Chiptalar chop stoliga tushadi. Savollar Telegram yoki aloqa sahifasida — Start tugmasi shu menyuni ochadi.",
    "Чиптаҳо ба мизи чоп меоянд. Саволҳо дар Telegram ё саҳифаи тамос мемонанд — тугмаи Start ҳамин менюро мекушояд.",
    "Заявки попадают на печатный стол. Вопросы — в Telegram или на странице контакта. Кнопка Start открывает то же меню.",
    "Билеттер басу үстеліне түседі. Сұрақтар Telegram немесе байланыс бетінде. Start батырмасы сол мәзірді ашады.",
    "Билеттер басып чыгаруу столуна түшөт. Суроолор Telegram же байланыш бетинде. Start баскычы ошол менюну ачат.",
    "Заявки потрапляють на друкарський стіл. Питання — в Telegram або на сторінці контакту. Кнопка Start відкриває те саме меню.",
  ),
  telegramSame: L(
    "Telegram is the same counter",
    "Telegram — xuddi shu darcha",
    "Telegram ҳамон пештаҳ аст",
    "Telegram — тот же прилавок",
    "Telegram — сол есептегіш",
    "Telegram — ошол эле эсептегич",
    "Telegram — той самий прилавок",
  ),
  telegramSameLead: L(
    "Open the shop bot and tap Start. The first screen is How can we help you today? — print an existing file, create a new design, my orders, contact, or language. You do not type commands. English, Uzbek, Tajik, Russian, Kazakh, Kyrgyz, and Ukrainian.",
    "Do‘kon botini oching va Start ni bosing. Birinchi ekran: Bugun qanday yordam beraylik? — tayyor fayl, yangi dizayn, buyurtmalar, aloqa yoki til. Buyruq yozmaysiz. Ingliz, o‘zbek, tojik, rus, qozoq, qirg‘iz va ukrain.",
    "Боти дӯконро кушоед ва Start-ро пахш кунед. Экрани аввал: Имрӯз чӣ кумак кунем? — файли тайёр, тарҳи нав, фармоишҳо, тамос ё забон. Фармон наменависед. Англисӣ, ӯзбекӣ, тоҷикӣ, русӣ, қазоқӣ, қирғизӣ ва укранӣ.",
    "Откройте бота цеха и нажмите Start. Первый экран: Чем помочь сегодня? — готовый файл, новый макет, заказы, контакт или язык. Команды не вводите. Английский, узбекский, таджикский, русский, казахский, киргизский и украинский.",
    "Дүкен ботын ашып, Start басыңыз. Бірінші экран: Бүгін қалай көмектесейік? — дайын файл, жаңа дизайн, тапсырыстар, байланыс немесе тіл. Команда жазбаңыз. Ағылшын, өзбек, тәжік, орыс, қазақ, қырғыз және украин.",
    "Дүкөн ботун ачып, Start басыңыз. Биринчи экран: Бүгүн кантип жардам берели? — даяр файл, жаңы дизайн, буйрутмалар, байланыш же тил. Буйрук жазбаңыз. Англис, өзбек, тажик, орус, казак, кыргыз жана украин.",
    "Відкрийте бота цеху й натисніть Start. Перший екран: Чим допомогти сьогодні? — готовий файл, новий макет, замовлення, контакт або мова. Команди не вводите. Англійська, узбецька, таджицька, російська, казахська, киргизька та українська.",
  ),
  openTelegram: L(
    "Open the shop on Telegram",
    "Do‘konni Telegramda ochish",
    "Кушодани дӯкон дар Telegram",
    "Открыть цех в Telegram",
    "Дүкенді Telegram-да ашу",
    "Дүкөндү Telegram-да ачуу",
    "Відкрити цех у Telegram",
  ),
  useThisDoor: L(
    "Use this door",
    "Shu eshikni ishlatish",
    "Ин дарро истифода баред",
    "Взять эту дверь",
    "Осы есікті қолдану",
    "Бул эшикти колдонуу",
    "Взяти ці двері",
  ),
  examplePlaque: L(
    "Example · 20 × 12 in door plaque",
    "Namuna · 20 × 12 dyuym eshik plaketkasi",
    "Намуна · лавҳаи дари 20 × 12 дюйм",
    "Пример · табличка 20 × 12 дюймов",
    "Мысал · 20 × 12 дюйм есік тақтасы",
    "Мисал · 20 × 12 дюйм эшик тактасы",
    "Приклад · табличка 20 × 12 дюймів",
  ),
  replaceWithCarrier: L(
    "Logo, company name, city and state, USDOT, then MC. Replace with the carrier's registered information.",
    "Logo, kompaniya nomi, shahar va shtat, USDOT, keyin MC. Tashuvchining ro‘yxatdan o‘tgan ma’lumoti bilan almashtiring.",
    "Лого, номи ширкат, шаҳр ва иёлат, USDOT, сипас MC. Бо маълумоти бақайдгирифтаи интиқолдиҳанда иваз кунед.",
    "Логотип, имя компании, город и штат, USDOT, затем MC. Замените зарегистрированными данными перевозчика.",
    "Логотип, компания атауы, қала мен штат, USDOT, содан кейін MC. Тасымалдаушының тіркелген мәліметімен алмастырыңыз.",
    "Логотип, компания аты, шаар жана штат, USDOT, андан кийин MC. Ташуучунун катталган маалыматы менен алмаштырыңыз.",
    "Логотип, назва компанії, місто й штат, USDOT, потім MC. Замініть зареєстрованими даними перевізника.",
  ),
  itemCol: L("Item", "Band", "Банди", "Пункт", "Тармақ", "Тармақ", "Пункт"),
  exampleSizeCol: L("Example size", "Namuna o‘lchami", "Андозаи намуна", "Пример размера", "Үлгі өлшемі", "Үлгү өлчөмү", "Приклад розміру"),
  stickerWidth: L("Sticker width", "Stiker kengligi", "Бари плисак", "Ширина наклейки", "Жапсырма ені", "Жабыштыргыч туурасы", "Ширина наліпки"),
  stickerHeight: L("Sticker height", "Stiker balandligi", "Баландии плисак", "Высота наклейки", "Жапсырма биіктігі", "Жабыштыргыч бийиктиги", "Висота наліпки"),
  companyNameLetters: L("Company name letters", "Kompaniya nomi harflari", "Ҳарфҳои номи ширкат", "Буквы имени компании", "Компания атауы әріптері", "Компания аты тамгалары", "Літери назви компанії"),
  usdotLetters: L("USDOT number letters", "USDOT raqami harflari", "Ҳарфҳои рақами USDOT", "Буквы номера USDOT", "USDOT нөмірі әріптері", "USDOT номери тамгалары", "Літери номера USDOT"),
  mcLetters: L("MC number letters", "MC raqami harflari", "Ҳарфҳои рақами MC", "Буквы номера MC", "MC нөмірі әріптері", "MC номери тамгалары", "Літери номера MC"),
  officialFederal: L(
    "Official federal requirements",
    "Rasmiy federal talablar",
    "Талаботи расмии федералӣ",
    "Официальные федеральные требования",
    "Ресми федералдық талаптар",
    "Расмий федералдык талаптар",
    "Офіційні федеральні вимоги",
  ),
  requirementCol: L("Requirement", "Talab", "Талаб", "Требование", "Талап", "Талап", "Вимога"),
  fmcsaRuleCol: L("FMCSA rule", "FMCSA qoidasi", "Қоидаи FMCSA", "Правило FMCSA", "FMCSA ережесі", "FMCSA эрежеси", "Правило FMCSA"),
  minLetterHeight: L("Minimum letter height", "Minimal harf balandligi", "Ҳадди ақали баландии ҳарф", "Минимальная высота букв", "Әріптің ең кіші биіктігі", "Тамганын эң кичине бийиктиги", "Мінімальна висота літер"),
  minLetterHeightRule: L(
    "No fixed federal measurement",
    "Belgilangan federal o‘lchov yo‘q",
    "Андозаи муқаррари федералӣ нест",
    "Нет фиксированной федеральной меры",
    "Бекітілген федералдық өлшем жоқ",
    "Бекитилген федералдык өлчөм жок",
    "Немає фіксованої федеральної міри",
  ),
  readability: L("Readability", "O‘qilishi", "Хондашавандагӣ", "Читаемость", "Оқылуы", "Окулушу", "Читабельність"),
  readabilityRule: L(
    "At least 50 feet in daylight",
    "Kunduzda kamida 50 fut",
    "Ҳадди ақал 50 фут дар рӯз",
    "Не менее 50 футов при дневном свете",
    "Күндіз кемінде 50 фут",
    "Күндүз кеминде 50 фут",
    "Щонайменше 50 футів удень",
  ),
  placementReq: L("Placement", "Joylashuv", "Ҷойгиршавӣ", "Размещение", "Орналасу", "Жайгашуу", "Розміщення"),
  placementRule: L(
    "Both sides of the truck's power unit",
    "Yuk mashinasi kuch qurilmasining ikki tomoni",
    "Ҳар ду тарафи қисми қувваи мошин",
    "Обе стороны тягача",
    "Жүк көлігі қуат блогының екі жағы",
    "Жүк ташуучу күч блогунун эки тарабы",
    "Обидва боки тягача",
  ),
  colorReq: L("Color", "Rang", "Ранг", "Цвет", "Түс", "Түс", "Колір"),
  colorRule: L(
    "Strong contrast with the truck",
    "Yuk mashinasi bilan kuchli kontrast",
    "Контрасти қавӣ бо мошин",
    "Сильный контраст с грузовиком",
    "Жүк көлігімен күшті контраст",
    "Жүк ташуучу менен күчтүү контраст",
    "Сильний контраст із вантажівкою",
  ),
  companyNameReq: L("Company name", "Kompaniya nomi", "Номи ширкат", "Имя компании", "Компания атауы", "Компания аты", "Назва компанії"),
  companyNameReqRule: L(
    "Legal name or one registered trade name",
    "Qonuniy nom yoki bitta ro‘yxatdan o‘tgan savdo nomi",
    "Номи қонунӣ ё як номи тиҷоратии бақайдгирифта",
    "Юридическое имя или одно зарегистрированное торговое",
    "Заңды атау немесе бір тіркелген сауда атауы",
    "Мыйзамдуу ат же бир катталган соода аты",
    "Юридична назва або одна зареєстрована торгова",
  ),
  usdotReq: L("USDOT number", "USDOT raqami", "Рақами USDOT", "Номер USDOT", "USDOT нөмірі", "USDOT номери", "Номер USDOT"),
  usdotReqRule: L(
    "Required, preceded by USDOT",
    "Majburiy, oldida USDOT",
    "Ҳатмӣ, пеш аз он USDOT",
    "Обязательно, с префиксом USDOT",
    "Міндетті, алдында USDOT",
    "Милдеттүү, алдында USDOT",
    "Обов’язково, з префіксом USDOT",
  ),
  mcReq: L("MC number", "MC raqami", "Рақами MC", "Номер MC", "MC нөмірі", "MC номери", "Номер MC"),
  mcReqRule: L(
    "Not required on the truck",
    "Yuk mashinasida shart emas",
    "Дар мошин ҳатмӣ нест",
    "На грузовике не обязательно",
    "Жүк көлігінде міндетті емес",
    "Жүк ташуучуда милдеттүү эмес",
    "На вантажівці не обов’язково",
  ),
  materialReq: L("Material", "Material", "Мавод", "Материал", "Материал", "Материал", "Матеріал"),
  materialRule: L(
    "Paint or a suitable removable marking, such as a decal",
    "Bo‘yoq yoki olib tashlanadigan belgi, masalan stiker",
    "Ранг ё аломати қобили бардошт, монанди плисак",
    "Краска или съёмная маркировка, например наклейка",
    "Бояу немесе алынатын белгі, мысалы жапсырма",
    "Боёк же алынуучу белги, мисалы жабыштыргыч",
    "Фарба або знімне маркування, наприклад наліпка",
  ),
  cfrNote: L(
    "These requirements are established in 49 CFR § 390.21T and FMCSA's marking guidance. This shop still prints MC on the plaque and requires it on the ticket.",
    "Bu talablar 49 CFR § 390.21T va FMCSA belgilash qo‘llanmasida. Bu do‘kon MC ni plaketkada chop etadi va chiptada talab qiladi.",
    "Ин талабот дар 49 CFR § 390.21T ва дастури қайди FMCSA муқаррар шудаанд. Ин дӯкон MC-ро дар лавҳа чоп мекунад ва дар чипта талаб мекунад.",
    "Эти требования заданы в 49 CFR § 390.21T и руководстве FMCSA. Этот цех всё равно печатает MC на табличке и требует его в заявке.",
    "Бұл талаптар 49 CFR § 390.21T және FMCSA белгілеу нұсқаулығында. Бұл дүкен MC-ні тақтада басады және билетте талап етеді.",
    "Бул талаптар 49 CFR § 390.21T жана FMCSA белгилөө колдонмосунда. Бул дүкөн MC'ни тактада басат жана билетте талап кылат.",
    "Ці вимоги встановлені в 49 CFR § 390.21T і настановах FMCSA. Цей цех усе одно друкує MC на табличці й вимагає його в заявці.",
  ),
  inch20: L("20 INCH", "20 DYUYM", "20 ДЮЙМ", "20 ДЮЙМ", "20 ДЮЙМ", "20 ДЮЙМ", "20 ДЮЙМ"),
  inch12: L("12 INCH", "12 DYUYM", "12 ДЮЙМ", "12 ДЮЙМ", "12 ДЮЙМ", "12 ДЮЙМ", "12 ДЮЙМ"),
  leftDoor: L("Left", "Chap", "Чап", "Левая", "Сол", "Сол", "Ліва"),
  rightDoor: L("Right", "O‘ng", "Рост", "Правая", "Оң", "Оң", "Права"),
  signCloseup: L("Sign close-up", "Belgi yaqindan", "Наздикии аломат", "Крупный план", "Белгі жақыннан", "Белги жакындан", "Крупний план"),
  onTheDoor: L("On the door", "Eshikda", "Дар дар", "На двери", "Есікте", "Эшикте", "На дверях"),
  driverSide: L("Driver side", "Haydovchi tomoni", "Тарафи ронанда", "Сторона водителя", "Жүргізуші жағы", "Айдоочу тарабы", "Бік водія"),
  otherSide: L("Other side", "Boshqa tomon", "Тарафи дигар", "Другая сторона", "Екінші жақ", "Экинчи тарап", "Інший бік"),
  artworkPrint: L(
    "20 × 12 in artwork. This is what we print — not stretched.",
    "20 × 12 dyuym rasm. Shu chop etiladi — cho‘zilmaydi.",
    "Тасвири 20 × 12 дюйм. Инро чоп мекунем — кашида намешавад.",
    "Макет 20 × 12 дюймов. Это мы печатаем — без растяжения.",
    "20 × 12 дюйм макет. Осыны басамыз — созылмайды.",
    "20 × 12 дюйм макет. Ушуну басабыз — созулбайт.",
    "Макет 20 × 12 дюймів. Це ми друкуємо — без розтягування.",
  ),
  otherSideLook: L(
    "Other-side look is the driver-door photo flipped. Lettering is not mirrored. Placement is a preview only.",
    "Boshqa tomon — haydovchi eshigi suratining ag‘darilgani. Yozuv oynalanmaydi. Joylashuv faqat ko‘rinish.",
    "Тарафи дигар акси дари ронандаи чаппашуда аст. Навиштаҷот оина намешавад. Ҷойгиршавӣ танҳо пешнамоиш аст.",
    "Другая сторона — перевёрнутое фото двери водителя. Надпись не зеркалится. Размещение только превью.",
    "Екінші жақ — жүргізуші есігі суретінің аударылғаны. Жазу айналанбайды. Орналасу тек алдын ала көрініс.",
    "Экинчи тарап — айдоочу эшиги сүрөтүнүн оодарылганы. Жазуу күзгүлөнбөйт. Жайгашуу жөн гана көрүнүш.",
    "Інший бік — перевернуте фото дверей водія. Напис не дзеркалиться. Розміщення лише прев’ю.",
  ),
  onCabPreview: L(
    "On the cab door, below the window, clear of the handle and mirror. Preview only — vinyl is still 20 × 12 in.",
    "Kabina eshigida, deraza ostida, tutqich va oynadan uzoq. Faqat ko‘rinish — vinil baribir 20 × 12 dyuym.",
    "Дар дари кабина, дар зери тиреза, дур аз дастак ва оина. Танҳо пешнамоиш — винил 20 × 12 дюйм мемонад.",
    "На двери кабины, под окном, в стороне от ручки и зеркала. Только превью — винил всё равно 20 × 12.",
    "Кабина есігінде, терезе астында, тұтқа мен айнадан алыс. Тек алдын ала көрініс — винил әлі 20 × 12.",
    "Кабина эшигинде, терезенин астында, тутка менен күзгүдөн алыс. Жөн гана көрүнүш — винил дагы 20 × 12.",
    "На дверях кабіни, під вікном, осторонь від ручки й дзеркала. Лише прев’ю — вініл усе одно 20 × 12.",
  ),
  doorVinylTitle: L("Door vinyl · 20 × 12 in", "Eshik vinili · 20 × 12 dyuym", "Винили дар · 20 × 12 дюйм", "Винил двери · 20 × 12 дюймов", "Есік винилі · 20 × 12 дюйм", "Эшик винили · 20 × 12 дюйм", "Вініл дверей · 20 × 12 дюймів"),
  doorVinylDesc: L(
    "Full artwork at print proportion. On-truck placement is a look only and is not the cut file.",
    "To‘liq rasm chop nisbatida. Yuk mashinasidagi joylashuv faqat ko‘rinish, kesilgan fayl emas.",
    "Тамоми тасвир дар таносуби чоп. Ҷойгиршавӣ дар мошин танҳо намуд аст, на файли бурида.",
    "Полный макет в пропорции печати. Размещение на грузовике — только вид, не файл резки.",
    "Толық макет баспа пропорциясында. Жүк көлігіндегі орналасу тек көрініс, кесу файлы емес.",
    "Толук макет басма пропорциясында. Жүк ташуучудагы жайгашуу жөн гана көрүнүш, кесүү файлы эмес.",
    "Повний макет у пропорції друку. Розміщення на вантажівці — лише вигляд, не файл різки.",
  ),
  placement: L("Placement", "Joylashuv", "Ҷойгиршавӣ", "Размещение", "Орналасу", "Жайгашуу", "Розміщення"),
  nudgeLeft: L("Left", "Chap", "Чап", "Влево", "Солға", "Солго", "Ліворуч"),
  nudgeRight: L("Right", "O‘ng", "Рост", "Вправо", "Оңға", "Оңго", "Праворуч"),
  nudgeUp: L("Up", "Yuqori", "Боло", "Вверх", "Жоғары", "Жогору", "Вгору"),
  nudgeDown: L("Down", "Past", "Поён", "Вниз", "Төмен", "Төмөн", "Вниз"),
  nudgeSmaller: L("Smaller", "Kichikroq", "Хурдтар", "Мельче", "Кішірек", "Кичирээк", "Дрібніше"),
  nudgeLarger: L("Larger", "Kattaroq", "Калонтар", "Крупнее", "Үлкенірек", "Чоңураак", "Більше"),
  inspectDoorVinyl: L(
    "Inspect door vinyl",
    "Eshik vinilini ko‘rish",
    "Дидани винили дар",
    "Осмотреть винил двери",
    "Есік винилін қарау",
    "Эшик винилин көрүү",
    "Оглянути вініл дверей",
  ),
  inspectArtwork: L(
    "Inspect 20 × 12 in artwork",
    "20 × 12 dyuym rasmni ko‘rish",
    "Дидани тасвири 20 × 12 дюйм",
    "Осмотреть макет 20 × 12 дюймов",
    "20 × 12 дюйм макетті қарау",
    "20 × 12 дюйм макетти көрүү",
    "Оглянути макет 20 × 12 дюймів",
  ),
  pageNotInShop: L(
    "That page is not in the shop",
    "Bu sahifa do‘konda yo‘q",
    "Ин саҳифа дар дӯкон нест",
    "Этой страницы нет в магазине",
    "Бұл бет дүкенде жоқ",
    "Бул барак дүкөндө жок",
    "Цієї сторінки немає в майстерні",
  ),
  pageNotInShopLead: L(
    "Use samples, the print desk, the cart, or the order list.",
    "Namunalar, chop stoli, savat yoki buyurtmalar ro‘yxatidan foydalaning.",
    "Намунаҳо, мизи чоп, сабад ё рӯйхати фармоишро истифода баред.",
    "Откройте образцы, печатный стол, корзину или список заказов.",
    "Үлгілер, басу үстелі, себет немесе тапсырыс тізімін пайдаланыңыз.",
    "Үлгүлөр, басып чыгаруу столу, себет же буйрутма тизмесин колдонуңуз.",
    "Відкрийте зразки, стіл друку, кошик або список замовлень.",
  ),
  home: L("Home", "Bosh sahifa", "Саҳифаи асосӣ", "Главная", "Басты бет", "Башкы бет", "Головна"),
  printDeskHitSnag: L(
    "The print desk hit a snag",
    "Chop stolida xato yuz berdi",
    "Дар мизи чоп хато рӯй дод",
    "Сбой на печатном столе",
    "Басу үстелінде қате",
    "Басып чыгаруу столунда ката",
    "Збій на друкарському столі",
  ),
  reloadOrBack: L(
    "Reload this page or go back to the door designer.",
    "Sahifani qayta yuklang yoki eshik dizayneriga qayting.",
    "Саҳифаро аз нав бор кунед ё ба тарроҳи дар баргардед.",
    "Обновите страницу или вернитесь в конструктор двери.",
    "Бетті қайта жүктеңіз немесе есік дизайнеріне оралыңыз.",
    "Баракты кайра жүктөңүз же эшик дизайнерине кайтыңыз.",
    "Оновіть сторінку або поверніться в конструктор дверей.",
  ),
  tryAgain: L("Try again", "Qayta urinish", "Бори дигар", "Повторить", "Қайта көру", "Кайра аракет", "Спробувати знову"),
  doorVinyl: L("Door vinyl", "Eshik vinili", "Винили дар", "Винил двери", "Есік винилі", "Эшик винили", "Вініл дверей"),
  previewAria: L("Preview {name}", "{name} ni ko‘rish", "Дидани {name}", "Просмотр {name}", "{name} көру", "{name} көрүү", "Перегляд {name}"),
  sourceWeb: L("web", "sayt", "сайт", "сайт", "сайт", "сайт", "сайт"),
  sourceTelegram: L("telegram", "telegram", "telegram", "telegram", "telegram", "telegram", "telegram"),
  noteNeedName: L(
    "Enter the MCS-150 name (legal name or one trade name) for the door.",
    "Eshik uchun MCS-150 nomini (qonuniy yoki bitta savdo nomi) yozing.",
    "Номи MCS-150 (қонунӣ ё як номи тиҷоратӣ)-ро барои дар нависед.",
    "Укажите имя MCS-150 (юридическое или одно торговое) для двери.",
    "Есік үшін MCS-150 атауын (заңды немесе бір сауда атауы) жазыңыз.",
    "Эшик үчүн MCS-150 атын (мыйзамдуу же бир соода аты) жазыңыз.",
    "Вкажіть назву MCS-150 (юридичну або одну торгову) для дверей.",
  ),
  noteUsdotDigits: L(
    "USDOT number should be 4–12 digits.",
    "USDOT raqami 4–12 ta raqam bo‘lishi kerak.",
    "Рақами USDOT бояд 4–12 рақам бошад.",
    "Номер USDOT — 4–12 цифр.",
    "USDOT нөмірі 4–12 цифр болуы керек.",
    "USDOT номери 4–12 сан болушу керек.",
    "Номер USDOT — 4–12 цифр.",
  ),
  noteMcDigits: L(
    "MC (FMCSA) number should be 4–10 digits.",
    "MC (FMCSA) raqami 4–10 ta raqam bo‘lishi kerak.",
    "Рақами MC (FMCSA) бояд 4–10 рақам бошад.",
    "Номер MC (FMCSA) — 4–10 цифр.",
    "MC (FMCSA) нөмірі 4–10 цифр болуы керек.",
    "MC (FMCSA) номери 4–10 сан болушу керек.",
    "Номер MC (FMCSA) — 4–10 цифр.",
  ),
  noteUsername: L(
    "Username must be 3–24 letters, numbers, or underscores.",
    "Nom 3–24 harf, raqam yoki _ bo‘lishi kerak.",
    "Ном бояд 3–24 ҳарф, рақам ё _ бошад.",
    "Имя — 3–24 буквы, цифры или _.",
    "Ат 3–24 әріп, сан немесе _ болуы керек.",
    "Ат 3–24 тамга, сан же _ болушу керек.",
    "Ім’я — 3–24 літери, цифри або _.",
  ),
  noteContrastName: L(
    "Door name vs background is low contrast for 50-foot daylight reading.",
    "Eshik nomi va fon 50 fut kunduzgi o‘qish uchun kontrast past.",
    "Номи дар ва замина барои хондан аз 50 фут контрасти паст доранд.",
    "Имя на двери слабо контрастирует с фоном для чтения с 50 футов.",
    "Есік атауы мен фон 50 фут күндізгі оқу үшін контрасты төмен.",
    "Эшик аты менен фон 50 фут күндүзгү окуу үчүн контрасты төмөн.",
    "Назва на дверях слабко контрастує з тлом для читання з 50 футів.",
  ),
  noteContrastLegal: L(
    "USDOT and MC vs background is low contrast for 50-foot daylight reading.",
    "USDOT va MC fon bilan 50 fut kunduzgi o‘qish uchun kontrast past.",
    "USDOT ва MC бо замина барои хондан аз 50 фут контрасти паст доранд.",
    "USDOT и MC слабо контрастируют с фоном для чтения с 50 футов.",
    "USDOT пен MC фонмен 50 фут күндізгі оқу үшін контрасты төмен.",
    "USDOT жана MC фон менен 50 фут күндүзгү окуу үчүн контрасты төмөн.",
    "USDOT і MC слабко контрастують з тлом для читання з 50 футів.",
  ),
  noteContrastPlate: L(
    "ID band lettering vs the band is low contrast for 50-foot daylight reading.",
    "ID tasma yozuvi tasma bilan 50 fut kunduzgi o‘qish uchun kontrast past.",
    "Навиштаҷоти тасмаи ID бо тасма барои хондан аз 50 фут контрасти паст дорад.",
    "Буквы на полосе ID слабо контрастируют с полосой для чтения с 50 футов.",
    "ID жолақ жазуы жолақпен 50 фут күндізгі оқу үшін контрасты төмен.",
    "ID тилке жазуусу тилке менен 50 фут күндүзгү окуу үчүн контрасты төмөн.",
    "Літери на смузі ID слабко контрастують зі смугою для читання з 50 футів.",
  ),
  noteMcOn: L(
    "Turned MC back on so the shop-required ID prints.",
    "Do‘kon talab qiladigan ID chop etilishi uchun MC qayta yoqildi.",
    "MC дубора фурӯзон шуд, то ID-и ҳатмии дӯкон чоп шавад.",
    "MC снова включён, чтобы печатался обязательный ID цеха.",
    "Дүкен талап ететін ID басылуы үшін MC қайта қосылды.",
    "Дүкөн талап кылган ID басылышы үчүн MC кайра күйгүзүлдү.",
    "MC знову ввімкнено, щоб друкувався обов’язковий ID цеху.",
  ),
  noteMovedShare: L(
    "Moved to {layout} so the mark and name share the 20 × 12 in board.",
    "Belgi va nom 20 × 12 taxtani bo‘lishishi uchun {layout} ga o‘tkazildi.",
    "Ба {layout} гузаронида шуд, то нишон ва ном лавҳаи 20 × 12-ро мубодила кунанд.",
    "Переключено на {layout}, чтобы знак и имя делили доску 20 × 12.",
    "Белгі мен атау 20 × 12 тақтаны бөлісуі үшін {layout} орналасуына ауыстырылды.",
    "Белги жана ат 20 × 12 тактаны бөлүшүшү үчүн {layout} жайгашуусуна өткөрүлдү.",
    "Перемкнуто на {layout}, щоб знак і назва ділили дошку 20 × 12.",
  ),
  noteEnlargedLogo: L(
    "Enlarged the logo so it reads as a major mark.",
    "Logo asosiy belgi bo‘lishi uchun kattalashtirildi.",
    "Лого калон карда шуд, то ҳамчун нишони асосӣ хонда шавад.",
    "Логотип увеличен, чтобы читался как основной знак.",
    "Логотип негізгі белгі ретінде оқылуы үшін үлкейтілді.",
    "Логотип негизги белги катары окулушу үчүн чоңойтулду.",
    "Логотип збільшено, щоб читався як основний знак.",
  ),
  noteReducedLogo: L(
    "Reduced the logo so USDOT and MC stay at a readable size.",
    "USDOT va MC o‘qiladigan o‘lchamda qolishi uchun logo kichraytirildi.",
    "Лого хурд карда шуд, то USDOT ва MC хонда шаванд.",
    "Логотип уменьшен, чтобы USDOT и MC остались читаемыми.",
    "USDOT пен MC оқылатын болуы үшін логотип кішірейтілді.",
    "USDOT жана MC окула турган болушу үчүн логотип кичирейтилди.",
    "Логотип зменшено, щоб USDOT і MC лишилися читабельними.",
  ),
  noteReducedLogoHint: L(
    "Logo was reduced so USDOT and MC stay at a readable size. Try a smaller logo, White with Logo, or wrap the company name.",
    "USDOT va MC o‘qilishi uchun logo kichraytirildi. Kichikroq logo, White with Logo yoki nomni ikki qator qiling.",
    "Лого хурд шуд, то USDOT ва MC хонда шаванд. Логои хурдтар, White with Logo ё номро ду сатр кунед.",
    "Логотип уменьшен, чтобы USDOT и MC остались читаемыми. Возьмите логотип меньше, White with Logo или перенесите имя.",
    "USDOT пен MC оқылуы үшін логотип кішірейтілді. Кішірек логотип, White with Logo немесе атауды ораңыз.",
    "USDOT жана MC окулушу үчүн логотип кичирейтилди. Кичине логотип, White with Logo же атты ороңуз.",
    "Логотип зменшено, щоб USDOT і MC лишилися читабельними. Менший логотип, White with Logo або перенесіть назву.",
  ),
  noteLogoSmall: L(
    "Logo is small on this layout. Increase size or pick White with Logo.",
    "Bu joylashuvda logo kichik. O‘lchamni oshiring yoki White with Logo ni tanlang.",
    "Дар ин тарҳ лого хурд аст. Андозаро зиёд кунед ё White with Logo-ро интихоб кунед.",
    "На этом макете логотип мелкий. Увеличьте размер или выберите White with Logo.",
    "Бұл орналасуда логотип кішкентай. Өлшемді үлкейтіңіз немесе White with Logo таңдаңыз.",
    "Бул жайгашууда логотип кичине. Өлчөмдү чоңойтуңуз же White with Logo тандаңыз.",
    "На цьому макеті логотип дрібний. Збільшіть розмір або оберіть White with Logo.",
  ),
  noteWhiteBlack: L(
    "Switched to white vinyl and black lettering for daylight contrast.",
    "Kunduzgi kontrast uchun oq vinil va qora yozuvga o‘tkazildi.",
    "Ба винили сафед ва навиштаи сиёҳ барои контрасти рӯзона гузаронида шуд.",
    "Переключено на белый винил и чёрную надпись для дневного контраста.",
    "Күндізгі контраст үшін ақ винил мен қара жазуға ауыстырылды.",
    "Күндүзгү контраст үчүн ак винил жана кара жазууга өткөрүлдү.",
    "Перемкнуто на білий вініл і чорний напис для денного контрасту.",
  ),
  noteCondensed: L(
    "Switched to condensed so the company name stays large.",
    "Kompaniya nomi katta qolishi uchun siqiq shriftga o‘tkazildi.",
    "Ба ҳуруфи фишурда гузаронида шуд, то номи ширкат калон бимонад.",
    "Переключено на узкий шрифт, чтобы имя компании осталось крупным.",
    "Компания атауы үлкен қалуы үшін тығыз қаріпке ауыстырылды.",
    "Компания аты чоң калышы үчүн жыш арипке өткөрүлдү.",
    "Перемкнуто на вузький шрифт, щоб назва компанії лишилася великою.",
  ),
  noteCropStays: L(
    "Crop-to-fill stays on — it is an explicit choice, not a default.",
    "To‘ldirish uchun qirqish yoqilgan qoladi — bu ongli tanlov, standart emas.",
    "Буридан барои пур кардан фурӯзон мемонад — интихоби огоҳона, на стандарт.",
    "Обрезка в край остаётся — это явный выбор, не значение по умолчанию.",
    "Толтыру үшін қию қосулы қалады — бұл анық таңдау, әдепкі емес.",
    "Толтуруу үчүн кесүү күйүк бойдон калат — бул ачык тандоо, демейки эмес.",
    "Обрізка вкрай лишається ввімкненою — це явний вибір, не типово.",
  ),
  noteKeptUpload: L(
    "Kept the upload on a 20 × 12 in board. Flattened type was not rewritten.",
    "Yuklama 20 × 12 taxtada qoldirildi. Yassilangan yozuv qayta yozilmadi.",
    "Боргузорӣ дар лавҳаи 20 × 12 нигоҳ дошта шуд. Навиштаи ҳамвор аз нав навишта нашуд.",
    "Загрузка оставлена на доске 20 × 12. Сведённый текст не переписывался.",
    "Жүктеме 20 × 12 тақтада қалдырылды. Тегістелген жазу қайта жазылмады.",
    "Жүктөмө 20 × 12 тактада калтырылды. Тегизделген жазуу кайра жазылган жок.",
    "Завантаження залишено на дошці 20 × 12. Зведений текст не переписувався.",
  ),
  noteFullFace: L(
    "Pushed the logo to full-face so it is not a postage stamp.",
    "Logo pochta markasiga o‘xshamasligi uchun to‘liq yuzga kattalashtirildi.",
    "Лого ба тамоми рӯя калон карда шуд, то мисли тамғаи почта набошад.",
    "Логотип увеличен на всю плашку, чтобы не выглядел маркой.",
    "Логотип пошта маркасындай көрінбеуі үшін толық бетке үлкейтілді.",
    "Логотип почта маркасындай көрүнбөшү үчүн толук бетке чоңойтулду.",
    "Логотип збільшено на всю плашку, щоб не виглядав маркою.",
  ),
  noteChangedLayout: L(
    "Changed layout to {layout} so the logo does not cover required lettering.",
    "Logo majburiy yozuvni yopmasligi uchun joylashuv {layout} ga o‘zgartirildi.",
    "Тарҳ ба {layout} иваз шуд, то лого навиштаҷоти ҳатмиро напӯшонад.",
    "Макет сменён на {layout}, чтобы логотип не закрывал обязательную надпись.",
    "Логотип міндетті жазуды жаппауы үшін орналасу {layout} болып өзгертілді.",
    "Логотип милдеттүү жазууну жаппашы үчүн жайгашуу {layout} болуп өзгөртүлдү.",
    "Макет змінено на {layout}, щоб логотип не закривав обов’язковий напис.",
  ),
  noteNudgedLogo: L(
    "Nudged the logo down one size so it does not cover USDOT.",
    "Logo USDOT ni yopmasligi uchun bir o‘lcham kichiklashtirildi.",
    "Лого як андоза хурд карда шуд, то USDOT-ро напӯшонад.",
    "Логотип уменьшен на один размер, чтобы не закрывать USDOT.",
    "Логотип USDOT-ті жаппауы үшін бір өлшем кішірейтілді.",
    "Логотип USDOT'ту жаппашы үчүн бир өлчөм кичирейтилди.",
    "Логотип зменшено на один розмір, щоб не закривати USDOT.",
  ),
  noteCleanWhite: L(
    "Moved to Clean white so USDOT stays fully on the 20 × 12 in board.",
    "USDOT 20 × 12 taxtada to‘liq qolishi uchun Toza oq ga o‘tkazildi.",
    "Ба Сафеди тоза гузаронида шуд, то USDOT пурра дар лавҳаи 20 × 12 бимонад.",
    "Переключено на Чистый белый, чтобы USDOT полностью остался на доске 20 × 12.",
    "USDOT 20 × 12 тақтада толық қалуы үшін Таза аққа ауыстырылды.",
    "USDOT 20 × 12 тактада толук калышы үчүн Таза акка өткөрүлдү.",
    "Перемкнуто на Чистий білий, щоб USDOT повністю лишився на дошці 20 × 12.",
  ),
  noteKeptSheet: L(
    "Kept the production sheet at 20 × 12 in.",
    "Ishlab chiqarish varaqasi 20 × 12 dyuymda qoldirildi.",
    "Варақаи истеҳсол дар 20 × 12 дюйм нигоҳ дошта шуд.",
    "Производственный лист оставлен 20 × 12 дюймов.",
    "Өндіріс парағы 20 × 12 дюймде қалдырылды.",
    "Өндүрүш барагы 20 × 12 дюймде калтырылды.",
    "Виробничий аркуш залишено 20 × 12 дюймів.",
  ),
  notePrintReady: L(
    "Spacing, name fit, logo, and required IDs already look print-ready.",
    "Oraliq, nom sig‘imi, logo va majburiy ID allaqachon chopga tayyor ko‘rinadi.",
    "Фосила, ҷойгиршавии ном, лого ва ID-ҳои ҳатмӣ аллакай барои чоп омодаанд.",
    "Интервалы, имя, логотип и обязательные ID уже выглядят готовыми к печати.",
    "Аралық, атау сыйымдылығы, логотип және міндетті ID қазірдің өзінде басуға дайын.",
    "Аралык, ат батышы, логотип жана милдеттүү ID азыртан басууга даяр көрүнөт.",
    "Інтервали, назва, логотип і обов’язкові ID уже виглядають готовими до друку.",
  ),
  notePriceFirst: L(
    "Set an approved price in cents before Ready for payment.",
    "To‘lovga tayyor dan oldin tasdiqlangan narxni sentlarda qo‘ying.",
    "Пеш аз Барои пардохт омода нархи тасдиқшударо бо сент гузоред.",
    "Назначьте утверждённую цену в центах до статуса К оплате.",
    "Төлемге дайын алдында бекітілген бағаны центпен қойыңыз.",
    "Төлөмгө даяр алдында бекитилген бааны цент менен коюңуз.",
    "Призначте затверджену ціну в центах до статусу До сплати.",
  ),
  noteCancelledPay: L(
    "A cancelled ticket cannot be ready for payment.",
    "Bekor qilingan chipta to‘lovga tayyor bo‘la olmaydi.",
    "Чиптаи бекоршуда барои пардохт омода шуда наметавонад.",
    "Отменённая заявка не может быть к оплате.",
    "Болдырылмаған билет төлемге дайын бола алмайды.",
    "Жокко чыгарылган билет төлөмгө даяр боло албайт.",
    "Скасована заявка не може бути до сплати.",
  ),
  noteAlreadyPaid: L(
    "This ticket is already marked paid.",
    "Bu chipta allaqachon to‘langan deb belgilangan.",
    "Ин чипта аллакай пардохтшуда қайд шудааст.",
    "Эта заявка уже отмечена оплаченной.",
    "Бұл билет әлдеқашан төленген деп белгіленген.",
    "Бул билет мурунтан төлөнгөн деп белгиленген.",
    "Цю заявку вже позначено сплаченою.",
  ),
  noteHandPaid: L(
    "Payment status is not set by hand. Paid is set only from a verified Stripe webhook.",
    "To‘lov holati qo‘lda qo‘yilmaydi. To‘langan faqat tasdiqlangan Stripe webhook dan keyin.",
    "Ҳолати пардохт дастӣ гузошта намешавад. Пардохтшуда танҳо аз вебхуки тасдиқшудаи Stripe.",
    "Статус оплаты руками не ставится. Оплачено только после проверенного webhook Stripe.",
    "Төлем күйі қолмен қойылмайды. Төленді тек расталған Stripe webhook-тан кейін.",
    "Төлөм абалы кол менен коюлбайт. Төлөндү тек текшерилген Stripe webhook'тан кийин.",
    "Статус оплати руками не ставиться. Сплачено лише після перевіреного webhook Stripe.",
  ),
  noteEmailInvalid: L(
    "Enter a valid email.",
    "To‘g‘ri email kiriting.",
    "Почтаи дуруст ворид кунед.",
    "Введите корректную почту.",
    "Жарамды email енгізіңіз.",
    "Туура email киргизиңиз.",
    "Введіть коректну пошту.",
  ),
  notePasswordShort: L(
    "Password must be at least 8 characters.",
    "Parol kamida 8 belgidan iborat bo‘lishi kerak.",
    "Рамз бояд ҳадди ақал 8 аломат бошад.",
    "Пароль должен быть не короче 8 символов.",
    "Құпия сөз кемінде 8 таңба болуы керек.",
    "Сырсөз кеминде 8 белги болушу керек.",
    "Пароль має містити щонайменше 8 символів.",
  ),
  noteAccountExists: L(
    "An account with this email already exists.",
    "Bu email bilan hisob allaqachon bor.",
    "Ҳисоб бо ин почта аллакай ҳаст.",
    "Аккаунт с этой почтой уже есть.",
    "Бұл email-мен аккаунт бар.",
    "Бул email менен аккаунт бар.",
    "Акаунт із цією поштою вже є.",
  ),
  noteAccountWrong: L(
    "Email or password is wrong.",
    "Email yoki parol noto‘g‘ri.",
    "Почта ё рамз нодуруст аст.",
    "Почта или пароль неверны.",
    "Email немесе құпия сөз қате.",
    "Email же сырсөз туура эмес.",
    "Пошта або пароль неправильні.",
  ),
  noteTooManyAuth: L(
    "Too many sign-in attempts. Wait a few minutes.",
    "Kirish urinishlari ko‘p. Bir necha daqiqa kuting.",
    "Кӯшишҳои вуруд зиёданд. Чанд дақиқа интизор шавед.",
    "Слишком много попыток входа. Подождите несколько минут.",
    "Кіру әрекеттері тым көп. Бірнеше минут күтіңіз.",
    "Кирүү аракеттери өтө көп. Бир нече мүнөт күтүңүз.",
    "Забагато спроб входу. Зачекайте кілька хвилин.",
  ),
  size20in: L("20 inches", "20 dyuym", "20 дюйм", "20 дюймов", "20 дюйм", "20 дюйм", "20 дюймів"),
  size12in: L("12 inches", "12 dyuym", "12 дюйм", "12 дюймов", "12 дюйм", "12 дюйм", "12 дюймів"),
  size23in: L("2–3 inches", "2–3 dyuym", "2–3 дюйм", "2–3 дюйма", "2–3 дюйм", "2–3 дюйм", "2–3 дюйми"),
  size2in: L("2 inches", "2 dyuym", "2 дюйм", "2 дюйма", "2 дюйм", "2 дюйм", "2 дюйми"),
  inches20: L("20 inches", "20 dyuym", "20 дюйм", "20 дюймов", "20 дюйм", "20 дюйм", "20 дюймів"),
  inches12: L("12 inches", "12 dyuym", "12 дюйм", "12 дюймов", "12 дюйм", "12 дюйм", "12 дюймів"),
  cartCount: L("Cart, {n} items", "Savat, {n} ta", "Сабад, {n} адад", "Корзина, {n} шт.", "Себет, {n} дана", "Себет, {n} даана", "Кошик, {n} шт."),
  cartEmptyAria: L("Cart", "Savat", "Сабад", "Корзина", "Себет", "Себет", "Кошик"),
};

export const UI = pack(UI_ROWS);

function interpolate(text: string, vars?: Record<string, string>): string {
  if (!vars) return text;
  let next = text;
  for (const [name, value] of Object.entries(vars)) {
    next = next.replaceAll(`{${name}}`, value);
  }
  return next;
}

export function uiT(
  lang: ShopLang,
  key: UiKey,
  vars?: Record<string, string>,
): string {
  return interpolate(UI[lang][key], vars);
}
