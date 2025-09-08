import { and, eq } from "drizzle-orm"
import z from "zod"
import { db } from "@/server/db"
import { transactionModeEnum, voucherMasterEnum } from "@/server/db/enums"
import { transactionDetails, transactionHead } from "@/server/db/schema"

export const UpdateTransactionSchema = z.object({
  id: z.string().uuid(),
  financialYearId: z.string().uuid().optional(),
  branchId: z.string().uuid().optional(),
  voucherMaster: z.enum(voucherMasterEnum.enumValues).optional(),
  voucherNo: z.string().optional(),
  date: z.string().optional(),
  amount: z.number().positive().optional(),
  narration: z.string().optional(),
  mode: z.enum(transactionModeEnum.enumValues).optional(),
  updatedBy: z.string().uuid(),
  details: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        accountsId: z.string().uuid(),
        subAccountsId: z.string().uuid(),
        amount: z.number()
      })
    )
    .optional()
})

export type UpdateTransactionParams = z.infer<typeof UpdateTransactionSchema> & {
  organizationId: string
}

export async function updateTransaction(params: UpdateTransactionParams) {
  const { id, organizationId, details, updatedBy, ...updateData } = params

  return await db.transaction(async (tx) => {
    // First, verify the transaction exists and belongs to the organization
    const existingTransaction = await tx
      .select({ id: transactionHead.id, version: transactionHead.version })
      .from(transactionHead)
      .where(and(eq(transactionHead.id, id), eq(transactionHead.organizationId, organizationId)))

    if (existingTransaction.length === 0) {
      throw new Error("Transaction not found or access denied")
    }

    // Update transaction head
    const updatedHead = await tx
      .update(transactionHead)
      .set({
        ...updateData,
        updatedBy,
        updatedAt: new Date()
      })
      .where(and(eq(transactionHead.id, id), eq(transactionHead.organizationId, organizationId)))
      .returning()

    // Update transaction details if provided
    if (details && details.length > 0) {
      // Delete existing details
      await tx.delete(transactionDetails).where(eq(transactionDetails.transactionHeadId, id))

      // Insert new details
      const detailsToInsert = details.map((detail) => ({
        transactionHeadId: id,
        accountsId: detail.accountsId,
        subAccountsId: detail.subAccountsId,
        amount: detail.amount,
        organizationId,
        createdBy: updatedBy,
        updatedBy
      }))

      await tx.insert(transactionDetails).values(detailsToInsert)
    }

    return updatedHead[0]
  })
}
