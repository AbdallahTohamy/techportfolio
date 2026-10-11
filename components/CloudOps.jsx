'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cloud } from '@/data/content';
import { useInView, useMediaQuery, usePrefersReducedMotion } from '@/lib/hooks';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import './CloudOps.css';

const label = (v, provider) => (typeof v === 'string' ? v : v[provider]);
const SCALE_STEPS = [0, 1, 2, 3, 3, 2, 1, 0];

// Place every node of a pattern for the wide (left to right) or narrow (top to bottom) layout.
function layout(tiers, narrow) {
  if (!narrow) {
    const W = 1000;
    const n = tiers.length;
    const w = n >= 5 ? 180 : 200;
    const h = 60;
    const H = 380;
    const nodes = tiers.map((tier, i) => {
      const x = w / 2 + 12 + (i * (W - w - 24)) / (n - 1);
      return tier.map((node, j) => ({ ...node, x, y: H / 2 + (j - (tier.length - 1) / 2) * 84, w, h }));
    });
    return { W, H, nodes, dir: 'x' };
  }
  const W = 380;
  const rowH = 118;
  const nodes = tiers.map((tier, i) => {
    const k = tier.length;
    const w = k === 3 ? 112 : k === 2 ? 168 : 220;
    const xs = k === 3 ? [64, 190, 316] : k === 2 ? [100, 280] : [190];
    return tier.map((node, j) => ({ ...node, x: xs[j], y: 70 + i * rowH, w, h: 56 }));
  });
  return { W, H: 70 + (tiers.length - 1) * rowH + 60, nodes, dir: 'y' };
}

function edgePath(a, b, dir) {
  return dir === 'x'
    ? `M ${a.x + a.w / 2} ${a.y} L ${b.x - b.w / 2} ${b.y}`
    : `M ${a.x} ${a.y + a.h / 2} L ${b.x} ${b.y - b.h / 2}`;
}

function Diagram({ pattern, provider, narrow, reduced, inView }) {
  const svg = useRef(null);
  const [step, setStep] = useState(3);
  const L = useMemo(() => layout(pattern.tiers, narrow), [pattern, narrow]);
  const live = pattern.scale == null ? null : reduced ? 3 : SCALE_STEPS[step % SCALE_STEPS.length];

  useEffect(() => {
    if (pattern.scale == null || !inView || reduced) return;
    const id = setInterval(() => setStep((s) => s + 1), 1600);
    return () => clearInterval(id);
  }, [pattern, inView, reduced]);

  useEffect(() => {
    const s = svg.current;
    if (s && s.pauseAnimations) inView && !reduced ? s.unpauseAnimations() : s.pauseAnimations();
  }, [inView, reduced, pattern, provider, narrow, live]);

  const isOn = (ti, j) => pattern.scale !== ti || j < live;

  const edges = [];
  L.nodes.forEach((tier, ti) => {
    const next = L.nodes[ti + 1];
    if (!next) return;
    tier.forEach((a, ai) => next.forEach((b, bi) => edges.push({ a, b, on: isOn(ti, ai) && isOn(ti + 1, bi), key: `${ti}-${ai}-${bi}` })));
  });

  const g = pattern.group;
  let box = null;
  if (g) {
    const inside = L.nodes.slice(g.from, g.to + 1).flat();
    const x0 = Math.min(...inside.map((n) => n.x - n.w / 2)) - 14;
    const x1 = Math.max(...inside.map((n) => n.x + n.w / 2)) + 14;
    const y0 = Math.min(...inside.map((n) => n.y - n.h / 2)) - 30;
    const y1 = Math.max(...inside.map((n) => n.y + n.h / 2)) + 14;
    box = { x0, y0, w: x1 - x0, h: y1 - y0, text: label(g.label, provider) + (live != null ? ` · ${live} running` : '') };
  }

  return (
    <svg
      ref={svg}
      viewBox={`0 0 ${L.W} ${L.H}`}
      className="co-svg"
      key={`${pattern.id}-${narrow ? 'n' : 'w'}-${live}`}
      role="img"
      aria-label={`${pattern.name} architecture on ${provider}: ${pattern.tiers.map((t) => t.map((n) => label(n.title, provider)).join(', ')).join(' to ')}`}
    >
      {box && (
        <g className="co-group">
          <rect x={box.x0} y={box.y0} width={box.w} height={box.h} rx="14" />
          <text x={box.x0 + 14} y={box.y0 + 19}>{box.text}</text>
        </g>
      )}
      {edges.map((e, k) => (
        <g key={e.key}>
          <path id={`co-${pattern.id}-${k}`} d={edgePath(e.a, e.b, L.dir)} className={`co-edge ${e.on ? '' : 'is-off'}`} />
          {e.on && !reduced && (
            <circle r="3.2" className="co-pkt">
              <animateMotion dur="1.8s" repeatCount="indefinite" begin={`-${(k * 0.43) % 1.8}s`}>
                <mpath href={`#co-${pattern.id}-${k}`} />
              </animateMotion>
            </circle>
          )}
        </g>
      ))}
      {L.nodes.map((tier, ti) =>
        tier.map((n, j) => {
          const on = isOn(ti, j);
          return (
            <g key={`${ti}-${j}`} className={`co-node ${on ? '' : 'is-off'} ${ti === 0 ? 'is-user' : ''}`} transform={`translate(${n.x - n.w / 2} ${n.y - n.h / 2})`}>
              <rect width={n.w} height={n.h} rx="10" />
              <text x={n.w / 2} y={n.h / 2 - 3} textAnchor="middle" className="co-title">
                {on ? label(n.title, provider) : 'idle'}
              </text>
              <text x={n.w / 2} y={n.h / 2 + 14} textAnchor="middle" className="co-sub">
                {n.sub}
              </text>
            </g>
          );
        })
      )}
    </svg>
  );
}

