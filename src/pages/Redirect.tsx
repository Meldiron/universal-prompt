import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { platforms } from '@/lib/ai-platforms'
import { getPromptByShortId } from '@/lib/appwrite'
import { RequestPlatformDialog } from '@/components/RequestPlatformDialog'

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
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
          Choose your AI
        </h1>
        <p className="text-sm text-muted-foreground">
          Someone shared a prompt with you. Pick a platform to open it in.
        </p>
      </div>

      {/* Prompt Preview */}
      <div className="mb-8 rounded-lg border border-border bg-card p-4">
        <p className="mb-1.5 font-mono text-xs text-muted-foreground">PROMPT</p>
        <p className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">
          {prompt.length > 500 ? prompt.slice(0, 500) + '...' : prompt}
        </p>
      </div>

      {/* Platform Grid */}
      <div className="grid gap-2 sm:grid-cols-2">
        {platforms.map((platform) => {
          const url = platform.url(prompt)
          return (
            <a
              key={platform.id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 no-underline transition-colors hover:border-muted-foreground/30"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: `${platform.color}15` }}
              >
                <img
                  src={platform.icon}
                  alt={platform.name}
                  className="icon-adaptive h-5 w-5"
                />
              </div>
              <div>
                <span className="font-medium text-foreground">{platform.name}</span>
                <p className="text-xs text-muted-foreground">{platform.description}</p>
              </div>
            </a>
          )
        })}
      </div>
      <div className="mt-2">
        <RequestPlatformDialog />
      </div>

      <div className="mt-8 text-center">
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
