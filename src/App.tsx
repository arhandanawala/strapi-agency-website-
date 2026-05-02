import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Route, Routes } from 'react-router-dom'
import CmsFooter from './components/CmsFooter'
import CmsNavigation from './components/CmsNavigation'
import type { Service, SiteSettings, SiteTheme, Testimonial } from './services/strapi'
import { getServices, getSiteSettings, getSiteTheme, getTestimonials } from './services/strapi'
import CmsPage from './pages/CmsPage'
import './App.css'

const emptySettings: SiteSettings = {
  siteName: 'Northstar Studio',
  primaryNavigation: [],
  footerColumns: [],
  socialLinks: [],
  contactItems: [],
}

const fallbackTheme: SiteTheme = {
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

function App() {
  const [settings, setSettings] = useState<SiteSettings>(emptySettings)
  const [theme, setTheme] = useState<SiteTheme>(fallbackTheme)
  const [services, setServices] = useState<Service[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSiteSettings(), getSiteTheme(), getServices(), getTestimonials()])
      .then(([siteSettings, siteTheme, serviceItems, testimonialItems]) => {
        setSettings(siteSettings)
        setTheme(siteTheme)
        setServices(serviceItems)
        setTestimonials(testimonialItems)
      })
      .finally(() => setLoading(false))
  }, [])

  const themeVars = {
    '--page-background': theme.pageBackgroundColor,
    '--surface-color': theme.surfaceColor,
    '--bg-light': theme.mutedSectionBackgroundColor,
    '--border-color': theme.borderColor,
    '--primary-color': theme.primaryColor,
    '--primary-dark': theme.primaryDarkColor,
    '--secondary-color': theme.secondaryColor,
    '--text-primary': theme.textPrimaryColor,
    '--text-secondary': theme.textSecondaryColor,
    '--label-bg': theme.labelBackgroundColor,
    '--label-text': theme.labelTextColor,
    '--nav-scrolled-bg': theme.navScrolledBackgroundColor,
    '--footer-bg': theme.footerBackgroundColor,
    '--footer-text': theme.footerTextColor,
    '--hero-shape-1-start': theme.heroShapeOneStartColor,
    '--hero-shape-1-end': theme.heroShapeOneEndColor,
    '--hero-shape-2-start': theme.heroShapeTwoStartColor,
    '--hero-shape-2-end': theme.heroShapeTwoEndColor,
    '--hero-shape-3-start': theme.heroShapeThreeStartColor,
    '--hero-shape-3-end': theme.heroShapeThreeEndColor,
    '--hero-overlay': theme.heroOverlayColor,
    '--star-color': theme.starColor,
  } as CSSProperties

  if (loading) {
    return (
      <div className="app-shell" style={themeVars}>
        <main className="page-shell page-shell--loading">
          <div className="loading-panel">
            <h1>Loading website</h1>
            <p>Syncing theme, navigation, and page content from Strapi.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell" style={themeVars}>
      <CmsNavigation settings={settings} />
      <Routes>
        <Route path="/" element={<CmsPage settings={settings} theme={theme} services={services} testimonials={testimonials} />} />
        <Route
          path="/:slug"
          element={<CmsPage settings={settings} theme={theme} services={services} testimonials={testimonials} />}
        />
      </Routes>
      <CmsFooter settings={settings} />
    </div>
  )
}

export default App
