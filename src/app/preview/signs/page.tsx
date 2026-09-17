import { SignCanvas } from "@/components/sign-canvas";
import { HideShopChrome } from "@/components/hide-shop-chrome";
import { DRIVER_SAMPLES } from "@/lib/samples";
import { emptySign } from "@/lib/order";
import { TEMPLATES, type TemplateId } from "@/lib/design";

export const dynamic = "force-dynamic";

const IDS = TEMPLATES.map((item) => item.id);

export default async function SignTemplatesPreview({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const raw = Array.isArray(q.id) ? q.id[0] : q.id;
  const only = IDS.includes(raw as TemplateId) ? (raw as TemplateId) : null;
  const samples = only
    ? DRIVER_SAMPLES.filter((sample) => sample.id === only)
    : DRIVER_SAMPLES;

  return (
    <main className="min-h-screen bg-neutral-200 p-6">
      <HideShopChrome />
      <div className={only ? "mx-auto max-w-5xl" : "grid gap-8"}>
        {(samples.length ? samples : [{ id: only, fields: emptySign() }]).map(
          (sample) => (
            <section key={sample.id ?? "sign"} className="mx-auto w-full max-w-5xl">
              <p className="mb-2 font-sans text-sm font-semibold tracking-wide text-neutral-700 uppercase">
                {sample.id} · 20 × 12 in
              </p>
              <div className="bg-white p-3 shadow-md">
                <SignCanvas
                  fields={{
                    ...emptySign(),
                    ...("fields" in sample && sample.fields
                      ? sample.fields
                      : {}),
                    templateId: (sample.id as TemplateId) ?? "clean-white",
                  }}
                  previewBackdrop
                />
              </div>
            </section>
          ),
        )}
      </div>
    </main>
  );
}
