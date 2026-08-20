import { get } from '@vercel/blob';
import fs from 'node:fs';
import path from 'node:path';
import { verifySessionFromRequest, isBirthdayUnlockedInIST } from './_auth.js';

/**
 * MAHII WORLD — SECURE PHOTO ENDPOINT
 * ---------------------------------------------------------------
 * GET /api/photo?id=photo-01
 *
 * Layer 1: session (HttpOnly cookie, Bearer header fallback)
 * Layer 2: birthday lock (real IST clock — see api/_auth.js)
 * Layer 3: strict photo-ID allowlist — only these exact IDs can ever
 *          be fetched. A client trying /api/photo?id=../../secrets
 *          simply gets a 404: arbitrary pathnames never reach Blob
 *          storage or the filesystem.
 */

const PHOTO_ALLOWLIST = {
  'photo-01': 'mahii-world/memories/mahii-01.jpg',
  'photo-02': 'mahii-world/memories/mahii-02.jpg',
  'photo-03': 'mahii-world/memories/mahii-03.jpg',
  'photo-04': 'mahii-world/memories/mahii-04.jpg',
  'photo-05': 'mahii-world/memories/mahii-05.jpg',
  'photo-06': 'mahii-world/memories/mahii-06.jpg',
  'photo-07': 'mahii-world/memories/mahii-07.jpg',
  'photo-08': 'mahii-world/memories/mahii-08.jpg',
};

const CONTENT_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
};

function contentTypeFor(filename) {
  return CONTENT_TYPES[path.extname(filename).toLowerCase()] || 'application/octet-stream';
}

/**
 * Local filesystem fallback for `npm run dev` / manual testing so the
 * existing local-private-assets/birthday/mahiiN.jpg files work without
 * renaming. Every candidate name is a fixed string derived from the
 * already-validated allowlist ID, and the resolved path is confirmed to
 * stay inside `dir` before it is used — no user input ever reaches the
 * filesystem path directly.
 */
function findLocalFile(dir, photoId, blobPathname) {
  const digits = photoId.replace('photo-', ''); // e.g. '01'
  const shortDigits = String(parseInt(digits, 10)); // e.g. '1'
  const base = path.basename(blobPathname);
  const candidates = [
    base,
    `mahii-${digits}.jpg`,
    `mahii-${digits}.jpeg`,
    `mahii${shortDigits}.jpg`,
    `mahii${shortDigits}.jpeg`,
    `mahii${shortDigits}.JPG`,
  ];

  const root = path.resolve(dir);
  for (const name of candidates) {
    const full = path.resolve(root, name);
    if (full.startsWith(root + path.sep) && fs.existsSync(full)) return full;
  }
  return null;
}

function setSecurityHeaders(res) {
  res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
}

export default async function handler(req, res) {
  setSecurityHeaders(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Layer 1: session
  const session = verifySessionFromRequest(req);
  const isDevPreview = process.env.ALLOW_DEV_PREVIEW === 'true';
  if (!session && !isDevPreview) {
    return res.status(401).json({ error: 'Unauthorized access. Please log in again.' });
  }

  // Layer 2: birthday lock — real IST clock, cannot be spoofed client-side.
  const isUnlocked = isBirthdayUnlockedInIST();
  if (!isUnlocked && !isDevPreview) {
    return res.status(403).json({ error: 'Birthday photos remain locked until August 22.' });
  }

  // Layer 3: allowlist
  const photoId = String(req.query?.id || '');
  const pathname = PHOTO_ALLOWLIST[photoId];
  if (!pathname) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  try {
    const localDir = process.env.MAHII_WORLD_PRIVATE_PHOTOS_DIR || 'local-private-assets/birthday';
    if (localDir) {
      const localFile = findLocalFile(path.resolve(process.cwd(), localDir), photoId, pathname);
      if (localFile) {
        res.setHeader('Content-Type', contentTypeFor(localFile));
        return fs.createReadStream(localFile).pipe(res);
      }
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(503).json({ error: 'Photo storage unavailable' });
    }

    const result = await get(pathname, {
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    if (!result) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    res.setHeader('Content-Type', result.blob.contentType || contentTypeFor(pathname));
    if (result.blob.size) {
      res.setHeader('Content-Length', result.blob.size);
    }
    const { Readable } = require('node:stream');
    return Readable.fromWeb(result.stream).pipe(res);
  } catch (err) {
    console.error('Photo retrieval error:', err);
    return res.status(502).json({ error: 'That memory could not be retrieved right now.' });
  }
}
