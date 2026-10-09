// Single source of truth for all site copy. Edit here to update the portfolio.
// House style: short, direct sentences and no dashes in visible text.

export const profile = {
  name: 'Abdallah El Tohamy',
  role: 'Software Engineer · Full Stack, DevOps and AI',
  headline: 'Building solutions through code and innovation.',
  sub: 'I turn ideas into digital products. On the web since 2020, with AI for the last two years.',
  location: 'Cairo, Egypt',
  timeZone: 'Africa/Cairo',
  email: 'abdallah22335a@gmail.com',
  phone: '+20 115 686 1435',
  whatsapp: 'https://wa.me/201156861435',
  cv: '/cv.pdf',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abdallah-el-tohamy-75bb432a8/' },
    { label: 'Upwork', href: 'https://www.upwork.com/freelancers/~01aa362e1eb8de88b8' },
    { label: 'Fiverr', href: 'https://www.fiverr.com/abdallah318' },
  ],
};

export const stats = [
  { value: 6, suffix: '+', label: 'years building for the web' },
  { value: 2, suffix: '+', label: 'years shipping AI features' },
  { value: 5000, suffix: '+', label: 'active users on AWS' },
  { value: 99.99, decimals: 2, suffix: '%', label: 'API uptime' },
  { value: 30, label: 'client projects delivered' },
  { value: 100, suffix: '%', label: 'Job Success on Upwork' },
];

// Shanda Studio pipeline. Node ids are referenced by skills below.
export const shanda = {
  id: 'shanda',
  role: 'Software Engineer',
  company: 'Shanda Studio',
  now: 'now Hilite',
  mode: 'Remote · Washington, D.C.',
  period: 'Oct 2023 to present',
  summary:
    'I own customer facing features end to end on a podcast platform, and work with the AI research team on the transcription and audio enhancement pipelines. Every milestone shipped on time, and my scope grew 3×.',
  nodes: [
    { id: 'upload', tag: 'ingest', title: 'Audio upload', metric: '1,000+', unit: 'minutes of audio a month',
      detail: 'Creators upload raw episodes. Every minute goes through the same automated pipeline.' },
    { id: 'ffmpeg', tag: 'process', title: 'FFmpeg processing', metric: '20%', unit: 'faster processing, 15% smaller files',
      detail: 'FFmpeg based processing with automatic metadata extraction.' },
    { id: 'llm', tag: 'model', title: 'LLM transcription', metric: '70%', unit: 'less editing time for podcasters',
      detail: 'LLM pipeline features built with the AI research team, with real user evaluation feeding back into the models.' },
    { id: 'enhance', tag: 'model', title: 'Audio enhancement', metric: 'Live', unit: 'evaluated on real user audio',
      detail: 'Enhancement models improved month over month on real recordings.' },
    { id: 'api', tag: 'serve', title: 'Python API · AWS', metric: '99.99%', unit: 'uptime for 5,000+ active users',
      detail: 'REST APIs in Python on AWS, tuned for latency.' },
    { id: 'db', tag: 'data', title: 'MySQL + Stripe', metric: '200+', unit: 'payments a month',
      detail: 'Data models for auth, subscriptions and Stripe payments across 1,000+ users.' },
    { id: 'rss', tag: 'deliver', title: 'RSS hosting', metric: '30+', unit: 'active shows',
      detail: 'Podcast hosting and RSS feeds, with the web app in Next.js, TypeScript and Node.js.' },
    { id: 'dist', tag: 'reach', title: 'Spotify · Apple', metric: '2', unit: 'major platforms',
      detail: 'Episodes publish to Spotify and Apple Podcasts automatically.' },
  ],
  edges: [
    ['upload', 'ffmpeg'], ['ffmpeg', 'llm'], ['llm', 'enhance'], ['enhance', 'api'],
    ['api', 'rss'], ['rss', 'dist'], ['api', 'db'],
  ],
};

