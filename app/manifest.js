import { seo } from '@/lib/site';

export default function manifest() {
  return {
    name: seo.title,
    short_name: seo.shortTitle,
    description: seo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a111d',
    theme_color: '#0a111d',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
