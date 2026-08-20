/** Client helpers for the private, session-protected photo API (see api/photo.js). */

export function getSessionToken() {
  return sessionStorage.getItem('wishoo-session-token') || '';
}

function authHeaders() {
  const token = getSessionToken();
  // The HttpOnly session cookie set at login is the primary auth transport
  // and is attached automatically by the browser; this header is only a
  // fallback for contexts where the cookie doesn't reach the request.
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getPhotoUrl(photoId) {
  return `/api/photo?id=${encodeURIComponent(photoId)}`;
}

/**
 * Fetches a private photo by its fixed allowlist ID (e.g. 'photo-01') and
 * returns a local object URL. Caller is responsible for revoking it
 * (URL.revokeObjectURL) once it's no longer needed.
 */
export async function loadPhotoObjectUrl(photoId) {
  const response = await fetch(getPhotoUrl(photoId), {
    headers: authHeaders(),
    credentials: 'same-origin',
    cache: 'no-store',
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Photo unavailable (${response.status})`);
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
