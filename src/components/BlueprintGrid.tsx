import type { ReactNode } from 'react'

/**
 * Full-width blueprint grid overlay.
 * Draws vertical rail lines at the max-w-4xl content edges and allows
 * <GridLine /> components between sections for horizontal rules with
 * "+" crosshair markers at every intersection.
 */

export function BlueprintGrid({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full overflow-x-clip">
      {/* Vertical rails — pinned to content container edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mx-auto hidden max-w-4xl lg:block"
      >
        <div className="absolute inset-y-0 left-0 w-px bg-border/50" />
        <div className="absolute inset-y-0 right-0 w-px bg-border/50" />
      </div>

      {/* Content above rails */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

/**
 * A full-bleed horizontal line with crosshairs at the rail intersections.
 */
export function GridLine() {
  return (
    <div aria-hidden className="relative hidden lg:block">
      {/* Full-viewport horizontal line */}
      <div className="h-px w-full bg-border/50" />

      {/* Crosshair container — same max-w as content so it auto-aligns */}
      <div className="pointer-events-none relative mx-auto max-w-4xl">
        {/* Left "+" */}
        <span className="absolute -top-[7px] left-0 -translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
          +
        </span>
        {/* Right "+" */}
        <span className="absolute -top-[7px] right-0 translate-x-1/2 select-none font-mono text-xs leading-none text-muted-foreground/50">
          +
        </span>
      </div>
    </div>
  )
}
