import { get } from '@vercel/blob';
import { getBearer, verifySession } from './auth.js';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!verifySession(getBearer(req))) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  const { pathname } = req.query || {};
  if (!pathname) {
    return res.status(400).json({ success: false, error: 'Missing pathname query parameter' });
  }

  try {
    const result = await get(pathname, {
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!result) {
      return res.status(404).json({ success: false, error: 'Blob not found' });
    }

    res.setHeader('Cache-Control', 'private, no-cache');
    res.setHeader('Content-Type', result.blob.contentType || 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const arrayBuffer = await result.blob.arrayBuffer();
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Blob fetch error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch blob',
    });
  }
}
