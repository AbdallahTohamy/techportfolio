import { profile } from '@/data/content';
import DeployTerminal from './DeployTerminal';
import './Hero.css';

// Entrance is pure CSS so the headline paints before JavaScript loads (better LCP and SEO).
const rise = (delay) => ({ style: { animationDelay: `${delay}s` } });

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 className="hero-h1">
            <span className="hero-name mono rise" {...rise(0.05)}>
              <span className="hero-dot" aria-hidden /> {profile.name}
              <span className="sr-only">, software engineer: </span>
            </span>
            <span className="hero-title rise-soft">{profile.headline}</span>
          </h1>
          <p className="hero-role rise" {...rise(0.2)}>
            Full stack <span>·</span> DevOps <span>·</span> AI
          </p>
          <p className="hero-sub rise" {...rise(0.28)}>
            {profile.sub}
          </p>
          <div className="hero-actions rise" {...rise(0.36)}>
            <a href="#work" className="btn primary">
              See the work <span aria-hidden>↓</span>
            </a>
            <a href="#contact" className="btn">
              Get in touch
            </a>
            <a href={profile.cv} target="_blank" rel="noreferrer" className="btn">
              Résumé ↗
            </a>
          </div>
        </div>

        <div className="hero-term rise" {...rise(0.3)}>
          <DeployTerminal />
        </div>
      </div>
    </section>
  );
}
