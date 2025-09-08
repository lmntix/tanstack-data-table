import { createInsertSchema } from "drizzle-zod"
import z from "zod"
import { transactionDetails, transactionHead } from "@/server/db/schema"

export const CreateTransactionSchema = createInsertSchema(transactionHead).omit({
  id: true,
  organizationId: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
  version: true
})

export const UpdateTransactionSchema = z.object({
  id: z.string(), // UUID
  financialYearId: z.string().nullable().optional(), // UUID
  branchId: z.string().nullable().optional(), // UUID
  date: z.coerce.date().nullable().optional(),
  amount: z.number().nullable().optional(),
  narration: z.string().nullable().optional(),
  mode: z.string().nullable().optional(), // Enum string
  voucherMaster: z.string().nullable().optional(), // Enum string
  voucherNo: z.string().nullable().optional()
})

export const DeleteTransactionSchema = z.object({
  id: z.string() // UUID
})

export const GetTransactionByIdSchema = z.object({
  id: z.string() // UUID
})

export const DeleteManyTransactionsSchema = z.object({
  ids: z.array(z.string()) // Array of UUIDs
})

export const createTransactionSchema = z.object({
  financial_years_id: z.number().nullable().optional(),
  branch_id: z.number().nullable().optional(),
  trans_date: z.coerce.date().nullable().optional(),
  trans_amount: z.string(),
  trans_narration: z.string().nullable().optional(),
  mode_of_operation: z.number().nullable().optional(),
  organizationId: z.string()
})

export const updateTransactionSchema = z.object({
  financial_years_id: z.number().nullable().optional(),
  branch_id: z.number().nullable().optional(),
  trans_date: z.coerce.date().nullable().optional(),
  trans_amount: z.string().optional(),
  trans_narration: z.string().nullable().optional(),
  mode_of_operation: z.number().nullable().optional()
})

// Transaction details schemas
export const CreateTransactionDetailsSchema = createInsertSchema(transactionDetails).omit({
  id: true,
  organizationId: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
  version: true
})

export const createTransactionDetailsSchema = z.object({
  transaction_head_id: z.number().nullable().optional(),
  accounts_id: z.number().nullable().optional(),
  sub_accounts_id: z.number().nullable().optional(),
  trans_amount: z.string().nullable().optional(),
  organizationId: z.string()
})
