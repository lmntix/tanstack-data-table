import type { InferInsertModel } from "drizzle-orm"
import { and, eq } from "drizzle-orm"
import { db } from "../db"
import { accounts, savingPlans } from "../db/schema"

// Saving Plans functions

type ListSavingPlansParams = {
  organizationId: string
}

export async function listSavingPlans({ organizationId }: ListSavingPlansParams) {
  const result = await db
    .select({
      id: savingPlans.id,
      accountsId: savingPlans.accountsId,
      name: savingPlans.name,
      minBalance: savingPlans.minBalance,
      maxWithdrawal: savingPlans.maxWithdrawal,
      minWithdrawal: savingPlans.minWithdrawal,
      maxDeposit: savingPlans.maxDeposit,
      minDeposit: savingPlans.minDeposit,
      interestCalcFrequency: savingPlans.interestCalcFrequency,
      isActive: savingPlans.isActive,
      organizationId: savingPlans.organizationId,
      createdAt: savingPlans.createdAt,
      updatedAt: savingPlans.updatedAt,
      accountName: accounts.name
    })
    .from(savingPlans)
    .leftJoin(accounts, eq(savingPlans.accountsId, accounts.id))
    .where(eq(savingPlans.organizationId, organizationId))

  return result
}

type GetSavingPlanParams = {
  id: string
  organizationId: string
}

export async function getSavingPlanById({ id, organizationId }: GetSavingPlanParams) {
  const result = await db
    .select({
      id: savingPlans.id,
      accountsId: savingPlans.accountsId,
      name: savingPlans.name,
      minBalance: savingPlans.minBalance,
      maxWithdrawal: savingPlans.maxWithdrawal,
      minWithdrawal: savingPlans.minWithdrawal,
      maxDeposit: savingPlans.maxDeposit,
      minDeposit: savingPlans.minDeposit,
      interestCalcFrequency: savingPlans.interestCalcFrequency,
      isActive: savingPlans.isActive,
      organizationId: savingPlans.organizationId,
      createdAt: savingPlans.createdAt,
      updatedAt: savingPlans.updatedAt,
      accountName: accounts.name
    })
    .from(savingPlans)
    .leftJoin(accounts, eq(savingPlans.accountsId, accounts.id))
    .where(and(eq(savingPlans.id, id), eq(savingPlans.organizationId, organizationId)))
    .limit(1)

  return result[0] || null
}

type CreateSavingPlanParams = {
  data: InferInsertModel<typeof savingPlans>
  organizationId: string
}

export async function createSavingPlan({ data, organizationId }: CreateSavingPlanParams) {
  const planData = { ...data, organizationId }
  const result = await db.insert(savingPlans).values(planData).returning()

  return result[0]
}

type UpdateSavingPlanParams = {
  id: string
  data: Partial<InferInsertModel<typeof savingPlans>>
  organizationId: string
}

export async function updateSavingPlan({ id, data, organizationId }: UpdateSavingPlanParams) {
  const result = await db
    .update(savingPlans)
    .set(data)
    .where(and(eq(savingPlans.id, id), eq(savingPlans.organizationId, organizationId)))
    .returning()

  return result[0] || null
}

type DeleteSavingPlanParams = {
  id: string
  organizationId: string
}

export async function deleteSavingPlan({ id, organizationId }: DeleteSavingPlanParams) {
  const result = await db
    .delete(savingPlans)
    .where(and(eq(savingPlans.id, id), eq(savingPlans.organizationId, organizationId)))
    .returning()

  return result[0] || null
}
