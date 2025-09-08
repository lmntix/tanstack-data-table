import type { InferInsertModel } from "drizzle-orm"
import { and, asc, count, desc, eq, gte, ilike, inArray, lte, SQL } from "drizzle-orm"
import { db } from "../db"
import { accounts, members, savingAccounts, savingPlans, subAccounts } from "../db/schema"

// Saving Accounts functions

type ListSavingsAccountsParams = {
  organizationId: string
  page?: number
  perPage?: number
  sort?: Array<{ id: string; desc: boolean }>
  q?: string | null
  status?: Array<"OPEN" | "CLOSE" | "SUSPENDED">
  savingPlanId?: Array<string>
  membersId?: Array<string>
  openDate?: Array<number>
  createdAt?: Array<number>
}

export async function listSavingsAccounts({
  organizationId,
  page = 1,
  perPage = 10,
  sort,
  q,
  status,
  savingPlanId,
  membersId,
  openDate,
  createdAt
}: ListSavingsAccountsParams) {
  const offset = (page - 1) * perPage

  const whereConditions: SQL[] = [eq(savingAccounts.organizationId, organizationId)]

  // Search conditions
  if (q) {
    whereConditions.push(ilike(subAccounts.subAccountNo, `%${q}%`))
  }

  // Filter conditions
  if (status && status.length > 0) {
    whereConditions.push(inArray(savingAccounts.status, status))
  }

  if (savingPlanId && savingPlanId.length > 0) {
    whereConditions.push(inArray(savingAccounts.savingPlanId, savingPlanId))
  }

  if (membersId && membersId.length > 0) {
    whereConditions.push(inArray(savingAccounts.membersId, membersId))
  }

  if (openDate && openDate.length === 2) {
    const [startTimestamp, endTimestamp] = openDate
    whereConditions.push(
      and(
        gte(savingAccounts.openDate, new Date(startTimestamp).toISOString().split("T")[0]),
        lte(savingAccounts.openDate, new Date(endTimestamp).toISOString().split("T")[0])
      )!
    )
  }

  if (createdAt && createdAt.length === 2) {
    const [startTimestamp, endTimestamp] = createdAt
    whereConditions.push(
      and(
        gte(savingAccounts.createdAt, new Date(startTimestamp)),
        lte(savingAccounts.createdAt, new Date(endTimestamp))
      )!
    )
  }

  // Start building the query
  const query = db
    .select({
      id: savingAccounts.id,
      subAccountsId: savingAccounts.subAccountsId,
      savingPlanId: savingAccounts.savingPlanId,
      membersId: savingAccounts.membersId,
      openDate: savingAccounts.openDate,
      interestRate: savingAccounts.interestRate,
      status: savingAccounts.status,
      closeDate: savingAccounts.closeDate,
      organizationId: savingAccounts.organizationId,
      createdAt: savingAccounts.createdAt,
      updatedAt: savingAccounts.updatedAt,
      memberName: members.fullName,
      planName: savingPlans.name,
      subAccountNo: subAccounts.subAccountNo
    })
    .from(savingAccounts)
    .leftJoin(members, eq(savingAccounts.membersId, members.id))
    .leftJoin(savingPlans, eq(savingAccounts.savingPlanId, savingPlans.id))
    .leftJoin(subAccounts, eq(savingAccounts.subAccountsId, subAccounts.id))
    .where(and(...whereConditions))

  // Apply sorting
  if (sort && sort.length > 0) {
    const orderByClause = sort.map((item: { id: string; desc: boolean }) => {
      // Map the sort column ID to actual table columns
      switch (item.id) {
        case "id":
          return item.desc ? desc(savingAccounts.id) : asc(savingAccounts.id)
        case "subAccountsId":
          return item.desc ? desc(savingAccounts.subAccountsId) : asc(savingAccounts.subAccountsId)
        case "savingPlanId":
          return item.desc ? desc(savingAccounts.savingPlanId) : asc(savingAccounts.savingPlanId)
        case "membersId":
          return item.desc ? desc(savingAccounts.membersId) : asc(savingAccounts.membersId)
        case "interestRate":
          return item.desc ? desc(savingAccounts.interestRate) : asc(savingAccounts.interestRate)
        case "openDate":
          return item.desc ? desc(savingAccounts.openDate) : asc(savingAccounts.openDate)
        case "status":
          return item.desc ? desc(savingAccounts.status) : asc(savingAccounts.status)
        case "createdAt":
          return item.desc ? desc(savingAccounts.createdAt) : asc(savingAccounts.createdAt)
        case "updatedAt":
          return item.desc ? desc(savingAccounts.updatedAt) : asc(savingAccounts.updatedAt)
        default:
          // Default to createdAt if unknown column
          return item.desc ? desc(savingAccounts.createdAt) : asc(savingAccounts.createdAt)
      }
    })
    query.orderBy(...orderByClause)
  } else {
    // Default sorting
    query.orderBy(desc(savingAccounts.createdAt))
  }

  // Apply pagination
  const data = await query.limit(perPage).offset(offset)

  // Get total count for pagination metadata
  const totalCountResult = await db
    .select({
      count: count()
    })
    .from(savingAccounts)
    .leftJoin(members, eq(savingAccounts.membersId, members.id))
    .leftJoin(savingPlans, eq(savingAccounts.savingPlanId, savingPlans.id))
    .leftJoin(subAccounts, eq(savingAccounts.subAccountsId, subAccounts.id))
    .where(and(...whereConditions))

  const totalCount = totalCountResult[0]?.count ?? 0
  const pageCount = Math.ceil(totalCount / perPage)

  return {
    data,
    meta: {
      page,
      perPage,
      pageCount,
      totalCount,
      hasNextPage: page < pageCount,
      hasPreviousPage: page > 1
    }
  }
}

