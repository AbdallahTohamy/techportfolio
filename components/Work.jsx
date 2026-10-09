'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { filters, projects } from '@/data/content';
import ProjectSheet from './ProjectSheet';
import ProjectVisual from './ProjectVisual';
import SectionHead from './SectionHead';
import './Work.css';

function ProjectCard({ project, index, onOpen }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`card panel ticks ${project.wide ? 'is-wide' : ''}`}
      onClick={() => onOpen(project)}
    >
      <div className="card-visual">
        {project.interactive && <span className="card-live mono">● Drag me</span>}
        <ProjectVisual project={project} />
      </div>
      <div className="card-body">
        <span className="mono">
          {String(index + 1).padStart(2, '0')} · {project.kicker}
        </span>
        <h3>
          <button className="card-title" onClick={(e) => (e.stopPropagation(), onOpen(project))}>
            {project.title}
          </button>
        </h3>
        {(project.site || project.status) && (
          <div className="card-flags">
            {project.site && (
              <a
                href={project.site.href}
                target="_blank"
                rel="noreferrer"
                className="card-link mono"
                onClick={(e) => e.stopPropagation()}
              >
                {project.site.label} ↗
              </a>
            )}
            {project.status && <span className="card-status mono">{project.status}</span>}
          </div>
        )}
        <p className="card-blurb">{project.blurb}</p>
        {project.wide && (
          <ul className="card-points">
            {project.body.slice(0, 3).map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
        <div className="card-foot">
          <p className="card-metric">
            {project.metric.value} <span>{project.metric.label}</span>
          </p>
          <span className="card-more mono">Details →</span>
        </div>
        <div className="card-stack">
          {project.stack.slice(0, 5).map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Work() {
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(null);

  // Other sections (the hero) can open a project's details: dispatch `open-project` with its id.
  useEffect(() => {
    const onOpen = (e) => setOpen(projects.find((p) => p.id === e.detail) || null);
    window.addEventListener('open-project', onOpen);
    return () => window.removeEventListener('open-project', onOpen);
  }, []);
  const shown = projects.filter((p) => filter === 'All' || p.categories.includes(filter));
  const count = (f) => (f === 'All' ? projects.length : projects.filter((p) => p.categories.includes(f)).length);

  return (
    <section id="work" className="section">
      <div className="container">
        <SectionHead index="02" label="Work" title="Products I’ve built.">
          The latest version of each product, plus small working models of the rest. Open any card for the details.
        </SectionHead>

        <LayoutGroup>
          <div className="work-filters" role="tablist" aria-label="Filter projects">
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                className={`work-chip ${filter === f ? 'is-on' : ''}`}
                onClick={() => setFilter(f)}
              >
                {filter === f && (
                  <motion.span layoutId="chip" className="work-chip-bg" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
                )}
                <span>{f}</span>
                <span className="mono work-chip-n">{count(f)}</span>
              </button>
            ))}
          </div>

          <motion.div layout className="work-grid">
            <AnimatePresence mode="popLayout">
              {shown.map((p) => (
                <ProjectCard key={p.id} project={p} index={projects.indexOf(p)} onOpen={setOpen} />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>

      <ProjectSheet project={open} onClose={() => setOpen(null)} />
    </section>
  );
}
