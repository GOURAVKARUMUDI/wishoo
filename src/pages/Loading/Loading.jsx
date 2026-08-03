import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoLockClosedOutline } from 'react-icons/io5';
import styles from './Loading.module.css';

export default function Loading({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`${styles.bgCircle} ${styles.bgCircle1}`} aria-hidden="true" />
      <div className={`${styles.bgCircle} ${styles.bgCircle2}`} aria-hidden="true" />
      <div className={`${styles.bgCircle} ${styles.bgCircle3}`} aria-hidden="true" />

      <div className={styles.content}>
        <motion.div
          className={styles.logo}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          aria-hidden="true"
        >
          <IoLockClosedOutline style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }} />
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Loading
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Preparing private space...
        </motion.p>

        <motion.div
          className={styles.loader}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          role="status"
          aria-label="Loading"
        >
          <div className={styles.dot} />
          <div className={styles.dot} />
          <div className={styles.dot} />
        </motion.div>
      </div>
    </motion.div>
  );
}
