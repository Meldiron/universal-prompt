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
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          title={opt.label}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-sm transition-colors',
            theme === opt.value
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <opt.icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  )
}
