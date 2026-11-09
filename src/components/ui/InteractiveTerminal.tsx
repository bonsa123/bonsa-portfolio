import { useState, useRef, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal as TerminalIcon, X, Sparkles, Check } from 'lucide-react'
import { useProjects } from '../../hooks/useProjects'
import { useToast } from './Toast'

interface CommandHistoryItem {
  id: string
  command: string
  output: ReactNode
}

interface InteractiveTerminalProps {
  isOpen: boolean
  onClose: () => void
  onOpenResume?: () => void
}

export default function InteractiveTerminal({
  isOpen,
  onClose,
  onOpenResume,
}: InteractiveTerminalProps) {
  const { profile, skillCategories, projects, education } = useProjects()
  const { showToast } = useToast()

  const [input, setInput] = useState('')
  const [history, setHistory] = useState<CommandHistoryItem[]>([])
  const [commandIndex, setCommandIndex] = useState<number>(-1)
  const [previousCommands, setPreviousCommands] = useState<string[]>([])
  const [isMaximized, setIsMaximized] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalEndRef = useRef<HTMLDivElement>(null)

  // Focus input whenever terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  // Scroll to bottom on new output
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  // Welcome message
  useEffect(() => {
    if (history.length === 0) {
      setHistory([
        {
          id: 'welcome',
          command: 'welcome',
          output: (
            <div className="space-y-1.5 text-secondary text-xs sm:text-sm">
              <p className="text-accent font-semibold flex items-center gap-1.5">
                <Sparkles size={14} />
                Bonsa Muluneh Interactive Shell (v2.4)
              </p>
              <p className="text-muted text-xs">
                Computer Science @ Haramaya University &middot; Aspiring Software Developer
              </p>
              <p className="text-muted text-xs pt-1">
                Type <span className="text-accent font-mono">help</span> to view available commands, or tap the quick action tags below.
              </p>
            </div>
          ),
        },
      ])
    }
  }, [history.length])

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    if (!trimmed) return

    setPreviousCommands((prev) => [...prev, trimmed])
    setCommandIndex(-1)

    let output: ReactNode = null

    switch (trimmed) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="text-primary font-semibold">Available Commands:</p>
            <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[130px_1fr] gap-y-1 text-xs font-mono">
              <span className="text-accent">about</span>
              <span className="text-secondary">Summary about Bonsa and goals</span>

              <span className="text-accent">skills</span>
              <span className="text-secondary">Technical skills & languages</span>

              <span className="text-accent">projects</span>
              <span className="text-secondary">Featured software projects</span>

              <span className="text-accent">education</span>
              <span className="text-secondary">Haramaya University CS details</span>

              <span className="text-accent">contact</span>
              <span className="text-secondary">Email, phone, and social links</span>

              <span className="text-accent">resume</span>
              <span className="text-secondary">Open formatted Resume / CV preview</span>

              <span className="text-accent">email</span>
              <span className="text-secondary">Copy email to clipboard</span>

              <span className="text-accent">whoami</span>
              <span className="text-secondary">Display current session user</span>

              <span className="text-accent">clear</span>
              <span className="text-secondary">Clear terminal history</span>

              <span className="text-accent">exit</span>
              <span className="text-secondary">Close terminal window</span>
            </div>
          </div>
        )
        break

      case 'about':
        output = (
          <div className="space-y-1.5 text-xs sm:text-sm text-secondary">
            <p className="text-primary font-semibold">{profile.name} — {profile.title}</p>
            <p>{profile.intro}</p>
            <p className="text-muted text-xs">Based in {profile.location} &middot; Open to internship & software developer opportunities.</p>
          </div>
        )
        break

      case 'skills':
        output = (
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="text-primary font-semibold">Technical Stack:</p>
            {skillCategories.map((cat) => (
              <div key={cat.id} className="text-xs">
                <span className="text-accent font-mono font-medium">{cat.label}: </span>
                <span className="text-secondary">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        )
        break

      case 'projects':
        output = (
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="text-primary font-semibold">Featured Projects:</p>
            {projects.map((p, idx) => (
              <div key={p.id} className="border-l border-accent/40 pl-2.5 py-0.5 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-accent font-mono">[{idx + 1}]</span>
                  <span className="text-primary font-medium">{p.title}</span>
                  {p.category && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-accent/10 text-accent rounded">
                      {p.category}
                    </span>
                  )}
                </div>
                <p className="text-secondary text-xs">{p.description}</p>
                <p className="text-muted text-[11px] font-mono">Stack: {p.technologies.join(', ')}</p>
              </div>
            ))}
          </div>
        )
        break

      case 'education':
        output = (
          <div className="space-y-1.5 text-xs sm:text-sm">
            <p className="text-primary font-semibold">{education[0]?.institution || 'Haramaya University'}</p>
            <p className="text-accent text-xs font-mono">{education[0]?.degree || 'B.Sc. in Computer Science'} ({education[0]?.period || '2022 — 2026'})</p>
            <p className="text-secondary text-xs">{education[0]?.description}</p>
          </div>
        )
        break

      case 'contact':
        output = (
          <div className="space-y-1 text-xs sm:text-sm font-mono">
            <p className="text-primary font-sans font-semibold">Get in Touch:</p>
            <p className="text-secondary">Email: <span className="text-accent">{profile.email}</span></p>
            <p className="text-secondary">Phone: <span className="text-accent">{profile.phone}</span></p>
            <p className="text-secondary">GitHub: <a href={profile.social.github} target="_blank" rel="noreferrer" className="text-accent hover:underline">{profile.social.github}</a></p>
            <p className="text-secondary">Telegram: <a href={profile.social.telegram} target="_blank" rel="noreferrer" className="text-accent hover:underline">{profile.social.telegram}</a></p>
          </div>
        )
        break

      case 'email':
        navigator.clipboard.writeText(profile.email)
        showToast(`Copied ${profile.email} to clipboard!`, 'success')
        output = (
          <div className="text-emerald-400 text-xs flex items-center gap-1.5">
            <Check size={14} />
            <span>Copied {profile.email} to clipboard.</span>
          </div>
        )
        break

      case 'resume':
      case 'cv':
        output = (
          <div className="text-accent text-xs">
            Opening Resume preview modal...
          </div>
        )
        if (onOpenResume) {
          setTimeout(() => onOpenResume(), 300)
        }
        break

      case 'whoami':
        output = (
          <div className="text-xs text-secondary">
            visitor@bonsa-portfolio (Guest Recruiter / Fellow Developer)
          </div>
        )
        break

      case 'clear':
      case 'cls':
        setHistory([])
        setInput('')
        return

      case 'exit':
      case 'quit':
        onClose()
        setInput('')
        return

      case 'sudo':
        output = (
          <div className="text-amber-400 text-xs">
            Permission denied: You are not in the sudoers file. However, you have full permission to hire Bonsa!
          </div>
        )
        break

      default:
        output = (
          <div className="text-rose-400 text-xs">
            Command not recognized: "{trimmed}". Type <span className="text-accent underline cursor-pointer" onClick={() => executeCommand('help')}>help</span> for available commands.
          </div>
        )
        break
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        command: cmd,
        output,
      },
    ])
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      executeCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (previousCommands.length === 0) return
      const nextIndex = commandIndex + 1 < previousCommands.length ? commandIndex + 1 : commandIndex
      setCommandIndex(nextIndex)
      setInput(previousCommands[previousCommands.length - 1 - nextIndex])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (commandIndex > 0) {
        const nextIndex = commandIndex - 1
        setCommandIndex(nextIndex)
        setInput(previousCommands[previousCommands.length - 1 - nextIndex])
      } else {
        setCommandIndex(-1)
        setInput('')
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
            aria-hidden="true"
          />

          {/* Terminal Window Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-auto relative w-full ${
              isMaximized ? 'max-w-6xl h-[92vh]' : 'max-w-2xl h-[560px] max-h-[85vh]'
            } bg-[#0e1117] border border-border/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-mono text-sm transition-all duration-300`}
          >
            {/* Window title bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-border/70 select-none">
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 transition-opacity"
                  title="Close"
                />
                <button
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-amber-500 hover:opacity-80 transition-opacity"
                  title="Minimize"
                />
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 transition-opacity"
                  title="Expand"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted">
                <TerminalIcon size={13} className="text-accent" />
                <span>bonsa@harampus:~$</span>
              </div>

              <button
                onClick={onClose}
                className="text-secondary hover:text-primary transition-colors p-1"
                aria-label="Close terminal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Terminal Body */}
            <div
              className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((item) => (
                <div key={item.id} className="space-y-1.5">
                  {item.command !== 'welcome' && (
                    <div className="flex items-center gap-2 text-muted">
                      <span className="text-emerald-400 font-semibold">visitor@bonsa:~$</span>
                      <span className="text-primary font-semibold">{item.command}</span>
                    </div>
                  )}
                  <div className="pl-0 sm:pl-2">{item.output}</div>
                </div>
              ))}

              {/* Active prompt row */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-emerald-400 font-semibold shrink-0">visitor@bonsa:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-primary outline-none font-mono caret-accent text-xs sm:text-sm"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
              <div ref={terminalEndRef} />
            </div>

            {/* Quick action buttons row */}
            <div className="px-4 py-2.5 bg-[#161b22]/90 border-t border-border/70 flex flex-wrap items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-muted text-[10px] uppercase tracking-wider mr-1">Quick:</span>
              {['help', 'skills', 'projects', 'resume', 'contact', 'email', 'clear'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => executeCommand(cmd)}
                  className="px-2 py-0.5 rounded bg-elevated/70 border border-border/80 text-secondary hover:text-accent hover:border-accent/40 transition-colors font-mono"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
