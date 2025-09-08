import { count, ne } from "drizzle-orm"
import { cache } from "react"
import { db } from "@/server/db"
import { members } from "@/server/db/schema"
import { tryCatch } from "@/utils/try-catch"

export type ListMembersSchema = {
  page: number
  perPage: number
}

export const listMembers = cache(async (input: ListMembersSchema) => {
  const offset = (input.page - 1) * input.perPage

  const result = await tryCatch(
    db.transaction(async (tx) => {
      const data = await tx.select().from(members).where(ne(members.memberNo, 0)).limit(input.perPage).offset(offset)

      const total = await tx
        .select({
          count: count()
        })
        .from(members)
        .where(ne(members.memberNo, 0))
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total
      }
    })
  )

  if (result.error) {
    console.error("Error getting all members", result.error)
    return { data: [], pageCount: 0 }
  }

  const pageCount = Math.ceil(result.data.total / input.perPage)
  return {
    data: result.data.data,
    pageCount
  }
})
