import React, { useEffect, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BriefcaseBusiness, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { cardData } from '../cardData';
import profileImg from '../assets/profile_img.jpg';
import FoilLayers from './FoilLayers';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const LINKEDIN_URL = 'https://www.linkedin.com/in/alexander-levero/';
const PHONE_REST_BETA = 45;
const PHONE_TILT_RANGE = 32;

export default function DigitalCard({ motionReady }) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const orientationFrame = useRef(null);
  const pendingTilt = useRef({ x: 0, y: 0 });
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [13, -13]), { stiffness: 190, damping: 21 });
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-15, 15]), { stiffness: 190, damping: 21 });
  const glareX = useSpring(useTransform(rawX, [-1, 1], [6, 94]), { stiffness: 120, damping: 18 });
  const glareY = useSpring(useTransform(rawY, [-1, 1], [6, 94]), { stiffness: 120, damping: 18 });
  const foilAngle = useSpring(useTransform(rawX, [-1, 1], [110, 250]), { stiffness: 90, damping: 22 });
  const portraitGloss = useMotionTemplate`linear-gradient(calc(${foilAngle}deg - 48deg), transparent 16%, rgba(255,255,255,.1) 31%, rgba(255,255,255,.38) 40%, rgba(255,246,204,.16) 48%, transparent 64%), radial-gradient(ellipse at ${glareX}% ${glareY}%, rgba(255,255,255,.32), rgba(255,255,255,.12) 12%, rgba(255,255,255,0) 38%)`;

  useEffect(() => {
    const handleOrientation = (event) => {
      if (!motionReady) return;

      pendingTilt.current = {
        x: clamp((event.gamma || 0) / PHONE_TILT_RANGE, -1, 1),
        y: clamp(((event.beta ?? PHONE_REST_BETA) - PHONE_REST_BETA) / PHONE_TILT_RANGE, -1, 1)
      };

      if (orientationFrame.current) return;
      orientationFrame.current = window.requestAnimationFrame(() => {
        rawX.set(pendingTilt.current.x);
        rawY.set(pendingTilt.current.y);
        orientationFrame.current = null;
      });
    };
    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      if (orientationFrame.current) window.cancelAnimationFrame(orientationFrame.current);
      orientationFrame.current = null;
    };
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
      onPointerDown={(event) => {
        if (!event.target.closest('a')) event.preventDefault();
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        if (!motionReady) {
          rawX.set(0);
          rawY.set(0);
        }
      }}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className="card-frame" aria-hidden="true" />
      <FoilLayers glareX={glareX} glareY={glareY} foilAngle={foilAngle} />

      <div className="editable-layer">
        <div className="card-title-panel">
          <div className="card-rarity"><Sparkles size={18} /> {cardData.rarity}</div>
          <div className="card-name">{cardData.name}</div>
        </div>
        <div className="attribute-badge"><span>{cardData.attribute}</span></div>

        <div className="portrait-slot">
          <img src={profileImg} alt={`${cardData.name} profile`} draggable="false" />
          <motion.div className="portrait-gloss" style={{ background: portraitGloss }} />
        </div>

        <div className="card-picture-meta">
          <span>{cardData.serial}</span>
          <span>{cardData.edition}</span>
        </div>

        <div className="card-traits">
          <div className="trait-line">
            <BriefcaseBusiness size={17} />
            <strong>Type:</strong>
            <span>{cardData.types}</span>
          </div>
          <div className="trait-line">
            <Building2 size={17} />
            <strong>Guilds:</strong>
            <span>{cardData.companies}</span>
          </div>
        </div>

        <div className="effect-copy">
          <strong><ShieldCheck size={18} /> Effect</strong>
          <p>{cardData.tagline}</p>
        </div>

        <div className="card-auth-seal" aria-hidden="true">
          <span className="seal-disc">AL</span>
          <span className="seal-copy">Ultra<br />Rare</span>
        </div>

        <div className="card-footer-meta">
          <b>ATK/{cardData.atk}</b>
          <b>DEF/{cardData.def}</b>
        </div>

        <a
          className="qr-box linkedin-link"
          href={LINKEDIN_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Open Alexander Levero on LinkedIn"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <span className="linkedin-mark" aria-hidden="true">in</span>
        </a>
      </div>
    </motion.article>
  );
}
