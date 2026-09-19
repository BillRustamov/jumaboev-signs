import { SignCanvas } from "@/components/sign-canvas";
import { HideShopChrome } from "@/components/hide-shop-chrome";
import { DRIVER_SAMPLES } from "@/lib/samples";
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
      <div className="grid gap-8">
        {samples.map((sample) => (
          <section key={sample.id} className="mx-auto w-full max-w-5xl">
            <p className="mb-2 font-sans text-sm font-semibold tracking-wide text-neutral-700 uppercase">
              {sample.id} · 20 × 12 in
            </p>
            <div className="bg-white p-3 shadow-md">
              <div className="aspect-[20/12] w-full">
                <SignCanvas fields={sample.fields} previewBackdrop />
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
