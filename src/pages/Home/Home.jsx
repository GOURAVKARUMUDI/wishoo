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
        <FloatingHearts count={10} />

        <div className={styles.content}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
          >
            For Mahii 🌸
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            A small little surprise...
            <br />Just because I wanted to make you smile.
          </motion.p>

          <motion.div
            className={styles.envelopeWrapper}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          >
            <Envelope onOpen={handleEnvelopeOpen} />
          </motion.div>

          <motion.p
            className={styles.tapText}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ delay: 1, duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Tap whenever you're ready
          </motion.p>
        </div>
      </div>
    </PageTransition>
  );
}
