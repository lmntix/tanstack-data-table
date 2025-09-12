import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, Home, ShieldX } from "lucide-react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const unauthorizedSearchSchema = z.object({
  message: z.string().optional()
})

export const Route = createFileRoute("/unauthorized")({
  validateSearch: unauthorizedSearchSchema,
  component: RouteComponent
})

function RouteComponent() {
  const { message } = Route.useSearch()

  const defaultMessage =
    "You don't have permission to access this page. Please contact an administrator if you believe this is an error."

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4 pt-6 text-center">
          <div className="flex justify-center">
            <ShieldX className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="font-semibold text-2xl text-foreground">Access Denied</h1>
            <p className="text-muted-foreground">{message || defaultMessage}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-2 pb-6">
          <Button className="flex items-center gap-2" variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button asChild className="flex items-center gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
