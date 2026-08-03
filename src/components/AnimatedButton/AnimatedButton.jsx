import { motion } from 'framer-motion';
import styles from './AnimatedButton.module.css';

export default function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'default',
  type = 'button',
  fullWidth = false,
  shimmer = false,
  icon,
  ariaLabel,
  className = '',
  ...props
}) {
  const variantClass = styles[variant] || styles.primary;
  const sizeClass = size === 'small' ? styles.small : size === 'large' ? styles.large : '';
  const classes = [
    styles.button,
    variantClass,
    sizeClass,
    fullWidth ? styles.fullWidth : '',
    shimmer ? styles.shimmer : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </motion.button>
  );
}
