import { and, eq } from "drizzle-orm"
import { db } from "@/server/db"
import { transactionDetails, transactionHead } from "@/server/db/schema"

export type DeleteTransactionParams = {
  id: string
  organizationId: string
}

export async function deleteTransaction(params: DeleteTransactionParams) {
  const { id, organizationId } = params

  return await db.transaction(async (tx) => {
    // First, verify the transaction exists and belongs to the organization
    const existingTransaction = await tx
      .select({ id: transactionHead.id })
      .from(transactionHead)
      .where(and(eq(transactionHead.id, id), eq(transactionHead.organizationId, organizationId)))

    if (existingTransaction.length === 0) {
      throw new Error("Transaction not found or access denied")
    }

    // Delete transaction details first (foreign key constraint)
    await tx.delete(transactionDetails).where(eq(transactionDetails.transactionHeadId, id))

    // Delete transaction head
    const deletedTransaction = await tx
      .delete(transactionHead)
      .where(and(eq(transactionHead.id, id), eq(transactionHead.organizationId, organizationId)))
      .returning()

    return deletedTransaction[0]
  })
}
