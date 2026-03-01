import { useState, useEffect } from 'react'
import { Check, Copy, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AIPlatform } from '@/lib/ai-platforms'

interface PlatformCardProps {
  platform: AIPlatform
  prompt: string
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function PlatformCard({
  platform,
  prompt,
  isFavorite,
  onToggleFavorite,
}: PlatformCardProps) {
  const [copied, setCopied] = useState(false)
  const [bouncing, setBouncing] = useState(false)
  const url = platform.url(prompt)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleToggleFavorite = () => {
    if (!isFavorite) {
      setBouncing(true)
    }
    onToggleFavorite()
  }

  // Clear bounce after animation completes
  useEffect(() => {
    if (!bouncing) return
    const id = setTimeout(() => setBouncing(false), 300)
    return () => clearTimeout(id)
  }, [bouncing])

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-md hover:border-muted-foreground/25">
      {/* Top row: icon, name, star */}
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border"
          style={{ backgroundColor: `${platform.color}10` }}
        >
          <img src={platform.icon} alt="" className="icon-adaptive h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{platform.name}</span>
            {platform.type === 'desktop' && (
              <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                APP
              </span>
            )}
            {platform.type === 'search' && (
              <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                SEARCH
              </span>
            )}
          </div>
          <p className="truncate font-mono text-xs text-muted-foreground">{platform.description}</p>
        </div>

        <button
          onClick={handleToggleFavorite}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="mt-0.5 shrink-0 text-muted-foreground/40 transition-colors hover:text-foreground"
        >
          <Star
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isFavorite ? 'fill-amber-400 text-amber-400' : '',
              bouncing ? 'animate-scale-bounce' : '',
            )}
          />
        </button>
      </div>

      {/* URL row */}
      <div className="mt-3 flex min-w-0 items-center gap-1.5">
        <div className="min-w-0 flex-1 overflow-hidden rounded-md border border-border bg-secondary px-3 py-1.5">
          <p className="truncate font-mono text-[11px] text-muted-foreground/70">{url}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
          title="Copy link"
        >
          {copied ? (
            <Check className="h-3 w-3 text-emerald-500 animate-scale-bounce" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  )
}
