import { useState, useEffect, useCallback } from 'react'

type Theme = 'auto' | 'dark' | 'light'

const STORAGE_KEY = 'universal-prompt-theme'

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('auto', 'dark', 'light')
  root.classList.add(theme)
}

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'auto' || stored === 'dark' || stored === 'light') return stored
  } catch {
    // localStorage may not be available
  }
  return 'auto'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  return { theme, setTheme } as const
}
