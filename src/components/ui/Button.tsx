import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
  fullWidth?: boolean
  download?: boolean | string
  target?: string
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  fullWidth = false,
  download,
  target,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-sans font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-base'

  const variants = {
    primary:
      'bg-accent text-white hover:bg-accent/90 active:scale-95',
    outline:
      'border border-accent text-accent hover:bg-accent/10 active:scale-95',
    ghost:
      'text-secondary hover:text-primary hover:bg-elevated active:scale-95',
  }

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-[1rem] px-7 py-3.5',
  }

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`

  if (href) {
    return (
      <a
        href={href}
        download={download}
        className={classes}
        target={target || (href.startsWith('http') ? '_blank' : undefined)}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
