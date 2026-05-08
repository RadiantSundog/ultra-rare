import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cardData } from '../cardData';

export default function BoosterPack({ onOpened }) {
  const [focused, setFocused] = useState(false);
  const [armed, setArmed] = useState(false);
  const [ripDistance, setRipDistance] = useState(280);
  const laneRef = useRef(null);
  const dragX = useMotionValue(0);
  const progress = useTransform(dragX, [0, ripDistance], [0, 1]);
  const stripOpacity = useTransform(progress, [0, 0.84, 1], [0.92, 1, 0]);
  const cutWidth = useTransform(progress, [0, 1], ['0%', '100%']);
  const sparkLeft = useTransform(dragX, [0, ripDistance], ['4%', '96%']);
  const flareScale = useTransform(progress, [0, 1], [0.78, 1.45]);
  const flareOpacity = useTransform(progress, [0, 0.85, 1], [0.7, 1, 0]);

  useEffect(() => {
    const measureLane = () => {
      if (!laneRef.current) return;
      const width = laneRef.current.getBoundingClientRect().width;
      setRipDistance(Math.max(190, width - 56));
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
    window.setTimeout(onOpened, 760);
  };

  const resetDrag = () => {
    if (!armed) dragX.set(0);
  };

  return (
    <motion.div
      className={`pack-wrap ${focused ? 'is-focused' : ''}`}
      initial={{ y: '2vh', scale: 0.94, rotateX: -5 }}
      animate={focused ? { y: '44vh', scale: 1.6, rotateX: 0 } : { y: '0vh', scale: 1, rotateX: -4 }}
      transition={{ type: 'spring', stiffness: 110, damping: 17 }}
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
          <div className="pack-sigil">AL</div>
        </div>
        <div className="pack-holo" />
        <div className="pack-gloss" />
        <div className="pack-shadowline" />

        <div className="pack-label" aria-hidden={focused}>
          <strong>{cardData.packTitle}</strong>
          <em>{cardData.packSubtitle}</em>
        </div>

        <div className="tap-cue" aria-hidden="true">
          <Sparkles size={18} />
        </div>

        <div className="tear-lane" ref={laneRef} aria-hidden={!focused}>
          <div className="swipe-instruction">Swipe here!</div>
          <motion.div className="tear-progress" style={{ width: cutWidth }} />
          <motion.div className="tear-flare" style={{ left: sparkLeft, scale: flareScale, opacity: flareOpacity }} />
          <motion.div
            className="tear-strip"
            style={{ x: dragX, opacity: stripOpacity }}
            drag={focused && !armed ? 'x' : false}
            dragConstraints={{ left: 0, right: ripDistance }}
            dragElastic={0.035}
            dragMomentum={false}
            onPointerDown={(event) => event.stopPropagation()}
            onDrag={() => {
              if (dragX.get() > ripDistance * 0.58) completeRip();
            }}
            onDragEnd={(_, info) => {
              if (dragX.get() > ripDistance * 0.52 || info.offset.x > ripDistance * 0.58 || info.velocity.x > 620) completeRip();
              else resetDrag();
            }}
            whileTap={{ scale: 0.94 }}
          >
            <span />
          </motion.div>
        </div>

        <motion.div
          className="pack-top"
          animate={armed ? { y: -96, rotate: -8, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="pack-open-flash" aria-hidden="true" />
      </motion.div>
    </motion.div>
  );
}
