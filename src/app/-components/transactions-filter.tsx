import { useNavigate, useSearch } from "@tanstack/react-router"
import { formatISO } from "date-fns"
import { ArrowUpDown, Banknote, CalendarDays, CheckCircle, DollarSign, Filter, Search, X } from "lucide-react"
import { useId, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { getTransactionsParamsSchema } from "@/lib/functions"
import { cn } from "@/lib/utils"

// Define the transaction filter schema by omitting cursor and pageSize
const transactionFilterSchema = getTransactionsParamsSchema.omit({
  cursor: true,
  pageSize: true
})

type StatusFilter = "completed" | "pending" | "cancelled" | "failed"
type TypeFilter = "income" | "expense" | "transfer"

interface BaseFilterItem {
  name: string
}

interface FilterItem<T extends string> extends BaseFilterItem {
  id: T
}

interface FilterMenuItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}

interface FilterCheckboxItemProps {
  id: string
  name: string
  checked?: boolean
  className?: string
  onCheckedChange: () => void
}

interface FilterListProps {
  filters: Array<{ key: string; label: string; value: string }>
  onRemove: (key: string) => void
}

const statusFilters: FilterItem<StatusFilter>[] = [
  { id: "completed", name: "Completed" },
  { id: "pending", name: "Pending" },
  { id: "cancelled", name: "Cancelled" },
  { id: "failed", name: "Failed" }
]

const typeFilters: FilterItem<TypeFilter>[] = [
  { id: "income", name: "Income" },
  { id: "expense", name: "Expense" },
  { id: "transfer", name: "Transfer" }
]

function FilterMenuItem({ icon: Icon, label, children }: FilterMenuItemProps) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="w-56">
          <DropdownMenuGroup>{children}</DropdownMenuGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}

function FilterCheckboxItem({ id, name, checked = false, onCheckedChange, className }: FilterCheckboxItemProps) {
  return (
    <DropdownMenuCheckboxItem key={id} checked={checked} onCheckedChange={onCheckedChange} className={className}>
      {name}
    </DropdownMenuCheckboxItem>
  )
}

function FilterList({ filters, onRemove }: FilterListProps) {
  if (filters.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Badge key={filter.key} variant="secondary" className="flex items-center gap-1">
          <span className="text-xs">
            {filter.label}: {filter.value}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
            onClick={() => onRemove(filter.key)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  )
}

function updateArrayFilter(
  value: string,
  currentValues: string[] | null | undefined,
  setFilter: (update: Record<string, unknown>) => void,
  key: string
) {
  const current = currentValues || []
  const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]

  setFilter({ [key]: updated.length > 0 ? updated : null })
}

export function TransactionsFilter() {
  const navigate = useNavigate()
  const searchParams = useSearch({ strict: false })
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const amountFromId = useId()
  const amountToId = useId()
  
  // Parse current filters from search params
  const currentFilters = transactionFilterSchema.parse(searchParams)

  const setFilter = (update: Record<string, unknown>) => {
    navigate({
      to: ".",
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        ...update
      })
    })
  }

  const removeFilter = (key: string) => {
    navigate({
      to: ".",
      search: (prev: Record<string, unknown>) => {
        const { [key]: _, ...rest } = prev
        return rest
      }
    })
  }

  const handleSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value
    setFilter({ search: value || null })
  }

  const handleSubmit = async () => {
    // Form submission handled by onChange
  }

  // Convert current filters to display format
  const activeFilters = Object.entries(currentFilters)
    .filter(([key, value]) => key !== "sort" && value !== null && value !== undefined && value !== "")
    .map(([key, value]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: Array.isArray(value) ? value.join(", ") : String(value)
    }))

  const hasValidFilters = activeFilters.length > 0

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex w-full flex-col items-stretch space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 md:w-auto">
        <form
          className="relative flex-1 sm:flex-initial"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <Search className="pointer-events-none absolute top-[11px] left-3 h-4 w-4" />
          <Input
            ref={inputRef}
            placeholder="Search transactions..."
            className="w-full pr-8 pl-9 sm:w-[350px]"
            value={currentFilters.search || ""}
            onChange={handleSearch}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
          />

          <DropdownMenuTrigger asChild>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              type="button"
              className={cn(
                "absolute top-[10px] right-3 z-10 opacity-50 transition-opacity duration-300 hover:opacity-100",
                hasValidFilters && "opacity-100",
                isOpen && "opacity-100"
              )}
            >
              <Filter className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
        </form>

        <FilterList filters={activeFilters} onRemove={removeFilter} />
      </div>

      <DropdownMenuContent className="w-[350px]" align="end" sideOffset={19} alignOffset={-11} side="top">
        <FilterMenuItem icon={CalendarDays} label="Date">
          <Calendar
            mode="range"
            initialFocus
            toDate={new Date()}
            selected={{
              from: currentFilters.dateFrom ? new Date(currentFilters.dateFrom) : undefined,
              to: currentFilters.dateTo ? new Date(currentFilters.dateTo) : undefined
            }}
            onSelect={(range) => {
              if (!range) return

              const newRange = {
                dateFrom: range.from ? formatISO(range.from, { representation: "date" }) : null,
                dateTo: range.to ? formatISO(range.to, { representation: "date" }) : null
              }

              setFilter(newRange)
            }}
          />
        </FilterMenuItem>

        <FilterMenuItem icon={DollarSign} label="Amount">
          <div className="space-y-2 p-2">
            <div>
              <label htmlFor={amountFromId} className="font-medium text-sm">
                From
              </label>
              <Input
                id={amountFromId}
                type="number"
                placeholder="Min amount"
                value={currentFilters.amountFrom || ""}
                onChange={(e) => setFilter({ amountFrom: e.target.value ? Number(e.target.value) : null })}
              />
            </div>
            <div>
              <label htmlFor={amountToId} className="font-medium text-sm">
                To
              </label>
              <Input
                id={amountToId}
                type="number"
                placeholder="Max amount"
                value={currentFilters.amountTo || ""}
                onChange={(e) => setFilter({ amountTo: e.target.value ? Number(e.target.value) : null })}
              />
            </div>
          </div>
        </FilterMenuItem>

        <FilterMenuItem icon={CheckCircle} label="Status">
          {statusFilters.map(({ id, name }) => (
            <FilterCheckboxItem
              key={id}
              id={id}
              name={name}
              checked={currentFilters?.statuses?.includes(id)}
              onCheckedChange={() => updateArrayFilter(id, currentFilters.statuses, setFilter, "statuses")}
            />
          ))}
        </FilterMenuItem>

        <FilterMenuItem icon={ArrowUpDown} label="Type">
          {typeFilters.map(({ id, name }) => (
            <FilterCheckboxItem
              key={id}
              id={id}
              name={name}
              checked={currentFilters?.types?.includes(id)}
              onCheckedChange={() => updateArrayFilter(id, currentFilters.types, setFilter, "types")}
            />
          ))}
        </FilterMenuItem>

        <FilterMenuItem icon={Banknote} label="Currency">
          <div className="p-2">
            <Input
              placeholder="e.g., USD, EUR"
              value={currentFilters.currency || ""}
              onChange={(e) => setFilter({ currency: e.target.value || null })}
            />
          </div>
        </FilterMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