export const freelance = {
  id: 'freelance',
  role: 'Software Developer (Freelance)',
  company: 'Upwork & Fiverr',
  period: 'Jul 2020 to May 2025',
  badges: ['Top Rated', '100% Job Success', '5/5 on Fiverr', '30 projects'],
  rows: [
    { title: 'Web apps & dashboards', metric: '70%', unit: 'less manual data work',
      text: 'MySQL databases and Next.js admin dashboards for client businesses.' },
    { title: 'Real time systems', metric: '<100ms', unit: 'responses under load',
      text: 'WebSocket and Express services, and a live usage monitor that cut issue response time by 60%.' },
    { title: 'Deployment & DevOps', metric: '3', unit: 'clouds in production',
      text: 'Server setup and upkeep with Docker, Kubernetes, Nginx and CI/CD on AWS, Azure and DigitalOcean.' },
    { title: 'Media at scale', metric: '5×', unit: 'throughput',
      text: 'FFmpeg tools in Python and JavaScript that processed 10,000+ files and automated 80% of manual work.' },
    { title: 'Applied AI', metric: '60%', unit: 'more automation',
      text: 'Face recognition, image tooling and content tagging with TensorFlow, OpenCV and LLMs.' },
  ],
};

export const filters = ['All', 'Products', 'Full stack', 'AI & Media', 'Real time'];

const M = '/media/projects';

