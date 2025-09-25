import { createFileRoute } from "@tanstack/react-router"
import { auth } from "@/lib/auth" // import your auth instance

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return auth.handler(request)
      },
      POST: async ({ request }) => {
        return auth.handler(request)
      }
    }
  }
})
