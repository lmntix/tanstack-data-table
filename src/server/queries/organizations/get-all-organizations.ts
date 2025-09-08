import { cache } from "react"
import { db } from "@/server/db"
import { organizations } from "@/server/db/schema"
import { tryCatch } from "@/utils/try-catch"

export const getAllOrganizations = cache(async () => {
  const result = await tryCatch(db.select().from(organizations))

  if (result.error) {
    console.error("Error getting all organizations", result.error)
    return []
  }

  return result.data
})
