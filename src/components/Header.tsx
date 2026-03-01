import { Terminal } from 'lucide-react'
import { GridLine } from '@/components/BlueprintGrid'
import { ThemeToggle } from '@/components/ThemeToggle'

export function Header() {
  return (
    <header>
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2.5 text-foreground no-underline">
          <Terminal className="h-5 w-5" />
          <span className="font-semibold tracking-tight">Universal Prompt</span>
        </a>
        <ThemeToggle />
      </div>
      <GridLine />
    </header>
  )
}
