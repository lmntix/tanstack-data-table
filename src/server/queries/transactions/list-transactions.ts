import { and, asc, desc, eq, gte, ilike, inArray, lte, sql } from "drizzle-orm"
import type { SQL } from "drizzle-orm/sql/sql"
import z from "zod"
import { ListTransactionsSchema } from "@/components/validators/transactions"
import { db } from "@/server/db"
import {
  accounts,
  financialYears,
  orgBranches,
  subAccounts,
  transactionDetails,
  transactionHead,
  users
} from "@/server/db/schema"

export type ListTransactionsParams = z.infer<typeof ListTransactionsSchema> & { organizationId: string }

export async function listTransactions(params: ListTransactionsParams) {
  const { organizationId, sort, cursor, pageSize = 30, q, voucherNo, financialYearId, voucherMaster, date } = params

  // Always start with organizationId filter
  const whereConditions: (SQL | undefined)[] = [eq(transactionHead.organizationId, organizationId)]

  // Search query filter - narration search
  if (q) {
    whereConditions.push(ilike(transactionHead.description, `%${q}%`))
  }

  if (voucherNo) {
    whereConditions.push(ilike(transactionHead.voucherNo, `%${voucherNo}%`))
  }

  if (financialYearId && financialYearId.length > 0) {
    whereConditions.push(inArray(transactionHead.financialYearId, financialYearId))
  }

  if (voucherMaster && voucherMaster.length > 0) {
    whereConditions.push(inArray(transactionHead.voucherMaster, voucherMaster))
  }

  // Date range filter
  if (date && date.length === 2) {
    const [start, end] = date
    if (start) {
      whereConditions.push(gte(transactionHead.date, start))
    }
    if (end) {
      const endDate = new Date(end)
      endDate.setDate(endDate.getDate() + 1)
      const endDateString = endDate.toISOString().split("T")[0]
      if (endDateString) {
        whereConditions.push(lte(transactionHead.date, endDateString))
      }
    }
  }

  const finalWhereConditions = whereConditions.filter((c) => c !== undefined) as SQL[]

  // All joins must also be limited by organizationId where relevant
  const queryBuilder = db
    .select({
      id: transactionHead.id,
      financialYearId: transactionHead.financialYearId,
      branchId: transactionHead.branchId,
      voucherMaster: transactionHead.voucherMaster,
      voucherNo: transactionHead.voucherNo,
      date: transactionHead.date,
      amount: transactionHead.amount,
      description: transactionHead.description,
      mode: transactionHead.mode,
      organizationId: transactionHead.organizationId,
      createdAt: transactionHead.createdAt,
      createdBy: transactionHead.createdBy,
      updatedAt: transactionHead.updatedAt,
      updatedBy: transactionHead.updatedBy,
      version: transactionHead.version,
      details: sql<
        Array<{
          id: string
          accountsId: string
          subAccountsId: string
          amount: number
          accountName: string | null
          subAccountNo: string | null
        }>
      >`COALESCE(json_agg(DISTINCT jsonb_build_object('id', ${transactionDetails.id}, 'accountsId', ${transactionDetails.accountsId}, 'subAccountsId', ${transactionDetails.subAccountsId}, 'amount', ${transactionDetails.amount}, 'accountName', ${accounts.name}, 'subAccountNo', ${subAccounts.subAccountNo})) FILTER (WHERE ${transactionDetails.id} IS NOT NULL), '[]'::json)`.as(
        "details"
      ),
      financialYear: {
        id: financialYears.id,
        name: financialYears.name
      },
      branch: {
        id: orgBranches.id,
        name: orgBranches.name
      },
      creator: {
        id: users.id,
        name: users.name
      }
    })
    .from(transactionHead)
    .leftJoin(financialYears, eq(transactionHead.financialYearId, financialYears.id))
    .leftJoin(orgBranches, eq(transactionHead.branchId, orgBranches.id))
    .leftJoin(users, eq(transactionHead.createdBy, users.id))
    .leftJoin(transactionDetails, eq(transactionDetails.transactionHeadId, transactionHead.id))
    .leftJoin(accounts, eq(transactionDetails.accountsId, accounts.id))
    .leftJoin(subAccounts, eq(transactionDetails.subAccountsId, subAccounts.id))
    .where(and(...finalWhereConditions))
    .groupBy(
      transactionHead.id,
      transactionHead.financialYearId,
      transactionHead.branchId,
      transactionHead.voucherMaster,
      transactionHead.voucherNo,
      transactionHead.date,
      transactionHead.amount,
      transactionHead.description,
      transactionHead.mode,
      transactionHead.organizationId,
      transactionHead.createdAt,
      transactionHead.createdBy,
      transactionHead.updatedAt,
      transactionHead.updatedBy,
      transactionHead.version,
      financialYears.id,
      financialYears.name,
      orgBranches.id,
      orgBranches.name,
      users.id,
      users.name
    )

  let query = queryBuilder.$dynamic()

  // Sorting
  if (sort && sort.length === 2) {
    const [column, direction] = sort
    const isAscending = direction === "asc"
    const order = isAscending ? asc : desc

    if (column === "mode") {
      query = query.orderBy(order(transactionHead.mode), order(transactionHead.id))
    } else if (column === "createdAt") {
      query = query.orderBy(order(transactionHead.createdAt), order(transactionHead.id))
    } else if (column === "updatedAt") {
      query = query.orderBy(order(transactionHead.updatedAt), order(transactionHead.id))
    } else {
      query = query.orderBy(desc(transactionHead.createdAt), desc(transactionHead.id))
    }
  } else {
    query = query.orderBy(desc(transactionHead.createdAt), desc(transactionHead.id))
  }

  const offset = cursor ? Number.parseInt(cursor, 10) : 0
  const finalQuery = query.limit(pageSize).offset(offset)

  const fetchedData = await finalQuery

  const hasNextPage = fetchedData.length === pageSize
  const nextCursor = hasNextPage ? (offset + pageSize).toString() : undefined

  const processedData = fetchedData.map((row: (typeof fetchedData)[0]) => {
    const { financialYear, branch, creator, ...rest } = row

    return {
      ...rest,
      financialYear: financialYear?.id
        ? {
            id: financialYear.id,
            name: financialYear.name
          }
        : null,
      branch: branch?.id
        ? {
            id: branch.id,
            name: branch.name
          }
        : null,
      creator: creator?.id
        ? {
            id: creator.id,
            name: creator.name
          }
        : null
    }
  })

  return {
    meta: {
      cursor: nextCursor,
      hasPreviousPage: offset > 0,
      hasNextPage: hasNextPage
    },
    data: processedData
  }
}
