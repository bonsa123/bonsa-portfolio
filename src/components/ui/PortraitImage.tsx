import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import fallbackPhoto from '../../assets/bonsa.png'

interface PortraitImageProps {
  src?: string
  alt?: string
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function PortraitPhoto({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (failed && src !== fallbackPhoto) {
    return <PortraitPhoto src={fallbackPhoto} alt={alt} />
  }

  return (
    <>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-transparent" aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        className={`relative w-full h-full object-contain object-bottom select-none pointer-events-none drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  )
}

export default function PortraitImage({
  src,
  alt = 'Bonsa Muluneh',
  loading = false,
  size = 'md',
  className = '',
}: PortraitImageProps) {
  const prefersReduced = useReducedMotion()
  const photoSrc = src || fallbackPhoto
  const containerRef = useRef<HTMLDivElement>(null)

  /* Hover tilt */
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const springRotX = useSpring(rotX, { stiffness: 160, damping: 24 })
  const springRotY = useSpring(rotY, { stiffness: 160, damping: 24 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    const nx = ((e.clientX - left) / width - 0.5) * 2
    const ny = ((e.clientY - top) / height - 0.5) * 2
    rotX.set(-ny * 8)
    rotY.set(nx * 8)
  }

  const handleMouseLeave = () => {
    rotX.set(0)
    rotY.set(0)
  }

  const dimensions = {
    sm: 'w-32 h-36',
    md: 'w-48 h-56 md:w-60 md:h-72',
    lg: 'w-72 h-[22rem] sm:w-80 sm:h-[26rem] xl:w-[26rem] xl:h-[32rem]',
  }

  return (
    <motion.div
      ref={containerRef}
      className={`relative flex items-end justify-center flex-shrink-0 ${dimensions[size]} ${className}`}
      style={
        prefersReduced
          ? {}
          : { rotateX: springRotX, rotateY: springRotY, transformStyle: 'preserve-3d', perspective: 1000 }
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Direct Cutout Photo — No frame, No bounding background box */}
      <div className="relative h-full w-full flex items-end justify-center">
        {loading ? (
          <div className="absolute inset-0 animate-pulse bg-transparent" aria-hidden="true" />
        ) : (
          <PortraitPhoto key={photoSrc} src={photoSrc} alt={alt} />
        )}

        {/* Soft bottom vignette blend */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(14,14,16,0.9) 100%)' }}
        />
      </div>
    </motion.div>
  )
}
