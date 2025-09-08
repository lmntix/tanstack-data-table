import { eq } from "drizzle-orm"
import { cache } from "react"
import { db } from "@/server/db"
import { invitations } from "@/server/db/schema"
import { tryCatch } from "@/utils/try-catch"

export const checkInvitation = cache(async (email: string): Promise<boolean> => {
  const result = await tryCatch(db.select().from(invitations).where(eq(invitations.email, email)))

  if (result.error) {
    console.error("Error checking invitation", result.error)
    return false
  }

  return result.data.length > 0
})
