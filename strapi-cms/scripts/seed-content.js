const fs = require('fs');
const http = require('http');
const https = require('https');
const os = require('os');
const path = require('path');
const createStrapi = require('@strapi/strapi');

const uids = {
  header: 'api::header.header',
  footer: 'api::footer.footer',
  homepage: 'api::homepage.homepage',
  page: 'api::page.page',
  siteSetting: 'api::site-setting.site-setting',
  theme: 'api::site-theme.site-theme',
  service: 'api::service.service',
  testimonial: 'api::testimonial.testimonial'
};

const downloadFile = (url, destination, redirects = 0) =>
  new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const request = client.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location && redirects < 5) {
        response.resume();
        downloadFile(response.headers.location, destination, redirects + 1).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(destination);
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    });

    request.on('error', reject);
  });

const ensureMediaFile = async ({ name, url, mime = 'image/jpeg' }) => {
  const existingFile = await strapi.db.query('plugin::upload.file').findOne({ where: { name } });

  if (existingFile) {
    return existingFile.id;
  }

  const tempPath = path.join(os.tmpdir(), name);
  await downloadFile(url, tempPath);
  const stats = fs.statSync(tempPath);
  const uploadedFiles = await strapi.plugin('upload').service('upload').upload({
    data: { fileInfo: { name } },
    files: {
      path: tempPath,
      name,
      type: mime,
      size: stats.size
    }
  });

  return uploadedFiles[0].id;
};

const upsertSingleType = async (uid, data) => {
  const existing = await strapi.db.query(uid).findOne();

  if (!existing) {
    await strapi.entityService.create(uid, { data });
    return;
  }

  await strapi.entityService.update(uid, existing.id, { data });
};

const upsertCollectionEntry = async (uid, where, data) => {
  const existing = await strapi.db.query(uid).findOne({ where });

  if (!existing) {
    await strapi.entityService.create(uid, { data });
    return;
  }

  await strapi.entityService.update(uid, existing.id, { data });
};

const buildSeo = (metaTitle, metaDescription, canonicalPath, socialImage) => ({
  metaTitle,
  metaDescription,
  canonicalPath,
  ogTitle: metaTitle,
  ogDescription: metaDescription,
  keywords: 'business consulting, brand strategy, digital growth, client services',
  noIndex: false,
  socialImage
});

