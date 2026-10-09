import Script from 'next/script';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/jetbrains-mono/400.css';
import './globals.css';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  metadataBase: new URL(process.env.URL || 'https://abdallahtohamy.netlify.app'),
  title: 'Abdallah El Tohamy · Software Engineer',
  description:
    'Software engineer for full stack, DevOps and AI. Building solutions through code and innovation: Evvot, Hilite, Complete Greet. Based in Cairo.',
  openGraph: {
    title: 'Abdallah El Tohamy · Software Engineer',
    description: 'Building solutions through code and innovation. Full stack, DevOps and AI.',
    images: ['/media/projects/evvot-hero.webp'],
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#0a111d',
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
