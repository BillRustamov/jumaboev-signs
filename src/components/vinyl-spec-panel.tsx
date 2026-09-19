"use client";

import { DimensionedSign } from "@/components/truck-sign";
import { SUGGESTED_LAYOUT } from "@/lib/samples";
import { VINYL } from "@/lib/vinyl-spec";
import { uiT } from "@/lib/shop-copy";
import { useShopLang } from "@/lib/shop-lang";

const SIZE_KEYS = [
  ["stickerWidth", "size20in"],
  ["stickerHeight", "size12in"],
  ["companyNameLetters", "size23in"],
  ["usdotLetters", "size23in"],
  ["mcLetters", "size2in"],
] as const;

const FMCSA_KEYS = [
  ["minLetterHeight", "minLetterHeightRule"],
  ["readability", "readabilityRule"],
  ["placementReq", "placementRule"],
  ["colorReq", "colorRule"],
  ["companyNameReq", "companyNameReqRule"],
  ["usdotReq", "usdotReqRule"],
  ["mcReq", "mcReqRule"],
  ["materialReq", "materialRule"],
] as const;

export function VinylSpecPanel() {
  const lang = useShopLang();
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/10">
        <div className="px-5 pb-5 pt-4 sm:px-6">
          <p className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800">
            {uiT(lang, "examplePlaque")}
          </p>
          <div className="mt-5">
            <DimensionedSign fields={SUGGESTED_LAYOUT.fields} />
          </div>
          <p className="mt-3 text-center text-xs text-neutral-500">
            {uiT(lang, "replaceWithCarrier")}
          </p>
          <table className="mt-5 w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="pb-2 font-medium">{uiT(lang, "itemCol")}</th>
                <th className="pb-2 text-right font-medium">
                  {uiT(lang, "exampleSizeCol")}
                </th>
              </tr>
            </thead>
            <tbody>
              {SIZE_KEYS.map(([item, size]) => (
                <tr key={item} className="border-b border-neutral-200">
                  <td className="py-2.5">{uiT(lang, item)}</td>
                  <td className="py-2.5 text-right text-neutral-800">
                    {uiT(lang, size)}
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
            {uiT(lang, "officialFederal")}
          </h3>
          <table className="mt-5 w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-neutral-400">
                <th className="pb-2 font-medium">{uiT(lang, "requirementCol")}</th>
                <th className="pb-2 font-medium">{uiT(lang, "fmcsaRuleCol")}</th>
              </tr>
            </thead>
            <tbody>
              {FMCSA_KEYS.map(([req, rule]) => (
                <tr key={req} className="border-b border-white/10">
                  <td className="py-2.5 pr-3">{uiT(lang, req)}</td>
                  <td className="py-2.5 text-neutral-200">{uiT(lang, rule)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs leading-5 text-neutral-400">
            {uiT(lang, "cfrNote")} {VINYL.cfr}
          </p>
        </div>
      </article>
    </div>
  );
}
