import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Terminal,
  FileText,
  Mail,
  Phone,
  Github,
  Linkedin,
  Send,
  Home,
  User,
  Cpu,
  FolderGit2,
  GraduationCap,
  Copy,
  Lock,
} from 'lucide-react'
import { useProjects } from '../../hooks/useProjects'
import { useToast } from './Toast'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpenResume?: () => void
  onOpenTerminal?: () => void
}

interface PaletteAction {
  id: string
  title: string
  category: 'Navigation' | 'Actions' | 'Social'
  icon: any
  shortcut?: string
  perform: () => void
}

export default function CommandPalette({
  isOpen,
  onClose,
  onOpenResume,
  onOpenTerminal,
}: CommandPaletteProps) {
  const { profile } = useProjects()
  const { showToast } = useToast()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollTo = (id: string) => {
    onClose()
    setTimeout(() => {
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }

  const actions: PaletteAction[] = useMemo(() => {
    const list: PaletteAction[] = [
      // Navigation
      {
        id: 'nav-home',
        title: 'Go to Top / Hero',
        category: 'Navigation',
        icon: Home,
        perform: () => scrollTo('#hero'),
      },
      {
        id: 'nav-about',
        title: 'Go to About Me',
        category: 'Navigation',
        icon: User,
        perform: () => scrollTo('#about'),
      },
      {
        id: 'nav-skills',
        title: 'Go to Technical Skills',
        category: 'Navigation',
        icon: Cpu,
        perform: () => scrollTo('#skills'),
      },
      {
        id: 'nav-projects',
        title: 'Go to Featured Projects',
        category: 'Navigation',
        icon: FolderGit2,
        perform: () => scrollTo('#projects'),
      },
      {
        id: 'nav-education',
        title: 'Go to Education & Background',
        category: 'Navigation',
        icon: GraduationCap,
        perform: () => scrollTo('#education'),
      },
      {
        id: 'nav-contact',
        title: 'Go to Contact',
        category: 'Navigation',
        icon: Mail,
        perform: () => scrollTo('#contact'),
      },

      // Actions
      {
        id: 'act-terminal',
        title: 'Open Interactive Terminal',
        category: 'Actions',
        icon: Terminal,
        shortcut: 'CLI',
        perform: () => {
          onClose()
          if (onOpenTerminal) onOpenTerminal()
        },
      },
      {
        id: 'act-resume',
        title: 'View Resume / CV',
        category: 'Actions',
        icon: FileText,
        shortcut: 'PDF',
        perform: () => {
          onClose()
          if (onOpenResume) onOpenResume()
        },
      },
      {
        id: 'act-copy-email',
        title: `Copy Email (${profile.email})`,
        category: 'Actions',
        icon: Copy,
        perform: () => {
          onClose()
          navigator.clipboard.writeText(profile.email)
          showToast(`Copied ${profile.email} to clipboard!`, 'success')
        },
      },
      {
        id: 'act-copy-phone',
        title: `Copy Phone (${profile.phone})`,
        category: 'Actions',
        icon: Phone,
        perform: () => {
          onClose()
          navigator.clipboard.writeText(profile.phone)
          showToast(`Copied ${profile.phone} to clipboard!`, 'success')
        },
      },
      {
        id: 'act-admin',
        title: 'Open Admin Dashboard',
        category: 'Actions',
        icon: Lock,
        perform: () => {
          onClose()
          window.location.href = '/admin'
        },
      },
    ]

    // Socials
    if (profile.social.github) {
      list.push({
        id: 'soc-github',
        title: 'GitHub Profile',
        category: 'Social',
        icon: Github,
        perform: () => {
          onClose()
          window.open(profile.social.github, '_blank')
        },
      })
    }
    if (profile.social.linkedin) {
      list.push({
        id: 'soc-linkedin',
        title: 'LinkedIn Profile',
        category: 'Social',
        icon: Linkedin,
        perform: () => {
          onClose()
          window.open(profile.social.linkedin, '_blank')
        },
      })
    }
    if (profile.social.telegram) {
      list.push({
        id: 'soc-telegram',
        title: 'Telegram Profile',
        category: 'Social',
        icon: Send,
        perform: () => {
          onClose()
          window.open(profile.social.telegram, '_blank')
        },
      })
    }

    return list
  }, [profile, onOpenTerminal, onOpenResume, showToast])

  const filteredActions = useMemo(() => {
    if (!query.trim()) return actions
    const q = query.toLowerCase()
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
    )
  }, [actions, query])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % (filteredActions.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(
        (prev) => (prev - 1 + filteredActions.length) % (filteredActions.length || 1),
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredActions[selectedIndex]) {
        filteredActions[selectedIndex].perform()
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Palette Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
          >
            {/* Search Input bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-elevated/40">
              <Search size={18} className="text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or jump to section..."
                className="flex-1 bg-transparent text-primary text-sm outline-none placeholder:text-muted"
                spellCheck={false}
              />
              <span className="font-mono text-[10px] text-muted border border-border px-1.5 py-0.5 rounded bg-card">
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredActions.length === 0 ? (
                <div className="py-8 text-center text-muted text-xs">
                  No matching commands found.
                </div>
              ) : (
                filteredActions.map((action, index) => {
                  const Icon = action.icon
                  const isSelected = index === selectedIndex

                  return (
                    <button
                      key={action.id}
                      onClick={action.perform}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm transition-colors ${
                        isSelected
                          ? 'bg-accent text-white shadow-sm'
                          : 'text-secondary hover:text-primary hover:bg-elevated'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          size={16}
                          className={isSelected ? 'text-white' : 'text-accent'}
                        />
                        <span className="truncate font-medium">
                          {action.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider ${
                            isSelected ? 'text-white/80' : 'text-muted'
                          }`}
                        >
                          {action.category}
                        </span>
                        {action.shortcut && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-card border border-border text-muted'
                            }`}
                          >
                            {action.shortcut}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>

            {/* Footer helper */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-elevated/40 text-[11px] text-muted font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
              </div>
              <span>Antigravity Portfolio v2.4</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
