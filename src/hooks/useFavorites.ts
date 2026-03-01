import { useState, useCallback } from 'react'

const STORAGE_KEY = 'universal-prompt-favorites'

function getStored(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as string[]
  } catch {
    // ignore
  }
  return []
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(getStored)

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  )

  return { favorites, toggle, isFavorite } as const
}
