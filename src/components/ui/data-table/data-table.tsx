import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"
import type * as React from "react"

import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { getCommonPinningStyles } from "@/utils/data-table"

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>
  actionBar?: React.ReactNode
  onRowClick?: (row: TData) => void
  showPagination?: boolean
}

export function DataTable<TData>({
  table,
  actionBar,
  onRowClick,
  showPagination = false,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  return (
    <div className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)} {...props}>
      {children}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(!header.column.getIsLastColumn() && "border-r")}
                    style={{
                      ...getCommonPinningStyles({ column: header.column, withBorder: true })
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={(e) => {
                    // Prevent row click if clicking on interactive elements
                    const target = e.target as HTMLElement
                    const isInteractiveElement = target.closest('button, input, a, [role="button"], [role="checkbox"]')

                    if (!isInteractiveElement) {
                      onRowClick?.(row.original)
                    }
                  }}
                  className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(!cell.column.getIsLastColumn() && "border-r")}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column })
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center border-r">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        {showPagination && <DataTablePagination table={table} />}
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  )
}
