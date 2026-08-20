import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { IoArrowForward, IoLockClosedOutline, IoLockOpenOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../../components/AnimatedButton/AnimatedButton.jsx';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles.jsx';
import { isBirthdayReached } from '../../config/birthdayConfig.js';
import styles from './Login.module.css';

function birthdayChapterIsOpen() {
  return isBirthdayReached();
}

export default function Login({ onUnlock }) {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('That doesn\'t seem right. Try again 🤍');
  const [unlocking, setUnlocking] = useState(false);
  const isDev = import.meta.env.DEV;

  const saveSession = (data) => {
    sessionStorage.setItem('mahii-unlocked', 'true');
    sessionStorage.setItem('wishoo-session-token', data.token || '');
    sessionStorage.setItem('wishoo-role', data.role || 'mahii');
    sessionStorage.setItem('wishoo-dev-skip', data.devSkip ? 'true' : 'false');
    onUnlock?.(data);
  };

  const openBirthdayCountdown = useCallback(async () => {
    const role = 'tinku-dev';
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'tinku' }),
      });
      const data = await response.json().catch(() => ({}));
      if (data.token) {
        saveSession(data);
      } else {
        saveSession({ role, devSkip: true });
      }
    } catch {
      saveSession({ role, devSkip: true });
    }
    navigate('/birthday', { replace: true });
  }, [navigate, onUnlock]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (unlocking) return;
    const password = value.trim();
    if (!password) return;
    setError(false);
    setUnlocking(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'same-origin',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.error || 'Incorrect access code');
      saveSession(data);
      setTimeout(() => navigate(data.devSkip || birthdayChapterIsOpen() ? '/birthday' : '/', { replace: true }), 450);
    } catch (err) {
      // A local Vite server can still be used if the user is running an older setup without API middleware.
      if (isDev && password.toLowerCase() === 'tinku') {
        openBirthdayCountdown();
        return;
      }
      setErrorText(err.message || 'Unable to sign in.');
      setError(true);
      setValue('');
      setUnlocking(false);
    }
  }, [isDev, navigate, onUnlock, openBirthdayCountdown, unlocking, value]);

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <FloatingParticles count={18} />
      <motion.div className={styles.card} animate={error ? { x: [0, -10, 10, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}>
        <motion.div className={styles.lockIconWrapper} animate={unlocking ? { scale: [1, 1.18, 1] } : {}}>
          {unlocking ? <IoLockOpenOutline /> : <IoLockClosedOutline />}
        </motion.div>
        <div className={styles.header}>
          <span className={styles.eyebrow}>PRIVATE SPACE</span>
          <h1 className={styles.title}>Welcome back.</h1>
          <p className={styles.subtitle}>This is the little passcode that opens the original Wishoo journey.</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input className={styles.input} autoFocus type="password" value={value} onChange={(e) => { setValue(e.target.value); setError(false); }} placeholder="Enter passcode" aria-label="Wishoo passcode" autoComplete="off" />
          {error && <motion.div className={styles.errorMessage} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errorText}</motion.div>}
          <AnimatedButton type="submit" fullWidth shimmer icon={<IoArrowForward />} disabled={unlocking}>
            {unlocking ? 'Opening...' : 'Enter Wishoo'}
          </AnimatedButton>
        </form>
        {isDev && (
          <motion.button type="button" className={styles.devSkip} onClick={openBirthdayCountdown} whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}>
            DEV MODE · Skip to Birthday Countdown
          </motion.button>
        )}
        <p className={styles.footer}>The birthday chapter has its own little lock later. 🎂</p>
      </motion.div>
    </div>
  );
}
