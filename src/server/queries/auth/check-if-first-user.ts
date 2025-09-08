import { cache } from "react"
import { db } from "@/server/db"
import { users } from "@/server/db/schema"
import { tryCatch } from "@/utils/try-catch"

export const checkIfFirstUser = cache(async (): Promise<boolean> => {
  const result = await tryCatch(db.select().from(users).limit(1))

  if (result.error) {
    console.error("Error checking if first user", result.error)
    return false
  }

  return result.data.length === 0
})
