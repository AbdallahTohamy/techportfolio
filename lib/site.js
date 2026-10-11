// Site-wide SEO settings. The live URL comes from the environment so canonical links,
// the sitemap and social previews always point at the deployed domain.
// Netlify sets URL automatically; NEXT_PUBLIC_SITE_URL overrides it (e.g. for a custom domain).
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || 'https://abdallahtohamy.netlify.app').replace(/\/$/, '');

export const seo = {
  title: 'Abdallah El Tohamy · Full Stack, DevOps & AI Engineer',
  shortTitle: 'Abdallah El Tohamy',
  description:
    'Abdallah El Tohamy, software engineer in Cairo. Full stack web apps with Next.js and Node.js, DevOps on AWS, Google Cloud and Azure, and AI products.',
  keywords: [
    'Abdallah El Tohamy',
    'Abdallah ElTohamy',
    'software engineer',
    'full stack developer',
    'DevOps engineer',
    'AI engineer',
    'Next.js developer',
    'Node.js developer',
    'React developer',
    'AWS',
    'Google Cloud',
    'Azure',
    'Cloud Run',
    'CI/CD',
    'GitHub Actions',
    'Docker',
    'Kubernetes',
    'LLM',
    'freelance developer Cairo',
    'Egypt',
  ],
  locale: 'en_US',
};
