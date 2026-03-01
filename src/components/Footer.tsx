export function Footer() {
  return (
    <footer className="border-t border-border py-6">
      <div className="mx-auto max-w-4xl px-4">
        <p className="text-center text-xs text-muted-foreground">
          Prompt links are generated client-side. We never store or read your prompts
          <span className="mx-2 text-border">|</span>
          Short links are stored in Appwrite
        </p>
      </div>
    </footer>
  )
}
