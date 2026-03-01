import { useCallback, useRef, useState } from 'react'

interface UseInViewOptions {
  /** Fire once then disconnect (default true) */
  once?: boolean
  /** IntersectionObserver threshold (default 0.1) */
  threshold?: number
  /** IntersectionObserver rootMargin (default "0px") */
  rootMargin?: string
}

export function useInView({
  once = true,
  threshold = 0.1,
  rootMargin = '0px',
}: UseInViewOptions = {}) {
  const [isInView, setIsInView] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Callback ref — fires whenever the element mounts/unmounts,
  // so it works even when the element renders after an async gate.
  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      // Clean up previous observer
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      if (!node) return

      // Respect prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setIsInView(true)
        return
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setIsInView(false)
          }
        },
        { threshold, rootMargin },
      )

      observer.observe(node)
      observerRef.current = observer
    },
    [once, threshold, rootMargin],
  )

  return { ref, isInView }
}
