import { eq, max } from "drizzle-orm"
import { cache } from "react"
import { db } from "@/server/db"
import { members } from "@/server/db/schema"
import { tryCatch } from "@/utils/try-catch"

export const getNextMemberIdForOrg = cache(async (organizationId: string): Promise<number> => {
  const result = await tryCatch(
    db
      .select({
        maxMemberId: max(members.memberNo)
      })
      .from(members)
      .where(eq(members.organizationId, organizationId))
  )

  if (result.error) {
    console.error("Error getting next member ID", result.error)
    return 1 // Start with 1 if there's an error
  }

  const maxMemberId = result.data[0]?.maxMemberId
  return maxMemberId ? maxMemberId + 1 : 1
})
