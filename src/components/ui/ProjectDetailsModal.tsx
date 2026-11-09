import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github, CheckCircle2, AlertCircle, Layers, UserCheck } from 'lucide-react'
import { Project } from '../../types'
import Tag from './Tag'
import Button from './Button'

interface ProjectDetailsModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectDetailsModal({
  project,
  isOpen,
  onClose,
}: ProjectDetailsModalProps) {
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-elevated/50">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-accent uppercase tracking-wider">
                  Case Study
                </span>
                {project.category && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                    {project.category}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-elevated transition-colors"
                aria-label="Close project modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Media Preview */}
              {project.image && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border/80 bg-elevated shadow-inner">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-40" />
                </div>
              )}

              {/* Title & Role */}
              <div className="space-y-2">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
                  {project.title}
                </h2>
                {project.role && (
                  <div className="flex items-center gap-2 text-sm text-accent font-medium">
                    <UserCheck size={16} />
                    <span>{project.role}</span>
                  </div>
                )}
              </div>

              {/* Overview / Long description */}
              <div className="space-y-2">
                <h3 className="font-display font-semibold text-primary text-base flex items-center gap-2">
                  <Layers size={16} className="text-accent" />
                  Project Overview
                </h3>
                <p className="text-secondary text-sm sm:text-base leading-relaxed">
                  {project.longDescription || project.description}
                </p>
              </div>

              {/* Engineering Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-display font-semibold text-primary text-base">
                    Key Features & Technical Implementation
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {project.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-elevated/60 border border-border/60 text-secondary text-sm leading-relaxed"
                      >
                        <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges & Solutions */}
              {project.challenges && (
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-2">
                  <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                    <AlertCircle size={16} />
                    <span>Technical Challenge & Resolution</span>
                  </div>
                  <p className="text-secondary text-xs sm:text-sm leading-relaxed">
                    {project.challenges}
                  </p>
                </div>
              )}

              {/* Technologies Used */}
              <div className="space-y-2">
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted">
                  Technologies & Frameworks
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Tag key={tech} label={tech} />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center gap-3">
                {project.liveUrl ? (
                  <Button size="md" href={project.liveUrl}>
                    <ExternalLink size={15} />
                    Live Preview
                  </Button>
                ) : (
                  <Button size="md" disabled>
                    <ExternalLink size={15} />
                    Live Demo Coming Soon
                  </Button>
                )}

                {project.sourceUrl ? (
                  <Button size="md" variant="outline" href={project.sourceUrl}>
                    <Github size={15} />
                    View Repository
                  </Button>
                ) : null}

                <Button size="md" variant="ghost" onClick={onClose} className="ml-auto">
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
