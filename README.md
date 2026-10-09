# Abdallah El Tohamy — Portfolio

Next.js (App Router) site with a small backend for the contact form.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Editing content

All copy lives in [`data/content.js`](data/content.js): profile, stats, the Shanda pipeline, projects
(galleries, then→now comparisons, links), skills, client reviews and rowing results. Project screenshots are in
`public/media/projects/`.

## Contact form email

`POST /api/contact` (in `app/api/contact/route.js`) validates the message, filters bots with a honeypot,
rate-limits per IP and sends the email through [Resend](https://resend.com). Copy `.env.example` to `.env.local`
for local testing, and set the same variables in **Netlify → Site configuration → Environment variables**:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_TO_EMAIL` | Where messages are delivered |
| `CONTACT_FROM_EMAIL` | Sender — `onboarding@resend.dev` for testing, an address on a verified domain in production |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID (optional) |

Without `RESEND_API_KEY` the form still works but tells visitors to email directly (with a one-click mail-app link).

## Deploy

Netlify builds it automatically from `netlify.toml` (Next.js runtime, Node 22).
