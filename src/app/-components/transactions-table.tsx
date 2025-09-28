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
import { columns } from "./columns"
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
  const [rowAction, _setRowAction] = useState<DataTableRowAction<Transaction> | null>(null)

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
    columns,
    containerHeight: "calc(100vh - 200px)",
    rowHeight: 50,
    initialState: {
      columnPinning: { right: ["actions"], left: ["select"] },
      columnVisibility: {
        // id: false,
        // description: false,
        // createdAt: false,
        // updatedAt: false,
        // metadata: false,
        // tags: false,
        // notes: false,
        // isInternal: false
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

      <div className="flex w-full items-center justify-between bg-muted/50 px-3 py-2 text-sm" aria-live="polite">
        <div className="flex-1 text-muted-foreground leading-6">
          <span className="font-medium text-foreground tabular-nums">
            {dataTable.table.getFilteredSelectedRowModel().rows.length}
          </span>
          <span className="mx-1">of</span>
          <span className="font-medium text-foreground tabular-nums">{data.length}</span>
          <span className="ml-1">row(s) selected</span>
        </div>

        <div className="whitespace-nowrap text-muted-foreground leading-6">
          <span>Loaded </span>
          <span className="font-medium text-foreground tabular-nums">{data.length}</span>
          <span className="ml-1">records</span>
          {infiniteQuery.hasNextPage && (
            <span className="ml-2 bg-muted px-2 py-0.5 font-medium text-foreground/80 text-xs">more available</span>
          )}
        </div>
      </div>

      {rowAction && <div>{/* Your existing row action modal/drawer components */}</div>}
    </div>
  )
}
