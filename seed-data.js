#!/usr/bin/env node
"use strict";

// Simple seed script to populate Strapi with demo data via REST API.
// Requires a Strapi admin user to exist (or use an API token that has create permissions).

(async () => {
  const STRAPI_BASE = process.env.STRAPI_BASE_URL || 'http://localhost:1337'
  const SEED_USERNAME = process.env.SEED_USERNAME || ''
  const SEED_PASSWORD = process.env.SEED_PASSWORD || ''
  const SEED_TOKEN = process.env.SEED_TOKEN || '' // Optional token with create permissions

  const login = async () => {
    if (SEED_TOKEN) return SEED_TOKEN
    if (!SEED_USERNAME || !SEED_PASSWORD) {
      console.log('Seed credentials not provided. Skipping authentication.');
      return null
    }
    try {
      const res = await fetch(`${STRAPI_BASE}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: SEED_USERNAME, password: SEED_PASSWORD }),
      })
      const json = await res.json()
      if (json?.jwt) return json.jwt
      console.log('Seed login failed:', json)
      return null
    } catch (err) {
      console.log('Seed login error:', err)
      return null
    }
  }

  const post = async (path, payload, token) => {
    const url = `${STRAPI_BASE}/api/${path}`
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const forms = [ { data: payload }, { data: { attributes: payload } } ].filter(Boolean)
    for (const body of forms) {
      try {
        const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
        if (res.ok) {
          const j = await res.json()
          console.log(`Seeded ${path}:`, j?.data?.id ?? j)
          return j
        } else {
          const t = await res.text()
          console.log(`Seed attempt failed for ${path}: ${t.substring(0, 200)}`)
        }
      } catch (e) {
        console.log('Seed error for', path, e)
      }
    }
    return null
  }

  const postSingleton = async (path, payload, token) => {
    const url = `${STRAPI_BASE}/api/${path}`
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const forms = [ { data: payload }, { data: { attributes: payload } } ].filter(Boolean)
    for (const body of forms) {
      try {
        const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
        if (res.ok) {
          const j = await res.json()
          console.log(`Seeded singleton ${path}.`)
          return j
        } else {
          const t = await res.text()
          console.log(`Singleton POST failed for ${path}: ${t.substring(0, 200)}`)
        }
      } catch (e) {
        console.log('Singleton seed error', path, e)
      }
    }
    try {
      const res2 = await fetch(url, { method: 'PUT', headers, body: JSON.stringify({ data: payload }) })
      if (res2.ok) {
        const j = await res2.json()
        console.log(`Updated singleton ${path}.`)
        return j
      }
    } catch (e) {
      // ignore
    }
    console.log(`Seed: Unable to seed singleton ${path}.`)
    return null
  }

  const token = await login()
  // Seed Services
  const services = [
    { title: 'Strategic Consulting', description: 'Guidance to navigate complex challenges and identify growth opportunities.', icon: 'layers', slug: 'strategic-consulting' },
    { title: 'Brand Development', description: 'Build a cohesive brand identity that resonates with your audience.', icon: 'pen', slug: 'brand-development' },
    { title: 'Digital Marketing', description: 'Data-driven marketing to increase visibility and conversions.', icon: 'card', slug: 'digital-marketing' },
  ]
  for (const s of services) await post('services', s, token)

  // Seed Testimonials
  const testimonials = [
    { name: 'Sarah Johnson', role: 'CEO', company: 'TechStart', content: 'Amazing service and results.', rating: 5 },
    { name: 'Michael Chen', role: 'Founder', company: 'GrowthLabs', content: 'Professional and impactful.', rating: 5 },
  ]
  for (const t of testimonials) await post('testimonials', t, token)

  // Seed Homepage (Singleton)
  const homepage = {
    siteName: 'Your Business',
    footerText: '© 2026 Your Business. All rights reserved.',
    navigationLinks: [
      { name: 'Home', href: '#hero' },
      { name: 'Services', href: '#services' },
      { name: 'About', href: '#about' },
      { name: 'Testimonials', href: '#testimonials' },
      { name: 'Contact', href: '#contact' },
    ],
    navigationCtaText: 'Get Started',
    heroTitle: 'We Help Your Business Grow',
    heroSubtitle: 'Transform your operations with our expert solutions.',
    heroHighlightedText: 'Grow Faster',
    heroBadgeLabel: 'New',
    heroBadgeText: 'Transform Your Business Today',
    heroPrimaryButtonText: 'Start Now',
    heroSecondaryButtonText: 'Learn More',
    heroStats: [
      { value: '500+', label: 'Happy Clients' },
      { value: '98%', label: 'Success Rate' },
      { value: '10+', label: 'Years Experience' },
    ],
    servicesTitle: 'Our Services',
    servicesSubtitle: 'Comprehensive solutions tailored to your business needs',
    servicesLinkText: 'Learn More',
    aboutLabel: 'About Us',
    aboutTitle: 'We Help Businesses',
    aboutHighlightedText: 'Grow & Succeed',
    aboutDescriptionOne: "With over a decade of experience, we've helped hundreds of businesses transform their operations and achieve remarkable growth. Our approach combines strategic thinking with creative execution.",
    aboutDescriptionTwo: 'We believe in building long-term partnerships with our clients, understanding their unique challenges, and delivering solutions that drive real results.',
    aboutImage: { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=700&fit=crop' },
    aboutImageAlt: 'Team working together',
    aboutExperienceNumber: '10+',
    aboutExperienceText: 'Years of Experience',
    aboutFeatures: [
      { title: 'Innovative Solutions', description: 'We bring fresh ideas and cutting-edge technologies to every project.' },
      { title: 'Expert Team', description: 'Our team has years of industry experience.' },
      { title: 'Client Focus', description: 'Your success is our priority. We work with you to achieve goals.' },
    ],
    aboutCtaText: 'Work With Us',
    testimonialsTitle: 'What Our Clients Say',
    testimonialsSubtitle: 'Trusted by businesses worldwide to deliver exceptional results',
    contactLabel: 'Get In Touch',
    contactTitle: "Let's Start a",
    contactHighlightedText: 'Conversation',
    contactDescription: 'Ready to transform your business? Send us a message and we will get back to you within 24 hours.',
    contactInfoItems: [
      { label: 'Email', value: 'hello@yourbusiness.com', icon: 'email' },
      { label: 'Phone', value: '+1 (555) 123-4567', icon: 'phone' },
      { label: 'Address', value: '123 Business Ave, Suite 100', icon: 'location' },
    ],
    contactFormNameLabel: 'Your Name',
    contactFormNamePlaceholder: 'John Doe',
    contactFormEmailLabel: 'Email',
    contactFormEmailPlaceholder: 'john@example.com',
    contactFormMessageLabel: 'Message',
    contactFormMessagePlaceholder: 'Tell us about your project',
    contactSubmitButtonText: 'Send Message',
    contactSuccessText: 'Sent!',
    contactFallbackNotice: 'CMS not connected. Form will log to console only.',
  }
  await postSingleton('homepage', homepage, token)

  // Seed Site Theme
  const theme = {
    primaryColor: '#6366f1',
    primaryDarkColor: '#4f46e5',
    secondaryColor: '#ec4899',
    bgColor: '#f8fafc',
    textPrimaryColor: '#1f2937',
    textSecondaryColor: '#6b7280',
  }
  await postSingleton('site-theme', theme, token)

  console.log('Seed complete.')
})()
