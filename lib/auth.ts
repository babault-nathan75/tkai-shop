// Auth utilities compatibles Edge Runtime (Web Crypto API)

const COOKIE_NAME = "tkai_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8h

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET manquant ou trop court (min 16 caractères) dans .env"
    );
  }
  return secret;
}

// ── Cached CryptoKey (imported once, reused for all sign/verify) ──

let cachedKey: CryptoKey | null = null;
let cachedSecret: string | null = null;

async function getKey(): Promise<CryptoKey> {
  const secret = getSecret();
  if (cachedKey && cachedSecret === secret) return cachedKey;
  cachedKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  cachedSecret = secret;
  return cachedKey;
}

function base64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmacSign(payload: string): Promise<string> {
  const key = await getKey();
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return base64urlEncode(new Uint8Array(sig));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export interface AdminSession {
  sub: string;
  iat: number;
  exp: number;
  nonce: string;
}

export async function createSessionToken(
  pseudo: string
): Promise<{ token: string; maxAge: number }> {
  const now = Math.floor(Date.now() / 1000);
  const nonceBytes = new Uint8Array(12);
  crypto.getRandomValues(nonceBytes);
  const session: AdminSession = {
    sub: pseudo,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
    nonce: base64urlEncode(nonceBytes),
  };
  const payload = base64urlEncode(
    new TextEncoder().encode(JSON.stringify(session))
  );
  const signature = await hmacSign(payload);
  return {
    token: `${payload}.${signature}`,
    maxAge: SESSION_TTL_SECONDS,
  };
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<AdminSession | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;

  let expected: string;
  try {
    expected = await hmacSign(payload);
  } catch {
    return null;
  }

  if (!constantTimeEqual(signature, expected)) return null;

  try {
    const json = new TextDecoder().decode(base64urlDecode(payload));
    const session = JSON.parse(json) as AdminSession;
    const now = Math.floor(Date.now() / 1000);
    if (session.exp < now) return null;
    return session;
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
