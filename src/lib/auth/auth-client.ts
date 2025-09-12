import { adminClient, multiSessionClient, organizationClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { toast } from "sonner"
import { env } from "@/lib/env/client"
import { ac, admin, member, owner } from "./permissions"

export const authClient = createAuthClient({
  baseURL: env.VITE_APP_URL,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 1 * 60
    }
  },
  plugins: [
    organizationClient({
      ac,
      roles: {
        owner,
        admin,
        member
      }
    }),
    multiSessionClient(),
    adminClient()
  ],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.")
      }
    }
  }
})
