import { useNavigate } from "@tanstack/react-router"
import type { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff, X } from "lucide-react"
import { useCallback } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface DataTableColumnHeaderProps<TData, TValue> extends React.ComponentProps<typeof Button> {
  column: Column<TData, TValue>
  title: string
  showDropdown?: boolean // Option to show dropdown menu
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  showDropdown = true,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const navigate = useNavigate()

  // Simple sort toggle: asc -> desc -> null
  const handleSortToggle = useCallback(() => {
    if (!column.getCanSort()) return

    const currentSort = column.getIsSorted()

    if (currentSort === "asc") {
      // Switch to descending
      navigate({
        to: ".",
        search: (prev) => ({ ...prev, sort: [{ id: column.id, desc: true }] })
      })
    } else if (currentSort === "desc") {
      // Clear sort
      navigate({
        to: ".",
        search: (prev) => {
          const { sort, ...rest } = prev
          return rest
        }
      })
    } else {
      // Set to ascending
      navigate({
        to: ".",
        search: (prev) => ({ ...prev, sort: [{ id: column.id, desc: false }] })
      })
    }
  }, [column, navigate])

  const handleResetSort = useCallback(() => {
    navigate({
      to: ".",
      search: (prev) => {
        const { sort, ...rest } = prev
        return rest
      }
    })
  }, [navigate])

  const handleSortAsc = useCallback(() => {
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, sort: [{ id: column.id, desc: false }] })
    })
  }, [column, navigate])

  const handleSortDesc = useCallback(() => {
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, sort: [{ id: column.id, desc: true }] })
    })
  }, [column, navigate])

  const currentSort = column.getIsSorted()

  // Non-sortable columns just display the title with default cursor
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn("cursor-default", className)}>{title}</div>
  }

  // Sortable columns - use single click button as default
  if (column.getCanSort() && !showDropdown) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-8 p-0 font-normal hover:bg-transparent flex items-center gap-1.5 cursor-pointer", className)}
        onClick={handleSortToggle}
        {...props}
      >
        <span>{title}</span>
        {currentSort === "asc" && <ArrowUp className="h-4 w-4" />}
        {currentSort === "desc" && <ArrowDown className="h-4 w-4" />}
      </Button>
    )
  }

  // Dropdown menu (only if explicitly requested or column can hide)
  if (showDropdown || column.getCanHide()) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 p-0 font-normal hover:bg-transparent flex items-center gap-1.5",
              column.getCanSort() ? "cursor-pointer" : "cursor-default",
              className
            )}
            {...props}
          >
            <span>{title}</span>
            {column.getCanSort() && (
              <>
                {currentSort === "asc" && <ArrowUp className="h-4 w-4" />}
                {currentSort === "desc" && <ArrowDown className="h-4 w-4" />}
                {!currentSort && <ChevronsUpDown className="h-4 w-4" />}
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-28">
          {column.getCanSort() && (
            <>
              <DropdownMenuCheckboxItem
                className="relative gap-2 pl-2 pr-8 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                checked={currentSort === "asc"}
                onClick={handleSortAsc}
              >
                <ArrowUp className="h-4 w-4" />
                Asc
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className="relative gap-2 pl-2 pr-8 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                checked={currentSort === "desc"}
                onClick={handleSortDesc}
              >
                <ArrowDown className="h-4 w-4" />
                Desc
              </DropdownMenuCheckboxItem>
              {currentSort && (
                <DropdownMenuItem className="gap-2 pl-2" onClick={handleResetSort}>
                  <X className="h-4 w-4" />
                  Reset
                </DropdownMenuItem>
              )}
            </>
          )}
          {column.getCanHide() && (
            <DropdownMenuCheckboxItem
              className="relative gap-2 pl-2 pr-8 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
              checked={!column.getIsVisible()}
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeOff className="h-4 w-4" />
              Hide
            </DropdownMenuCheckboxItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Fallback - just display title with default cursor
  return <div className={cn("cursor-default", className)}>{title}</div>
}
