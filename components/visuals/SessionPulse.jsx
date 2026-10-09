'use client';

import { useEffect, useState } from 'react';
import { useInView, usePrefersReducedMotion } from '@/lib/hooks';
import { hash01, r } from '@/lib/num';

// Visitors (dots) appear around a page and drift into the greeting widget.
const DOTS = Array.from({ length: 9 }, (_, i) => ({
  x: r(8 + hash01(i * 2) * 60, 1),
  y: r(22 + hash01(i * 2 + 1) * 56, 1),
  delay: r(i * 0.62),
  dur: 5.6,
}));

export default function SessionPulse() {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView();
  const [sessions, setSessions] = useState(10412);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(() => setSessions((s) => s + 1), 620);
    return () => clearInterval(id);
  }, [inView, reduced]);

  return (
    <div ref={ref} className={`viz-session ${inView && !reduced ? '' : 'is-paused'}`}>
      <div className="viz-session-page">
        <div className="viz-bar">
          <i />
          <i />
          <i />
          <span className="mono">yoursite.com</span>
        </div>
        <div className="viz-session-body" aria-hidden>
          <span className="sk w60" />
          <span className="sk w40" />
          <span className="sk block" />
          <span className="sk w80" />
          <span className="sk w50" />
          {DOTS.map((d, i) => (
            <span
              key={i}
              className="viz-session-dot"
              style={{ '--sx': `${d.x}%`, '--sy': `${d.y}%`, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }}
            />
          ))}
          <div className="viz-session-widget">
            <span className="viz-session-bubble">Hi there, can I help?</span>
            <span className="viz-session-btn" />
          </div>
        </div>
      </div>
      <div className="viz-session-side">
        <div>
          <span className="mono">sessions</span>
          <strong>{sessions.toLocaleString('en-US')}</strong>
        </div>
        <div>
          <span className="mono">engagement</span>
          <div className="viz-session-bars">
            <span style={{ '--h': '50%' }}>
              <em>before</em>
            </span>
            <span className="up" style={{ '--h': '70%' }}>
              <em>+40%</em>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
