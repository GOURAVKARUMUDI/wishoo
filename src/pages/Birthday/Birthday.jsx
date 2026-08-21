import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { IoLockOpenOutline, IoSparklesOutline } from 'react-icons/io5';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles.jsx';
import { getBirthdayTargetDate, getFormattedBirthdayDate } from '../../config/birthdayConfig.js';
import styles from './Birthday.module.css';
import popUrl from '../../assets/music/pop.mp3';

const balloons = Array.from({ length: 28 }, (_, i) => ({ id: i, left: `${3 + ((i * 37) % 94)}%`, delay: `${(i % 9) * .18}s`, duration: `${6 + (i % 5)}s`, hue: ['#d9d2e9','#b8cbb8','#a8c5d8','#e8dcc8','#d4b483','#f0c7d4'][i % 6] }));

function getTimeLeft() {
  const now = new Date();
  let target = getBirthdayTargetDate();
  if (now >= target) return { days: 0, hours: 0, minutes: 0, seconds: 0, reached: true };
  const diff = target - now;
  return { days: Math.floor(diff / 86400000), hours: Math.floor(diff / 3600000) % 24, minutes: Math.floor(diff / 60000) % 60, seconds: Math.floor(diff / 1000) % 60, reached: false };
}


export default function Birthday() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const [celebrating, setCelebrating] = useState(false);
  const isDev = import.meta.env.DEV;
  const canSkip = isDev || sessionStorage.getItem('wishoo-role') === 'tinku-dev' || sessionStorage.getItem('wishoo-dev-skip') === 'true';
  const reached = timeLeft.reached;

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 250);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (reached) setCelebrating(true);
  }, [reached]);

  useEffect(() => {
    if (celebrating) {
      const popAudio = new Audio(popUrl);
      popAudio.volume = 0.5;
      popAudio.play().catch((err) => console.log('Celebration sound play prevented:', err));
    }
  }, [celebrating]);

  const handleDevSkip = () => {
    if (!canSkip) return;
    setCelebrating(true);
  };

  const countdown = useMemo(() => [
    ['DAYS', timeLeft.days], ['HOURS', timeLeft.hours], ['MINUTES', timeLeft.minutes], ['SECONDS', timeLeft.seconds],
  ], [timeLeft]);

  return (
    <PageTransition>
      <div className={`${styles.container} ${celebrating ? styles.celebrationMode : ''}`}>
        <div className={styles.background} />
        <FloatingParticles count={celebrating ? 24 : 14} />
        <AnimatePresence>
          {celebrating && <Confetti recycle numberOfPieces={450} gravity={0.16} initialVelocityY={-20} tweenDuration={5000} />}
        </AnimatePresence>
        {celebrating && <div className={styles.balloonLayer}>{balloons.map((b) => <span key={b.id} className={styles.balloon} style={{ '--left': b.left, '--delay': b.delay, '--duration': b.duration, '--balloon': b.hue }} />)}</div>}

        <div className={styles.content}>
          <AnimatePresence mode="wait">
            {!celebrating ? (
              <motion.div key="countdown" className={styles.countdownView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <span className={styles.eyebrow}>THE LAST FEW MOMENTS</span>
                <h1>Mahii's Birthday</h1>
                <p className={styles.subtitle}>Something made just for you is waiting on the other side.</p>
                <div className={styles.countdownGrid}>{countdown.map(([label, value]) => <div className={styles.countdownCard} key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>
                <p className={styles.signature}>— Tinku 🌼</p>
                {canSkip && (
                  <motion.button
                    type="button"
                    className={styles.devSkip}
                    onClick={handleDevSkip}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: .97 }}
                  >
                    DEV MODE · Skip to Birthday Reveal
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div key="celebration" className={styles.reveal} initial={{ opacity: 0, scale: .92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .9, ease: [0.22,1,0.36,1] }}>
                <motion.div className={styles.sparkleIcon} animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}><IoSparklesOutline /></motion.div>
                <span className={styles.eyebrow}>{getFormattedBirthdayDate()}</span>
                <h1>It's finally your day! 🎂</h1>

                <p>Happy Birthday, Mahii. The countdown is over. Now the real celebration begins.</p>
                <motion.button className={styles.unlockButton} onClick={() => navigate('/birthday/unlock')} whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}>
                  <IoLockOpenOutline /> Unlock Your Birthday
                </motion.button>
                <span className={styles.tapNote}>There are a few little surprises waiting inside ✨</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
