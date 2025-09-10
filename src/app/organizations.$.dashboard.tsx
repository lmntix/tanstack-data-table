import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/organizations/$/dashboard")({
  component: RouteComponent
})

function RouteComponent() {
  return <div>Hello "/organizations/$slug/dashboard"!</div>
}
