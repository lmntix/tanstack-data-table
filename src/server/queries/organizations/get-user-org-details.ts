import { and, eq } from "drizzle-orm"
import { cache } from "react"
import { db } from "@/server/db"
import { organizations, orgMembers, users } from "@/server/db/schema"
import type { UserOrganizationDetails } from "@/types/organization"
import { tryCatch } from "@/utils/try-catch"

export const getUserOrgDetails = cache(
  async (userId: string, organizationId: string): Promise<UserOrganizationDetails | null> => {
    const result = await tryCatch(
      db
        .select({
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
          logo: organizations.logo,
          metadata: organizations.metadata,
          version: organizations.version,
          createdAt: organizations.createdAt,
          createdBy: organizations.createdBy,
          updatedAt: organizations.updatedAt,
          updatedBy: organizations.updatedBy,
          role: orgMembers.role,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            emailVerified: users.emailVerified,
            image: users.image,
            role: users.role,
            banned: users.banned,
            banReason: users.banReason,
            banExpires: users.banExpires,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
          }
        })
        .from(organizations)
        .innerJoin(
          orgMembers,
          and(
            eq(organizations.id, orgMembers.organizationId),
            eq(orgMembers.organizationId, organizationId),
            eq(orgMembers.userId, userId)
          )
        )
        .innerJoin(users, eq(orgMembers.userId, users.id))
        .then((results) => results[0]) // Take the first result
    )

    if (result.error) {
      console.error("Error getting user organization details", result.error)
      return null
    }

    return result.data
  }
)
