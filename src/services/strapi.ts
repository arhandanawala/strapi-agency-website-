export interface StrapiMedia {
  id?: number
  url: string
  alternativeText?: string
}

export interface CmsLink {
  name?: string
  label?: string
  href: string
  external?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
}

export interface SeoData {
  metaTitle: string
  metaDescription: string
  canonicalPath?: string
  ogTitle?: string
  ogDescription?: string
  keywords?: string
  noIndex?: boolean
  socialImage?: StrapiMedia
}

export interface SiteSettings {
  siteName: string
  siteTagline?: string
  announcementText?: string
  logo?: StrapiMedia
  primaryNavigation: CmsLink[]
  headerCta?: CmsLink
  footerTagline?: string
  footerColumns: Array<{ title: string; links: CmsLink[] }>
  socialLinks: CmsLink[]
  contactItems: Array<{ label: string; value: string; icon: string }>
  defaultSeo?: SeoData
}

export interface Service {
  id: string
  title: string
  description: string
  icon?: string
  image?: StrapiMedia
  slug?: string
  featured?: boolean
}

export interface Testimonial {
  id: string
  name: string
  role?: string
  company?: string
  content: string
  image?: StrapiMedia
  rating?: number
}

export interface CmsBlock {
  id?: number
  __component: string
  [key: string]: unknown
}

export interface CmsPage {
  id: number
  title: string
  slug: string
  navigationLabel?: string
  excerpt?: string
  seo?: SeoData
  blocks: CmsBlock[]
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

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

const defaultTheme: SiteTheme = {
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
  navScrolledBackgroundColor: 'rgba(251,251,253,0.92)',
  footerBackgroundColor: '#172033',
  footerTextColor: '#f8fafc',
  heroShapeOneStartColor: '#0f766e',
  heroShapeOneEndColor: '#14b8a6',
  heroShapeTwoStartColor: '#ea580c',
  heroShapeTwoEndColor: '#fb923c',
  heroShapeThreeStartColor: '#1d4ed8',
  heroShapeThreeEndColor: '#60a5fa',
  heroOverlayColor: 'rgba(251,251,253,0.82)',
  starColor: '#f59e0b',
}

const pagePopulateQuery = [
  'populate[seo][populate]=*',
  'populate[blocks][on][sections.hero-section][populate][primaryButton]=*',
  'populate[blocks][on][sections.hero-section][populate][secondaryButton]=*',
  'populate[blocks][on][sections.hero-section][populate][metrics]=*',
  'populate[blocks][on][sections.hero-section][populate][image]=*',
  'populate[blocks][on][sections.service-showcase][populate][cta]=*',
  'populate[blocks][on][sections.rich-content][populate][bullets]=*',
  'populate[blocks][on][sections.rich-content][populate][cta]=*',
  'populate[blocks][on][sections.rich-content][populate][image]=*',
  'populate[blocks][on][sections.stat-band][populate][items]=*',
  'populate[blocks][on][sections.process-steps][populate][steps]=*',
  'populate[blocks][on][sections.logo-cloud][populate][logos][populate][logo]=*',
  'populate[blocks][on][sections.testimonial-showcase][populate][cta]=*',
  'populate[blocks][on][sections.cta-banner][populate][primaryButton]=*',
  'populate[blocks][on][sections.cta-banner][populate][secondaryButton]=*',
  'populate[blocks][on][sections.cta-banner][populate][backgroundImage]=*',
].join('&')

const siteSettingsPopulateQuery = [
  'populate[logo]=*',
  'populate[primaryNavigation]=*',
  'populate[headerCta]=*',
  'populate[footerColumns][populate]=*',
  'populate[socialLinks]=*',
  'populate[contactItems]=*',
  'populate[defaultSeo][populate]=*',
].join('&')

const collectionPopulateQuery = 'populate=*'

const stripRichText = (value?: string) =>
  (value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const fetchFromStrapi = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Strapi request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

const normalizeMedia = (image: any): StrapiMedia | undefined => {
  if (!image) return undefined

  const media = image?.data ?? image
  const attrs = media?.attributes ?? media
  const url = attrs?.url

  if (!url) return undefined

  return {
    id: media?.id,
    url: url.startsWith('http') ? url : `${STRAPI_URL}${url.startsWith('/') ? url : `/${url}`}`,
    alternativeText: attrs?.alternativeText || attrs?.name || '',
  }
}

export const getStrapiImageUrl = (image: any): string | undefined => normalizeMedia(image)?.url

const normalizeLink = (item: any): CmsLink | undefined => {
  if (!item) return undefined
  return {
    name: item.name,
    label: item.label,
    href: item.href,
    external: item.external ?? item.isExternal ?? false,
    variant: item.variant,
  }
}

const normalizeSeo = (seo: any): SeoData | undefined => {
  if (!seo) return undefined
  return {
    metaTitle: seo.metaTitle || '',
    metaDescription: seo.metaDescription || '',
    canonicalPath: seo.canonicalPath || seo.canonicalURL || '',
    ogTitle: seo.ogTitle || seo.metaTitle || '',
    ogDescription: seo.ogDescription || seo.metaDescription || '',
    keywords: seo.keywords || '',
    noIndex: seo.noIndex || false,
    socialImage: normalizeMedia(seo.socialImage),
  }
}

const normalizeBlock = (block: any): CmsBlock => ({
  ...block,
  image: normalizeMedia(block.image),
  backgroundImage: normalizeMedia(block.backgroundImage),
  primaryButton: normalizeLink(block.primaryButton),
  secondaryButton: normalizeLink(block.secondaryButton),
  cta: normalizeLink(block.cta),
  logos: (block.logos || []).map((logo: any) => ({
    ...logo,
    logo: normalizeMedia(logo.logo),
  })),
})

export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const payload = await fetchFromStrapi(`site-setting?${siteSettingsPopulateQuery}`)
    const attrs = payload?.data?.attributes ?? payload?.data ?? {}

    return {
      siteName: attrs.siteName || 'Northstar Studio',
      siteTagline: attrs.siteTagline || '',
      announcementText: attrs.announcementText || '',
      logo: normalizeMedia(attrs.logo),
      primaryNavigation: (attrs.primaryNavigation || []).map(normalizeLink).filter(Boolean),
      headerCta: normalizeLink(attrs.headerCta),
      footerTagline: attrs.footerTagline || '',
      footerColumns: (attrs.footerColumns || []).map((column: any) => ({
        title: column.title,
        links: (column.links || []).map(normalizeLink).filter(Boolean),
      })),
      socialLinks: (attrs.socialLinks || []).map(normalizeLink).filter(Boolean),
      contactItems: attrs.contactItems || [],
      defaultSeo: normalizeSeo(attrs.defaultSeo),
    }
  } catch {
    return {
      siteName: 'Northstar Studio',
      primaryNavigation: [],
      footerColumns: [],
      socialLinks: [],
      contactItems: [],
    }
  }
}

