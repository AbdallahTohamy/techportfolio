'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '@/data/content';
import Reveal from './Reveal';
import './Contact.css';

const TOPICS = ['Project', 'Job opportunity', 'Collaboration', 'Just saying hi'];
const STAGES = ['your message', '/api/contact', 'inbox · Cairo'];

function useClock(timeZone) {
  const [now, setNow] = useState('');
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date());
    setNow(fmt());
    const id = setInterval(() => setNow(fmt()), 1000);
    return () => clearInterval(id);
  }, [timeZone]);
  return now;
}

function ContactForm() {
  const [form, setForm] = useState({ topic: 'Project', name: '', email: '', message: '', company: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    setFieldErrors({});
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFieldErrors(data.errors || {});
        setError(data);
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setError({ error: 'Network problem. Please email me directly.', fallback: true });
      setStatus('error');
    }
  };

  const lit = { idle: 0, sending: 2, sent: 3, error: fieldErrors && Object.keys(fieldErrors).length ? 0 : 1 }[status];
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(`Portfolio · ${form.topic}`)}&body=${encodeURIComponent(form.message)}`;

  return (
    <form className="cf panel ticks" onSubmit={submit} noValidate>
      <div className={`cf-pipe is-${status}`} aria-hidden>
        {STAGES.map((s, i) => (
          <div key={s} className={`cf-stage ${i < lit ? 'is-on' : ''} ${status === 'error' && i === lit ? 'is-err' : ''}`}>
            <span className="cf-node" />
            <span className="mono">{s}</span>
            {i < STAGES.length - 1 && (
              <span className="cf-wire">{status === 'sending' && i === 0 && <span className="cf-packet" />}</span>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="sent"
            className="cf-done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="cf-check">✓</span>
            <h3>Message delivered.</h3>
            <p>Thanks, {form.name.split(' ')[0]}. I will get back to you within a few days. A confirmation is on its way to {form.email}.</p>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setForm((f) => ({ ...f, message: '' }));
                setStatus('idle');
              }}
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.div key="form" className="cf-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <fieldset className="cf-topics">
              <legend className="mono">What is it about?</legend>
              {TOPICS.map((t) => (
                <label key={t} className={`cf-topic ${form.topic === t ? 'is-on' : ''}`}>
                  <input type="radio" name="topic" value={t} checked={form.topic === t} onChange={set('topic')} />
                  {t}
                </label>
              ))}
            </fieldset>

            <div className="cf-row">
              <label className="cf-field">
                <span className="mono">Name</span>
                <input value={form.name} onChange={set('name')} autoComplete="name" required aria-invalid={!!fieldErrors.name} />
                {fieldErrors.name && <em>{fieldErrors.name}</em>}
              </label>
              <label className="cf-field">
                <span className="mono">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                  required
                  aria-invalid={!!fieldErrors.email}
                />
                {fieldErrors.email && <em>{fieldErrors.email}</em>}
              </label>
            </div>

            <label className="cf-field">
              <span className="mono">
                Message <span className="cf-count">{form.message.length} / 4000</span>
              </span>
              <textarea
                rows={5}
                maxLength={4000}
                value={form.message}
                onChange={set('message')}
                placeholder="A few lines about what you’re building, timelines, links…"
                required
                aria-invalid={!!fieldErrors.message}
              />
              {fieldErrors.message && <em>{fieldErrors.message}</em>}
            </label>

            {/* honeypot */}
            <label className="cf-hp" aria-hidden>
              Company
              <input tabIndex={-1} autoComplete="off" value={form.company} onChange={set('company')} />
            </label>

            <div className="cf-actions">
              <button className="btn primary" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message →'}
              </button>
              {status === 'error' && error && (
                <p className="cf-error" role="alert">
                  {error.error}{' '}
                  {error.fallback && (
                    <a href={mailto} className="cf-fallback">
                      Open in your mail app ↗
                    </a>
                  )}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

export default function Contact() {
  const time = useClock(profile.timeZone);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <Reveal className="ct">
          <span className="mono section-index">07 / Contact</span>
          <h2 className="ct-title">
            Have a product, a platform or an idea <br className="ct-br" />
            that needs to <em>ship</em>?
          </h2>
        </Reveal>

        <div className="ct-layout">
          <Reveal className="ct-info" delay={0.05}>
            <div className="ct-email-row">
              <a className="ct-email" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <button className="btn" onClick={copy} aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? 'y' : 'n'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {copied ? 'Copied ✓' : 'Copy'}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>

            <div className="ct-grid">
              <div className="ct-cell">
                <span className="mono">WhatsApp</span>
                <a href={profile.whatsapp} target="_blank" rel="noreferrer">
                  {profile.phone} ↗
                </a>
              </div>
              <div className="ct-cell">
                <span className="mono">Local time · {profile.location}</span>
                <span className="ct-clock">{time || ' '}</span>
              </div>
              <div className="ct-cell">
                <span className="mono">Elsewhere</span>
                <div className="ct-links">
                  {profile.links.map((l) => (
                    <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </div>
              <div className="ct-cell">
                <span className="mono">Résumé</span>
                <a href={profile.cv} target="_blank" rel="noreferrer">
                  Download PDF ↗
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>

      <footer className="container ft">
        <span className="mono">© {new Date().getFullYear()} {profile.name}</span>
        <span className="mono">Built with Next.js, Node.js & Framer Motion · deployed with CI/CD</span>
        <a href="/#top" className="mono">
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
