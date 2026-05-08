import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import { Scissors } from 'lucide-react';
import './styles.css';
import BoosterPack from './components/BoosterPack';
import DigitalCard from './components/DigitalCard';

function App() {
  const [opened, setOpened] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const [permissionState, setPermissionState] = useState('idle');

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
    if (permissionState === 'denied') return 'Tilt blocked - touch foil still works';
    if (motionReady) return 'Phone tilt foil enabled';
    return 'Enable phone tilt foil';
  }, [permissionState, motionReady]);

  return (
    <main className={`experience ${opened ? 'is-opened' : ''}`}>
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="grain" />

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.section
            key="pack"
            className="screen pack-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
            transition={{ duration: 0.35 }}
          >
            <BoosterPack onOpened={() => setOpened(true)} />
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
              <button onClick={requestMotion} disabled={motionReady || permissionState === 'requesting'}>
                {ctaText}
              </button>
              <button className="ghost" onClick={() => setOpened(false)}>
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
