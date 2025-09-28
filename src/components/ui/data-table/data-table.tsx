// components/ui/data-table/data-table.tsx
import { flexRender } from "@tanstack/react-table"
import { Skeleton } from "@/components/ui/skeleton"
import type { useDataTable } from "@/hooks/use-data-table"
import { cn } from "@/lib/utils"

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

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-2 p-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="flex space-x-4">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-8" />
        </div>
      ))}
    </div>
  )

  // No data component
  const NoData = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-muted-foreground text-sm">
        <div className="mb-2">No transactions found</div>
        <div className="text-xs">Try adjusting your filters or create a new transaction</div>
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
        <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm border-b w-full">
          {headerGroups.map((headerGroup) => (
            <div key={headerGroup.id} className="flex w-full">
              {headerGroup.headers.map((header) => {
                const isPinned = header.column.getIsPinned()
                const isLeft = isPinned === "left"
                const isRight = isPinned === "right"

                return (
                  <div
                    key={header.id}
                    className={cn(
                      "flex items-center h-12 px-4 text-left align-middle font-normal text-muted-foreground border-r text-sm",
                      "[&:has([role=checkbox])]:pr-0",
                      isLeft && "sticky left-0 z-20 bg-muted/80 backdrop-blur-sm",
                      isRight && "sticky right-0 z-20 bg-muted/80 backdrop-blur-sm"
                    )}
                    style={{
                      width: `${header.getSize()}px`,
                      minWidth: `${header.getSize()}px`,
                      flex: "1 0 auto",
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
              width: "100%"
            }}
          >
            {virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index]
              if (!row) return null

              return (
                <div
                  key={row.id}
                  className={cn(
                    "flex border-b transition-colors hover:bg-muted/50 w-full text-sm",
                    row.getIsSelected() && "bg-muted",
                    onRowClick && "cursor-pointer"
                  )}
                  style={{
                    position: "absolute",
                    transform: `translateY(${virtualRow.start}px)`,
                    height: `${virtualRow.size}px`
                  }}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isPinned = cell.column.getIsPinned()
                    const isLeft = isPinned === "left"
                    const isRight = isPinned === "right"

                    return (
                      <div
                        key={cell.id}
                        className={cn(
                          "flex items-center p-4 align-middle border-r",
                          "[&:has([role=checkbox])]:pr-0",
                          isLeft && "sticky left-0 z-10 bg-background",
                          isRight && "sticky right-0 z-10 bg-background"
                        )}
                        style={{
                          width: `${cell.column.getSize()}px`,
                          minWidth: `${cell.column.getSize()}px`,
                          flex: "1 0 auto",
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
          <div className="sticky bottom-0 flex items-center justify-center p-4 text-sm text-muted-foreground bg-background border-t z-10">
            Loading more...
          </div>
        )}

        {!hasNextPage && rows.length > 0 && !isLoading && (
          <div className="sticky bottom-0 flex items-center justify-center p-4 text-sm text-muted-foreground bg-background border-t z-10">
            No more data to load
          </div>
        )}
      </div>
    </div>
  )
}
