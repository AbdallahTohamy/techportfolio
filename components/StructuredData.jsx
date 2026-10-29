import { profile, projects, shanda, skillClusters } from '@/data/content';
import { seo, siteUrl } from '@/lib/site';

// schema.org data so search engines understand who this is, what he does and what he has built.
export default function StructuredData() {
  const person = {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: profile.name,
    alternateName: 'Abdallah ElTohamy',
    url: siteUrl,
    image: `${siteUrl}/opengraph-image.png`,
    email: `mailto:${profile.email}`,
    jobTitle: 'Software Engineer',
    description: seo.description,
    worksFor: { '@type': 'Organization', name: shanda.company },
    address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
    knowsAbout: skillClusters.flatMap((c) => c.skills.map((s) => s.name)),
    knowsLanguage: ['en', 'ar'],
    sameAs: profile.links.map((l) => l.href),
  };

  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: seo.shortTitle,
      description: seo.description,
      inLanguage: 'en',
      publisher: { '@id': `${siteUrl}/#person` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${siteUrl}/#profile`,
      url: siteUrl,
      name: seo.title,
      isPartOf: { '@id': `${siteUrl}/#website` },
      mainEntity: { '@id': `${siteUrl}/#person` },
      inLanguage: 'en',
    },
    person,
    {
      '@type': 'ItemList',
      '@id': `${siteUrl}/#projects`,
      name: 'Projects',
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': p.site ? 'SoftwareApplication' : 'CreativeWork',
          name: p.title,
          url: `${siteUrl}/projects/${p.id}`,
          description: p.blurb,
          ...(p.site && { sameAs: p.site.href, applicationCategory: 'WebApplication', operatingSystem: 'Web' }),
          ...(p.screens?.[0] && { image: `${siteUrl}${p.screens[0].src}` }),
          keywords: p.stack.join(', '),
          creator: { '@id': `${siteUrl}/#person` },
        },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}
