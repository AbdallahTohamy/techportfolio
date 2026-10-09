import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const TOPICS = ['Project', 'Job opportunity', 'Collaboration', 'Just saying hi'];
const LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };
const hits = new Map(); // best-effort, per server instance

const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT.max;
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().slice(0, 200);
  const message = String(body.message || '').trim().slice(0, 4000);
  const topic = TOPICS.includes(body.topic) ? body.topic : 'Project';

  // Honeypot: real visitors never see or fill this field.
  if (body.company) return NextResponse.json({ ok: true });

  const errors = {};
  if (name.length < 2) errors.name = 'Please add your name.';
  if (!isEmail(email)) errors.email = 'Please use a valid email address.';
  if (message.length < 10) errors.message = 'A little more detail, please (10+ characters).';
  if (Object.keys(errors).length) return NextResponse.json({ error: 'Please check the form.', errors }, { status: 422 });

  const ip = req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many messages. Please try again in a few minutes.' }, { status: 429 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    return NextResponse.json(
      { error: 'The mail service is not set up yet. Please email me directly.', fallback: true },
      { status: 503 }
    );
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
      to: [to],
      reply_to: email,
      subject: `Portfolio · ${topic} · ${name}`,
      text: `${message}\n\n${name} <${email}>\nTopic: ${topic}`,
      html: `<div style="font-family:system-ui,sans-serif;line-height:1.6;color:#111">
        <p style="color:#666;margin:0 0 4px">New message from your portfolio · <b>${esc(topic)}</b></p>
        <h2 style="margin:0 0 12px">${esc(name)} &lt;${esc(email)}&gt;</h2>
        <p style="white-space:pre-wrap">${esc(message)}</p>
      </div>`,
    }),
  }).catch(() => null);

  if (!res || !res.ok) {
    const detail = res ? await res.text().catch(() => '') : 'network error';
    console.error('Resend error', res?.status, detail);
    return NextResponse.json({ error: 'Could not send right now. Please email me directly.', fallback: true }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
