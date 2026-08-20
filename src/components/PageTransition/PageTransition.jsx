import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 22, scale: 0.985, filter: 'blur(7px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -14, scale: 0.99, filter: 'blur(5px)', transition: { duration: 0.34, ease: 'easeInOut' } },
};

export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className={className} style={{ width: '100%', minHeight: '100dvh' }}>
      {children}
    </motion.div>
  );
}
