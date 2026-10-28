import React, { useEffect, useMemo, useRef, useState } from 'react';
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { BriefcaseBusiness, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { cardData } from '../cardData';
import profileImg from '../assets/profile_img.jpg';
import FoilLayers from './FoilLayers';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const LINKEDIN_URL = 'https://www.linkedin.com/in/alexander-levero/';
const PHONE_TILT_RANGE = 32;

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const query = window.matchMedia?.('(pointer: coarse), (max-width: 720px)');
    if (!query) return;
    const update = () => setCoarse(query.matches);
    update();
    query.addEventListener?.('change', update);
    if (!query.addEventListener) query.addListener?.(update);
    return () => {
      query.removeEventListener?.('change', update);
      if (!query.removeEventListener) query.removeListener?.(update);
    };
  }, []);

  return coarse;
}

export default function DigitalCard({ motionReady }) {
  const reducedMotion = useReducedMotion();
  const isCoarsePointer = useCoarsePointer();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const orientationFrame = useRef(null);
  const pointerFrame = useRef(null);
  const pendingTilt = useRef({ x: 0, y: 0 });
  const pendingPointer = useRef({ x: 0, y: 0 });
  const orientationBase = useRef(null);
  const intro = useRef([]);
  const cardRef = useRef(null);
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [isCoarsePointer ? 8 : 13, isCoarsePointer ? -8 : -13]), { stiffness: 190, damping: 21 });
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [isCoarsePointer ? -9 : -15, isCoarsePointer ? 9 : 15]), { stiffness: 190, damping: 21 });
  const glareX = useSpring(useTransform(rawX, [-1, 1], [8, 92]), { stiffness: isCoarsePointer ? 150 : 120, damping: 20 });
  const glareY = useSpring(useTransform(rawY, [-1, 1], [8, 92]), { stiffness: isCoarsePointer ? 150 : 120, damping: 20 });
  const foilAngle = useSpring(useTransform(rawX, [-1, 1], [110, 250]), { stiffness: 90, damping: 22 });
  const attributeShine = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,.86) 0 11%, rgba(255,245,197,.42) 17%, rgba(255,255,255,0) 36%), linear-gradient(calc(${foilAngle}deg - 40deg), transparent 24%, rgba(255,255,255,.08) 38%, rgba(255,255,255,.52) 48%, rgba(255,237,162,.18) 56%, transparent 68%)`;
  const attributeGlyph = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,.96) 0 10%, rgba(255,255,255,.72) 18%, rgba(255,239,171,.28) 31%, rgba(255,255,255,0) 44%), linear-gradient(calc(${foilAngle}deg - 40deg), rgba(255,244,173,.92), rgba(255,255,255,.98) 24%, rgba(105,240,255,.94) 44%, rgba(255,113,207,.9) 61%, rgba(255,212,93,.96) 78%, rgba(255,248,204,.94))`;

  useEffect(() => {
    if (!motionReady || reducedMotion) return;
    const handleOrientation = (event) => {
      if (document.hidden || event.beta == null || event.gamma == null) return;
      intro.current.forEach((animation) => animation.stop());
      orientationBase.current ??= { beta: event.beta, gamma: event.gamma };
      pendingTilt.current = {
        x: clamp((event.gamma - orientationBase.current.gamma) / PHONE_TILT_RANGE, -1, 1),
        y: clamp((event.beta - orientationBase.current.beta) / PHONE_TILT_RANGE, -1, 1)
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
      orientationBase.current = null;
    };
  }, [motionReady, reducedMotion, rawX, rawY]);

  useEffect(() => {
    cardRef.current?.focus({ preventScroll: true });
    if (reducedMotion || motionReady) return;
    intro.current = [
      animate(rawX, [-0.65, 0.7, 0], { duration: 1.8, ease: 'easeInOut' }),
      animate(rawY, [0.25, -0.35, 0], { duration: 1.8, ease: 'easeInOut' })
    ];
    return () => intro.current.forEach((animation) => animation.stop());
  }, [rawX, rawY, reducedMotion, motionReady]);

  useEffect(() => () => {
    if (pointerFrame.current) window.cancelAnimationFrame(pointerFrame.current);
  }, []);

  const handlePointerMove = (event) => {
    if (orientationBase.current || reducedMotion) return;
    intro.current.forEach((animation) => animation.stop());
    pendingPointer.current = { x: event.clientX, y: event.clientY };
    if (pointerFrame.current) return;
    pointerFrame.current = window.requestAnimationFrame(() => {
      const rect = cardRef.current.getBoundingClientRect();
      rawX.set(clamp(((pendingPointer.current.x - rect.left) / rect.width) * 2 - 1, -1, 1));
      rawY.set(clamp(((pendingPointer.current.y - rect.top) / rect.height) * 2 - 1, -1, 1));
      pointerFrame.current = null;
    });
  };

  const cardClassName = useMemo(
    () => `digital-card ${isCoarsePointer ? 'is-mobile-optimized' : ''}`,
    [isCoarsePointer]
  );

  return (
    <motion.article
      ref={cardRef}
      tabIndex={-1}
      aria-label={`${cardData.name}, ${cardData.rarity} business card`}
      className={cardClassName}
      style={{ rotateX, rotateY, transformPerspective: 1400 }}
      initial={{ y: reducedMotion ? 0 : 85, scale: reducedMotion ? 1 : 0.82, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{ duration: reducedMotion ? 0.15 : 0.85, ease: [0.16, 1, 0.3, 1] }}
      onPointerDown={(event) => {
        if (!event.target.closest('a')) event.preventDefault();
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        if (!orientationBase.current) {
          if (pointerFrame.current) window.cancelAnimationFrame(pointerFrame.current);
          pointerFrame.current = null;
          intro.current.forEach((animation) => animation.stop());
          rawX.set(0);
          rawY.set(0);
        }
      }}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className="card-frame" aria-hidden="true" />
      <FoilLayers glareX={glareX} glareY={glareY} compact={isCoarsePointer} />

      <div className="editable-layer">
        <div className="card-title-panel">
          <div className="card-rarity"><Sparkles size={18} /> {cardData.rarity}</div>
          <div className="card-name">{cardData.name}</div>
        </div>
        <div className="attribute-badge">
          <motion.div className="attribute-shine" style={{ background: attributeShine }} aria-hidden="true" />
          <motion.span style={{ backgroundImage: attributeGlyph }}>{cardData.attribute}</motion.span>
        </div>

        <div className="portrait-slot">
          <img src={profileImg} alt={`${cardData.name} profile`} draggable="false" />
          <div className="portrait-foil"><FoilLayers glareX={glareX} glareY={glareY} compact={isCoarsePointer} /></div>
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
