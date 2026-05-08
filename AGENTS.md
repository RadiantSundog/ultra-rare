# Agent Notes

## Product Direction

This app is an interactive digital business card presented as an early-2000s trading card reveal. The target vibe is the tactile, collectible look of Pokemon and Yu-Gi-Oh era cards: foil shine, ornate borders, tiny collector metadata, dense serif labels, compact stat text, and booster-pack ceremony.

Do not steer the UI toward a modern SaaS profile card, landing page, or generic portfolio. The experience should feel like opening and inspecting a rare card.

## Current Look

- The first screen shows a dark, glossy booster pack with crimped edges, a glowing drag tear line, holographic pack art, and a "DIGITAL BUSINESS CARD / BOOSTER PACK" title treatment.
- Opening the pack reveals one portrait-oriented card with a gold/brown frame, holo foil layers, sparkles, glare, and tilt/hover motion.
- The card face has a top rarity/name panel, a round attribute badge, a large portrait window, type/guild metadata, and an effect-text box.
- The portrait has tiny collector print just beneath it: serial on the lower-left side and edition on the lower-right side.
- The lower-left footer area includes a small holographic authenticity seal, used as nostalgic collectible-card ornamentation rather than a modern control.
- The footer is now a compact dark foil stat plaque for `ATK/` and `DEF/`, positioned near the lower-right area beside the LinkedIn mark rather than spanning empty space.
- The LinkedIn action is a small blue square in the lower-right card area. It should read as a card utility mark, not as a modern CTA button.

## Style Rules

- Preserve the card and pack aspect ratios; most card internals are positioned with percentages and `cqw` units so the layout scales as one physical object.
- Keep typography dense and collectible: serif/Copperplate-style labels, small uppercase metadata, and compact stat lines.
- Holographic effects should enhance the collectible feel without making text unreadable.
- Prefer parchment, gold, dark brown, and foil accents for card internals. Blue should stay mostly reserved for the LinkedIn mark.
- Decorative seals, stamps, and micro-labels are good ways to solve empty card space, as long as they feel like printed card details.
- ATK/DEF should remain close to the Yu-Gi-Oh style: compact, bottom-right, formatted with slashes, and allowed to use the animated foil text treatment.
- Avoid large rounded app cards, marketing sections, explanatory copy, or UI that makes the project feel like a standard personal website.

## Implementation Notes

- `src/components/DigitalCard.jsx` owns the revealed card markup.
- `src/components/BoosterPack.jsx` owns the pack-opening interaction.
- `src/styles.css` owns the visual system, including card layout, foil layers, and responsive scaling.
- `src/cardData.js` is the content source for card labels and stats.
- Build with `npm run build` after visual changes so `dist` stays current.
