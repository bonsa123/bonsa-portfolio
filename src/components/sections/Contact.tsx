import { useState } from 'react'
import { Mail, Phone, Github, Linkedin, Instagram, Youtube, Send, Copy } from 'lucide-react'
import axios from 'axios'
import SectionHeading from '../ui/SectionHeading'
import Container from '../ui/Container'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import { useProjects } from '../../hooks/useProjects'
import { useToast } from '../ui/Toast'

export default function Contact() {
  const { profile, content } = useProjects()
  const { showToast } = useToast()

  const handleCopy = (e: React.MouseEvent, text: string, label: string) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    showToast(`Copied ${label} (${text}) to clipboard!`, 'success')
  }

  const contactMethods = [
    {
      icon: Mail,
      label: content.contactEmailInfoLabel,
      value: profile.email,
      href: `mailto:${profile.email}`,
      display: profile.email,
    },
    {
      icon: Phone,
      label: content.contactPhoneLabel,
      value: profile.phone,
      href: `tel:${profile.phone}`,
      display: profile.phone,
    },
  ]

  const socialLinks = [
    { icon: Github, href: profile.social.github, label: 'GitHub' },
    { icon: Linkedin, href: profile.social.linkedin, label: 'LinkedIn' },
    { icon: Instagram, href: profile.social.instagram, label: 'Instagram' },
    { icon: Youtube, href: profile.social.youtube, label: 'YouTube' },
    { icon: Send, href: profile.social.telegram, label: 'Telegram' },
  ]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [loading, setLoading] = useState(false)

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setStatus('idle')

    try {
      await axios.post('/api/contact', formData)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={content.contactEyebrow}
            title={content.contactTitle}
            subtitle={content.contactSubtitle}
            centered
          />
        </Reveal>

        <div className="grid lg:grid-cols-[1fr,1.15fr] gap-8 max-w-5xl mx-auto">
          {/* Left column: contact details */}
          <Reveal delay={0.05} className="h-full">
          <div className="rounded-2xl bg-card border border-border p-6 md:p-8 space-y-6 h-full">
            <p className="text-secondary text-base leading-relaxed text-left">
              {content.contactIntro}
            </p>

            <Button href={`mailto:${profile.email}`} size="lg" fullWidth>
              <Mail size={17} />
              {content.contactEmailButton}
            </Button>

            <div className="space-y-3">
              {contactMethods.filter(({ value }) => value).map(({ icon: Icon, label, href, display, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border hover:border-accent/30 hover:bg-elevated/60 transition-all duration-200 group"
                >
                  <a href={href} className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent/10 text-accent flex-shrink-0">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-muted uppercase tracking-wide">{label}</p>
                      <p className="text-primary text-sm font-medium mt-0.5 truncate group-hover:text-accent transition-colors">
                        {display}
                      </p>
                    </div>
                  </a>
                  <button
                    onClick={(e) => handleCopy(e, value, label)}
                    className="p-2 rounded-lg text-secondary hover:text-accent hover:bg-elevated border border-transparent hover:border-border transition-colors"
                    title={`Copy ${label}`}
                  >
                    <Copy size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="font-mono text-xs text-muted uppercase tracking-wide">{content.contactSocialDivider}</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="flex items-center justify-center gap-3">
              {socialLinks.filter(({ href }) => href).map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-border text-secondary hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          </Reveal>

          {/* Right column: contact form */}
          <Reveal delay={0.12} className="h-full">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-card border border-border p-6 md:p-8 space-y-5"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{content.contactFormEyebrow}</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-primary">{content.contactFormTitle}</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-mono text-xs text-muted uppercase tracking-wide">{content.contactNameLabel}</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-primary placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                  placeholder={content.contactNamePlaceholder}
                />
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-xs text-muted uppercase tracking-wide">{content.contactEmailLabel}</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-primary placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                  placeholder={content.contactEmailPlaceholder}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs text-muted uppercase tracking-wide">{content.contactSubjectLabel}</label>
              <input
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                className="w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-primary placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                placeholder={content.contactSubjectPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs text-muted uppercase tracking-wide">{content.contactMessageLabel}</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                rows={6}
                className="w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-primary placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all resize-none"
                placeholder={content.contactMessagePlaceholder}
              />
            </div>

            {status === 'success' && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400">
                {content.contactSuccessMessage}
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {content.contactErrorMessage}
              </div>
            )}

            <Button type="submit" size="lg" fullWidth disabled={loading}>
              <Mail size={17} />
              {loading ? content.contactLoadingLabel : content.contactSubmitButton}
            </Button>
          </form>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
