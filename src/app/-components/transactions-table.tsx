import { infiniteQueryOptions, useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar"
import type { DataTableRowAction } from "@/components/ui/data-table/data-table-types"
import { useDataTable } from "@/hooks/use-data-table"
import { GetTransactionsResponse, getTransactions, getTransactionsParamsSchema } from "@/lib/functions"

import { Route } from ".."
import { getTransactionsTableColumns } from "./columns"
import { TransactionsFilter } from "./transactions-filter"

type Transaction = GetTransactionsResponse["data"][number]
type TransactionFilterParams = z.infer<typeof getTransactionsParamsSchema>

export function getTransactionsInfiniteOptions(filters: Partial<TransactionFilterParams>) {
  return infiniteQueryOptions({
    queryKey: ["transactions", filters],
    queryFn: () => getTransactions({ data: filters }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: GetTransactionsResponse) => lastPage.meta.cursor ?? undefined
  })
}

export function TransactionsTable() {
  const searchParams = Route.useSearch()

  // Convert sort format from table to API format
  const sortParam =
    searchParams.sort && searchParams.sort.length > 0
      ? [searchParams.sort[0].id, searchParams.sort[0].desc ? "desc" : "asc"]
      : null

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    getTransactionsInfiniteOptions({
      ...searchParams,
      sort: sortParam
    })
  )

  const [_rowAction, setRowAction] = useState<DataTableRowAction<Transaction> | null>(null)
  const columns = useMemo(() => getTransactionsTableColumns({ setRowAction }), [setRowAction])

  const { table, onRowClick } = useDataTable({
    data: data?.pages.flatMap((page) => page.data) ?? [],
    columns,
    initialState: {
      columnPinning: { right: ["actions"], left: ["select"] },
      columnVisibility: {
        id: false,
        description: false,
        createdAt: false,
        updatedAt: false,
        metadata: false,
        tags: false,
        notes: false,
        isInternal: false
      }
    },
    getRowId: (originalRow) => originalRow.id.toString(),
    shallow: false,
    clearOnDefault: true
  })

  return (
    <>
      <DataTable table={table} onRowClick={onRowClick}>
        <DataTableToolbar table={table}>
          <TransactionsFilter />
        </DataTableToolbar>
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
