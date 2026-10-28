# Pack Rip Holo Business Card

A self-hostable React + Framer Motion microsite for a QR-code landing page:

1. Visitor scans a QR code pointing to this hosted page.
2. They see a sealed booster pack.
3. They drag the glowing handle from left to right across the seal (or focus it and press Enter/Space).
4. The foil strip peels away and the wrapper falls through a warm burst of light.
5. A holographic digital business card appears through the fading glow.
6. The foil responds to pointer movement on desktop and phone tilt on mobile.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite `Network:` URL on your phone while both devices are on the same Wi-Fi.

## Build

```bash
npm run build
```

Host the contents of `dist/` on your static host.

## Editing the card

Edit `src/cardData.js` for text, labels, ATK/DEF, serial, and pack labels.

The booster uses a compressed, generated foil texture, with a matching torn strip and body rendered separately. The card frame is rendered in React/CSS.
Text, the LinkedIn icon link, and portrait are rendered as real UI layers so they stay crisp and easy to update.

## Assets

- `src/assets/profile_img.jpg` - profile portrait
- `src/assets/pack-celestial.jpg` - 900 × 1400 foil wrapper texture (461 KB)
- `src/assets/foil-facets.svg` - deterministic microfacet foil texture
- `src/pack.css` - wrapper, swipe, and reveal burst
- `src/foil.css` - light-reactive spectrum, etching, and reflection layers

The wrapper was generated with the built-in image-generation tool. Its art brief and generation prompt are recorded in [art-direction.md](art-direction.md).

## Motion and mobile rendering

- Three fixed foil layers per surface (frame and portrait), moved with transforms. Large foil gradients are not regenerated on each pointer event.
- Pointer input and orientation events are batched to one update per animation frame; gesture updates do not render the React tree.
- One introductory light sweep, then no looping card animation while idle. Mobile uses a simpler etching texture.
- Phone tilt calibrates to the initial holding position. Touch continues working if permission succeeds but the device supplies no sensor readings.
- Partial/cancelled swipes reset, opening is guarded against duplicate completion, and timers/animation frames are cleaned up on unmount.
- Reduced-motion preferences remove the burst, card tilt, and entrance travel, retaining a short fade.

Browser QA covers desktop, 390 × 844 and 320 × 568 layouts, swipe completion/reset, accidental endpoint taps, Enter/Space opening, and repacking. Actual phone GPU frame rates and gyroscope behavior still require device testing.

## Phone Tilt Note

On iOS, accelerometer access usually requires HTTPS. For testing from your phone, use an HTTPS tunnel such as `ngrok` or `localtunnel`.

## GitHub Pages Deployment

This version includes:

- `vite.config.js` with `base: './'`, so assets work from a GitHub Pages project URL.
- `.github/workflows/deploy.yml`, so GitHub builds the React/Vite app and deploys the generated `dist/` folder automatically.

### Setup

1. Upload the contents of this folder to your repo root.
2. Go to Settings > Pages.
3. Under Build and deployment, set Source to GitHub Actions.
4. Push/commit to `main`.
5. Open the Actions tab and wait for Deploy to GitHub Pages to finish.
6. Your site will appear at the Pages URL shown in Settings > Pages.
