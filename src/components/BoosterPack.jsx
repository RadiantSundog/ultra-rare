import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronsRight, Scissors } from 'lucide-react';
import { cardData } from '../cardData';
import packBlank from '../assets/pack-blank.svg';

export default function BoosterPack({ onOpened }) {
  const [armed, setArmed] = useState(false);
  const dragX = useMotionValue(0);
  const progress = useTransform(dragX, [0, 240], [0, 1]);
  const tearGlow = useTransform(progress, [0, 1], ['0 0 18px rgba(255,255,255,.1)', '0 0 44px rgba(255,225,137,.75)']);
  const stripOpacity = useTransform(progress, [0, 0.7, 1], [0.78, 0.95, 0]);
  const cutWidth = useTransform(progress, [0, 1], ['8%', '100%']);

  const completeRip = () => {
    setArmed(true);
    window.setTimeout(onOpened, 560);
  };

  return (
    <motion.div className="pack-wrap" initial={{ y: 24, scale: 0.94 }} animate={{ y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
      <motion.div className={`pack ${armed ? 'ripped' : ''}`} style={{ '--cut-width': cutWidth }}>
        <img className="pack-art" src={packBlank} alt="Sealed digital card pack" />
        <div className="pack-holo" />
        <div className="pack-label">
          <span>{cardData.rarity}</span>
          <strong>{cardData.packTitle}</strong>
          <em>{cardData.packSubtitle}</em>
        </div>
        <motion.div className="tear-progress" style={{ width: cutWidth }} />
        <motion.div className="pack-top" animate={armed ? { y: -92, rotate: -9, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }} />
        <motion.div className="tear-strip" style={{ x: dragX, boxShadow: tearGlow, opacity: stripOpacity }} drag="x" dragConstraints={{ left: 0, right: 260 }} dragElastic={0.06} dragMomentum={false} onDragEnd={(_, info) => {
          if (info.offset.x > 145 || info.velocity.x > 650) completeRip();
          else dragX.set(0);
        }} whileTap={{ scale: 0.98 }}>
          <Scissors size={18} />
          <span>Rip</span>
          <ChevronsRight size={19} />
        </motion.div>
        <div className="pack-instruction">{cardData.packHint}</div>
      </motion.div>
    </motion.div>
  );
}
