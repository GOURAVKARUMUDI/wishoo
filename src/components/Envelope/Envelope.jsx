import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { randomBetween } from '../../utils/helpers.js';
import styles from './Envelope.module.css';

const SPARKLE_EMOJIS = ['🌸', '🌼', '🍃', '✨', '🤍'];

export default function Envelope({ onOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  const sparkles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: SPARKLE_EMOJIS[i % SPARKLE_EMOJIS.length],
      left: `${randomBetween(10, 90)}%`,
      top: `${randomBetween(10, 90)}%`,
      delay: `${randomBetween(0, 0.5)}s`,
      size: `${randomBetween(0.7, 1.4)}rem`,
    }));
  }, []);

  const handleTap = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => {
      if (onOpen) onOpen();
    }, 1500);
  };

  return (
    <motion.div
      className={styles.envelopeContainer}
      onClick={handleTap}
      animate={!isOpen ? { y: [0, -8, 0] } : {}}
      transition={!isOpen ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
      role="button"
      tabIndex={0}
      aria-label="Tap to open envelope"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTap(); }}
    >
      <div className={styles.envelope}>
        <div className={styles.envelopeBody} />
        <div className={`${styles.flap} ${isOpen ? styles.flapOpen : ''}`} />
        <div className={`${styles.letter} ${isOpen ? styles.letterSlide : ''}`}>
          <div className={styles.letterLines}>
            <div className={styles.line} />
            <div className={styles.line} />
            <div className={styles.line} />
            <div className={styles.line} />
          </div>
          <span className={styles.letterContent}>For Mahii 🌸</span>
        </div>
      </div>

      {isOpen && (
        <div className={styles.sparkles} aria-hidden="true">
          {sparkles.map((s) => (
            <span
              key={s.id}
              className={styles.sparkle}
              style={{
                left: s.left,
                top: s.top,
                animationDelay: s.delay,
                fontSize: s.size,
              }}
            >
              {s.emoji}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
