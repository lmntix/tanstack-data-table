import { and, eq } from "drizzle-orm"
import { cache } from "react"
import { db } from "@/lib/db"
import { invitations, organizations, users } from "@/lib/db/schema"
import { tryCatch } from "@/utils/try-catch"

export const checkIfFirstUser = cache(async (): Promise<boolean> => {
  const result = await tryCatch(db.select().from(users).limit(1))

  if (result.error) {
    console.error("Error checking if first user", result.error)
    return false
  }

  return result.data.length === 0
})

export const checkInvitation = cache(async (email: string): Promise<boolean> => {
  const result = await tryCatch(db.select().from(invitations).where(eq(invitations.email, email)))

  if (result.error) {
    console.error("Error checking invitation", result.error)
    return false
  }

  return result.data.length > 0
})

export const getPendingInvitations = cache(async (email: string) => {
  const result = await tryCatch(
    db
      .select({
        id: invitations.id,
        organizationId: invitations.organizationId,
        email: invitations.email,
        role: invitations.role,
        status: invitations.status,
        expiresAt: invitations.expiresAt,
        inviterId: invitations.inviterId,
        teamId: invitations.teamId,
        // System metadata fields
        version: invitations.version,
        createdAt: invitations.createdAt,
        createdBy: invitations.createdBy,
        updatedAt: invitations.updatedAt,
        updatedBy: invitations.updatedBy,

        // Additional field from join
        organizationName: organizations.name
      })
      .from(invitations)
      .leftJoin(organizations, eq(invitations.organizationId, organizations.id))
      .where(and(eq(invitations.email, email), eq(invitations.status, "pending")))
  )

  if (result.error) {
    console.error("Error getting pending invitations", result.error)
    return []
  }

  return result.data
})

export type PendingInvitations = Awaited<ReturnType<typeof getPendingInvitations>>
