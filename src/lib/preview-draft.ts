import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { SignFields } from "@/lib/order";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "preview-drafts.json");

type DraftMap = Record<string, SignFields>;

type GlobalDrafts = typeof globalThis & {
  __jumaboevPreviewDrafts?: Map<string, SignFields>;
};

function hydrate(): Map<string, SignFields> {
  const map = new Map<string, SignFields>();
  try {
    const raw = JSON.parse(
      readFileSync(/* turbopackIgnore: true */ DATA_FILE, "utf8"),
    ) as DraftMap;
    for (const [id, fields] of Object.entries(raw)) {
      if (id && fields) map.set(id, fields);
    }
  } catch {
    /* first run */
  }
  return map;
}

function drafts(): Map<string, SignFields> {
  const g = globalThis as GlobalDrafts;
  if (!g.__jumaboevPreviewDrafts) g.__jumaboevPreviewDrafts = hydrate();
  return g.__jumaboevPreviewDrafts;
}

function persist(): void {
  try {
    mkdirSync(/* turbopackIgnore: true */ DATA_DIR, { recursive: true });
    writeFileSync(
      /* turbopackIgnore: true */ DATA_FILE,
      JSON.stringify(Object.fromEntries(drafts()), null, 2),
    );
  } catch (error) {
    console.error("Could not persist preview drafts.", error);
  }
}

export function savePreviewDraft(id: string, fields: SignFields): void {
  drafts().set(id, fields);
  persist();
}

export function getPreviewDraft(id: string): SignFields | undefined {
  return drafts().get(id);
}
