import localFont from 'next/font/local';

// Latin-only, self-hosted and preloaded by Next.js, with size-matched fallbacks (no layout shift).
export const display = localFont({
  src: [
    { path: './fonts/space-grotesk-latin-400-normal.woff2', weight: '400' },
    { path: './fonts/space-grotesk-latin-500-normal.woff2', weight: '500' },
  ],
  variable: '--font-sg',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

export const body = localFont({
  src: [
    { path: './fonts/inter-latin-400-normal.woff2', weight: '400' },
    { path: './fonts/inter-latin-500-normal.woff2', weight: '500' },
  ],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
});

export const mono = localFont({
  src: [{ path: './fonts/jetbrains-mono-latin-400-normal.woff2', weight: '400' }],
  variable: '--font-jb',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});
