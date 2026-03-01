import { useState } from 'react'
import { Check, Copy, ExternalLink, Loader2, Pencil, Smartphone, ScanLine } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createCustomShortLink } from '@/lib/appwrite'

interface ShortLinkDialogProps {
  url: string | null
  prompt: string
  onClose: () => void
  onUrlChange: (newShortId: string) => void
}

const SLUG_REGEX = /^[a-zA-Z0-9_-]+$/

export function ShortLinkDialog({ url, prompt, onClose, onUrlChange }: ShortLinkDialogProps) {
  const [copied, setCopied] = useState(false)
  const [customSlug, setCustomSlug] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)

  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/s/` : '/s/'

  const handleCopy = async () => {
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const validateSlug = (slug: string): string | null => {
    if (slug.length === 0) return 'Slug cannot be empty'
    if (slug.length > 32) return 'Max 32 characters'
    if (!SLUG_REGEX.test(slug)) return 'Only letters, numbers, hyphens, and underscores'
    return null
  }

  const handleSaveCustomSlug = async () => {
    const error = validateSlug(customSlug)
    if (error) {
      setSlugError(error)
      return
    }
    setIsSaving(true)
    setSlugError(null)
    try {
      await createCustomShortLink(prompt, customSlug)
      onUrlChange(customSlug)
      setIsEditing(false)
      setCustomSlug('')
    } catch {
      setSlugError('Slug already taken or save failed. Try another.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog
      open={!!url}
      onOpenChange={(v) => {
        if (!v) {
          onClose()
          setIsEditing(false)
          setCustomSlug('')
          setSlugError(null)
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Short link created</DialogTitle>
          <DialogDescription>
            Share this link with anyone to let them open the prompt in their
            preferred AI.
          </DialogDescription>
        </DialogHeader>

        <div className="min-w-0 space-y-5">
          {/* URL display / Custom URL editor */}
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex min-w-0 items-center gap-1.5">
                <span className="min-w-0 shrink truncate font-mono text-xs text-muted-foreground">
                  {baseUrl}
                </span>
                <Input
                  placeholder="custom-path"
                  value={customSlug}
                  onChange={(e) => {
                    setCustomSlug(e.target.value)
                    setSlugError(null)
                  }}
                  className="h-8 font-mono text-xs"
                  maxLength={32}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] text-muted-foreground/50">
                  {customSlug.length}/32 characters
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      setIsEditing(false)
                      setCustomSlug('')
                      setSlugError(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleSaveCustomSlug}
                    disabled={!customSlug.trim() || isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
              </div>
              {slugError && (
                <p className="animate-in fade-in slide-in-from-left-2 duration-200 text-xs text-destructive">{slugError}</p>
              )}
            </div>
          ) : (
            <>
            <div className="flex min-w-0 items-center gap-2">
              <div className="min-w-0 flex-1 overflow-hidden rounded-md border border-border bg-secondary px-3 py-2">
                <p className="truncate font-mono text-sm text-foreground">
                  {url}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const currentSlug = url ? url.split('/s/')[1] || '' : ''
                setCustomSlug(currentSlug)
                setIsEditing(true)
              }}
              className="-mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-2 text-xs text-muted-foreground transition-colors hover:border-muted-foreground/40 hover:text-foreground"
            >
              <Pencil className="h-3 w-3" />
              Customize URL
            </button>
            </>
          )}

          {/* QR code + scan prompt */}
          <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4 sm:flex-row">
            <div className="flex shrink-0 items-center justify-center">
              <div className="rounded-lg bg-white p-2.5">
                <QRCodeSVG
                  value={url || ''}
                  size={120}
                  level="M"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Scan with phone
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Point your camera to open on mobile
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground/50">
                <ScanLine className="h-3 w-3" />
                <span className="font-mono text-[10px]">Ready to scan</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex min-w-0 gap-2">
            <Button className="min-w-0 flex-1 gap-2" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 animate-scale-bounce" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? 'Copied!' : 'Copy link'}
            </Button>
            <Button variant="outline" className="min-w-0 flex-1 gap-2" asChild>
              <a href={url || ''} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Open link
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
