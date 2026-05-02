import { Link } from 'react-router-dom'
import type { SiteSettings } from '../services/strapi'

interface CmsFooterProps {
  settings: SiteSettings
}

export default function CmsFooter({ settings }: CmsFooterProps) {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__intro">
          <h2>{settings.siteName}</h2>
          <p>{settings.footerTagline || settings.siteTagline}</p>
          <div className="site-footer__socials">
            {settings.socialLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.name || link.label}
              </a>
            ))}
          </div>
        </div>

        {settings.footerColumns.map((column) => (
          <div key={column.title} className="site-footer__column">
            <h3>{column.title}</h3>
            <div className="site-footer__links">
              {column.links.map((link) =>
                link.external ? (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {link.name || link.label}
                  </a>
                ) : (
                  <Link key={link.href} to={link.href}>
                    {link.name || link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        ))}

        <div className="site-footer__column">
          <h3>Contact</h3>
          <div className="site-footer__links">
            {settings.contactItems.map((item) => (
              <span key={`${item.label}-${item.value}`}>
                <strong>{item.label}:</strong> {item.value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
