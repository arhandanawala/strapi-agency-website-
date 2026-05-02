import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import type { HomepageContent } from '../content/siteDefaults'
import { submitContactForm } from '../services/strapi'
import './Contact.css'

interface ContactProps {
  content: HomepageContent
}

const Contact = ({ content }: ContactProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-content',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        '.contact-info-item',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Try to submit to Strapi
      await submitContactForm(formData)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      console.warn('Strapi submission failed, using fallback:', err)
      // Fallback: Simulate submission with console log
      setUsingFallback(true)
      console.log('Contact Form Submission (Fallback):', formData)

      // Simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => {
        setIsSubmitted(false)
        setUsingFallback(false)
      }, 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const iconMap: Record<string, ReactNode> = {
    email: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.5 0 4.5 2 4.5 4.5V17z" /><polyline points="6 6 12 12 18 6" />
      </svg>
    ),
    phone: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    location: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  }

  const contactInfoItems = content.contactInfoItems ?? []

  return (
    <section id="contact" className="contact" ref={sectionRef}>
      <div className="contact-content">
        <div className="contact-info">
          <span className="contact-label">Get In Touch</span>
          <span className="contact-label">{content.contactLabel}</span>
          <h2 className="section-title">{content.contactTitle}<br /><span className="gradient-text">{content.contactHighlightedText}</span></h2>
          <p className="contact-description">
            {content.contactDescription}
          </p>

          <div className="contact-info-list">
            {contactInfoItems.map((info) => (
              <motion.div
                key={info.label}
                className="contact-info-item"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="contact-info-icon">{iconMap[info.icon] || iconMap.email}</div>
                <div className="contact-info-text">
                  <span className="contact-info-label">{info.label}</span>
                  <span className="contact-info-value">{info.value}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            {usingFallback && (
              <div className="fallback-notice">
                {content.contactFallbackNotice}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">{content.contactFormNameLabel}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={content.contactFormNamePlaceholder}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{content.contactFormEmailLabel}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={content.contactFormEmailPlaceholder}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">{content.contactFormMessageLabel}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder={content.contactFormMessagePlaceholder}
              ></textarea>
            </div>

            <motion.button
              type="submit"
              className={`submit-button ${isSubmitting ? 'loading' : ''} ${isSubmitted ? 'success' : ''}`}
              disabled={isSubmitting || isSubmitted}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className="loading-spinner"></span>
              ) : isSubmitted ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {content.contactSuccessText}
                </>
              ) : (
                content.contactSubmitButtonText
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
