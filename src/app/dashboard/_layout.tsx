import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import Header from "@/app/dashboard/-components/header"
import { authQueryOptions } from "@/server/queries/auth"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true
    })
    if (!user) {
      throw redirect({ to: "/login" })
    }

    // re-return to update type as non-null for child routes
    return { user }
  }
})

function RouteComponent() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}