export const getSiteTheme = async (): Promise<SiteTheme> => {
  try {
    const payload = await fetchFromStrapi('site-theme')
    const attrs = payload?.data?.attributes ?? payload?.data ?? {}
    return { ...defaultTheme, ...attrs }
  } catch {
    return defaultTheme
  }
}

export const getPageBySlug = async (slug: string): Promise<CmsPage | null> => {
  try {
    const payload = await fetchFromStrapi(
      `pages?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1&${pagePopulateQuery}`
    )

    const item = payload?.data?.[0]
    const attrs = item?.attributes

    if (!item || !attrs) return null

    return {
      id: item.id,
      title: attrs.title,
      slug: attrs.slug,
      navigationLabel: attrs.navigationLabel || '',
      excerpt: attrs.excerpt || '',
      seo: normalizeSeo(attrs.seo),
      blocks: (attrs.blocks || []).map(normalizeBlock),
    }
  } catch {
    return null
  }
}

export const getServices = async (): Promise<Service[]> => {
  try {
    const payload = await fetchFromStrapi(`services?${collectionPopulateQuery}`)
    return (payload?.data || []).map((item: any) => ({
      id: String(item.id),
      title: item.attributes?.title || '',
      description: stripRichText(item.attributes?.description),
      icon: item.attributes?.icon || undefined,
      image: normalizeMedia(item.attributes?.image),
      slug: item.attributes?.slug || undefined,
      featured: item.attributes?.featured || false,
    }))
  } catch {
    return []
  }
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const payload = await fetchFromStrapi(`testimonials?${collectionPopulateQuery}`)
    return (payload?.data || []).map((item: any) => ({
      id: String(item.id),
      name: item.attributes?.name || '',
      role: item.attributes?.role || '',
      company: item.attributes?.company || '',
      content: stripRichText(item.attributes?.content),
      image: normalizeMedia(item.attributes?.image),
      rating: item.attributes?.rating || 5,
    }))
  } catch {
    return []
  }
}

export const submitContactForm = async (payload: {
  name: string
  email: string
  message: string
}) => {
  return fetchFromStrapi('contact-submissions', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        name: payload.name,
        email: payload.email,
        message: payload.message,
      },
    }),
  })
}
