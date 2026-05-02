import { useEffect } from 'react'
import type { SeoData } from '../services/strapi'

interface SeoProps {
  seo?: SeoData
  siteName: string
}

const ensureMeta = (selector: string, attributes: Record<string, string>) => {
  let node = document.head.querySelector<HTMLMetaElement>(selector)
  if (!node) {
    node = document.createElement('meta')
    Object.entries(attributes).forEach(([key, value]) => node?.setAttribute(key, value))
    document.head.appendChild(node)
  }
  return node
}

export default function Seo({ seo, siteName }: SeoProps) {
  useEffect(() => {
    const title = seo?.metaTitle || siteName
    document.title = title

    const description = seo?.metaDescription || ''
    ensureMeta('meta[name="description"]', { name: 'description' }).setAttribute('content', description)
    ensureMeta('meta[property="og:title"]', { property: 'og:title' }).setAttribute('content', seo?.ogTitle || title)
    ensureMeta('meta[property="og:description"]', { property: 'og:description' }).setAttribute(
      'content',
      seo?.ogDescription || description
    )
    ensureMeta('meta[name="robots"]', { name: 'robots' }).setAttribute(
      'content',
      seo?.noIndex ? 'noindex, nofollow' : 'index, follow'
    )

    if (seo?.keywords) {
      ensureMeta('meta[name="keywords"]', { name: 'keywords' }).setAttribute('content', seo.keywords)
    }

    if (seo?.socialImage?.url) {
      ensureMeta('meta[property="og:image"]', { property: 'og:image' }).setAttribute('content', seo.socialImage.url)
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = seo?.canonicalPath
      ? `${window.location.origin}${seo.canonicalPath}`
      : window.location.href
  }, [seo, siteName])

  return null
}
