import { motion } from 'framer-motion';
import { IoArrowForward, IoLeafOutline, IoSparklesOutline, IoHeartOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import styles from './BirthdayAboutYou.module.css';

const qualities = [
  ['01', 'Your quiet charm', "You're calm and reserved, and you don't simply open yourself up to everyone. But when you become comfortable with someone, there is a completely different side of you that comes out. That quiet side is one of the things that makes you special."],
  ['02', 'Your strength', "You have a strength and confidence that I genuinely admire. You keep going even when life isn't necessarily easy. Maybe you don't always see that strength in yourself, but I do."],
  ['03', 'Your elegance', 'You look absolutely beautiful in traditional outfits. There is something about the way you carry yourself in them. Not just beautiful in the usual sense — elegant. Like the outfit does not make you beautiful; you somehow make the outfit look even more beautiful.'],
  ['04', 'Your heart', 'What I admire is not only how you present yourself, but the person underneath it — the way you care, the way you stay genuine, and the way you keep becoming more of yourself.'],
  ['05', 'Your future', "You are a diamond in this generation — because genuine people are becoming harder to find. Your past can have difficult chapters without your future having to repeat them."],
  ['06', 'Your light', "Even the moon has dark spots on it, and people still look up at it in awe every single night. Your dark spots don't make you any less beautiful — they're just part of how you got this far. What matters is the light you keep choosing to give off anyway."],
];

export default function BirthdayAboutYou() {
  const navigate = useNavigate();
  return <PageTransition><main className={styles.page}><div className={styles.leafOne}>🌿</div><div className={styles.leafTwo}>🌼</div><section className={styles.content}>
    <motion.div className={styles.icon} initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><IoHeartOutline /></motion.div>
    <span className={styles.eyebrow}>01 • ABOUT YOU</span><h1>About You 🌼</h1>
    <motion.p className={styles.intro} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>Before I tell you about me or about us, I wanted to tell you about the person I see when I look at you.</motion.p>
    <div className={styles.cards}>{qualities.map(([number, title, text], i) => <motion.article key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + i * .08 }}><span className={styles.number}>{number}</span>{i === 0 ? <IoLeafOutline /> : i === 5 ? <IoSparklesOutline /> : null}<h2>{title}</h2><p>{text}</p></motion.article>)}</div>
    <blockquote>“If I had even 1% of the courage and confidence I see in you, I'd be a completely different person.”</blockquote>
    <p className={styles.bottomNote}>And yes, I'm officially putting the 🧿 here because some people are simply too beautiful to leave unprotected.</p>
    <button className={styles.nextButton} onClick={() => navigate('/birthday/photos')}>See Your Memories <IoArrowForward /></button>
  </section></main></PageTransition>;
}
