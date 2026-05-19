/**
 * Stateless admin session via HMAC-signed cookie.
 *
 * Cookie format: "<timestamp>.<hmac-sha256-hex>"
 * The HMAC ties a timestamp to the AUTH_SECRET env var. We refuse cookies
 * older than 24h or with an invalid signature.
 *
 * Server-only — never imported from client components.
 */

import crypto from "node:crypto";

const COOKIE_NAME = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "AUTH_SECRET env var missing or too short (need >= 16 chars)."
    );
  }
  return s;
}

export function signSession(): string {
  const ts = Date.now().toString();
  const hmac = crypto
    .createHmac("sha256", getSecret())
    .update(ts)
    .digest("hex");
  return `${ts}.${hmac}`;
}

export function verifySession(value: string | undefined | null): boolean {
  if (!value) return false;
  const dot = value.indexOf(".");
  if (dot <= 0) return false;
  const ts = value.slice(0, dot);
  const hmac = value.slice(dot + 1);
  if (!/^\d+$/.test(ts) || !/^[a-f0-9]+$/i.test(hmac)) return false;

  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(ts)
    .digest("hex");

  const a = Buffer.from(hmac, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  const ageMs = Date.now() - parseInt(ts, 10);
  return ageMs >= 0 && ageMs < MAX_AGE_SECONDS * 1000;
}

/** Read the session cookie value from a Request. */
export function getSessionFromRequest(request: Request): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === COOKIE_NAME) return rest.join("=");
  }
  return null;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
