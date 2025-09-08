import { and, eq, sql } from "drizzle-orm"
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

export type FindTransactionParams = {
  id: string
  organizationId: string
}

export async function findTransaction(params: FindTransactionParams) {
  const { id, organizationId } = params

  const result = await db
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
    .where(and(eq(transactionHead.id, id), eq(transactionHead.organizationId, organizationId)))
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

  if (result.length === 0) {
    return null
  }

  const row = result[0]
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
}
