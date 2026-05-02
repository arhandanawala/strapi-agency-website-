import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import type { HomepageContent } from '../content/siteDefaults'
import './Hero.css'

interface HeroProps {
  content: HomepageContent
}

const Hero = ({ content }: HeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate background shapes
      gsap.to('.shape-1', {
        y: -30,
        x: 20,
        rotation: 15,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.to('.shape-2', {
        y: 30,
        x: -20,
        rotation: -15,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.to('.shape-3', {
        scale: 1.1,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Stagger text animation
      const tl = gsap.timeline({ delay: 0.3 })

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          buttonsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" className="hero" ref={heroRef}>
      <div className="hero-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="gradient-overlay"></div>
      </div>

      <div className="hero-content">
        <motion.div
          className="badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <span>{content.heroBadgeLabel}</span> {content.heroBadgeText}
        </motion.div>

        <h1 className="hero-title" ref={titleRef}>
          {content.heroTitle}
          <span className="gradient-text"><br />{content.heroHighlightedText}</span>
        </h1>

        <p className="hero-subtitle" ref={subtitleRef}>
          {content.heroSubtitle}
        </p>

        <div className="hero-buttons" ref={buttonsRef}>
          <motion.a
            href="#contact"
            className="btn-primary"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            {content.heroPrimaryButtonText}
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
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </motion.a>

          <motion.a
            href="#services"
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {content.heroSecondaryButtonText}
          </motion.a>
        </div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          { (content.heroStats ?? []).map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
            >
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
