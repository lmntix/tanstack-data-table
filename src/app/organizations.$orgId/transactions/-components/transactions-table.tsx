import { infiniteQueryOptions, useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar"
import type { DataTableRowAction } from "@/components/ui/data-table/data-table-types"
import { getSortingStateSchema } from "@/components/ui/data-table/parsers"
import { type GetTransactionsResponse, getTransactionsFn } from "@/functions/transactions"
import { useDataTable } from "@/hooks/use-data-table"
import { Route, transactionFilterSchema } from ".."
import { getTransactionsTableColumns } from "./columns"

type RouterOutputs = GetTransactionsResponse["data"]
type Transaction = RouterOutputs[number]

// Use the proper Zod types
type TransactionFilterParams = z.infer<typeof transactionFilterSchema>
type SortingParams = z.infer<ReturnType<typeof getSortingStateSchema>>

interface GetTransactionsInfiniteOptionsParams extends TransactionFilterParams {
  sort?: SortingParams
}

export function getTransactionsInfiniteOptions({ q, voucherNo, sort, mode }: GetTransactionsInfiniteOptionsParams) {
  return infiniteQueryOptions({
    queryKey: ["transactions", { q, voucherNo, mode, sort }],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getTransactionsFn({
        data: {
          q,
          voucherNo,
          mode,
          sort,
          cursor: pageParam
        }
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: GetTransactionsResponse) => lastPage.meta?.cursor ?? undefined
  })
}

export function TransactionsTable() {
  const searchParams = Route.useSearch()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    getTransactionsInfiniteOptions({
      q: searchParams.q,
      voucherNo: searchParams.voucherNo,
      sort: searchParams.sort,
      mode: searchParams.mode
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
