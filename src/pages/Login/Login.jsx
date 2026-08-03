import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { IoLockClosedOutline, IoLockOpenOutline, IoArrowForward, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import AnimatedButton from '../../components/AnimatedButton/AnimatedButton.jsx';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles.jsx';
import styles from './Login.module.css';

export default function Login({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (isUnlocking) return;

    const trimmed = password.trim();
    if (!trimmed) {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      // Attempt Vercel Serverless Function validation
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setError(false);
          setIsUnlocking(true);
          sessionStorage.setItem('mahii-unlocked', 'true');
          if (data.token) {
            sessionStorage.setItem('mahii-session-token', data.token);
          }
          setTimeout(() => {
            if (onUnlock) onUnlock();
          }, 1000);
          return;
        }
      }

      // If API returned 401 or non-OK JSON
      if (response.status === 401) {
        setError(true);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
    } catch (err) {
      // Fallback for static dev environment where Vercel function server is offline
      if (trimmed.toLowerCase() === 'mahii') {
        setError(false);
        setIsUnlocking(true);
        sessionStorage.setItem('mahii-unlocked', 'true');
        setTimeout(() => {
          if (onUnlock) onUnlock();
        }, 1000);
        return;
      }
    }

    setError(true);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, [password, isUnlocking, onUnlock]);

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <FloatingParticles count={14} />

      <motion.div
        className={`${styles.card} ${error ? styles.cardError : ''}`}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{
          opacity: isUnlocking ? 0 : 1,
          scale: isUnlocking ? 1.05 : 1,
          y: isUnlocking ? -20 : 0,
          x: shake ? [0, -12, 12, -12, 12, 0] : 0,
        }}
        transition={
          shake
            ? { duration: 0.4 }
            : { type: 'spring', stiffness: 220, damping: 20 }
        }
      >
        <motion.div
          className={styles.lockIconWrapper}
          animate={isUnlocking ? { scale: [1, 1.2, 1], rotate: [0, 15, 0] } : {}}
          transition={{ duration: 0.6 }}
        >
          {isUnlocking ? (
            <IoLockOpenOutline style={{ color: 'var(--color-primary-dark)' }} />
          ) : (
            <IoLockClosedOutline style={{ color: 'var(--text-primary)' }} />
          )}
        </motion.div>

        <div className={styles.header}>
          <h1 className={styles.title}>Private Space</h1>
          <p className={styles.subtitle}>
            This little corner was made for someone special.
            <br />
            Please enter the access code to continue.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              placeholder="Enter Access Code"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              disabled={isUnlocking}
              autoFocus
            />
            <button
              type="button"
              className={styles.eyeToggle}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide access code' : 'Show access code'}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>

          {error && (
            <motion.p
              className={styles.errorMessage}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Incorrect access code. Please try again.
            </motion.p>
          )}

          <div className={styles.buttonWrapper}>
            <AnimatedButton
              type="submit"
              fullWidth
              shimmer
              icon={<IoArrowForward />}
              disabled={isUnlocking}
            >
              {isUnlocking ? 'Unlocking...' : 'Continue'}
            </AnimatedButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
