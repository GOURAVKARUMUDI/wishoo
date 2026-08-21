import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowForward, IoGiftOutline, IoSparkles } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import styles from './BirthdayGifts.module.css';
import clapsUrl from '../../assets/music/claps.mp3';

const messages = ['Not this one… but I love that you tried 🎀', 'A little closer. Your final try is special ✨', 'Congratulations! 🎉 You will receive the Stanley Mug as per your request. 🎁🤍'];
export default function BirthdayGifts() {
    const navigate = useNavigate(); const [turns, setTurns] = useState(0); const [chosen, setChosen] = useState([]); const [won, setWon] = useState(false); const [message, setMessage] = useState('');
    const choose = (index) => {
        if (won || chosen.includes(index)) return;
        const next = turns + 1;
        setChosen(v => [...v, index]);
        setTurns(next);
        if (next === 3) {
            setWon(true);
            setMessage(messages[2]);
            const claps = new Audio(clapsUrl);
            claps.volume = 0.4;
            claps.play().catch((err) => console.log('Claps play failed:', err));
        } else {
            setMessage(messages[next - 1]);
        }
    };
    return <PageTransition><main className={styles.page}><div className={styles.confettiGlow} /><section className={styles.content}>
        <span className={styles.eyebrow}>05 • THREE LITTLE CHANCES</span><h1>Pick a Gift 🎁</h1><p className={styles.lead}>Nine boxes. Three choices. And on your third choice, the gift is guaranteed — no matter which box you pick.</p>
        <div className={styles.turnBadge}>TRY {turns} / 3</div>
        <div className={styles.grid}>{Array.from({ length: 9 }, (_, i) => <motion.button key={i} className={`${styles.box} ${chosen.includes(i) ? styles.chosen : ''} ${won && chosen[chosen.length - 1] === i ? styles.winner : ''}`} disabled={chosen.includes(i) || won} onClick={() => choose(i)} whileHover={{ y: -5, rotate: i % 2 ? 2 : -2 }} whileTap={{ scale: .92 }}><IoGiftOutline /><span>{String(i + 1).padStart(2, '0')}</span></motion.button>)}</div>
        <AnimatePresence mode="wait">{message && <motion.div key={message} className={`${styles.message} ${won ? styles.won : ''}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{won ? <IoSparkles /> : <IoGiftOutline />}<span>{message}</span></motion.div>}</AnimatePresence>
        {won && <motion.div className={styles.realGift} initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }}><strong>🎁 CONGRATULATIONS!</strong> <p> Enjoy it, Mahii! ✨</p></motion.div>}
        {won && <button className={styles.nextButton} onClick={() => navigate('/birthday/final')}>Final Celebration <IoArrowForward /></button>}
    </section></main></PageTransition>
}
