import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { auth } from "@/lib/auth"

export const assertAuthenticatedFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })

  if (!session?.user) {
    throw redirect({
      to: "/login"
    })
  }

  return { user: session.user, session: session.session }
})

export const assertUnauthenticatedFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })

  if (session?.user) {
    throw redirect({ to: "/dashboard" })
  }
})

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return {
    user: session?.user || null,
    session: session?.session || null
  }
})

export const assertIsAdminFn = createServerFn({ method: "GET" }).handler(async () => {
  const { user } = await assertAuthenticatedFn()

  if (user?.role !== "admin") {
    throw redirect({ to: "/unauthorized" })
  }
})
