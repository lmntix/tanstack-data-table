import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { Logo } from "@/components/logo"
import ThemeToggle from "@/components/theme-toggle"
import { assertUnauthenticatedFn } from "@/server/functions/auth"

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: () => assertUnauthenticatedFn()
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header with logo and theme toggle */}
      <div className="flex items-center justify-between p-4 md:p-6">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <Logo showTitle className="text-sm md:text-base" width={24} height={24} titlePosition="right" />
        </Link>
        <ThemeToggle />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 items-start justify-center px-6 pt-8 pb-6 md:px-10 md:pt-16 md:pb-10">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
