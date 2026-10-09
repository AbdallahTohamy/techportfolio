'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, usePrefersReducedMotion } from '@/lib/hooks';
import { r } from '@/lib/num';

const EVENTS = [
  ['/pricing', 'click', 'start trial'],
  ['/checkout', 'error', '500 → alert sent'],
  ['/', 'scroll', '78% depth'],
  ['/docs/setup', 'view', 'from google'],
  ['/checkout', 'resolved', 'fixed in 4m'],
  ['/blog/launch', 'view', 'from twitter'],
  ['/pricing', 'rage click', 'slow button'],
  ['/signup', 'submit', 'new account'],
];
const N = 32;

// A usage-monitoring dashboard: live cursors on a page, a rolling sessions chart and an event feed.
export default function LiveMonitor() {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView();
  const svg = useRef(null);
  const [series, setSeries] = useState(() => Array.from({ length: N }, (_, i) => r(30 + 12 * Math.sin(i / 3) + (i % 5) * 2, 1)));
  const [feed, setFeed] = useState(() => EVENTS.slice(0, 4).map((e, i) => ({ id: i, e })));
  const tick = useRef(4);

  useEffect(() => {
    const s = svg.current;
    if (s && s.pauseAnimations) inView && !reduced ? s.unpauseAnimations() : s.pauseAnimations();
    if (!inView || reduced) return;
    const id = setInterval(() => {
      const k = tick.current++;
      setSeries((prev) => [...prev.slice(1), r(Math.max(8, Math.min(58, prev[prev.length - 1] + Math.sin(k * 1.7) * 9)), 1)]);
      setFeed((prev) => [{ id: k, e: EVENTS[k % EVENTS.length] }, ...prev].slice(0, 4));
    }, 1800);
    return () => clearInterval(id);
  }, [inView, reduced]);

  const live = Math.round(series[series.length - 1]);
  const pts = series.map((v, i) => `${r((i / (N - 1)) * 220, 1)},${r(64 - v, 1)}`).join(' ');

  return (
    <div ref={ref} className="viz-monitor">
      <div className="viz-window viz-monitor-page">
        <div className="viz-bar">
          <i />
          <i />
          <i />
          <span className="viz-url mono">
            watching · yoursite.com
          </span>
        </div>
        <svg ref={svg} viewBox="0 0 300 170" className="viz-svg" aria-hidden>
          <rect x="18" y="16" width="140" height="10" rx="5" className="sk-svg" />
          <rect x="18" y="34" width="90" height="7" rx="3.5" className="sk-svg" />
          <rect x="18" y="54" width="170" height="54" rx="6" className="sk-svg" />
          <rect x="200" y="54" width="82" height="54" rx="6" className="sk-svg" />
          <rect x="18" y="120" width="120" height="7" rx="3.5" className="sk-svg" />
          <rect x="18" y="134" width="200" height="7" rx="3.5" className="sk-svg" />
          <path id="lm-c1" d="M40 30 C 120 40, 160 90, 230 80 S 260 140, 120 140 Z" fill="none" />
          <path id="lm-c2" d="M250 30 C 200 60, 90 70, 70 120 S 180 150, 250 30" fill="none" />
          {[['lm-c1', 'a', 11], ['lm-c2', 'b', 14]].map(([p, c, dur]) => (
            <g key={p}>
              <path d="M0 0 L0 13 L4 9 L7 15 L9 14 L6 8 L11 8 Z" className={`viz-monitor-cursor ${c}`} />
              <animateMotion dur={`${dur}s`} repeatCount="indefinite">
                <mpath href={`#${p}`} />
              </animateMotion>
            </g>
          ))}
          <circle cx="232" cy="80" r="10" className="viz-monitor-heat" />
          <circle cx="120" cy="138" r="7" className="viz-monitor-heat" />
        </svg>
      </div>

      <div className="viz-monitor-side">
        <div className="viz-monitor-kpi">
          <span className="mono">live visitors</span>
          <strong>{live}</strong>
        </div>
        <svg viewBox="0 0 220 64" className="viz-monitor-spark" preserveAspectRatio="none" aria-hidden>
          <polyline points={`0,64 ${pts} 220,64`} className="area" />
          <polyline points={pts} className="line" />
        </svg>
        <ul className="viz-monitor-feed">
          {feed.map(({ id, e: [page, kind, note] }) => (
            <li key={id} className={kind === 'error' || kind === 'rage click' ? 'is-warn' : kind === 'resolved' ? 'is-ok' : ''}>
              <span className="mono">{kind}</span>
              <span>{page}</span>
              <em>{note}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
