'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { testimonials } from '@/data/content';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import './Testimonials.css';

const FEATURED = [2, 9, 16, 18, 4, 14]; // strongest, varied reviews shown before "show all"

export default function Testimonials() {
  const [country, setCountry] = useState(null);
  const [all, setAll] = useState(false);
  const [hover, setHover] = useState(null);

  const byCountry = useMemo(() => {
    const m = new Map();
    testimonials.forEach((t) => m.set(t.country, (m.get(t.country) || 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, []);
  const repeat = useMemo(() => {
    const m = {};
    testimonials.forEach((t) => (m[t.name] = (m[t.name] || 0) + 1));
    return m;
  }, []);
  const repeatClients = Object.values(repeat).filter((n) => n > 1).length;
  const max = byCountry[0][1];

  const list = country
    ? testimonials.map((t, i) => ({ ...t, i })).filter((t) => t.country === country)
    : all
      ? testimonials.map((t, i) => ({ ...t, i }))
      : FEATURED.map((i) => ({ ...testimonials[i], i }));

  return (
    <section id="reviews" className="section">
      <div className="container">
        <SectionHead
          index="04"
          label="Reviews"
          title={`${testimonials.length} reviews. All five stars. ${byCountry.length} countries.`}
        >
          What freelance clients said after the work shipped. Pick a country to read its reviews.
        </SectionHead>

        <div className="tm">
          <Reveal className="tm-side panel ticks">
            <div className="tm-score">
              <strong>5.0</strong>
              <div>
                <span className="tm-stars" aria-label="5 out of 5 stars">★★★★★</span>
                <span className="mono">
                  {testimonials.length} reviews · {repeatClients} repeat clients
                </span>
              </div>
            </div>

            <div className="tm-chart" role="group" aria-label="Reviews by country">
              <div className="tm-chart-head">
                <span className="mono">Reviews by country</span>
                {country && (
                  <button className="mono tm-reset" onClick={() => setCountry(null)}>
                    Show all ✕
                  </button>
                )}
              </div>
              {byCountry.map(([c, n]) => {
                const on = country === c;
                const dim = country && !on;
                return (
                  <button
                    key={c}
                    className={`tm-row ${on ? 'is-on' : ''} ${dim ? 'is-dim' : ''}`}
                    onClick={() => setCountry(on ? null : c)}
                    onMouseEnter={() => setHover(c)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(c)}
                    onBlur={() => setHover(null)}
                    aria-pressed={on}
                    aria-label={`${c}: ${n} review${n > 1 ? 's' : ''}`}
                  >
                    <span className="tm-row-label">{c}</span>
                    <span className="tm-row-track">
                      <motion.span
                        className="tm-row-bar"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(n / max) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      />
                      {hover === c && (
                        <span className="tm-tip mono" role="tooltip">
                          {n} of {testimonials.length} · {Math.round((n / testimonials.length) * 100)}%
                        </span>
                      )}
                    </span>
                    <span className="tm-row-n">{n}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <div className="tm-main">
            <motion.div layout className="tm-grid">
              <AnimatePresence mode="popLayout" initial={false}>
                {list.map((t) => (
                  <motion.figure
                    layout
                    key={t.i}
                    className="tm-card panel"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="tm-stars small" aria-hidden>★★★★★</span>
                    <blockquote>“{t.text}”</blockquote>
                    <figcaption>
                      <span className="tm-avatar" aria-hidden>{t.name[0].toUpperCase()}</span>
                      <span>
                        <strong>{t.name}</strong>
                        <span className="mono">{t.country}</span>
                      </span>
                      {repeat[t.name] > 1 && <span className="tm-repeat mono">repeat client ×{repeat[t.name]}</span>}
                    </figcaption>
                  </motion.figure>
                ))}
              </AnimatePresence>
            </motion.div>
            {!country && (
              <button className="btn tm-more" onClick={() => setAll((a) => !a)}>
                {all ? 'Show fewer' : `Read all ${testimonials.length} reviews`}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
