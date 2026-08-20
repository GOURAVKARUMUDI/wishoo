import { useEffect, useMemo, useState } from 'react';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { IoBulbOutline, IoSparkles, IoHeart, IoReload } from 'react-icons/io5';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import ThreeBirthdayCake from '../../components/ThreeBirthdayCake/ThreeBirthdayCake.jsx';
import { BIRTHDAY_YEAR } from '../../config/birthdayConfig.js';
import styles from './BirthdayFinal.module.css';

const BIRTHDAY_AGE = Math.max(1, new Date().getFullYear() - parseInt(BIRTHDAY_YEAR, 10));

const balloons = Array.from({ length: 38 }, (_, i) => ({
  left: `${2 + ((i * 29) % 96)}%`,
  delay: `${(i % 12) * .16}s`,
  duration: `${5 + (i % 5)}s`,
  color: ['#d8b56b', '#f1c7d1', '#d2dfbb', '#b9d5e7', '#d8c5e7', '#fff0c8'][i % 6],
}));

const lights = Array.from({ length: 30 }, (_, i) => i);

export default function BirthdayFinal() {
  const [power, setPower] = useState(false);
  const [stage, setStage] = useState(0);
  const [again, setAgain] = useState(0);

  useEffect(() => {
    if (!power) return undefined;
    setStage(1);
    const timers = [
      setTimeout(() => setStage(2), 1100),
      setTimeout(() => setStage(3), 2500),
      setTimeout(() => setStage(4), 3900),
      setTimeout(() => setStage(5), 6100),
    ];
    return () => timers.forEach(clearTimeout);
  }, [power, again]);

  const turnEverythingOff = () => {
    setPower(false);
    setStage(0);
  };

  const celebrateAgain = () => {
    setStage(0);
    setAgain((v) => v + 1);
    setPower(true);
  };

  const confettiPieces = useMemo(() => power && stage >= 3, [power, stage]);

  return (
    <PageTransition>
      <main className={`${styles.page} ${power ? styles.powered : ''}`}>
        <div className={styles.goldVignette} />

        <div className={styles.lightString} aria-hidden="true">
          {lights.map((light) => <span key={light} style={{ '--i': light }} />)}
        </div>

        {confettiPieces && (
          <Confetti
            key={`confetti-${again}`}
            recycle={stage >= 4}
            numberOfPieces={stage >= 4 ? 1100 : 650}
            gravity={.14}
            initialVelocityY={-18}
            tweenDuration={7000}
          />
        )}

        <AnimatePresence>
          {stage >= 4 && (
            <motion.div className={styles.balloonLayer} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {balloons.map((b, i) => (
                <span key={i} className={styles.balloon} style={{ '--left': b.left, '--delay': b.delay, '--duration': b.duration, '--balloon': b.color }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <section className={styles.content}>
          {!power ? (
            <motion.div className={styles.switchIntro} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className={styles.eyebrow}>06 • THE LAST SURPRISE</span>
              <div className={styles.lockedSparkle}><IoSparkles /></div>
              <h1>One Last Thing, Mahii.</h1>
              <p>Everything you've seen so far was only the journey. The final celebration is waiting in the dark.</p>
              <div className={styles.switchBox}>
                <span>Turn on the celebration</span>
                <button className={styles.goldSwitch} onClick={() => setPower(true)} aria-label="Turn on the final birthday celebration">
                  <span className={styles.switchKnob}><IoBulbOutline /></span>
                </button>
              </div>
              <small>Flip the little golden switch ✨</small>
            </motion.div>
          ) : (
            <motion.div className={styles.celebration} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.span className={styles.eyebrow} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>THE FINAL BIRTHDAY CELEBRATION</motion.span>

              <AnimatePresence mode="wait">
                {stage === 1 && (
                  <motion.div key="lights" className={styles.stageMessage} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <IoBulbOutline /><span>The lights are on…</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {stage >= 2 && (
                <motion.div className={styles.finalCake} initial={{ opacity: 0, y: 45, scale: .72 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.15, ease: [0.22, 1, .36, 1] }}>
                  <div className={styles.grandCakeHalo} />
                  <ThreeBirthdayCake variant="grand" />
                </motion.div>
              )}

              {stage >= 3 && <motion.div className={styles.confettiTitle} initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 150 }}>🎉 IT'S YOUR DAY! 🎉</motion.div>}

              {stage >= 4 && (
                <motion.div className={styles.finalWords} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h1>Happy Birthday, Mahii. 🤍</h1>
                  <p>May you enjoy this birthday to the absolute maximum — every laugh, every photo, every little moment, and every beautiful thing this year brings you.</p>
                </motion.div>
              )}

              {stage >= 5 && (
                <motion.div className={styles.notes} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={styles.thankYou}><IoHeart /><div><strong>A little thank you.</strong><p>Thank you for being you, for the trust, the conversations, the laughter, and all the little moments that made this worth creating.</p></div></div>
                  <div className={styles.gestureNote}><span>ONE LAST LITTLE GESTURE 🌼</span><p className={styles.maxxLine}>Enjoy your birthday to the maxx. 🎂✨</p><p>Now stop thinking about this website and go make memories, smile a lot, eat something amazing, take too many pictures, and let yourself have the happiest day possible.</p></div>
                  <div className={styles.signature}>With all the warmth,<br /><b>— Tinku 🌼</b></div>
                  <button className={styles.replay} onClick={celebrateAgain}><IoReload /> Light it up again</button>
                  <button className={styles.offButton} onClick={turnEverythingOff}>Turn the lights off</button>
                </motion.div>
              )}
            </motion.div>
          )}
        </section>
      </main>
    </PageTransition>
  );
}
