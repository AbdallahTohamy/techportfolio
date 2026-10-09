import Link from 'next/link';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <main className="container" style={{ minHeight: '80vh', display: 'grid', alignContent: 'center', gap: 20 }}>
      <span className="mono">404</span>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>This page does not exist.</h1>
      <p style={{ color: 'var(--text-2)' }}>The link may be old. Everything lives on the home page.</p>
      <p>
        <Link href="/" className="btn primary">
          Back to the portfolio
        </Link>
      </p>
    </main>
  );
}
