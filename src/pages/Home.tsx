import { useState, useCallback } from 'react'
import {
  Link,
  Check,
  Copy,
  Loader2,
  AlertCircle,
  User,
  BookOpen,
  MessageSquare,
  GraduationCap,
  Megaphone,
  Bug,
  FileCode,
  Briefcase,
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PlatformCard } from '@/components/PlatformCard'
import { platforms } from '@/lib/ai-platforms'
import { createShortLink, isAppwriteConfigured } from '@/lib/appwrite'

export function Home() {
  const [prompt, setPrompt] = useState('')
  const [shortId, setShortId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [shortLinkCopied, setShortLinkCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    'Explain the difference between REST and GraphQL with code examples',
    'Write a bash script that monitors disk usage and sends alerts',
    'Review this architecture: microservices vs monolith for a startup MVP',
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <div className="mb-10 text-center">
        <Dialog>
          <DialogTrigger asChild>
            <button className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-1 transition-colors hover:border-muted-foreground/30 hover:bg-secondary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {platforms.length} platforms supported
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Supported platforms</DialogTitle>
            </DialogHeader>
            <div className="mt-2 space-y-1">
              {platforms.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border"
                    style={{ backgroundColor: `${p.color}10` }}
                  >
                    <img
                      src={p.icon}
                      alt=""
                      className="h-4 w-4"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {p.description}
                    </p>
                  </div>
                  {p.type !== 'web' && (
                    <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {p.type === 'desktop' ? 'APP' : 'SEARCH'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          One prompt, every AI
        </h1>
        <p className="mx-auto max-w-lg text-base text-muted-foreground">
          Write your prompt once. Get instant deep links to open it in ChatGPT,
          Claude, Gemini, and {platforms.length - 3}+ other platforms.
        </p>
      </div>

      {/* Prompt Input */}
      <div className="mb-8">
        <Textarea
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setPrompt(e.target.value)
            setShortId(null)
            setError(null)
          }}
          className="min-h-[140px] resize-y bg-card font-mono text-sm placeholder:text-muted-foreground/50"
        />

        {/* Short Link Section */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {appwriteReady && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateShortLink}
              disabled={!hasPrompt || isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Link className="h-3.5 w-3.5" />
              )}
              Generate Short Link
            </Button>
          )}

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

          {!appwriteReady && (
            <p className="text-xs text-muted-foreground">
              Short links disabled &mdash; configure Appwrite env vars to enable.
            </p>
          )}
        </div>
      </div>

      {/* Platform Grid */}
      {hasPrompt ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Open in {platforms.length} platforms
            </h2>
            <span className="font-mono text-xs text-muted-foreground/60">
              {prompt.trim().length} chars
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {platforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                prompt={prompt.trim()}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Example Prompts */}
          <div className="rounded-lg border border-dashed border-border p-6">
            <h3 className="mb-4 text-center text-sm font-medium text-muted-foreground">
              Try an example prompt
            </h3>
            <div className="mx-auto max-w-xl space-y-2">
              {examples.map((example) => (
                <button
                  key={example}
                  onClick={() => setPrompt(example)}
                  className="w-full rounded-md border border-border bg-card px-4 py-2.5 text-left font-mono text-xs text-muted-foreground transition-colors hover:border-muted-foreground/30 hover:text-foreground"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Supported Platforms */}
          <div className="rounded-lg border border-border p-6">
            <h3 className="mb-4 text-center text-sm font-medium text-muted-foreground">
              Supported platforms
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {platforms.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5"
                >
                  <img
                    src={p.icon}
                    alt=""
                    className="h-3.5 w-3.5"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  <span className="font-mono text-xs text-muted-foreground">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Use Cases Section */}
      <section className="mt-20">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            What will you build with it?
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            A single prompt link turns any surface into an AI entry point.
            Here are some ideas.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary">
                <uc.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                {uc.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {uc.description}
              </p>
              {uc.example && (
                <code className="mt-3 block truncate rounded border border-border bg-secondary px-2 py-1 font-mono text-[10px] text-muted-foreground/70">
                  {uc.example}
                </code>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const useCases = [
  {
    icon: User,
    title: '"Chat with me" portfolio button',
    description:
      'Add a button to your personal site that opens AI pre-loaded with your bio, skills, and projects. Visitors can ask questions about you in their preferred AI.',
    example: 'You are a helpful assistant for Jane, a full-stack developer...',
  },
  {
    icon: BookOpen,
    title: 'Docs "Ask AI" button',
    description:
      'Embed a link in your documentation that feeds the current page context to an AI. Users get instant help without leaving your docs.',
    example: 'Here is the API reference for /users endpoint. Help me...',
  },
  {
    icon: MessageSquare,
    title: 'Product support chat',
    description:
      'Create a pre-prompted link that gives AI context about your product, pricing, and FAQs. Drop it on your landing page as a "Chat with AI about us" button.',
    example: 'You are a support agent for Acme SaaS. Here are the FAQs...',
  },
  {
    icon: GraduationCap,
    title: 'Interactive course materials',
    description:
      'Teachers and course creators can share prompt links that set up AI as a tutor for a specific topic, chapter, or assignment.',
    example: 'You are a tutor helping students understand binary trees...',
  },
  {
    icon: Bug,
    title: 'Bug report helper',
    description:
      'Include a link in your GitHub issue template that pre-fills AI with your project setup, common errors, and debugging steps.',
    example: 'Help me debug this issue in a Next.js 14 app using Prisma...',
  },
  {
    icon: Megaphone,
    title: 'Social media sharing',
    description:
      'Share a prompt on Twitter, Reddit, or Discord. Your followers pick their favorite AI and get the exact same starting prompt.',
    example: 'Compare Rust vs Go for building a CLI tool, covering...',
  },
  {
    icon: FileCode,
    title: 'Code review prompts',
    description:
      'Paste a code snippet into a prompt link and share it with your team. Everyone can run the same review prompt in their AI of choice.',
    example: 'Review this React component for performance issues...',
  },
  {
    icon: Briefcase,
    title: 'AI-powered job applications',
    description:
      'Recruiters can share a prompt link that pre-loads a job description. Candidates open it to get interview prep, salary insights, or cover letter drafts.',
    example: 'Here is a Senior Engineer role at Acme. Help me prepare...',
  },
]