type GetSavingAccountParams = {
  id: string
  organizationId: string
}

export async function getSavingAccountById({ id, organizationId }: GetSavingAccountParams) {
  const result = await db
    .select({
      id: savingAccounts.id,
      subAccountsId: savingAccounts.subAccountsId,
      savingPlanId: savingAccounts.savingPlanId,
      membersId: savingAccounts.membersId,
      openDate: savingAccounts.openDate,
      interestRate: savingAccounts.interestRate,
      status: savingAccounts.status,
      closeDate: savingAccounts.closeDate,
      organizationId: savingAccounts.organizationId,
      createdAt: savingAccounts.createdAt,
      updatedAt: savingAccounts.updatedAt,
      memberName: members.fullName,
      planName: savingPlans.name,
      subAccountNo: subAccounts.subAccountNo
    })
    .from(savingAccounts)
    .leftJoin(members, eq(savingAccounts.membersId, members.id))
    .leftJoin(savingPlans, eq(savingAccounts.savingPlanId, savingPlans.id))
    .leftJoin(subAccounts, eq(savingAccounts.subAccountsId, subAccounts.id))
    .where(and(eq(savingAccounts.id, id), eq(savingAccounts.organizationId, organizationId)))
    .limit(1)

  return result[0] || null
}

type CreateSavingAccountParams = {
  data: InferInsertModel<typeof savingAccounts>
  organizationId: string
}

export async function createSavingAccount({ data, organizationId }: CreateSavingAccountParams) {
  const accountData = { ...data, organizationId }
  const result = await db.insert(savingAccounts).values(accountData).returning()

  return result[0]
}

type UpdateSavingAccountParams = {
  id: string
  data: Partial<InferInsertModel<typeof savingAccounts>>
  organizationId: string
}

export async function updateSavingAccount({ id, data, organizationId }: UpdateSavingAccountParams) {
  const result = await db
    .update(savingAccounts)
    .set(data)
    .where(and(eq(savingAccounts.id, id), eq(savingAccounts.organizationId, organizationId)))
    .returning()

  return result[0] || null
}

type DeleteSavingAccountParams = {
  id: string
  organizationId: string
}

export async function deleteSavingAccount({ id, organizationId }: DeleteSavingAccountParams) {
  const result = await db
    .delete(savingAccounts)
    .where(and(eq(savingAccounts.id, id), eq(savingAccounts.organizationId, organizationId)))
    .returning()

  return result[0] || null
}

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
