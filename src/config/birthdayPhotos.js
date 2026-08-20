/**
 * WISHOO — BIRTHDAY PHOTO CONFIGURATION
 * ---------------------------------------------------------------
 * Photos are served exclusively through the secure /api/photo
 * endpoint (session + birthday-lock + a strict ID allowlist — see
 * api/photo.js and api/_auth.js). There is no public Blob URL to
 * paste here anymore: every photo is requested only by its fixed
 * ID, and the server decides which private Blob path — or local
 * dev file — that ID maps to.
 *
 * The seven IDs below drive the seven-scene cinematic film in
 * BirthdayPhotos.jsx, in order.
 */

export const PHOTO_IDS = ['photo-01', 'photo-02', 'photo-03', 'photo-04', 'photo-05', 'photo-06', 'photo-07'];
