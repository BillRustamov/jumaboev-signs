import { TruckSign } from "@/components/truck-sign";
import type { SignFields } from "@/lib/order";
import { cn } from "@/lib/utils";

function Wheel({ cx, cy, r = 34 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 4} fill="#1a1a1a" />
      <circle cx={cx} cy={cy} r={r} fill="#2a2a2a" />
      <circle cx={cx} cy={cy} r={r * 0.42} fill="#d8d8d8" stroke="#b0b0b0" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r * 0.14} fill="#8d8d8d" />
    </g>
  );
}

export function WhiteSemiTruck({
  fields,
  className,
}: {
  fields: SignFields;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full overflow-hidden rounded-xl bg-[#d7e4ef]", className)}>
      <svg
        viewBox="0 0 1100 420"
        className="block h-auto w-full"
        role="img"
        aria-label="White semi truck with door vinyl"
      >
        <defs>
          <linearGradient id="white-cab" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f3f3f1" />
            <stop offset="100%" stopColor="#e4e4e0" />
          </linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9ec4dd" />
            <stop offset="100%" stopColor="#6a93ad" />
          </linearGradient>
        </defs>
        <rect width="1100" height="420" fill="#d7e4ef" />
        <ellipse cx="540" cy="372" rx="460" ry="18" fill="#b7c5d0" />
        <path d="M70 338 H1040" stroke="#c5d0d8" strokeWidth="6" />

        {/* Frame */}
        <rect x="210" y="268" width="720" height="22" rx="3" fill="#3a3a3a" />
        <rect x="430" y="248" width="210" height="28" rx="8" fill="#d8d8d6" stroke="#c4c4c2" />

        {/* Sleeper */}
        <path
          d="M198 118 H418 V286 H198 Z"
          fill="url(#white-cab)"
          stroke="#cfcfcb"
          strokeWidth="2"
        />
        <rect x="218" y="138" width="72" height="52" rx="4" fill="url(#glass)" />
        <rect x="308" y="138" width="86" height="52" rx="4" fill="url(#glass)" />
        <rect x="218" y="208" width="176" height="10" fill="#ececea" />

        {/* Cab */}
        <path
          d="M418 96 H612 L628 128 V286 H418 Z"
          fill="url(#white-cab)"
          stroke="#cfcfcb"
          strokeWidth="2"
        />
        <path d="M430 108 H600 L612 132 H430 Z" fill="url(#glass)" />
        <rect x="430" y="148" width="168" height="118" rx="6" fill="#f7f7f5" stroke="#d4d4d0" />

        {/* Hood */}
        <path
          d="M612 148 H868 L902 188 V268 H628 V128 Z"
          fill="url(#white-cab)"
          stroke="#cfcfcb"
          strokeWidth="2"
        />
        <path d="M640 168 H850 V188 H640 Z" fill="#ececea" />
        <path d="M868 148 L942 214 V268 H902 V188 Z" fill="#f0f0ee" stroke="#cfcfcb" strokeWidth="2" />

        {/* Bumper */}
        <rect x="930" y="214" width="86" height="58" rx="6" fill="#d0d0ce" stroke="#b8b8b6" />
        <rect x="948" y="228" width="18" height="12" rx="2" fill="#f4c542" />
        <rect x="978" y="228" width="18" height="12" rx="2" fill="#f4c542" />

        {/* Exhaust / mirrors */}
        <rect x="404" y="72" width="14" height="210" rx="6" fill="#c8c8c6" />
        <rect x="618" y="118" width="8" height="46" fill="#bdbdbb" />
        <rect x="602" y="122" width="22" height="14" rx="2" fill="url(#glass)" />

        <Wheel cx={300} cy={318} />
        <Wheel cx={392} cy={318} />
        <Wheel cx={780} cy={318} r={36} />
      </svg>
      <div
        className="absolute"
        style={{
          left: "39.2%",
          top: "35.4%",
          width: "15.1%",
        }}
      >
        <TruckSign fields={fields} className="shadow-md ring-1 ring-black/10" />
      </div>
    </div>
  );
}