const allProjects = [
  {
    id: 'evvot',
    title: 'Evvot',
    kicker: 'Product · AI video editor',
    categories: ['Products', 'Full stack', 'AI & Media'],
    visual: 'shot',
    wide: true,
    site: { label: 'evvot.com', href: 'https://evvot.com/' },
    blurb: 'A video editor that runs in the browser, with AI captions, background removal and cloud rendering.',
    metric: { value: '50%', label: 'faster editing' },
    stack: ['React', 'Node.js', 'WebGL', 'FFmpeg', 'GCP · Imagen', 'Azure', 'GitHub Actions', 'Azure Pipelines'],
    body: [
      'Multi layer timeline for video, audio, text and effects, with a live WebGL preview.',
      'AI captions timed to every word, and background removal on every frame.',
      'Serverless cloud rendering made editing 50% faster.',
      'Shipped through GitHub Actions and Azure Pipelines.',
    ],
    screens: [
      { src: `${M}/evvot-hero.webp`, alt: 'Evvot landing page', caption: 'evvot.com' },
      { src: `${M}/evvot-captions.webp`, alt: 'AI captions feature', caption: 'AI captions, word by word' },
      { src: `${M}/evvot-bg-removal.webp`, alt: 'Background removal before and after', caption: 'Background removal for video' },
      { src: `${M}/evvot-exports.webp`, alt: 'Videos exported from Evvot', caption: 'Exports made in Evvot' },
    ],
    media: [{ type: 'video', src: `${M}/editor-demo.mp4`, poster: `${M}/editor-poster.webp` }],
  },
  {
    id: 'hilite',
    title: 'Hilite',
    kicker: 'Product · AI podcast platform, formerly Shanda Studio',
    categories: ['Products', 'Full stack', 'AI & Media'],
    visual: 'shot',
    wide: true,
    site: { label: 'hellohilite.com', href: 'https://www.hellohilite.com/' },
    blurb: 'Record, edit, enhance and publish podcasts. You edit the audio by editing its transcript.',
    metric: { value: '70%', label: 'less editing time' },
    stack: ['Next.js', 'Node.js', 'OpenAI API', 'WhisperX', 'FFmpeg', 'AWS', 'AWS CodePipeline', 'Docker', 'Jest', 'Tailwind'],
    body: [
      'Text based editing: highlight a line in the transcript to cut it, with a waveform editor for fine control.',
      'Studio Sound Enhancer removes background noise and balances levels.',
      'Transcripts, listener analytics and one click publishing to 10+ platforms, for 30+ active shows.',
      'Shipped with AWS CodePipeline, Docker and Jest.',
    ],
    screens: [
      { src: `${M}/hilite-hero.webp`, alt: 'Hilite landing page', caption: 'hellohilite.com' },
      { src: `${M}/hilite-text-edit.webp`, alt: 'Editing audio through its transcript', caption: 'Editing audio through the transcript' },
      { src: `${M}/hilite-enhance.webp`, alt: 'Studio Sound Enhancer', caption: 'Studio Sound Enhancer' },
      { src: `${M}/hilite-analytics.webp`, alt: 'Transcription, analytics and publishing tools', caption: 'Transcripts, analytics and publishing' },
    ],
    links: [{ label: 'shanda.studio', href: 'https://www.shanda.studio/' }],
  },
  {
    id: 'completegreet',
    title: 'Complete Greet',
    kicker: 'Product · real time video widget',
    categories: ['Products', 'Full stack', 'Real time'],
    visual: 'shot',
    wide: true,
    site: { label: 'completegreet.com', href: 'https://completegreet.com/' },
    blurb: 'Video bubbles that greet website visitors and open a live conversation. Installs on Shopify, Wix, WordPress and Webflow.',
    metric: { value: '+40%', label: 'engagement' },
    stack: ['Node.js', 'Express', 'WebSockets', 'Sequelize', 'MySQL', 'Nginx', 'DigitalOcean'],
    body: [
      'An embeddable widget that turns a video bubble into a live channel between a site and its visitors.',
      'Session analytics over 10K+ visits drove product decisions: engagement up 40%, satisfaction up 30%.',
      'Configurable buttons for calls, live chat, contact forms and bookings.',
      'Runs on Node.js and MySQL behind Nginx on DigitalOcean.',
    ],
    screens: [
      { src: `${M}/cg-hero.webp`, alt: 'Complete Greet landing page', caption: 'completegreet.com' },
      { src: `${M}/cg-buttons.webp`, alt: 'Choosing widget buttons with a live example', caption: 'Button builder with live preview' },
    ],
    sessionDemo: true,
  },
  {
    id: 'trainbridge',
    title: 'TrainBridge',
    kicker: 'Product · coaching platform',
    categories: ['Products', 'Full stack', 'Real time'],
    visual: 'coach',
    status: 'In development',
    blurb: 'Connects athletes with coaches: training plans, video lessons, nutrition and private messaging.',
    metric: { value: '1:1', label: 'coach and athlete' },
    stack: ['Node.js', 'Express', 'Sequelize', 'JavaScript', 'Bootstrap'],
    body: [
      'Clients find home or gym programmes. Coaches publish plans and videos from a dashboard.',
      'Private real time messaging between coach and athlete.',
      'Clients upload InBody data and food preferences and get nutrition plans for their goals.',
      'Coaches track progress and adjust routines.',
    ],
    media: [{ type: 'image', src: `${M}/trainbridge.webp`, alt: 'TrainBridge landing page' }],
  },
  {
    id: 'vision',
    title: 'Applied Computer Vision',
    kicker: 'Face recognition · image tooling',
    categories: ['AI & Media'],
    visual: 'face',
    blurb: 'Face recognition, face editing and automatic content tagging for client products.',
    metric: { value: '60%', label: 'more automation' },
    stack: ['TensorFlow', 'OpenCV', 'Python', 'LLMs'],
    body: [
      'Face recognition and face manipulation tools built for freelance clients.',
      'Automatic content tagging that combines vision models with LLMs.',
      'Raised automation efficiency by 60%.',
    ],
  },
  {
    id: 'truss',
    title: 'Space Truss Solver',
    kicker: 'Web app · numerical solver · 3D',
    categories: ['Full stack'],
    visual: 'truss',
    interactive: true,
    wide: true,
    site: { label: 'truss solver', href: 'https://space-truss-analyzer.onrender.com/' },
    blurb: 'A solver for statically indeterminate space trusses, with a 3D preview and SAP2000 export.',
    metric: { value: '90%+', label: 'productivity gain' },
    stack: ['JavaScript', 'Three.js', 'Node.js', 'Render', 'SAP2000 export'],
    body: [
      'Solves any statically indeterminate space truss with the direct stiffness method.',
      'Live 3D view of joints, members and internal forces.',
      'Exports models straight to SAP2000.',
      'The card runs the same method in your browser. Drag along the deck.',
    ],
    media: [
      { type: 'image', src: `${M}/truss-overview.webp`, alt: 'Space Truss Calculator overview' },
      { type: 'image', src: `${M}/truss-out2.webp`, alt: 'Joint and member input' },
      { type: 'image', src: `${M}/truss-analyzer.webp`, alt: 'Internal forces analysis' },
      { type: 'image', src: `${M}/truss-sap2000.webp`, alt: 'Model exported to SAP2000' },
    ],
  },
  {
    id: 'media',
    title: 'Media Processing at Scale',
    kicker: 'Encoding pipelines',
    categories: ['AI & Media'],
    visual: 'encode',
    wide: true,
    blurb: 'Encoding and editing tools that processed 10,000+ media files for clients.',
    metric: { value: '5×', label: 'throughput' },
    stack: ['FFmpeg', 'Python', 'JavaScript', 'Bash'],
    body: [
      'Batch encoding, transcoding and editing tools in Python and JavaScript, built on FFmpeg.',
      'Processed 10,000+ media files and automated 80% of manual work.',
      'Several of the client reviews below are about these FFmpeg jobs.',
    ],
  },
  {
    id: 'monitor',
    title: 'Live Usage Monitor',
    kicker: 'SaaS · real time analytics',
    categories: ['Full stack', 'Real time'],
    visual: 'monitor',
    wide: true,
    blurb: 'A SaaS that shows site owners how visitors use their website as it happens, with admin panels for the data.',
    metric: { value: '60%', label: 'faster issue response' },
    stack: ['React', 'Node.js', 'Socket.IO', 'MySQL', 'Next.js'],
    body: [
      'Streams sessions, pages and interactions live over Socket.IO.',
      'MySQL backed admin panels to analyse and control the collected data.',
      'Live alerts on errors and slow pages cut issue response time by 60%.',
    ],
  },
];

