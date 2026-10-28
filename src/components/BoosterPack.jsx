import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { cardData } from '../cardData';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const RIP_THRESHOLD = 0.98;

export default function BoosterPack({ onOpening, onOpened }) {
  const reducedMotion = useReducedMotion();
  const [armed, setArmed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const laneRef = useRef(null);
  const gesture = useRef(null);
  const committed = useRef(false);
  const timer = useRef(null);
  const tween = useRef(null);
  const progress = useMotionValue(0);
  const cutWidth = useTransform(progress, [0, 1], ['0%', '100%']);

  useEffect(() => () => {
    clearTimeout(timer.current);
    tween.current?.stop();
  }, []);

  const completeRip = () => {
    if (committed.current) return;
    committed.current = true;
    gesture.current = null;
    tween.current?.stop();
    tween.current = animate(progress, 1, { duration: reducedMotion ? 0 : 0.12 });
    setDragging(false);
    setArmed(true);
    onOpening();
    timer.current = window.setTimeout(onOpened, reducedMotion ? 100 : 920);
  };

  const startRip = (event) => {
    if (committed.current || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const rect = laneRef.current.getBoundingClientRect();
    // A tap at the far end must never count as a completed swipe.
    if (event.clientX > rect.left + rect.width * 0.3) return;
    tween.current?.stop();
    gesture.current = { id: event.pointerId, start: event.clientX, distance: Math.max(1, rect.right - event.clientX) };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const moveRip = (event) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId || committed.current) return;
    const next = clamp((event.clientX - current.start) / current.distance, 0, 1);
    progress.set(next);
    if (next >= RIP_THRESHOLD) completeRip();
  };

  const finishRip = (event) => {
    if (gesture.current?.id !== event.pointerId) return;
    const shouldOpen = event.type !== 'pointercancel' && progress.get() >= RIP_THRESHOLD;
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    if (shouldOpen) completeRip();
    else tween.current = animate(progress, 0, { type: 'spring', stiffness: 230, damping: 24 });
  };

  return (
    <div className="pack-wrap">
      <div className={'pack ' + (dragging ? 'is-dragging ' : '') + (armed ? 'ripped' : '')}>
        <div className="pack-body">
          <div className="pack-art" aria-hidden="true" />
          <div className="pack-holo" aria-hidden="true" />
          <div className="pack-gloss" aria-hidden="true" />
          <div className="pack-title-mark">
            <span className="pack-series">The founder collection • Vol. I</span>
            <strong>{cardData.packTitle.replace(' BUSINESS', '\nBUSINESS')}</strong>
            <em>{cardData.packSubtitle}</em>
          </div>
          <div className="pack-print">
            <span className="pack-edition">First edition</span>
            <b>1 HOLOGRAPHIC CARD</b>
            <span>AL–0001 <i>✦</i> COLLECTOR SERIES</span>
          </div>
        </div>
        <motion.div className="pack-top" aria-hidden="true"
          animate={armed ? (reducedMotion ? { opacity: 0 } : { x: 95, y: -150, rotate: -32, opacity: 0 }) : { opacity: 1 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.65, ease: [0.22, 1, 0.36, 1] }} />
        <button className="tear-lane" ref={laneRef} disabled={armed}
          aria-label="Open booster pack. Swipe from left to right, or press Enter or Space."
          onPointerDown={startRip} onPointerMove={moveRip}
          onPointerUp={finishRip} onPointerCancel={finishRip}
          onLostPointerCapture={(event) => { if (gesture.current?.id === event.pointerId) finishRip({ ...event, type: 'pointercancel' }); }}
          onClick={(event) => { if (event.detail === 0) completeRip(); }}>
          <span className="swipe-instruction">{dragging ? 'Break the seal' : 'Swipe to break the seal'}</span>
          <span className="tear-track" />
          <motion.span className="tear-progress" style={{ scaleX: progress }} />
          <motion.span className="tear-flare" style={{ left: cutWidth }}><span>›</span></motion.span>
        </button>
        <div className="pack-mouth" aria-hidden="true" />
      </div>
    </div>
  );
}
