export const PRINT_FILE_MAX_BYTES = 8 * 1024 * 1024;

const PRINT_MIME = new Set([
  "application/pdf",
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

const PRINT_EXT = /\.(pdf|svg|png|jpe?g|webp)$/i;

export type PrintMime =
  | "application/pdf"
  | "image/svg+xml"
  | "image/png"
  | "image/jpeg"
  | "image/webp";

export function isPrintFile(
  mimeType: string | undefined,
  fileName: string | undefined,
): boolean {
  if (mimeType && PRINT_MIME.has(mimeType.toLowerCase())) return true;
  if (fileName && PRINT_EXT.test(fileName)) return true;
  return false;
}

export function resolvePrintMime(
  mimeType: string | undefined,
  fileName: string | undefined,
): PrintMime | null {
  const mime = mimeType?.toLowerCase() ?? "";
  if (mime === "application/pdf") return "application/pdf";
  if (mime === "image/svg+xml") return "image/svg+xml";
  if (mime === "image/png") return "image/png";
  if (mime === "image/jpeg" || mime === "image/jpg") return "image/jpeg";
  if (mime === "image/webp") return "image/webp";
  const name = fileName?.toLowerCase() ?? "";
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".svg")) return "image/svg+xml";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".webp")) return "image/webp";
  return null;
}

/** Raster only. Never mount SVG or PDF as live documents. */
export function canPreviewAsImage(mime: string | undefined): boolean {
  return (
    mime === "image/png" ||
    mime === "image/jpeg" ||
    mime === "image/jpg" ||
    mime === "image/webp"
  );
}

export function printFileFromDataUrl(dataUrl: string): {
  mime: string;
  bytes: number;
} | null {
  const match = /^data:([^;,]+);base64,([\s\S]+)$/.exec(dataUrl);
  if (!match) return null;
  const mime = match[1];
  const bytes = Math.floor((match[2].length * 3) / 4);
  return { mime, bytes };
}

export function telegramPrintUsername(chatId: number): string {
  const raw = `tg${String(chatId).replace("-", "n")}`;
  return raw.slice(0, 24);
}
