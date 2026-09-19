"use client";

import type { CSSProperties, ReactNode } from "react";
import { BOT_PREVIEW_PHOTO } from "@/lib/bot-preview";

/**
 * Fits the cab mockup inside the screenshot frame the way object-fit: contain
 * fits an image: whole photo visible, vinyl never clipped at the viewport edge.
 */
export function BotPreviewFrame({ children }: { children: ReactNode }) {
  const { widthPx, heightPx } = BOT_PREVIEW_PHOTO;
  const stageStyle: CSSProperties = {
    aspectRatio: `${widthPx} / ${heightPx}`,
    width: `min(100%, calc(100dvh * ${widthPx} / ${heightPx}))`,
    height: "auto",
    maxWidth: "100%",
    maxHeight: "100%",
  };

  return (
    <main
      data-bot-preview-frame=""
      className="fixed inset-0 overflow-hidden bg-[#cfd5dc]"
    >
      <div className="flex h-full w-full items-center justify-center">
        <div data-bot-preview-stage="" className="relative min-h-0 min-w-0" style={stageStyle}>
          {children}
        </div>
      </div>
    </main>
  );
}
