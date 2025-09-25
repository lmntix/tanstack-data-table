"use client"

import { useNavigate, useSearch } from "@tanstack/react-router"
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  useReactTable,
  type VisibilityState
} from "@tanstack/react-table"
import * as React from "react"
import { useDebounceCallback } from "usehooks-ts"
import type { ExtendedColumnSort } from "@/components/ui/data-table/data-table-types"
import { getSortingStateSchema } from "@/components/ui/data-table/parsers"

const DEBOUNCE_MS = 300

interface UseDataTableProps<TData>
  extends Omit<
    TableOptions<TData>,
    "state" | "getCoreRowModel" | "manualFiltering" | "manualPagination" | "manualSorting"
  > {
  initialState?: Omit<Partial<TableState>, "sorting"> & {
    sorting?: ExtendedColumnSort<TData>[]
  }
  debounceMs?: number
  clearOnDefault?: boolean
  shallow?: boolean
  onRowClick?: (row: TData) => void
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const { columns, initialState, debounceMs = DEBOUNCE_MS, shallow = true, onRowClick, ...tableProps } = props

  const navigate = useNavigate()
  const search = useSearch({ strict: false })

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialState?.columnVisibility ?? {})

  // Row selection state
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(initialState?.rowSelection ?? {})

  // Sorting state
  const columnIds = React.useMemo(() => {
    return new Set(columns.map((column) => column.id).filter(Boolean) as string[])
  }, [columns])

  const sortSchema = React.useMemo(() => getSortingStateSchema<TData>(columnIds), [columnIds])

  const sorting = React.useMemo(() => {
    const sortParam = search.sort
    return sortSchema.parse(sortParam || initialState?.sorting || [])
  }, [search, sortSchema, initialState?.sorting])

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      const newSorting = typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue

      navigate({
        to: ".",
        search: (prev) => {
          if (!newSorting || newSorting.length === 0) {
            const { sort: _, ...rest } = prev
            return rest
          }
          return { ...prev, sort: newSorting }
        }
      })
    },
    [navigate, sorting]
  )

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const debouncedSetColumnFilters = useDebounceCallback((filters: ColumnFiltersState) => {
    const filterUpdates: Record<string, string | string[] | null> = {}

    filters.forEach((filter) => {
      filterUpdates[filter.id] = filter.value as string | string[]
    })

    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        ...filterUpdates
      })
    })
  }, debounceMs)

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      setColumnFilters((prev) => {
        const next = typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue
        debouncedSetColumnFilters(next)
        return next
      })
    },
    [debouncedSetColumnFilters]
  )

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true
  })

  return { table, shallow, debounceMs, onRowClick }
}
