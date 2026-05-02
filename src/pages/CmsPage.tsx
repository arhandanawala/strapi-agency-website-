import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import BlockRenderer from '../components/BlockRenderer'
import Seo from '../components/Seo'
import type { CmsPage as CmsPageType, Service, SiteSettings, SiteTheme, Testimonial } from '../services/strapi'
import { getPageBySlug } from '../services/strapi'

interface CmsPageProps {
  settings: SiteSettings
  theme: SiteTheme
  services: Service[]
  testimonials: Testimonial[]
}

export default function CmsPage({ settings, services, testimonials }: CmsPageProps) {
  const { slug } = useParams()
  const location = useLocation()
  const [page, setPage] = useState<CmsPageType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  useEffect(() => {
    let active = true
    setLoading(true)

    getPageBySlug(slug || 'home')
      .then((result) => {
        if (active) {
          setPage(result)
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setPage(null)
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [slug])

  if (loading) {
    return (
      <main className="page-shell page-shell--loading">
        <div className="loading-panel">
          <h1>Loading page</h1>
          <p>Fetching the latest content from Strapi.</p>
        </div>
      </main>
    )
  }

  if (!page) {
    return (
      <main className="page-shell">
        <div className="not-found-panel">
          <span className="section-eyebrow">Page not found</span>
          <h1>This route does not have a published CMS page yet.</h1>
          <p>Create or publish the page in Strapi and it will render here automatically.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <Seo seo={page.seo || settings.defaultSeo} siteName={settings.siteName} />
      <BlockRenderer blocks={page.blocks} services={services} testimonials={testimonials} settings={settings} />
    </main>
  )
}
