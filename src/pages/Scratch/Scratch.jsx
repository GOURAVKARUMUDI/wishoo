import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowForward } from 'react-icons/io5';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import AnimatedButton from '../../components/AnimatedButton/AnimatedButton.jsx';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles.jsx';
import { SCRATCH_MESSAGE } from '../../utils/constants.js';
import styles from './Scratch.module.css';

export default function Scratch() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [hasStartedScratching, setHasStartedScratching] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const strokeCountRef = useRef(0);

  // Initialize canvas surface
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Gentle elegant metallic surface with lavender-gold tint
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#e2c694');
    gradient.addColorStop(0.3, '#f2dcab');
    gradient.addColorStop(0.5, '#e8cf9c');
    gradient.addColorStop(0.8, '#f5e4bd');
    gradient.addColorStop(1, '#dfc18b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = 'rgba(100, 75, 40, 0.45)';
    ctx.font = '500 16px Caveat, Dancing Script, cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Gently Scratch Here ✨', rect.width / 2, rect.height / 2);

    for (let i = 0; i < 25; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const size = Math.random() * 2 + 1;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const calculateScratchedPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }
    const totalSampled = pixels.length / 16;
    return (transparentPixels / totalSampled) * 100;
  }, []);

  const checkRevealState = useCallback(() => {
    if (isRevealed) return;
    const percentage = calculateScratchedPercentage();
    if (percentage >= 50) {
      setIsRevealed(true);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      const burst = Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: Math.random() * 260 - 130,
        y: Math.random() * 160 - 80,
        size: Math.random() * 1.2 + 0.8,
        emoji: ['✨', '🌸', '🌼', '🍃'][i % 4],
      }));
      setSparkles(burst);
      setTimeout(() => setSparkles([]), 1800);
    }
  }, [calculateScratchedPercentage, isRevealed]);

  const scratch = useCallback((x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    if (!hasStartedScratching) {
      setHasStartedScratching(true);
    }

    strokeCountRef.current++;
    if (strokeCountRef.current % 10 === 0) {
      checkRevealState();
    }
  }, [checkRevealState, hasStartedScratching, isRevealed]);

  const getPointerPosition = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    if (e.target.setPointerCapture) {
      try { e.target.setPointerCapture(e.pointerId); } catch (err) {}
    }
    setIsScratching(true);
    const pos = getPointerPosition(e);
    scratch(pos.x, pos.y);
  }, [getPointerPosition, scratch]);

  const handlePointerMove = useCallback((e) => {
    if (!isScratching) return;
    e.preventDefault();
    const pos = getPointerPosition(e);
    scratch(pos.x, pos.y);
  }, [isScratching, getPointerPosition, scratch]);

  const handlePointerUp = useCallback((e) => {
    setIsScratching(false);
    checkRevealState();
  }, [checkRevealState]);

  const showContinueButton = hasStartedScratching || isRevealed;

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.background} />
        <FloatingParticles count={12} />

        <div className={styles.header}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Scratch Here 🌸
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            A tiny message for you
          </motion.p>
        </div>

        <motion.div
          className={styles.scratchArea}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className={styles.hiddenMessage}>
            <p className={styles.messageText}>{SCRATCH_MESSAGE}</p>
          </div>

          <canvas
            ref={canvasRef}
            className={styles.scratchCanvas}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            role="img"
            aria-label="Scratch card surface"
          />

          <AnimatePresence>
            {sparkles.map((s) => (
              <motion.span
                key={s.id}
                className={styles.sparkle}
                style={{
                  fontSize: `${s.size}rem`,
                }}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1.2, x: s.x, y: s.y }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                {s.emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.div>

        {!hasStartedScratching && !isRevealed && (
          <motion.p
            className={styles.instruction}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            Use your finger to scratch gently 🌸
          </motion.p>
        )}

        <AnimatePresence>
          {showContinueButton && (
            <motion.div
              className={styles.buttonContainer}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <AnimatedButton onClick={() => navigate('/compliments')} shimmer icon={<IoArrowForward />}>
                Continue
              </AnimatedButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
