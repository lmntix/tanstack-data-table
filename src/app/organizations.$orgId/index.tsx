import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/organizations/$orgId/")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    return redirect({ to: "/organizations/$orgId/dashboard", params: { orgId: params.orgId } })
  }
})

function RouteComponent() {
  return null
}
