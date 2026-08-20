# Localhost Photo Testing Checklist

## Current Status

✅ **Environment Variables** — DONE
- ALLOW_DEV_PREVIEW=true (bypass birthday lock)
- MAHII_WORLD_PRIVATE_PHOTOS_DIR=local-private-assets/birthday (local photo fallback)
- MAHII_WORLD_SESSION_SECRET=set for token signing
- BLOB_READ_WRITE_TOKEN=set (for Blob uploads)
- BLOB_STORE_ID=set

✅ **Local Photos** — All 8 present
- mahii1.jpg through mahii8.jpg in local-private-assets/birthday/

## Testing Steps

### 1. Start Dev Server
```bash
cd "/Users/gouravkarumudi/Desktop/mahii/v7work 2"
npm run dev
```
This starts Vite on http://localhost:5173

### 2. Log In
1. Go to http://localhost:5173
2. Click "Continue" or login with: **mahii**
3. You should be taken to the photos page

### 3. Check Browser Console
1. Open DevTools (Cmd+Option+I)
2. Go to Console tab
3. Look for any errors about:
   - `/api/photo` requests
   - Session token issues
   - Fetch errors

### 4. Test API Directly (in DevTools Console)
```javascript
// Test with session cookie
fetch('/api/photo?id=photo-01')
  .then(r => ({ status: r.status, type: r.headers.get('content-type') }))
  .then(console.log)

// Should return: { status: 200, type: 'image/jpeg' }
```

### 5. Upload Photos to Vercel Blob (if not done yet)
```bash
cd "/Users/gouravkarumudi/Desktop/mahii/v7work 2"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_rwYd6x4SMIqldVjl_g3VsVOXrkzWaf0SBzLB77r4EjiCK0L" npm run upload-photos
```

## If Photos Still Don't Show

**Layer 1 (Session):** Do you see login working?
- No → Session auth broken

**Layer 2 (Birthday Lock):** ALLOW_DEV_PREVIEW=true should bypass it
- Lockout message? → Check if ALLOW_DEV_PREVIEW is actually set

**Layer 3 (Local Fallback):** Photos should load from local-private-assets/birthday/
- Still blank? → Check browser Network tab for `/api/photo` response status

## Quick Network Debugging
In DevTools → Network tab:
1. Refresh page
2. Look for `/api/photo?id=photo-01` request
3. Check:
   - Status code (200 = success, 401 = auth failed, 404 = photo not found)
   - Response headers (should have image/jpeg content-type)
   - Response preview (should show image thumbnail)
