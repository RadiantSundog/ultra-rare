import React from 'react';
import { motion, useMotionTemplate } from 'framer-motion';

export default function FoilLayers({ glareX, glareY, foilAngle, burstSpin, active = true }) {
  const prismatic = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,.48), rgba(255,255,255,.08) 11%, transparent 29%), conic-gradient(from ${foilAngle}deg at ${glareX}% ${glareY}%, rgba(255, 26, 120, .30), rgba(255, 140, 0, .27), rgba(255, 237, 78, .25), rgba(84,255,201,.28), rgba(0,191,255,.28), rgba(124,92,255,.27), rgba(255,46,210,.28), rgba(255,26,120,.30))`;
  const secretLines = useMotionTemplate`repeating-linear-gradient(calc(${foilAngle}deg - 72deg), rgba(255,255,255,0) 0 8px, rgba(255,244,183,.15) 10px, rgba(109,219,255,.17) 12px, rgba(255,126,233,.14) 14px, rgba(255,255,255,0) 17px 31px)`;
  const starburst = useMotionTemplate`radial-gradient(circle at 50% 50%, rgba(255,255,255,.20), transparent 25%), repeating-conic-gradient(from ${burstSpin}deg at 50% 50%, rgba(255,255,255,0) 0deg 7deg, rgba(255,247,196,.32) 7deg 8deg, rgba(255,255,255,0) 8deg 14deg, rgba(120,229,255,.17) 14deg 15deg, rgba(255,255,255,0) 15deg 22deg, rgba(255,112,219,.15) 22deg 23deg, rgba(255,255,255,0) 23deg 30deg)`;
  const specular = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,.98) 0%, rgba(255,255,255,.58) 3%, rgba(255,246,194,.18) 8%, rgba(255,255,255,0) 23%), linear-gradient(calc(${foilAngle}deg - 50deg), transparent 14%, rgba(255,255,255,.22) 30%, rgba(255,255,255,.02) 42%, transparent 58%)`;

  return (
    <>
      <motion.div className="foil foil-prismatic" style={{ background: prismatic, opacity: active ? 0.96 : 0.2 }} />
      <motion.div className="foil foil-secret-lines" style={{ background: secretLines, opacity: active ? 0.52 : 0.12 }} />
      <motion.div className="foil foil-starburst" style={{ background: starburst, opacity: active ? 0.45 : 0.12 }} />
      <motion.div className="foil foil-specular" style={{ background: specular, opacity: active ? 0.9 : 0.2 }} />
      <div className="foil foil-sparkle" />
      <div className="foil foil-vignette" />
    </>
  );
}
