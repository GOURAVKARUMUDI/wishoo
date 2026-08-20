import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowForward } from 'react-icons/io5';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import AnimatedButton from '../../components/AnimatedButton/AnimatedButton.jsx';
import FloatingHearts from '../../components/FloatingHearts/FloatingHearts.jsx';
import { COMPLIMENT_CARDS } from '../../utils/constants.js';
import styles from './Compliments.module.css';

const cardVariants = {
  enter: (dir) => ({ x: dir > 0 ? 350 : -350, opacity: 0, rotateY: dir > 0 ? 15 : -15 }),
  center: { x: 0, opacity: 1, rotateY: 0 },
  exit: (dir) => ({ x: dir < 0 ? 350 : -350, opacity: 0, rotateY: dir < 0 ? 15 : -15 }),
};

export default function Compliments() {
  const navigate = useNavigate();
  const [[current, direction], setCurrent] = useState([0, 0]);

  const paginate = useCallback((newDir) => {
    setCurrent(([prev]) => {
      const next = prev + newDir;
      if (next < 0 || next >= COMPLIMENT_CARDS.length) return [prev, 0];
      return [next, newDir];
    });
  }, []);

  const handleDragEnd = useCallback((e, info) => {
    if (info.offset.x > 80) paginate(-1);
    else if (info.offset.x < -80) paginate(1);
  }, [paginate]);

  const card = COMPLIMENT_CARDS[current];

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.background} />
        <FloatingHearts count={8} />

        <div className={styles.header}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Things You Should Know, Mahii 🌼
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            A few honest words
          </motion.p>
        </div>

        <div className={styles.cardsContainer}>
          <div className={styles.cardWrapper}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current}
                className={styles.card}
                style={{ background: card.gradient }}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
              >
                <div className={styles.cardShine} aria-hidden="true" />
                <motion.span
                  className={styles.cardEmoji}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  aria-hidden="true"
                >
                  {card.emoji}
                </motion.span>
                <motion.p
                  className={styles.cardText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {card.text}
                </motion.p>
                <span className={styles.cardNumber}>{current + 1} / {COMPLIMENT_CARDS.length}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.indicators}>
          {COMPLIMENT_CARDS.map((_, i) => (
            <button
              key={i}
              className={`${styles.indicator} ${i === current ? styles.indicatorActive : ''}`}
              onClick={() => setCurrent([i, i > current ? 1 : -1])}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>

        <motion.p
          className={styles.swipeHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Swipe left or right 👆
        </motion.p>

        <motion.div
          className={styles.buttonContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <AnimatedButton onClick={() => navigate('/celebration')} shimmer icon={<IoArrowForward />}>
            Final Letter
          </AnimatedButton>
        </motion.div>
      </div>
    </PageTransition>
  );
}
