import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router"
import { Logo } from "@/components/logo"
import ThemeToggle from "@/components/theme-toggle"
import { authQueryOptions } from "@/lib/auth/queries"

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const REDIRECT_URL = "/dashboard"

    const user = await context.queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true
    })
    if (user) {
      throw redirect({
        to: REDIRECT_URL
      })
    }

    return {
      redirectUrl: REDIRECT_URL
    }
  }
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
