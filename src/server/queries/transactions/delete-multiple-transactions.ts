import { and, eq, inArray } from "drizzle-orm"
import { db } from "@/server/db"
import { transactionDetails, transactionHead } from "@/server/db/schema"

export type DeleteMultipleTransactionsParams = {
  ids: string[]
  organizationId: string
}

export async function deleteMultipleTransactions(params: DeleteMultipleTransactionsParams) {
  const { ids, organizationId } = params

  if (ids.length === 0) {
    return []
  }

  return await db.transaction(async (tx) => {
    // First, verify all transactions exist and belong to the organization
    const existingTransactions = await tx
      .select({ id: transactionHead.id })
      .from(transactionHead)
      .where(and(inArray(transactionHead.id, ids), eq(transactionHead.organizationId, organizationId)))

    const existingIds = existingTransactions.map((t) => t.id)
    const notFoundIds = ids.filter((id) => !existingIds.includes(id))

    if (notFoundIds.length > 0) {
      throw new Error(`Transactions not found or access denied: ${notFoundIds.join(", ")}`)
    }

    // Delete transaction details first (foreign key constraint)
    await tx.delete(transactionDetails).where(inArray(transactionDetails.transactionHeadId, existingIds))

    // Delete transaction heads
    const deletedTransactions = await tx
      .delete(transactionHead)
      .where(and(inArray(transactionHead.id, existingIds), eq(transactionHead.organizationId, organizationId)))
      .returning()

    return deletedTransactions
  })
}
