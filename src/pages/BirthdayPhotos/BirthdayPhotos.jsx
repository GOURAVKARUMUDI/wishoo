import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { IoArrowForward, IoSparklesOutline, IoVolumeMediumOutline, IoVolumeMuteOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import { PHOTO_IDS } from '../../config/birthdayPhotos.js';
import { loadPhotoObjectUrl } from '../../utils/blobClient.js';
import styles from './BirthdayPhotos.module.css';
import bgmUrl from '../../assets/music/bgm.mp3';

// Each photo gets its own caption, told in short lines rather than one block.
const PHOTO_CAPTIONS = [
  ['Sometimes, a picture says more than a conversation ever could.'],
  ['Not just at the picture...', 'But at the person in it.'],
  ['The smile.', 'The expression.', "The little things you probably don't even think twice about.", 'I notice them.'],
  ["There's something about the way you carry yourself", 'Quiet when you want to be.', 'Confident when you need to be.', "And completely yourself when you're comfortable."],
  ['But these pictures were never really about the pictures.'],
  ['I was always grateful that you felt comfortable enough to share them with me.'],
  ['And somewhere between all the conversations...', 'the random things...', 'the little stories...', 'I got to know a little more of you.'],
];

const PHOTO_TITLES = [
  'The little details',
  'The way you carry yourself',
  'The little things',
  'A quiet kind of confidence',
  'The person behind the picture',
  'You shared them',
  'A little more of you',
];

// Loads all seven photos through the secure /api/photo endpoint (session +
// birthday-lock + strict ID allowlist enforced server-side — see
// api/photo.js). Each photo is fetched as a Blob and turned into a local
// object URL, which is revoked again on unmount.
function usePhotoSet() {
  const [state, setState] = useState({ ordered: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    const objectUrls = [];
    async function load() {
      const ordered = await Promise.all(PHOTO_IDS.map(async (photoId) => {
        try {
          const url = await loadPhotoObjectUrl(photoId);
          objectUrls.push(url);
          return url;
        } catch {
          return null;
        }
      }));
      if (!cancelled) setState({ ordered, loading: false, error: null });
    }
    load();
    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return state;
}

// Distinct motion treatment for each of the seven scenes.
function sceneMotion(index, reduced) {
  if (reduced) {
    return { frame: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4 } }, image: {} };
  }
  switch (index) {
    case 0: // Blur -> Focus
      return {
        frame: { initial: { opacity: 0, scale: 1.01 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.6 } },
        image: { initial: { filter: 'blur(22px)', scale: 1.08 }, animate: { filter: 'blur(0px)', scale: 1 }, transition: { duration: 1.6, ease: 'easeOut' } },
      };
    case 1: // Physical photograph entering from bottom with subtle rotation and shadow
      return {
        frame: { initial: { opacity: 0, y: 140, rotate: -7, boxShadow: '0 5px 10px rgba(0,0,0,0)' }, animate: { opacity: 1, y: 0, rotate: 2, boxShadow: '0 40px 70px rgba(0,0,0,.5)' }, transition: { type: 'spring', stiffness: 90, damping: 14 } },
        image: {},
      };
    case 2: // Slow cinematic camera push
      return {
        frame: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8 } },
        image: { initial: { scale: 1.22 }, animate: { scale: 1 }, transition: { duration: 2.6, ease: [0.16, 1, 0.3, 1] } },
      };
    case 3: // Subtle parallax
      return {
        frame: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7 } },
        image: { initial: { scale: 1.1, x: -8, y: 10 }, animate: { scale: 1.06, x: 0, y: -6 }, transition: { duration: 3.2, ease: 'easeInOut' } },
      };
    case 4: // Darkness -> photograph emerges
      return {
        frame: { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0.1 } },
        image: { initial: { opacity: 0, scale: 1.04 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1.8, ease: 'easeOut' } },
        overlay: true,
      };
    case 5: // Floating photograph
      return {
        frame: { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: [0, -10, 0] }, transition: { opacity: { duration: 0.7 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } } },
        image: {},
      };
    case 6: // Full cinematic hero reveal
    default:
      return {
        frame: { initial: { opacity: 0, scale: 0.82, y: 26 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
        image: { initial: { scale: 1.12 }, animate: { scale: 1 }, transition: { duration: 1.6, ease: 'easeOut' } },
      };
  }
}

