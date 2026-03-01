import { useEffect, useMemo, useRef, useState } from 'react'

interface RollingNumberProps {
  value: number
  className?: string
}

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Tachometer-style number: new value slides in from top,
 * old value slides out to bottom.
 */
export function RollingNumber({ value, className }: RollingNumberProps) {
  const [animating, setAnimating] = useState(false)
  const prevRef = useRef(value)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const prev = prevRef.current

  // After each render with a new value, schedule the ref update
  // so `prev` holds the old value during the animation frame.
  useMemo(() => {
    if (value !== prevRef.current) {
      prevRef.current = value
    }
  }, [value])

  useEffect(() => {
    if (prefersReducedMotion || value === prev) return

    // If already animating, don't stack — just let it snap
    if (animating) return

    setAnimating(true)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setAnimating(false), 150)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        overflow: 'hidden',
        verticalAlign: 'baseline',
        height: '1.1em',
        lineHeight: '1.1em',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          transition: animating ? 'transform 150ms ease-out' : 'none',
          transform: animating ? 'translateY(-50%)' : 'translateY(0%)',
        }}
      >
        <span aria-hidden={!animating} style={{ height: '1.1em' }}>
          {value}
        </span>
        <span aria-hidden style={{ height: '1.1em' }}>
          {prev}
        </span>
      </span>
    </span>
  )
}
