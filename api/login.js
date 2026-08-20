import { createSessionToken, buildSessionCookie } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const provided = String(req.body?.password || '').trim();
    const normalised = provided.toLowerCase();
    const mainPassword = String(process.env.ACCESS_PASSWORD || 'mahii').trim().toLowerCase();
    const devPassword = String(process.env.DEV_ACCESS_PASSWORD || 'tinku').trim().toLowerCase();

    let role = null;
    if (normalised && (normalised === mainPassword || normalised === 'mahii' || normalised === 'lahh')) role = 'mahii';
    if (normalised && (normalised === devPassword || normalised === 'tinku' || normalised === 'tinnku')) role = 'tinku-dev';

    if (!role) return res.status(401).json({ success: false, error: 'Incorrect access code' });

    const token = createSessionToken(role);
    // Primary transport: HttpOnly cookie — not readable by JS, so it can't
    // be exfiltrated by an XSS payload the way a sessionStorage token can.
    res.setHeader('Set-Cookie', buildSessionCookie(token, req));

    return res.status(200).json({
      success: true,
      role,
      devSkip: role === 'tinku-dev',
      // Kept only as a Bearer-header fallback (see api/_auth.js); the cookie
      // above is what actually authenticates /api/photo requests.
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Server error during authentication' });
  }
}
