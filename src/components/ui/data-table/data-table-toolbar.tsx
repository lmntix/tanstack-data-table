import { useNavigate } from "@tanstack/react-router"
import type { Column, Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import * as React from "react"
import { useDebounceValue } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import { DataTableDateFilter } from "@/components/ui/data-table/data-table-date-filter"
import { DataTableFacetedFilter } from "@/components/ui/data-table/data-table-faceted-filter"
import { DataTableSliderFilter } from "@/components/ui/data-table/data-table-slider-filter"
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table, children, className, ...props }: DataTableToolbarProps<TData>) {
  const navigate = useNavigate()
  const isFiltered = table.getState().columnFilters.length > 0

  const columns = React.useMemo(() => table.getAllColumns().filter((column) => column.getCanFilter()), [table])

  const onReset = navigate({
    to: ".",
    search: {}
  })

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn("flex w-full items-start justify-between gap-2 p-1", className)}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} />
        ))}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="outline"
            size="sm"
            className="border-border"
            onClick={() => onReset}
          >
            <X />
            Reset
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>
}

function DataTableToolbarFilter<TData>({ column }: DataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta
  const [inputValue, setInputValue] = React.useState((column.getFilterValue() as string) ?? "")
  const [debouncedValue] = useDebounceValue(inputValue, 500)

  React.useEffect(() => {
    setInputValue((column.getFilterValue() as string) ?? "")
  }, [column.getFilterValue()])

  React.useEffect(() => {
    column.setFilterValue(debouncedValue || undefined)
  }, [debouncedValue, column])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const onFilterRender = React.useCallback(() => {
    if (!columnMeta?.variant) return null

    switch (columnMeta.variant) {
      case "text":
        return (
          <Input
            placeholder={columnMeta.placeholder ?? columnMeta.label}
            value={inputValue}
            onChange={handleChange}
            className="h-8 w-40 lg:w-56"
          />
        )

      case "number":
        return (
          <div className="relative">
            <Input
              type="number"
              inputMode="numeric"
              placeholder={columnMeta.placeholder ?? columnMeta.label}
              value={inputValue}
              onChange={handleChange}
              className={cn("h-8 w-[120px]", columnMeta.unit && "pr-8")}
            />
            {columnMeta.unit && (
              <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                {columnMeta.unit}
              </span>
            )}
          </div>
        )

      case "range":
        return <DataTableSliderFilter column={column} title={columnMeta.label ?? column.id} />

      case "date":
      case "dateRange":
        return (
          <DataTableDateFilter
            column={column}
            title={columnMeta.label ?? column.id}
            multiple={columnMeta.variant === "dateRange"}
          />
        )

      case "select":
      case "multiSelect":
        return (
          <DataTableFacetedFilter
            column={column}
            title={columnMeta.label ?? column.id}
            options={columnMeta.options ?? []}
            multiple={columnMeta.variant === "multiSelect"}
          />
        )

      default:
        return null
    }
  }, [column, columnMeta, inputValue, handleChange])

  return onFilterRender()
}
