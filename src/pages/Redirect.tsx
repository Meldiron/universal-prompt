import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, AlertCircle, Check, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { platforms } from '@/lib/ai-platforms'
import { getPromptByShortId } from '@/lib/appwrite'
import { RequestPlatformDialog } from '@/components/RequestPlatformDialog'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'

export function Redirect() {
  const { shortId } = useParams<{ shortId: string }>()
  const [prompt, setPrompt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!shortId) return

    getPromptByShortId(shortId)
      .then((result) => {
        if (result) {
          setPrompt(result)
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [shortId])

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!prompt) return
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const heading = useInView()
  const preview = useInView()
  const grid = useInView()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !prompt) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <h1 className="text-lg font-semibold text-foreground">Link not found</h1>
        <p className="text-sm text-muted-foreground">
          This short link doesn't exist or has expired.
        </p>
        <Button variant="outline" asChild>
          <a href="/">Create a new prompt</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div
        ref={heading.ref}
        className={cn(
          'mb-8 text-center',
          heading.isInView
            ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
            : 'opacity-0',
        )}
      >
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground">Choose your AI</h1>
        <p className="text-sm text-muted-foreground">
          Someone shared a prompt with you. Pick a platform to open it in.
        </p>
      </div>

      {/* Prompt Preview */}
      <div
        ref={preview.ref}
        className={cn(
          'mb-8 rounded-lg border border-border bg-card p-4',
          preview.isInView
            ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
            : 'opacity-0',
        )}
        style={{ animationDelay: '100ms' }}
      >
        <div className="mb-1.5 flex items-center justify-between">
          <p className="font-mono text-xs text-muted-foreground">PROMPT</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-500 animate-scale-bounce" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <p className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">
          {prompt.length > 500 ? prompt.slice(0, 500) + '...' : prompt}
        </p>
      </div>

      {/* Platform Grid */}
      <h2
        className={cn(
          'mb-3 text-sm font-medium text-muted-foreground',
          preview.isInView
            ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
            : 'opacity-0',
        )}
        style={{ animationDelay: '200ms' }}
      >
        Open with one click in your favourite AI:
      </h2>
      <div ref={grid.ref} className="grid gap-2 sm:grid-cols-2">
        {platforms.map((platform, i) => {
          const url = platform.url(prompt)
          return (
            <a
              key={platform.id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group flex min-w-0 items-center gap-3 rounded-lg border border-border bg-card p-4 no-underline transition-all duration-200 hover:border-muted-foreground/30 hover:bg-secondary/50 hover:scale-[1.01] hover:shadow-md',
                grid.isInView
                  ? 'animate-in fade-in zoom-in-95 duration-300 fill-mode-both'
                  : 'opacity-0',
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: `${platform.color}15` }}
              >
                <platform.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-medium text-foreground">{platform.name}</span>
                <p className="text-xs text-muted-foreground">{platform.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
            </a>
          )
        })}
      </div>
      <div
        className={cn(
          'mt-2',
          grid.isInView ? 'animate-in fade-in duration-500 fill-mode-both' : 'opacity-0',
        )}
        style={{ animationDelay: `${platforms.length * 50}ms` }}
      >
        <RequestPlatformDialog />
      </div>

      <div
        className={cn(
          'mt-8 text-center',
          grid.isInView
            ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
            : 'opacity-0',
        )}
        style={{ animationDelay: `${platforms.length * 50 + 100}ms` }}
      >
        <a
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground no-underline"
        >
          Create your own prompt &rarr;
        </a>
      </div>
    </div>
  )
}
