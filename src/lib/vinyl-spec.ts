/** Shop example cut: 20 × 12 in navy-gold door plaque. */

export const VINYL = {
  widthIn: "20",
  heightIn: "12",
  size: "20 × 12 in",
  sizeEach: "20 × 12 in each cab side",
  nameLetters: "2–3 in",
  usdotLetters: "2–3 in",
  mcLetters: "2 in",
  readabilityFt: "50",
  printWIn: 20,
  printHIn: 10,
  printSize: "20 × 10 in",
  sheetIn: 24,
  cfr: "49 CFR § 390.21",
} as const;

export const VINYL_SIZE_ROWS = [
  { item: "Sticker width", size: "20 inches" },
  { item: "Sticker height", size: "12 inches" },
  { item: "Company name letters", size: "2–3 inches" },
  { item: "USDOT number letters", size: "2–3 inches" },
  { item: "MC number letters", size: "2 inches" },
] as const;

export const FMCSA_ROWS = [
  { requirement: "Minimum letter height", rule: "No fixed federal measurement" },
  { requirement: "Readability", rule: "At least 50 feet" },
  { requirement: "Placement", rule: "Both sides of the truck's power unit" },
  { requirement: "Color", rule: "Strong contrast with the truck" },
  { requirement: "Company name", rule: "Required" },
  { requirement: "USDOT number", rule: "Required" },
  { requirement: "MC number", rule: "Not required on the truck" },
  { requirement: "Material", rule: "Paint or a suitable removable marking, such as a decal" },
] as const;
