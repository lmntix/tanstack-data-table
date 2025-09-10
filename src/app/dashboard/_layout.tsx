import { createFileRoute, Outlet } from "@tanstack/react-router"
import Header from "@/components/dashboard/header"
import { assertAuthenticatedFn } from "@/server/functions/auth"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: () => assertAuthenticatedFn()
})

function RouteComponent() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}
