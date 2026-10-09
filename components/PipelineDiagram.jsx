'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInView, useMediaQuery, usePrefersReducedMotion } from '@/lib/hooks';
import './PipelineDiagram.css';

// Two hand-placed layouts: a snake across two rows on desktop, a single column on phones.
const LAYOUTS = {
  wide: {
    view: [1000, 340],
    size: [200, 64],
    pos: {
      upload: [105, 50], ffmpeg: [370, 50], llm: [635, 50], enhance: [895, 50],
      api: [895, 180], rss: [635, 180], dist: [370, 180], db: [895, 300],
    },
    sizeOverride: {},
  },
  narrow: {
    view: [380, 570],
    size: [180, 54],
    pos: {
      upload: [110, 36], ffmpeg: [110, 114], llm: [110, 192], enhance: [110, 270],
      api: [110, 348], rss: [110, 426], dist: [110, 504], db: [300, 348],
    },
    sizeOverride: { db: [140, 54] },
  },
};

function edgePath(a, b, sa, sb) {
  const [ax, ay] = a;
  const [bx, by] = b;
  if (Math.abs(ay - by) < 1) {
    const dir = Math.sign(bx - ax);
    return `M ${ax + (dir * sa[0]) / 2} ${ay} L ${bx - (dir * sb[0]) / 2} ${by}`;
  }
  if (Math.abs(ax - bx) < 1) {
    const dir = Math.sign(by - ay);
    return `M ${ax} ${ay + (dir * sa[1]) / 2} L ${bx} ${by - (dir * sb[1]) / 2}`;
  }
  const dirY = Math.sign(by - ay);
  return `M ${ax} ${ay + (dirY * sa[1]) / 2} L ${ax} ${by} L ${bx - (Math.sign(bx - ax) * sb[0]) / 2} ${by}`;
}

export default function PipelineDiagram({ nodes, edges }) {
  const narrow = useMediaQuery('(max-width: 720px)');
  const reduced = usePrefersReducedMotion();
  const L = LAYOUTS[narrow ? 'narrow' : 'wide'];
  const [selected, setSelected] = useState(nodes[2].id);
  const [auto, setAuto] = useState(true);
  const [wrapRef, inView] = useInView();
  const svgRef = useRef(null);

  const byId = useMemo(() => Object.fromEntries(nodes.map((n, i) => [n.id, { ...n, index: i }])), [nodes]);
  const sizeOf = (id) => L.sizeOverride[id] || L.size;

  // Gently walk through the stages until the visitor takes over.
  useEffect(() => {
    if (!auto || !inView || reduced) return;
    const id = setInterval(() => {
      setSelected((cur) => nodes[(nodes.findIndex((n) => n.id === cur) + 1) % nodes.length].id);
    }, 3800);
    return () => clearInterval(id);
  }, [auto, inView, reduced, nodes]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !svg.pauseAnimations) return;
    inView ? svg.unpauseAnimations() : svg.pauseAnimations();
  }, [inView, narrow]);

  const pick = (id) => {
    setAuto(false);
    setSelected(id);
  };
  const sel = byId[selected];

  return (
    <div ref={wrapRef} className="pd">
      <div className="pd-canvas">
        <svg ref={svgRef} viewBox={`0 0 ${L.view[0]} ${L.view[1]}`} className="pd-svg" key={narrow ? 'n' : 'w'}>
          <defs>
            <marker id="pd-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" className="pd-arrowhead" />
            </marker>
          </defs>

          {edges.map(([a, b], k) => {
            const d = edgePath(L.pos[a], L.pos[b], sizeOf(a), sizeOf(b));
            const lit = selected === a || selected === b;
            return (
              <g key={`${a}-${b}`}>
                <path id={`pd-e-${k}`} d={d} className={`pd-edge ${lit ? 'is-lit' : ''}`} markerEnd="url(#pd-arrow)" />
                {!reduced &&
                  [0, 1].map((j) => (
                    <circle key={j} r="2.6" className="pd-packet">
                      <animateMotion dur="2.6s" repeatCount="indefinite" begin={`-${k * 0.37 + j * 1.3}s`}>
                        <mpath href={`#pd-e-${k}`} />
                      </animateMotion>
                    </circle>
                  ))}
              </g>
            );
          })}

          {nodes.map((n, i) => {
            const [x, y] = L.pos[n.id];
            const [w, h] = sizeOf(n.id);
            const active = n.id === selected;
            return (
              <g
                key={n.id}
                className={`pd-node ${active ? 'is-active' : ''}`}
                transform={`translate(${x - w / 2} ${y - h / 2})`}
                tabIndex={0}
                role="button"
                aria-pressed={active}
                aria-label={`${n.title}: ${n.metric} ${n.unit}`}
                onMouseEnter={() => pick(n.id)}
                onFocus={() => pick(n.id)}
                onClick={() => pick(n.id)}
              >
                <rect width={w} height={h} rx="10" />
                <text x="16" y={h / 2 - 7} className="pd-tag">
                  {String(i + 1).padStart(2, '0')} · {n.tag}
                </text>
                <text x="16" y={h / 2 + 15} className="pd-title">
                  {n.title}
                </text>
              </g>
            );
          })}

          {!narrow && (
            <g className="pd-legend" transform="translate(10 280)">
              <circle cx="4" cy="-4" r="2.6" className="pd-packet" />
              <text x="14" y="0">audio moving through production</text>
              <text x="0" y="22">hover a stage to inspect it</text>
            </g>
          )}
        </svg>
      </div>

      <div className="pd-detail" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={sel.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mono">
              stage {String(sel.index + 1).padStart(2, '0')} · {sel.tag}
            </span>
            <h4>{sel.title}</h4>
            <p className="pd-metric">
              {sel.metric} <span>{sel.unit}</span>
            </p>
            <p className="pd-text">{sel.detail}</p>
          </motion.div>
        </AnimatePresence>
        <div className="pd-dots" aria-hidden>
          {nodes.map((n) => (
            <span key={n.id} className={n.id === selected ? 'is-on' : ''} />
          ))}
        </div>
      </div>
    </div>
  );
}
