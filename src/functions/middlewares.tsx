import { createMiddleware } from "@tanstack/react-start"
import { getCurrentUserFn } from "./auth"

export const authMiddleware = createMiddleware({ type: "function" }).server(async (ctx) => {
  const session = await getCurrentUserFn()
  if (!session.session || !session.user) {
    throw new Error("User not found")
  }
  return ctx.next({
    context: {
      user: session.user,
      session: session.session
    }
  })
})
