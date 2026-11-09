import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Monitor, Server, Database, Wrench } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import { useProjects } from '../../hooks/useProjects'

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Monitor,
  Server,
  Database,
  Wrench,
}

export default function Skills() {
  const { skillCategories, content } = useProjects()
  const [activeTab, setActiveTab] = useState<string>('all')

  const filteredCategories =
    activeTab === 'all'
      ? skillCategories
      : skillCategories.filter((c) => String(c.id) === activeTab)

  return (
    <section id="skills" className="relative py-14 sm:py-20 md:py-28 bg-base">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={content.skillsEyebrow}
            title={content.skillsTitle}
            subtitle={content.skillsSubtitle}
          />
        </Reveal>

        {/* ── Category Filter Tabs ──────────────── */}
        {skillCategories.length > 0 && (
          <Reveal delay={0.08}>
            <div className="mt-8 sm:mt-10 mb-6 sm:mb-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-mono text-[11px] sm:text-xs transition-colors ${
                  activeTab === 'all'
                    ? 'text-primary font-medium'
                    : 'text-muted hover:text-secondary'
                }`}
              >
                {activeTab === 'all' && (
                  <motion.div
                    layoutId="activeSkillTab"
                    className="absolute inset-0 rounded-xl bg-card border border-accent/40 shadow-sm"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">All</span>
              </button>

              {skillCategories.map((cat) => {
                const isSelected = activeTab === String(cat.id)
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(String(cat.id))}
                    className={`relative px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-mono text-[11px] sm:text-xs transition-colors ${
                      isSelected
                        ? 'text-primary font-medium'
                        : 'text-muted hover:text-secondary'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeSkillTab"
                        className="absolute inset-0 rounded-xl bg-card border border-accent/40 shadow-sm"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </Reveal>
        )}

        {/* ── Clean & Balanced Skill Cards (2 in a row on mobile) ──────────────── */}
        {skillCategories.length === 0 ? (
          <p className="text-center text-muted font-mono text-sm py-12">
            Skills will be added soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredCategories.map((cat, i) => {
                const Icon = iconMap[cat.icon] || Code2
                return (
                  <motion.div
                    key={cat.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className="group flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-6 transition-all duration-300 hover:border-accent/40 hover:-translate-y-1 shadow-md shadow-black/10"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
                        <div className="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl bg-accent/10 border border-accent/20 text-accent transition-colors group-hover:bg-accent/15 shrink-0">
                          <Icon size={14} className="sm:hidden" />
                          <Icon size={18} className="hidden sm:block" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display font-semibold text-primary text-xs sm:text-base leading-tight truncate">
                            {cat.label}
                          </h3>
                          <span className="font-mono text-[9.5px] sm:text-[11px] text-muted">
                            {cat.skills.length} techs
                          </span>
                        </div>
                      </div>

                      {/* Clean Skill Pills */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {cat.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border border-border bg-elevated/80 font-mono text-[10px] sm:text-xs text-secondary transition-all duration-200 hover:border-accent/40 hover:text-primary hover:bg-elevated cursor-default"
                          >
                            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-accent/70 shrink-0" />
                            <span className="truncate">{skill}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </Container>
    </section>
  )
}
