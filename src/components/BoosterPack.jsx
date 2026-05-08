import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { cardData } from '../cardData';

const RIP_THRESHOLD = 0.66;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const LIGHT_BEAMS = [-48, -32, -18, -6, 8, 22, 38, 54];
const LIGHT_SPARKS = [
  { x: -88, y: -64, size: 5, scale: 0.9, delay: 0.03 },
  { x: -58, y: -105, size: 7, scale: 1.1, delay: 0.09 },
  { x: -22, y: -82, size: 4, scale: 0.8, delay: 0.14 },
  { x: 18, y: -122, size: 6, scale: 1, delay: 0.05 },
  { x: 52, y: -88, size: 4, scale: 0.85, delay: 0.16 },
  { x: 86, y: -58, size: 6, scale: 1.05, delay: 0.11 }
];

export default function BoosterPack({ onOpened }) {
  const [focused, setFocused] = useState(false);
  const [armed, setArmed] = useState(false);
  const [ripDistance, setRipDistance] = useState(280);
  const laneRef = useRef(null);
  const activePointer = useRef(null);
  const dragX = useMotionValue(0);
  const progress = useTransform(dragX, [0, ripDistance], [0, 1]);
  const cutWidth = useTransform(progress, [0, 1], ['0%', '100%']);
  const sparkLeft = useTransform(dragX, [0, ripDistance], ['0%', '100%']);
  const flareScale = useTransform(progress, [0, 1], [0.9, 1.28]);
  const flareOpacity = useTransform(progress, [0, 0.9, 1], [0.58, 0.92, 0]);

  useEffect(() => {
    const measureLane = () => {
      if (!laneRef.current) return;
      const width = laneRef.current.getBoundingClientRect().width;
      setRipDistance(Math.max(150, width));
    };
    measureLane();
    const observer = new ResizeObserver(measureLane);
    if (laneRef.current) observer.observe(laneRef.current);
    window.addEventListener('resize', measureLane);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measureLane);
    };
  }, []);

  const completeRip = () => {
    if (armed) return;
    dragX.set(ripDistance);
    setArmed(true);
    window.setTimeout(onOpened, 1120);
  };

  const resetDrag = () => {
    if (!armed) dragX.set(0);
  };

  const updateRipFromPointer = (event) => {
    const rect = laneRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const nextX = clamp(event.clientX - rect.left, 0, ripDistance);
    dragX.set(nextX);
    return nextX;
  };

  const startRip = (event) => {
    if (armed) return;
    event.stopPropagation();
    setFocused(true);
    activePointer.current = event.pointerId;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updateRipFromPointer(event);
  };

  const moveRip = (event) => {
    if (activePointer.current !== event.pointerId || armed) return;
    const nextX = updateRipFromPointer(event);
    if (nextX > ripDistance * 0.94) completeRip();
  };

  const finishRip = (event) => {
    if (activePointer.current !== event.pointerId || armed) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    activePointer.current = null;
    if (dragX.get() > ripDistance * RIP_THRESHOLD) completeRip();
    else resetDrag();
  };

  return (
    <div
      className={`pack-wrap ${focused ? 'is-focused' : ''}`}
    >
      <motion.div
        className={`pack ${focused ? 'is-focused' : ''} ${armed ? 'ripped' : ''}`}
        role="button"
        aria-label={focused ? 'Swipe across the glowing top edge to open the pack' : 'Tap the pack to inspect the top edge'}
        tabIndex={0}
        style={{ '--cut-width': cutWidth, '--spark-left': sparkLeft }}
        onTap={() => {
          if (!focused && !armed) setFocused(true);
        }}
        onKeyDown={(event) => {
          if ((event.key === 'Enter' || event.key === ' ') && !focused && !armed) {
            event.preventDefault();
            setFocused(true);
          }
        }}
      >
        <div className="pack-art" aria-hidden="true">
          <div className="pack-crimp pack-crimp-top" />
          <div className="pack-crimp pack-crimp-bottom" />
          <div className="pack-aura" />
          <div className="pack-card-shadow" />
          <div className="pack-grid" />
        </div>
        <div className="pack-holo" />
        <div className="pack-gloss" />
        <div className="pack-shadowline" />
        <div className="pack-title-mark">
          <strong>{cardData.packTitle}</strong>
          <em>{cardData.packSubtitle}</em>
        </div>

        <div
          className="tear-lane"
          ref={laneRef}
          role="slider"
          aria-label="Drag the glowing tear line to open the pack"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          onPointerDown={startRip}
          onPointerMove={moveRip}
          onPointerUp={finishRip}
          onPointerCancel={finishRip}
        >
          <div className="swipe-instruction">Drag the glow</div>
          <div className="tear-breath" />
          <motion.div className="tear-progress" style={{ width: cutWidth }} />
          <motion.div className="tear-flare" style={{ left: sparkLeft, scale: flareScale, opacity: flareOpacity }} />
        </div>

        <motion.div
          className="pack-top"
          animate={armed ? { y: -96, rotate: -8, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="pack-open-flash" aria-hidden="true" />
        <div className="pack-lightburst" aria-hidden="true">
          <motion.div
            className="light-core"
            initial={false}
            animate={armed ? { opacity: [0, 1, 0], scale: [0.55, 1.24, 1.75], y: [8, -24, -56] } : { opacity: 0, scale: 0.55, y: 8 }}
            transition={{ duration: 0.92, ease: [0.16, 1, 0.3, 1] }}
          />
          {LIGHT_BEAMS.map((angle, index) => (
            <motion.span
              className="light-beam"
              key={angle}
              style={{ '--beam-angle': `${angle}deg` }}
              initial={false}
              animate={armed ? { opacity: [0, 0.92, 0], scaleY: [0.16, 1.2, 1.62], y: [20, -34, -100] } : { opacity: 0, scaleY: 0.16, y: 20 }}
              transition={{ duration: 0.9, delay: index * 0.025, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
          {LIGHT_SPARKS.map((spark, index) => (
            <motion.span
              className="light-spark"
              key={`${spark.x}-${spark.y}`}
              style={{ width: spark.size, height: spark.size }}
              initial={false}
              animate={armed ? { opacity: [0, 1, 0], x: [0, spark.x], y: [0, spark.y], scale: [0.35, spark.scale, 0.18] } : { opacity: 0, x: 0, y: 0, scale: 0.35 }}
              transition={{ duration: 0.82, delay: spark.delay + index * 0.018, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
