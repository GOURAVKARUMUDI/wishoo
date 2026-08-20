import { motion } from 'framer-motion';
import { IoArrowForward, IoHeart, IoSparklesOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import styles from './BirthdayWhatYouMean.module.css';

const sections = [
  {
    eyebrow: 'SOMEWHERE ALONG THE WAY',
    title: 'You became important.',
    fragments: ['The conversations.', 'The laughter.', 'The random things.', 'The little things.'],
    ending: 'And somehow, all of those ordinary moments started meaning a little more to me.',
  },
  {
    eyebrow: 'WHY YOU BECAME DIFFERENT',
    title: 'Not one moment. Everything between the moments.',
    lines: [
      'Some people simply become different from everyone else.',
      'Not because of one particular moment...',
      'But because of everything that quietly happens between the moments.',
    ],
    ending: 'And somewhere along the way, you became one of those people for me.',
  },
  {
    eyebrow: "THE PART I'VE NEVER SAID PROPERLY",
    title: 'I notice.',
    lines: [
      "When someone becomes important to me, I don't know how to treat them like they're just another person.",
      "I notice when they're happy.",
      'I notice when something feels different.',
      'I remember the little things.',
    ],
    ending: 'And I genuinely want good things for them.',
  },
  {
    eyebrow: 'WHAT I ACTUALLY WANTED YOU TO KNOW',
    title: 'You matter to me.',
    lines: [
      "I'm not telling you this to make anything complicated.",
      "I'm not asking you to see things differently overnight.",
      "And I'm not expecting anything from you.",
      "I just didn't want something important to me to remain unsaid.",
    ],
    quote: 'You matter to me.',
    ending: "Probably more than I've ever properly explained.",
  },
];

export default function BirthdayWhatYouMean() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <main className={styles.page}>
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />
        <section className={styles.content}>
          <motion.div className={styles.heroIcon} initial={{ scale: .7, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: .7 }}><IoHeart /></motion.div>
          <motion.span className={styles.eyebrow} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>04 • WHAT YOU MEAN TO ME</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }}>What You Mean To Me 🤍</motion.h1>
          <motion.p className={styles.opening} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .28 }}>Okay, Mahii... this is probably the part I've never really known how to explain.</motion.p>
          <motion.p className={styles.subOpening} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .45 }}>Because there are some things you can understand about a person without ever finding the right words for them.</motion.p>
          <div className={styles.divider}><span /><IoSparklesOutline /><span /></div>
          <h2 className={styles.mainTitle}>WHAT YOU MEAN TO ME</h2>
          <div className={styles.sections}>
            {sections.map((section, index) => (
              <motion.article className={styles.storyCard} key={section.eyebrow} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + index * .08, duration: .55 }}>
                <span className={styles.sectionEyebrow}>{section.eyebrow}</span>
                <h3>{section.title}</h3>
                {section.lines && section.lines.map((line, i) => <p key={i} className={i === 0 ? styles.firstLine : ''}>{line}</p>)}
                {section.fragments && (
                  <div className={styles.fragments}>
                    {section.fragments.map((fragment, i) => (
                      <motion.div key={fragment} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .2 + i * .08 }}>{fragment}</motion.div>
                    ))}
                  </div>
                )}
                {section.quote && <div className={styles.bigQuote}>{section.quote}</div>}
                {section.ending && <p className={styles.ending}>{section.ending}</p>}
              </motion.article>
            ))}
          </div>
          <motion.section className={styles.truth} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .45 }}>
            <span className={styles.truthLabel}>THE TRUTH</span>
            <div className={styles.truthName}>Mahii.</div>
            <div className={styles.truthHeart}>I'm genuinely grateful that you became a part of my life.</div>
            <p>Whatever happens, I hope you always remember that.</p>
            <h2>You mean a lot to me, Mahii. 🤍</h2>
            <p>That's all I wanted you to know.</p>
          </motion.section>
          <button className={styles.nextButton} onClick={() => navigate('/birthday/gifts')}>Continue <IoArrowForward /></button>
        </section>
      </main>
    </PageTransition>
  );
}
