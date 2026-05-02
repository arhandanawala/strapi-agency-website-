import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { getTestimonials } from '../services/strapi'
import './Testimonials.css'

interface TestimonialsProps {
  content: {
    testimonialsTitle?: string
    testimonialsSubtitle?: string
  }
}

const Testimonials = ({ content }: TestimonialsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials()
        setTestimonials(data || [])
      } catch (err) {
        console.warn('Strapi testimonials could not be loaded')
        setTestimonials([])
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  useEffect(() => {
    if (loading) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonials-header',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      const cards = sectionRef.current?.querySelectorAll('.testimonial-card')
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [loading])

  if (loading) {
    return (
      <section id="testimonials" className="testimonials" ref={sectionRef}>
        <div className="testimonials-header">
          <h2 className="section-title">{content?.testimonialsTitle || ''}</h2>
          <p className="section-subtitle">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="testimonials" className="testimonials" ref={sectionRef}>
      <div className="testimonials-header">
        <h2 className="section-title">{content?.testimonialsTitle || ''}</h2>
        <p className="section-subtitle">{content?.testimonialsSubtitle || ''}</p>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((testimonial: any) => (
          <motion.div
            key={testimonial.id}
            className="testimonial-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="testimonial-stars">
              {[...Array(testimonial.rating || 5)].map((_, i) => (
                <span key={i} className="star">★</span>
              ))}
            </div>
            <p className="testimonial-content">"{testimonial.content}"</p>
            <div className="testimonial-author">
              {testimonial.image && (
                <img src={testimonial.image} alt={testimonial.name} className="author-image" />
              )}
              <div className="author-info">
                <h4 className="author-name">{testimonial.name}</h4>
                <p className="author-role">{testimonial.role}, {testimonial.company}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
