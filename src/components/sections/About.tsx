import { useReducedMotion } from 'framer-motion'
import {
  ChevronDown,
  ArrowRight,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Send,
  Mail,
} from 'lucide-react'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import { useProjects } from '../../hooks/useProjects'
import fallbackPhoto from '../../assets/bonsa.jpg'

interface AboutProps {
  onOpenResume?: () => void
}

export default function About({ onOpenResume }: AboutProps) {
  const { profile, content } = useProjects()
  useReducedMotion()

  const photoUrl =
    content.aboutPhotoUrl ||
    (profile as { photoUrl?: string }).photoUrl ||
    fallbackPhoto

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Text paragraphs from CMS or fallbacks
  const aboutBio =
    content.aboutParagraphs?.[0] ||
    "I'm currently pursuing my Bachelor's degree in Computer Science at Haramaya University, where I'm developing a strong foundation in programming, algorithms, data structures, and software engineering principles."

  const workBio =
    content.aboutParagraphs?.[1] ||
    'I build real-world applications that solve tangible problems. My work spans full-stack development, database architecture, and responsive user interfaces with PHP, MySQL, React, and Node.js.'

  const socialLinks = [
    { name: 'GitHub', url: profile.social?.github, icon: Github },
    { name: 'LinkedIn', url: profile.social?.linkedin, icon: Linkedin },
    { name: 'Instagram', url: profile.social?.instagram, icon: Instagram },
    { name: 'YouTube', url: profile.social?.youtube, icon: Youtube },
    { name: 'Telegram', url: profile.social?.telegram, icon: Send },
    { name: 'Email', url: profile.email ? `mailto:${profile.email}` : undefined, icon: Mail },
  ].filter((item) => Boolean(item.url))

  return (
    <section id="about" className="relative py-20 md:py-28 lg:py-32 overflow-hidden bg-black text-primary">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute top-1/2 right-1/4 -translate-y-1/2 w-[650px] h-[500px] opacity-[0.08] blur-[130px]"
        style={{ background: 'radial-gradient(ellipse, #E07A3C 0%, transparent 70%)' }}
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* ── LEFT COLUMN: Structured Story & Content Blocks (lg:col-span-7) ── */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pr-0 lg:pr-6 order-2 lg:order-1">
            
            {/* Block 1: ABOUT ME */}
            <Reveal delay={0.05}>
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent mb-2.5">
                  About Me
                </p>
                <p className="text-secondary text-sm sm:text-[15px] leading-relaxed mb-3.5 max-w-xl">
                  {aboutBio}
                </p>
                <button
                  onClick={() => {
                    if (onOpenResume) {
                      onOpenResume()
                    } else {
                      scrollToSection('education')
                    }
                  }}
                  className="group inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary hover:text-accent border-b border-border hover:border-accent pb-0.5 transition-colors"
                >
                  <span>{onOpenResume ? 'View Resume' : 'Learn More'}</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Reveal>

            {/* Block 2: MY WORK */}
            <Reveal delay={0.1}>
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent mb-2.5">
                  My Work
                </p>
                <p className="text-secondary text-sm sm:text-[15px] leading-relaxed mb-3.5 max-w-xl">
                  {workBio}
                </p>
                <button
                  onClick={() => scrollToSection('projects')}
                  className="group inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary hover:text-accent border-b border-border hover:border-accent pb-0.5 transition-colors"
                >
                  <span>Browse Portfolio</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Reveal>

            {/* Block 3: Action Buttons & Socials */}
            <Reveal delay={0.15}>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-6 border-t border-border/50 max-w-xl">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent mb-2.5">
                    Follow Me
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {socialLinks.map(({ name, url, icon: Icon }) => (
                      <a
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={name}
                        className="w-9 h-9 rounded-full bg-elevated/80 border border-border/80 hover:border-accent hover:text-accent hover:bg-accent/10 flex items-center justify-center text-secondary transition-all duration-200"
                      >
                        <Icon size={16} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Downward circular navigation button */}
                <button
                  onClick={() => scrollToSection('skills')}
                  className="group w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105 active:scale-95 transition-all duration-300 self-end"
                  title="Explore skills & projects"
                  aria-label="Scroll down"
                >
                  <ChevronDown
                    size={22}
                    className="group-hover:translate-y-1 transition-transform duration-200"
                  />
                </button>
              </div>
            </Reveal>

          </div>

          {/* ── RIGHT COLUMN: Portrait Cutout on the Right (lg:col-span-5) ── */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end order-1 lg:order-2 self-center">
            <Reveal delay={0.1} className="w-full flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[460px] flex items-center justify-center">
                {/* Subject portrait */}
                <img
                  src={photoUrl}
                  alt={profile.name}
                  className="relative z-10 w-full max-h-[360px] sm:max-h-[500px] lg:max-h-[580px] object-contain object-center select-none pointer-events-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
                  loading="eager"
                />

                {/* Smooth bottom fade into canvas */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-20 bg-gradient-to-t from-black to-transparent" />
              </div>
            </Reveal>
          </div>

        </div>
      </Container>
    </section>
  )
}