function Pipeline({ pipe, inView, reduced }) {
  const [at, setAt] = useState(reduced ? pipe.stages.length : 0);
  useEffect(() => {
    setAt(reduced ? pipe.stages.length : 0);
    if (!inView || reduced) return;
    const id = setInterval(() => setAt((n) => (n > pipe.stages.length + 2 ? 0 : n + 1)), 700);
    return () => clearInterval(id);
  }, [pipe, inView, reduced]);

  return (
    <ol className="co-stages" aria-label={`${pipe.name} stages`}>
      {pipe.stages.map((s, i) => (
        <li key={s} className={i < at ? 'is-done' : i === at ? 'is-run' : ''}>
          <span className="co-chip">
            <span className="co-stage-dot" aria-hidden />
            {s}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function CloudOps() {
  const reduced = usePrefersReducedMotion();
  const narrow = useMediaQuery('(max-width: 760px)');
  const [ref, inView] = useInView();
  const [pid, setPid] = useState(cloud.patterns[0].id);
  const [provider, setProvider] = useState('aws');
  const [pipeId, setPipeId] = useState(cloud.pipelines[0].id);
  const pattern = cloud.patterns.find((p) => p.id === pid);
  const pipe = cloud.pipelines.find((p) => p.id === pipeId);

  return (
    <section id="cloud" className="section">
      <div className="container">
        <SectionHead index="03" label="Cloud" title="Hosting set up for each job.">
          {cloud.intro}
        </SectionHead>

        <Reveal className="co panel ticks">
          <div ref={ref} className="co-bar">
            <div className="co-tabs" role="tablist" aria-label="Hosting setup">
              {cloud.patterns.map((p) => (
                <button key={p.id} role="tab" aria-selected={p.id === pid} className={p.id === pid ? 'is-on' : ''} onClick={() => setPid(p.id)}>
                  {p.name}
                </button>
              ))}
            </div>
            <div className="co-providers" role="radiogroup" aria-label="Cloud provider">
              {cloud.providers.map((pr) => (
                <button
                  key={pr.id}
                  role="radio"
                  aria-checked={pr.id === provider}
                  className={`mono ${pr.id === provider ? 'is-on' : ''}`}
                  onClick={() => setProvider(pr.id)}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>

          <div className="co-body">
            <div className="co-diagram">
              <Diagram pattern={pattern} provider={provider} narrow={narrow} reduced={reduced} inView={inView} />
            </div>
            <div className="co-notes" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  className="co-notes-in"
                  key={pattern.id + provider}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <h3>{pattern.name}</h3>
                    <p className="co-line">{pattern.line}</p>
                  </div>
                  <ul>
                    {pattern.notes.map((n, i) => (
                      <li key={i}>{label(n, provider)}</li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="co-ci">
            <div className="co-ci-head">
              <span className="mono">Shipped through CI/CD</span>
              <div className="co-ci-tabs" role="tablist" aria-label="CI/CD platform">
                {cloud.pipelines.map((p) => (
                  <button key={p.id} role="tab" aria-selected={p.id === pipeId} className={p.id === pipeId ? 'is-on' : ''} onClick={() => setPipeId(p.id)}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <Pipeline pipe={pipe} inView={inView} reduced={reduced} />
            <p className="co-ci-line">{pipe.line}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
