export interface NavigationLink {
  name: string
  href: string
}

export interface HeroStat {
  value: string
  label: string
}

export interface FeatureItem {
  title: string
  description: string
}

export interface ContactInfoItem {
  label: string
  value: string
  icon: string
}

export interface HomepageContent {
  siteName: string
  footerText: string
  navigationCtaText: string
  navigationLinks: NavigationLink[]
  heroBadgeLabel: string
  heroBadgeText: string
  heroTitle: string
  heroHighlightedText: string
  heroSubtitle: string
  heroPrimaryButtonText: string
  heroSecondaryButtonText: string
  heroStats: HeroStat[]
  servicesTitle: string
  servicesSubtitle: string
  servicesLinkText: string
  aboutLabel: string
  aboutTitle: string
  aboutHighlightedText: string
  aboutDescriptionOne: string
  aboutDescriptionTwo: string
  aboutImageUrl: string
  aboutImage?: {
    url: string
  } | null
  aboutImageAlt: string
  aboutExperienceNumber: string
  aboutExperienceText: string
  aboutFeatures: FeatureItem[]
  aboutCtaText: string
  testimonialsTitle: string
  testimonialsSubtitle: string
  contactLabel: string
  contactTitle: string
  contactHighlightedText: string
  contactDescription: string
  contactInfoItems: ContactInfoItem[]
  contactFormNameLabel: string
  contactFormNamePlaceholder: string
  contactFormEmailLabel: string
  contactFormEmailPlaceholder: string
  contactFormMessageLabel: string
  contactFormMessagePlaceholder: string
  contactSubmitButtonText: string
  contactSuccessText: string
  contactFallbackNotice: string
}

export interface SiteTheme {
  pageBackgroundColor: string
  surfaceColor: string
  mutedSectionBackgroundColor: string
  borderColor: string
  primaryColor: string
  primaryDarkColor: string
  secondaryColor: string
  textPrimaryColor: string
  textSecondaryColor: string
  labelBackgroundColor: string
  labelTextColor: string
  navScrolledBackgroundColor: string
  footerBackgroundColor: string
  footerTextColor: string
  heroShapeOneStartColor: string
  heroShapeOneEndColor: string
  heroShapeTwoStartColor: string
  heroShapeTwoEndColor: string
  heroShapeThreeStartColor: string
  heroShapeThreeEndColor: string
  heroOverlayColor: string
  starColor: string
}

export const defaultHomepageContent: HomepageContent = {
  siteName: 'YourBusiness',
  footerText: '© 2026 Your Business. All rights reserved.',
  navigationCtaText: 'Get Started',
  navigationLinks: [
    { name: 'Home', href: '#hero' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ],
  heroBadgeLabel: 'New',
  heroBadgeText: 'Transform Your Business Today',
  heroTitle: 'We Help You',
  heroHighlightedText: 'Grow Faster',
  heroSubtitle:
    "Empowering businesses with innovative solutions that drive results. Our expert team delivers cutting-edge strategies to help you succeed in today's competitive market.",
  heroPrimaryButtonText: 'Start Your Journey',
  heroSecondaryButtonText: 'Learn More',
  heroStats: [
    { value: '500+', label: 'Happy Clients' },
    { value: '98%', label: 'Success Rate' },
    { value: '10+', label: 'Years Experience' },
  ],
  servicesTitle: 'Our Services',
  servicesSubtitle: 'Comprehensive solutions tailored to your business needs',
  servicesLinkText: 'Learn More',
  aboutLabel: 'About Us',
  aboutTitle: 'We Help Businesses',
  aboutHighlightedText: 'Grow & Succeed',
  aboutDescriptionOne:
    "With over a decade of experience, we've helped hundreds of businesses transform their operations and achieve remarkable growth. Our approach combines strategic thinking with creative execution.",
  aboutDescriptionTwo:
    "We believe in building long-term partnerships with our clients, understanding their unique challenges, and delivering solutions that drive real results.",
  aboutImageUrl:
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=700&fit=crop',
  aboutImage: null,
  aboutImageAlt: 'Team working together',
  aboutExperienceNumber: '10+',
  aboutExperienceText: 'Years of Experience',
  aboutFeatures: [
    {
      title: 'Innovative Solutions',
      description: 'We bring fresh ideas and cutting-edge technologies to every project.',
    },
    {
      title: 'Expert Team',
      description: 'Our team of professionals brings years of industry experience.',
    },
    {
      title: 'Client Focus',
      description: 'Your success is our priority. We work closely with you to achieve your goals.',
    },
  ],
  aboutCtaText: 'Work With Us',
  testimonialsTitle: 'What Our Clients Say',
  testimonialsSubtitle: 'Trusted by businesses worldwide to deliver exceptional results',
  contactLabel: 'Get In Touch',
  contactTitle: "Let's Start a",
  contactHighlightedText: 'Conversation',
  contactDescription:
    "Ready to transform your business? We'd love to hear from you. Send us a message and we'll get back to you within 24 hours.",
  contactInfoItems: [
    { label: 'Email', value: 'hello@yourbusiness.com', icon: 'email' },
    { label: 'Phone', value: '+1 (555) 123-4567', icon: 'phone' },
    { label: 'Address', value: '123 Business Ave, Suite 100', icon: 'location' },
  ],
  contactFormNameLabel: 'Your Name',
  contactFormNamePlaceholder: 'John Doe',
  contactFormEmailLabel: 'Email Address',
  contactFormEmailPlaceholder: 'john@example.com',
  contactFormMessageLabel: 'Your Message',
  contactFormMessagePlaceholder: 'Tell us about your project...',
  contactSubmitButtonText: 'Send Message',
  contactSuccessText: 'Sent!',
  contactFallbackNotice: 'CMS not connected. Form will log to console only.',
}

export const defaultSiteTheme: SiteTheme = {
  pageBackgroundColor: '#ffffff',
  surfaceColor: '#ffffff',
  mutedSectionBackgroundColor: '#f9fafb',
  borderColor: '#e5e7eb',
  primaryColor: '#6366f1',
  primaryDarkColor: '#4f46e5',
  secondaryColor: '#ec4899',
  textPrimaryColor: '#1f2937',
  textSecondaryColor: '#6b7280',
  labelBackgroundColor: 'rgba(99, 102, 241, 0.1)',
  labelTextColor: '#6366f1',
  navScrolledBackgroundColor: 'rgba(255, 255, 255, 0.95)',
  footerBackgroundColor: '#111827',
  footerTextColor: '#ffffff',
  heroShapeOneStartColor: '#6366f1',
  heroShapeOneEndColor: '#4f46e5',
  heroShapeTwoStartColor: '#ec4899',
  heroShapeTwoEndColor: '#f472b6',
  heroShapeThreeStartColor: '#8b5cf6',
  heroShapeThreeEndColor: '#a78bfa',
  heroOverlayColor: 'rgba(255,255,255,0.8)',
  starColor: '#fbbf24',
}
