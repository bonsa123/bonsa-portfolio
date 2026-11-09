import { useState, useEffect } from 'react'
import { Terminal as TerminalIcon } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Skills from '../components/sections/Skills'
import Projects from '../components/sections/Projects'
import Education from '../components/sections/Education'
import Contact from '../components/sections/Contact'
import ResumeModal from '../components/ui/ResumeModal'
import InteractiveTerminal from '../components/ui/InteractiveTerminal'
import CommandPalette from '../components/ui/CommandPalette'

export default function Portfolio() {
  const [resumeOpen, setResumeOpen] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
      }
      // Toggle Terminal with backtick ` (when not in an input/textarea)
      else if (
        e.key === '`' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        setTerminalOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar
        onOpenResume={() => setResumeOpen(true)}
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenTerminal={() => setTerminalOpen(true)}
      />
      <main className="flex-1">
        <Hero
          onOpenResume={() => setResumeOpen(true)}
          onOpenTerminal={() => setTerminalOpen(true)}
        />
        <About onOpenResume={() => setResumeOpen(true)} />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />

      {/* Floating Action Trigger for Developer Terminal */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2">
        <button
          onClick={() => setTerminalOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card/90 hover:bg-elevated border border-border hover:border-accent/50 shadow-xl backdrop-blur-md text-xs font-mono text-secondary hover:text-accent transition-all duration-200"
          title="Open Developer Shell (Press `)"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-ping" />
          <TerminalIcon size={14} className="text-accent" />
          <span>Interactive Shell</span>
          <span className="text-[10px] text-muted border border-border/80 px-1 rounded bg-elevated/80 ml-1">
            `
          </span>
        </button>
      </div>

      {/* Modals & Dialogs */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
      <InteractiveTerminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onOpenResume={() => setResumeOpen(true)}
      />
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenResume={() => setResumeOpen(true)}
        onOpenTerminal={() => setTerminalOpen(true)}
      />
    </div>
  )
}
