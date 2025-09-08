import { createMiddleware } from "@tanstack/react-start"
import { getCurrentUserFn } from "./auth"

export const authMiddleware = createMiddleware({ type: "function" }).server(async (ctx) => {
  const user = await getCurrentUserFn()
  if (!user) {
    throw new Error("User not found")
  }
  return ctx.next({
    context: {
      user
    }
  })
})
