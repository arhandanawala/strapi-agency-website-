import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Navigation.css'

interface NavLink {
  name: string
  href: string
}

interface NavigationProps {
  content: {
    siteName?: string
    logo?: string
    navigationLinks?: NavLink[]
    navigationCtaText?: string
    navigationCtaLink?: string
  }
}

const Navigation = ({ content }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const links = content?.navigationLinks || []

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`navigation ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="nav-container">
        <motion.div
          className="logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {content?.logo ? (
            <img src={content.logo} alt={content.siteName || ''} style={{ height: 40 }} />
          ) : (
            <a href="#hero">{content?.siteName || ''}</a>
          )}
        </motion.div>

        <ul className="nav-links desktop">
          {links.map((link, index) => (
            <motion.li
              key={link.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.a href={link.href} whileHover={{ color: 'var(--primary-color)' }}>
                {link.name}
              </motion.a>
            </motion.li>
          ))}
        </ul>

        {content?.navigationCtaText && (
          <motion.a
            href={content.navigationCtaLink || '#contact'}
            className="nav-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {content.navigationCtaText}
          </motion.a>
        )}

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ul>
              {links.map((link) => (
                <li key={link.name}>
                  <a href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navigation
