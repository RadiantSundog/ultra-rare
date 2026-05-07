import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { cardData } from '../cardData';
import textlessCard from '../assets/card-textless.svg';
import profileImg from '../assets/profile_img.jpg';
import qrImg from '../assets/linkedin_qr.jpg';
import FoilLayers from './FoilLayers';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function DigitalCard({ motionReady }) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [13, -13]), { stiffness: 190, damping: 21 });
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-15, 15]), { stiffness: 190, damping: 21 });
  const glareX = useSpring(useTransform(rawX, [-1, 1], [6, 94]), { stiffness: 120, damping: 18 });
  const glareY = useSpring(useTransform(rawY, [-1, 1], [6, 94]), { stiffness: 120, damping: 18 });
  const foilAngle = useSpring(useTransform(rawX, [-1, 1], [110, 250]), { stiffness: 90, damping: 22 });
  const burstSpin = useSpring(useTransform(rawX, [-1, 1], [-24, 24]), { stiffness: 90, damping: 22 });

  useEffect(() => {
    const handleOrientation = (event) => {
      if (!motionReady) return;
      const gamma = clamp((event.gamma || 0) / 35, -1, 1);
      const beta = clamp((event.beta || 0) / 35, -1, 1);
      rawX.set(gamma);
      rawY.set(beta);
    };
    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, [motionReady, rawX, rawY]);

  const handlePointerMove = (event) => {
    if (motionReady) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    rawX.set(clamp(x, -1, 1));
    rawY.set(clamp(y, -1, 1));
  };

  return (
    <motion.article
      className="digital-card"
      style={{ rotateX, rotateY, transformPerspective: 1400 }}
      initial={{ y: 170, scale: 0.74, opacity: 0, rotateX: 18 }}
      animate={{ y: 0, scale: 1, opacity: 1, rotateX: 0 }}
      transition={{ type: 'spring', stiffness: 95, damping: 16, delay: 0.08 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        if (!motionReady) {
          rawX.set(0);
          rawY.set(0);
        }
      }}
    >
      <img className="card-bg" src={textlessCard} alt="Textless collectible card background" />
      <FoilLayers glareX={glareX} glareY={glareY} foilAngle={foilAngle} burstSpin={burstSpin} />

      <div className="editable-layer">
        <div className="card-rarity"><Sparkles size={18} /> {cardData.rarity}</div>
        <div className="card-name">{cardData.name}</div>
        <div className="attribute-badge">{cardData.attribute}</div>

        <div className="portrait-slot">
          <img src={profileImg} alt={`${cardData.name} profile`} />
          <div className="portrait-foil" />
        </div>

        <div className="title-line">[ {cardData.titles} ]</div>

        <div className="effect-copy">
          <strong><ShieldCheck size={18} /> Effect</strong>
          <p>{cardData.tagline}</p>
        </div>

        <div className="card-footer-meta">
          <span>{cardData.serial}</span>
          <span>{cardData.edition}</span>
          <b>ATK {cardData.atk}</b>
          <b>DEF {cardData.def}</b>
        </div>

        <div className="qr-box">
          <span className="linkedin-mark">in</span>
          <img src={qrImg} alt="LinkedIn QR code" />
        </div>
      </div>
    </motion.article>
  );
}
