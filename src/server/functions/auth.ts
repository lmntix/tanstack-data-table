import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getWebRequest } from "@tanstack/react-start/server"
import { auth } from "@/lib/auth"

export const assertAuthenticatedFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({ headers: getWebRequest().headers })

  if (!session?.user) {
    throw redirect({
      to: "/login"
    })
  }

  return session.user
})

export const assertUnauthenticatedFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({ headers: getWebRequest().headers })

  if (session?.user) {
    throw redirect({ to: "/dashboard" })
  }
})

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({ headers: getWebRequest().headers })
  return session?.user
})

export const $getUser = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({ headers: getWebRequest().headers })

  return session?.user || null
})
