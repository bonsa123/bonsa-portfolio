interface TagProps {
  label: string
  variant?: 'default' | 'accent'
}

export default function Tag({ label, variant = 'default' }: TagProps) {
  const variants = {
    default: 'bg-elevated text-secondary border border-border',
    accent: 'bg-accent/10 text-accent border border-accent/20',
  }

  return (
    <span
      className={`font-mono text-xs px-2.5 py-1 rounded-md ${variants[variant]}`}
    >
      {label}
    </span>
  )
}
