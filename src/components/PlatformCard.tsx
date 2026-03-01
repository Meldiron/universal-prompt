import { useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AIPlatform } from '@/lib/ai-platforms'

interface PlatformCardProps {
  platform: AIPlatform
  prompt: string
}

export function PlatformCard({ platform, prompt }: PlatformCardProps) {
  const [copied, setCopied] = useState(false)
  const url = platform.url(prompt)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpen = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="group relative flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-muted-foreground/25 hover:bg-card/80">
      <button
        onClick={handleOpen}
        className="flex flex-1 items-center gap-4 bg-transparent text-left"
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border"
          style={{ backgroundColor: `${platform.color}10` }}
        >
          <img
            src={platform.icon}
            alt=""
            className="h-5 w-5"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
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
          <p className="truncate font-mono text-xs text-muted-foreground">
            {platform.description}
          </p>
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
          title="Copy link"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={handleOpen}
          title="Open in new tab"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
