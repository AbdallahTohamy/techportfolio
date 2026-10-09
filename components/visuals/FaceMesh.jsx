'use client';

import { useMemo } from 'react';
import { useInView, usePrefersReducedMotion } from '@/lib/hooks';
import { r } from '@/lib/num';

const ellipse = (cx, cy, rx, ry, n, a0 = 0, a1 = Math.PI * 2) =>
  Array.from({ length: n }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / (n - (a1 - a0 >= Math.PI * 2 ? 0 : 1));
    return [r(cx + rx * Math.cos(a), 1), r(cy + ry * Math.sin(a), 1)];
  });

function landmarks() {
  const jaw = ellipse(150, 150, 78, 100, 17, Math.PI * 0.05, Math.PI * 0.95).map(([x, y]) => [x, y + 6]);
  const browL = ellipse(118, 112, 26, 10, 5, Math.PI * 1.1, Math.PI * 1.9);
  const browR = ellipse(182, 112, 26, 10, 5, Math.PI * 1.1, Math.PI * 1.9);
  const eyeL = ellipse(118, 128, 15, 6, 6);
  const eyeR = ellipse(182, 128, 15, 6, 6);
  const nose = [[150, 128], [150, 145], [150, 162], [140, 172], [150, 175], [160, 172]];
  const mouth = ellipse(150, 200, 24, 9, 10);
  const cheekL = [104, 168];
  const cheekR = [196, 168];
  return { jaw, browL, browR, eyeL, eyeR, nose, mouth, cheekL, cheekR };
}

const toPath = (pts, close) => `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L')}${close ? ' Z' : ''}`;

export default function FaceMesh() {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView();
  const lm = useMemo(landmarks, []);
  const all = [lm.jaw, lm.browL, lm.browR, lm.eyeL, lm.eyeR, lm.nose, lm.mouth, [lm.cheekL, lm.cheekR]].flat();

  // A light triangulation: jaw points fan out to cheek/nose/mouth anchors, anchors link to features.
  const mesh = useMemo(() => {
    const { jaw, eyeL, eyeR, browL, browR, nose, mouth, cheekL, cheekR } = lm;
    const anchors = [cheekL, cheekR, mouth[0], mouth[5], nose[4], eyeL[3], eyeR[0]];
    const lines = [];
    jaw.forEach((p) => {
      const [q] = anchors.map((a) => [a, Math.hypot(a[0] - p[0], a[1] - p[1])]).sort((a, b) => a[1] - b[1])[0];
      lines.push([p, q]);
    });
    [
      [cheekL, eyeL[3]], [cheekL, nose[3]], [cheekL, mouth[5]], [cheekL, eyeL[1]],
      [cheekR, eyeR[0]], [cheekR, nose[5]], [cheekR, mouth[0]], [cheekR, eyeR[2]],
      [eyeL[0], nose[0]], [eyeR[3], nose[0]], [nose[3], mouth[6]], [nose[5], mouth[9]],
      [browL[4], browR[0]], [browL[0], eyeL[3]], [browR[4], eyeR[0]], [nose[4], mouth[8]],
    ].forEach((l) => lines.push(l));
    return lines;
  }, [lm]);

  const contours = [
    [lm.jaw, false], [lm.browL, false], [lm.browR, false], [lm.eyeL, true], [lm.eyeR, true], [lm.nose, false], [lm.mouth, true],
  ];

  return (
    <div ref={ref} className={`viz-face ${inView && !reduced ? '' : 'is-paused'} ${reduced ? 'is-static' : ''}`}>
      <svg viewBox="0 0 300 300" className="viz-svg" aria-hidden>
        <g className="viz-face-box">
          <path d="M52 40 h22 M52 40 v22 M248 40 h-22 M248 40 v22 M52 280 h22 M52 280 v-22 M248 280 h-22 M248 280 v-22" />
          <text x="52" y="30">face · 0.98</text>
          <text x="248" y="30" textAnchor="end">{all.length} pts</text>
        </g>
        <g className="viz-face-mesh">
          {mesh.map(([p, q], i) => (
            <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} pathLength="1" style={{ animationDelay: `${r(0.6 + i * 0.03)}s` }} />
          ))}
        </g>
        <g className="viz-face-lines">
          {contours.map(([pts, close], i) => (
            <path key={i} d={toPath(pts, close)} pathLength="1" style={{ animationDelay: `${r(i * 0.15)}s` }} />
          ))}
        </g>
        <g className="viz-face-pts">
          {all.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2" style={{ animationDelay: `${r((i % 17) * 0.06)}s` }} />
          ))}
        </g>
        <line className="viz-face-scan" x1="60" x2="240" y1="0" y2="0" />
      </svg>
    </div>
  );
}
