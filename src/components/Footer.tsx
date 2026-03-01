import { GridLine } from '@/components/BlueprintGrid'

export function Footer() {
  return (
    <footer>
      <GridLine />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Meldiron. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
