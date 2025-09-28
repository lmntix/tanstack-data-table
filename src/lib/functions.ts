import { createServerFn } from "@tanstack/react-start"
import { and, asc, desc, eq, gte, ilike, inArray, lt, lte, or, sql } from "drizzle-orm"
import { z } from "zod"
import { db } from "./db"
import { transactions } from "./db/schema"

export const getTransactionsParamsSchema = z
  .object({
    cursor: z.string().optional().nullable(),
    pageSize: z.coerce.number().min(1).max(200).default(20),
    sort: z.array(z.string()).optional().nullable(),
    search: z.string().min(1).optional().nullable(),
    statuses: z
      .array(z.enum(["pending", "completed", "failed", "cancelled"]))
      .optional()
      .nullable(),
    types: z
      .array(z.enum(["income", "expense", "transfer"]))
      .optional()
      .nullable(),
    categories: z.array(z.string()).optional().nullable(),
    paymentMethods: z
      .array(z.enum(["credit_card", "debit_card", "bank_transfer", "cash", "check", "digital_wallet"]))
      .optional()
      .nullable(),
    tags: z.array(z.string()).optional().nullable(),
    dateFrom: z.string().datetime().optional().nullable(),
    dateTo: z.string().datetime().optional().nullable(),
    amountFrom: z.coerce.number().optional().nullable(),
    amountTo: z.coerce.number().optional().nullable(),
    amountRange: z.tuple([z.coerce.number(), z.coerce.number()]).optional().nullable(),
    currency: z.string().length(3).optional().nullable(),
    isRecurring: z.coerce.boolean().optional().nullable(),
    counterparty: z.string().min(1).optional().nullable(),
    reference: z.string().min(1).optional().nullable(),
    isInternal: z.coerce.boolean().optional().nullable()
  })
  .strict()

