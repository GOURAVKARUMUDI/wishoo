import { put } from '@vercel/blob';
import { getBearer, verifySession } from './auth.js';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!verifySession(getBearer(req))) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  try {
    const { pathname, content, contentType, access = 'private' } = req.body || {};

    if (!pathname) {
      return res.status(400).json({ success: false, error: 'Missing pathname' });
    }

    if (content === undefined || content === null) {
      return res.status(400).json({ success: false, error: 'Missing content body' });
    }

    // Support base64 or raw string/buffer data
    let bodyData = content;
    if (typeof content === 'string' && content.startsWith('data:')) {
      const base64Data = content.split(',')[1];
      bodyData = Buffer.from(base64Data, 'base64');
    }

    const blob = await put(pathname, bodyData, {
      access,
      contentType: contentType || 'application/octet-stream',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({
      success: true,
      blob: {
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
        contentDisposition: blob.contentDisposition,
      },
    });
  } catch (err) {
    console.error('Blob upload error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to upload blob',
    });
  }
}
