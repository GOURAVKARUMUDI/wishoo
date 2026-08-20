import { ROUTES } from '../../utils/constants.js';
import styles from './ProgressBar.module.css';

export default function ProgressBar({ currentIndex }) {
  const totalSteps = ROUTES.length;
  const progress = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div className={styles.container} role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={totalSteps} aria-label="Journey progress">
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.dots}>
        {ROUTES.map((route, i) => (
          <div
            key={route.path}
            className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''} ${i < currentIndex ? styles.dotCompleted : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
