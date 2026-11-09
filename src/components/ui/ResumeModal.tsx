import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Printer, ExternalLink, Mail, Phone, MapPin, GraduationCap, Code2, Briefcase, Award } from 'lucide-react'
import { useProjects } from '../../hooks/useProjects'
import { Certificate, EducationEntry, SkillCategory } from '../../types'

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { profile, education, skillCategories, certificates = [] } = useProjects()

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handlePrint = () => {
    window.print()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto print:p-0 print:overflow-visible">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm print:hidden"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black print:rounded-none"
          >
            {/* Modal Header & Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-elevated/50 print:hidden">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                <h3 className="font-display font-semibold text-primary text-base">Curriculum Vitae</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-secondary hover:text-primary hover:border-accent/40 hover:bg-elevated transition-colors"
                  title="Print or Save as PDF"
                >
                  <Printer size={14} />
                  <span>Print / Save PDF</span>
                </button>
                {profile.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    download="Bonsa_Muluneh_Resume.pdf"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
                  >
                    <Download size={14} />
                    <span>Download File</span>
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-elevated transition-colors"
                  aria-label="Close resume preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Printable Document */}
            <div className="overflow-y-auto p-6 sm:p-10 space-y-8 print:p-0 print:overflow-visible text-primary">
              {/* Header */}
              <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold tracking-tight text-primary">
                    {profile.name}
                  </h1>
                  <p className="font-mono text-sm text-accent mt-1">
                    {profile.title} &middot; {profile.subtitle}
                  </p>
                  <p className="text-secondary text-sm mt-2 max-w-xl leading-relaxed">
                    {profile.intro}
                  </p>
                </div>
                <div className="space-y-1.5 text-xs font-mono text-secondary shrink-0">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-accent" />
                    <a href={`mailto:${profile.email}`} className="hover:text-accent transition-colors">
                      {profile.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-accent" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-accent" />
                    <span>{profile.location}</span>
                  </div>
                  {profile.social.github && (
                    <div className="flex items-center gap-2">
                      <ExternalLink size={13} className="text-accent" />
                      <a href={profile.social.github} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                        github.com/bonsa123
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap size={18} className="text-accent" />
                  <h2 className="font-display text-lg font-bold uppercase tracking-wider text-primary">Education</h2>
                </div>
                <div className="space-y-4">
                  {education.map((edu: EducationEntry) => (
                    <div key={edu.id} className="border-l-2 border-accent/40 pl-4 py-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="font-semibold text-primary">{edu.institution}</h3>
                        <span className="font-mono text-xs text-accent">{edu.period}</span>
                      </div>
                      <p className="text-sm font-medium text-secondary">{edu.degree}</p>
                      <p className="text-xs text-muted mt-1 leading-relaxed">{edu.description}</p>
                      {edu.highlights && edu.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {edu.highlights.map((h: string) => (
                            <span key={h} className="text-[11px] font-mono bg-elevated px-2 py-0.5 rounded border border-border text-secondary">
                              {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications & Credentials */}
              {certificates.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Award size={18} className="text-accent" />
                    <h2 className="font-display text-lg font-bold uppercase tracking-wider text-primary">
                      Certifications & Credentials
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {certificates.map((cert: Certificate) => (
                      <div key={cert.id} className="p-3.5 rounded-xl border border-border bg-elevated/30 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-xs sm:text-sm text-primary leading-snug">{cert.title}</h3>
                          <span className="font-mono text-[11px] text-accent shrink-0">{cert.issueDate}</span>
                        </div>
                        <p className="text-xs text-secondary font-medium">Issued by {cert.issuer}</p>
                        {cert.credentialId && (
                          <p className="text-[11px] font-mono text-muted">ID: {cert.credentialId}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Skills */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Code2 size={18} className="text-accent" />
                  <h2 className="font-display text-lg font-bold uppercase tracking-wider text-primary">Technical Proficiencies</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skillCategories.map((cat: SkillCategory) => (
                    <div key={cat.id} className="bg-elevated/40 border border-border p-3.5 rounded-xl">
                      <span className="text-xs font-mono font-semibold text-accent uppercase tracking-wider block mb-2">
                        {cat.label}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.skills.map((s: string) => (
                          <span key={s} className="text-xs bg-card px-2 py-1 rounded border border-border text-primary font-mono">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Projects */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase size={18} className="text-accent" />
                  <h2 className="font-display text-lg font-bold uppercase tracking-wider text-primary">Key Projects</h2>
                </div>
                <div className="space-y-4">
                  <div className="border-l-2 border-accent/40 pl-4 py-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-primary">Gindo Student Registration System</h3>
                      <span className="font-mono text-xs text-muted">PHP &middot; MySQL &middot; JavaScript</span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed">
                      Engineered a relational web application that automates student enrollment, course capacity management, and grade records, reducing administrative registration processing time by over 70%.
                    </p>
                    <ul className="list-disc list-inside text-xs text-muted space-y-1">
                      <li>Designed 3NF MySQL relational database schemas with indexed foreign keys and data consistency constraints.</li>
                      <li>Implemented role-based security (Admin, Registrar, Student) with session hashing.</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-accent/40 pl-4 py-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-primary">CampusConnect — Academic Notice & Resource Hub</h3>
                      <span className="font-mono text-xs text-muted">React &middot; Node.js &middot; Express &middot; MySQL</span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed">
                      Developed full-stack campus platform connecting students and faculty with categorized department announcements, syllabus repository, and real-time updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
