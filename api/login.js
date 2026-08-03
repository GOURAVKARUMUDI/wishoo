export default async function handler(req, res) {
  // Enable CORS headers for development/production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { password } = req.body || {};
    const expectedPassword = (process.env.ACCESS_PASSWORD || 'mahii').trim().toLowerCase();
    const providedPassword = (password || '').trim().toLowerCase();

    if (providedPassword && providedPassword === expectedPassword) {
      const sessionToken = Buffer.from(`wishoo-session-${Date.now()}`).toString('base64');
      return res.status(200).json({
        success: true,
        message: 'Access granted',
        token: sessionToken,
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Incorrect access code',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server error during authentication',
    });
  }
}
