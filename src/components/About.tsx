import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import type { HomepageContent } from '../content/siteDefaults'
import { getStrapiImageUrl } from '../services/strapi'
import './About.css'

interface AboutProps {
  content: HomepageContent
}

const About = ({ content }: AboutProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  // CMS-driven image and content: prefer Strapi-provided values, fall back to defaults
  const aboutImageUrlFromCms = (content as any).aboutImage?.url ?? (content as any).aboutImageUrl
  const aboutImageSrc = getStrapiImageUrl(aboutImageUrlFromCms) || (content as any).aboutImageUrl || ''

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image parallax (CMS-provided image if available)
      gsap.to('.about-image img', {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Content reveal (CMS-provided text if available)
      gsap.fromTo(
        '.about-content',
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-content',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Image reveal
      gsap.fromTo(
        '.about-image',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-image',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Feature items stagger
      const features = document.querySelectorAll('.feature-item')
      gsap.fromTo(
        features,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.about-features',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="about-container">
        <div className="about-image">
          <div className="image-wrapper">
            {aboutImageSrc ? (
              <img
                src={aboutImageSrc}
                alt={(content as any).aboutImageAlt ?? ''}
              />
            ) : null}
            <motion.div
              className="experience-badge"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              viewport={{ once: true }}
            >
              <span className="badge-number">{content.aboutExperienceNumber}</span>
              <span className="badge-text">{content.aboutExperienceText}</span>
            </motion.div>
          </div>
        </div>

        <div className="about-content">
          <span className="about-label">{content.aboutLabel}</span>
          <h2 className="section-title">{content.aboutTitle}<br /><span className="gradient-text">{content.aboutHighlightedText}</span></h2>
          <p className="about-description">
            {content.aboutDescriptionOne}
          </p>
          <p className="about-description">
            {content.aboutDescriptionTwo}
          </p>

          <div className="about-features">
            {(content.aboutFeatures ?? []).map((feature) => (
              <motion.div
                key={feature.title}
                className="feature-item"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="feature-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.a
            href="#contact"
            className="about-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {content.aboutCtaText}
          </motion.a>
        </div>
      </div>
    </section>
  )
}

export default About
