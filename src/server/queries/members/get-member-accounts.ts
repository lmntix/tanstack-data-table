import { and, eq } from "drizzle-orm"
import { db } from "@/server/db"
import { members } from "@/server/db/schema"
import { tryCatch } from "@/utils/try-catch"

export async function getMemberAccounts(memberId: string, organizationId: string) {
  const result = await tryCatch(
    db
      .select({
        accounts_id: viewMembersBal.accounts_id,
        sub_accounts_id: viewMembersBal.sub_accounts_id,
        members_id: viewMembersBal.members_id,
        balance: viewMembersBal.balance
      })
      .from(viewMembersBal)
      .innerJoin(members, eq(viewMembersBal.members_id, members.id))
      .where(and(eq(members.id, memberId), eq(members.organizationId, organizationId)))
  )

  if (result.error) {
    console.error("Error getting member accounts", result.error)
    return null
  }

  return result.data
}
