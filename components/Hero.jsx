'use client';

import { motion } from 'framer-motion';
import { profile } from '@/data/content';
import DeployTerminal from './DeployTerminal';
import './Hero.css';

const rise = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <motion.p className="hero-name mono" {...rise(0.05)}>
            <span className="hero-dot" /> {profile.name}
          </motion.p>
          <motion.h1 className="hero-title" {...rise(0.15)}>
            {profile.headline}
          </motion.h1>
          <motion.p className="hero-role" {...rise(0.25)}>
            Full stack <span>·</span> DevOps <span>·</span> AI
          </motion.p>
          <motion.p className="hero-sub" {...rise(0.32)}>
            {profile.sub}
          </motion.p>
          <motion.div className="hero-actions" {...rise(0.4)}>
            <a href="#work" className="btn primary">
              See the work <span aria-hidden>↓</span>
            </a>
            <a href="#contact" className="btn">
              Get in touch
            </a>
            <a href={profile.cv} target="_blank" rel="noreferrer" className="btn">
              Résumé ↗
            </a>
          </motion.div>
        </div>

        <motion.div className="hero-term" {...rise(0.3)}>
          <DeployTerminal />
        </motion.div>
      </div>
    </section>
  );
}
