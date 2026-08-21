import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  IoHeart,
  IoSparkles,
  IoReload,
  IoCompassOutline,
  IoVolumeMediumOutline,
  IoVolumeMuteOutline,
  IoArrowBack,
  IoSparklesOutline
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import styles from './BirthdayThankYou.module.css';
import hbdUrl from '../../assets/music/hbd.mp3';

const SECTIONS = [
  { path: '/birthday', label: '1. Birthday Countdown' },
  { path: '/birthday/unlock', label: '2. Unlock Birthday Gate' },
  { path: '/birthday/experience', label: '3. Intro & Life Clock' },
  { path: '/birthday/about-you', label: '4. About You (Mahii)' },
  { path: '/birthday/photos', label: '5. Memories & Photo Strip' },
  { path: '/birthday/about-tinku', label: '6. About Me (Tinku)' },
  { path: '/birthday/what-you-mean-to-me', label: '7. What You Mean to Me' },
  { path: '/birthday/gifts', label: '8. Pick a Gift' },
  { path: '/birthday/final', label: '9. Grand Celebration Cake' }
];

export default function BirthdayThankYou() {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedSection, setSelectedSection] = useState('');

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(hbdUrl);
      audio.loop = true;
      audio.volume = 0.18;
      audioRef.current = audio;
    }

    const playAudio = () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch((err) => console.log('Audio play prevented:', err));
      }
    };

    playAudio();

    const handleInteraction = () => {
      if (isPlaying) playAudio();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isPlaying]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => { });
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    sessionStorage.clear();
    navigate('/', { replace: true });
  };

  const handleSectionTravel = (e) => {
    const path = e.target.value;
    if (path) {
      setSelectedSection(path);
      navigate(path);
    }
  };

  return (
    <PageTransition>
      <main className={styles.page}>
        <div className={styles.goldVignette} />
        <div className={styles.ambientOrb} />

        {/* Audio control pill */}
        <button
          className={styles.musicPill}
          onClick={toggleAudio}
          aria-label={isPlaying ? "Mute music" : "Play music"}
        >
          {isPlaying ? <IoVolumeMediumOutline className={styles.pulseIcon} /> : <IoVolumeMuteOutline />}
          <span>{isPlaying ? 'Music On' : 'Music Muted'}</span>
        </button>

        <section className={styles.content}>
          <motion.div
            className={styles.shortNoteCard}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.heroBadge}>
              <IoSparkles className={styles.sparkleIcon} />
              <span>THE FINALE • THANK YOU NOTE</span>
              <IoSparkles className={styles.sparkleIcon} />
            </div>

            <h1 className={styles.mainTitle}>Thank You, Mahii 🤍</h1>

            <div className={styles.noteBody}>
              <p>
                Thank you so much for taking the time to travel through this entire birthday space from start to finish — from unlocking the countdown, exploring the photos and polaroids, to reading through the memories and celebrating at the cake.
              </p>
              <p className={styles.highlightText}>
                I know there were honest feelings and thoughts shared along the way, especially under the polaroids. Please don’t overthink or get upset about anything you read. Everything on this website was made with pure intentions, utmost respect, and genuine care for you.
              </p>
              <p>
                This entire experience was created for one simple reason: to celebrate your 19th birthday, make you feel truly special, and bring a bright smile to your face.
              </p>
              <p className={styles.wishText}>
                Now, leave every worry behind and go celebrate your birthday to the absolute maximum — smile lots, laugh, eat amazing food, take pictures, and have the happiest day possible!
              </p>
            </div>

            <div className={styles.signatureBlock}>
              <span className={styles.signPrefix}>With all the warmth & genuine respect,</span>
              <strong className={styles.signAuthor}>— Tinku 🌼</strong>
              <span className={styles.birthdayCheer}>Enjoy your birthday to the maxx! 🎂✨</span>
            </div>

            <div className={styles.divider}>
              <span />
              <IoSparklesOutline />
              <span />
            </div>

            {/* Quick Chapter Navigation */}
            <div className={styles.travelSection}>
              <label htmlFor="section-select" className={styles.travelLabel}>
                <IoCompassOutline /> Revisit Any Chapter:
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="section-select"
                  value={selectedSection}
                  onChange={handleSectionTravel}
                  className={styles.selectDropdown}
                >
                  <option value="" disabled>Choose a chapter to revisit...</option>
                  {SECTIONS.map((sec) => (
                    <option key={sec.path} value={sec.path}>{sec.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button
                className={styles.backButton}
                onClick={() => navigate('/birthday/final')}
              >
                <IoArrowBack /> Back to Celebration Cake
              </button>

              <button
                className={styles.restartButton}
                onClick={handleRestart}
              >
                <IoReload /> Restart Entire Experience
              </button>
            </div>
          </motion.div>
        </section>
      </main>
    </PageTransition>
  );
}
