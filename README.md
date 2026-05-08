# Pack Rip Holo Business Card

A self-hostable React + Framer Motion microsite for a QR-code landing page:

1. Visitor scans a QR code pointing to this hosted page.
2. They see a sealed booster pack.
3. They tap the pack to focus the top edge.
4. They swipe the glowing top edge to rip it open.
5. A full-screen holographic digital business card pops out.
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

The booster pack and card frame are rendered in React/CSS rather than static background art.
Text, the LinkedIn icon link, and portrait are rendered as real UI layers so they stay crisp and easy to update.

## Assets

- `src/assets/profile_img.jpg` - profile portrait

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
