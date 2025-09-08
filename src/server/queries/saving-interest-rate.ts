import type { InferInsertModel } from "drizzle-orm"
import { and, eq } from "drizzle-orm"
import { db } from "../db"
import { savingInterestRate, savingPlans } from "../db/schema"

type ListSavingInterestRatesParams = {
  organizationId: string
}

export async function listSavingInterestRates({ organizationId }: ListSavingInterestRatesParams) {
  const result = await db
    .select({
      id: savingInterestRate.id,
      savingPlanId: savingInterestRate.savingPlanId,
      intRate: savingInterestRate.intRate,
      endDate: savingInterestRate.endDate,
      isActive: savingInterestRate.isActive,
      organizationId: savingInterestRate.organizationId,
      planName: savingPlans.name
    })
    .from(savingInterestRate)
    .leftJoin(savingPlans, eq(savingInterestRate.savingPlanId, savingPlans.id))
    .where(eq(savingInterestRate.organizationId, organizationId))

  return result
}

type GetSavingInterestRateParams = {
  id: string
  organizationId: string
}

export async function getSavingInterestRateById({ id, organizationId }: GetSavingInterestRateParams) {
  const result = await db
    .select({
      id: savingInterestRate.id,
      savingPlanId: savingInterestRate.savingPlanId,
      intRate: savingInterestRate.intRate,
      endDate: savingInterestRate.endDate,
      isActive: savingInterestRate.isActive,
      organizationId: savingInterestRate.organizationId,
      planName: savingPlans.name
    })
    .from(savingInterestRate)
    .leftJoin(savingPlans, eq(savingInterestRate.savingPlanId, savingPlans.id))
    .where(and(eq(savingInterestRate.id, id), eq(savingInterestRate.organizationId, organizationId)))
    .limit(1)

  return result[0] || null
}

type CreateSavingInterestRateParams = {
  data: InferInsertModel<typeof savingInterestRate>
  organizationId: string
}

export async function createSavingInterestRate({ data, organizationId }: CreateSavingInterestRateParams) {
  const rateData = { ...data, organizationId }
  const result = await db.insert(savingInterestRate).values(rateData).returning()

  return result[0]
}

type UpdateSavingInterestRateParams = {
  id: string
  data: Partial<InferInsertModel<typeof savingInterestRate>>
  organizationId: string
}

export async function updateSavingInterestRate({ id, data, organizationId }: UpdateSavingInterestRateParams) {
  const result = await db
    .update(savingInterestRate)
    .set(data)
    .where(and(eq(savingInterestRate.id, id), eq(savingInterestRate.organizationId, organizationId)))
    .returning()

  return result[0] || null
}

type DeleteSavingInterestRateParams = {
  id: string
  organizationId: string
}

export async function deleteSavingInterestRate({ id, organizationId }: DeleteSavingInterestRateParams) {
  const result = await db
    .delete(savingInterestRate)
    .where(and(eq(savingInterestRate.id, id), eq(savingInterestRate.organizationId, organizationId)))
    .returning()

  return result[0] || null
}
