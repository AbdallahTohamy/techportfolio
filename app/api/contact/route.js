import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { profile } from '@/data/content';
import { confirmationEmail, notificationEmail } from '@/lib/emailTemplates';

export const runtime = 'nodejs';

const TOPICS = ['Project', 'Job opportunity', 'Collaboration', 'Just saying hi'];
const LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };
const hits = new Map(); // best effort, per server instance

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT.max;
}

// Gmail SMTP with an App Password. Credentials only ever come from the environment.
let transporter;
function mailer() {
  const user = process.env.GMAIL_ADDRESS;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
  if (!user || !pass) return null;
  transporter ??= nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  return transporter;
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

  const smtp = mailer();
  const from = process.env.GMAIL_ADDRESS;
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || from;
  if (!smtp) {
    return NextResponse.json({ error: 'The mail service is not set up yet. Please email me directly.', fallback: true }, { status: 503 });
  }

  const sender = `"${profile.name}" <${from}>`;
  const data = { name, email, topic, message };

  // 1. Tell Abdallah. This one must succeed, otherwise the request would be lost.
  try {
    const n = notificationEmail(data);
    await smtp.sendMail({ from: sender, to: notifyTo, replyTo: `"${name}" <${email}>`, ...n });
  } catch (err) {
    console.error('Contact notification failed:', err?.message);
    return NextResponse.json({ error: 'Could not send right now. Please email me directly.', fallback: true }, { status: 502 });
  }

  // 2. Confirm to the visitor. If this fails the request is still received, so don't fail the response.
  let confirmed = true;
  try {
    const c = confirmationEmail(data);
    await smtp.sendMail({ from: sender, to: `"${name}" <${email}>`, replyTo: sender, ...c });
  } catch (err) {
    confirmed = false;
    console.error('Contact confirmation failed:', err?.message);
  }

  return NextResponse.json({ ok: true, confirmed });
}
