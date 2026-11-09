interface SectionHeadingProps {
  eyebrow: string
  title: string
  subtitle?: string
  centered?: boolean
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-10 md:mb-14 ${centered ? 'text-center' : ''}`}>
      <span className="font-mono text-xs text-accent uppercase tracking-widest mb-3 block">
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-primary leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-secondary text-base md:text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-4 h-px w-12 bg-accent ${centered ? 'mx-auto' : ''}`}
      />
    </div>
  )
}
