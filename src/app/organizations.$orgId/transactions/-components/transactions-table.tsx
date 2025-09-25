import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useDeferredValue, useMemo, useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar"
import type { DataTableRowAction } from "@/components/ui/data-table/data-table-types"
import { getSortingStateSchema } from "@/components/ui/data-table/parsers"
import { type GetTransactionsResponse, getTransactionsFn } from "@/functions/transactions"
import { useDataTable } from "@/hooks/use-data-table"
import { useSortParams } from "@/hooks/use-sort-params"
import { transactionFilterSchema, useTransactionFilterParams } from "@/hooks/use-transaction-filter-params"
import { getTransactionsTableColumns } from "./columns"

type RouterOutputs = GetTransactionsResponse["data"]
type Transaction = RouterOutputs[number]

// Use the proper Zod types
type TransactionFilterParams = z.infer<typeof transactionFilterSchema>
type SortingParams = z.infer<ReturnType<typeof getSortingStateSchema>>

interface GetTransactionsInfiniteOptionsParams extends TransactionFilterParams {
  sort?: SortingParams
}

export function getTransactionsInfiniteOptions({ q, voucherNo, sort }: GetTransactionsInfiniteOptionsParams) {
  return {
    queryKey: ["transactions", { filter: { q, voucherNo }, sort, q }],
    queryFn: () =>
      getTransactionsFn({
        data: {
          q,
          voucherNo,
          sort,
          cursor: undefined
        }
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: GetTransactionsResponse) => lastPage.meta?.cursor ?? undefined
  }
}

export function TransactionsTable() {
  const { filter } = useTransactionFilterParams()

  const { params } = useSortParams()
  const deferredSearch = useDeferredValue(filter.q)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    getTransactionsInfiniteOptions({
      q: deferredSearch,
      voucherNo: filter.voucherNo,
      sort: params.sort
    })
  )

  const [_rowAction, setRowAction] = useState<DataTableRowAction<Transaction> | null>(null)
  const columns = useMemo(() => getTransactionsTableColumns({ setRowAction }), [setRowAction])

  const { table, onRowClick } = useDataTable({
    data: data?.pages.flatMap((page) => page.data) ?? [],
    columns,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"], left: ["narration"] },
      columnVisibility: {
        id: false,
        financialYearId: false,
        branchId: false,
        createdAt: false,
        voucherNo: false
      }
    },
    getRowId: (originalRow) => originalRow.id.toString(),
    shallow: false,
    clearOnDefault: true
  })

  return (
    <>
      <DataTable table={table} onRowClick={onRowClick}>
        <DataTableToolbar table={table} />
      </DataTable>
      {hasNextPage && (
        <div className="flex justify-center p-4">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="outline">
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  )
}
