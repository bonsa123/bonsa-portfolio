import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Github, Linkedin, Instagram, Youtube, Send,
  MapPin, ArrowRight, Code2, FileText, Copy,
  ChevronDown, Briefcase, Layers,
  type LucideIcon,
} from 'lucide-react'
import Button from '../ui/Button'
import PortraitImage from '../ui/PortraitImage'
import { useProjects } from '../../hooks/useProjects'
import { useToast } from '../ui/Toast'

/* ─── animation variants ─────────────────────────────────── */
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
}
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.75 } },
}

/* ─── floating code / tech keywords ─────────────────────── */
const CODE_TOKENS = [
  'const dev =', '{ }', '=>', 'async/await', 'React', 'TypeScript',
  'SQL', '.tsx', 'useEffect', 'REST API', 'Node.js', '< />', 'npm run',
  'git commit', 'PHP', 'MySQL', 'interface', 'useState', '[]',
]

function FloatingTokens({ reduced }: { reduced: boolean | null }) {
  const tokens = CODE_TOKENS
  if (reduced) return null
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {tokens.map((token, i) => {
        const x = 5 + (i * 23 + (i % 5) * 11) % 90
        const y = 5 + (i * 17 + (i % 4) * 13) % 85
        const duration = 14 + (i % 5) * 4
        const delay = (i % 7) * 1.3
        const size = i % 3 === 0 ? 'text-[11px]' : 'text-[10px]'
        return (
          <motion.span
            key={token}
            className={`absolute font-mono ${size} text-muted/20 select-none whitespace-nowrap`}
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={{
              opacity: [0, 0.5, 0],
              y: [0, -18, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {token}
          </motion.span>
        )
      })}
    </div>
  )
}

/* ─── count-up hook ───────────────────────────────────────── */
function useCountUp(target: number, duration = 1200, delay = 800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const start = Date.now() + delay
    const tick = () => {
      const elapsed = Date.now() - start
      if (elapsed < 0) { requestAnimationFrame(tick); return }
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, delay])
  return count
}

/* ─── floating stat card ─────────────────────────────────── */
function FloatingCard({
  label, value, numericValue, suffix = '', sub, delay = 0, className = '',
  icon: Icon,
}: {
  label: string
  value?: string
  numericValue?: number
  suffix?: string
  sub: string
  delay?: number
  className?: string
  icon?: LucideIcon}) {
  const prefersReduced = useReducedMotion()
  const displayCount = useCountUp(numericValue ?? 0, 1000, (delay + 0.8) * 1000)
  const displayValue = numericValue !== undefined
    ? `${displayCount}${suffix}`
    : (value ?? '')

  return (
    <motion.div
      className={`group z-20 w-32 sm:w-36 rounded-xl sm:rounded-2xl border border-white/10 bg-card/90 px-2.5 py-2 sm:px-3.5 sm:py-3 shadow-xl shadow-black/30 backdrop-blur-md hover:border-accent/30 hover:shadow-accent/10 transition-all duration-300 cursor-default ${className}`}
      initial={prefersReduced ? {} : { opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={prefersReduced ? {} : { y: -4, scale: 1.03, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
        {Icon && <Icon size={10} className="text-accent/60 shrink-0" />}
        <p className="truncate font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.16em] text-muted">{label}</p>
      </div>
      <p className="mt-0.5 truncate font-display text-sm sm:text-lg font-bold leading-tight text-primary group-hover:text-accent transition-colors duration-300">
        {displayValue}
      </p>
      <p className="mt-0.5 sm:mt-1 truncate font-mono text-[8.5px] sm:text-[10px] text-accent/80">{sub}</p>
    </motion.div>
  )
}

/* ─── typewriter role cycler ─────────────────────────────── */
const ROLES = [
  'Full-Stack Developer',
  'CS Student',
  'Problem Solver',
  'Open Source Enthusiast',
]

function RoleCycler({ reduced }: { reduced: boolean | null }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'erasing'>('typing')

  useEffect(() => {
    if (reduced) {
      setDisplayed(ROLES[0])
      return
    }
    const role = ROLES[roleIndex]

    if (phase === 'typing') {
      if (displayed.length < role.length) {
        const t = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 60)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('pausing'), 1800)
        return () => clearTimeout(t)
      }
    }
    if (phase === 'pausing') {
      const t = setTimeout(() => setPhase('erasing'), 300)
      return () => clearTimeout(t)
    }
    if (phase === 'erasing') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
        return () => clearTimeout(t)
      } else {
        setRoleIndex((i) => (i + 1) % ROLES.length)
        setPhase('typing')
      }
    }
  }, [displayed, phase, roleIndex, reduced])

  return (
    <span className="inline-flex items-center gap-0.5">
      <span className="text-gradient">{displayed}</span>
      {!reduced && (
        <motion.span
          className="inline-block w-[2px] h-5 bg-accent ml-0.5 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </span>
  )
}

/* ─── typewriter greeting ─────────────────────────────────── */
type GreetingPhase = 'typing-open' | 'pausing' | 'erasing' | 'typing-name' | 'done'

function AnimatedGreeting({
  name, greeting, prefersReduced, profileLoading,
}: { name: string; greeting: string; prefersReduced: boolean | null; profileLoading: boolean }) {
  const OPENING   = 'Hey there! 👋'
  const FULL_NAME = `${greeting} ${name}`
  const NAME_START = `${greeting} `.length

  const [phase, setPhase]       = useState<GreetingPhase>('typing-open')
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  /* reduced-motion: skip straight to final text */
  if (prefersReduced) {
    return <>{greeting} <span className="text-gradient">{name}</span></>
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (profileLoading) return

    let raf = 0
    let cancelled = false

    function schedule(fn: () => void, delay: number) {
      const start = Date.now()
      const tick = () => {
        if (cancelled) return
        if (Date.now() - start >= delay) fn()
        else raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    function typeOpen(pos: number) {
      if (cancelled) return
      if (pos <= OPENING.length) {
        setDisplayed(OPENING.slice(0, pos))
        schedule(() => typeOpen(pos + 1), 55)
      } else {
        setPhase('pausing')
        schedule(startErase, 1300)
      }
    }

    function startErase() {
      setPhase('erasing')
      eraseOpen(OPENING.length)
    }

    function eraseOpen(pos: number) {
      if (cancelled) return
      if (pos >= 0) {
        setDisplayed(OPENING.slice(0, pos))
        schedule(() => eraseOpen(pos - 1), 28)
      } else {
        setPhase('typing-name')
        schedule(() => typeName(0), 120)
      }
    }

    function typeName(pos: number) {
      if (cancelled) return
      if (pos <= FULL_NAME.length) {
        setDisplayed(FULL_NAME.slice(0, pos))
        schedule(() => typeName(pos + 1), 52)
      } else {
        setPhase('done')
        setShowCursor(false)
      }
    }

    setPhase('typing-open')
    setDisplayed('')
    schedule(() => typeOpen(0), 200)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileLoading, greeting, name])

  /* Split displayed text into gradient / plain segments */
  const renderText = () => {
    if (phase === 'typing-open' || phase === 'pausing' || phase === 'erasing') {
      return <span>{displayed}</span>
    }
    /* typing-name or done */
    const plain = displayed.slice(0, NAME_START)
    const grad  = displayed.slice(NAME_START)
    return (
      <>
        <span>{plain}</span>
        {grad && <span className="text-gradient">{grad}</span>}
      </>
    )
  }

  return (
    <span aria-live="polite" aria-label={`${greeting} ${name}`} className="whitespace-nowrap">
      {renderText()}
      {showCursor && (
        <motion.span
          className="inline-block w-[3px] h-[0.85em] bg-primary align-middle ml-[2px] rounded-sm"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      )}
    </span>
  )
}

/* ─── social link data ───────────────────────────────────── */
const SOCIAL_COLORS: Record<string, string> = {
  GitHub: 'hover:text-[#f0f0f0] hover:border-[#f0f0f0]/40 hover:bg-[#f0f0f0]/10 hover:shadow-[0_0_16px_rgba(240,240,240,0.08)]',
  LinkedIn: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 hover:shadow-[0_0_16px_rgba(10,102,194,0.15)]',
  Instagram: 'hover:text-[#E1306C] hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10 hover:shadow-[0_0_16px_rgba(225,48,108,0.15)]',
  YouTube: 'hover:text-[#FF0000] hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10 hover:shadow-[0_0_16px_rgba(255,0,0,0.15)]',
  Telegram: 'hover:text-[#26A5E4] hover:border-[#26A5E4]/50 hover:bg-[#26A5E4]/10 hover:shadow-[0_0_16px_rgba(38,165,228,0.15)]',
}

/* ─── component ──────────────────────────────────────────── */
interface HeroProps {
  onOpenResume?: () => void
  onOpenTerminal?: () => void
}

export default function Hero({ onOpenResume }: HeroProps) {
  const { profile, content, profileLoading, projects, certificates = [] } = useProjects()
  const { showToast } = useToast()
  const prefersReduced = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)

  /* mouse parallax */
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springX = useSpring(rawX, { stiffness: 60, damping: 25 })
  const springY = useSpring(rawY, { stiffness: 60, damping: 25 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (prefersReduced || !heroRef.current) return
    const { left, top, width, height } = heroRef.current.getBoundingClientRect()
    const nx = ((e.clientX - left) / width - 0.5) * 2
    const ny = ((e.clientY - top) / height - 0.5) * 2
    rawX.set(nx * 24)
    rawY.set(ny * 16)
  }, [prefersReduced, rawX, rawY])

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    el.addEventListener('mousemove', handleMouseMove)
    return () => el.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email)
    showToast(`Copied ${profile.email} to clipboard!`, 'success')
  }

  const photoUrl = (profile as { photoUrl?: string }).photoUrl || ''

  const socialLinks = [
    { icon: Github,    href: profile.social.github,    label: 'GitHub'    },
    { icon: Linkedin,  href: profile.social.linkedin,  label: 'LinkedIn'  },
    { icon: Instagram, href: profile.social.instagram, label: 'Instagram' },
    { icon: Youtube,   href: profile.social.youtube,   label: 'YouTube'   },
    { icon: Send,      href: profile.social.telegram,  label: 'Telegram'  },
  ]

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden bg-base"
    >

      {/* ══ Decorative background ══════════════════════════════════ */}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(242,242,239,1) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,239,1) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      {/* Dot accent overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(224,122,60,1) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          backgroundPosition: '26px 26px',
        }}
      />

      {/* Primary orange glow — left side, parallax */}
      <motion.div
        className="absolute -top-32 -left-48 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(224,122,60,0.14) 0%, transparent 60%)',
          x: prefersReduced ? 0 : springX,
          y: prefersReduced ? 0 : springY,
        }}
        animate={prefersReduced ? {} : { scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Warm gold glow — right side, counter-parallax */}
      <motion.div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,168,106,0.11) 0%, transparent 60%)',
          x: prefersReduced ? 0 : springX,
          y: prefersReduced ? 0 : springY,
        }}
        animate={prefersReduced ? {} : { scale: [1, 1.1, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Centre accent glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(224,122,60,0.04) 0%, transparent 70%)' }}
        animate={prefersReduced ? {} : { opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Floating code tokens */}
      <FloatingTokens reduced={prefersReduced} />

      {/* Thin horizontal accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      {/* Thin bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* ══ Content ════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 lg:px-16 w-full">

        {/* ── MOBILE / TABLET (< lg) ──────────────────────────────── */}
        <div className="flex flex-col items-center text-center gap-5 lg:hidden py-6">

          <motion.div
            className="w-full max-w-xl space-y-4"
            variants={stagger}
            initial={prefersReduced ? false : 'hidden'}
            animate="show"
          >
            {/* Status badge */}
            <motion.div variants={fadeUp} className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 font-mono text-[10.5px] text-accent uppercase tracking-widest shadow-[0_0_20px_rgba(224,122,60,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_6px_rgba(224,122,60,0.8)]" />
                {content.heroAvailability}
              </span>
            </motion.div>

            {/* Role cycler */}
            <motion.p variants={fadeUp} className="font-mono text-xs text-muted uppercase tracking-[0.2em]">
              <RoleCycler reduced={prefersReduced} />
            </motion.p>

            {/* Headline */}
            <motion.h1 variants={fadeIn} className="font-display text-[clamp(1.4rem,7vw,2.3rem)] sm:text-[clamp(1.8rem,8.5vw,2.6rem)] font-bold text-primary leading-[1.1] tracking-tight">
              <AnimatedGreeting name={profile.name} greeting={content.heroGreeting} prefersReduced={prefersReduced} profileLoading={profileLoading} />
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeUp} className="font-display text-lg sm:text-xl text-secondary font-medium">
              {profile.subtitle}
            </motion.p>

            {/* ── Mobile Portrait Showcase with floating glass cards ── */}
            <motion.div
              className="relative mx-auto flex w-full max-w-[21rem] items-center justify-center py-3 my-2"
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              {/* Floating Card: Experience (Bottom-Left) */}
              <FloatingCard
                label={content.heroExperienceLabel}
                numericValue={parseInt(content.heroExperienceValue) || 2}
                suffix="+ yrs"
                sub={content.heroExperienceSubtext}
                icon={Briefcase}
                delay={0.3}
                className="!absolute -left-2 xs:left-0 bottom-1 !w-[6.75rem] xs:!w-28 text-left !p-2 shadow-2xl bg-card/95 border-white/15"
              />

              {/* Portrait */}
              <PortraitImage size="md" src={photoUrl || undefined} alt={profile.name} loading={profileLoading} />

              {/* Floating Card: Projects (Bottom-Right) */}
              <FloatingCard
                label="Projects"
                numericValue={projects.length || 4}
                sub="built & live"
                icon={Layers}
                delay={0.4}
                className="!absolute -right-2 xs:right-0 bottom-1 !w-[6.75rem] xs:!w-28 text-left !p-2 shadow-2xl bg-card/95 border-white/15"
              />

              {/* Top-Right Pill: Certs */}
              <motion.div
                className="absolute -right-1 xs:right-2 top-2 z-20"
                initial={prefersReduced ? {} : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="rounded-xl border border-white/15 bg-card/95 px-2.5 py-1 shadow-lg backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[9px] text-primary font-medium">
                    {certificates.length || 3} Certs
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Intro paragraph */}
            <motion.p variants={fadeUp} className="text-secondary text-sm sm:text-[15px] leading-relaxed max-w-md mx-auto">
              {profile.intro}
            </motion.p>

            {/* Location & Quick Copy Email */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-2.5 text-muted text-xs sm:text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-accent/70" />
                <span>{profile.location}</span>
              </div>
              <span className="text-muted/40">·</span>
              <button
                onClick={handleCopyEmail}
                className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-elevated/80 border border-border/80 hover:border-accent/40 text-xs font-mono text-secondary hover:text-accent transition-colors"
                title="Click to copy email"
              >
                <Copy size={11} className="text-muted group-hover:text-accent" />
                <span className="truncate max-w-[150px] xs:max-w-none">{profile.email}</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="flex w-full max-w-sm flex-row gap-2.5 pt-1"
            variants={fadeIn}
            initial={prefersReduced ? false : 'hidden'}
            animate="show"
            transition={{ delay: 0.65 }}
          >
            <Button
              size="lg"
              className="min-w-0 flex-1 whitespace-nowrap !px-3 !text-xs sm:!text-sm gap-1.5 relative overflow-hidden group"
              onClick={() => scrollTo('#projects')}
              fullWidth
            >
              {content.heroProjectsButton}
              <ArrowRight size={14} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-w-0 flex-1 whitespace-nowrap !px-3 !text-xs sm:!text-sm !text-primary gap-1 border-white/15 bg-white/5 hover:border-accent/50 hover:bg-accent/10"
              onClick={() => scrollTo('#contact')}
              fullWidth
            >
              {content.heroContactButton}
            </Button>
            {onOpenResume && (
              <Button
                size="lg"
                variant="ghost"
                className="min-w-0 px-3 !text-xs border border-white/15 hover:border-accent/40 bg-white/5"
                onClick={onOpenResume}
              >
                <FileText size={14} className="text-accent" />
                <span className="hidden xs:inline">CV</span>
              </Button>
            )}
          </motion.div>

          {/* Social links */}
          <motion.div
            className="flex items-center gap-2 pt-1"
            initial={prefersReduced ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            {socialLinks.filter(({ href }) => href).map(({ icon: Icon, href, label }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-border text-secondary transition-all duration-200 ${SOCIAL_COLORS[label] ?? ''}`}
                initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.85 + i * 0.07 }}
                whileHover={prefersReduced ? {} : { scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* ── DESKTOP (≥ lg) ──────────────────────────────────────── */}
        <div className="hidden min-h-[calc(100vh-64px)] lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] lg:items-center lg:gap-10 lg:py-12 xl:gap-16">

          {/* LEFT COLUMN */}
          <motion.div
            className="flex-1 max-w-[600px] space-y-7"
            variants={stagger}
            initial={prefersReduced ? false : 'hidden'}
            animate="show"
          >

            {/* Status badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 px-5 py-2 font-mono text-[11px] text-accent uppercase tracking-widest shadow-[0_0_28px_rgba(224,122,60,0.18)]">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(224,122,60,0.9)]" />
                {content.heroAvailability}
              </span>
            </motion.div>

            {/* Role cycler + Code2 icon */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 -mb-2">
              <Code2 size={14} className="text-accent/60 flex-shrink-0" />
              <span className="font-mono text-sm text-muted uppercase tracking-[0.22em]">
                <RoleCycler reduced={prefersReduced} />
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={fadeIn}
              className="whitespace-nowrap font-display font-bold text-primary tracking-tight leading-[1.05]"
              style={{ fontSize: 'clamp(2.3rem, 3.8vw, 4rem)' }}
            >
              <AnimatedGreeting name={profile.name} greeting={content.heroGreeting} prefersReduced={prefersReduced} profileLoading={profileLoading} />
            </motion.h1>

            {/* Divider line with subtitle */}
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <div className="h-px w-10 bg-gradient-to-r from-accent to-accent-soft" />
              <p className="font-display text-xl text-secondary font-medium">
                {profile.subtitle}
              </p>
            </motion.div>

            {/* Intro paragraph */}
            <motion.p variants={fadeUp} className="text-secondary text-[1.0625rem] leading-[1.75] max-w-[520px]">
              {profile.intro}
            </motion.p>

            {/* Location & Quick Copy Email */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 text-muted text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-accent/70" />
                <span>{profile.location}</span>
              </div>
              <span className="text-muted/30 hidden sm:inline">·</span>
              <button
                onClick={handleCopyEmail}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-elevated/80 border border-border/80 hover:border-accent/40 hover:bg-accent/5 text-xs font-mono text-secondary hover:text-accent transition-all duration-200 hover:shadow-[0_0_12px_rgba(224,122,60,0.1)]"
                title="Click to copy email address"
              >
                <Copy size={12} className="text-muted group-hover:text-accent transition-colors" />
                <span>{profile.email}</span>
              </button>
            </motion.div>

            {/* CTA row */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 pt-1">
              {/* Primary — shimmer on hover */}
              <div className="relative group overflow-hidden rounded-xl">
                <Button size="lg" onClick={() => scrollTo('#projects')} className="relative z-10">
                  {content.heroProjectsButton}
                  <ArrowRight size={16} />
                </Button>
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-20" />
              </div>

              <Button
                size="lg"
                variant="outline"
                className="!text-primary border-white/15 bg-white/5 hover:border-accent/50 hover:bg-accent/10 hover:shadow-[0_0_20px_rgba(224,122,60,0.1)] transition-all duration-300"
                onClick={() => scrollTo('#contact')}
              >
                {content.heroContactButton}
              </Button>

              <Button
                size="lg"
                variant="ghost"
                className="border border-white/15 hover:border-accent/40 bg-white/5 hover:bg-accent/5 hover:shadow-[0_0_16px_rgba(224,122,60,0.1)] transition-all duration-300"
                onClick={onOpenResume}
              >
                <FileText size={16} className="text-accent" />
                Resume / CV
              </Button>


            </motion.div>

            {/* Social links */}
            <motion.div variants={fadeUp} className="flex items-center gap-2.5">
              {socialLinks.filter(({ href }) => href).map(({ icon: Icon, href, label }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border border-border text-secondary transition-all duration-250 ${SOCIAL_COLORS[label] ?? ''}`}
                  initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.0 + i * 0.08 }}
                  whileHover={prefersReduced ? {} : { scale: 1.14, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={17} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN — photo */}
          <motion.div
            className="relative mx-auto flex w-full max-w-[28rem] items-center justify-center self-center py-10"
            initial={prefersReduced ? {} : { opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          >
            {/* Portrait */}
            <PortraitImage size="lg" src={photoUrl || undefined} alt={profile.name} loading={profileLoading} />
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ────────────────────────────────────── */}
      <motion.button
        onClick={() => scrollTo('#about')}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-accent z-10 lg:flex group"
        aria-label="Scroll down"
        initial={prefersReduced ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] group-hover:text-accent transition-colors">{content.heroScrollLabel}</span>
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-muted/40 to-accent/60 group-hover:via-accent/40 transition-colors" />
          <motion.div
            animate={prefersReduced ? {} : { y: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={15} className="text-accent" />
          </motion.div>
        </div>
      </motion.button>
    </section>
  )
}