const runSeed = async () => {
  const app = createStrapi();
  await app.load();

  await strapi.db.query(uids.service).deleteMany({ where: {} });
  await strapi.db.query(uids.testimonial).deleteMany({ where: {} });

  const media = {
    aboutImage: await ensureMediaFile({
      name: 'about-team-working.jpg',
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=1200&fit=crop'
    }),
    homeHero: await ensureMediaFile({
      name: 'home-hero-office.jpg',
      url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&h=1200&fit=crop'
    }),
    servicesHero: await ensureMediaFile({
      name: 'services-workshop.jpg',
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&h=1200&fit=crop'
    }),
    aboutHero: await ensureMediaFile({
      name: 'about-leadership.jpg',
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&h=1200&fit=crop'
    }),
    contactHero: await ensureMediaFile({
      name: 'contact-meeting.jpg',
      url: 'https://images.unsplash.com/photo-1516382799247-87df95d790b7?w=1600&h=1200&fit=crop'
    }),
    strategyHero: await ensureMediaFile({
      name: 'strategy-boardroom.jpg',
      url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&h=1200&fit=crop'
    }),
    ctaImage: await ensureMediaFile({
      name: 'cta-laptop-notes.jpg',
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&h=1200&fit=crop'
    }),
    sarah: await ensureMediaFile({
      name: 'testimonial-sarah-johnson.jpg',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop'
    }),
    michael: await ensureMediaFile({
      name: 'testimonial-michael-chen.jpg',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'
    }),
    emily: await ensureMediaFile({
      name: 'testimonial-emily-rodriguez.jpg',
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop'
    }),
    workFeature: await ensureMediaFile({
      name: 'feature-workshop-wall.jpg',
      url: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=1400&h=1200&fit=crop'
    })
  };

  await upsertSingleType(uids.header, {
    siteName: 'Northstar Studio',
    navigationLinks: [
      { name: 'Home', href: '/', external: false },
      { name: 'Services', href: '/services', external: false },
      { name: 'About', href: '/about', external: false },
      { name: 'Contact', href: '/contact', external: false }
    ],
    ctaText: 'Book a Strategy Call',
    ctaLink: '/contact'
  });

  await upsertSingleType(uids.footer, {
    tagline: 'Northstar Studio builds sharp, growth-ready digital systems for service businesses.',
    columns: [
      {
        title: 'Navigate',
        links: [
          { name: 'Home', href: '/', external: false },
          { name: 'Services', href: '/services', external: false },
          { name: 'Growth Systems', href: '/growth-systems', external: false },
          { name: 'Contact', href: '/contact', external: false }
        ]
      },
      {
        title: 'Services',
        links: [
          { name: 'Brand Strategy', href: '/services', external: false },
          { name: 'Website Systems', href: '/services', external: false },
          { name: 'Conversion UX', href: '/services', external: false }
        ]
      }
    ],
    copyrightText: 'Copyright 2026 Northstar Studio. All rights reserved.',
    contactEmail: 'hello@northstarstudio.co',
    contactPhone: '+1 (312) 555-0148',
    contactAddress: '220 W Kinzie St, Chicago, IL'
  });

  await upsertSingleType(uids.homepage, {
    heroBadgeLabel: 'CMS First',
    heroBadgeText: 'Built for teams that need to move fast',
    heroTitle: 'Client-ready websites with',
    heroHighlightedText: 'clean systems',
    heroSubtitle: 'Northstar Studio helps service businesses clarify positioning, modernize websites, and give teams a content system they can actually use.',
    heroPrimaryButtonText: 'Book a Strategy Call',
    heroSecondaryButtonText: 'Explore Services',
    heroStats: [
      { value: '42%', label: 'Average lead lift' },
      { value: '3 weeks', label: 'To ship core pages' },
      { value: '100%', label: 'Editable in CMS' }
    ],
    servicesTitle: 'What We Build',
    servicesSubtitle: 'Positioning, websites, and growth systems that are easy to operate after launch.',
    servicesLinkText: 'View service',
    aboutLabel: 'About',
    aboutTitle: 'Small teams need',
    aboutHighlightedText: 'high signal systems',
    aboutDescriptionOne: 'We combine strategy, UX, content structure, and frontend craft so your website reads sharply, converts cleanly, and stays editable after handoff.',
    aboutDescriptionTwo: 'The goal is not a pretty homepage alone. The goal is a working content system that lets your team publish new pages without waiting on a developer every time.',
    aboutImage: media.aboutImage,
    aboutImageAlt: 'Leadership team in workshop',
    aboutExperienceNumber: '12+',
    aboutExperienceText: 'Years shipping digital products',
    aboutFeatures: [
      { title: 'Content architecture first', description: 'Pages, sections, and SEO fields are designed for editing before visuals are polished.' },
      { title: 'Conversion-aware design', description: 'Every section supports a clear story, CTA, and scanning pattern for busy buyers.' },
      { title: 'Operational handoff', description: 'Clients can launch new pages, edit site copy, and manage structure inside Strapi.' }
    ],
    aboutCtaText: 'See How We Work',
    testimonialsTitle: 'What clients notice first',
    testimonialsSubtitle: 'Sharper messaging, calmer publishing, and a site that feels more credible in every meeting.',
    contactLabel: 'Contact',
    contactTitle: 'Start the next',
    contactHighlightedText: 'version of your site',
    contactDescription: 'Tell us where the current website is stuck and we will map the next release around content structure, UX, and launch priorities.',
    contactInfoItems: [
      { label: 'Email', value: 'hello@northstarstudio.co', icon: 'email' },
      { label: 'Phone', value: '+1 (312) 555-0148', icon: 'phone' },
      { label: 'Office', value: '220 W Kinzie St, Chicago, IL', icon: 'location' }
    ],
    contactFormNameLabel: 'Name',
    contactFormNamePlaceholder: 'Jordan Smith',
    contactFormEmailLabel: 'Email',
    contactFormEmailPlaceholder: 'jordan@company.com',
    contactFormMessageLabel: 'Project brief',
    contactFormMessagePlaceholder: 'What is not working in the current site?',
    contactSubmitButtonText: 'Send Inquiry',
    contactSuccessText: 'Thanks, we will reply soon.',
    contactFallbackNotice: ''
  });

  await upsertSingleType(uids.theme, {
    pageBackgroundColor: '#fbfbfd',
    surfaceColor: '#ffffff',
    mutedSectionBackgroundColor: '#eef3f8',
    borderColor: '#d7e0eb',
    primaryColor: '#0f766e',
    primaryDarkColor: '#115e59',
    secondaryColor: '#ea580c',
    textPrimaryColor: '#172033',
    textSecondaryColor: '#536179',
    labelBackgroundColor: 'rgba(15, 118, 110, 0.1)',
    labelTextColor: '#0f766e',
    navScrolledBackgroundColor: 'rgba(251, 251, 253, 0.92)',
    footerBackgroundColor: '#172033',
    footerTextColor: '#f8fafc',
    heroShapeOneStartColor: '#0f766e',
    heroShapeOneEndColor: '#14b8a6',
    heroShapeTwoStartColor: '#ea580c',
    heroShapeTwoEndColor: '#fb923c',
    heroShapeThreeStartColor: '#1d4ed8',
    heroShapeThreeEndColor: '#60a5fa',
    heroOverlayColor: 'rgba(251,251,253,0.82)',
    starColor: '#f59e0b'
  });

  await upsertSingleType(uids.siteSetting, {
    siteName: 'Northstar Studio',
    siteTagline: 'Strategy, UX, and client-editable websites for ambitious service businesses.',
    announcementText: 'Now shipping multi-page Strapi websites built for content teams.',
    primaryNavigation: [
      { name: 'Home', href: '/', external: false },
      { name: 'Services', href: '/services', external: false },
      { name: 'About', href: '/about', external: false },
      { name: 'Growth Systems', href: '/growth-systems', external: false },
      { name: 'Contact', href: '/contact', external: false }
    ],
    headerCta: {
      label: 'Book a Strategy Call',
      href: '/contact',
      variant: 'primary',
      external: false
    },
    footerTagline: 'Northstar Studio designs the messaging system, page structure, and frontend experience so your team can keep publishing after launch.',
    footerColumns: [
      {
        title: 'Navigate',
        links: [
          { name: 'Home', href: '/', external: false },
          { name: 'Services', href: '/services', external: false },
          { name: 'About', href: '/about', external: false },
          { name: 'Contact', href: '/contact', external: false }
        ]
      },
      {
        title: 'Capabilities',
        links: [
          { name: 'Content systems', href: '/growth-systems', external: false },
          { name: 'Web design', href: '/services', external: false },
          { name: 'Growth strategy', href: '/services', external: false }
        ]
      },
      {
        title: 'Connect',
        links: [
          { name: 'LinkedIn', href: 'https://linkedin.com', external: true },
          { name: 'Email', href: 'mailto:hello@northstarstudio.co', external: true }
        ]
      }
    ],
    socialLinks: [
      { name: 'LinkedIn', href: 'https://linkedin.com', external: true },
      { name: 'Instagram', href: 'https://instagram.com', external: true }
    ],
    contactItems: [
      { label: 'Email', value: 'hello@northstarstudio.co', icon: 'email' },
      { label: 'Phone', value: '+1 (312) 555-0148', icon: 'phone' },
      { label: 'Office', value: '220 W Kinzie St, Chicago, IL', icon: 'location' }
    ],
    defaultSeo: buildSeo(
      'Northstar Studio | Strategy-led websites in Strapi',
      'Northstar Studio builds client-editable, conversion-aware websites with structured pages, reusable blocks, and clean content operations.',
      '/',
      media.homeHero
    )
  });

  const services = [
    ['Strategic Positioning', 'We turn scattered offers into a clear service narrative that makes the homepage, sales deck, and proposal flow line up.', 'layers', 'strategic-positioning', true],
    ['Website Systems', 'We design and build multi-page websites with editable Strapi structures so internal teams can publish with confidence.', 'globe', 'website-systems', true],
    ['Growth UX', 'We improve page hierarchy, calls to action, and decision flow so more of the right visitors become qualified conversations.', 'target', 'growth-ux', true],
    ['Brand Messaging', 'We sharpen headlines, proof points, and brand voice to make the business feel more precise and more credible.', 'pen', 'brand-messaging', false],
    ['Campaign Pages', 'We create launch, offer, and vertical-specific pages that reuse your design system without looking generic.', 'card', 'campaign-pages', false],
    ['Design Operations', 'We structure reusable content blocks, governance, and publishing workflows so the site stays usable after launch.', 'box', 'design-operations', false]
  ];

  for (const [title, description, icon, slug, featured] of services) {
    await upsertCollectionEntry(uids.service, { slug }, { title, description, icon, slug, featured });
  }

  const testimonials = [
    ['Sarah Johnson', 'CEO', 'Altura Advisory', 'The new site finally sounds like the company we pitch in the room. The CMS is structured enough that our team can publish without second-guessing every section.', media.sarah],
    ['Michael Chen', 'Founder', 'Harbor Metrics', 'Northstar brought both strategy and execution. We left with a sharper offer, clearer service pages, and a site that feels much more mature.', media.michael],
    ['Emily Rodriguez', 'Marketing Director', 'Lattice Studio', 'The biggest difference is operational. We can add pages, update messaging, and keep the design quality high without pulling engineering into every edit.', media.emily]
  ];

  for (const [name, role, company, content, image] of testimonials) {
    await upsertCollectionEntry(uids.testimonial, { name }, { name, role, company, content, rating: 5, image });
  }

  const pages = [
    {
      title: 'Home',
      slug: 'home',
      navigationLabel: 'Home',
      excerpt: 'Northstar Studio helps service businesses build sharper, client-editable websites.',
      seo: buildSeo(
        'Northstar Studio | Client-editable websites with Strapi',
        'Strategy-led, multi-page business websites with reusable blocks, polished UX, and a CMS teams can actually operate.',
        '/',
        media.homeHero
      ),
      blocks: [
        {
          __component: 'sections.hero-section',
          eyebrow: 'Strategy-led digital systems',
          title: 'Websites that stay sharp after',
          highlightedText: 'the handoff',
          description: 'We build client-ready websites with reusable Strapi blocks, clear messaging systems, and production-quality frontend polish so your team can keep shipping pages after launch.',
          primaryButton: { label: 'Book a Strategy Call', href: '/contact', variant: 'primary', external: false },
          secondaryButton: { label: 'See Services', href: '/services', variant: 'secondary', external: false },
          metrics: [
            { value: '42%', label: 'Lead lift on redesigns' },
            { value: '4 core pages', label: 'Launched in phase one' },
            { value: '100%', label: 'Editable in Strapi' }
          ],
          image: media.homeHero,
          variant: 'immersive'
        },
        {
          __component: 'sections.service-showcase',
          eyebrow: 'Core capabilities',
          title: 'Services designed around how teams actually sell',
          description: 'Northstar Studio combines offer clarity, visual structure, and frontend implementation so your site works for both brand perception and day-to-day publishing.',
          showFeaturedOnly: true,
          cta: { label: 'View all services', href: '/services', variant: 'ghost', external: false }
        },
        {
          __component: 'sections.rich-content',
          eyebrow: 'Why this works',
          title: 'A clean content model changes more than',
          highlightedText: 'the homepage',
          bodyOne: 'Most business websites break down after launch because every new page becomes a design exception. We solve that by turning your common sections into reusable content blocks that still feel tailored.',
          bodyTwo: 'That means your team can launch new pages, vertical variants, and campaign updates inside the CMS without degrading the site every month.',
          bullets: [
            { title: 'Reusable sections', description: 'Hero, process, proof, CTA, and contact patterns can be reused page to page.' },
            { title: 'Consistent page hierarchy', description: 'Every page keeps a professional reading rhythm and clear conversion path.' },
            { title: 'Better SEO hygiene', description: 'Editors get page-level SEO fields instead of hiding metadata in code.' }
          ],
          image: media.workFeature,
          imageAlt: 'Workshop wall with sticky notes',
          cta: { label: 'See growth systems', href: '/growth-systems', variant: 'primary', external: false },
          layout: 'image-right'
        },
        {
          __component: 'sections.process-steps',
          eyebrow: 'Process',
          title: 'A release plan that balances strategy and speed',
          description: 'We avoid bloated discovery and bloated design systems. The work is sequenced so content structure, messaging, and build quality arrive together.',
          steps: [
            { title: 'Audit the offer', description: 'Clarify audience, offer hierarchy, and the pages that actually need to exist.' },
            { title: 'Shape the content model', description: 'Define reusable blocks, page types, navigation, SEO, and governance before UI polish.' },
            { title: 'Design and build', description: 'Ship the frontend with motion, proof, CTAs, and responsive structure already wired to Strapi.' },
            { title: 'Handoff for editors', description: 'The client gets a usable CMS, not just a pretty admin panel screenshot.' }
          ]
        },
        {
          __component: 'sections.logo-cloud',
          eyebrow: 'Built for growing teams',
          title: 'A good fit for firms that need clarity and momentum',
          description: 'The structure works especially well for expert-led businesses where trust, process, and differentiation matter.',
          logos: [
            { name: 'Advisory Firms' },
            { name: 'B2B Studios' },
            { name: 'Professional Services' },
            { name: 'Consulting Teams' },
            { name: 'Growth Operators' }
          ]
        },
        {
          __component: 'sections.testimonial-showcase',
          eyebrow: 'Proof',
          title: 'What changes when the CMS is finally usable',
          description: 'Clients usually notice the same thing first: the website starts feeling like an operational asset instead of a fragile one-off project.',
          cta: { label: 'Start your project', href: '/contact', variant: 'secondary', external: false }
        },
        {
          __component: 'sections.cta-banner',
          eyebrow: 'Next step',
          title: 'Ready to turn the site into a system your team can operate?',
          description: 'We can map the page structure, content model, and release plan around the business you have now, not the template you inherited.',
          primaryButton: { label: 'Book a Strategy Call', href: '/contact', variant: 'primary', external: false },
          secondaryButton: { label: 'Explore services', href: '/services', variant: 'ghost', external: false },
          backgroundImage: media.ctaImage
        }
      ]
    },
    {
      title: 'Services',
      slug: 'services',
      navigationLabel: 'Services',
      excerpt: 'Service design, website systems, and growth UX for ambitious teams.',
      seo: buildSeo(
        'Services | Northstar Studio',
        'Explore Northstar Studio services across positioning, website systems, growth UX, and content operations.',
        '/services',
        media.servicesHero
      ),
      blocks: [
        {
          __component: 'sections.hero-section',
          eyebrow: 'Services',
          title: 'Specialized work across message,',
          highlightedText: 'structure, and launch',
          description: 'Our services are designed to make the site sharper in the room, easier to manage internally, and faster to evolve after launch.',
          primaryButton: { label: 'Contact us', href: '/contact', variant: 'primary', external: false },
          secondaryButton: { label: 'See process', href: '/growth-systems', variant: 'secondary', external: false },
          metrics: [
            { value: '6', label: 'Core service tracks' },
            { value: '1', label: 'Integrated system' },
            { value: '0', label: 'Unnecessary fluff' }
          ],
          image: media.servicesHero,
          variant: 'split'
        },
        {
          __component: 'sections.service-showcase',
          eyebrow: 'Offer menu',
          title: 'The site should reflect how the business actually sells',
          description: 'Every service supports a common goal: clearer decisions for buyers and less operational drag for your team.',
          showFeaturedOnly: false,
          cta: { label: 'Book a strategy call', href: '/contact', variant: 'primary', external: false }
        },
        {
          __component: 'sections.process-steps',
          eyebrow: 'Engagement shape',
          title: 'How service work is usually structured',
          description: 'We scope in layers so you can align the level of work to the current bottleneck instead of buying an oversized package.',
          steps: [
            { title: 'Messaging alignment', description: 'Clarify audience, proof, differentiation, and page priorities.' },
            { title: 'Design direction', description: 'Translate the message into a professional, conversion-aware interface system.' },
            { title: 'CMS architecture', description: 'Build reusable page blocks and editing rules around real publishing needs.' },
            { title: 'Launch and iteration', description: 'Ship quickly, then expand the system with new pages and campaigns.' }
          ]
        },
        {
          __component: 'sections.cta-banner',
          eyebrow: 'Need a sharper scope?',
          title: 'We can map phase one around the pages that matter most',
          description: 'A smaller release with the right structure beats a giant sitemap that never gets maintained.',
          primaryButton: { label: 'Talk through scope', href: '/contact', variant: 'primary', external: false },
          secondaryButton: { label: 'Learn about process', href: '/growth-systems', variant: 'ghost', external: false },
          backgroundImage: media.ctaImage
        }
      ]
    },
    {
      title: 'About',
      slug: 'about',
      navigationLabel: 'About',
      excerpt: 'About Northstar Studio and the way we approach structured digital work.',
      seo: buildSeo(
        'About | Northstar Studio',
        'Learn how Northstar Studio approaches strategy, content systems, and website execution for growing service businesses.',
        '/about',
        media.aboutHero
      ),
      blocks: [
        {
          __component: 'sections.hero-section',
          eyebrow: 'About Northstar Studio',
          title: 'We design websites the way',
          highlightedText: 'teams actually use them',
          description: 'Northstar Studio was built around a simple observation: most service businesses do not need more decorative pages, they need a system that lets the site keep improving after launch.',
          primaryButton: { label: 'See how we work', href: '/growth-systems', variant: 'primary', external: false },
          secondaryButton: { label: 'Contact us', href: '/contact', variant: 'secondary', external: false },
          metrics: [
            { value: 'Strategy', label: 'before decoration' },
            { value: 'Systems', label: 'before entropy' },
            { value: 'Editing', label: 'before dependency' }
          ],
          image: media.aboutHero,
          variant: 'split'
        },
        {
          __component: 'sections.rich-content',
          eyebrow: 'Perspective',
          title: 'The goal is not to lock clients into',
          highlightedText: 'a designer forever',
          bodyOne: 'Professional service firms often outgrow their websites because the structure underneath was never meant to support real publishing. New case studies, new service pages, and new vertical pages all become exceptions.',
          bodyTwo: 'We prefer a more durable approach: define a thoughtful page model, a smaller set of better section blocks, and a frontend system that still feels custom when reused.',
          bullets: [
            { title: 'Editorial discipline', description: 'Page-level SEO and reusable sections give editors a clear place to make changes.' },
            { title: 'Professional pacing', description: 'The layouts are built for scanning, comparison, and repeated client-facing use.' },
            { title: 'Motion with restraint', description: 'Animations support hierarchy and polish without making the experience noisy.' }
          ],
          image: media.aboutImage,
          imageAlt: 'Team collaboration session',
          cta: { label: 'Explore services', href: '/services', variant: 'primary', external: false },
          layout: 'image-left'
        },
        {
          __component: 'sections.stat-band',
          eyebrow: 'What clients buy',
          title: 'Not just design. Better operating leverage.',
          items: [
            { value: 'Reusable', label: 'page blocks' },
            { value: 'Editable', label: 'navigation and SEO' },
            { value: 'Structured', label: 'content hierarchy' },
            { value: 'Responsive', label: 'frontend polish' }
          ]
        },
        {
          __component: 'sections.logo-cloud',
          eyebrow: 'Typical partners',
          title: 'We work best with teams that already know their value',
          description: 'The sweet spot is a business that has real expertise and proof, but needs a website that presents it more cleanly.',
          logos: [
            { name: 'Consultancies' },
            { name: 'Studios' },
            { name: 'Fractional teams' },
            { name: 'Advisors' }
          ]
        },
        {
          __component: 'sections.cta-banner',
          eyebrow: 'Build the next release',
          title: 'Need a site that looks more mature and runs more cleanly?',
          description: 'We can start with a small number of high-leverage pages and grow from there.',
          primaryButton: { label: 'Start the conversation', href: '/contact', variant: 'primary', external: false },
          secondaryButton: { label: 'See the process', href: '/growth-systems', variant: 'ghost', external: false },
          backgroundImage: media.ctaImage
        }
      ]
    },
    {
      title: 'Growth Systems',
      slug: 'growth-systems',
      navigationLabel: 'Growth Systems',
      excerpt: 'How Northstar Studio structures content, UX, and publishing systems.',
      seo: buildSeo(
        'Growth Systems | Northstar Studio',
        'See the system behind Northstar Studio websites: content architecture, reusable blocks, SEO fields, and conversion-aware page design.',
        '/growth-systems',
        media.strategyHero
      ),
      blocks: [
        {
          __component: 'sections.hero-section',
          eyebrow: 'Growth systems',
          title: 'The operating model behind a',
          highlightedText: 'client-ready website',
          description: 'A strong website is not just a visual layer. It is a content system with reusable sections, clear page goals, and enough editorial guardrails to keep quality high over time.',
          primaryButton: { label: 'Book a strategy call', href: '/contact', variant: 'primary', external: false },
          secondaryButton: { label: 'Explore services', href: '/services', variant: 'secondary', external: false },
          metrics: [
            { value: 'Pages', label: 'built from blocks' },
            { value: 'SEO', label: 'set per page' },
            { value: 'Teams', label: 'publish without devs' }
          ],
          image: media.strategyHero,
          variant: 'split'
        },
        {
          __component: 'sections.process-steps',
          eyebrow: 'System design',
          title: 'What a better website architecture usually includes',
          description: 'These are the pieces that let a site evolve without turning into a collection of disconnected layouts.',
          steps: [
            { title: 'Page model', description: 'A collection type for pages with title, slug, excerpt, SEO, and dynamic sections.' },
            { title: 'Reusable blocks', description: 'Heroes, content splits, proof sections, CTAs, and contact panels editors can recombine.' },
            { title: 'Global settings', description: 'Navigation, footer, contact details, and default SEO live in one place.' },
            { title: 'Collection content', description: 'Services and testimonials stay structured so they can appear across multiple pages.' }
          ]
        },
        {
          __component: 'sections.rich-content',
          eyebrow: 'Why teams care',
          title: 'This is how you stop every new page from becoming',
          highlightedText: 'a custom redesign',
          bodyOne: 'When the website has a real content model, adding a new vertical page or campaign page becomes an editorial task with design constraints already built in.',
          bodyTwo: 'That lowers publishing friction, keeps the site more coherent, and makes the brand feel more mature every time new content ships.',
          bullets: [
            { title: 'Faster launches', description: 'New pages reuse approved sections and tokenized styling.' },
            { title: 'Safer editing', description: 'Critical navigation, proof, SEO, and CTA patterns stay structurally consistent.' },
            { title: 'Stronger storytelling', description: 'Pages still feel intentional because sections are curated, not arbitrary.' }
          ],
          image: media.workFeature,
          imageAlt: 'Strategy workshop notes',
          cta: { label: 'See the contact page', href: '/contact', variant: 'primary', external: false },
          layout: 'image-right'
        },
        {
          __component: 'sections.stat-band',
          eyebrow: 'Operational outcomes',
          title: 'What the system improves after launch',
          items: [
            { value: 'Cleaner', label: 'content governance' },
            { value: 'Higher', label: 'team confidence' },
            { value: 'Faster', label: 'page creation' },
            { value: 'Better', label: 'SEO hygiene' }
          ]
        },
        {
          __component: 'sections.cta-banner',
          eyebrow: 'Apply it to your site',
          title: 'We can restructure the current website without losing momentum',
          description: 'You do not need to freeze the business for three months to get a cleaner content system in place.',
          primaryButton: { label: 'Talk through the current site', href: '/contact', variant: 'primary', external: false },
          secondaryButton: { label: 'Back to home', href: '/', variant: 'ghost', external: false },
          backgroundImage: media.ctaImage
        }
      ]
    },
    {
      title: 'Contact',
      slug: 'contact',
      navigationLabel: 'Contact',
      excerpt: 'Contact Northstar Studio to discuss a strategy-led website redesign.',
      seo: buildSeo(
        'Contact | Northstar Studio',
        'Contact Northstar Studio to plan a client-ready, multi-page website with Strapi and a cleaner content system.',
        '/contact',
        media.contactHero
      ),
      blocks: [
        {
          __component: 'sections.hero-section',
          eyebrow: 'Contact',
          title: 'Bring the messy version of',
          highlightedText: 'the problem',
          description: 'If the current site feels outdated, hard to edit, or inconsistent from page to page, that is enough to start. We can turn it into a cleaner release plan.',
          primaryButton: { label: 'Send an inquiry', href: '/contact', variant: 'primary', external: false },
          secondaryButton: { label: 'Review services', href: '/services', variant: 'secondary', external: false },
          metrics: [
            { value: 'Strategy', label: 'first conversation' },
            { value: 'Scope', label: 'shaped around reality' },
            { value: 'Clarity', label: 'before production' }
          ],
          image: media.contactHero,
          variant: 'split'
        },
        {
          __component: 'sections.contact-panel',
          eyebrow: 'Start here',
          title: 'Tell us what the website needs to do next',
          description: 'Share what is changing in the business, what feels broken in the current site, and which pages are most important right now.',
          formTitle: 'Project inquiry',
          successText: 'Thanks. We will get back to you shortly.',
          fallbackNotice: ''
        },
        {
          __component: 'sections.cta-banner',
          eyebrow: 'Prefer email?',
          title: 'You can also reach out directly with a short project note',
          description: 'A few lines about your business, the current site, and the next milestone are enough to start.',
          primaryButton: { label: 'Email hello@northstarstudio.co', href: 'mailto:hello@northstarstudio.co', variant: 'primary', external: true },
          secondaryButton: { label: 'Back to home', href: '/', variant: 'ghost', external: false },
          backgroundImage: media.ctaImage
        }
      ]
    }
  ];

  for (const page of pages) {
    await upsertCollectionEntry(uids.page, { slug: page.slug }, {
      ...page,
      publishedAt: new Date().toISOString()
    });
  }

  await app.destroy();
};

runSeed()
  .then(() => {
    console.log('Seeded Strapi content and media.');
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    if (global.strapi) {
      await global.strapi.destroy();
    }
    process.exit(1);
  });
