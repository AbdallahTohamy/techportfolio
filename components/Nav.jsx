'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { profile, sections } from '@/data/content';
import './Nav.css';

export default function Nav() {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      if (window.scrollY < window.innerHeight * 0.5) setActive('');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="/#top" className="nav-mark" aria-label="Abdallah El Tohamy, home">
          <span className="nav-logo">AE</span>
          <span className="nav-name">{profile.name}</span>
        </a>

        <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Sections">
          {sections.map((s, i) => (
            <a
              key={s.id}
              href={`/#${s.id}`}
              className={active === s.id ? 'is-active' : ''}
              onClick={() => setOpen(false)}
            >
              <span className="mono nav-num">0{i + 1}</span>
              {s.label}
            </a>
          ))}
          <a href={profile.cv} target="_blank" rel="noreferrer" className="nav-cv" onClick={() => setOpen(false)}>
            CV ↗
          </a>
        </nav>

        <button className="nav-toggle mono" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <motion.div className="nav-progress" style={{ scaleX: progress }} />
    </header>
  );
}
