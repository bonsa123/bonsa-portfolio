import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Delay in seconds before the reveal starts (use for staggered grids). */
  delay?: number
  /** Vertical offset to travel from, in px. */
  y?: number
  className?: string
}

/**
 * Scroll-triggered fade + slide-up entrance.
 * Uses framer-motion's `whileInView` (IntersectionObserver under the hood),
 * animates once, and disables movement when the user prefers reduced motion.
 */
export default function Reveal({ children, delay = 0, y = 28, className = '' }: RevealProps) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px 0px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
