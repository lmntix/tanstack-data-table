export function LandingFooter() {
  return (
    <footer className="mt-10 border-t">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-muted-foreground text-sm">©2025 Finex. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-muted-foreground text-sm">A project by </span>
            <a
              className="flex items-center space-x-1 transition-opacity hover:opacity-70"
              href="mailto:lmntixdev@gmail.com"
            >
              <span className="hidden text-sm sm:inline">lmntix</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
