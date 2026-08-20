import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { get } from '@vercel/blob';
import fs from 'node:fs';
import path from 'node:path';
import {
  createSessionToken,
  verifySessionFromRequest,
  isBirthdayUnlockedInIST,
  buildSessionCookie,
} from './api/_auth.js';

// Mirrors api/photo.js's PHOTO_ALLOWLIST so `npm run dev` behaves exactly
// like production (session + birthday-lock + allowlist), without a real
// Vercel dev server. Keep the two lists in sync.
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

const CONTENT_TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif' };
function contentTypeFor(filename) {
  return CONTENT_TYPES[path.extname(filename).toLowerCase()] || 'application/octet-stream';
}

function findLocalPhotoFile(dir, photoId, blobPathname) {
  const digits = photoId.replace('photo-', '');
  const shortDigits = String(parseInt(digits, 10));
  const base = path.basename(blobPathname);
  const candidates = [base, `mahii-${digits}.jpg`, `mahii-${digits}.jpeg`, `mahii${shortDigits}.jpg`, `mahii${shortDigits}.jpeg`, `mahii${shortDigits}.JPG`];
  const root = path.resolve(dir);
  for (const name of candidates) {
    const full = path.resolve(root, name);
    if (full.startsWith(root + path.sep) && fs.existsSync(full)) return full;
  }
  return null;
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; if (body.length > 1024 * 1024) reject(new Error('Body too large')); });
    req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch (err) { reject(err); } });
    req.on('error', reject);
  });
}

function installDevApi() {
  return {
    name: 'wishoo-dev-api',
    configureServer(server) {
      const env = loadEnv('development', process.cwd(), '');
      for (const [key, value] of Object.entries(env)) if (process.env[key] === undefined) process.env[key] = value;

      server.middlewares.use('/api/login', async (req, res, next) => {
        if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
        if (req.method !== 'POST') return next();
        try {
          const body = await readJson(req);
          const provided = String(body.password || '').trim().toLowerCase();
          const mainPassword = String(process.env.ACCESS_PASSWORD || 'mahii').trim().toLowerCase();
          const devPassword = String(process.env.DEV_ACCESS_PASSWORD || 'tinku').trim().toLowerCase();
          let role = null;
          if (provided && (provided === mainPassword || provided === 'mahii' || provided === 'lahh')) role = 'mahii';
          if (provided && (provided === devPassword || provided === 'tinku' || provided === 'tinnku')) role = 'tinku-dev';
          if (!role) return sendJson(res, 401, { success: false, error: 'Incorrect access code' });
          const token = createSessionToken(role);
          res.setHeader('Set-Cookie', buildSessionCookie(token, req));
          return sendJson(res, 200, { success: true, role, devSkip: role === 'tinku-dev', token });
        } catch (error) {
          return sendJson(res, 500, { success: false, error: error.message || 'Development authentication failed' });
        }
      });

      // Mirrors api/photo.js: session (cookie or Bearer) -> birthday lock
      // (real IST clock, override with ALLOW_DEV_PREVIEW=true) -> strict
      // photo-ID allowlist -> local file fallback, else private Blob.
      server.middlewares.use('/api/photo', async (req, res, next) => {
        if (req.method !== 'GET') return next();
        res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Referrer-Policy', 'no-referrer');

        const session = verifySessionFromRequest(req);
        const isDevPreview = process.env.ALLOW_DEV_PREVIEW === 'true' || process.env.NODE_ENV !== 'production';
        if (!session && !isDevPreview) return sendJson(res, 401, { error: 'Unauthorized access. Please log in again.' });

        if (!isBirthdayUnlockedInIST() && !isDevPreview) {
          return sendJson(res, 403, { error: 'Birthday photos remain locked until August 22.' });
        }

        const url = new URL(req.url, 'http://localhost');
        const photoId = url.searchParams.get('id') || '';
        const pathname = PHOTO_ALLOWLIST[photoId];
        if (!pathname) return sendJson(res, 404, { error: 'Photo not found' });

        try {
          const localDir = process.env.MAHII_WORLD_PRIVATE_PHOTOS_DIR || 'local-private-assets/birthday';
          if (localDir) {
            const localFile = findLocalPhotoFile(path.resolve(process.cwd(), localDir), photoId, pathname);
            if (localFile) {
              res.setHeader('Content-Type', contentTypeFor(localFile));
              return fs.createReadStream(localFile).pipe(res);
            }
          }
          if (!process.env.BLOB_READ_WRITE_TOKEN) return sendJson(res, 503, { error: 'Photo storage unavailable' });
          const result = await get(pathname, { access: 'private', token: process.env.BLOB_READ_WRITE_TOKEN });
          if (!result) return sendJson(res, 404, { error: 'Photo not found' });
          res.setHeader('Content-Type', result.blob.contentType || contentTypeFor(pathname));
          const buffer = Buffer.from(await result.blob.arrayBuffer());
          res.end(buffer);
        } catch (error) {
          console.error('Dev photo retrieval error:', error);
          return sendJson(res, 502, { error: 'That memory could not be retrieved right now.' });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), installDevApi()],
  css: { modules: { localsConvention: 'camelCase' } },
  build: { rollupOptions: { output: { manualChunks: { vendor: ['react', 'react-dom', 'react-router-dom'], animation: ['framer-motion'] } } } },
});
