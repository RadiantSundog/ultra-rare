import React from 'react';
import { motion, useMotionTemplate } from 'framer-motion';

export default function FoilLayers({ glareX, glareY, foilAngle, active = true }) {
  const holoColor = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,.34), rgba(255,244,145,.28) 10%, rgba(255,83,196,.22) 21%, rgba(73,230,255,.24) 34%, rgba(116,97,255,.16) 46%, transparent 64%), repeating-conic-gradient(from ${foilAngle}deg at ${glareX}% ${glareY}%, rgba(255,54,166,.22) 0deg 13deg, rgba(255,238,86,.24) 13deg 25deg, rgba(69,255,222,.22) 25deg 38deg, rgba(97,119,255,.2) 38deg 51deg, rgba(255,54,166,.22) 51deg 64deg)`;
  const prismBands = useMotionTemplate`linear-gradient(calc(${foilAngle}deg + 76deg), transparent 5%, rgba(255,70,190,.18) 13%, rgba(255,244,87,.3) 21%, rgba(88,255,221,.24) 31%, rgba(95,130,255,.22) 42%, transparent 55%, rgba(255,255,255,.2) 66%, transparent 76%), linear-gradient(calc(${foilAngle}deg - 34deg), transparent 16%, rgba(255,255,255,.12) 29%, rgba(255,255,255,.38) 36%, rgba(255,255,255,.08) 44%, transparent 62%)`;
  const softColor = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,.24), rgba(255,246,194,.16) 12%, rgba(103,224,255,.14) 26%, transparent 50%), conic-gradient(from ${foilAngle}deg at ${glareX}% ${glareY}%, rgba(255, 228, 119, .18), rgba(93, 220, 255, .17), rgba(255, 124, 214, .16), rgba(142, 111, 255, .15), rgba(255, 228, 119, .18))`;
  const gloss = useMotionTemplate`linear-gradient(calc(${foilAngle}deg - 52deg), transparent 10%, rgba(255,255,255,.1) 23%, rgba(255,255,255,.48) 33%, rgba(255,255,255,.14) 44%, transparent 60%), radial-gradient(ellipse at ${glareX}% ${glareY}%, rgba(255,255,255,.58) 0%, rgba(255,255,255,.22) 10%, rgba(255,255,255,0) 34%)`;
  const edgeShine = useMotionTemplate`linear-gradient(calc(${foilAngle}deg + 18deg), rgba(255,255,255,0), rgba(255,240,177,.28) 22%, rgba(255,255,255,0) 36%, rgba(112,220,255,.24) 58%, rgba(255,108,202,.18) 67%, rgba(255,255,255,0) 78%)`;
  const specular = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,.9) 0%, rgba(255,255,255,.48) 3.1%, rgba(255,246,194,.22) 8.5%, rgba(255,255,255,0) 24%)`;

  return (
    <>
      <motion.div className="foil foil-holo-color" style={{ background: holoColor, opacity: active ? 0.76 : 0.14 }} />
      <motion.div className="foil foil-prism-bands" style={{ background: prismBands, opacity: active ? 0.72 : 0.12 }} />
      <motion.div className="foil foil-soft-color" style={{ background: softColor, opacity: active ? 0.54 : 0.08 }} />
      <motion.div className="foil foil-gloss" style={{ background: gloss, opacity: active ? 0.72 : 0.16 }} />
      <motion.div className="foil foil-edge-shine" style={{ background: edgeShine, opacity: active ? 0.66 : 0.12 }} />
      <motion.div className="foil foil-specular" style={{ background: specular, opacity: active ? 0.58 : 0.12 }} />
      <div className="foil foil-holo-grain" />
      <div className="foil foil-sparkle" />
      <div className="foil foil-starbursts" />
      <div className="foil foil-vignette" />
    </>
  );
}
