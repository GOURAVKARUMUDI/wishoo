import crypto from 'node:crypto';

/**
 * MAHII WORLD — SHARED SERVER-SIDE AUTH MODULE
 * ---------------------------------------------------------------
 * Prefixed with `_` so Vercel never turns this file into a public
 * route by itself — it is imported by api/login.js and api/photo.js.
 *
 * Layer 1 (session): HMAC-SHA256 signed tokens with a 24h TTL,
 * verified with a timing-safe comparison, delivered primarily via
 * an HttpOnly cookie (immune to XSS token theft) with a Bearer
 * header kept as a fallback for the sessionStorage-based client.
 *
 * Layer 2 (birthday lock): a real IST-clock check, see
 * isBirthdayUnlockedInIST() below.
 */

// Always set MAHII_WORLD_SESSION_SECRET in production. The fallbacks below
// exist only so local development keeps working out of the box.
const SECRET = process.env.MAHII_WORLD_SESSION_SECRET || process.env.ACCESS_PASSWORD || 'mahii-world-dev-secret';

export const SESSION_COOKIE_NAME = 'mahii_world_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function createSessionToken(role = 'mahii') {
  const payload = JSON.stringify({ role, exp: Date.now() + SESSION_TTL_MS });
  const encoded = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = crypto.createHmac('sha256', SECRET).update(encoded).digest('base64url');
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (signatureBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(signatureBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload?.role || !payload?.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(header = '') {
  const out = {};
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  });
  return out;
}

/** ✓ Cookie (primary) → ✓ Bearer header (fallback). ✗ Never a query string. */
export function getSessionTokenFromRequest(req) {
  const cookies = parseCookies(req.headers?.cookie || '');
  if (cookies[SESSION_COOKIE_NAME]) return cookies[SESSION_COOKIE_NAME];
  const header = req.headers?.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return '';
}

export function verifySessionFromRequest(req) {
  return verifySessionToken(getSessionTokenFromRequest(req));
}

export function getBearer(req) {
  const header = req.headers?.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : '';
}

/** Builds the Set-Cookie header value for the session (or its clearing form). */
export function buildSessionCookie(token, req, { clear = false } = {}) {
  const host = req?.headers?.host || '';
  const isLocalhost = /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host);
  const attrs = ['Path=/', 'HttpOnly', 'SameSite=Strict'];
  // Secure cookies are still honoured on http://localhost by modern browsers,
  // but we skip the flag there in case an older browser/tooling is in play.
  if (!isLocalhost) attrs.push('Secure');

  if (clear) {
    attrs.push('Max-Age=0');
    return `${SESSION_COOKIE_NAME}=; ${attrs.join('; ')}`;
  }
  attrs.push(`Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`);
  return `${SESSION_COOKIE_NAME}=${token}; ${attrs.join('; ')}`;
}

/**
 * Real IST-clock birthday lock. Unlocks at midnight IST (00:00 Asia/Kolkata)
 * on the configured birthday date. This always runs server-side against
 * Date.now(), so it cannot be spoofed by the visitor's device clock or
 * timezone the way a client-only countdown could be.
 */
export function isBirthdayUnlockedInIST() {
  const day = parseInt(process.env.VITE_BIRTHDAY_DAY || process.env.BIRTHDAY_DAY || '22', 10);
  const month = parseInt(process.env.VITE_BIRTHDAY_MONTH || process.env.BIRTHDAY_MONTH || '08', 10);
  const year = parseInt(
    process.env.VITE_BIRTHDAY_TARGET_YEAR || process.env.BIRTHDAY_TARGET_YEAR || String(new Date().getFullYear()),
    10
  );

  // IST is UTC+5:30 with no daylight saving, so midnight IST on the target
  // date is 18:30 UTC on the previous calendar day.
  const targetUTC = new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - 5.5 * 60 * 60 * 1000);
  return Date.now() >= targetUTC.getTime();
}
