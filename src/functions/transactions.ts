import { createServerFn } from "@tanstack/react-start"
import { and, asc, count, desc, eq, ilike, inArray, SQL } from "drizzle-orm"
import z from "zod"
import { db } from "@/lib/db"
import { financialYears, orgBranches, transactionDetails, transactionHead, users } from "@/lib/db/schema"
import { authMiddleware } from "./middlewares"

// Define the sorting item schema to match the data table format
const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean()
})

// Define the input schema
const getTransactionsInputSchema = z.object({
  sort: z.array(sortingItemSchema).optional().default([]),
  cursor: z.string().optional(),
  q: z.string().optional(),
  voucherNo: z.string().optional(),
  mode: z.array(z.enum(["OTHER", "CASH", "UPI", "CHEQUE", "BANK_TRANSFER"])).optional()
})

export const getTransactionsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator(getTransactionsInputSchema)

  .handler(async ({ data, context }) => {
    console.log("getTransactionsFn called with data:", data)
    const organizationId = context.session.activeOrganizationId

    if (!organizationId) {
      throw new Error("Organization not found")
    }
    const { sort, cursor, q, voucherNo, mode } = data
    const pageSize = 25
    const whereConditions: (SQL | undefined)[] = [eq(transactionHead.organizationId, organizationId)]

    // Search query filter - narration search
    if (q) {
      whereConditions.push(ilike(transactionHead.description, `%${q}%`))
    }

    if (voucherNo) {
      whereConditions.push(ilike(transactionHead.voucherNo, `%${voucherNo}%`))
    }

    if (mode && mode.length > 0) {
      whereConditions.push(inArray(transactionHead.mode, mode))
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
        detailsCount: count(transactionDetails.id).as("detailsCount"),
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

    // Sorting - handle array of sorting items
    if (sort && sort.length > 0) {
      const sortItem = sort[0] // Take the first sort item
      const { id: column, desc: isDescending } = sortItem
      const order = isDescending ? desc : asc

      if (column === "mode") {
        query = query.orderBy(order(transactionHead.mode), order(transactionHead.id))
      } else if (column === "createdAt") {
        query = query.orderBy(order(transactionHead.createdAt), order(transactionHead.id))
      } else if (column === "updatedAt") {
        query = query.orderBy(order(transactionHead.updatedAt), order(transactionHead.id))
      } else if (column === "voucherNo") {
        query = query.orderBy(order(transactionHead.voucherNo), order(transactionHead.id))
      } else if (column === "date") {
        query = query.orderBy(order(transactionHead.date), order(transactionHead.id))
      } else if (column === "amount") {
        query = query.orderBy(order(transactionHead.amount), order(transactionHead.id))
      } else if (column === "description") {
        query = query.orderBy(order(transactionHead.description), order(transactionHead.id))
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
  })

export type GetTransactionsResponse = Awaited<ReturnType<typeof getTransactionsFn>>
