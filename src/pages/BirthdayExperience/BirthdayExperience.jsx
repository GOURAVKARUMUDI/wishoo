import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { IoArrowForward, IoSparkles } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import ThreeBirthdayCake from '../../components/ThreeBirthdayCake/ThreeBirthdayCake.jsx';
import { BIRTHDAY_DAY, BIRTHDAY_MONTH, BIRTHDAY_YEAR } from '../../config/birthdayConfig.js';
import styles from './BirthdayExperience.module.css';

const DOB = new Date(parseInt(BIRTHDAY_YEAR, 10), parseInt(BIRTHDAY_MONTH, 10) - 1, parseInt(BIRTHDAY_DAY, 10), 0, 0, 0);
const BIRTHDAY_AGE = Math.max(1, new Date().getFullYear() - DOB.getFullYear());

function getLifeTime() {
  const now = new Date();
  let years = now.getFullYear() - DOB.getFullYear();
  let anchor = new Date(DOB.getFullYear() + years, DOB.getMonth(), DOB.getDate());
  if (anchor > now) {
    years -= 1;
    anchor = new Date(DOB.getFullYear() + years, DOB.getMonth(), DOB.getDate());
  }

  let months = 0;
  while (true) {
    const next = new Date(anchor.getFullYear(), anchor.getMonth() + 1, anchor.getDate());
    if (next > now) break;
    anchor = next;
    months += 1;
  }

  const diff = now - anchor;
  const totalSeconds = Math.floor((now - DOB) / 1000);
  const totalMinutes = Math.floor((now - DOB) / 60000);
  const totalHours = Math.floor((now - DOB) / 3600000);

  return {
    years,
    months,
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    totalHours,
    totalMinutes,
    totalSeconds,
  };
}

function LifeClock() {
  const [age, setAge] = useState(getLifeTime);

  useEffect(() => {
    const id = setInterval(() => setAge(getLifeTime()), 1000);
    return () => clearInterval(id);
  }, []);

  const detailed = useMemo(() => [
    ['Years', age.years], ['Months', age.months], ['Days', age.days], ['Minutes', age.minutes],
  ], [age]);

  return (
    <div className={styles.lifeSection}>
      <div className={styles.lifeClock}>
        {detailed.map(([label, value]) => (
          <div className={styles.lifeUnit} key={label}>
            <strong>{String(value).padStart(2, '0')}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className={styles.totalClock}>
        <div className={styles.totalCard}><span>Total hours lived</span><strong>{age.totalHours.toLocaleString()}</strong><small>and counting…</small></div>
        <div className={styles.totalCard}><span>Total minutes lived</span><strong>{age.totalMinutes.toLocaleString()}</strong><small>every minute matters 🤍</small></div>
        <div className={styles.totalCard}><span>Total seconds lived</span><strong>{age.totalSeconds.toLocaleString()}</strong><small>still counting…</small></div>
      </div>
    </div>
  );
}

function Cake() {
  return (
    <motion.div
      className={styles.cakeWrap}
      initial={{ opacity: 0, y: 18, scale: .92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: .9, ease: [0.22, 1, .36, 1] }}
      aria-label={`3D birthday cake showing age ${BIRTHDAY_AGE}`}
    >
      <div className={styles.cakeHalo} />
      <ThreeBirthdayCake variant="opening" />
    </motion.div>
  );
}

export default function BirthdayExperience() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <main className={styles.page}>
        <div className={styles.orb} />
        <div className={styles.sparkleField}>✦　·　✧　·　✦</div>
        <section className={styles.content}>
          <motion.span className={styles.eyebrow} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            01 • YOUR DAY BEGINS
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }}>
            Happy Birthday, Mahii. 🎂
          </motion.h1>
          <motion.p className={styles.lead} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>
            Before anything else, let's celebrate the beautiful number you are stepping into today — <strong>{BIRTHDAY_AGE}</strong>.
          </motion.p>

          <Cake />

          <motion.div className={styles.ageLine} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55 }}>
            <span>NINETEEN</span><b>{BIRTHDAY_AGE}</b><span>YEARS</span>
          </motion.div>

          <motion.div className={styles.clockHeading} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }}>
            <IoSparkles />
            <span>A live little reminder of how much life you've already lived.</span>
          </motion.div>

          <LifeClock />

          <motion.button
            className={styles.nextButton}
            onClick={() => navigate('/birthday/about-you')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: .97 }}
          >
            About You <IoArrowForward />
          </motion.button>
        </section>
      </main>
    </PageTransition>
  );
}
