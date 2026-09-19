import { mkdirSync, writeFileSync } from "node:fs";

const envDir = new URL("../.open-next/cloudflare/", import.meta.url);
mkdirSync(envDir, { recursive: true });
writeFileSync(
  new URL("next-env.mjs", envDir),
  [
    `export const production = ${JSON.stringify({ APP_URL: "https://www.usprint.app" })};`,
    "export const development = {};",
    "export const test = {};",
    "",
  ].join("\n"),
);
console.log("Sanitized OpenNext env: APP_URL=https://www.usprint.app, no secrets.");
