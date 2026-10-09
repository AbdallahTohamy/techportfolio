import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlueprintBackground from '@/components/BlueprintBackground';
import Nav from '@/components/Nav';
import { profile, projects } from '@/data/content';
import { siteUrl } from '@/lib/site';
import './project.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

const find = (slug) => projects.find((p) => p.id === slug);
const clip = (s, n = 155) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const cover = (p) => p.screens?.[0] || p.media?.find((m) => m.type === 'image');

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = find(slug);
  if (!p) return {};
  const img = cover(p);
  const title = `${p.title} · ${p.kicker.split(' · ')[1] || p.kicker}`;
  return {
    title,
    description: clip(p.blurb),
    keywords: [p.title, ...p.stack, profile.name],
    alternates: { canonical: `/projects/${p.id}` },
    openGraph: {
      type: 'article',
      url: `/projects/${p.id}`,
      title: `${title} · ${profile.name}`,
      description: clip(p.blurb),
      siteName: profile.name,
      locale: 'en_US',
      // 1200x630 JPGs made from each project's cover (works on LinkedIn, Facebook, X and WhatsApp)
      ...(img && { images: [{ url: `/media/og/${p.id}.jpg`, width: 1200, height: 630, alt: img.alt }] }),
    },
    twitter: { card: 'summary_large_image', title: `${title} · ${profile.name}`, description: clip(p.blurb) },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const p = find(slug);
  if (!p) notFound();
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  const images = [...(p.screens || []), ...(p.media || []).filter((m) => m.type === 'image')];
  const video = p.media?.find((m) => m.type === 'video');
  const url = `${siteUrl}/projects/${p.id}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': p.site ? 'SoftwareApplication' : 'CreativeWork',
        '@id': `${url}#project`,
        name: p.title,
        description: p.blurb,
        url,
        ...(p.site && { sameAs: p.site.href, applicationCategory: 'WebApplication', operatingSystem: 'Web' }),
        ...(images[0] && { image: images.map((im) => `${siteUrl}${im.src}`) }),
        keywords: p.stack.join(', '),
        creator: { '@type': 'Person', '@id': `${siteUrl}/#person`, name: profile.name, url: siteUrl },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: profile.name, item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Work', item: `${siteUrl}/#work` },
          { '@type': 'ListItem', position: 3, name: p.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <BlueprintBackground />
      <Nav />
      <main className="pp container" style={{ position: 'relative', zIndex: 1 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <nav className="pp-crumbs mono" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/#work">Work</Link>
          <span aria-hidden>/</span>
          <span aria-current="page">{p.title}</span>
        </nav>

        <header className="pp-head">
          <span className="mono">{p.kicker}</span>
          <h1>{p.title}</h1>
          {p.status && <span className="pp-status mono">{p.status}</span>}
          <p className="pp-blurb">{p.blurb}</p>
          <div className="pp-actions">
            {p.site && (
              <a href={p.site.href} target="_blank" rel="noopener" className="btn primary">
                Visit {p.site.label} ↗
              </a>
            )}
            {p.links?.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener" className="btn">
                {l.label} ↗
              </a>
            ))}
            <Link href="/#contact" className="btn">
              Start a similar project
            </Link>
          </div>
        </header>

        {images[0] && (
          <figure className="pp-cover panel">
            <Image src={images[0].src} alt={images[0].alt} width={1440} height={900} priority sizes="(max-width: 1240px) 100vw, 1180px" />
          </figure>
        )}

        <div className="pp-grid">
          <section className="pp-section" aria-labelledby="pp-what">
            <h2 id="pp-what">What I built</h2>
            <ul className="pp-list">
              {p.body.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
          <aside className="pp-side panel">
            {p.metric && (
              <div className="pp-metric">
                <strong>{p.metric.value}</strong>
                <span>{p.metric.label}</span>
              </div>
            )}
            <h2 className="mono">Stack</h2>
            <ul className="pp-tags">
              {p.stack.map((s) => (
                <li key={s} className="tag">
                  {s}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {(images.length > 1 || video) && (
          <section className="pp-section" aria-labelledby="pp-screens">
            <h2 id="pp-screens">Screens</h2>
            <div className="pp-gallery">
              {video && <video src={video.src} poster={video.poster} controls muted playsInline preload="none" />}
              {images.slice(1).map((im) => (
                <figure key={im.src}>
                  <Image src={im.src} alt={im.alt} width={1440} height={900} sizes="(max-width: 900px) 100vw, 580px" loading="lazy" />
                  <figcaption className="mono">{im.caption || im.alt}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <nav className="pp-next" aria-label="More projects">
          <span className="mono">Next project</span>
          <Link href={`/projects/${next.id}`}>
            {next.title} <span aria-hidden>→</span>
          </Link>
          <div className="pp-all">
            {projects
              .filter((x) => x.id !== p.id)
              .map((x) => (
                <Link key={x.id} href={`/projects/${x.id}`} className="tag">
                  {x.title}
                </Link>
              ))}
          </div>
        </nav>
      </main>
      <footer className="container pp-foot">
        <span className="mono">© {new Date().getFullYear()} {profile.name}</span>
        <Link href="/" className="mono">
          Back to the portfolio
        </Link>
      </footer>
    </>
  );
}
