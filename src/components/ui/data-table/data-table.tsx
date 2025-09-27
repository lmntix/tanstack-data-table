// components/ui/data-table/data-table.tsx
import { flexRender } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { useDataTable } from "@/hooks/use-data-table"
import { cn } from "@/lib/utils"

interface DataTableProps<TData> {
  dataTable: ReturnType<typeof useDataTable<TData>>
  className?: string
}

export function DataTable<TData>({ dataTable, className }: DataTableProps<TData>) {
  const {
    table,
    onRowClick,
    containerRef,
    containerHeight,
    virtualItems,
    totalSize,
    fetchMoreOnBottomReached,
    hasNextPage,
    isFetchingNextPage
  } = dataTable

  return (
    <div className={cn("rounded-md border", className)}>
      <div
        ref={containerRef}
        className="relative overflow-auto"
        style={{ height: containerHeight }}
        onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
      >
        <Table style={{ display: "grid" }}>
          {/* Sticky Header */}
          <TableHeader
            className="bg-muted/50"
            style={{
              display: "grid",
              position: "sticky",
              top: 0,
              zIndex: 1
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} style={{ display: "flex", width: "100%" }}>
                {headerGroup.headers.map((header) => {
                  const isPinned = header.column.getIsPinned()
                  const isLeft = isPinned === "left"
                  const isRight = isPinned === "right"

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "flex items-center",
                        isLeft && "sticky left-0 z-10 bg-muted/50",
                        isRight && "sticky right-0 z-10 bg-muted/50"
                      )}
                      style={{
                        width: header.getSize(),
                        minWidth: header.column.columnDef.minSize,
                        maxWidth: header.column.columnDef.maxSize,
                        ...(isLeft && { left: `${header.column.getStart("left")}px` }),
                        ...(isRight && { right: `${header.column.getAfter("right")}px` })
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* Virtual Body */}
          <TableBody
            style={{
              display: "grid",
              height: `${totalSize}px`,
              position: "relative"
            }}
          >
            {virtualItems.map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index]
              if (!row) return null

              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer" : undefined}
                  style={{
                    display: "flex",
                    position: "absolute",
                    transform: `translateY(${virtualRow.start}px)`,
                    width: "100%",
                    height: `${virtualRow.size}px`
                  }}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isPinned = cell.column.getIsPinned()
                    const isLeft = isPinned === "left"
                    const isRight = isPinned === "right"

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "flex items-center",
                          isLeft && "sticky left-0 z-10 bg-background",
                          isRight && "sticky right-0 z-10 bg-background"
                        )}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize,
                          maxWidth: cell.column.columnDef.maxSize,
                          ...(isLeft && { left: `${cell.column.getStart("left")}px` }),
                          ...(isRight && { right: `${cell.column.getAfter("right")}px` })
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Loading indicators */}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground bg-background border-t">
            Loading more...
          </div>
        )}

        {!hasNextPage && table.getRowModel().rows.length > 0 && (
          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground bg-background border-t">
            No more data to load
          </div>
        )}
      </div>
    </div>
  )
}
