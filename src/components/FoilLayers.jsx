import React from 'react';
import { motion, useTransform } from 'framer-motion';

// Fixed textures move under the light instead of rebuilding gradients every frame.
export default function FoilLayers({ glareX, glareY, compact = false }) {
  const x = useTransform(glareX, [8, 92], ['-16%', '16%']);
  const y = useTransform(glareY, [8, 92], ['-12%', '12%']);
  const reverseX = useTransform(glareX, [8, 92], ['12%', '-12%']);
  const reverseY = useTransform(glareY, [8, 92], ['9%', '-9%']);
  const lightX = useTransform(glareX, [8, 92], ['-28%', '28%']);
  const lightY = useTransform(glareY, [8, 92], ['-24%', '24%']);

  return (
    <div className={'foil-surface ' + (compact ? 'foil-compact' : '')} aria-hidden="true">
      <motion.div className="foil foil-spectrum" style={{ x, y }} />
      <motion.div className="foil foil-etching" style={{ x: reverseX, y: reverseY }} />
      <motion.div className="foil foil-reflection" style={{ x: lightX, y: lightY }} />
    </div>
  );
}
