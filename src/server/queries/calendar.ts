// "use server"
// import { and, eq } from "drizzle-orm"
// import { db } from "@/server/db"
// import { financial_years } from "@/server/db/schema"

// export async function getCurrentBusinessDate(
//   orgId: string
// ): Promise<string | null> {
//   const result = await db
//     .select({ currentDate: financial_years.start_date })
//     .from(financial_years)
//     .where(
//       and(
//         eq(financial_years.organizationId, orgId),
//         eq(financial_years.isActive, true)
//       )
//     )
//     .limit(1)

//   return result[0]?.currentDate || null
// }

// export async function isDayEndClosed(orgId: string): Promise<boolean> {
//   const result = await db
//     .select({ dayEndStatus: financial_years.dayEndStatus })
//     .from(financial_years)
//     .where(
//       and(
//         eq(financial_years.organizationId, orgId),
//         eq(financial_years.isActive, true)
//       )
//     )
//     .limit(1)

//   return result[0]?.dayEndStatus === "closed"
// }

// export async function getFinancialYearContext(orgId: string) {
//   const result = await db
//     .select()
//     .from(financialYears)
//     .where(
//       and(eq(financialYears.orgId, orgId), eq(financialYears.isActive, true))
//     )
//     .limit(1)

//   return result[0] || null
// }

// export async function runDayEndProcesses(orgId: string, businessDate: string) {
//   // Add your day-end business logic here
//   // Examples:
//   // - Calculate daily totals
//   // - Generate reports
//   // - Update balances
//   // - Backup data

//   console.log(
//     `Running day-end processes for org: ${orgId}, date: ${businessDate}`
//   )

//   // Example: Get transaction count for the day
//   const transactionCount = await db
//     .select()
//     .from(transactions)
//     .where(
//       and(
//         eq(transactions.orgId, orgId),
//         eq(transactions.transactionDate, businessDate)
//       )
//     )

//   console.log(`Processed ${transactionCount.length} transactions`)
// }

// export async function getCurrentBusinessDateAction(orgId: string) {
//   try {
//     const currentDate = await getCurrentBusinessDate(orgId)
//     return { success: true, currentDate }
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error"
//     }
//   }
// }

// export async function advanceBusinessDate(orgId: string, newDate: string) {
//   try {
//     const currentContext = await db
//       .select({
//         currentDate: financialYears.currentDate,
//         dayEndStatus: financialYears.dayEndStatus
//       })
//       .from(financialYears)
//       .where(
//         and(eq(financialYears.orgId, orgId), eq(financialYears.isActive, true))
//       )
//       .limit(1)

//     if (!currentContext[0]) {
//       throw new Error("No active financial year found")
//     }

//     const { currentDate, dayEndStatus } = currentContext[0]

//     if (new Date(newDate) <= new Date(currentDate)) {
//       throw new Error("New date must be after current date")
//     }

//     if (dayEndStatus !== "closed") {
//       throw new Error("Please close current day before advancing")
//     }

//     await db
//       .update(financialYears)
//       .set({
//         currentDate: newDate,
//         dayEndStatus: "open",
//         updatedAt: new Date()
//       })
//       .where(
//         and(eq(financialYears.orgId, orgId), eq(financialYears.isActive, true))
//       )

//     revalidatePath("/dashboard")
//     return { success: true, newDate }
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error"
//     }
//   }
// }

// export async function closeDayEnd(orgId: string, userId?: string) {
//   try {
//     const isDayClosed = await isDayEndClosed(orgId)

//     if (isDayClosed) {
//       throw new Error("Day is already closed")
//     }

//     const currentDate = await getCurrentBusinessDate(orgId)
//     if (!currentDate) {
//       throw new Error("No active financial year found")
//     }

//     // Run day-end processes
//     await runDayEndProcesses(orgId, currentDate)

//     // Mark day as closed
//     await db
//       .update(financialYears)
//       .set({
//         dayEndStatus: "closed",
//         updatedAt: new Date()
//       })
//       .where(
//         and(eq(financialYears.orgId, orgId), eq(financialYears.isActive, true))
//       )

//     revalidatePath("/dashboard")
//     return { success: true, status: "success", dateClosed: currentDate }
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error"
//     }
//   }
// }

// export async function reopenDayEnd(orgId: string, userId?: string) {
//   try {
//     const isDayClosed = await isDayEndClosed(orgId)

//     if (!isDayClosed) {
//       throw new Error("Day is not closed")
//     }

//     await db
//       .update(financialYears)
//       .set({
//         dayEndStatus: "open",
//         updatedAt: new Date()
//       })
//       .where(
//         and(eq(financialYears.orgId, orgId), eq(financialYears.isActive, true))
//       )

//     revalidatePath("/dashboard")
//     return { success: true, status: "success", message: "Day reopened" }
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error"
//     }
//   }
// }

// export async function getFinancialYearContextAction(orgId: string) {
//   try {
//     const context = await getFinancialYearContext(orgId)
//     return { success: true, context }
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error"
//     }
//   }
// }
