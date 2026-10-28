import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Scissors } from 'lucide-react';
import './styles.css';
import BoosterPack from './components/BoosterPack';
import DigitalCard from './components/DigitalCard';
import profileImg from './assets/profile_img.jpg';

function App() {
  const [opened, setOpened] = useState(false);
  const [bursting, setBursting] = useState(false);
  const reducedMotion = useReducedMotion();
  const [motionReady, setMotionReady] = useState(false);
  const [permissionState, setPermissionState] = useState('idle');

  useEffect(() => {
    // Warm the portrait cache while the visitor inspects the sealed pack.
    const portrait = new Image();
    portrait.src = profileImg;
  }, []);

  useEffect(() => {
    if (!bursting) return;
    const timer = window.setTimeout(() => setBursting(false), reducedMotion ? 250 : 1900);
    return () => window.clearTimeout(timer);
  }, [bursting, reducedMotion]);

  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vvh', `${window.visualViewport?.height || window.innerHeight}px`);
      document.documentElement.style.setProperty('--vvw', `${window.visualViewport?.width || window.innerWidth}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    window.visualViewport?.addEventListener('resize', setVh);
    window.visualViewport?.addEventListener('scroll', setVh);
    return () => {
      window.removeEventListener('resize', setVh);
      window.visualViewport?.removeEventListener('resize', setVh);
      window.visualViewport?.removeEventListener('scroll', setVh);
    };
  }, []);

  const requestMotion = async () => {
    try {
      setPermissionState('requesting');
      const DeviceOrientationEventWithPermission = window.DeviceOrientationEvent;
      if (!DeviceOrientationEventWithPermission || !window.isSecureContext) {
        setPermissionState('unavailable');
        return;
      }
      if (DeviceOrientationEventWithPermission?.requestPermission) {
        const permission = await DeviceOrientationEventWithPermission.requestPermission();
        if (permission !== 'granted') {
          setPermissionState('denied');
          return;
        }
      }
      setPermissionState('granted');
      setMotionReady(true);
    } catch (error) {
      console.error(error);
      setPermissionState('denied');
    }
  };

  const ctaText = useMemo(() => {
    if (permissionState === 'requesting') return 'Requesting tilt...';
    if (permissionState === 'unavailable') return 'Tilt unavailable — touch the foil';
    if (permissionState === 'denied') return 'Tilt blocked - touch foil still works';
    if (motionReady) return 'Phone tilt foil enabled';
    return 'Enable phone tilt foil';
  }, [permissionState, motionReady]);

  return (
    <main className={`experience ${opened ? 'is-opened' : ''}`}>
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="grain" />

      {bursting && <div className="reveal-burst" aria-hidden="true">
        <div className="burst-halo" /><div className="burst-rays" />
        <div className="burst-ring" /><div className="burst-core" />
        {Array.from({ length: 12 }, (_, index) => <i className="burst-mote" key={index}
          style={{ '--angle': `${index * 30 + 8}deg`, '--travel': `${140 + (index % 3) * 65}px`, '--delay': `${index % 4 * 35}ms` }} />)}
      </div>}
      <span className="sr-only" role="status">{opened ? 'Ultra rare card revealed. Move across the card to inspect its foil.' : bursting ? 'The seal is broken. Revealing your card.' : ''}</span>
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.section
            key="pack"
            className="screen pack-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.12 }}
          >
            <BoosterPack onOpening={() => setBursting(true)} onOpened={() => setOpened(true)} />
          </motion.section>
        ) : (
          <motion.section
            key="card"
            className="screen reveal-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DigitalCard motionReady={motionReady} />
            <div className="floating-controls">
              <button className="tilt-control" onClick={requestMotion} disabled={motionReady || permissionState === 'requesting' || reducedMotion}>
                {reducedMotion ? 'Reduced motion enabled' : ctaText}
              </button>
              <span className="inspect-hint">Move to inspect the foil</span>
              <button className="ghost" onClick={() => { setBursting(false); setOpened(false); }}>
                <Scissors size={15} /> Repack
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
