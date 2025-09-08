import z from "zod"
import { db } from "@/server/db"
import { transactionModeEnum, voucherMasterEnum } from "@/server/db/enums"
import { transactionDetails, transactionHead } from "@/server/db/schema"

export const CreateTransactionSchema = z.object({
  financialYearId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
  voucherMaster: z.enum(voucherMasterEnum.enumValues),
  voucherNo: z.string(),
  date: z.string(),
  amount: z.number().positive(),
  narration: z.string().optional(),
  mode: z.enum(transactionModeEnum.enumValues).optional(),
  details: z
    .array(
      z.object({
        accountsId: z.string().uuid(),
        subAccountsId: z.string().uuid(),
        amount: z.number()
      })
    )
    .optional()
})

export type CreateTransactionParams = z.infer<typeof CreateTransactionSchema> & {
  organizationId: string
  createdBy: string
}

export async function createTransaction(params: CreateTransactionParams) {
  const { organizationId, createdBy, details, ...transactionData } = params

  return await db.transaction(async (tx) => {
    // Insert transaction head
    const newTransaction = await tx
      .insert(transactionHead)
      .values({
        ...transactionData,
        organizationId,
        createdBy,
        updatedBy: createdBy
      })
      .returning()

    const transactionId = newTransaction[0].id

    // Insert transaction details if provided
    if (details && details.length > 0) {
      const detailsToInsert = details.map((detail) => ({
        transactionHeadId: transactionId,
        accountsId: detail.accountsId,
        subAccountsId: detail.subAccountsId,
        amount: detail.amount,
        organizationId,
        createdBy,
        updatedBy: createdBy
      }))

      await tx.insert(transactionDetails).values(detailsToInsert)
    }

    return newTransaction[0]
  })
}
