'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, usePrefersReducedMotion } from '@/lib/hooks';

const STAGES = ['lint', 'test', 'build', 'docker', 'deploy', 'health'];

// Each script line: [text, delay before it (ms), kind, stage it completes]
const SCRIPTS = {
  deploy: [
    ['$ git push origin main', 0, 'cmd'],
    ['remote: CI triggered · pipeline #1842 · evvot/web', 500, 'dim'],
    ['eslint · 0 problems', 700, 'ok', 'lint', 'lint'],
    ['jest · 212 passed · coverage 87%', 1300, 'ok', 'test', 'test'],
    ['next build · 38 routes · 31.6s', 1400, 'ok', 'build', 'build'],
    ['image evvot/web:3f9c2e1 · 142 MB · pushed', 1000, 'ok', 'docker', 'docker'],
    ['rolling update 3/3 pods · zero downtime', 1200, 'ok', 'deploy', 'deploy'],
    ['GET /api/health 200 · p95 84 ms', 800, 'ok', 'health', 'health'],
    ['✓ deployed to production in 1m 52s', 500, 'done'],
  ],
  test: [
    ['$ npm test', 0, 'cmd'],
    ['PASS  api/auth.test.ts (31)', 600, 'ok', null, 'test'],
    ['PASS  api/billing.test.ts (24) · stripe webhooks', 500, 'ok'],
    ['PASS  editor/timeline.test.ts (57)', 500, 'ok'],
    ['PASS  workers/ffmpeg.test.ts (18)', 500, 'ok'],
    ['Tests: 212 passed · coverage 87%', 500, 'done', 'test'],
  ],
  rollback: [
    ['$ deploy rollback', 0, 'cmd'],
    ['↺ switching traffic to evvot/web:a17d09b', 700, 'warn', null, 'deploy'],
    ['3/3 pods healthy · rollback took 9s', 1100, 'ok', 'deploy'],
    ['✓ production is on the previous release', 400, 'done'],
  ],
  scale: [
    ['$ scale api 4', 0, 'cmd'],
    ['load 78% · autoscaler adding 2 replicas', 700, 'warn', null, 'deploy'],
    ['api 2 → 4 replicas · ready', 1200, 'ok', 'deploy'],
    ['✓ p95 latency 84 ms → 61 ms', 500, 'done'],
  ],
  status: [
    ['$ status', 0, 'cmd'],
    ['web     ● 3 pods   Next.js       healthy', 300, 'plain'],
    ['api     ● 2 pods   Node.js       healthy', 150, 'plain'],
    ['worker  ● 2 pods   FFmpeg        healthy', 150, 'plain'],
    ['llm     ● 2 pods   Whisper·Qwen  healthy', 150, 'plain'],
    ['db      ● primary  MySQL         healthy', 150, 'plain'],
    ['uptime 99.99% · last deploy 4 min ago', 300, 'done'],
  ],
  pods: [
    ['$ kubectl get pods', 0, 'cmd'],
    ['NAME      READY  STATUS', 400, 'dim'],
    ['web       3/3    Running', 150, 'plain'],
    ['api       2/2    Running', 150, 'plain'],
    ['worker    2/2    Running', 150, 'plain'],
    ['whisper   1/1    Running', 150, 'plain'],
    ['qwen      1/1    Running', 150, 'plain'],
    ['✓ 5 deployments · all pods ready', 400, 'done'],
  ],
  llm: [
    ['$ docker compose up whisper qwen deepseek minimax', 0, 'cmd'],
    ['whisper · speech to text · GPU · ready', 900, 'ok'],
    ['qwen · chat & tools · ready', 700, 'ok'],
    ['deepseek · reasoning · ready', 700, 'ok'],
    ['minimax · long context · ready', 700, 'ok'],
    ['POST /v1/chat/completions 200 · served locally', 600, 'plain'],
    ['✓ private inference, no data leaves the server', 400, 'done'],
  ],
};
const COMMANDS = ['deploy', 'test', 'scale', 'rollback', 'pods', 'llm', 'status'];
const HELP = [
  ['$ help', 0, 'cmd'],
  ['deploy · test · scale · rollback · pods · llm · status · clear', 200, 'plain'],
];

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export default function DeployTerminal() {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView({ rootMargin: '0px' });
  const [lines, setLines] = useState([]);
  const [stages, setStages] = useState({});
  const [running, setRunning] = useState(null);
  const [replicas, setReplicas] = useState(2);
  const [input, setInput] = useState('');
  const run = useRef(0);
  const body = useRef(null);
  const started = useRef(false);

  const exec = async (name) => {
    const id = ++run.current;
    const script = SCRIPTS[name] || HELP;
    setRunning(name);
    if (name === 'deploy') setStages({});
    if (name === 'scale') setReplicas(2);
    for (const [text, delay, kind, done, start] of script) {
      if (start) setStages((s) => ({ ...s, [start]: 'run' }));
      if (!reduced) await wait(delay);
      if (run.current !== id) return;
      setLines((l) => [...l.slice(-40), { text, kind, key: `${id}-${text}` }]);
      if (done) setStages((s) => ({ ...s, [done]: 'ok' }));
      if (name === 'scale' && text.startsWith('api 2')) setReplicas(4);
      if (name === 'rollback' && kind === 'done') setReplicas(2);
    }
    setRunning(null);
  };

  // Run a deploy the first time the terminal is seen.
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    exec('deploy');
  }, [inView]);

  useEffect(() => {
    const el = body.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    setInput('');
    if (!cmd) return;
    if (cmd === 'clear') {
      run.current++;
      setLines([]);
      setRunning(null);
      return;
    }
    if (cmd.startsWith('kubectl')) return exec('pods');
    if (SCRIPTS[cmd] || cmd === 'help') return exec(cmd);
    setLines((l) => [...l, { text: `$ ${cmd}`, kind: 'cmd', key: `u-${Date.now()}` }, { text: `command not found: ${cmd}. Try help`, kind: 'err', key: `e-${Date.now()}` }]);
  };

  return (
    <div ref={ref} className="term">
      <div className="term-bar">
        <i />
        <i />
        <i />
        <span className="mono">abdallah@prod: ~/evvot</span>
        <span className={`term-state mono ${running ? 'is-run' : ''}`}>{running ? `running ${running}` : 'idle'}</span>
      </div>

      <ol className="term-stages" aria-label="Pipeline">
        {STAGES.map((s) => (
          <li key={s} className={`mono ${stages[s] === 'ok' ? 'is-ok' : stages[s] === 'run' ? 'is-run' : ''}`}>
            <span className="term-stage-dot" />
            {s}
          </li>
        ))}
      </ol>

      <div ref={body} className="term-body" aria-live="polite">
        {lines.map((l) => (
          <p key={l.key} className={`term-line ${l.kind}`}>
            {l.kind === 'ok' && <span className="term-check">✓ </span>}
            {l.text}
          </p>
        ))}
        <form className="term-prompt" onSubmit={submit}>
          <span className="term-ps1">$</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={running ? '' : 'type a command, or try the buttons below'}
            aria-label="Terminal command"
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>

      <div className="term-services" aria-label="Services">
        {[
          ['web', 'Next.js', 3],
          ['api', 'Node.js', replicas],
          ['worker', 'FFmpeg', 2],
          ['llm', 'Whisper · Qwen', 2],
          ['db', 'MySQL', 1],
        ].map(([name, tech, n]) => (
          <div key={name} className="term-svc">
            <span className="mono">{name}</span>
            <span className="term-pods" aria-label={`${n} running`}>
              {Array.from({ length: n }, (_, i) => (
                <i key={i} />
              ))}
            </span>
            <em className="mono">{tech}</em>
          </div>
        ))}
      </div>

      <div className="term-actions">
        {COMMANDS.map((c) => (
          <button key={c} className={`term-btn mono ${running === c ? 'is-on' : ''}`} onClick={() => exec(c)}>
            {c}
          </button>
        ))}
        <span className="term-note mono">demo pipeline</span>
      </div>
    </div>
  );
}
