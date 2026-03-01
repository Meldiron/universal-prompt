import { useState } from 'react'
import { Loader2, Check, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { submitPlatformRequest } from '@/lib/appwrite'

interface RequestPlatformDialogProps {
  variant?: 'default' | 'chip'
}

export function RequestPlatformDialog({ variant = 'default' }: RequestPlatformDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = name.trim().length > 0 && url.trim().length > 0

  const handleSubmit = async () => {
    if (!canSubmit) return
    setIsSubmitting(true)
    setError(null)
    try {
      await submitPlatformRequest(name.trim(), url.trim())
      setSubmitted(true)
      setTimeout(() => {
        setOpen(false)
        setSubmitted(false)
        setName('')
        setUrl('')
      }, 1500)
    } catch {
      setError('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) {
          setName('')
          setUrl('')
          setError(null)
          setSubmitted(false)
        }
      }}
    >
      {variant === 'chip' ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5 transition-colors hover:border-muted-foreground/40 hover:text-foreground"
        >
          <Plus className="h-3 w-3" />
          <span className="font-mono text-xs text-muted-foreground">Missing some?</span>
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:border-muted-foreground/40 hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          Request a platform
        </button>
      )}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request a platform</DialogTitle>
          <DialogDescription>Suggest an AI platform you'd like us to add.</DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-2 py-6 animate-in fade-in zoom-in-75 duration-300">
            <Check className="h-8 w-8 text-emerald-500 animate-scale-bounce" />
            <p className="text-sm font-medium text-foreground">Request submitted!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Platform name</label>
              <Input
                placeholder="e.g. Mistral Chat"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">URL</label>
              <Input
                placeholder="e.g. https://chat.mistral.ai"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button className="w-full" onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit request'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
