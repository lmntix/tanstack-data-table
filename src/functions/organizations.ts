import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getWebRequest } from "@tanstack/react-start/server"
import { and, eq } from "drizzle-orm"
import z from "zod"
import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { invitations, organizations, orgMembers } from "@/lib/db/schema"
import { tryCatch } from "@/utils/try-catch"
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

export const getUserInvitationsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const result = await tryCatch(db.select().from(invitations).where(eq(invitations.email, context.user.email)))

    if (result.error) {
      console.error("Error getting user invitations", result.error)
      return []
    }

    return result.data
  })

export const getCurrentOrganizationFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((orgId: string) => orgId)
  .handler(async ({ context, data: orgId }) => {
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
          and(
            eq(organizations.id, orgMembers.organizationId),
            eq(orgMembers.userId, context.user.id),
            eq(organizations.id, orgId)
          )
        )
        .limit(1)
    )

    if (result.error) {
      console.error("Error setting active organization", result.error)
      throw redirect({
        to: "/unauthorized",
        search: {
          message: "Unable to access this organization. You may not have permission or the organization may not exist."
        }
      })
    }

    if (result.data.length === 0) {
      throw new Error("Organization not found or access denied")
    }

    return result.data[0]
  })

export const assertIsOrgMemberFn = createServerFn()
  .middleware([authMiddleware])
  .validator(z.object({ orgId: z.string() }))
  .handler(async ({ data }) => {
    const { orgId } = data

    const { validate } = await import("uuid")
    if (!validate(orgId)) {
      throw redirect({
        to: "/unauthorized",
        search: { message: "Invalid organization ID format." }
      })
    }

    const request = getWebRequest()

    const result = await tryCatch(
      auth.api.setActiveOrganization({
        body: { organizationId: orgId },
        headers: request.headers
      })
    )

    if (result.error) {
      console.error("Error setting active organization", result.error)
      throw redirect({
        to: "/unauthorized",
        search: {
          message: "Unable to access this organization. You may not have permission or the organization may not exist."
        }
      })
    }

    return result.data
  })
