const PBKDF2_ITERS = 100_000;
const KEY_BYTES = 32;
const SALT_BYTES = 16;
const TOKEN_BYTES = 32;

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim().toLowerCase();
  if (clean.length % 2 !== 0 || !/^[0-9a-f]*$/.test(clean)) {
    return new Uint8Array();
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function timingSafeEqualHex(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return diff === 0;
}

function randomBytes(size: number): Uint8Array {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return bytes;
}

export function createId(prefix: string): string {
  return `${prefix}_${bytesToHex(randomBytes(12))}`;
}

export function createSessionToken(): string {
  return bytesToHex(randomBytes(TOKEN_BYTES));
}

export async function sha256Hex(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return bytesToHex(new Uint8Array(digest));
}

async function pbkdf2(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const saltBuffer = new ArrayBuffer(salt.byteLength);
  new Uint8Array(saltBuffer).set(salt);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: saltBuffer,
      iterations,
    },
    key,
    KEY_BYTES * 8,
  );
  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const key = await pbkdf2(password, salt, PBKDF2_ITERS);
  return `pbkdf2$sha256$${PBKDF2_ITERS}$${bytesToHex(salt)}$${bytesToHex(key)}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 5 || parts[0] !== "pbkdf2" || parts[1] !== "sha256") {
    return false;
  }
  const iterations = Number(parts[2]);
  const salt = hexToBytes(parts[3] ?? "");
  const expected = parts[4] ?? "";
  if (!iterations || salt.length === 0 || expected.length !== KEY_BYTES * 2) {
    return false;
  }
  const key = await pbkdf2(password, salt, iterations);
  return timingSafeEqualHex(bytesToHex(key), expected);
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function validateEmail(email: string): string | null {
  if (email.length < 5 || email.length > 254) return "Enter a valid email.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8 || password.length > 128) {
    return "Password must be at least 8 characters.";
  }
  return null;
}

export function usernameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "user";
  let handle = local.replace(/[^A-Za-z0-9_]/g, "_");
  handle = handle.replace(/_+/g, "_").replace(/^_+|_+$/g, "");
  if (!/^[A-Za-z]/.test(handle)) handle = `u${handle}`;
  if (handle.length < 3) handle = `${handle}usr`.slice(0, 24);
  if (handle.length < 3) handle = "shop";
  return handle.slice(0, 24);
}
