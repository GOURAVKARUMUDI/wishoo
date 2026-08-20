import { useMemo } from 'react';
import { randomBetween } from '../../utils/helpers.js';
import styles from './FloatingParticles.module.css';

const STORYBOOK_ITEMS = ['🌸', '🌼', '🍃', '✨', '☁️', '🦋'];

export default function FloatingParticles({ count = 16 }) {
  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const isButterfly = i % 8 === 0;
      const emoji = isButterfly ? '🦋' : STORYBOOK_ITEMS[i % STORYBOOK_ITEMS.length];
      return {
        id: i,
        emoji,
        left: `${randomBetween(4, 96)}%`,
        size: isButterfly ? `${randomBetween(1.2, 1.6)}rem` : `${randomBetween(0.8, 1.4)}rem`,
        duration: isButterfly ? `${randomBetween(14, 22)}s` : `${randomBetween(10, 18)}s`,
        delay: `${randomBetween(0, 8)}s`,
        opacity: randomBetween(0.4, 0.75),
      };
    });
  }, [count]);

  return (
    <div className={styles.overlay} aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className={styles.particle}
          style={{
            left: item.left,
            fontSize: item.size,
            animationDuration: item.duration,
            animationDelay: item.delay,
            opacity: item.opacity,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
