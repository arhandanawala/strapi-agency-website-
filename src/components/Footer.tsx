import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface FooterProps {
  content?: {
    footerTagline?: string
    footerColumns?: Array<{
      title?: string
      links?: Array<{
        name?: string
        href?: string
      }>
    }>
    footerCopyright?: string
    contactEmail?: string
    contactPhone?: string
    contactAddress?: string
  }
  theme?: {
    footerBackgroundColor?: string
    footerTextColor?: string
    primaryColor?: string
  }
}

function Footer({ content, theme }: FooterProps) {
  const footerRef = useRef<HTMLDivElement>(null)
  const c = content || {}
  const t = {
    footerBackgroundColor: '#111827',
    footerTextColor: '#ffffff',
    primaryColor: '#6366f1',
    ...theme,
  }

  useEffect(() => {
    if (!footerRef.current) return

    gsap.fromTo(
      footerRef.current.querySelectorAll('.footer-column'),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
        },
      }
    )
  }, [])

  const containerStyle: CSSProperties = {
    backgroundColor: t.footerBackgroundColor,
    color: t.footerTextColor,
  }

  const linkStyle: CSSProperties = {
    color: t.footerTextColor,
    opacity: 0.8,
    textDecoration: 'none',
    transition: 'opacity 0.2s ease',
  }

  return (
    <footer ref={footerRef} style={containerStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px' }}>
          <div className="footer-column">
            <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
              {c.contactEmail || ''}
            </h3>
            <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: '24px' }}>
              {c.footerTagline}
            </p>
            {c.contactEmail && (
              <a href={`mailto:${c.contactEmail}`} style={linkStyle}>
                Email
              </a>
            )}
          </div>

          {c.footerColumns?.map((column, index) => (
            <div key={index} className="footer-column">
              <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>
                {column.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {column.links?.map((link, linkIndex) => (
                  <li key={linkIndex} style={{ marginBottom: '12px' }}>
                    <a href={link.href} style={linkStyle}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: '60px',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            opacity: 0.6,
            fontSize: '14px',
          }}
        >
          <p>{c.footerCopyright}</p>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {c.contactPhone && <span>{c.contactPhone}</span>}
            {c.contactAddress && <span>{c.contactAddress}</span>}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
