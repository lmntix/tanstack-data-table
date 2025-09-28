import { createFileRoute } from "@tanstack/react-router"
import DataTableDemo from "./-component"

export const Route = createFileRoute("/test/")({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div>
      <DataTableDemo />
    </div>
  )
}
