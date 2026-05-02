import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import type { SiteSettings } from '../services/strapi'

interface CmsNavigationProps {
  settings: SiteSettings
}

export default function CmsNavigation({ settings }: CmsNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [settings.primaryNavigation])

  return (
    <>
      {settings.announcementText ? (
        <div className="announcement-bar">
          <span>{settings.announcementText}</span>
        </div>
      ) : null}
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="site-header__inner">
          <Link className="brand" to="/">
            {settings.logo ? (
              <img src={settings.logo.url} alt={settings.logo.alternativeText || settings.siteName} />
            ) : (
              <>
                <span className="brand__mark">N</span>
                <span className="brand__text">
                  <strong>{settings.siteName}</strong>
                  <small>{settings.siteTagline}</small>
                </span>
              </>
            )}
          </Link>

          <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`}>
            {settings.primaryNavigation.map((link) =>
              link.external ? (
                <a key={`${link.href}-${link.name}`} href={link.href} target="_blank" rel="noreferrer">
                  {link.name || link.label}
                </a>
              ) : (
                <NavLink key={`${link.href}-${link.name}`} to={link.href}>
                  {link.name || link.label}
                </NavLink>
              )
            )}
          </nav>

          <div className="site-header__actions">
            {settings.headerCta ? (
              settings.headerCta.external ? (
                <a className="button button--primary" href={settings.headerCta.href} target="_blank" rel="noreferrer">
                  {settings.headerCta.label || settings.headerCta.name}
                </a>
              ) : (
                <Link className="button button--primary" to={settings.headerCta.href}>
                  {settings.headerCta.label || settings.headerCta.name}
                </Link>
              )
            ) : null}

            <button
              type="button"
              className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
              onClick={() => setMenuOpen((current) => !current)}
              aria-label="Toggle navigation"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
