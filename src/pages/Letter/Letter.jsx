import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowForward } from 'react-icons/io5';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import AnimatedButton from '../../components/AnimatedButton/AnimatedButton.jsx';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles.jsx';
import { LETTER_CONTENT } from '../../utils/constants.js';
import styles from './Letter.module.css';

export default function Letter() {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState([]);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);

  const typeNextChar = useCallback(() => {
    const paragraphs = LETTER_CONTENT.paragraphs;
    if (currentParagraph >= paragraphs.length) {
      setIsTypingDone(true);
      return;
    }
    const text = paragraphs[currentParagraph];
    if (currentChar < text.length) {
      setDisplayedText((prev) => {
        const newArr = [...prev];
        newArr[currentParagraph] = (newArr[currentParagraph] || '') + text[currentChar];
        return newArr;
      });
      setCurrentChar((c) => c + 1);
    } else {
      setCurrentParagraph((p) => p + 1);
      setCurrentChar(0);
    }
  }, [currentParagraph, currentChar]);

  useEffect(() => {
    if (isTypingDone) return;
    const speed = currentChar === 0 ? 300 : 25;
    const timer = setTimeout(typeNextChar, speed);
    return () => clearTimeout(timer);
  }, [typeNextChar, isTypingDone, currentChar]);

  const handleSkipTyping = useCallback(() => {
    if (!isTypingDone) {
      setDisplayedText([...LETTER_CONTENT.paragraphs]);
      setIsTypingDone(true);
    }
  }, [isTypingDone]);

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.background} />
        <FloatingParticles count={15} />

        <span className={`${styles.decorFlower} ${styles.flower1}`} aria-hidden="true">🌸</span>
        <span className={`${styles.decorFlower} ${styles.flower2}`} aria-hidden="true">🍃</span>

        <motion.div
          className={styles.letterCard}
          initial={{ opacity: 0, y: 30, rotateZ: -1 }}
          animate={{ opacity: 1, y: 0, rotateZ: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
          onClick={handleSkipTyping}
          role="article"
          aria-label="Handwritten letter content"
        >
          <div className={styles.paperTexture} aria-hidden="true" />

          <motion.h2
            className={styles.greeting}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            {LETTER_CONTENT.greeting}
          </motion.h2>

          <div className={styles.body} aria-live="polite">
            {displayedText.map((text, i) => (
              <p key={i} className={styles.paragraph}>
                {text}
                {i === currentParagraph && !isTypingDone && <span className={styles.cursor} aria-hidden="true" />}
              </p>
            ))}
            {currentParagraph === 0 && displayedText.length === 0 && (
              <p className={styles.paragraph}>
                <span className={styles.cursor} aria-hidden="true" />
              </p>
            )}
          </div>

          {isTypingDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className={styles.closing}>{LETTER_CONTENT.closing}</p>
              <p className={styles.signature}>{LETTER_CONTENT.signature}</p>
            </motion.div>
          )}
        </motion.div>

        {isTypingDone ? (
          <motion.div
            className={styles.buttonContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <AnimatedButton onClick={() => navigate('/balloons')} shimmer icon={<IoArrowForward />}>
              Continue
            </AnimatedButton>
          </motion.div>
        ) : (
          <p className={styles.skipHint} style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '8px', opacity: 0.7 }}>
            Tap letter to reveal all 🌸
          </p>
        )}
      </div>
    </PageTransition>
  );
}
