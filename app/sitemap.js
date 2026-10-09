import { profile, projects } from '@/data/content';
import { siteUrl } from '@/lib/site';

export default function sitemap() {
  const now = new Date();
  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
      images: [`${siteUrl}/opengraph-image.png`],
    },
    ...projects.map((p) => ({
      url: `${siteUrl}/projects/${p.id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [...(p.screens || []), ...(p.media || []).filter((m) => m.type === 'image')].map((im) => `${siteUrl}${im.src}`),
    })),
    { url: `${siteUrl}${profile.cv}`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];
}
