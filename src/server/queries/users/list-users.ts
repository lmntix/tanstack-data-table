import { and, asc, count, desc, ilike, inArray, SQL } from "drizzle-orm"
import * as z from "zod"
import { GetUsersSchema } from "@/components/validators/users"
import { db } from "@/server/db"
import { users } from "@/server/db/schema"

type GetUsersType = z.infer<typeof GetUsersSchema>

export async function getUsers(input: GetUsersType) {
  const { page = 1, perPage = 10 } = input
  const offset = (page - 1) * perPage

  const whereConditions: SQL[] = []

  if (input.name) {
    whereConditions.push(ilike(users.name, `%${input.name}%`))
  }
  if (input.email) {
    whereConditions.push(ilike(users.email, `%${input.email}%`))
  }
  if (input.role && input.role.length > 0) {
    whereConditions.push(inArray(users.role, input.role))
  }
  if (input.emailVerified && input.emailVerified.length > 0) {
    whereConditions.push(
      inArray(
        users.emailVerified,
        input.emailVerified.map((val) => val === "true")
      )
    )
  }
  if (input.isActive && input.isActive.length > 0) {
    whereConditions.push(
      inArray(
        users.isActive,
        input.isActive.map((val) => val === "true")
      )
    )
  }
  if (input.banned && input.banned.length > 0) {
    whereConditions.push(
      inArray(
        users.banned,
        input.banned.map((val) => val === "true")
      )
    )
  }
  if (input.createdAt && input.createdAt.length > 0) {
    whereConditions.push(
      inArray(
        users.createdAt,
        input.createdAt.map((timestamp) => new Date(timestamp))
      )
    )
  }

  // Start building the query
  const query = db
    .select()
    .from(users)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .groupBy(users.id)

  // Apply sorting
  if (input.sort && input.sort.length > 0) {
    const orderByClause = input.sort.map((item: { id: string; desc: boolean }) => {
      // Map the sort column ID to actual table columns
      switch (item.id) {
        case "id":
          return item.desc ? desc(users.id) : asc(users.id)
        case "name":
          return item.desc ? desc(users.name) : asc(users.name)
        case "email":
          return item.desc ? desc(users.email) : asc(users.email)
        case "role":
          return item.desc ? desc(users.role) : asc(users.role)
        case "emailVerified":
          return item.desc ? desc(users.emailVerified) : asc(users.emailVerified)
        case "isActive":
          return item.desc ? desc(users.isActive) : asc(users.isActive)
        case "banned":
          return item.desc ? desc(users.banned) : asc(users.banned)
        case "createdAt":
          return item.desc ? desc(users.createdAt) : asc(users.createdAt)
        case "updatedAt":
          return item.desc ? desc(users.updatedAt) : asc(users.updatedAt)
        default:
          // Default to createdAt if unknown column
          return item.desc ? desc(users.createdAt) : asc(users.createdAt)
      }
    })
    query.orderBy(...orderByClause)
  } else {
    // Default sorting
    query.orderBy(desc(users.createdAt))
  }

  // Apply pagination
  const data = await query.limit(perPage).offset(offset)

  // Get total count for pagination metadata
  const totalCountResult = await db
    .select({
      count: count()
    })
    .from(users)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

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
