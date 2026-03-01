import { Terminal } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2.5 text-foreground no-underline">
          <Terminal className="h-5 w-5" />
          <span className="font-semibold tracking-tight">Universal Prompt</span>
        </a>
        <nav className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground no-underline"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
