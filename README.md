# Pack Rip Holo Business Card

A self-hostable React + Framer Motion microsite for a QR-code landing page:

1. Visitor scans a QR code pointing to this hosted page.
2. They see a sealed booster pack.
3. They swipe the top tear strip to rip it open.
4. A full-screen holographic digital business card pops out.
5. The foil responds to pointer movement on desktop and phone tilt on mobile.

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

The card background is intentionally textless: `src/assets/card-textless.svg`.
Text, QR code, and portrait are rendered in React/CSS so they stay crisp and easy to update.

## Assets

- `src/assets/profile_img.jpg` — profile portrait
- `src/assets/linkedin_qr.jpg` — LinkedIn QR shown on the revealed card
- `src/assets/card-textless.svg` — blank card frame/background
- `src/assets/pack-blank.svg` — blank booster pack art

## Phone tilt note

On iOS, accelerometer access usually requires HTTPS. For testing from your phone, use an HTTPS tunnel such as `ngrok` or `localtunnel`.

## GitHub Pages deployment

This version includes:

- `vite.config.js` with `base: './'`, so assets work from a GitHub Pages project URL.
- `.github/workflows/deploy.yml`, so GitHub builds the React/Vite app and deploys the generated `dist/` folder automatically.

### Setup

1. Upload the **contents** of this folder to your repo root.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push/commit to `main`.
5. Open the **Actions** tab and wait for “Deploy to GitHub Pages” to finish.
6. Your site will appear at the Pages URL shown in **Settings → Pages**.
