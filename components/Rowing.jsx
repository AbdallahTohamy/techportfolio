'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { rowing } from '@/data/content';
import { r } from '@/lib/num';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import './Rowing.css';

// Simple equirectangular chart over the Mediterranean — no coastline, just a navigator's graticule.
const LON = [-2, 36];
const LAT_TOP = 46;
const W = 600;
const H = 360;
const SX = W / (LON[1] - LON[0]);
const SY = SX / Math.cos((36 * Math.PI) / 180);
const proj = (lat, lon) => [r((lon - LON[0]) * SX), r((LAT_TOP - lat) * SY)];

export default function Rowing() {
  const [sel, setSel] = useState(rowing.venues[0].id);
  const venue = rowing.venues.find((v) => v.id === sel);
  const home = rowing.venues.find((v) => v.home);
  const [hx, hy] = proj(home.lat, home.lon);
  const [seaX, seaY] = proj(34, 19);

  return (
    <section id="rowing" className="section">
      <div className="container">
        <SectionHead index="05" label="Beyond the screen" title="Seven years on the national rowing team.">
          {rowing.intro}
        </SectionHead>

        <div className="rw">
          <Reveal className="rw-map panel ticks">
            <svg viewBox={`0 0 ${W} ${H}`} className="rw-svg" role="img" aria-label="Map of regattas raced for Egypt">
              {Array.from({ length: 7 }, (_, i) => {
                const lon = i * 5;
                const x = proj(0, lon)[0];
                return (
                  <g key={`lon${i}`}>
                    <line x1={x} x2={x} y1="0" y2={H} className="rw-grid" />
                    <text x={x + 4} y={H - 6} className="rw-grid-t">{lon}°E</text>
                  </g>
                );
              })}
              {[30, 35, 40, 45].map((lat) => {
                const y = proj(lat, 0)[1];
                return (
                  <g key={`lat${lat}`}>
                    <line x1="0" x2={W} y1={y} y2={y} className="rw-grid" />
                    <text x="4" y={y - 4} className="rw-grid-t">{lat}°N</text>
                  </g>
                );
              })}
              <text x={seaX} y={seaY} className="rw-sea">Mediterranean</text>

              {rowing.venues
                .filter((v) => !v.home)
                .map((v, i) => {
                  const [x, y] = proj(v.lat, v.lon);
                  const cx = r((x + hx) / 2);
                  const cy = Math.min(y, hy) - 60;
                  return (
                    <motion.path
                      key={v.id}
                      d={`M${hx} ${hy} Q ${cx} ${cy} ${x} ${y}`}
                      className={`rw-arc ${sel === v.id ? 'is-on' : ''}`}
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, delay: 0.3 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
                    />
                  );
                })}

              {rowing.venues.map((v) => {
                const [x, y] = proj(v.lat, v.lon);
                const on = sel === v.id;
                const below = v.id === 'cairo';
                return (
                  <g
                    key={v.id}
                    className={`rw-pin ${on ? 'is-on' : ''}`}
                    transform={`translate(${x} ${y})`}
                    tabIndex={0}
                    role="button"
                    aria-label={`${v.name}, ${v.country}`}
                    onMouseEnter={() => setSel(v.id)}
                    onFocus={() => setSel(v.id)}
                    onClick={() => setSel(v.id)}
                  >
                    <circle r="18" className="rw-hit" />
                    {v.home && <circle r="11" className="rw-ring" />}
                    <circle r="5" className="rw-dot" />
                    <text x={below ? -12 : 12} y={below ? 24 : -10} textAnchor={below ? 'end' : 'start'}>
                      {v.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </Reveal>

          <div className="rw-side">
            <div className="rw-card panel" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className="mono">
                    {venue.country} · {venue.lat.toFixed(2)}°N {venue.lon.toFixed(2)}°E
                  </span>
                  <h3>{venue.name}</h3>
                  <ul>
                    {venue.results.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="rw-facts">
              {rowing.facts.map((f) => (
                <Reveal key={f.label} className="rw-fact">
                  <strong>{f.value}</strong>
                  <span>{f.label}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
