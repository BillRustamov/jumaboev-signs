import { HideShopChrome } from "@/components/hide-shop-chrome";
import { SignCanvas } from "@/components/sign-canvas";
import { ARTWORK_FITS, DEMO_EXISTING_SIGN } from "@/lib/artwork";
import { emptySign } from "@/lib/order";
import type { SignFields } from "@/lib/order";

export const dynamic = "force-dynamic";

function demo(fit: SignFields["artworkFit"], withIds = false): SignFields {
  return {
    ...emptySign(),
    companyName: withIds ? "RIDGE HAULING" : "",
    city: withIds ? "Dallas" : "",
    state: withIds ? "TX" : "",
    dotNumber: withIds ? "3311999" : "",
    mcNumber: withIds ? "1051888" : "",
    logoDataUrl: DEMO_EXISTING_SIGN,
    originalArtworkUrl: DEMO_EXISTING_SIGN,
    logoAspect: 4 / 3,
    artworkRole: "existing-sign",
    artworkFit: fit,
  };
}

export default function ArtworkPreviewPage() {
  return (
    <main className="min-h-screen bg-neutral-200 p-6">
      <HideShopChrome />
      <p className="mb-4 font-sans text-sm font-semibold tracking-wide text-neutral-700 uppercase">
        Uploaded artwork · 20 × 12 in · 4:3 source · never stretched
      </p>
      <div className="grid gap-8 lg:grid-cols-2">
        {ARTWORK_FITS.map((item) => (
          <section key={item.id} className="mx-auto w-full max-w-3xl">
            <p className="mb-2 font-sans text-sm font-semibold text-neutral-800">
              {item.label} · {item.id}
            </p>
            <p className="mb-2 text-xs text-neutral-600">{item.hint}</p>
            <div className="bg-white p-3 shadow-md">
              <div className="aspect-[20/12] w-full">
                <SignCanvas fields={demo(item.id)} previewBackdrop />
              </div>
            </div>
          </section>
        ))}
      </div>
      <section className="mx-auto mt-10 w-full max-w-3xl">
        <p className="mb-2 font-sans text-sm font-semibold text-neutral-800">
          Fit entire plus required IDs added on the ticket
        </p>
        <div className="bg-white p-3 shadow-md">
          <div className="aspect-[20/12] w-full">
            <SignCanvas fields={demo("contain", true)} previewBackdrop />
          </div>
        </div>
      </section>
    </main>
  );
}
