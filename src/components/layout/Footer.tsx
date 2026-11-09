import { Github, Linkedin, Instagram, Youtube, ArrowUp, Send } from 'lucide-react'
import { useProjects } from '../../hooks/useProjects'

export default function Footer() {
  const { profile, content } = useProjects()
  const monogram = profile.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('')
  const socialIcons = [
    { icon: Github, href: profile.social.github, label: 'GitHub' },
    { icon: Linkedin, href: profile.social.linkedin, label: 'LinkedIn' },
    { icon: Instagram, href: profile.social.instagram, label: 'Instagram' },
    { icon: Youtube, href: profile.social.youtube, label: 'YouTube' },
    { icon: Send, href: profile.social.telegram, label: 'Telegram' },
  ]
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-16 py-10">
        <div className="flex flex-col items-center gap-6">
          {/* Monogram */}
          <span className="font-mono text-2xl font-bold text-accent">{monogram}</span>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {socialIcons.filter(({ href }) => href).map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-secondary hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all duration-200"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-border" />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 text-center sm:text-left">
            <p className="text-muted text-sm">
              © {new Date().getFullYear()} {profile.name}. {content.footerRightsReservedLabel}
            </p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors duration-200"
              aria-label="Back to top"
            >
              {content.footerBackToTopLabel}
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
