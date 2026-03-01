import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { flushSync } from 'react-dom'
import {
  Link,
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
import { createShortLink } from '@/lib/appwrite'
import { useFavorites } from '@/hooks/useFavorites'
import { useInView } from '@/hooks/useInView'
import { RequestPlatformDialog } from '@/components/RequestPlatformDialog'
import { ShortLinkDialog } from '@/components/ShortLinkDialog'
import { RollingNumber } from '@/components/RollingNumber'
import { cn } from '@/lib/utils'

export function Home() {
  const [prompt, setPrompt] = useState('')
  const [shortId, setShortId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
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

  const shortUrl = shortId ? `${window.location.origin}/s/${shortId}` : null

  const handleGenerateShortLink = useCallback(async () => {
    if (!prompt.trim()) return
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
  }, [prompt])

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

  // Scroll-entrance refs
  const hero = useInView()
  const chips = useInView()
  const promptSection = useInView()
  const platformGrid = useInView()
  const useCasesHeading = useInView()
  const useCasesRow1 = useInView()
  const useCasesRow2 = useInView()
  const faqHeading = useInView()
  const faqItems = useInView()
  const cta = useInView()

  // Triggers a fade-in entrance every time the platform grid appears
  // (on first scroll-in AND when hasPrompt flips to true).
  // Auto-clears after the animation so view-transitions can take over for reordering.
  const [gridRevealing, setGridRevealing] = useState(false)
  const prevHasPrompt = useRef(false)

  useEffect(() => {
    // Trigger on first scroll-in while prompt is already typed
    if (platformGrid.isInView && hasPrompt && !gridRevealing && !prevHasPrompt.current) {
      setGridRevealing(true)
    }
    prevHasPrompt.current = hasPrompt
  }, [platformGrid.isInView]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Trigger when user starts typing (hasPrompt flips true) while already in view
    if (hasPrompt && platformGrid.isInView) {
      setGridRevealing(true)
    }
  }, [hasPrompt]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!gridRevealing) return
    const id = setTimeout(() => setGridRevealing(false), 800)
    return () => clearTimeout(id)
  }, [gridRevealing])

  const handleToggleFavorite = useCallback(
    (id: string) => {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          flushSync(() => toggleFavorite(id))
        })
      } else {
        toggleFavorite(id)
      }
    },
    [toggleFavorite],
  )

  return (
    <>
      {/* ── Hero ── */}
      <div ref={hero.ref} className="mx-auto max-w-4xl px-4 pt-16 pb-10 text-center">
        <a
          href="https://github.com/meldiron/universal-prompt"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'mb-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 no-underline transition-colors hover:border-muted-foreground/30 hover:bg-secondary',
            hero.isInView
              ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
              : 'opacity-0',
          )}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            Free &amp; open source on GitHub
          </span>
        </a>
        <h1
          className={cn(
            'mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl',
            hero.isInView
              ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
              : 'opacity-0',
          )}
          style={{ animationDelay: '150ms' }}
        >
          One prompt, every AI
        </h1>
        <p
          className={cn(
            'mx-auto max-w-lg text-base text-muted-foreground',
            hero.isInView
              ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
              : 'opacity-0',
          )}
          style={{ animationDelay: '300ms' }}
        >
          Write your prompt once. Get instant deep links to open it in ChatGPT, Claude, Gemini, and{' '}
          {platforms.length - 3}+ other platforms.
        </p>
      </div>

      {/* ── Supported Platforms ── */}
      <div ref={chips.ref} className="mx-auto max-w-3xl px-4 pb-12">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {platforms.map((p, i) => (
            <div
              key={p.id}
              className={cn(
                'flex items-center gap-2 rounded-md border border-border px-3 py-1.5',
                chips.isInView
                  ? 'animate-in fade-in zoom-in-95 duration-300 fill-mode-both'
                  : 'opacity-0',
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <img src={p.icon} alt="" className="icon-adaptive h-3.5 w-3.5" />
              <span className="font-mono text-xs text-muted-foreground">{p.name}</span>
            </div>
          ))}
          <div
            className={cn(
              chips.isInView
                ? 'animate-in fade-in zoom-in-95 duration-300 fill-mode-both'
                : 'opacity-0',
            )}
            style={{ animationDelay: `${platforms.length * 50}ms` }}
          >
            <RequestPlatformDialog variant="chip" />
          </div>
        </div>
      </div>

      <GridLine />

      {/* ── Prompt Input ── */}
      <div
        ref={promptSection.ref}
        className={cn(
          'mx-auto max-w-4xl px-4 py-10 pb-4',
          promptSection.isInView
            ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
            : 'opacity-0',
        )}
      >
        <div className="mb-4 text-center">
          <h2 className="mb-1 text-lg font-bold tracking-tight text-foreground">Your prompt</h2>
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
              <span className="font-mono text-[11px] text-primary">
                ~<RollingNumber value={Math.ceil(prompt.trim().length / 4)} /> tokens
              </span>
              <span className="font-mono text-[11px] text-muted-foreground/50">
                <RollingNumber value={prompt.trim().length} /> chars
              </span>
              <span className="font-mono text-[11px] text-muted-foreground/50">
                <RollingNumber value={prompt.trim() ? prompt.trim().split(/\s+/).length : 0} />{' '}
                words
              </span>
              <div className="flex-1" />

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
            </div>
          </div>

          {error && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-200 mt-3 flex items-center gap-1.5 px-1 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </div>
          )}

          <ShortLinkDialog
            url={shortUrl}
            prompt={prompt.trim()}
            onClose={() => setShortId(null)}
            onUrlChange={(newId) => setShortId(newId)}
          />
        </div>
      </div>

      {/* ── Platform Grid / Empty State ── */}
      <div ref={platformGrid.ref} className="mx-auto max-w-4xl px-4 pb-4 pt-0">
        {hasPrompt ? (
          <div className="space-y-3">
            <div
              className={cn(
                'flex items-center justify-between',
                gridRevealing
                  ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
                  : '',
              )}
            >
              <h2 className="text-sm font-medium text-muted-foreground">
                Open in {platforms.length} platforms
              </h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {sortedPlatforms.map((platform, i) => (
                <div
                  key={platform.id}
                  className={cn(
                    'min-w-0',
                    gridRevealing
                      ? 'animate-in fade-in zoom-in-95 duration-300 fill-mode-both'
                      : '',
                  )}
                  style={{
                    viewTransitionName: gridRevealing ? undefined : `platform-${platform.id}`,
                    ...(gridRevealing ? { animationDelay: `${i * 50}ms` } : {}),
                  }}
                >
                  <PlatformCard
                    platform={platform}
                    prompt={prompt.trim()}
                    isFavorite={isFavorite(platform.id)}
                    onToggleFavorite={() => handleToggleFavorite(platform.id)}
                  />
                </div>
              ))}
            </div>
            <RequestPlatformDialog />
          </div>
        ) : (
          <div
            className={cn(
              platformGrid.isInView
                ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
                : 'opacity-0',
            )}
          >
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Or try one of our examples:
            </p>
            <div className="space-y-2">
              {examples.map((example, i) => (
                <button
                  key={example.label}
                  onClick={() => setPrompt(example.prompt)}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-muted-foreground/25',
                    platformGrid.isInView
                      ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
                      : 'opacity-0',
                  )}
                  style={{ animationDelay: `${150 + i * 150}ms` }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                    <example.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{example.label}</p>
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
      <div
        ref={useCasesHeading.ref}
        className={cn(
          'mx-auto max-w-4xl px-4 pt-20 pb-6 text-center',
          useCasesHeading.isInView
            ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
            : 'opacity-0',
        )}
      >
        <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          What will you build with it?
        </h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          A single prompt link turns any surface into an AI entry point.
        </p>
      </div>

      {/* ── Use Cases grid ── */}
      <section className="mx-auto max-w-4xl py-20 pb-0">
        <div className="relative">
          {/* Vertical divider (center) */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-border/50 sm:block"
          />
          {/* Left rail */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 hidden w-px bg-border/50 lg:block"
          />
          {/* Right rail */}
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 hidden w-px bg-border/50 lg:block"
          />

          {/* Top full-bleed line */}
          <div
            aria-hidden
            className="relative hidden lg:block"
            style={{
              marginLeft: 'calc(-50vw + 50%)',
              marginRight: 'calc(-50vw + 50%)',
              width: '100vw',
            }}
          >
            <div className="h-px w-full bg-border/50" />
            <div className="pointer-events-none relative mx-auto max-w-4xl">
              <span className="absolute -top-[7px] left-0 -translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
                +
              </span>
              <span className="absolute -top-[7px] left-1/2 -translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
                +
              </span>
              <span className="absolute -top-[7px] right-0 translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
                +
              </span>
            </div>
          </div>

          {/* Row 1 */}
          <div ref={useCasesRow1.ref} className="grid grid-cols-1 sm:grid-cols-2">
            {useCases.slice(0, 2).map((uc, i) => (
              <div
                key={uc.title}
                className={cn(
                  'p-6',
                  useCasesRow1.isInView
                    ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
                    : 'opacity-0',
                )}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary">
                  <uc.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-foreground">{uc.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{uc.description}</p>
              </div>
            ))}
          </div>

          {/* Middle full-bleed line */}
          <div
            aria-hidden
            className="relative hidden lg:block"
            style={{
              marginLeft: 'calc(-50vw + 50%)',
              marginRight: 'calc(-50vw + 50%)',
              width: '100vw',
            }}
          >
            <div className="h-px w-full bg-border/50" />
            <div className="pointer-events-none relative mx-auto max-w-4xl">
              <span className="absolute -top-[7px] left-0 -translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
                +
              </span>
              <span className="absolute -top-[7px] left-1/2 -translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
                +
              </span>
              <span className="absolute -top-[7px] right-0 translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
                +
              </span>
            </div>
          </div>

          {/* Row 2 */}
          <div ref={useCasesRow2.ref} className="grid grid-cols-1 sm:grid-cols-2">
            {useCases.slice(2, 4).map((uc, i) => (
              <div
                key={uc.title}
                className={cn(
                  'p-6',
                  useCasesRow2.isInView
                    ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
                    : 'opacity-0',
                )}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary">
                  <uc.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-foreground">{uc.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{uc.description}</p>
              </div>
            ))}
          </div>

          {/* Bottom full-bleed line */}
          <div
            aria-hidden
            className="relative hidden lg:block"
            style={{
              marginLeft: 'calc(-50vw + 50%)',
              marginRight: 'calc(-50vw + 50%)',
              width: '100vw',
            }}
          >
            <div className="h-px w-full bg-border/50" />
            <div className="pointer-events-none relative mx-auto max-w-4xl">
              <span className="absolute -top-[7px] left-0 -translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
                +
              </span>
              <span className="absolute -top-[7px] left-1/2 -translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
                +
              </span>
              <span className="absolute -top-[7px] right-0 translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
                +
              </span>
            </div>
          </div>
        </div>
      </section>

      <GridLine />

      {/* ── FAQ ── */}
      <div
        ref={faqHeading.ref}
        className={cn(
          'mx-auto max-w-4xl px-4 pt-20 pb-20 text-center',
          faqHeading.isInView
            ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
            : 'opacity-0',
        )}
      >
        <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Frequently asked questions
        </h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Everything you need to know about Universal Prompt.
        </p>
      </div>

      <section ref={faqItems.ref} className="mx-auto max-w-4xl pb-4">
        <div className="relative">
          {/* Left rail */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 hidden w-px bg-border/50 lg:block"
          />
          {/* Right rail */}
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 hidden w-px bg-border/50 lg:block"
          />

          {faqs.map((faq, i) => (
            <div
              key={faq.question}
              className={cn(
                faqItems.isInView
                  ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
                  : 'opacity-0',
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Full-bleed horizontal line with pluses */}
              <div
                aria-hidden
                className="relative hidden lg:block"
                style={{
                  marginLeft: 'calc(-50vw + 50%)',
                  marginRight: 'calc(-50vw + 50%)',
                  width: '100vw',
                }}
              >
                <div className="h-px w-full bg-border/50" />
                <div className="pointer-events-none relative mx-auto max-w-4xl">
                  <span className="absolute -top-[7px] left-0 -translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
                    +
                  </span>
                  <span className="absolute -top-[7px] right-0 translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
                    +
                  </span>
                </div>
              </div>
              <div className="px-6 py-5">
                <h3 className="mb-1.5 text-sm font-medium text-foreground">{faq.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </div>
            </div>
          ))}

          {/* Bottom full-bleed line */}
          <div
            aria-hidden
            className="relative hidden lg:block"
            style={{
              marginLeft: 'calc(-50vw + 50%)',
              marginRight: 'calc(-50vw + 50%)',
              width: '100vw',
            }}
          >
            <div className="h-px w-full bg-border/50" />
            <div className="pointer-events-none relative mx-auto max-w-4xl">
              <span className="absolute -top-[7px] left-0 -translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
                +
              </span>
              <span className="absolute -top-[7px] right-0 translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
                +
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        ref={cta.ref}
        className={cn(
          'mx-auto max-w-4xl px-4 py-20 text-center',
          cta.isInView
            ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
            : 'opacity-0',
        )}
      >
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Ready to try it?
        </h2>
        <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
          Write your prompt once and share it everywhere. No sign-up required.
        </p>
        <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Get started
        </Button>
      </section>
    </>
  )
}

const faqs = [
  {
    question: 'Is Universal Prompt free?',
    answer:
      'Yes, completely free and open source. You can self-host it or use our hosted version at no cost.',
  },
  {
    question: 'How do deep links work?',
    answer:
      'Each AI platform supports a URL format that pre-fills the chat input. We encode your prompt into the correct format for each platform so it opens ready to go.',
  },
  {
    question: 'Do you store my prompts?',
    answer:
      'Only if you generate a short link. Short links are stored in an Appwrite database so they can be resolved later. If you just copy a direct platform link, nothing is stored.',
  },
  {
    question: "Can I add a platform that isn't listed?",
    answer:
      'Yes! Use the "Request a platform" button that appears below the platform list. We review requests and add new platforms regularly.',
  },
  {
    question: 'What are short links for?',
    answer:
      'Short links let you share a single URL that opens a picker page. The recipient chooses their preferred AI platform, and the prompt opens there automatically.',
  },
]

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
