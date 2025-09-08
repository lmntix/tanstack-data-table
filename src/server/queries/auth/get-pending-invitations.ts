import { and, eq } from "drizzle-orm"
import { cache } from "react"
import { db } from "@/server/db"
import { invitations, organizations } from "@/server/db/schema"
import type { Invitation } from "@/server/db/types"
import { tryCatch } from "@/utils/try-catch"

export const getPendingInvitations = cache(
  async (email: string): Promise<(Invitation & { organizationName: string | null })[]> => {
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
  }
)
