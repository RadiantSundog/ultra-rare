import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BriefcaseBusiness, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { cardData } from '../cardData';
import profileImg from '../assets/profile_img.jpg';
import FoilLayers from './FoilLayers';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const LINKEDIN_URL = 'https://www.linkedin.com/in/alexander-levero/';
const PHONE_REST_BETA = 45;
const PHONE_TILT_RANGE = 32;

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const query = window.matchMedia?.('(pointer: coarse), (max-width: 720px)');
    if (!query) return;
    const update = () => setCoarse(query.matches);
    update();
    query.addEventListener?.('change', update);
    query.addListener?.(update);
    return () => {
      query.removeEventListener?.('change', update);
      query.removeListener?.(update);
    };
  }, []);

  return coarse;
}

export default function DigitalCard({ motionReady }) {
  const isCoarsePointer = useCoarsePointer();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const orientationFrame = useRef(null);
  const pointerFrame = useRef(null);
  const pendingTilt = useRef({ x: 0, y: 0 });
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [isCoarsePointer ? 8 : 13, isCoarsePointer ? -8 : -13]), { stiffness: 190, damping: 21 });
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [isCoarsePointer ? -9 : -15, isCoarsePointer ? 9 : 15]), { stiffness: 190, damping: 21 });
  const glareX = useSpring(useTransform(rawX, [-1, 1], [8, 92]), { stiffness: isCoarsePointer ? 150 : 120, damping: 20 });
  const glareY = useSpring(useTransform(rawY, [-1, 1], [8, 92]), { stiffness: isCoarsePointer ? 150 : 120, damping: 20 });
  const foilAngle = useSpring(useTransform(rawX, [-1, 1], [110, 250]), { stiffness: 90, damping: 22 });
  const portraitGloss = useMotionTemplate`linear-gradient(calc(${foilAngle}deg - 48deg), transparent 16%, rgba(255,255,255,.1) 31%, rgba(255,255,255,.38) 40%, rgba(255,246,204,.16) 48%, transparent 64%), radial-gradient(ellipse at ${glareX}% ${glareY}%, rgba(255,255,255,.32), rgba(255,255,255,.12) 12%, rgba(255,255,255,0) 38%)`;
  const attributeShine = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,.86) 0 11%, rgba(255,245,197,.42) 17%, rgba(255,255,255,0) 36%), linear-gradient(calc(${foilAngle}deg - 40deg), transparent 24%, rgba(255,255,255,.08) 38%, rgba(255,255,255,.52) 48%, rgba(255,237,162,.18) 56%, transparent 68%)`;
  const attributeGlyph = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,.96) 0 10%, rgba(255,255,255,.72) 18%, rgba(255,239,171,.28) 31%, rgba(255,255,255,0) 44%), linear-gradient(calc(${foilAngle}deg - 40deg), rgba(255,244,173,.92), rgba(255,255,255,.98) 24%, rgba(105,240,255,.94) 44%, rgba(255,113,207,.9) 61%, rgba(255,212,93,.96) 78%, rgba(255,248,204,.94))`;

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
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (orientationFrame.current) window.cancelAnimationFrame(orientationFrame.current);
      orientationFrame.current = null;
    };
  }, [motionReady, rawX, rawY]);

  useEffect(() => () => {
    if (pointerFrame.current) window.cancelAnimationFrame(pointerFrame.current);
  }, []);

  const handlePointerMove = (event) => {
    if (motionReady) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const next = {
      x: clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
      y: clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1)
    };
    pendingTilt.current = next;
    if (pointerFrame.current) return;
    pointerFrame.current = window.requestAnimationFrame(() => {
      rawX.set(pendingTilt.current.x);
      rawY.set(pendingTilt.current.y);
      pointerFrame.current = null;
    });
  };

  const cardClassName = useMemo(
    () => `digital-card ${isCoarsePointer ? 'is-mobile-optimized' : ''}`,
    [isCoarsePointer]
  );

  return (
    <motion.article
      className={cardClassName}
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
      <FoilLayers glareX={glareX} glareY={glareY} foilAngle={foilAngle} compact={isCoarsePointer} />

      <div className="editable-layer">
        <div className="card-title-panel">
          <div className="card-rarity"><Sparkles size={18} /> {cardData.rarity}</div>
          <div className="card-name">{cardData.name}</div>
        </div>
        <div className="attribute-badge">
          <motion.div className="attribute-shine" style={{ background: attributeShine }} aria-hidden="true" />
          <motion.span style={{ background: attributeGlyph }}>{cardData.attribute}</motion.span>
        </div>

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
