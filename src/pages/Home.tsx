import { useState, useCallback, useMemo } from 'react'
import {
  Link,
  Check,
  Copy,
  Loader2,
  AlertCircle,
  ArrowRight,
  User,
  BookOpen,
  MessageSquare,
  Bug,
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { GridLine } from '@/components/BlueprintGrid'
import { PlatformCard } from '@/components/PlatformCard'
import { platforms } from '@/lib/ai-platforms'
import { createShortLink, isAppwriteConfigured } from '@/lib/appwrite'
import { useFavorites } from '@/hooks/useFavorites'

export function Home() {
  const [prompt, setPrompt] = useState('')
  const [shortId, setShortId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [shortLinkCopied, setShortLinkCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { favorites, toggle: toggleFavorite, isFavorite } = useFavorites()

  const sortedPlatforms = useMemo(
    () =>
      [...platforms].sort((a, b) => {
        const aFav = favorites.includes(a.id) ? 0 : 1
        const bFav = favorites.includes(b.id) ? 0 : 1
        return aFav - bFav
      }),
    [favorites],
  )

  const appwriteReady = isAppwriteConfigured()

  const shortUrl = shortId ? `${window.location.origin}/s/${shortId}` : null

  const handleGenerateShortLink = useCallback(async () => {
    if (!prompt.trim() || !appwriteReady) return
    setIsGenerating(true)
    setError(null)
    try {
      const id = await createShortLink(prompt.trim())
      setShortId(id)
    } catch {
      setError('Failed to generate short link. Check Appwrite config.')
    } finally {
      setIsGenerating(false)
    }
  }, [prompt, appwriteReady])

  const handleCopyShortLink = async () => {
    if (!shortUrl) return
    await navigator.clipboard.writeText(shortUrl)
    setShortLinkCopied(true)
    setTimeout(() => setShortLinkCopied(false), 2000)
  }

  const hasPrompt = prompt.trim().length > 0

  const examples = [
    {
      icon: User,
      label: 'Ask questions about a portfolio',
      prompt: 'Read https://matejbaco.eu/llms-full.txt so I can ask questions about it.',
    },
    {
      icon: BookOpen,
      label: 'Research product documentation',
      prompt: 'Research and explain teams API: https://appwrite.io/docs/products/auth.md',
    },
  ]

  return (
    <>
      {/* ── Hero ── */}
      <div className="mx-auto max-w-4xl px-4 pt-16 pb-10 text-center">
        <a
          href="https://github.com/meldiron/universal-prompt"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 no-underline transition-colors hover:border-muted-foreground/30 hover:bg-secondary"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            Free &amp; open source on GitHub
          </span>
        </a>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          One prompt, every AI
        </h1>
        <p className="mx-auto max-w-lg text-base text-muted-foreground">
          Write your prompt once. Get instant deep links to open it in ChatGPT,
          Claude, Gemini, and {platforms.length - 3}+ other platforms.
        </p>
      </div>

      {/* ── Supported Platforms ── */}
      <div className="mx-auto max-w-4xl px-4 pb-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {platforms.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5"
            >
              <img
                src={p.icon}
                alt=""
                className="icon-adaptive h-3.5 w-3.5"
              />
              <span className="font-mono text-xs text-muted-foreground">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <GridLine />

      {/* ── Prompt Input ── */}
      <div className="mx-auto max-w-4xl px-4 py-10 pb-4">
        <div className="mb-4 text-center">
          <h2 className="mb-1 text-lg font-bold tracking-tight text-foreground">
            Your prompt
          </h2>
          <p className="text-sm text-muted-foreground">
            Write or paste the prompt you want to share across AI platforms.
          </p>
        </div>
        <div className="relative">
          <div className="rounded-xl border border-border bg-card p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            <Textarea
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setPrompt(e.target.value)
                setShortId(null)
                setError(null)
              }}
              className="min-h-[160px] resize-y border-0 bg-transparent font-mono text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
            />
            <div className="flex flex-wrap items-center gap-3 border-t border-border px-3 py-2.5">
              <span className="font-mono text-[11px] text-muted-foreground/50">
                {prompt.trim().length} chars
              </span>
              <span className="font-mono text-[11px] text-muted-foreground/50">
                {prompt.trim() ? prompt.trim().split(/\s+/).length : 0} words
              </span>
              <div className="flex-1" />
              <span className="font-mono text-[11px] text-primary">
                ~{Math.ceil(prompt.trim().length / 4)} tokens
              </span>
              {appwriteReady && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateShortLink}
                  disabled={!hasPrompt || isGenerating}
                  className="h-7 gap-1.5 text-xs"
                >
                  {isGenerating ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Link className="h-3 w-3" />
                  )}
                  Short Link
                </Button>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 px-1">
            {shortUrl && (
              <div className="flex items-center gap-2">
                <code className="rounded border border-border bg-secondary px-2.5 py-1 font-mono text-xs text-foreground">
                  {shortUrl}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCopyShortLink}
                >
                  {shortLinkCopied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Platform Grid / Empty State ── */}
      <div className="mx-auto max-w-4xl px-4 pb-4 pt-0">
        {hasPrompt ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">
                Open in {platforms.length} platforms
              </h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {sortedPlatforms.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  prompt={prompt.trim()}
                  isFavorite={isFavorite(platform.id)}
                  onToggleFavorite={() => toggleFavorite(platform.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Or try one of our examples:
            </p>
            <div className="space-y-2">
              {examples.map((example) => (
                <button
                  key={example.label}
                  onClick={() => setPrompt(example.prompt)}
                  className="group flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-muted-foreground/25"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                    <example.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {example.label}
                    </p>
                    <p className="truncate font-mono text-xs text-muted-foreground/60">
                      {example.prompt}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <GridLine />

      {/* ── Use Cases heading ── */}
      <div className="mx-auto max-w-4xl px-4 pt-14 pb-6 text-center">
        <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          What will you build with it?
        </h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          A single prompt link turns any surface into an AI entry point.
        </p>
      </div>

      {/* ── Use Cases grid ── */}
      <section className="mx-auto max-w-4xl py-10 pb-0">
        <div className="relative grid grid-cols-1 sm:grid-cols-2">
          {/* Vertical divider (center) */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-border/50 sm:block"
          />
          {/* Horizontal divider (center) */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 bg-border/50 sm:block"
          />
          {/* Center "+" */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50 sm:block"
          >
            +
          </span>
          {/* Top center "+" */}
          <span
            aria-hidden
            className="absolute left-1/2 top-0 hidden -translate-x-1/2 -translate-y-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50 sm:block"
          >
            +
          </span>
          {/* Bottom center "+" */}
          <span
            aria-hidden
            className="absolute left-1/2 bottom-0 hidden -translate-x-1/2 translate-y-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50 sm:block"
          >
            +
          </span>
          {/* Left center "+" */}
          <span
            aria-hidden
            className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50 sm:block"
          >
            +
          </span>
          {/* Right center "+" */}
          <span
            aria-hidden
            className="absolute right-0 top-1/2 hidden translate-x-1/2 -translate-y-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50 sm:block"
          >
            +
          </span>

          {useCases.map((uc) => (
            <div key={uc.title} className="p-6">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary">
                <uc.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                {uc.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {uc.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

const useCases = [
  {
    icon: User,
    title: '"Chat with me" portfolio button',
    description:
      'Add a button to your personal site that opens AI pre-loaded with your bio, skills, and projects. Visitors ask about you in their preferred AI.',
  },
  {
    icon: BookOpen,
    title: 'Docs "Ask AI" button',
    description:
      'Embed a link in your documentation that feeds page context to an AI. Users get instant help without leaving your docs.',
  },
  {
    icon: MessageSquare,
    title: 'Product support chat',
    description:
      'Pre-prompt an AI with your product info, pricing, and FAQs. Drop the link on your landing page as a support entry point.',
  },
  {
    icon: Bug,
    title: 'Bug report assistant',
    description:
      'Include a prompt link in your GitHub issue template. Contributors get AI pre-loaded with your stack, common errors, and debug steps.',
  },
]
