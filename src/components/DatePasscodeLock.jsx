import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoLockClosedOutline, IoLockOpenOutline, IoArrowForward } from 'react-icons/io5';
import AnimatedButton from './AnimatedButton/AnimatedButton.jsx';
import FloatingParticles from './FloatingParticles/FloatingParticles.jsx';
import { PASSCODE_STEPS } from '../config/birthdayConfig.js';
import styles from './DatePasscodeLock.module.css';

const steps = PASSCODE_STEPS;

export default function DatePasscodeLock({
  title = 'A Little Secret',
  subtitle = 'Three little answers. Then the next chapter opens.',
  onSuccess,
}) {
  const [step, setStep] = useState(0);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const isDev = import.meta.env.DEV;
  const canSkip =
    isDev ||
    sessionStorage.getItem('wishoo-role') === 'tinku-dev' ||
    sessionStorage.getItem('wishoo-dev-skip') === 'true';

  const current = steps[step] || steps[0];

  const submit = useCallback(
    (e) => {
      e?.preventDefault();
      if (unlocking) return;
      const entered = value.trim();
      const expected = String(current.value || '').trim();
      const isMatch =
        entered === expected ||
        (current.placeholder?.length === 2 && entered.padStart(2, '0') === expected);

      if (!isMatch) {
        setError(true);
        setValue('');
        return;
      }
      setError(false);
      if (step < steps.length - 1) {
        setStep((s) => s + 1);
        setValue('');
        return;
      }
      setUnlocking(true);
      setTimeout(() => onSuccess?.(), 850);
    },
    [current.placeholder?.length, current.value, onSuccess, step, unlocking, value]
  );

  const handleDevSkip = useCallback(() => {
    setUnlocking(true);
    setTimeout(() => onSuccess?.(), 400);
  }, [onSuccess]);

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <FloatingParticles count={18} />
      <motion.div className={styles.card} animate={error ? { x: [0, -10, 10, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}>
        <motion.div className={styles.lock} animate={unlocking ? { scale: [1, 1.18, 1], rotate: [0, 10, -10, 0] } : {}}>
          {unlocking ? <IoLockOpenOutline /> : <IoLockClosedOutline />}
        </motion.div>
        <div className={styles.header}>
          <span className={styles.eyebrow}>PRIVATE BIRTHDAY CHAPTER</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className={styles.progress} aria-label={`Step ${step + 1} of ${steps.length}`}>
          {steps.map((item, index) => <span key={item.key} className={index <= step ? styles.activeDot : styles.dot} />)}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current.key} className={styles.step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
            <span className={styles.stepNumber}>0{step + 1}</span>
            <h2>{current.label}</h2>
            <p>{current.hint}</p>
            <form onSubmit={submit}>
              <input
                autoFocus
                inputMode="numeric"
                maxLength={current.placeholder.length}
                value={value}
                onChange={(e) => { setValue(e.target.value.replace(/\D/g, '')); setError(false); }}
                placeholder={current.placeholder}
                aria-label={current.label}
              />
              {error && <motion.div className={styles.error} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>That doesn't seem right. Try again 🤍</motion.div>}
              <AnimatedButton type="submit" fullWidth shimmer icon={<IoArrowForward />} disabled={unlocking}>
                {unlocking ? 'Opening...' : step === steps.length - 1 ? 'Unlock Birthday' : 'Next'}
              </AnimatedButton>
            </form>
          </motion.div>
        </AnimatePresence>
        {canSkip && (
          <motion.button
            type="button"
            className={styles.devSkip || ''}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              color: 'var(--text-muted, #a09fa6)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
            onClick={handleDevSkip}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            DEV MODE · Skip Lock
          </motion.button>
        )}
        <p className={styles.footer}>A tiny lock for a very personal surprise.</p>
      </motion.div>
    </div>
  );
}
