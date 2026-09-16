import { WhiteSemiTruck } from "@/components/white-semi-truck";
import { HideShopChrome } from "@/components/hide-shop-chrome";
import type { SignFields } from "@/lib/order";
import { applyPreset } from "@/lib/sign-style";
import { DRIVER_SAMPLES } from "@/lib/samples";
import { getPreviewDraft } from "@/lib/preview-draft";

export const dynamic = "force-dynamic";

const EXAMPLE = DRIVER_SAMPLES[0].fields;

function fieldsFromQuery(
  q: Record<string, string | string[] | undefined>,
): SignFields {
  const pick = (key: string) => {
    const value = q[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const preset = applyPreset(pick("preset") || "elbrus");
  return {
    ...EXAMPLE,
    ...preset,
    companyName: pick("company") || EXAMPLE.companyName,
    legalName: pick("legal") ?? EXAMPLE.legalName,
    dotNumber: pick("dot") || EXAMPLE.dotNumber,
    mcNumber: pick("mc") || EXAMPLE.mcNumber,
    showMc: true,
    logoDataUrl: EXAMPLE.logoDataUrl,
  };
}

export default async function BotPreviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const draftId = Array.isArray(q.draft) ? q.draft[0] : q.draft;
  const fields = (draftId && getPreviewDraft(draftId)) || fieldsFromQuery(q);

  return (
    <main className="min-h-screen bg-[#eceff2] p-0">
      <HideShopChrome />
      <WhiteSemiTruck
        fields={fields}
        interactive={false}
        className="rounded-none ring-0"
      />
    </main>
  );
}
