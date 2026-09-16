import { NextResponse } from "next/server";
import { normalizeSign, type SignFields } from "@/lib/order";
import { getPreviewDraft, savePreviewDraft } from "@/lib/preview-draft";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  const fields = id ? getPreviewDraft(id) : undefined;
  if (!fields) {
    return NextResponse.json({ error: "No preview draft." }, { status: 404 });
  }
  return NextResponse.json(fields);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send JSON fields." }, { status: 400 });
  }
  const input = body as { id?: string; fields?: Partial<SignFields> };
  const id =
    typeof input.id === "string" && input.id.startsWith("pv-")
      ? input.id
      : `pv-${Math.floor(100000 + Math.random() * 900000)}`;
  const fields = normalizeSign(input.fields ?? {});
  savePreviewDraft(id, fields);
  return NextResponse.json({ id });
}
