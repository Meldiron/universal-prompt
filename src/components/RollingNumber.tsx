import { useEffect, useRef, useState } from 'react'

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
  const [display, setDisplay] = useState(value)
  const [prev, setPrev] = useState(value)
  const [animating, setAnimating] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (value === display || prefersReducedMotion) {
      // Snap without animating
      if (value !== display) {
        setDisplay(value)
        setPrev(value)
      }
      return
    }

    // If already animating, snap and skip
    if (animating) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setAnimating(false)
      setDisplay(value)
      setPrev(value)
      return
    }

    setPrev(display)
    setDisplay(value)
    setAnimating(true)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setAnimating(false), 150)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

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
          {display}
        </span>
        <span aria-hidden style={{ height: '1.1em' }}>
          {prev}
        </span>
      </span>
    </span>
  )
}
