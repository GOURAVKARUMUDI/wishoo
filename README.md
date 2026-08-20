# Wishoo

Private cinematic birthday experience for Mahii.

## Birthday sequence

Original Wishoo journey remains behind the original `mahii` passcode. On or after August 22, the original passcode entry detects that the birthday chapter is open and sends the user directly to the birthday countdown.

Birthday flow:

1. Birthday Countdown
2. Midnight Grand Celebration
3. Birthday Passcode — 22 / 08 / 2007
4. Cake + live life clock
5. About You — Mahii
6. Cinematic Photos
7. About Me — Tinku
8. What You Mean To Me
9. 3×3 Gift Game — 3 tries, third try guaranteed
10. Final Birthday Celebration
11. Final Birthday Celebration

## Development skip

When running Vite in development mode, the original entry screen shows `DEV MODE · Skip to Birthday Countdown`. It bypasses only the original entry journey for testing and opens the birthday countdown. The birthday passcode remains active afterward.

The DEV control is compiled out of production behavior through `import.meta.env.DEV`.

## Run

```bash
npm install
npm run dev
```

## V8 cake upgrade

The opening and final birthday cakes now use Three.js WebGL for a real 3D cake scene. The opening cake is a soft luxury pastel cake for Mahii's 19th birthday; the final cake is a larger dark/gold celebration cake. Both use 1 and 9 candles, animated flames, layered frosting, plate, trim, sprinkles, jewelry-like decorations, lighting, gentle camera motion, and responsive rendering.

After extracting, run `npm install` so the new `three` dependency is installed, then `npm run dev`.
