import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoRefresh } from 'react-icons/io5';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import AnimatedButton from '../../components/AnimatedButton/AnimatedButton.jsx';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles.jsx';
import styles from './Birthday.module.css';

function getTargetDate() {
  const now = new Date();
  const currentYear = now.getFullYear();
  let target = new Date(currentYear, 7, 22, 0, 0, 0); // August 22 (Month index 7)
  if (now.getTime() > target.getTime()) {
    target = new Date(currentYear + 1, 7, 22, 0, 0, 0);
  }
  return target;
}

function calculateTimeLeft() {
  const diff = getTargetDate().getTime() - new Date().getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isBirthday: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isBirthday: false,
  };
}

export default function Birthday() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  const [showClosingNote, setShowClosingNote] = useState(false);

  // Live Countdown Timer updating every 1000ms with interval cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Soft note fading in after 3 seconds of reading
  useEffect(() => {
    const noteTimer = setTimeout(() => setShowClosingNote(true), 3000);
    return () => clearTimeout(noteTimer);
  }, []);

  const handleReadAgain = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.background} />
        <FloatingParticles count={16} />

        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              🎂 Mahii's Birthday Countdown
            </motion.h1>

            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              August 22
            </motion.p>
          </div>

          {/* Live Countdown: 4 Glass Cards OR Birthday Reached Banner */}
          {timeLeft.isBirthday ? (
            <motion.div
              className={styles.birthdayBanner}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h2 className={styles.birthdayTitle}>🎉 Happy Birthday, Mahii! 🌼</h2>
            </motion.div>
          ) : (
            <motion.div
              className={styles.countdownGrid}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            >
              <div className={styles.countdownCard}>
                <span className={styles.countdownNumber}>
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className={styles.countdownLabel}>DAYS</span>
              </div>

              <div className={styles.countdownCard}>
                <span className={styles.countdownNumber}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className={styles.countdownLabel}>HOURS</span>
              </div>

              <div className={styles.countdownCard}>
                <span className={styles.countdownNumber}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className={styles.countdownLabel}>MINUTES</span>
              </div>

              <div className={styles.countdownCard}>
                <span className={styles.countdownNumber}>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className={styles.countdownLabel}>SECONDS</span>
              </div>
            </motion.div>
          )}

          {/* Birthday Preview Message Card */}
          <motion.div
            className={styles.messageCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className={styles.messageHeading}>Mahii... 🌼</p>
            <p className={styles.messageBody}>
              This wasn't the end.
              <br /><br />
              I'm still preparing something special for your birthday.
              <br /><br />
              This is just a little promise that something even more meaningful is on its way.
              <br /><br />
              See you on August 22. 🤍
            </p>
          </motion.div>

          {/* Read Everything Again Button */}
          <motion.div
            className={styles.buttonContainer}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <AnimatedButton onClick={handleReadAgain} shimmer icon={<IoRefresh />}>
              Read Everything Again
            </AnimatedButton>
          </motion.div>

          {/* Handwritten Closing Note */}
          <AnimatePresence>
            {showClosingNote && (
              <motion.div
                className={styles.closingNote}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
              >
                <p className={styles.closingNoteText}>
                  Until then... keep smiling, Mahii. 🌼
                </p>
                <p className={styles.closingNoteSig}>— Tinku 🤍</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
