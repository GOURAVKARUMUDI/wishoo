import { motion } from 'framer-motion';
import styles from './GlassCard.module.css';

export default function GlassCard({ children, className = '', size = 'default', animate = true, ...props }) {
  const sizeClass = size === 'small' ? styles.cardSmall : size === 'large' ? styles.cardLarge : '';

  const Component = animate ? motion.div : 'div';
  const animProps = animate
    ? {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.5, ease: 'easeOut' },
      }
    : {};

  return (
    <Component className={`${styles.card} ${sizeClass} ${className}`} {...animProps} {...props}>
      {children}
    </Component>
  );
}
