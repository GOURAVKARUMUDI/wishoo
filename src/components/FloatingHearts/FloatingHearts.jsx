import { useMemo } from 'react';
import { randomBetween } from '../../utils/helpers.js';
import styles from './FloatingHearts.module.css';

const EMOJIS = ['🌸', '🌼', '🍃', '🌿', '☁️', '🤍', '✨'];

export default function FloatingHearts({ count = 12 }) {
  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      left: `${randomBetween(5, 95)}%`,
      size: `${randomBetween(0.8, 1.6)}rem`,
      duration: `${randomBetween(6, 14)}s`,
      delay: `${randomBetween(0, 8)}s`,
      opacity: randomBetween(0.3, 0.7),
    }));
  }, [count]);

  return (
    <div className={styles.overlay} aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className={styles.heart}
          style={{
            left: h.left,
            fontSize: h.size,
            animationDuration: h.duration,
            animationDelay: h.delay,
            opacity: h.opacity,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
