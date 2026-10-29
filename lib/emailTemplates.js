// Email templates for the contact form. Table based, inline styles: renders in Gmail, Outlook and Apple Mail.
import { profile } from '@/data/content';
import { siteUrl } from '@/lib/site';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const C = {
  bg: '#f4f5f7',
  card: '#ffffff',
  ink: '#0e1727',
  text: '#3b4558',
  muted: '#7d8aa0',
  line: '#e6e9ee',
  gold: '#c9a253',
  goldSoft: '#fbf5e8',
};

const linkedin = profile.links.find((l) => l.label === 'LinkedIn')?.href;
const city = profile.location.split(',')[0];

function layout({ preheader, body }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(profile.name)}</title></head>
<body style="margin:0;padding:0;background:${C.bg};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.card};border-radius:14px;overflow:hidden;border:1px solid ${C.line};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<tr><td style="background:${C.ink};padding:22px 28px;">
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="width:38px;height:38px;border-radius:9px;background:#1a2438;border:1px solid ${C.gold};color:${C.gold};font-weight:600;font-size:14px;text-align:center;vertical-align:middle;">AE</td>
    <td style="padding-left:12px;color:#e7ecf4;font-size:15px;font-weight:600;">${esc(profile.name)}<br><span style="color:${C.muted};font-size:12px;font-weight:400;">Full stack · DevOps · AI</span></td>
  </tr></table>
</td></tr>
<tr><td style="height:3px;background:${C.gold};line-height:3px;font-size:0;">&nbsp;</td></tr>
<tr><td style="padding:30px 28px 8px;color:${C.text};font-size:15px;line-height:1.65;">${body}</td></tr>
<tr><td style="padding:8px 28px 28px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line};"><tr><td style="padding-top:18px;color:${C.muted};font-size:12px;line-height:1.6;">
    <a href="${siteUrl}" style="color:${C.ink};text-decoration:none;font-weight:600;">${esc(siteUrl.replace(/^https?:\/\//, ''))}</a>${linkedin ? ` &nbsp;·&nbsp; <a href="${linkedin}" style="color:${C.ink};text-decoration:none;">LinkedIn</a>` : ''} &nbsp;·&nbsp; ${esc(profile.location)}
  </td></tr></table>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

const messageBox = (message) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 6px;">
<tr><td style="background:${C.goldSoft};border-left:3px solid ${C.gold};border-radius:6px;padding:14px 16px;color:${C.ink};font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(message)}</td></tr>
</table>`;

// Sent to the visitor who filled in the form.
export function confirmationEmail({ name, topic, message }) {
  const first = String(name).trim().split(/\s+/)[0];
  const subject = `Thanks for reaching out, ${first}. I got your message`;
  const text = `Hi ${first},

Thank you for reaching out about "${topic}". Your message reached me, and I will get back to you within a few days.

Your message:
${message}

If anything is urgent, just reply to this email.

Best,
${profile.name}
Software Engineer · Full stack, DevOps and AI
${siteUrl}`;

  const body = `
<p style="margin:0 0 14px;font-size:20px;line-height:1.35;color:${C.ink};font-weight:600;">Thanks for reaching out, ${esc(first)}.</p>
<p style="margin:0 0 6px;">Your message about <strong style="color:${C.ink};">${esc(topic)}</strong> reached me. I read every request personally, and I will get back to you <strong style="color:${C.ink};">within a few days</strong>.</p>
<p style="margin:18px 0 0;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Your message</p>
${messageBox(message)}
<p style="margin:18px 0 0;">If anything is urgent, just reply to this email.</p>
<p style="margin:22px 0 0;">Best,<br><strong style="color:${C.ink};">${esc(profile.name)}</strong><br><span style="color:${C.muted};font-size:13px;">Software Engineer · Full stack, DevOps and AI</span></p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 4px;"><tr>
  <td style="background:${C.ink};border-radius:999px;"><a href="${siteUrl}/#work" style="display:inline-block;padding:11px 20px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">See my recent work</a></td>
</tr></table>`;

  return { subject, text, html: layout({ preheader: 'Your message reached me. I will get back to you within a few days.', body }) };
}

// Sent to Abdallah so he knows a request came in.
export function notificationEmail({ name, email, topic, message }) {
  const received = new Intl.DateTimeFormat('en-GB', {
    timeZone: profile.timeZone,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date());
  const subject = `New portfolio request: ${topic} from ${name}`;
  const text = `New request from your portfolio

Name: ${name}
Email: ${email}
Topic: ${topic}
Received: ${received} (${city})

${message}

Reply directly to this email to answer ${name}.`;

  const row = (k, v) =>
    `<tr><td style="padding:8px 0;color:${C.muted};font-size:13px;width:92px;vertical-align:top;">${k}</td><td style="padding:8px 0;color:${C.ink};font-size:14px;">${v}</td></tr>`;

  const body = `
<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.08em;">New request</p>
<p style="margin:0 0 16px;font-size:20px;line-height:1.35;color:${C.ink};font-weight:600;">${esc(name)} sent a message about ${esc(topic)}.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line};border-bottom:1px solid ${C.line};">
${row('Name', esc(name))}
${row('Email', `<a href="mailto:${esc(email)}" style="color:${C.ink};">${esc(email)}</a>`)}
${row('Topic', esc(topic))}
${row('Received', `${esc(received)} · ${esc(city)}`)}
</table>
${messageBox(message)}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 4px;"><tr>
  <td style="background:${C.gold};border-radius:999px;"><a href="mailto:${esc(email)}?subject=${encodeURIComponent(`Re: ${topic}`)}" style="display:inline-block;padding:11px 20px;color:${C.ink};text-decoration:none;font-size:14px;font-weight:600;">Reply to ${esc(name)}</a></td>
</tr></table>
<p style="margin:14px 0 0;color:${C.muted};font-size:13px;">They already received a confirmation saying you will get back to them within a few days.</p>`;

  return { subject, text, html: layout({ preheader: `${name} · ${topic}`, body }) };
}
