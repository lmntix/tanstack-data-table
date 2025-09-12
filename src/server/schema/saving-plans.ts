import { createInsertSchema } from "drizzle-zod"
import z from "zod"
import { savingPlans } from "@/lib/db/schema"

export const CreateSavingPlanSchema = createInsertSchema(savingPlans).omit({
  id: true,
  organizationId: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
  version: true
})

export const DeleteSavingPlanSchema = z.object({
  id: z.number()
})

export const GetSavingPlanByIdSchema = z.object({
  id: z.number()
})

export const createSavingPlanSchema = z.object({
  name: z.string(),
  type: z.coerce.number(),
  status: z.coerce.number(),
  minBalance: z.coerce.number(),
  maxWithdrawal: z.coerce.number(),
  minWithdrawal: z.coerce.number().optional(),
  maxDeposit: z.coerce.number(),
  minDeposit: z.coerce.number().optional(),
  accountsId: z.number(),
  organizationId: z.string()
})

export const updateSavingPlanSchema = z.object({
  name: z.string().optional(),
  type: z.coerce.number().optional(),
  status: z.coerce.number().optional(),
  minBalance: z.coerce.number().optional(),
  maxWithdrawal: z.coerce.number().optional(),
  minWithdrawal: z.coerce.number().optional(),
  maxDeposit: z.coerce.number().optional(),
  minDeposit: z.coerce.number().optional()
})
