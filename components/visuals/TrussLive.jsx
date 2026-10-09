'use client';

import { useMemo, useRef, useState } from 'react';
import { buildPratt, deckLoad, solve } from '@/lib/truss';
import { useFrame, useInView, usePrefersReducedMotion } from '@/lib/hooks';
import { r } from '@/lib/num';

const PANELS = 6;
const SPAN = 600;
const HEIGHT = 120;
const P = 10; // kN
const SPAN_M = 18; // display span in metres
const F_REF = 15; // force that maps to full stroke weight

const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
const GOLD = [230, 195, 117];
const BLUE = [127, 176, 255];
const IDLE = [125, 138, 160];

export default function TrussLive() {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView();
  const truss = useMemo(() => buildPratt(PANELS, SPAN, HEIGHT), []);
  const [t, setT] = useState(0.5);
  const target = useRef(null);
  const tRef = useRef(0.5);

  useFrame((time, dt) => {
    const goal = target.current ?? 0.5 + 0.38 * Math.sin(time * 0.32);
    const next = tRef.current + (goal - tRef.current) * Math.min(1, dt * (target.current == null ? 1.5 : 9));
    if (Math.abs(next - tRef.current) > 0.0005) {
      tRef.current = next;
      setT(next);
    }
  }, inView && !reduced);

  const { forces, displacements, reactions } = useMemo(() => solve(truss, deckLoad(t, P, PANELS)), [truss, t]);

  const maxDisp = Math.max(...displacements.map(Math.abs)) || 1;
  const scale = 10 / maxDisp;
  const pos = truss.nodes.map((n, i) => ({
    x: r(n.x + displacements[2 * i] * scale),
    y: r(n.y + displacements[2 * i + 1] * scale),
  }));

  let maxT = 0;
  let maxC = 0;
  forces.forEach((f) => {
    if (f > maxT) maxT = f;
    if (f < maxC) maxC = f;
  });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const vbX = ((e.clientX - r.left) / r.width) * 700 - 50;
    const v = Math.min(Math.max(vbX / SPAN, 0), 1);
    target.current = v;
    if (reduced) {
      tRef.current = v;
      setT(v);
    }
  };
  const onLeave = () => (target.current = null);

  const loadX = r(t * SPAN);
  const r0 = -reactions[0].ry;
  const r1 = -reactions[PANELS].ry;

  return (
    <div ref={ref} className="viz-truss" onClick={(e) => e.stopPropagation()}>
      <svg
        viewBox="-50 -190 700 270"
        className="viz-svg"
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={onLeave}
        onPointerUp={(e) => e.pointerType !== 'mouse' && onLeave()}
        style={{ touchAction: 'pan-y', cursor: 'ew-resize' }}
        role="img"
        aria-label="Interactive Pratt truss. Drag along it to move the load; members are coloured by tension and compression."
      >
        {truss.members.map(([a, b], i) => (
          <line
            key={`u${i}`}
            x1={truss.nodes[a].x}
            y1={truss.nodes[a].y}
            x2={truss.nodes[b].x}
            y2={truss.nodes[b].y}
            stroke="rgba(140,170,220,0.14)"
            strokeDasharray="3 5"
          />
        ))}
        {truss.members.map(([a, b], i) => {
          const f = forces[i];
          const k = Math.min(Math.abs(f) / F_REF, 1);
          const c = mix(IDLE, f >= 0 ? GOLD : BLUE, r(Math.min(1, k * 1.6), 3));
          return (
            <line
              key={`m${i}`}
              x1={pos[a].x}
              y1={pos[a].y}
              x2={pos[b].x}
              y2={pos[b].y}
              stroke={`rgb(${c})`}
              strokeOpacity={r(0.35 + 0.65 * k, 3)}
              strokeWidth={r(1.2 + 4 * k)}
              strokeLinecap="round"
            />
          );
        })}
        {pos.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.2" fill="#0a111d" stroke="rgba(231,236,244,0.7)" strokeWidth="1.2" />
        ))}

        <path d="M0 4 L-12 26 L12 26 Z" fill="none" stroke="rgba(231,236,244,0.5)" />
        <circle cx={SPAN - 7} cy="30" r="4" fill="none" stroke="rgba(231,236,244,0.5)" />
        <circle cx={SPAN + 7} cy="30" r="4" fill="none" stroke="rgba(231,236,244,0.5)" />
        <path d={`M${SPAN} 4 L${SPAN - 12} 25 L${SPAN + 12} 25 Z`} fill="none" stroke="rgba(231,236,244,0.5)" />
        <line x1="-30" x2={SPAN + 30} y1="36" y2="36" stroke="rgba(140,170,220,0.25)" />

        <g fontFamily="var(--font-mono)" fontSize="13" fill="var(--muted)">
          <text x="0" y="62" textAnchor="middle">R₁ {r0.toFixed(1)}</text>
          <text x={SPAN} y="62" textAnchor="middle">R₂ {r1.toFixed(1)}</text>
        </g>

        <g transform={`translate(${loadX} 0)`}>
          <line y1={-HEIGHT - 52} y2={-8} stroke="var(--text)" strokeWidth="1.6" />
          <path d="M-6 -14 L0 -3 L6 -14" fill="none" stroke="var(--text)" strokeWidth="1.6" />
          <text y={-HEIGHT - 60} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fill="var(--text)">
            P = {P} kN
          </text>
        </g>
      </svg>

      <div className="viz-truss-read mono">
        <span>x = {(t * SPAN_M).toFixed(1)} m</span>
        <span className="t">max T {maxT.toFixed(1)}</span>
        <span className="c">max C {Math.abs(maxC).toFixed(1)}</span>
        <span>21 members · stiffness method</span>
      </div>
    </div>
  );
}
