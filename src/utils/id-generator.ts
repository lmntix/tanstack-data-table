// import { db } from "../server/db"
// import { desc, like, and, eq } from "drizzle-orm"
// import {
//   users,
//   savingAccounts,
//   recurringAccounts,
//   loanAccounts,
//   creditCardAccounts,
//   transactionAccounts
// } from "../lib/db/schema"

// // Define entity types
// export const ENTITY_TYPES = {
//   USER: "USR",
//   SAVINGS_ACCOUNT: "SAV",
//   CURRENT_ACCOUNT: "CUR",
//   FIXED_DEPOSIT: "FD",
//   RECURRING_DEPOSIT: "RD",
//   LOAN: "LN",
//   CREDIT_CARD: "CC",
//   TRANSACTION: "TXN"
// } as const

// // Type for entity keys
// export type EntityType = keyof typeof ENTITY_TYPES

// // Type for entity values
// export type EntityCode = (typeof ENTITY_TYPES)[EntityType]

// // Type for organization codes
// export type OrganizationCode = string

// // Main ID generator function
// export async function generateId<T extends EntityType>(
//   organizationCode: OrganizationCode,
//   entityType: T
// ): Promise<string> {
//   const entityCode = ENTITY_TYPES[entityType]
//   const idPattern = `${organizationCode}-${entityCode}-%`

//   try {
//     let latestRecord: { displayId: string } | undefined

//     // Query only the specific table based on entity type
//     switch (entityType) {
//       case "USER":
//         latestRecord = await db
//           .select({ displayId: users.displayId })
//           .from(users)
//           .where(
//             and(
//               like(users.displayId, idPattern),
//               eq(users.bankCode, organizationCode)
//             )
//           )
//           .orderBy(desc(users.id))
//           .limit(1)
//           .then((rows) => rows[0])
//         break

//       case "SAVINGS_ACCOUNT":
//         latestRecord = await db
//           .select({ displayId: savingsAccounts.displayId })
//           .from(savingsAccounts)
//           .where(
//             and(
//               like(savingsAccounts.displayId, idPattern),
//               eq(savingsAccounts.bankCode, organizationCode)
//             )
//           )
//           .orderBy(desc(savingsAccounts.id))
//           .limit(1)
//           .then((rows) => rows[0])
//         break

//       case "CURRENT_ACCOUNT":
//         latestRecord = await db
//           .select({ displayId: currentAccounts.displayId })
//           .from(currentAccounts)
//           .where(
//             and(
//               like(currentAccounts.displayId, idPattern),
//               eq(currentAccounts.bankCode, organizationCode)
//             )
//           )
//           .orderBy(desc(currentAccounts.id))
//           .limit(1)
//           .then((rows) => rows[0])
//         break

//       case "FIXED_DEPOSIT":
//         latestRecord = await db
//           .select({ displayId: fixedDeposits.displayId })
//           .from(fixedDeposits)
//           .where(
//             and(
//               like(fixedDeposits.displayId, idPattern),
//               eq(fixedDeposits.bankCode, organizationCode)
//             )
//           )
//           .orderBy(desc(fixedDeposits.id))
//           .limit(1)
//           .then((rows) => rows[0])
//         break

//       case "RECURRING_DEPOSIT":
//         latestRecord = await db
//           .select({ displayId: recurringDeposits.displayId })
//           .from(recurringDeposits)
//           .where(
//             and(
//               like(recurringDeposits.displayId, idPattern),
//               eq(recurringDeposits.bankCode, organizationCode)
//             )
//           )
//           .orderBy(desc(recurringDeposits.id))
//           .limit(1)
//           .then((rows) => rows[0])
//         break

//       case "LOAN":
//         latestRecord = await db
//           .select({ displayId: loans.displayId })
//           .from(loans)
//           .where(
//             and(
//               like(loans.displayId, idPattern),
//               eq(loans.bankCode, organizationCode)
//             )
//           )
//           .orderBy(desc(loans.id))
//           .limit(1)
//           .then((rows) => rows[0])
//         break

//       case "CREDIT_CARD":
//         latestRecord = await db
//           .select({ displayId: creditCards.displayId })
//           .from(creditCards)
//           .where(
//             and(
//               like(creditCards.displayId, idPattern),
//               eq(creditCards.bankCode, organizationCode)
//             )
//           )
//           .orderBy(desc(creditCards.id))
//           .limit(1)
//           .then((rows) => rows[0])
//         break

//       case "TRANSACTION":
//         latestRecord = await db
//           .select({ displayId: transactions.displayId })
//           .from(transactions)
//           .where(
//             and(
//               like(transactions.displayId, idPattern),
//               eq(transactions.bankCode, organizationCode)
//             )
//           )
//           .orderBy(desc(transactions.id))
//           .limit(1)
//           .then((rows) => rows[0])
//         break

//       default:
//         throw new Error(`Unsupported entity type: ${entityType}`)
//     }

//     let nextSequence = 1

//     if (latestRecord?.displayId) {
//       const sequencePart = latestRecord.displayId.split("-")[2]
//       const currentSequence = parseInt(sequencePart, 10)

//       if (!isNaN(currentSequence)) {
//         nextSequence = currentSequence + 1
//       }
//     }

//     return `${organizationCode}-${entityCode}-${nextSequence}`
//   } catch (error) {
//     console.error("Error generating ID:", error)
//     throw new Error(
//       `Failed to generate ID for ${organizationCode}-${entityCode}: ${error}`
//     )
//   }
// }

// // Type-safe usage examples
// export async function createEntityIds(orgCode: string) {
//   const userId = await generateId(orgCode, "USER") // BNK1-USR-1
//   const savingsId = await generateId(orgCode, "SAVINGS_ACCOUNT") // BNK1-SAV-1
//   const currentId = await generateId(orgCode, "CURRENT_ACCOUNT") // BNK1-CUR-1
//   const fdId = await generateId(orgCode, "FIXED_DEPOSIT") // BNK1-FD-1
//   const rdId = await generateId(orgCode, "RECURRING_DEPOSIT") // BNK1-RD-1
//   const loanId = await generateId(orgCode, "LOAN") // BNK1-LN-1
//   const ccId = await generateId(orgCode, "CREDIT_CARD") // BNK1-CC-1
//   const txnId = await generateId(orgCode, "TRANSACTION") // BNK1-TXN-1

//   return {
//     userId,
//     savingsId,
//     currentId,
//     fdId,
//     rdId,
//     loanId,
//     ccId,
//     txnId
//   }
// }

// // Helper function to get entity code from entity type
// export function getEntityCode<T extends EntityType>(entityType: T): EntityCode {
//   return ENTITY_TYPES[entityType]
// }

// // Type guard to check if string is valid entity type
// export function isValidEntityType(value: string): value is EntityType {
//   return Object.keys(ENTITY_TYPES).includes(value as EntityType)
// }
