import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowForward } from 'react-icons/io5';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import AnimatedButton from '../../components/AnimatedButton/AnimatedButton.jsx';
import { randomBetween } from '../../utils/helpers.js';
import styles from './Celebration.module.css';

const MESSAGE_LINES = [
  'I don\'t know where life will take either of us.',
  'Maybe our paths will stay close.',
  'Maybe they\'ll become different.',
  'Life has its own plans.',
  '',
  'But one thing I know for sure...',
  'I\'m genuinely grateful that our paths crossed.',
  '',
  'Thank you for trusting me.',
  'Thank you for sharing parts of your life with me.',
  'Thank you for making me feel that our friendship is something worth protecting.',
  '',
  'I don\'t expect anything.',
  'I don\'t want to change anything.',
  '',
  'I just hope life becomes a little kinder to you.',
  'I hope you smile more.',
  'I hope you worry less.',
  '',
  'And I hope that no matter where life takes us...',
  'you never lose the wonderful person you already are.',
];

export default function Celebration() {
  const navigate = useNavigate();
  // step: 0 = Final Letter, 1 = Thank You Screen
  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const petals = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: `${randomBetween(5, 95)}%`,
      delay: `${randomBetween(0, 7)}s`,
      duration: `${randomBetween(8, 15)}s`,
      size: `${randomBetween(1, 1.8)}rem`,
      emoji: ['🌸', '🌼', '🍃', '✨', '☁️'][i % 5],
    }));
  }, []);

  const handleContinue = useCallback(() => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        navigate('/birthday');
      }, 2000);
    }
  }, [step, navigate]);

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.glow} aria-hidden="true" />

        <div className={styles.petalContainer} aria-hidden="true">
          {petals.map((p) => (
            <span
              key={p.id}
              className={styles.petal}
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                fontSize: p.size,
              }}
            >
              {p.emoji}
            </span>
          ))}
        </div>

        {/* White fade transition overlay before Birthday Epilogue */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              style={{
                position: 'fixed',
                inset: 0,
                background: '#FAF7F2',
                zIndex: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '12px',
                padding: '24px',
                textAlign: 'center',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            >
              <motion.span
                style={{ fontSize: '2.5rem' }}
                animate={{ scale: [0.8, 1.2, 1], opacity: [0.5, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🌸
              </motion.span>
              <motion.p
                style={{
                  fontFamily: 'var(--font-handwriting)',
                  fontSize: 'var(--text-2xl)',
                  color: 'var(--text-primary)',
                  lineHeight: '1.4',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                One chapter ends...
                <br />
                Another beautiful chapter is waiting.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="final-letter"
              className={styles.content}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className={styles.headerEmoji}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                aria-hidden="true"
              >
                🌸
              </motion.div>

              <motion.h1
                className={styles.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Thank You, Mahii 🌼
              </motion.h1>

              <div className={styles.messageBlock}>
                {MESSAGE_LINES.map((line, i) => (
                  <motion.p
                    key={i}
                    className={line === '' ? styles.messageBreak : styles.message}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              <motion.p
                className={styles.closingText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + MESSAGE_LINES.length * 0.15 + 0.3 }}
              >
                Take care, Mahii. Always.
              </motion.p>

              <motion.p
                className={styles.signature}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + MESSAGE_LINES.length * 0.15 + 0.6 }}
              >
                — Tinku 🤍
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="thank-you-screen"
              className={styles.closingContent}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2
                className={styles.closingTitle}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Thank you for reading, Mahii 🌼
              </motion.h2>

              <motion.p
                className={styles.closingSubtitle}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                Keep smiling. Always.
              </motion.p>

              <motion.p
                className={styles.closingSignature}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.4, duration: 0.8 }}
              >
                — Tinku 🤍
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User-Controlled Next Button - Always Visible */}
        <motion.div
          className={styles.buttonContainer}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AnimatedButton
            onClick={handleContinue}
            shimmer
            icon={<IoArrowForward />}
          >
            {step === 0 ? 'Continue' : 'One More Surprise... 🎂'}
          </AnimatedButton>
        </motion.div>
      </div>
    </PageTransition>
  );
}
