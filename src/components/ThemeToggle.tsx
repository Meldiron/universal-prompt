import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

const options = [
  { value: 'auto' as const, icon: Monitor, label: 'Auto' },
  { value: 'dark' as const, icon: Moon, label: 'Dark' },
  { value: 'light' as const, icon: Sun, label: 'Light' },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center rounded-md border border-border p-0.5">
      {options.map((opt) => {
        const isActive = theme === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            title={opt.label}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-sm transition-all duration-200',
              isActive
                ? 'bg-secondary text-foreground scale-110'
                : 'text-muted-foreground hover:text-foreground scale-100',
            )}
          >
            <opt.icon
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-200',
                isActive ? 'rotate-0' : '-rotate-12',
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
