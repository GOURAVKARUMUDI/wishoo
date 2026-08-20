import { motion } from 'framer-motion';
import { IoArrowForward, IoHeartOutline, IoSparklesOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition/PageTransition.jsx';
import styles from './BirthdayAboutTinku.module.css';

const sections = [
  {
    eyebrow: 'THE WAY I AM',
    title: 'I do not let everyone get close.',
    lines: [
      "I've never been someone who finds friendship or trust very easily.",
      "I'm not everyone's cup of tea, and I've always known that.",
      'The way I think, the way I feel, and the way I connect with people has always been a little different.',
      'So I do not usually let people get very close to me.',
    ],
  },
  {
    eyebrow: 'THE PART YOU CHANGED',
    title: 'Then somehow, you got through.',
    lines: [
      'But somehow, with you, it happened without me even realizing it.',
      'I trusted you naturally.',
      'There was no plan, no decision, no moment where I consciously said it should happen.',
      'It simply became true through time, conversations, honesty, and comfort.',
    ],
  },
  {
    eyebrow: 'MY COMPLETELY UNNECESSARY PHD 😂',
    title: 'I overthink because I care.',
    lines: [
      'When I genuinely care about someone, I do not really know how to do it halfway.',
      'A small change in tone, a little distance, something left unsaid, or even the thought that I might have hurt someone I care about can make my brain create an entire movie that nobody asked for. 😭',
    ],
    quote: 'I CARE.',
    ending: 'That is really what is underneath all the overthinking.',
  },
  {
    eyebrow: 'WHAT CARE LOOKS LIKE TO ME',
    title: 'When someone matters, their happiness matters too.',
    lines: [
      'When someone becomes important to me, their happiness naturally starts mattering to me too.',
      'I want the people I care about to be happy, confident, safe, and able to become everything they are capable of becoming.',
      'I do not need a dramatic reason for that. It is simply how I am with the people who matter to me.',
    ],
  },
  {
    eyebrow: 'THE QUIET PART',
    title: 'Some conversations make everything quieter.',
    lines: [
      'Sometimes we are not even talking about anything important.',
      'Maybe we are discussing something completely random or laughing about something stupid.',
      'But somehow, those few minutes make everything else feel a little quieter.',
      'Whatever stress is going on in my head, talking to you can make those moments feel lighter.',
    ],
    quote: 'Those few minutes feel healing. ❤️‍🩹',
  },
  {
    eyebrow: 'WHAT I WANT FOR YOU',
    title: 'I genuinely want good things for you.',
    lines: [
      'I want you to be happy.',
      'I want you to be confident.',
      'I want you to experience good things.',
      'I want you to become everything you are capable of becoming.',
      'You do not have to do anything extraordinary for that to matter to me. Sometimes just being yourself is enough.',
    ],
  },
];

export default function BirthdayAboutTinku() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <main className={styles.page}>
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />
        <section className={styles.content}>
          <motion.div className={styles.heroIcon} initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .7 }}>
            <IoHeartOutline />
          </motion.div>
          <motion.span className={styles.eyebrow} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>03 • ABOUT ME</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }}>About Me — Tinku 🤍</motion.h1>
          <motion.p className={styles.opening} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .28 }}>
            Okay, Mahii... now let me tell you a little about the person who has been writing all of this.
          </motion.p>
          <motion.p className={styles.subOpening} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .45 }}>
            Not because I think I am particularly easy to understand — but because there are a few things I wanted you to know about me.
          </motion.p>
          <div className={styles.divider}><span /><IoSparklesOutline /><span /></div>
          <h2 className={styles.mainTitle}>ABOUT ME — TINKU</h2>
          <div className={styles.sections}>
            {sections.map((section, index) => (
              <motion.article className={styles.storyCard} key={section.title} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 + index * .07 }}>
                <span className={styles.sectionEyebrow}>{section.eyebrow}</span>
                <h3>{section.title}</h3>
                {section.lines.map((line, lineIndex) => <p key={lineIndex} className={lineIndex === 0 ? styles.firstLine : ''}>{line}</p>)}
                {section.quote && <div className={styles.bigQuote}>{section.quote}</div>}
                {section.ending && <p className={styles.ending}>{section.ending}</p>}
              </motion.article>
            ))}
          </div>
          <motion.div className={styles.closing} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .5 }}>
            <span>ONE SIMPLE THING</span>
            <strong>I care.</strong>
            <p>And I wanted you to understand a little bit of the person behind the care.</p>
          </motion.div>
          <button className={styles.nextButton} onClick={() => navigate('/birthday/what-you-mean-to-me')}>What You Mean To Me <IoArrowForward /></button>
        </section>
      </main>
    </PageTransition>
  );
}
