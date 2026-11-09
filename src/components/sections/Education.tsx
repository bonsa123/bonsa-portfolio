import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  CalendarDays,
  Award,
  ExternalLink,
  Copy,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import { useProjects } from '../../hooks/useProjects'
import { useToast } from '../ui/Toast'
import { Certificate } from '../../types'

export default function Education() {
  const { education, certificates = [], content } = useProjects()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'education' | 'certificates'>('education')

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    showToast(`Copied Credential ID "${id}" to clipboard!`, 'success')
  }

  return (
    <section id="education" className="py-16 md:py-24 bg-card/30 relative">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={content.educationEyebrow || '04 — Background'}
            title="Education & Credentials"
            subtitle="My academic background at Haramaya University and professional certifications."
          />
        </Reveal>

        {/* Tab Switcher */}
        <Reveal delay={0.08}>
          <div className="flex items-center justify-center mb-8 sm:mb-10">
            <div className="inline-flex p-1 sm:p-1.5 rounded-2xl bg-card border border-border/80 shadow-md">
              <button
                onClick={() => setActiveTab('education')}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'education'
                    ? 'text-white'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {activeTab === 'education' && (
                  <motion.div
                    layoutId="activeEduTab"
                    className="absolute inset-0 rounded-xl bg-accent shadow-md shadow-accent/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <GraduationCap size={15} className="relative z-10 shrink-0" />
                <span className="relative z-10">
                  <span className="hidden xs:inline">Academic </span>Journey
                </span>
                <span
                  className={`relative z-10 text-[9.5px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    activeTab === 'education'
                      ? 'bg-white/20 text-white'
                      : 'bg-elevated text-muted'
                  }`}
                >
                  {education.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('certificates')}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'certificates'
                    ? 'text-white'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {activeTab === 'certificates' && (
                  <motion.div
                    layoutId="activeEduTab"
                    className="absolute inset-0 rounded-xl bg-accent shadow-md shadow-accent/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Award size={15} className="relative z-10 shrink-0" />
                <span className="relative z-10">
                  <span className="hidden xs:inline">Certifications & </span>Badges
                </span>
                <span
                  className={`relative z-10 text-[9.5px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    activeTab === 'certificates'
                      ? 'bg-white/20 text-white'
                      : 'bg-elevated text-muted'
                  }`}
                >
                  {certificates.length}
                </span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'education' ? (
              <motion.div
                key="education"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="relative max-w-2xl mx-auto"
              >
                {/* Timeline rule */}
                <div className="absolute left-5 top-0 bottom-0 w-px bg-border hidden sm:block" />

                <div className="space-y-6">
                  {education.map((item) => (
                    <div key={item.id} className="relative sm:pl-14">
                      {/* Dot */}
                      <div className="hidden sm:flex absolute left-0 top-5 w-10 h-10 items-center justify-center rounded-full bg-accent/10 border-2 border-accent text-accent">
                        <GraduationCap size={18} />
                      </div>

                      {/* Card */}
                      <div className="p-5 sm:p-6 rounded-xl bg-card border border-border/80 hover:border-accent/40 shadow-sm hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-2.5">
                          <CalendarDays size={13} className="text-accent" />
                          <span className="font-mono text-xs text-accent font-medium">
                            {item.period}
                          </span>
                        </div>

                        <h3 className="font-display font-semibold text-primary text-lg sm:text-xl leading-snug">
                          {item.degree}
                        </h3>
                        <p className="text-secondary font-medium text-xs sm:text-sm mt-0.5 mb-2.5">
                          {item.institution}
                        </p>
                        <p className="text-secondary text-xs sm:text-sm leading-relaxed mb-4">
                          {item.description}
                        </p>

                        {/* Relevant courses */}
                        {item.highlights && item.highlights.length > 0 && (
                          <div className="pt-2 border-t border-border/50">
                            <p className="text-[11px] font-mono text-muted uppercase tracking-wider mb-2">
                              Core Courses & Focus Areas
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {item.highlights.map((h) => (
                                <span
                                  key={h}
                                  className="font-mono text-[11px] px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20"
                                >
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {education.length === 0 && (
                    <p className="text-center text-secondary py-8">
                      Education details will be added soon.
                    </p>
                  )}
                  {education.length > 0 && content.educationTimelineNote && (
                    <p className="sm:pl-14 text-muted text-xs font-mono text-center sm:text-left">
                      {content.educationTimelineNote}
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="certificates"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {certificates.length === 0 ? (
                  <div className="text-center py-12 p-8 rounded-xl border border-dashed border-border text-muted">
                    <Award size={32} className="mx-auto mb-3 opacity-40 text-accent" />
                    <p className="text-sm">No certifications listed yet.</p>
                    <p className="text-xs text-muted mt-1">
                      Add your certificates easily through the Admin Dashboard.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
                    {certificates.map((cert: Certificate) => (
                      <article
                        key={cert.id}
                        className="rounded-xl bg-card border border-border/80 hover:border-accent/40 shadow-sm hover:shadow-lg hover:shadow-accent/5 transition-all duration-200 p-2.5 sm:p-4.5 flex flex-col justify-between group h-full"
                      >
                        <div className="space-y-2 sm:space-y-3">
                          {/* Card Header: Icon, Issuer & Verified badge */}
                          <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 group-hover:scale-105 transition-transform">
                                <ShieldCheck size={13} className="sm:hidden" />
                                <ShieldCheck size={16} className="hidden sm:block" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[11px] sm:text-xs font-medium text-accent truncate block">
                                  {cert.issuer}
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-mono text-muted block truncate">
                                  {cert.issueDate}
                                </span>
                              </div>
                            </div>

                            <span className="text-[8.5px] sm:text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1 sm:px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                              <CheckCircle2 size={9} />
                              <span className="hidden xs:inline">Verified</span>
                            </span>
                          </div>

                          {/* Certificate Title */}
                          <h3 className="font-display font-semibold text-primary text-xs sm:text-[15px] leading-snug group-hover:text-accent transition-colors line-clamp-2">
                            {cert.title}
                          </h3>

                          {/* Credential ID badge */}
                          {cert.credentialId && (
                            <div className="flex items-center gap-1 text-[9.5px] sm:text-[11px] font-mono bg-elevated/70 border border-border/70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md w-fit max-w-full">
                              <span className="text-muted shrink-0">ID:</span>
                              <span className="text-primary font-medium truncate">{cert.credentialId}</span>
                              <button
                                onClick={(e) => handleCopyId(e, cert.credentialId!)}
                                className="text-muted hover:text-accent transition-colors ml-0.5 p-0.5 rounded hover:bg-card shrink-0"
                                title="Copy Credential ID"
                              >
                                <Copy size={10} />
                              </button>
                            </div>
                          )}

                          {/* Skills */}
                          {cert.skills && cert.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {cert.skills.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="font-mono text-[8.5px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded bg-elevated text-secondary border border-border/60"
                                >
                                  {skill}
                                </span>
                              ))}
                              {cert.skills.length > 3 && (
                                <span className="font-mono text-[8.5px] sm:text-[10px] text-muted self-center">
                                  +{cert.skills.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Footer: Verification Link */}
                        <div className="pt-2 sm:pt-2.5 mt-2 sm:mt-3 border-t border-border/50 flex items-center justify-between text-xs">
                          <span className="text-[9.5px] sm:text-[11px] font-mono text-muted">
                            Credential
                          </span>
                          {cert.credentialUrl ? (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                            >
                              <span>Verify</span>
                              <ExternalLink size={10} />
                            </a>
                          ) : (
                            <span className="text-[9.5px] sm:text-[11px] font-mono text-muted">ID on file</span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  )
}
