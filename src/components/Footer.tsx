import { GridLine } from '@/components/BlueprintGrid'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'

export function Footer() {
  const footer = useInView()

  return (
    <footer>
      <GridLine />
      <div
        ref={footer.ref}
        className={cn(
          'mx-auto max-w-4xl px-4 py-6',
          footer.isInView
            ? 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both'
            : 'opacity-0',
        )}
      >
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Meldiron. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
