# Photo Integration — Security Model (as built)

This documents the actual implementation in this repo. It follows the
architecture you pasted, adapted to the project's real structure and asset
count (8 photos: `photo-01`…`photo-08`, of which the seven-scene cinematic
film in `BirthdayPhotos.jsx` currently uses `photo-01`…`photo-07`).

## Request flow

```
BirthdayPhotos.jsx
  -> loadPhotoObjectUrl(id)            (src/utils/blobClient.js)
  -> GET /api/photo?id=photo-01        (cookie sent automatically)
       |
       v
api/photo.js
  1. Session check      -> verifySessionFromRequest()      (api/_auth.js)
  2. Birthday lock       -> isBirthdayUnlockedInIST()        (api/_auth.js)
  3. Allowlist lookup    -> PHOTO_ALLOWLIST[id] -> Blob pathname
  4. Serve from local MAHII_WORLD_PRIVATE_PHOTOS_DIR (dev), else
     private Vercel Blob via @vercel/blob's get()
```

## Three layers

**Layer 1 — Session.** `api/login.js` issues an HMAC-SHA256 signed token
(`api/_auth.js`, 24h TTL, timing-safe verification) and sets it as the
`mahii_world_session` HttpOnly/SameSite=Strict/Secure cookie — not
readable by JS, so an XSS payload can't steal it. A `Bearer` header
(the same token, also returned in the login JSON body and kept in
`sessionStorage`) is accepted as a fallback if the cookie doesn't reach
a request. Nothing is ever accepted from a query string.

**Layer 2 — Birthday lock.** Every `/api/photo` request re-checks a real
server-side IST clock (`isBirthdayUnlockedInIST()` in `api/_auth.js`)
against the birthday date, independent of the visitor's device clock or
the client-side passcode/countdown UI. Until that moment, photos 403
even with a fully valid session — unless `ALLOW_DEV_PREVIEW=true` (dev
and preview environments only).

**Layer 3 — Strict allowlist.** `PHOTO_ALLOWLIST` in `api/photo.js` maps
exactly `photo-01`…`photo-08` to fixed private Blob paths
(`mahii-world/memories/mahii-0N.jpg`). Any other `id` — including a path
traversal attempt like `../../secrets` — is a 404 before any filesystem
or Blob call is made.

## What changed from the previous implementation

The project previously had `/api/blob-get` (fetched **any** Blob pathname
a caller supplied, gated only by a valid session — no allowlist),
`/api/birthday-photos` (enumerated the Blob store contents), and
`/api/blob-upload` (let any valid session write arbitrary files to Blob
storage). All three were unauthenticated-enough to be real risks and have
been moved to `api/_to_delete/` (excluded from Vercel routing by the
leading underscore) rather than deleted outright — safe to delete once
you've confirmed the new endpoints work for you. `api/auth.js` was
replaced by `api/_auth.js` (renamed, same idea, now also builds/reads the
session cookie and the birthday-lock check) and moved there too.

Uploading photos is now an offline script (`npm run upload-photos`,
`scripts/upload-photos-to-blob.js`) rather than a public API endpoint —
it needs `BLOB_READ_WRITE_TOKEN` in your own shell, and is never exposed
to the deployed app.

## Environment variables (see `.env.example`)

| Variable | Purpose |
|---|---|
| `ACCESS_PASSWORD` / `DEV_ACCESS_PASSWORD` | Login passwords (unchanged) |
| `MAHII_WORLD_SESSION_SECRET` | HMAC signing key for session tokens — set a real random value in production |
| `ALLOW_DEV_PREVIEW` | `true` to bypass the birthday lock in dev/preview only |
| `MAHII_WORLD_PRIVATE_PHOTOS_DIR` | Local folder `/api/photo` reads from before falling back to Blob — set to `local-private-assets/birthday` for local dev |
| `BLOB_READ_WRITE_TOKEN` | Needed in production (Blob) and by `npm run upload-photos` |

## Testing this yourself

```bash
npm run dev
# log in with the real password, then in devtools:
fetch('/api/photo?id=photo-01').then(r => r.status)   # 200 once unlocked
fetch('/api/photo?id=photo-99').then(r => r.status)   # 404 — not in allowlist
```

Before the real Aug 22 unlock, leave `ALLOW_DEV_PREVIEW=true` in your
local `.env.local` / Vercel Preview env so you can still see the photos
while testing; leave it unset in Production.
