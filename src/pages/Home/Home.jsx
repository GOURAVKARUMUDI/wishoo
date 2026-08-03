import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import Envelope from '../../components/Envelope/Envelope.jsx';
import FloatingHearts from '../../components/FloatingHearts/FloatingHearts.jsx';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();

  const handleEnvelopeOpen = () => {
    setTimeout(() => navigate('/letter'), 300);
  };

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.background} />
        <div className={`${styles.decorCircle} ${styles.circle1}`} aria-hidden="true" />
        <div className={`${styles.decorCircle} ${styles.circle2}`} aria-hidden="true" />
        <div className={`${styles.decorCircle} ${styles.circle3}`} aria-hidden="true" />

        <FloatingHearts count={10} />

        <div className={styles.content}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, type: 'spring' }}
          >
            For Mahii 🌸
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            A small little surprise...
            <br />Just because I wanted to make you smile.
          </motion.p>

          <motion.div
            className={styles.envelopeWrapper}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
          >
            <Envelope onOpen={handleEnvelopeOpen} />
          </motion.div>

          <motion.p
            className={styles.tapText}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ delay: 1.2, duration: 2, repeat: Infinity }}
          >
            Tap whenever you're ready
          </motion.p>
        </div>
      </div>
    </PageTransition>
  );
}
