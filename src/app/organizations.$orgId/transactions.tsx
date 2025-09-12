import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/organizations/$orgId/transactions")({
  component: RouteComponent
})

function RouteComponent() {
  return <div>Hello "/organizations/$orgId/transactions"!</div>
}
