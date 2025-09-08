import { and, eq } from "drizzle-orm"
import { cache } from "react"
import { db } from "@/server/db"
import { memberAddress, members } from "@/server/db/schema"
import { tryCatch } from "@/utils/try-catch"

export const getMemberDetails = cache(async (memberId: string, organizationId: string) => {
  const result = await tryCatch(
    db
      .select({
        member: members,
        addressContact: memberAddress
      })
      .from(members)

      .where(and(eq(members.id, memberId), eq(members.organizationId, organizationId)))
      .then((results) => results[0]) // Take the first result
  )

  if (result.error) {
    console.error("Error getting member details", result.error)
    return null
  }

  return {
    ...result.data.member,
    address: result.data.addressContact
  }
})

// Infer the return type using typeof
export type MemberDetailsType = Awaited<ReturnType<typeof getMemberDetails>>
