import { useVirtualizer } from "@tanstack/react-virtual"
import { ArrowDown, ArrowUp, Edit, Eye, MoreHorizontal, Settings, Trash2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data generator with delay
const generateMockData = (count = 1000) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ["Admin", "User", "Manager"][i % 3],
    status: ["Active", "Inactive", "Pending"][i % 3],
    joinDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toLocaleDateString(),
    department: ["Engineering", "Marketing", "Sales", "HR"][i % 4],
    projects: Math.floor(Math.random() * 10) + 1,
    invoices: Math.floor(Math.random() * 50) + 1,
    tags: ["React", "TypeScript", "Node.js"][i % 3],
    phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    location: ["New York", "San Francisco", "London", "Tokyo"][i % 4]
  }))
}

// Column visibility control component
const ColumnVisibilityControl = ({ columns, visibleColumns, onVisibilityChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Settings className="mr-2 h-4 w-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Column Visibility</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            className="capitalize"
            checked={visibleColumns.has(column.key)}
            onCheckedChange={(checked) => onVisibilityChange(column.key, checked)}
          >
            {column.header}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Loading skeleton component
const DataTableSkeleton = ({ rows = 10, columns, height, rowHeight = 52 }) => {
  const selectColumnWidth = 50
  const actionsColumnWidth = 80

  return (
    <div className="rounded-md border">
      <div className="relative">
        {/* Header Skeleton */}
        <div className="border-b bg-muted/50">
          <div className="flex h-12 items-center">
            <div
              className="flex h-4 w-4 items-center justify-center border-r bg-background px-4"
              style={{ width: `${selectColumnWidth}px`, minWidth: `${selectColumnWidth}px` }}
            >
              <Skeleton className="h-4 w-4" />
            </div>
            {columns.map((column, index) => (
              <div
                key={index}
                className="flex items-center border-r px-4 py-2"
                style={{ width: `${column.width || 150}px`, minWidth: `${column.width || 150}px` }}
              >
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
            <div
              className="flex items-center justify-center border-l bg-background px-4"
              style={{ width: `${actionsColumnWidth}px`, minWidth: `${actionsColumnWidth}px` }}
            >
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>

        {/* Body Skeleton */}
        <div style={{ height: `${height - 48}px` }} className="overflow-hidden">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center border-b" style={{ height: `${rowHeight}px` }}>
              <div
                className="flex items-center justify-center border-r bg-background px-4"
                style={{ width: `${selectColumnWidth}px`, minWidth: `${selectColumnWidth}px` }}
              >
                <Skeleton className="h-4 w-4" />
              </div>
              {columns.map((column, colIndex) => (
                <div
                  key={colIndex}
                  className="flex items-center border-r px-4 py-2"
                  style={{ width: `${column.width || 150}px`, minWidth: `${column.width || 150}px` }}
                >
                  <Skeleton className="h-4 w-full max-w-[80%]" />
                </div>
              ))}
              <div
                className="flex items-center justify-center border-l bg-background px-4"
                style={{ width: `${actionsColumnWidth}px`, minWidth: `${actionsColumnWidth}px` }}
              >
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Sortable header component
const SortableHeader = ({ children, sortKey, currentSort, onSort, className = "" }) => {
  const [column, direction] = currentSort || []
  const isActive = column === sortKey

  const handleSort = () => {
    console.log("Sort clicked:", sortKey, "Current:", currentSort)

    if (sortKey === column) {
      if (direction === "asc") {
        onSort([sortKey, "desc"])
      } else if (direction === "desc") {
        onSort(null)
      } else {
        onSort([sortKey, "asc"])
      }
    } else {
      onSort([sortKey, "asc"])
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-auto justify-start p-0 font-medium hover:bg-transparent ${className}`}
      onClick={handleSort}
    >
      <span>{children}</span>
      {isActive && (
        <div className="ml-2">
          {direction === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        </div>
      )}
    </Button>
  )
}

// Actions dropdown component
const DataTableRowActions = ({ row, onAction }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => onAction?.("view", row)}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction?.("edit", row)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction?.("delete", row)} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const DataTable = ({
  data,
  columns,
  height = 600,
  onRowSelect,
  onAction,
  onSort,
  selectable = true,
  actions = true,
  rowHeight = 52,
  loading = false,
  currentSort = null,
  className = "",
  defaultHiddenColumns = []
}) => {
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const visible = new Set(columns.map((col) => col.key))
    defaultHiddenColumns.forEach((key) => visible.delete(key))
    return visible
  })

  const tableRef = useRef(null)
  const headerRef = useRef(null)
  const bodyRef = useRef(null)

  // Filter visible columns
  const filteredColumns = useMemo(() => columns.filter((col) => visibleColumns.has(col.key)), [columns, visibleColumns])

  // Handle column visibility change
  const handleVisibilityChange = useCallback((columnKey, visible) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev)
      if (visible) {
        newSet.add(columnKey)
      } else {
        newSet.delete(columnKey)
      }
      return newSet
    })
  }, [])

  // Sync horizontal scroll between header and body
  const handleBodyScroll = useCallback((e) => {
    if (headerRef.current) {
      headerRef.current.scrollLeft = e.target.scrollLeft
    }
  }, [])

  const handleHeaderScroll = useCallback((e) => {
    if (bodyRef.current) {
      bodyRef.current.scrollLeft = e.target.scrollLeft
    }
  }, [])

  // TanStack Virtual setup
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => bodyRef.current,
    estimateSize: () => rowHeight,
    overscan: 5
  })

  // Handle row selection
  const handleRowSelect = useCallback(
    (rowId, checked) => {
      const newSelection = new Set(selectedRows)
      if (checked) {
        newSelection.add(rowId)
      } else {
        newSelection.delete(rowId)
      }
      setSelectedRows(newSelection)
      onRowSelect?.(Array.from(newSelection))
    },
    [selectedRows, onRowSelect]
  )

  // Handle select all
  const handleSelectAll = useCallback(
    (checked) => {
      if (checked) {
        const allIds = new Set(data.map((row) => row.id))
        setSelectedRows(allIds)
        onRowSelect?.(data.map((row) => row.id))
      } else {
        setSelectedRows(new Set())
        onRowSelect?.([])
      }
    },
    [data, onRowSelect]
  )

  const isAllSelected = selectedRows.size === data.length && data.length > 0
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < data.length

  // Calculate widths
  const selectColumnWidth = selectable ? 50 : 0
  const actionsColumnWidth = actions ? 80 : 0
  const contentColumnsWidth = filteredColumns.reduce((sum, col) => sum + (col.width || 150), 0)
  const totalWidth = selectColumnWidth + contentColumnsWidth + actionsColumnWidth

  if (loading) {
    return (
      <div className={className}>
        <DataTableSkeleton
          rows={Math.floor((height - 48) / rowHeight)}
          columns={filteredColumns}
          height={height}
          rowHeight={rowHeight}
        />
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Column Visibility Control */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold text-lg">Data Table</h2>
          <span className="text-muted-foreground text-sm">({data.length.toLocaleString()} rows)</span>
        </div>
        <ColumnVisibilityControl
          columns={columns}
          visibleColumns={visibleColumns}
          onVisibilityChange={handleVisibilityChange}
        />
      </div>

      <div className="rounded-md border" ref={tableRef}>
        <div className="relative">
          {/* Sticky Header */}
          <div
            ref={headerRef}
            className="sticky top-0 z-10 overflow-hidden border-b bg-background"
            onScroll={handleHeaderScroll}
          >
            <div style={{ width: `${totalWidth}px` }} className="flex h-12 items-center">
              {/* Select Column Header */}
              {selectable && (
                <div
                  className="sticky left-0 z-20 flex items-center justify-center border-r bg-background px-4"
                  style={{ width: `${selectColumnWidth}px`, minWidth: `${selectColumnWidth}px` }}
                >
                  <Checkbox
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate
                    }}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </div>
              )}

              {/* Content Column Headers */}
              {filteredColumns.map((column, index) => (
                <div
                  key={column.key || index}
                  className="flex items-center border-r px-4 py-2 text-left"
                  style={{ width: `${column.width || 150}px`, minWidth: `${column.width || 150}px` }}
                >
                  {column.sortable ? (
                    <SortableHeader sortKey={column.key} currentSort={currentSort} onSort={onSort}>
                      {column.header}
                    </SortableHeader>
                  ) : (
                    <span className="font-medium text-sm">{column.header}</span>
                  )}
                </div>
              ))}

              {/* Actions Column Header */}
              {actions && (
                <div
                  className="sticky right-0 z-20 flex items-center justify-center border-l bg-background px-4"
                  style={{ width: `${actionsColumnWidth}px`, minWidth: `${actionsColumnWidth}px` }}
                >
                  <span className="font-medium text-sm">Actions</span>
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Body */}
          <div
            ref={bodyRef}
            className="overflow-auto"
            style={{ height: `${height - 48}px` }}
            onScroll={handleBodyScroll}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: `${totalWidth}px`,
                position: "relative"
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = data[virtualRow.index]
                const isSelected = selectedRows.has(row.id)

                return (
                  <div
                    key={virtualRow.key}
                    className={`absolute flex w-full items-center border-b transition-colors hover:bg-muted/50 ${
                      isSelected ? "bg-muted" : ""
                    }`}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`
                    }}
                  >
                    {/* Select Column Cell */}
                    {selectable && (
                      <div
                        className="sticky left-0 z-10 flex items-center justify-center border-r bg-background px-4"
                        style={{ width: `${selectColumnWidth}px`, minWidth: `${selectColumnWidth}px` }}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleRowSelect(row.id, checked)}
                          aria-label={`Select row ${row.id}`}
                        />
                      </div>
                    )}

                    {/* Content Cells */}
                    {filteredColumns.map((column, colIndex) => {
                      const cellValue = column.accessor ? column.accessor(row) : row[column.key]
                      const displayValue = column.render ? column.render(cellValue, row) : cellValue

                      return (
                        <div
                          key={column.key || colIndex}
                          className="flex items-center border-r px-4 py-2 text-sm"
                          style={{ width: `${column.width || 150}px`, minWidth: `${column.width || 150}px` }}
                        >
                          <div className="truncate" title={String(cellValue)}>
                            {displayValue}
                          </div>
                        </div>
                      )
                    })}

                    {/* Actions Column Cell */}
                    {actions && (
                      <div
                        className="sticky right-0 z-10 flex items-center justify-center border-l bg-background px-4"
                        style={{ width: `${actionsColumnWidth}px`, minWidth: `${actionsColumnWidth}px` }}
                      >
                        <DataTableRowActions row={row} onAction={onAction} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Selection Footer */}
        {selectedRows.size > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-2 text-muted-foreground text-sm">
            <span>
              {selectedRows.size} of {data.length} row(s) selected
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Demo component
const DataTableDemo = () => {
  const [selectedRows, setSelectedRows] = useState([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSort, setCurrentSort] = useState(null)

  // Simulate data loading with delay
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setData(generateMockData(10000))
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const columns = useMemo(
    () => [
      {
        key: "id",
        header: "ID",
        width: 80,
        sortable: true,
        render: (value) => <span className="font-mono">#{value}</span>
      },
      {
        key: "name",
        header: "Name",
        width: 200,
        sortable: true,
        render: (value) => <span className="font-medium">{value}</span>
      },
      {
        key: "email",
        header: "Email",
        width: 250,
        sortable: true
      },
      {
        key: "role",
        header: "Role",
        width: 120,
        sortable: true,
        render: (value) => (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${
              value === "Admin"
                ? "bg-red-100 text-red-800"
                : value === "Manager"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {value}
          </span>
        )
      },
      {
        key: "status",
        header: "Status",
        width: 120,
        sortable: true,
        render: (value) => (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${
              value === "Active"
                ? "bg-green-100 text-green-800"
                : value === "Inactive"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {value}
          </span>
        )
      },
      {
        key: "phone",
        header: "Phone",
        width: 150,
        sortable: true
      },
      {
        key: "location",
        header: "Location",
        width: 120,
        sortable: true
      },
      {
        key: "projects",
        header: "Projects",
        width: 100,
        sortable: true,
        render: (value) => <span className="text-right font-mono">{value}</span>
      },
      {
        key: "invoices",
        header: "Invoices",
        width: 100,
        sortable: true,
        render: (value) => <span className="text-right font-mono">{value}</span>
      },
      {
        key: "tags",
        header: "Tags",
        width: 120,
        sortable: false,
        render: (value) => (
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-700 text-xs ring-1 ring-blue-700/10 ring-inset">
            {value}
          </span>
        )
      },
      {
        key: "joinDate",
        header: "Join Date",
        width: 120,
        sortable: true
      },
      {
        key: "department",
        header: "Department",
        width: 150,
        sortable: true
      }
    ],
    []
  )

  const handleRowSelect = useCallback((rows) => {
    setSelectedRows(rows)
    console.log("Selected rows:", rows)
  }, [])

  const handleAction = useCallback((action, row) => {
    console.log(`${action} action for:`, row)
    alert(`${action.toUpperCase()} action for ${row.name}`)
  }, [])

  const handleSort = useCallback((sortParams) => {
    console.log("Sort changed:", sortParams)
    setCurrentSort(sortParams)
  }, [])

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl tracking-tight">Production DataTable</h1>
        <p className="text-muted-foreground">
          Advanced data table with column visibility, synchronized scrolling, and proper alignment.
        </p>
      </div>

      <DataTable
        data={data}
        columns={columns}
        height={600}
        onRowSelect={handleRowSelect}
        onAction={handleAction}
        onSort={handleSort}
        selectable={true}
        actions={true}
        rowHeight={52}
        loading={loading}
        currentSort={currentSort}
        defaultHiddenColumns={["phone", "location", "invoices"]} // Hide some columns by default
        className="w-full"
      />

      {!loading && selectedRows.length > 0 && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <h3 className="font-semibold">Selection Summary</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            {selectedRows.length} rows selected: {selectedRows.slice(0, 5).join(", ")}
            {selectedRows.length > 5 && ` and ${selectedRows.length - 5} more...`}
          </p>
        </div>
      )}

      {!loading && (
        <div className="rounded-lg border bg-muted/50 p-4 text-muted-foreground text-sm">
          <h4 className="font-medium text-foreground">Enhanced Features</h4>
          <ul className="mt-2 space-y-1">
            <li>✅ Perfect header-row width alignment</li>
            <li>✅ Full background color on pinned columns</li>
            <li>✅ Vertical borders for column separation</li>
            <li>✅ Column visibility control dropdown</li>
            <li>✅ Some columns hidden by default (Phone, Location, Invoices)</li>
            <li>✅ TanStack Virtual for performance</li>
            <li>✅ Synchronized horizontal scrolling</li>
            <li>✅ Professional UI with shadcn/ui</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default DataTableDemo
