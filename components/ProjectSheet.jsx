'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import SessionPulse from './visuals/SessionPulse';
import './visuals/visuals.css';
import './ProjectSheet.css';

export default function ProjectSheet({ project, onClose }) {
  const closeRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!project) return;
    const prev = document.activeElement;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      prev?.focus?.();
    };
  }, [project, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <motion.aside
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-top">
              <span className="mono">{project.kicker}</span>
              <button ref={closeRef} className="sheet-close mono" onClick={onClose}>
                Close ✕
              </button>
            </div>

            <h3 className="sheet-title">{project.title}</h3>
            {project.status && <span className="sheet-status mono">{project.status}</span>}
            <p className="sheet-blurb">{project.blurb}</p>

            <div className="sheet-metric">
              <strong>{project.metric.value}</strong>
              <span>{project.metric.label}</span>
            </div>

            <ul className="sheet-list">
              {project.body.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            {(project.site || project.links) && (
              <div className="sheet-links">
                {project.site && (
                  <a href={project.site.href} target="_blank" rel="noreferrer" className="btn primary">
                    Visit {project.site.label} ↗
                  </a>
                )}
                {project.links?.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}

            <div className="sheet-block">
              <span className="mono">Stack</span>
              <div className="sheet-tags">
                {project.stack.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {project.sessionDemo && (
              <div className="sheet-block">
                <span className="mono">How the widget works</span>
                <div className="sheet-viz">
                  <SessionPulse />
                </div>
              </div>
            )}

            {(project.media || project.screens) && (
              <div className="sheet-block">
                <span className="mono">{project.site ? `Latest from ${project.site.label}` : 'Screens'}</span>
                <div className="sheet-media">
                  {project.media?.map((m) =>
                    m.type === 'video' ? (
                      <video key={m.src} src={m.src} poster={m.poster} controls muted playsInline preload="metadata" />
                    ) : (
                      <figure key={m.src}>
                        <Image src={m.src} alt={m.alt} width={1440} height={900} sizes="(max-width: 700px) 100vw, 600px" />
                        <figcaption className="mono">{m.alt}</figcaption>
                      </figure>
                    )
                  )}
                  {project.screens?.map((g) => (
                    <figure key={g.src}>
                      <Image src={g.src} alt={g.alt} width={1440} height={900} sizes="(max-width: 700px) 100vw, 600px" />
                      <figcaption className="mono">{g.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
