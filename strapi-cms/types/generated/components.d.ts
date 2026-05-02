import type { Schema, Attribute } from '@strapi/strapi';

export interface SectionsContactPanel extends Schema.Component {
  collectionName: 'components_sections_contact_panels';
  info: {
    displayName: 'Contact Panel';
    description: 'Contact form and information section';
  };
  attributes: {
    eyebrow: Attribute.String;
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    formTitle: Attribute.String;
    successText: Attribute.String;
    fallbackNotice: Attribute.String;
  };
}

export interface SectionsCtaBanner extends Schema.Component {
  collectionName: 'components_sections_cta_banners';
  info: {
    displayName: 'CTA Banner';
    description: 'Conversion-focused banner';
  };
  attributes: {
    eyebrow: Attribute.String;
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    primaryButton: Attribute.Component<'shared.button'>;
    secondaryButton: Attribute.Component<'shared.button'>;
    backgroundImage: Attribute.Media;
  };
}

export interface SectionsHeroSection extends Schema.Component {
  collectionName: 'components_sections_hero_sections';
  info: {
    displayName: 'Hero Section';
    description: 'High-impact page hero';
  };
  attributes: {
    eyebrow: Attribute.String;
    title: Attribute.String & Attribute.Required;
    highlightedText: Attribute.String;
    description: Attribute.Text;
    primaryButton: Attribute.Component<'shared.button'>;
    secondaryButton: Attribute.Component<'shared.button'>;
    metrics: Attribute.Component<'shared.stat', true>;
    image: Attribute.Media;
    variant: Attribute.Enumeration<['split', 'immersive']> &
      Attribute.DefaultTo<'split'>;
  };
}

export interface SectionsLogoCloud extends Schema.Component {
  collectionName: 'components_sections_logo_clouds';
  info: {
    displayName: 'Logo Cloud';
    description: 'Brand logos or trust badges';
  };
  attributes: {
    eyebrow: Attribute.String;
    title: Attribute.String;
    description: Attribute.Text;
    logos: Attribute.Component<'shared.logo-item', true>;
  };
}

export interface SectionsProcessSteps extends Schema.Component {
  collectionName: 'components_sections_process_steps';
  info: {
    displayName: 'Process Steps';
    description: 'Step-by-step methodology';
  };
  attributes: {
    eyebrow: Attribute.String;
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    steps: Attribute.Component<'shared.feature', true>;
  };
}

export interface SectionsRichContent extends Schema.Component {
  collectionName: 'components_sections_rich_contents';
  info: {
    displayName: 'Rich Content';
    description: 'Editorial text plus image';
  };
  attributes: {
    eyebrow: Attribute.String;
    title: Attribute.String & Attribute.Required;
    highlightedText: Attribute.String;
    bodyOne: Attribute.Text;
    bodyTwo: Attribute.Text;
    bullets: Attribute.Component<'shared.feature', true>;
    image: Attribute.Media;
    imageAlt: Attribute.String;
    cta: Attribute.Component<'shared.button'>;
    layout: Attribute.Enumeration<['image-left', 'image-right', 'text-only']> &
      Attribute.DefaultTo<'image-right'>;
  };
}

export interface SectionsServiceShowcase extends Schema.Component {
  collectionName: 'components_sections_service_showcases';
  info: {
    displayName: 'Service Showcase';
    description: 'Service collection highlight';
  };
  attributes: {
    eyebrow: Attribute.String;
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    showFeaturedOnly: Attribute.Boolean & Attribute.DefaultTo<false>;
    cta: Attribute.Component<'shared.button'>;
  };
}

export interface SectionsStatBand extends Schema.Component {
  collectionName: 'components_sections_stat_bands';
  info: {
    displayName: 'Stat Band';
    description: 'A row of metrics';
  };
  attributes: {
    eyebrow: Attribute.String;
    title: Attribute.String;
    items: Attribute.Component<'shared.stat', true>;
  };
}

export interface SectionsTestimonialShowcase extends Schema.Component {
  collectionName: 'components_sections_testimonial_showcases';
  info: {
    displayName: 'Testimonial Showcase';
    description: 'Client proof section';
  };
  attributes: {
    eyebrow: Attribute.String;
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    cta: Attribute.Component<'shared.button'>;
  };
}

export interface SharedButton extends Schema.Component {
  collectionName: 'components_shared_buttons';
  info: {
    displayName: 'Button';
    description: 'Reusable CTA button';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    href: Attribute.String & Attribute.Required;
    variant: Attribute.Enumeration<['primary', 'secondary', 'ghost']> &
      Attribute.DefaultTo<'primary'>;
    external: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface SharedContactItem extends Schema.Component {
  collectionName: 'components_shared_contact_items';
  info: {
    displayName: 'Contact Item';
    description: 'Contact information row';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    value: Attribute.String & Attribute.Required;
    icon: Attribute.Enumeration<['email', 'phone', 'location']> &
      Attribute.DefaultTo<'email'>;
  };
}

export interface SharedFeature extends Schema.Component {
  collectionName: 'components_shared_features';
  info: {
    displayName: 'Feature';
    description: 'Title and description pair';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text & Attribute.Required;
  };
}

export interface SharedFooterColumn extends Schema.Component {
  collectionName: 'components_shared_footer_columns';
  info: {
    displayName: 'Footer Column';
    description: 'Footer link group';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    links: Attribute.Component<'shared.link', true>;
  };
}

export interface SharedLink extends Schema.Component {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
    description: 'Reusable navigation or footer link';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    href: Attribute.String & Attribute.Required;
    external: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface SharedLogoItem extends Schema.Component {
  collectionName: 'components_shared_logo_items';
  info: {
    displayName: 'Logo Item';
    description: 'Logo or text badge item';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    href: Attribute.String;
    logo: Attribute.Media;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
    description: 'SEO metadata';
  };
  attributes: {
    metaTitle: Attribute.String & Attribute.Required;
    metaDescription: Attribute.Text & Attribute.Required;
    canonicalPath: Attribute.String;
    ogTitle: Attribute.String;
    ogDescription: Attribute.Text;
    keywords: Attribute.String;
    noIndex: Attribute.Boolean & Attribute.DefaultTo<false>;
    socialImage: Attribute.Media;
  };
}

export interface SharedStat extends Schema.Component {
  collectionName: 'components_shared_stats';
  info: {
    displayName: 'Stat';
    description: 'Number and label pair';
  };
  attributes: {
    value: Attribute.String & Attribute.Required;
    label: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'sections.contact-panel': SectionsContactPanel;
      'sections.cta-banner': SectionsCtaBanner;
      'sections.hero-section': SectionsHeroSection;
      'sections.logo-cloud': SectionsLogoCloud;
      'sections.process-steps': SectionsProcessSteps;
      'sections.rich-content': SectionsRichContent;
      'sections.service-showcase': SectionsServiceShowcase;
      'sections.stat-band': SectionsStatBand;
      'sections.testimonial-showcase': SectionsTestimonialShowcase;
      'shared.button': SharedButton;
      'shared.contact-item': SharedContactItem;
      'shared.feature': SharedFeature;
      'shared.footer-column': SharedFooterColumn;
      'shared.link': SharedLink;
      'shared.logo-item': SharedLogoItem;
      'shared.seo': SharedSeo;
      'shared.stat': SharedStat;
    }
  }
}
