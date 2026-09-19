import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function hashAccessToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createAccessToken(): { token: string; hash: string } {
  const token = randomBytes(24).toString("base64url");
  return { token, hash: hashAccessToken(token) };
}

export function accessTokenMatches(token: string, hash: string | undefined): boolean {
  if (!token || !hash) return false;
  const left = Buffer.from(hashAccessToken(token), "hex");
  const right = Buffer.from(hash, "hex");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