// Projects shown on the site (anything marked `hidden: true` is left out everywhere).
export const projects = allProjects.filter((p) => !p.hidden);
const visibleIds = new Set(['shanda', 'freelance', ...projects.map((p) => p.id)]);

// AI section: the models I work with, and which one I reach for per job.
export const ai = {
  intro:
    'For the last two years I have been putting AI into real products. Some features run on APIs. When privacy or cost matters, I host the models myself.',
  footer: 'Self hosted models run in Docker on Kubernetes, behind the same CI/CD as the web apps.',
  models: [
    { id: 'whisper', name: 'Whisper', role: 'Speech to text', host: 'self' },
    { id: 'qwen', name: 'Qwen', role: 'Chat and tool calling', host: 'self' },
    { id: 'deepseek', name: 'DeepSeek', role: 'Reasoning', host: 'self' },
    { id: 'minimax', name: 'MiniMax', role: 'Long context', host: 'self' },
    { id: 'openai', name: 'OpenAI', role: 'Writing and summaries', host: 'api' },
    { id: 'vision', name: 'TensorFlow · OpenCV', role: 'Computer vision', host: 'self' },
  ],
  tasks: [
    { task: 'Transcribe a 40 minute interview', model: 'whisper',
      why: 'Runs on our own GPU, so long audio is cheap to process and never leaves the server.' },
    { task: 'Answer a user and call tools', model: 'qwen',
      why: 'Reliable structured output and tool calls, and small enough to host ourselves.' },
    { task: 'Work through a hard, multi step problem', model: 'deepseek',
      why: 'Used where the answer needs reasoning more than speed.' },
    { task: 'Read a whole transcript at once', model: 'minimax',
      why: 'A long context window, so the full document fits in one request.' },
    { task: 'Write titles and show notes', model: 'openai',
      why: 'Strong writing per request, and the text is not sensitive, so an API is the simple choice.' },
    { task: 'Find and tag faces in images', model: 'vision',
      why: 'Classic vision models are faster and more predictable than an LLM for this job.' },
  ],
};

