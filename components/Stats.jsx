'use client';

import { useEffect, useRef, useState } from 'react';
import { stats } from '@/data/content';
import { useInView, usePrefersReducedMotion } from '@/lib/hooks';
import Reveal from './Reveal';
import './Stats.css';

function format(n, decimals = 0) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function Counter({ value, decimals = 0, suffix = '', start }) {
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!start || done.current) return;
    done.current = true;
    if (reduced) return setN(value);
    const t0 = performance.now();
    const dur = 1600;
    let raf;
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      setN(value * (1 - Math.pow(1 - k, 4)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value, reduced]);
  return (
    <>
      {format(decimals ? n : Math.round(n), decimals)}
      <span className="stat-suffix">{suffix}</span>
    </>
  );
}

export default function Stats() {
  const [ref, inView] = useInView({ rootMargin: '-80px' });
  return (
    <section className="stats" aria-label="Highlights">
      <div className="container">
        <div ref={ref} className="stats-grid">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="stat">
              <span className="stat-value">
                <Counter {...s} start={inView} />
              </span>
              <span className="stat-label">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
