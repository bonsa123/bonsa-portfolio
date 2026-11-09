import { useState, useEffect } from 'react'
import { motion, useScroll, useReducedMotion } from 'framer-motion'
import { Menu, X, FileText, Search, Terminal } from 'lucide-react'
import { useProjects } from '../../hooks/useProjects'

interface NavbarProps {
  onOpenResume?: () => void
  onOpenPalette?: () => void
  onOpenTerminal?: () => void
}

export default function Navbar({
  onOpenResume,
  onOpenPalette,
  onOpenTerminal,
}: NavbarProps) {
  const { profile, content } = useProjects()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { scrollYProgress } = useScroll()
  const prefersReduced = useReducedMotion()
  const navLinks = [
    { label: content.navAbout, href: '#about' },
    { label: content.navSkills, href: '#skills' },
    { label: content.navProjects, href: '#projects' },
    { label: content.navEducation, href: '#education' },
    { label: content.navContact, href: '#contact' },
  ]
  const monogram = profile.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )

    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleLinkClick = (href: string) => {
    setOpen(false)
    // smooth scroll
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || open
            ? 'bg-base/95 backdrop-blur-md border-b border-border shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        {/* Scroll progress indicator */}
        {!prefersReduced && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px] origin-left bg-accent/70"
            style={{ scaleX: scrollYProgress }}
          />
        )}
        <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-16 h-14 flex items-center justify-between">
          {/* Monogram */}
          <a
            href="#hero"
            onClick={() => handleLinkClick('#hero')}
            className="font-mono text-lg font-bold text-accent tracking-widest select-none"
            aria-label="Back to top"
          >
            {monogram}
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick(href)
                }}
                className={`font-sans text-sm transition-colors duration-200 relative py-1 ${
                  activeSection === href.replace('#', '')
                    ? 'text-accent'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {label}
                {activeSection === href.replace('#', '') && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent rounded-full" />
                )}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {onOpenPalette && (
              <button
                onClick={onOpenPalette}
                className="inline-flex items-center gap-2 text-xs text-muted hover:text-primary border border-border/80 hover:border-accent/40 px-2.5 py-1.5 rounded-lg bg-elevated/40 transition-colors"
                title="Search / Command Palette (Ctrl+K)"
              >
                <Search size={13} className="text-accent" />
                <span className="font-mono text-[10px] bg-card border border-border/80 px-1 rounded">⌘K</span>
              </button>
            )}
            {onOpenResume && (
              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-secondary hover:text-accent border border-border/80 hover:border-accent/40 px-3 py-1.5 rounded-lg bg-elevated/40 transition-colors"
                title="View Resume / CV"
              >
                <FileText size={13} className="text-accent" />
                Resume
              </button>
            )}
            <a
              href="/admin"
              className="text-xs font-medium uppercase tracking-[0.18em] text-secondary hover:text-accent transition-colors duration-200"
            >
              Admin
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick('#contact')
              }}
              className="inline-flex items-center gap-2 text-sm font-medium text-accent border border-accent/40 px-4 py-1.5 rounded-lg hover:bg-accent/10 transition-colors duration-200"
            >
              {content.navHireButton}
            </a>
          </div>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-secondary hover:text-primary hover:bg-elevated transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          open ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <nav
          className={`absolute top-14 left-0 right-0 bg-base/98 border-b border-border shadow-2xl transition-all duration-300 ${
            open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col px-5 py-4 gap-1">
            {navLinks.map(({ label, href }, i) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(href)
                  }}
                  className={`flex items-center gap-3 px-3 py-3.5 rounded-lg text-base font-medium transition-colors duration-200 ${
                    activeSection === href.replace('#', '')
                      ? 'text-accent bg-accent/10'
                      : 'text-secondary hover:text-primary hover:bg-elevated'
                  }`}
                >
                  <span className="font-mono text-xs text-muted w-5">
                    0{i + 1}
                  </span>
                  {label}
                </a>
              </li>
            ))}
            <li className="mt-2 pt-2 border-t border-border space-y-2">
              {onOpenPalette && (
                <button
                  onClick={() => {
                    setOpen(false)
                    onOpenPalette()
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border text-secondary font-medium text-sm hover:text-accent hover:bg-elevated transition-colors"
                >
                  <Search size={15} className="text-accent" />
                  Command Palette (⌘K)
                </button>
              )}
              {onOpenTerminal && (
                <button
                  onClick={() => {
                    setOpen(false)
                    onOpenTerminal()
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border text-secondary font-medium text-sm hover:text-accent hover:bg-elevated transition-colors font-mono text-xs"
                >
                  <Terminal size={15} className="text-emerald-400" />
                  Interactive Shell (`)
                </button>
              )}
              {onOpenResume && (
                <button
                  onClick={() => {
                    setOpen(false)
                    onOpenResume()
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border text-secondary font-medium text-sm hover:text-accent hover:bg-elevated transition-colors"
                >
                  <FileText size={15} className="text-accent" />
                  Resume / CV
                </button>
              )}
              <a
                href="/admin"
                className="flex items-center justify-center w-full py-3 rounded-lg border border-border text-secondary font-medium text-sm hover:text-accent hover:bg-elevated transition-colors"
              >
                Admin
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick('#contact')
                }}
                className="flex items-center justify-center w-full py-3 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent/90 transition-colors"
              >
                {content.navHireButton}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