export const getTransactions = createServerFn({ method: "GET" })
  .inputValidator(getTransactionsParamsSchema)
  .handler(async ({ data: params }) => {
    console.log("getTransactions called with params: ", params)
    const {
      cursor,
      pageSize = 20,
      sort,
      search,
      statuses,
      types,
      categories,
      paymentMethods,
      tags: filterTags,
      dateFrom,
      dateTo,
      amountFrom,
      amountTo,
      amountRange,
      currency,
      isRecurring,
      counterparty,
      reference,
      isInternal
    } = params
    //add delay to simulate loading
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    const whereConditions = []

    // Search across name, description, counterparty, and reference
    if (search) {
      const searchTerm = `%${search}%`
      const numericSearch = Number.parseFloat(search)

      if (!Number.isNaN(numericSearch)) {
        // If search is numeric, also search in amount
        whereConditions.push(
          or(
            ilike(transactions.name, searchTerm),
            ilike(transactions.description, searchTerm),
            ilike(transactions.counterpartyName, searchTerm),
            ilike(transactions.reference, searchTerm),
            eq(transactions.amount, numericSearch.toString())
          )
        )
      } else {
        whereConditions.push(
          or(
            ilike(transactions.name, searchTerm),
            ilike(transactions.description, searchTerm),
            ilike(transactions.counterpartyName, searchTerm),
            ilike(transactions.reference, searchTerm)
          )
        )
      }
    }

    // Status filter
    if (statuses && statuses.length > 0) {
      whereConditions.push(inArray(transactions.status, statuses))
    }

    // Type filter
    if (types && types.length > 0) {
      whereConditions.push(inArray(transactions.type, types))
    }

    // Category filter
    if (categories && categories.length > 0) {
      const categoryConditions = categories.map((cat) =>
        cat === "uncategorized" ? sql`${transactions.categorySlug} IS NULL` : eq(transactions.categorySlug, cat)
      )
      whereConditions.push(or(...categoryConditions))
    }

    // Payment method filter
    if (paymentMethods && paymentMethods.length > 0) {
      whereConditions.push(inArray(transactions.paymentMethod, paymentMethods))
    }

    // Tags filter (assuming comma-separated tags in tags column)
    if (filterTags && filterTags.length > 0) {
      const tagConditions = filterTags.map((tag) => ilike(transactions.tags, `%${tag}%`))
      whereConditions.push(or(...tagConditions))
    }

    // Date range filters
    if (dateFrom) {
      whereConditions.push(gte(transactions.transactionDate, new Date(dateFrom)))
    }
    if (dateTo) {
      const endDate = new Date(dateTo)
      endDate.setDate(endDate.getDate() + 1)
      whereConditions.push(lt(transactions.transactionDate, endDate))
    }

    // Amount filters
    if (amountFrom !== null && amountFrom !== undefined) {
      whereConditions.push(gte(transactions.amount, amountFrom.toString()))
    }
    if (amountTo !== null && amountTo !== undefined) {
      whereConditions.push(lte(transactions.amount, amountTo.toString()))
    }
    if (amountRange && amountRange.length === 2) {
      whereConditions.push(
        and(gte(transactions.amount, amountRange[0].toString()), lte(transactions.amount, amountRange[1].toString()))
      )
    }

    // Other filters
    if (currency) {
      whereConditions.push(eq(transactions.currency, currency))
    }
    if (isRecurring !== null && isRecurring !== undefined) {
      whereConditions.push(eq(transactions.isRecurring, isRecurring))
    }
    if (counterparty) {
      whereConditions.push(ilike(transactions.counterpartyName, `%${counterparty}%`))
    }
    if (reference) {
      whereConditions.push(ilike(transactions.reference, `%${reference}%`))
    }
    if (isInternal !== null && isInternal !== undefined) {
      whereConditions.push(eq(transactions.isInternal, isInternal))
    }

    // Build the base query
    let query = db
      .select({
        id: transactions.id,
        reference: transactions.reference,
        name: transactions.name,
        description: transactions.description,
        amount: transactions.amount,
        currency: transactions.currency,
        type: transactions.type,
        status: transactions.status,
        paymentMethod: transactions.paymentMethod,
        counterpartyName: transactions.counterpartyName,
        counterpartyAccount: transactions.counterpartyAccount,
        categorySlug: transactions.categorySlug,
        isRecurring: transactions.isRecurring,
        recurringFrequency: transactions.recurringFrequency,
        transactionDate: transactions.transactionDate,
        processedAt: transactions.processedAt,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        metadata: transactions.metadata,
        tags: transactions.tags,
        notes: transactions.notes,
        isInternal: transactions.isInternal,
        // Computed fields
        formattedAmount: sql<string>`CASE 
          WHEN ${transactions.type} = 'expense' THEN '-' || ${transactions.amount}::text
          ELSE ${transactions.amount}::text
        END`.as("formatted_amount")
      })
      .from(transactions)
      .$dynamic()

    // Apply where conditions
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions))
    }

    // Apply sorting
    if (sort && sort.length >= 2) {
      const [column, direction] = sort
      const orderFn = direction === "asc" ? asc : desc

      switch (column) {
        case "name":
          query = query.orderBy(orderFn(transactions.name), desc(transactions.id))
          break
        case "amount":
          query = query.orderBy(orderFn(transactions.amount), desc(transactions.id))
          break
        case "date":
          query = query.orderBy(orderFn(transactions.transactionDate), desc(transactions.id))
          break
        case "status":
          query = query.orderBy(orderFn(transactions.status), desc(transactions.id))
          break
        case "type":
          query = query.orderBy(orderFn(transactions.type), desc(transactions.id))
          break
        case "counterparty":
          query = query.orderBy(orderFn(transactions.counterpartyName), desc(transactions.id))
          break
        case "category":
          query = query.orderBy(orderFn(transactions.categorySlug), desc(transactions.id))
          break
        case "payment_method":
          query = query.orderBy(orderFn(transactions.paymentMethod), desc(transactions.id))
          break
        case "created_at":
          query = query.orderBy(orderFn(transactions.createdAt), desc(transactions.id))
          break
        default:
          query = query.orderBy(desc(transactions.transactionDate), desc(transactions.id))
      }
    } else {
      // Default sort: newest first
      query = query.orderBy(desc(transactions.transactionDate), desc(transactions.id))
    }

    // Apply pagination
    const offset = cursor ? Number.parseInt(cursor, 10) : 0
    query = query.limit(pageSize).offset(offset)

    // Execute query
    const results = await query

    // Calculate pagination metadata
    const hasNextPage = results.length === pageSize
    const nextCursor = hasNextPage ? (offset + pageSize).toString() : null
    const hasPreviousPage = offset > 0

    // Process results
    const processedData = results.map((row) => ({
      ...row,
      amount: Number(row.amount),
      formattedAmount: Number(row.formattedAmount),
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      tagsArray: row.tags ? row.tags.split(",").filter(Boolean) : []
    }))

    return {
      data: processedData,
      meta: {
        cursor: nextCursor,
        hasNextPage,
        hasPreviousPage
      }
    }
  })

export type GetTransactionsResponse = Awaited<ReturnType<typeof getTransactions>>
