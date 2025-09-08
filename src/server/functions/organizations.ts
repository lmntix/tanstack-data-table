import { createServerFn } from "@tanstack/react-start"
import { and, eq } from "drizzle-orm"
import db from "@/server/db"
import { tryCatch } from "@/utils/try-catch"
import { organizations, orgMembers } from "../db/schema"
import { authMiddleware } from "./middlewares"

export const getUserOrganizationsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
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
        .innerJoin(
          orgMembers,
          and(eq(organizations.id, orgMembers.organizationId), eq(orgMembers.userId, context.user.id))
        )
    )

    if (result.error) {
      console.error("Error getting organization list for user", result.error)
      return []
    }

    return result.data
  })
