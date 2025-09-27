// transactions-table.tsx
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useState } from "react"
import { z } from "zod"

import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar"
import type { DataTableRowAction } from "@/components/ui/data-table/data-table-types"
import { useDataTable } from "@/hooks/use-data-table"
import { GetTransactionsResponse, getTransactions, getTransactionsParamsSchema } from "@/lib/functions"
import { Route } from ".."
import { transactionsColumns } from "./columns"
import { TransactionsFilter } from "./transactions-filter"

type Transaction = GetTransactionsResponse["data"][number]
type TransactionFilterParams = z.infer<typeof getTransactionsParamsSchema>

export function getTransactionsInfiniteOptions(filters: Partial<TransactionFilterParams>) {
  return infiniteQueryOptions({
    queryKey: ["transactions", filters],
    queryFn: ({ pageParam }) =>
      getTransactions({
        data: {
          ...filters,
          cursor: pageParam as string
        }
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: GetTransactionsResponse) => lastPage.meta.cursor ?? undefined
  })
}

export function TransactionsTable() {
  const searchParams = Route.useSearch()
  const [rowAction, setRowAction] = useState<DataTableRowAction<Transaction> | null>(null)

  const sortParam =
    searchParams.sort && searchParams.sort.length > 0
      ? [searchParams.sort[0].id, searchParams.sort[0].desc ? "desc" : "asc"]
      : null

  const infiniteQuery = useSuspenseInfiniteQuery(
    getTransactionsInfiniteOptions({
      ...searchParams,
      sort: sortParam
    })
  )

  // Simple data reference - no complex logic
  const data = infiniteQuery.data?.pages?.flatMap((page) => page.data) ?? []

  const dataTable = useDataTable({
    data,
    columns: transactionsColumns,
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
    enableRowSelection: true
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar table={dataTable.table}>
        <TransactionsFilter />
      </DataTableToolbar>

      <DataTable
        dataTable={dataTable}
        onFetchMore={infiniteQuery.fetchNextPage}
        hasNextPage={infiniteQuery.hasNextPage}
        isFetchingNextPage={infiniteQuery.isFetchingNextPage}
      />

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-muted-foreground text-sm">
          {dataTable.table.getFilteredSelectedRowModel().rows.length} of {data.length} row(s) selected.
        </div>
        <div className="text-muted-foreground text-sm">
          Loaded {data.length} transactions
          {infiniteQuery.hasNextPage && " (more available)"}
        </div>
      </div>

      {rowAction && <div>{/* Your existing row action modal/drawer components */}</div>}
    </div>
  )
}
