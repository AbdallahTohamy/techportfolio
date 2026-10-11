'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { skillClusters, skillTargets } from '@/data/content';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import './Skills.css';

export default function Skills() {
  const [active, setActive] = useState({ type: 'skill', cluster: 0, name: 'LLM pipelines' });

  const lit = useMemo(() => {
    const cluster = skillClusters[active.cluster];
    if (active.type === 'cluster') return new Set(cluster.skills.flatMap((s) => s.uses));
    return new Set(cluster.skills.find((s) => s.name === active.name)?.uses || []);
  }, [active]);

  const label = active.type === 'cluster' ? skillClusters[active.cluster].name : active.name;

  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHead index="06" label="Skills" title="A toolkit, wired to real work.">
          Hover or tap any skill to see where I have used it in production.
        </SectionHead>

        <div className="sk-layout">
          <div className="sk-clusters">
            {skillClusters.map((c, ci) => {
              const dim = active.type === 'cluster' && active.cluster !== ci;
              return (
                <Reveal key={c.name} delay={ci * 0.05} className={`sk-cluster ${dim ? 'is-dim' : ''}`}>
                  <button
                    className="sk-cluster-name mono"
                    onMouseEnter={() => setActive({ type: 'cluster', cluster: ci })}
                    onFocus={() => setActive({ type: 'cluster', cluster: ci })}
                    onClick={() => setActive({ type: 'cluster', cluster: ci })}
                  >
                    <span>{String(ci + 1).padStart(2, '0')}</span> {c.name}
                  </button>
                  <div className="sk-pills">
                    {c.skills.map((s) => {
                      const on = active.type === 'skill' && active.name === s.name;
                      return (
                        <button
                          key={s.name}
                          className={`sk-pill ${on ? 'is-on' : ''}`}
                          onMouseEnter={() => setActive({ type: 'skill', cluster: ci, name: s.name })}
                          onFocus={() => setActive({ type: 'skill', cluster: ci, name: s.name })}
                          onClick={() => setActive({ type: 'skill', cluster: ci, name: s.name })}
                        >
                          <i aria-hidden />
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </Reveal>
              );
            })}
          </div>

          <aside className="sk-panel panel ticks" aria-live="polite">
            <span className="mono">Used in</span>
            <p className="sk-panel-head">
              <motion.span key={label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                {label}
              </motion.span>
              <span className="sk-count mono">
                {lit.size} / {skillTargets.length}
              </span>
            </p>
            <ul className="sk-targets">
              {skillTargets.map((t) => (
                <li key={t.id} className={lit.has(t.id) ? 'is-lit' : ''}>
                  <i aria-hidden />
                  <span>{t.label}</span>
                  <span className="mono">{t.kind}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
