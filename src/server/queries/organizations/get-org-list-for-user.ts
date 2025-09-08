import { and, eq } from "drizzle-orm"
import { cache } from "react"
import { db } from "@/server/db"
import { organizations, orgMembers } from "@/server/db/schema"
import type { OrgListForUser } from "@/types/organization"
import { tryCatch } from "@/utils/try-catch"

export const getOrgListForUser = cache(async (userId: string): Promise<OrgListForUser[]> => {
  const result = await tryCatch(
    db
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        logo: organizations.logo,
        metadata: organizations.metadata,
        createdAt: organizations.createdAt,
        updatedAt: organizations.updatedAt,
        role: orgMembers.role
      })
      .from(organizations)
      .innerJoin(orgMembers, and(eq(organizations.id, orgMembers.organizationId), eq(orgMembers.userId, userId)))
  )

  if (result.error) {
    console.error("Error getting organization list for user", result.error)
    return []
  }

  return result.data
})
