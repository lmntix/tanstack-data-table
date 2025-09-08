import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router"
import { Logo } from "@/components/logo"
import ThemeToggle from "@/components/theme-toggle"
import { authQueryOptions } from "@/server/queries/auth"

const HOME_PATH = "/"

const QUOTE = {
  quote:
    "Financial fitness is not a pipe dream or a state of mind, it's a reality if you are willing to pursue it and embrace it.",
  author: "N. R. Narayana Murthy"
}

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
    <div className="flex h-screen w-full">
      <div className="-translate-x-1/2 absolute top-10 left-1/2 mx-auto flex transform lg:hidden">
        <Link to={HOME_PATH} className="z-10 flex h-10 flex-col items-center justify-center gap-2">
          <Logo showTitle={true} />
        </Link>
      </div>
      <div className="relative hidden h-full w-[50%] flex-col justify-between overflow-hidden bg-card p-10 lg:flex">
        <Link to={HOME_PATH} className="z-10 flex h-10 w-10 items-center gap-1">
          <Logo showTitle={true} />
        </Link>

        <div className="z-10 flex flex-col items-start gap-2">
          <p className="font-normal text-base text-primary">{QUOTE.quote}</p>
          <p className="font-normal text-base text-primary/60">-{QUOTE.author}</p>
        </div>
        <div className="base-grid absolute top-0 left-0 z-0 h-full w-full opacity-40" />
      </div>
      <div className="flex h-full w-full flex-col border-primary/5 border-l bg-card lg:w-[50%]">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-end gap-2">
            <ThemeToggle />
          </div>
          <div className="flex flex-1 items-center justify-center pt-20">
            <div className="w-full max-w-xs">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
