import { createInsertSchema } from "drizzle-zod"
import z from "zod"
import { savingAccounts } from "@/server/db/schema"

export const CreateSavingsAccountSchema = createInsertSchema(savingAccounts).omit({
  id: true,
  organizationId: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
  version: true
})

export const UpdateSavingsAccountSchema = z.object({
  id: z.number(),
  savingPlanId: z.number().optional(),
  membersId: z.number().optional(),
  interestRate: z.string().optional(),
  ledgerFolioNo: z.string().optional(),
  accountRemarks: z.string().optional(),
  approvalRemarks: z.string().optional(),
  tdsApply: z.boolean().optional(),
  tdsExemptionId: z.number().optional(),
  status: z.number().optional(),
  closeDate: z.coerce.date().optional()
})

export const DeleteSavingsAccountSchema = z.object({
  id: z.number()
})

export const GetSavingsAccountByIdSchema = z.object({
  id: z.number()
})

export const createSavingsAccountSchema = z.object({
  subAccountsId: z.number(),
  savingPlanId: z.number(),
  membersId: z.number(),
  openDate: z.coerce.date(),
  interestRate: z.string(),
  ledgerFolioNo: z.string(),
  accountRemarks: z.string(),
  approvalRemarks: z.string(),
  tdsApply: z.boolean(),
  tdsExemptionId: z.number().default(0),
  status: z.number(),
  closeDate: z.coerce.date(),
  organizationId: z.string()
})

export const updateSavingsAccountSchema = z.object({
  savingPlanId: z.number().optional(),
  membersId: z.number().optional(),
  interestRate: z.string().optional(),
  ledgerFolioNo: z.string().optional(),
  accountRemarks: z.string().optional(),
  approvalRemarks: z.string().optional(),
  tdsApply: z.boolean().optional(),
  tdsExemptionId: z.number().optional(),
  status: z.number().optional(),
  closeDate: z.coerce.date().optional()
})
