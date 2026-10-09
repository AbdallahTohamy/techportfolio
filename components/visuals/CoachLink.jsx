'use client';

import { useEffect, useRef } from 'react';
import { useInView, usePrefersReducedMotion } from '@/lib/hooks';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const LOAD = [0.55, 0.8, 0.4, 0.9, 0.65, 1, 0.25];

// TrainBridge: coach and athlete trading messages while the week's plan fills in.
export default function CoachLink() {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView();
  const svg = useRef(null);

  useEffect(() => {
    const s = svg.current;
    if (s && s.pauseAnimations) inView && !reduced ? s.unpauseAnimations() : s.pauseAnimations();
  }, [inView, reduced]);

  return (
    <div ref={ref} className={`viz-coach ${inView && !reduced ? '' : 'is-paused'}`}>
      <svg ref={svg} viewBox="0 0 400 240" className="viz-svg" aria-hidden>
        <path id="cl-ab" d="M92 58 C 160 22, 240 22, 308 58" className="viz-coach-wire" />
        <path id="cl-ba" d="M308 74 C 240 108, 160 108, 92 74" className="viz-coach-wire" />
        {!reduced &&
          [0, 1].map((j) => (
            <g key={`ab${j}`}>
              <rect x="-11" y="-6" width="22" height="12" rx="6" className="viz-coach-msg a" />
              <animateMotion dur="4s" repeatCount="indefinite" begin={`-${j * 2}s`}>
                <mpath href="#cl-ab" />
              </animateMotion>
            </g>
          ))}
        {!reduced && (
          <g>
            <rect x="-11" y="-6" width="22" height="12" rx="6" className="viz-coach-msg b" />
            <animateMotion dur="4s" repeatCount="indefinite" begin="-1s">
              <mpath href="#cl-ba" />
            </animateMotion>
          </g>
        )}

        {[
          [60, 'coach'],
          [340, 'athlete'],
        ].map(([x, label]) => (
          <g key={label} transform={`translate(${x} 66)`} className="viz-coach-node">
            <circle r="26" />
            <circle r="9" cy="-6" className="head" />
            <path d="M-15 16 C -12 4, 12 4, 15 16" className="head" />
            <text y="44" textAnchor="middle">{label}</text>
          </g>
        ))}
        <text x="200" y="20" textAnchor="middle" className="viz-coach-label">private real time chat</text>

        <g transform="translate(40 140)">
          <text x="0" y="0" className="viz-coach-label">this week’s plan</text>
          {DAYS.map((d, i) => (
            <g key={i} transform={`translate(${i * 34} 0)`}>
              <rect x="0" y="12" width="22" height="58" rx="4" className="viz-coach-slot" />
              <rect
                x="0"
                y={70 - 58 * LOAD[i]}
                width="22"
                height={58 * LOAD[i]}
                rx="4"
                className="viz-coach-fill"
                style={{ animationDelay: `${i * 0.35}s` }}
              />
              <text x="11" y="86" textAnchor="middle" className="viz-coach-day">{d}</text>
            </g>
          ))}
        </g>
        <g transform="translate(290 152)" className="viz-coach-chips">
          {['InBody ↑', 'kcal 2,450', 'protein 160g'].map((c, i) => (
            <g key={c} transform={`translate(0 ${i * 24})`}>
              <rect width="80" height="18" rx="9" />
              <text x="40" y="12.5" textAnchor="middle">{c}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
