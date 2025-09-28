// components/ui/data-table/data-table.tsx
import { flexRender } from "@tanstack/react-table"
import type { useDataTable } from "@/hooks/use-data-table"
import { cn } from "@/lib/utils"
import { DataTableSkeleton } from "./data-table-skeleton"

interface DataTableProps<TData> {
  dataTable: ReturnType<typeof useDataTable<TData>>
  onFetchMore?: () => void
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  isLoading?: boolean
  className?: string
}

export function DataTable<TData>({
  dataTable,
  onFetchMore,
  hasNextPage = false,
  isFetchingNextPage = false,
  isLoading = false,
  className
}: DataTableProps<TData>) {
  const { table, onRowClick, containerRef, containerHeight, virtualItems, totalSize } = dataTable

  // Auto-fetch more data when scrolling near bottom
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget

    if (scrollHeight - scrollTop - clientHeight < 300 && hasNextPage && !isFetchingNextPage && onFetchMore) {
      onFetchMore()
    }
  }

  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows

  // Calculate minimum table width based on column sizes
  const minTableWidth =
    headerGroups[0]?.headers.reduce((total, header) => {
      return total + header.getSize()
    }, 0) || 0

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <DataTableSkeleton
      cellWidths={["10rem", "30rem", "10rem", "10rem", "6rem", "6rem", "6rem"]}
      columnCount={6}
      shrinkZero
    />
  )

  // No data component
  const NoData = () => (
    <div
      className="flex flex-col items-center justify-center py-16 text-center bg-background w-full"
      style={{ minWidth: `${minTableWidth}px` }}
    >
      <div className="text-muted-foreground text-sm">
        <div className="mb-2">No data found</div>
        <div className="text-xs">Try adjusting your filters or create a new record</div>
      </div>
    </div>
  )

  return (
    <div className={cn("rounded-md border", className)}>
      <div
        ref={containerRef}
        className="relative overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        {/* Sticky Header */}
        <div
          className="sticky top-0 z-10 bg-background backdrop-blur-sm border-b w-full"
          style={{ minWidth: `${minTableWidth}px` }}
        >
          {headerGroups.map((headerGroup) => (
            <div key={headerGroup.id} className="flex w-full" style={{ minWidth: `${minTableWidth}px` }}>
              {headerGroup.headers.map((header) => {
                const isPinned = header.column.getIsPinned()
                const isLeft = isPinned === "left"
                const isRight = isPinned === "right"

                // Check if column should be flexible - ignore TanStack's getSize() for responsive columns
                const hasMaxSize = header.column.columnDef.maxSize !== undefined
                const shouldGrow = !hasMaxSize

                return (
                  <div
                    key={header.id}
                    className={cn(
                      "flex items-center h-12 px-4 text-left align-middle text-muted-foreground border-r",
                      "[&:has([role=checkbox])]:pr-0",
                      isLeft && "sticky left-0 z-20 bg-background backdrop-blur-sm",
                      isRight && "sticky border-l right-0 z-20 bg-background backdrop-blur-sm"
                    )}
                    style={{
                      // For responsive columns, don't set width - let flex handle it
                      ...(shouldGrow
                        ? {
                            minWidth: `${header.getSize()}px`,
                            flex: "1 1 0%" // Changed to 0% base to allow true growth
                          }
                        : {
                            width: `${header.getSize()}px`,
                            minWidth: `${header.getSize()}px`,
                            maxWidth: header.column.columnDef.maxSize
                              ? `${header.column.columnDef.maxSize}px`
                              : `${header.getSize()}px`,
                            flex: "0 0 auto"
                          }),
                      ...(isLeft && {
                        left: `${header.column.getStart("left")}px`,
                        boxShadow: "2px 0 4px -2px rgba(0,0,0,0.1)"
                      }),
                      ...(isRight && {
                        right: `${header.column.getAfter("right")}px`,
                        boxShadow: "-2px 0 4px -2px rgba(0,0,0,0.1)"
                      })
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Content Area */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : rows.length === 0 ? (
          <NoData />
        ) : (
          /* Virtual Body */
          <div
            style={{
              height: `${totalSize}px`,
              position: "relative",
              width: "100%",
              minWidth: `${minTableWidth}px`
            }}
          >
            {virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index]
              if (!row) return null

              return (
                <div
                  key={row.id}
                  className={cn(
                    "flex border-b transition-colors hover:bg-muted/50 text-sm bg-background w-full",
                    row.getIsSelected() && "bg-muted",
                    onRowClick && "cursor-pointer"
                  )}
                  style={{
                    position: "absolute",
                    transform: `translateY(${virtualRow.start}px)`,
                    height: `${virtualRow.size}px`,
                    minWidth: `${minTableWidth}px`
                  }}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isPinned = cell.column.getIsPinned()
                    const isLeft = isPinned === "left"
                    const isRight = isPinned === "right"

                    // Check if column should be flexible - ignore TanStack's getSize() for responsive columns
                    const hasMaxSize = cell.column.columnDef.maxSize !== undefined
                    const shouldGrow = !hasMaxSize

                    return (
                      <div
                        key={cell.id}
                        className={cn(
                          "flex items-center p-4 align-middle border-r",
                          "[&:has([role=checkbox])]:pr-0",
                          isLeft && "sticky left-0 z-10 bg-background",
                          isRight && "sticky border-l right-0 z-10 bg-background"
                        )}
                        style={{
                          // For responsive columns, don't set width - let flex handle it
                          ...(shouldGrow
                            ? {
                                minWidth: `${cell.column.getSize()}px`,
                                flex: "1 1 0%" // Changed to 0% base to allow true growth
                              }
                            : {
                                width: `${cell.column.getSize()}px`,
                                minWidth: `${cell.column.getSize()}px`,
                                maxWidth: cell.column.columnDef.maxSize
                                  ? `${cell.column.columnDef.maxSize}px`
                                  : `${cell.column.getSize()}px`,
                                flex: "0 0 auto"
                              }),
                          ...(isLeft && {
                            left: `${cell.column.getStart("left")}px`,
                            boxShadow: "2px 0 4px -2px rgba(0,0,0,0.1)"
                          }),
                          ...(isRight && {
                            right: `${cell.column.getAfter("right")}px`,
                            boxShadow: "-2px 0 4px -2px rgba(0,0,0,0.1)"
                          })
                        }}
                      >
                        <div className="truncate w-full">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}

        {/* Loading indicators */}
        {isFetchingNextPage && (
          <div className="bottom-0 flex items-center justify-center p-4 text-sm text-muted-foreground bg-background border-t z-10 w-full">
            Loading more...
          </div>
        )}

        {!hasNextPage && rows.length > 0 && !isLoading && (
          <div className=" bottom-0 flex items-center justify-center p-4 text-sm text-muted-foreground bg-background border-t z-10 w-full">
            No more data to load
          </div>
        )}
      </div>
    </div>
  )
}
