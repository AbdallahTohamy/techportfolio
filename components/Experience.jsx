import { freelance, shanda } from '@/data/content';
import PipelineDiagram from './PipelineDiagram';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import './Experience.css';

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHead index="01" label="Experience" title="Production systems, end to end.">
          The pipeline I work on every day, then five years of client work.
        </SectionHead>

        <Reveal className="xp panel ticks">
          <header className="xp-head">
            <div>
              <span className="mono">{shanda.period}</span>
              <h3>
                {shanda.role} <span>@ {shanda.company}</span>{' '}
                <a className="xp-now mono" href="https://www.hellohilite.com/" target="_blank" rel="noreferrer">
                  {shanda.now} ↗
                </a>
              </h3>
            </div>
            <span className="tag">{shanda.mode}</span>
          </header>
          <p className="xp-summary">{shanda.summary}</p>
          <PipelineDiagram nodes={shanda.nodes} edges={shanda.edges} />
        </Reveal>

        <Reveal className="xp panel ticks" delay={0.05}>
          <header className="xp-head">
            <div>
              <span className="mono">{freelance.period}</span>
              <h3>
                {freelance.role} <span>@ {freelance.company}</span>
              </h3>
            </div>
            <div className="xp-badges">
              {freelance.badges.map((b) => (
                <span key={b} className="tag">
                  {b}
                </span>
              ))}
            </div>
          </header>
          <div className="xp-rows">
            {freelance.rows.map((r, i) => (
              <Reveal key={r.title} delay={0.08 * i} className="xp-row">
                <p className="xp-metric">{r.metric}</p>
                <span className="mono">{r.unit}</span>
                <h4>{r.title}</h4>
                <p>{r.text}</p>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
