import { TruckSign } from "@/components/truck-sign";
import { SUGGESTED_LAYOUT } from "@/lib/samples";
import { FMCSA_ROWS, VINYL, VINYL_SIZE_ROWS } from "@/lib/vinyl-spec";

export function VinylSpecPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-lg ring-1 ring-white/10">
        <div className="px-5 pb-5 pt-4 sm:px-6">
          <p className="inline-flex rounded-full bg-emerald-950 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
            Suggested layout for a semi-truck
          </p>
          <div className="mt-4 overflow-hidden rounded-lg bg-white">
            <TruckSign fields={SUGGESTED_LAYOUT.fields} />
          </div>
          <p className="mt-3 text-center text-xs text-neutral-400">
            Illustrative layout — replace with the carrier&apos;s registered
            information.
          </p>
          <table className="mt-5 w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-neutral-400">
                <th className="pb-2 font-medium">Item</th>
                <th className="pb-2 text-right font-medium">Recommended size</th>
              </tr>
            </thead>
            <tbody>
              {VINYL_SIZE_ROWS.map((row) => (
                <tr key={row.item} className="border-b border-white/10">
                  <td className="py-2.5">{row.item}</td>
                  <td className="py-2.5 text-right text-neutral-200">
                    {row.size}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-lg ring-1 ring-white/10">
        <div className="px-5 pb-5 pt-4 sm:px-6">
          <h3 className="text-lg font-semibold tracking-tight">
            1. Official federal requirements
          </h3>
          <table className="mt-5 w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-neutral-400">
                <th className="pb-2 font-medium">Requirement</th>
                <th className="pb-2 font-medium">FMCSA rule</th>
              </tr>
            </thead>
            <tbody>
              {FMCSA_ROWS.map((row) => (
                <tr key={row.requirement} className="border-b border-white/10">
                  <td className="py-2.5 pr-3">{row.requirement}</td>
                  <td className="py-2.5 text-neutral-200">{row.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs leading-5 text-neutral-400">
            These requirements are established in {VINYL.cfr} and FMCSA&apos;s
            marking guidance. This shop still prints MC on the plaque and
            requires it on the ticket.
          </p>
        </div>
      </article>
    </div>
  );
}
