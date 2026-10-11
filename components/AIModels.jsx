'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ai } from '@/data/content';
import { useInView, usePrefersReducedMotion } from '@/lib/hooks';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import './AIModels.css';

const byId = Object.fromEntries(ai.models.map((m) => [m.id, m]));

export default function AIModels() {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const task = ai.tasks[active];
  const model = byId[task.model];

  // Walk through the jobs slowly until the visitor picks one.
  useEffect(() => {
    if (!auto || !inView || reduced) return;
    const id = setInterval(() => setActive((n) => (n + 1) % ai.tasks.length), 4200);
    return () => clearInterval(id);
  }, [auto, inView, reduced]);

  const pick = (i) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <section id="ai" className="section">
      <div className="container">
        <SectionHead index="04" label="AI" title="The right model for each job.">
          {ai.intro}
        </SectionHead>

        <Reveal className="air panel ticks">
          <div ref={ref} className="air-tasks" role="tablist" aria-label="Jobs">
            <span className="mono air-label">The job</span>
            {ai.tasks.map((t, i) => (
              <button
                key={t.task}
                role="tab"
                aria-selected={i === active}
                className={`air-task ${i === active ? 'is-on' : ''}`}
                onClick={() => pick(i)}
                onMouseEnter={() => pick(i)}
              >
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                {t.task}
              </button>
            ))}
          </div>

          <div className="air-route" aria-hidden>
            <span className="air-route-line">{!reduced && <span key={active} className="air-route-dot" />}</span>
          </div>

          <div className="air-models">
            <span className="mono air-label">The model</span>
            <div className="air-grid">
              {ai.models.map((m) => {
                const on = m.id === model.id;
                return (
                  <div key={m.id} className={`air-model ${on ? 'is-on' : ''}`}>
                    <span className={`air-host mono ${m.host}`}>{m.host === 'self' ? 'self hosted' : 'API'}</span>
                    <strong>{m.name}</strong>
                    <span className="air-role">{m.role}</span>
                  </div>
                );
              })}
            </div>
            <div className="air-why" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="mono">Why {model.name}</span>
                  {task.why}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
        <p className="air-foot mono">{ai.footer}</p>
      </div>
    </section>
  );
}