function PhotoFrame({ src, index }) {
  const reduced = useReducedMotion();
  const motionConfig = useMemo(() => sceneMotion(index, reduced), [index, reduced]);
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.article
      className={`${styles.photoScene} ${styles.activeScene}`}
      initial="initial"
      animate="animate"
    >
      <div className={styles.photoHalo} />
      <motion.div
        className={`${styles.photoFrame} ${styles[`photoFrame${index + 1}`]}`}
        initial={motionConfig.frame.initial}
        animate={motionConfig.frame.animate}
        transition={motionConfig.frame.transition}
      >
        {motionConfig.overlay && (
          <motion.div className={styles.darknessOverlay} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.4, delay: 0.2 }} />
        )}
        {src ? (
          <motion.img
            src={src}
            alt={`A photo Mahii shared — glimpse ${index + 1}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            initial={motionConfig.image.initial}
            animate={loaded ? motionConfig.image.animate : motionConfig.image.initial}
            transition={motionConfig.image.transition}
          />
        ) : (
          <div className={styles.photoPlaceholder}>
            <IoSparklesOutline />
            <span>PHOTO {String(index + 1).padStart(2, '0')}</span>
            <small>Run <code>npm run upload-photos</code><br />once BLOB_READ_WRITE_TOKEN is set</small>
          </div>
        )}
        <div className={styles.photoSheen} />
      </motion.div>
      <div className={styles.captionBlock}>
        <span>{String(index + 1).padStart(2, '0')} / 07 · {PHOTO_TITLES[index]}</span>
        {PHOTO_CAPTIONS[index].map((line, i) => <p key={i}>{line}</p>)}
      </div>
    </motion.article>
  );
}

export default function BirthdayPhotos() {
  const navigate = useNavigate();
  const { ordered, loading: photosLoading } = usePhotoSet();

  // stage machine: intro -> scene -> hold -> sceneClose -> collage -> polaroid -> transition
  const [stage, setStage] = useState('intro');
  const [index, setIndex] = useState(0);
  const [polaroidEnded, setPolaroidEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (stage === 'intro' || stage === 'loading') {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    if (!audioRef.current) {
      const audio = new Audio(bgmUrl);
      audio.loop = true;
      audio.volume = 0.12; // Extremely quiet/subtle even at 100% device volume
      audioRef.current = audio;
    }

    audioRef.current.muted = isMuted;

    const playAudio = () => {
      if (audioRef.current && !isMuted) {
        audioRef.current.play().catch((error) => {
          console.log('Autoplay prevented, waiting for interaction:', error);
        });
      }
    };

    // Try playing immediately
    playAudio();

    // Fallback: start audio on first click/tap if blocked
    const handleInteraction = () => {
      playAudio();
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
  }, [stage, isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    if (stage !== 'intro') return undefined;
    const timer = setTimeout(() => setStage('scene'), 2800);
    return () => clearTimeout(timer);
  }, [stage]);
  const viewportRef = useRef(null);

  useEffect(() => {
    if (stage !== 'scene') return undefined;
    const timer = setTimeout(() => {
      if (index >= 6) setStage('hold');
      else setIndex((v) => v + 1);
    }, index === 6 ? 7200 : 6200);
    return () => clearTimeout(timer);
  }, [stage, index]);

  useEffect(() => {
    if (stage !== 'hold') return undefined;
    const timer = setTimeout(() => setStage('sceneClose'), 3200);
    return () => clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'scene') return undefined;
    const onKey = (event) => {
      if (event.key === 'ArrowRight') goNext();
      if (event.key === 'ArrowLeft') setIndex((v) => Math.max(0, v - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, index]);

  const goNext = () => {
    if (index >= 6) {
      setStage('hold');
      return;
    }
    setIndex((v) => Math.min(6, v + 1));
  };

  const handlePolaroidScroll = () => {
    const el = viewportRef.current;
    if (!el) return;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 24) setPolaroidEnded(true);
  };

  useEffect(() => {
    if (stage !== 'polaroid') return;
    const el = viewportRef.current;
    if (el && el.scrollWidth <= el.clientWidth + 24) setPolaroidEnded(true);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'sceneClose') return undefined;
    const timer = setTimeout(() => setStage('collage'), 4200);
    return () => clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'collage') return undefined;
    const timer = setTimeout(() => setStage('polaroid'), 7600);
    return () => clearTimeout(timer);
  }, [stage]);

  return (
    <PageTransition>
      <main className={styles.page}>
        <div className={styles.filmGrain} />
        <div className={styles.ambientOrb} />

        {stage !== 'intro' && (
          <button className={styles.musicToggle} onClick={toggleMute} aria-label={isMuted ? 'Unmute music' : 'Mute music'}>
            {isMuted ? <IoVolumeMuteOutline size={18} /> : <IoVolumeMediumOutline size={18} />}
          </button>
        )}

        <section className={styles.content}>

          {stage === 'intro' && (
            <motion.div className={styles.intro} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}>
              <span className={styles.eyebrow}>02 • A LITTLE FILM ABOUT YOU</span>
              <h1>A Little Film About You</h1>
              <p>Okay... one more thing.</p>
              <p className={styles.introEmphasis}>7 little glimpses. And a few things I've always noticed.</p>
              <p className={styles.beginHint}>The film begins in a moment <span>→</span></p>
            </motion.div>
          )}

          {stage === 'scene' && (
            <>
              <div className={styles.filmStage} aria-busy={photosLoading}>
                <AnimatePresence mode="wait">
                  <PhotoFrame key={index} src={ordered[index]} index={index} />
                </AnimatePresence>
                <div className={styles.progressDots} aria-label="Photo progress">
                  {ordered.map((_, i) => <span key={i} className={i === index ? styles.dotActive : ''} aria-hidden="true" />)}
                </div>
              </div>
              <div className={styles.captionNav}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><b>{PHOTO_TITLES[index]}</b><small>7 little glimpses · one person</small></div>
              </div>
            </>
          )}

          {(stage === 'hold') && (
            <motion.div className={styles.filmStage} initial={{ opacity: 1 }}>
              <PhotoFrame index={6} src={ordered[6]} />
            </motion.div>
          )}

          {stage === 'sceneClose' && (
            <motion.div className={styles.finalReveal} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
              <span>THE LAST FRAME</span>
              <h2>Seven little glimpses.</h2>
              <p>One person.</p>
              <p>And somehow... they told me a lot about you.</p>
            </motion.div>
          )}

          {stage === 'collage' && (
            <motion.section className={styles.summarySection} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={styles.summaryTitle}><span>THE COMPLETE PICTURE</span><h2>Seven little glimpses.</h2><p>One person. A few pieces of her world.</p></div>
              <div className={styles.collage}>
                {ordered.map((src, i) => (
                  <motion.div
                    key={i}
                    className={`${styles.collagePhoto} ${styles[`collage${i + 1}`]}`}
                    initial={{ opacity: 0, scale: .7, y: 40, rotate: (i % 2 ? 5 : -5) }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotate: (i % 2 ? 2 : -2) }}
                    transition={{ delay: i * .14, type: 'spring', stiffness: 120, damping: 14 }}
                  >
                    {src ? <img src={src} alt={`Glimpse ${i + 1}`} loading="lazy" decoding="async" /> : <span>{i + 1}</span>}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {stage === 'polaroid' && (
            <motion.section className={styles.summarySection} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={styles.polaroidHeading}><IoSparklesOutline /><span>SEVEN LITTLE GLIMPSES</span></div>
              <div className={styles.polaroidViewport} ref={viewportRef} onScroll={handlePolaroidScroll} style={{ touchAction: 'pan-x' }}>
                <div className={styles.polaroidStrip}>
                  {ordered.map((src, i) => (
                    <div className={styles.polaroid} key={i} style={{ '--tilt': `${i % 2 ? 2 : -2}deg` }}>
                      {src ? <img src={src} alt={`Polaroid ${i + 1}`} loading="lazy" decoding="async" /> : <div>{i + 1}</div>}
                      <small>{String(i + 1).padStart(2, '0')}</small>
                    </div>
                  ))}
                </div>
              </div>
              <AnimatePresence>
                {polaroidEnded && (
                  <motion.div className={styles.polaroidClosing} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                    <p>Maybe these were just pictures.</p>
                    <p>But to me...</p>
                    <p>they were little glimpses of you.</p>

                    <div className={styles.heartMessage}>
                      <p>There’s something I’ve wanted to tell you for a while, but I never really knew how to say it without making things awkward.</p>
                      <p>From the beginning, I’ve always treated you as someone very close to my heart. You’ve become genuinely special to me, and somewhere along the way, the way I see you became different from the usual “anna–chelli” kind of relationship. I’m telling you this not to make you uncomfortable, change anything suddenly, or put any pressure on you.</p>
                      <p>I just wanted you to know what you mean to me, because you deserve to know the truth behind all the little things I’ve done.</p>
                      <p>Please don’t take this in the wrong way. Your feelings are your own, and I genuinely respect them.</p>
                      <p>At the end of the day, the final call is always yours. Whatever you choose, whatever you feel, I’ll respect it—and I’ll always be grateful that you became someone so special in my life. ❤️</p>
                      <p style={{ marginTop: '12px', color: '#ffe3a0', fontWeight: '600' }}>Please don’t get angry or overthink right now — just complete the whole experience first. A sincere request from me. 🤍</p>
                    </div>

                    <button className={styles.collageButton} onClick={() => setStage('transition')}>Continue <IoArrowForward /></button>
                  </motion.div>
                )}
              </AnimatePresence>
              {!polaroidEnded && <p className={styles.polaroidNote}>Swipe through the strip →</p>}
            </motion.section>
          )}

          {stage === 'transition' && (
            <motion.div className={styles.finalReveal} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p>Maybe the pictures aren't the interesting part.</p>
              <p>Maybe what they made me realize is...</p>
              <p>Why do I notice these things so much?</p>
              <h2 className={styles.transitionHeading}>ABOUT ME<br /><span>— Tinku</span></h2>
              <button className={styles.nextButton} onClick={() => navigate('/birthday/about-tinku')}>About Me — Tinku <IoArrowForward /></button>
            </motion.div>
          )}
        </section>
      </main>
    </PageTransition>
  );
}
