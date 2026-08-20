#!/usr/bin/env node
/**
 * One-time upload of Mahii's private birthday photos to Vercel Blob.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx npm run upload-photos
 *
 * Reads local-private-assets/birthday/*.jpg (git-ignored — never commit
 * these images or the Blob token) and uploads each one to the exact
 * private Blob path referenced by PHOTO_ALLOWLIST in api/photo.js.
 * Re-running is safe: allowOverwrite replaces the existing file in place.
 */
import { put } from '@vercel/blob';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.resolve(__dirname, '..', 'local-private-assets', 'birthday');

// Keep in sync with PHOTO_ALLOWLIST in api/photo.js and vite.config.js.
const UPLOAD_MAP = {
  'mahii1.jpg': 'mahii-world/memories/mahii-01.jpg',
  'mahii2.jpg': 'mahii-world/memories/mahii-02.jpg',
  'mahii3.jpg': 'mahii-world/memories/mahii-03.jpg',
  'mahii4.jpg': 'mahii-world/memories/mahii-04.jpg',
  'mahii5.jpg': 'mahii-world/memories/mahii-05.jpg',
  'mahii6.jpg': 'mahii-world/memories/mahii-06.jpg',
  'mahii7.jpg': 'mahii-world/memories/mahii-07.jpg',
  'mahii8.jpg': 'mahii-world/memories/mahii-08.jpg',
};

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error('✗ BLOB_READ_WRITE_TOKEN is not set. Get it from Vercel → Project → Storage → Blob → .env.local tab.');
    process.exit(1);
  }

  const entries = Object.entries(UPLOAD_MAP);
  console.log(`Uploading ${entries.length} photos to Vercel Blob (private access)...`);

  let uploaded = 0;
  for (const [localName, blobPathname] of entries) {
    const localPath = path.join(SOURCE_DIR, localName);
    if (!fs.existsSync(localPath)) {
      console.warn(`  ⚠ Skipped ${localName} — not found in ${SOURCE_DIR}`);
      continue;
    }
    const buffer = fs.readFileSync(localPath);
    await put(blobPathname, buffer, {
      access: 'private',
      token,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'image/jpeg',
    });
    const kb = Math.round(buffer.length / 1024);
    console.log(`  ✓ ${localName} → ${blobPathname} (${kb} KB, image/jpeg)`);
    uploaded += 1;
  }

  console.log(`Done. ${uploaded}/${entries.length} photos are now in private Blob storage.`);
  if (uploaded < entries.length) {
    console.log(`Add any missing local-private-assets/birthday files and re-run to finish the set.`);
  }
}

main().catch((err) => {
  console.error('Upload failed:', err);
  process.exit(1);
});
