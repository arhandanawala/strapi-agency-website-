import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { CmsBlock, CmsLink, Service, SiteSettings, Testimonial } from '../services/strapi'
import { submitContactForm } from '../services/strapi'

interface BlockRendererProps {
  blocks: CmsBlock[]
  services: Service[]
  testimonials: Testimonial[]
  settings: SiteSettings
}

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}

const iconMap: Record<string, string> = {
  layers: 'Strategic positioning',
  globe: 'Website systems',
  target: 'Growth UX',
  pen: 'Brand messaging',
  card: 'Campaign pages',
  box: 'Design operations',
}

const contactIconMap: Record<string, string> = {
  email: 'Email',
  phone: 'Phone',
  location: 'Location',
}

const renderLink = (link?: CmsLink, className = 'button') => {
  if (!link) return null

  const content = link.label || link.name
  const classes = [className, link.variant ? `button--${link.variant}` : ''].filter(Boolean).join(' ')

  return link.external ? (
    <a className={classes} href={link.href} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    <Link className={classes} to={link.href}>
      {content}
    </Link>
  )
}

function ContactPanel({
  block,
  settings,
}: {
  block: CmsBlock
  settings: SiteSettings
}) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await submitContactForm(formData)
      setFeedback(String(block.successText || 'Thanks. We will get back to you soon.'))
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.warn('Contact submission fallback', error)
      setFeedback(String(block.fallbackNotice || block.successText || 'Thanks. We will get back to you soon.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.section className="content-section section-grid section-grid--contact" {...fadeUp}>
      <div className="section-heading">
        <span className="section-eyebrow">{String(block.eyebrow || 'Contact')}</span>
        <h2>{String(block.title || '')}</h2>
        <p>{String(block.description || '')}</p>

        <div className="contact-panel__details">
          {settings.contactItems.map((item) => (
            <div key={`${item.label}-${item.value}`} className="contact-panel__detail">
              <span>{contactIconMap[item.icon] || item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <form className="contact-form-panel" onSubmit={handleSubmit}>
        <div className="contact-form-panel__header">
          <h3>{String(block.formTitle || 'Project inquiry')}</h3>
          <p>Share the current bottleneck, the key pages, and the timing you are targeting.</p>
        </div>

        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            required
          />
        </label>

        <label>
          Project brief
          <textarea
            name="message"
            rows={6}
            value={formData.message}
            onChange={(event) => setFormData({ ...formData, message: event.target.value })}
            required
          />
        </label>

        <button className="button button--primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send inquiry'}
        </button>

        {feedback ? <p className="contact-form-panel__feedback">{feedback}</p> : null}
      </form>
    </motion.section>
  )
}

export default function BlockRenderer({ blocks, services, testimonials, settings }: BlockRendererProps) {
  const featuredServices = useMemo(() => services.filter((service) => service.featured), [services])

  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.__component}-${block.id || index}`

        if (block.__component === 'sections.hero-section') {
          const metrics = Array.isArray(block.metrics) ? block.metrics : []
          return (
            <motion.section
              key={key}
              className={`hero-section hero-section--${String(block.variant || 'split')}`}
              {...fadeUp}
            >
              <div className="hero-section__content">
                <span className="section-eyebrow">{String(block.eyebrow || '')}</span>
                <h1>
                  {String(block.title || '')}
                  {block.highlightedText ? <em>{String(block.highlightedText)}</em> : null}
                </h1>
                <p>{String(block.description || '')}</p>
                <div className="button-row">
                  {renderLink(block.primaryButton as CmsLink | undefined)}
                  {renderLink(block.secondaryButton as CmsLink | undefined)}
                </div>
                {metrics.length ? (
                  <div className="metric-grid">
                    {metrics.map((metric: any) => (
                      <div key={`${metric.value}-${metric.label}`} className="metric-card">
                        <strong>{metric.value}</strong>
                        <span>{metric.label}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {block.image ? (
                <div className="hero-section__media">
                  <img src={String((block.image as any).url)} alt={String((block.image as any).alternativeText || '')} />
                </div>
              ) : null}
            </motion.section>
          )
        }

        if (block.__component === 'sections.service-showcase') {
          const items = block.showFeaturedOnly ? featuredServices : services
          return (
            <motion.section key={key} className="content-section" {...fadeUp}>
              <div className="section-heading">
                <span className="section-eyebrow">{String(block.eyebrow || '')}</span>
                <h2>{String(block.title || '')}</h2>
                <p>{String(block.description || '')}</p>
              </div>

              <div className="service-grid">
                {items.map((service) => (
                  <motion.article key={service.id} className="service-card" whileHover={{ y: -8 }}>
                    <div className="service-card__icon">{iconMap[service.icon || 'layers'] || 'Service'}</div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </motion.article>
                ))}
              </div>

              {renderLink(block.cta as CmsLink | undefined, 'button button--secondary')}
            </motion.section>
          )
        }

        if (block.__component === 'sections.rich-content') {
          const bullets = Array.isArray(block.bullets) ? block.bullets : []
          return (
            <motion.section
              key={key}
              className={`content-section section-grid section-grid--${String(block.layout || 'image-right')}`}
              {...fadeUp}
            >
              <div className="section-copy">
                <span className="section-eyebrow">{String(block.eyebrow || '')}</span>
                <h2>
                  {String(block.title || '')}
                  {block.highlightedText ? <em>{String(block.highlightedText)}</em> : null}
                </h2>
                <p>{String(block.bodyOne || '')}</p>
                <p>{String(block.bodyTwo || '')}</p>
                {bullets.length ? (
                  <div className="feature-list">
                    {bullets.map((item: any) => (
                      <div key={`${item.title}-${item.description}`} className="feature-item">
                        <strong>{item.title}</strong>
                        <span>{item.description}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {renderLink(block.cta as CmsLink | undefined)}
              </div>

              {block.layout !== 'text-only' && block.image ? (
                <div className="section-media">
                  <img src={String((block.image as any).url)} alt={String(block.imageAlt || '')} />
                </div>
              ) : null}
            </motion.section>
          )
        }

        if (block.__component === 'sections.stat-band') {
          const items = Array.isArray(block.items) ? block.items : []
          return (
            <motion.section key={key} className="content-section stat-band" {...fadeUp}>
              <div className="section-heading section-heading--compact">
                <span className="section-eyebrow">{String(block.eyebrow || '')}</span>
                <h2>{String(block.title || '')}</h2>
              </div>
              <div className="metric-grid metric-grid--band">
                {items.map((item: any) => (
                  <div key={`${item.value}-${item.label}`} className="metric-card">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )
        }

        if (block.__component === 'sections.process-steps') {
          const steps = Array.isArray(block.steps) ? block.steps : []
          return (
            <motion.section key={key} className="content-section" {...fadeUp}>
              <div className="section-heading">
                <span className="section-eyebrow">{String(block.eyebrow || '')}</span>
                <h2>{String(block.title || '')}</h2>
                <p>{String(block.description || '')}</p>
              </div>
              <div className="process-grid">
                {steps.map((step: any, stepIndex: number) => (
                  <article key={`${step.title}-${stepIndex}`} className="process-card">
                    <span className="process-card__index">{stepIndex + 1}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                ))}
              </div>
            </motion.section>
          )
        }

        if (block.__component === 'sections.logo-cloud') {
          const logos = Array.isArray(block.logos) ? block.logos : []
          return (
            <motion.section key={key} className="content-section" {...fadeUp}>
              <div className="section-heading section-heading--compact">
                <span className="section-eyebrow">{String(block.eyebrow || '')}</span>
                <h2>{String(block.title || '')}</h2>
                <p>{String(block.description || '')}</p>
              </div>
              <div className="logo-cloud">
                {logos.map((logo: any) =>
                  logo.href ? (
                    <a key={`${logo.name}-${logo.href}`} className="logo-cloud__item" href={logo.href} target="_blank" rel="noreferrer">
                      {logo.logo ? <img src={logo.logo.url} alt={logo.logo.alternativeText || logo.name} /> : <span>{logo.name}</span>}
                    </a>
                  ) : (
                    <div key={logo.name} className="logo-cloud__item">
                      {logo.logo ? <img src={logo.logo.url} alt={logo.logo.alternativeText || logo.name} /> : <span>{logo.name}</span>}
                    </div>
                  )
                )}
              </div>
            </motion.section>
          )
        }

        if (block.__component === 'sections.testimonial-showcase') {
          return (
            <motion.section key={key} className="content-section" {...fadeUp}>
              <div className="section-heading">
                <span className="section-eyebrow">{String(block.eyebrow || '')}</span>
                <h2>{String(block.title || '')}</h2>
                <p>{String(block.description || '')}</p>
              </div>
              <div className="testimonial-grid">
                {testimonials.map((testimonial) => (
                  <article key={testimonial.id} className="testimonial-card">
                    <div className="testimonial-card__meta">
                      {testimonial.image ? <img src={testimonial.image.url} alt={testimonial.image.alternativeText || testimonial.name} /> : null}
                      <div>
                        <strong>{testimonial.name}</strong>
                        <span>
                          {testimonial.role}
                          {testimonial.company ? `, ${testimonial.company}` : ''}
                        </span>
                      </div>
                    </div>
                    <p>{testimonial.content}</p>
                  </article>
                ))}
              </div>
              {renderLink(block.cta as CmsLink | undefined, 'button button--secondary')}
            </motion.section>
          )
        }

        if (block.__component === 'sections.cta-banner') {
          return (
            <motion.section key={key} className="content-section cta-banner" {...fadeUp}>
              {block.backgroundImage ? (
                <div className="cta-banner__image">
                  <img
                    src={String((block.backgroundImage as any).url)}
                    alt={String((block.backgroundImage as any).alternativeText || '')}
                  />
                </div>
              ) : null}
              <div className="cta-banner__content">
                <span className="section-eyebrow">{String(block.eyebrow || '')}</span>
                <h2>{String(block.title || '')}</h2>
                <p>{String(block.description || '')}</p>
                <div className="button-row">
                  {renderLink(block.primaryButton as CmsLink | undefined)}
                  {renderLink(block.secondaryButton as CmsLink | undefined)}
                </div>
              </div>
            </motion.section>
          )
        }

        if (block.__component === 'sections.contact-panel') {
          return <ContactPanel key={key} block={block} settings={settings} />
        }

        return null
      })}
    </>
  )
}
