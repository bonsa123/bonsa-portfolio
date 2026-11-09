import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, ImageOff, ArrowUpRight, Sparkles } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import ProjectDetailsModal from '../ui/ProjectDetailsModal'
import { useProjects } from '../../hooks/useProjects'
import { Project } from '../../types'

function ProjectCard({
  project,
  onOpenDetails,
}: {
  project: Project
  onOpenDetails: (p: Project) => void
}) {
  return (
    <article className="rounded-xl overflow-hidden bg-card border border-border/80 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5 flex flex-col group h-full">
      {/* Clickable Image Preview */}
      <div
        className="relative h-28 sm:h-44 overflow-hidden bg-elevated cursor-pointer"
        onClick={() => onOpenDetails(project)}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              const fallback = e.currentTarget.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'flex'
            }}
          />
        ) : null}

        {/* Fallback */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-muted gap-1"
          style={{ display: project.image ? 'none' : 'flex' }}
        >
          <ImageOff size={18} className="opacity-40" />
          <span className="font-mono text-[9px] sm:text-[11px] opacity-40">No preview</span>
        </div>

        {/* Subtle vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-black/20 pointer-events-none" />

        {/* Category & Featured Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
          {project.category && (
            <span className="px-1.5 py-0.5 text-[8.5px] sm:text-[10px] font-mono font-medium rounded bg-base/90 text-accent border border-accent/25 backdrop-blur-md shadow-sm">
              {project.category}
            </span>
          )}
          {project.featured && (
            <span className="hidden xs:inline-flex px-1.5 py-0.5 text-[8.5px] sm:text-[10px] font-mono font-semibold rounded bg-accent text-white items-center gap-0.5 shadow-sm">
              <Sparkles size={9} />
              Featured
            </span>
          )}
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-white bg-black/75 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10 shadow">
            Details
            <ArrowUpRight size={12} />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-4.5 gap-2 sm:gap-3 justify-between">
        <div className="space-y-1 sm:space-y-1.5">
          <h3
            onClick={() => onOpenDetails(project)}
            className="font-display font-semibold text-primary text-xs sm:text-base leading-snug group-hover:text-accent transition-colors cursor-pointer flex items-center justify-between gap-1"
          >
            <span className="truncate">{project.title}</span>
            <ArrowUpRight
              size={13}
              className="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 hidden xs:inline-block"
            />
          </h3>
          <p className="text-secondary text-[11px] sm:text-xs leading-snug sm:leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="font-mono text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-elevated text-secondary border border-border/70"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="font-mono text-[9px] sm:text-[10px] text-muted self-center">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between gap-1.5 pt-2 sm:pt-2.5 border-t border-border/60">
          <button
            onClick={() => onOpenDetails(project)}
            className="inline-flex items-center gap-0.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium bg-elevated hover:bg-accent/15 hover:text-accent text-secondary border border-border/80 transition-colors"
          >
            Details
          </button>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {project.sourceUrl && (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View Source Code"
                className="inline-flex items-center justify-center p-1 sm:p-1.5 rounded text-secondary hover:text-primary hover:bg-elevated border border-border/70 transition-colors"
              >
                <Github size={12} className="sm:w-3.5 sm:h-3.5" />
              </a>
            )}

            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium bg-accent text-white hover:bg-accent/90 transition-colors shadow-sm"
              >
                <span>Live</span>
                <ExternalLink size={10} className="sm:w-3 sm:h-3" />
              </a>
            ) : (
              <span className="text-[9.5px] sm:text-[11px] font-mono text-muted/70 px-0.5">
                Soon
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const { projects, content } = useProjects()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return ['All', ...Array.from(set)]
  }, [projects])

  // Filter projects based on selected tab
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects
    return projects.filter((p) => p.category === selectedCategory)
  }, [projects, selectedCategory])

  const handleOpenDetails = (project: Project) => {
    setActiveProject(project)
    setIsModalOpen(true)
  }

  const handleCloseDetails = () => {
    setIsModalOpen(false)
    setActiveProject(null)
  }

  return (
    <section id="projects" className="py-14 sm:py-20 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={content.projectsEyebrow}
            title={content.projectsTitle}
            subtitle={content.projectsSubtitle}
          />
        </Reveal>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-accent shadow-md shadow-accent/25'
                        : 'text-secondary hover:text-primary bg-elevated/70 border border-border/80 hover:border-accent/40'
                    }`}
                  >
                    {cat}
                    {cat !== 'All' && (
                      <span className="ml-1 opacity-60 text-[10px] sm:text-[11px] font-mono">
                        ({projects.filter((p) => p.category === cat).length})
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </Reveal>
        )}

        {/* Projects Grid — 2 columns on mobile, 3 on desktop */}
        {filteredProjects.length === 0 ? (
          <p className="text-center text-secondary py-12">
            No projects found in this category.
          </p>
        ) : (
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5">
            <AnimatePresence>
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="h-full"
                >
                  <ProjectCard
                    project={project}
                    onOpenDetails={handleOpenDetails}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </Container>

      {/* Case Study Deep-Dive Modal */}
      <ProjectDetailsModal
        project={activeProject}
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
      />
    </section>
  )
}