// Skills, each linked to the roles/projects that used them (ids above).
const allSkillClusters = [
  {
    name: 'Full stack web',
    skills: [
      { name: 'React · Next.js', uses: ['shanda', 'hilite', 'evvot', 'monitor'] },
      { name: 'Node.js · Express', uses: ['shanda', 'evvot', 'completegreet', 'trainbridge', 'monitor', 'truss'] },
      { name: 'TypeScript · JavaScript', uses: ['shanda', 'evvot', 'completegreet', 'trainbridge', 'truss', 'freelance'] },
      { name: 'REST APIs', uses: ['shanda', 'hilite', 'trainbridge'] },
      { name: 'WebSockets · Socket.IO', uses: ['completegreet', 'monitor', 'trainbridge', 'freelance'] },
      { name: 'MySQL · Sequelize', uses: ['shanda', 'completegreet', 'trainbridge', 'monitor'] },
      { name: 'Stripe & auth', uses: ['shanda'] },
      { name: 'WebGL · Three.js', uses: ['evvot', 'truss'] },
    ],
  },
  {
    name: 'DevOps & Cloud',
    skills: [
      { name: 'Docker', uses: ['shanda', 'hilite', 'freelance'] },
      { name: 'Kubernetes', uses: ['freelance'] },
      { name: 'CI/CD pipelines', uses: ['shanda', 'hilite', 'evvot'] },
      { name: 'GitHub Actions · Azure Pipelines', uses: ['evvot'] },
      { name: 'AWS · CodePipeline', uses: ['shanda', 'hilite'] },
      { name: 'Azure', uses: ['evvot', 'freelance'] },
      { name: 'GCP · serverless', uses: ['evvot'] },
      { name: 'DigitalOcean', uses: ['completegreet', 'freelance'] },
      { name: 'Linux · Nginx', uses: ['shanda', 'completegreet', 'freelance'] },
      { name: 'Testing (Jest)', uses: ['shanda', 'hilite'] },
    ],
  },
  {
    name: 'AI & ML',
    skills: [
      { name: 'LLM pipelines', uses: ['shanda', 'freelance', 'hilite', 'vision'] },
      { name: 'Prompt & context engineering', uses: ['shanda', 'freelance', 'hilite'] },
      { name: 'MCP / tool calling', uses: ['shanda'] },
      { name: 'Self hosted models', uses: ['shanda', 'hilite', 'freelance'] },
      { name: 'Speech & audio', uses: ['shanda', 'hilite'] },
      { name: 'Generative video (Imagen)', uses: ['evvot'] },
      { name: 'TensorFlow · OpenCV', uses: ['freelance', 'vision'] },
    ],
  },
  {
    name: 'Media & data',
    skills: [
      { name: 'FFmpeg', uses: ['shanda', 'hilite', 'evvot', 'media', 'freelance'] },
      { name: 'Python', uses: ['shanda', 'freelance', 'media', 'vision'] },
      { name: 'Data analytics', uses: ['completegreet', 'monitor', 'freelance'] },
      { name: 'C / C++ / C#', uses: ['freelance'] },
      { name: 'Bash', uses: ['media', 'freelance'] },
    ],
  },
];

export const skillClusters = allSkillClusters.map((c) => ({
  ...c,
  skills: c.skills
    .map((sk) => ({ ...sk, uses: sk.uses.filter((id) => visibleIds.has(id)) }))
    .filter((sk) => sk.uses.length),
}));

// Every target a skill can point at, in display order.
export const skillTargets = [
  { id: 'shanda', label: 'Shanda Studio (role)', kind: 'role' },
  { id: 'freelance', label: 'Freelance', kind: 'role' },
  ...projects.map((p) => ({ id: p.id, label: p.title, kind: 'project' })),
];

