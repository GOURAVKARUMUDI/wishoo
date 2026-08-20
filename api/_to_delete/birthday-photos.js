import { list } from '@vercel/blob';
import { getBearer, verifySession } from './auth.js';

const IMAGE_RE = /\.(?:avif|gif|jpe?g|png|webp)$/i;
const STRIP_RE = /(polaroid|strip|collage)/i;

function sortKey(item) {
  const match = item.pathname.match(/(?:^|[^0-9])0?([1-7])(?:[^0-9]|$)/i);
  return match ? Number(match[1]) : 99;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const session = verifySession(getBearer(req));
  if (!session) return res.status(401).json({ success: false, error: 'Authentication required' });

  try {
    const prefix = process.env.BIRTHDAY_BLOB_PREFIX || '';
    const result = await list({ prefix, token: process.env.BLOB_READ_WRITE_TOKEN, mode: 'expanded' });
    const blobs = (result.blobs || []).filter((blob) => IMAGE_RE.test(blob.pathname));
    const photos = blobs.filter((blob) => !STRIP_RE.test(blob.pathname)).sort((a, b) => sortKey(a) - sortKey(b));

    const items = photos.map((blob, index) => ({
      pathname: blob.pathname,
      url: `/api/blob-get?pathname=${encodeURIComponent(blob.pathname)}`,
      orientation: /(?:vertical|portrait|mobile|[-_]v\b)/i.test(blob.pathname) ? 'vertical' : /(?:horizontal|landscape|desktop|[-_]h\b)/i.test(blob.pathname) ? 'horizontal' : 'any',
      id: sortKey(blob) <= 7 ? sortKey(blob) : index + 1,
    }));

    const strip = blobs.find((blob) => STRIP_RE.test(blob.pathname));
    return res.status(200).json({ success: true, photos: items, strip: strip ? `/api/blob-get?pathname=${encodeURIComponent(strip.pathname)}` : null });
  } catch (err) {
    console.error('Birthday photo listing error:', err);
    return res.status(500).json({ success: false, error: 'Unable to load birthday photos' });
  }
}
