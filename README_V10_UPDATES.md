# Wishoo — V10 Update Notes

This build keeps the existing `v7work 2` project name and birthday route structure.

## Photo chapter
- Mobile-first cinematic seven-photo experience.
- Seven individual photo scenes with distinct transitions.
- Vertical/mobile images are preferred automatically.
- Supports horizontal fallbacks.
- Final 7-photo animated collage.
- Horizontal swipeable Polaroid strip.
- Optional supplied strip asset: any filename containing `polaroid`, `strip`, or `collage`.
- Continue transitions to About Me — Tinku.

Recommended photo names:
`01-vertical.webp`, `01-horizontal.webp` through `07-vertical.webp`, `07-horizontal.webp`.

## Cake
- Three.js cake remains for opening and grand finale.
- Camera/framing retuned for mobile portrait view.
- Cake has 1 + 9 candles for Mahii's 19th birthday in 2026.
- Better vertical space and canvas sizing.
- Premium fallback remains available if WebGL fails.

## Life clock
Detailed age now shows:
- Years
- Months
- Days
- Minutes

Separate live totals show:
- Total hours
- Total minutes
- Total seconds

## Existing behavior retained
- Original `mahii` passcode belongs only to the old Wishoo gate.
- On/after August 22, the original gate can route directly to `/birthday`.
- Development skip button remains available at the beginning and on the birthday countdown.
- Birthday passcode remains 22 / 08 / 2007.
- Gift third choice guarantees the Stanley Mug result.
- Final celebration retains lights → cake → confetti → balloons → notes.

`node_modules` is intentionally excluded; run `npm install` on the target Mac before starting Vite.