// Client reviews carried over from the previous portfolio.
export const testimonials = [
  { name: 'cutteranddesign', country: 'Germany', text: 'He is a very good communicator and delivered the product as expected. Very happy with it :)' },
  { name: 'theocholley581', country: 'France', text: 'Very good work' },
  { name: 'jolted_design', country: 'United Kingdom', text: "Abdullah was confident in approaching my task, and although we hit some issues (not his fault) he worked through the night to fix them. He didn't stop until it was exactly where it needed to be, now it's 7am! He's top of my list next time I need someone." },
  { name: 'dumimabhena', country: 'United States', text: 'Abdallah is the best!' },
  { name: 'Bilal Rabbi', country: 'UAE', text: "Fantastic work. He did exactly what was needed. I will surely hire him again. Skill level is 10 out of 10. Can't wait to work with him again." },
  { name: 'dumimabhena', country: 'United States', text: 'Abdallah is dedicated and committed. A joy to work with!' },
  { name: 'tophbeifong2019', country: 'Malaysia', text: 'Amazing work as usual' },
  { name: 'dumimabhena', country: 'United States', text: 'Abdallah is always a joy to work with. He is hardworking and a great team player!' },
  { name: 'nicolatorcut89', country: 'Italy', text: 'Great work with ffmpeg! He did a script for me to add an outro at the end of the video. Super smooth, no errors, and no revisions required.' },
  { name: 'dumimabhena', country: 'United States', text: "Abdallah is easily one of the best developers I have ever worked with. He is extremely professional and generous with his time and expertise. He's awesome!" },
  { name: 'springboker', country: 'Netherlands', text: 'Very understanding and helping. Provided the work on requirement :) Will sure work in future again.' },
  { name: 'dumimabhena', country: 'United States', text: 'Really enjoyed working with Addallh and will continue to do so in the future!' },
  { name: 'tophbeifong2019', country: 'Malaysia', text: 'Amazing Work Thanks!' },
  { name: 'juangomez951', country: 'Spain', text: 'Extraordinariamente rápido y eficaz el trabajo perfecto. Comunicación perfecta. Como a mí me gustan las cosas rápido y espectacular. Aunque no hablamos el mismo idioma nos comprendimos perfectamente. Lo recomiendo completamente 100% volveré...' },
  { name: 'labouniwork', country: 'Morocco', text: 'He was very helpful and communicative. There was no delay in replies. The project was completed as per the requirements and in a very short period of time. Even after the delivery he helped me run the project end to end.' },
  { name: 'fyrumunna', country: 'India', text: "Exceptionally good. Can't recommend enough!" },
  { name: 'chrispowell709', country: 'United States', text: 'Thank you very much for using your brilliance to complete a very challenging and unique ffmpeg task. Much respect, and wish you much success in your future endeavors. 10 out of 10.' },
  { name: 'Angelo Santoni', country: 'Italy', text: 'I confirm that he is a good professional' },
  { name: 'Webcodecare', country: 'Bangladesh', text: 'Working with Abdallah was a great experience, everything went well and smoothly. The perfect freelancer for my SAAS project. I really appreciate working with him. He went so far and beyond expectations.' },
  { name: 'Ali Ahmad', country: 'Pakistan', text: 'Very good! Highly recommended! Abdallah did all revisions very patiently, I will surely work further with him in the future.' },
  { name: 'Angelo Santoni', country: 'Italy', text: 'Work completed with full satisfaction. I sincerely recommend Abdallah Hassan to carry out precise work and on time.' },
];

// Rowing / athletics: currently hidden (the <Rowing /> section is commented out in app/page.js).
export const rowing = {
  intro:
    'I rowed for Egypt’s national team from 2016 to 2023 while studying full time. It taught me how to train for results you can’t fake.',
  facts: [
    { value: '7', label: 'years on the national team' },
    { value: '26h', label: 'training per week, with full time study' },
    { value: '20×', label: 'Final A wins at the national cup' },
  ],
  venues: [
    { id: 'piediluco', name: 'Piediluco', country: 'Italy', lat: 42.53, lon: 12.76,
      results: ['3rd ×2 · Memorial Paolo d’Aloja, junior single scull (2018)'] },
    { id: 'tabarka', name: 'Tabarka', country: 'Tunisia', lat: 36.95, lon: 8.76,
      results: ['1st ×1, 2nd ×2 · African Championships, junior single'] },
    { id: 'tipaza', name: 'Tipaza', country: 'Algeria', lat: 36.59, lon: 2.45,
      results: ['1st · junior double scull, African YOG Qualification (2018)', '3rd · junior single scull'] },
    { id: 'cairo', name: 'Cairo', country: 'Egypt', lat: 30.04, lon: 31.24, home: true,
      results: ['1st · Arabic Indoor Rowing Championship', '5th · World Rowing Indoor Championship', 'National cup with my club, 5 years in a row'] },
  ],
};

export const sections = [
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'ai', label: 'AI' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];
