import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowForward } from 'react-icons/io5';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import AnimatedButton from '../../components/AnimatedButton/AnimatedButton.jsx';
import { BALLOON_MESSAGES } from '../../utils/constants.js';
import { randomBetween } from '../../utils/helpers.js';
import styles from './Balloon.module.css';

export default function Balloon() {
  const navigate = useNavigate();
  const [popped, setPopped] = useState(new Set());
  const [currentMessage, setCurrentMessage] = useState(null);
  const [popParticles, setPopParticles] = useState([]);

  const balloons = useMemo(() => {
    return BALLOON_MESSAGES.map((msg, i) => ({
      ...msg,
      id: i,
      x: randomBetween(10, 75),
      y: randomBetween(5, 70),
      floatDelay: randomBetween(0, 2),
      floatDuration: randomBetween(2.5, 4),
      size: randomBetween(0.9, 1.2),
    }));
  }, []);

  const handlePop = useCallback((balloon, e) => {
    if (popped.has(balloon.id)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const particles = Array.from({ length: 8 }, (_, i) => ({
      id: `${balloon.id}-${i}`,
      x: cx,
      y: cy,
      tx: `${randomBetween(-60, 60)}px`,
      ty: `${randomBetween(-60, 60)}px`,
      color: balloon.color,
    }));
    setPopParticles(particles);
    setTimeout(() => setPopParticles([]), 700);

    setPopped((prev) => new Set([...prev, balloon.id]));
    setCurrentMessage(balloon.text);
    setTimeout(() => setCurrentMessage(null), 2000);
  }, [popped]);

  const allPopped = popped.size === balloons.length;

  useEffect(() => {
    if (allPopped) {
      const timer = setTimeout(() => navigate('/scratch'), 2500);
      return () => clearTimeout(timer);
    }
  }, [allPopped, navigate]);

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            A Few Things I Want You to Know 🎈
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Pop each one gently
          </motion.p>
        </div>

        <div className={styles.balloonArea}>
          <AnimatePresence>
            {balloons.map((b) =>
              !popped.has(b.id) ? (
                <motion.button
                  key={b.id}
                  className={styles.balloon}
                  style={{
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                  }}
                  onClick={(e) => handlePop(b, e)}
                  initial={{ opacity: 0, scale: 0, y: 50 }}
                  animate={{
                    opacity: 1,
                    scale: b.size,
                    y: [0, -12, 0],
                    rotate: [-3, 3, -3],
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    opacity: { duration: 0.4, delay: b.floatDelay * 0.3 },
                    scale: { duration: 0.4, delay: b.floatDelay * 0.3 },
                    y: {
                      duration: b.floatDuration,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: b.floatDelay,
                    },
                    rotate: {
                      duration: b.floatDuration * 1.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: b.floatDelay,
                    },
                  }}
                  whileHover={{ scale: b.size * 1.15 }}
                  whileTap={{ scale: b.size * 0.9 }}
                  aria-label={`Pop balloon ${b.id + 1}`}
                >
                  <div className={styles.balloonBody} style={{ backgroundColor: b.color, borderTopColor: b.color }}>
                    <div className={styles.balloonShine} />
                  </div>
                  <div className={styles.balloonString} />
                </motion.button>
              ) : null
            )}
          </AnimatePresence>

          {popParticles.length > 0 && (
            <div className={styles.popParticles} aria-hidden="true">
              {popParticles.map((p) => (
                <div
                  key={p.id}
                  className={styles.popParticle}
                  style={{
                    left: p.x,
                    top: p.y,
                    backgroundColor: p.color,
                    '--tx': p.tx,
                    '--ty': p.ty,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {currentMessage && (
            <motion.div
              className={styles.message}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <p className={styles.messageText}>{currentMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className={styles.counter}>
          {popped.size} / {balloons.length} popped
        </p>

        {allPopped && (
          <motion.div
            className={styles.allPopped}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className={styles.allPoppedText}>That’s everything I wanted to say 🌸</p>
            <AnimatedButton onClick={() => navigate('/scratch')} shimmer icon={<IoArrowForward />}>
              Continue
            </AnimatedButton>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
