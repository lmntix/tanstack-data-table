import { useNavigate, useSearch } from "@tanstack/react-router"
import { format } from "date-fns"
import { CalendarIcon, Filter, X } from "lucide-react"
import { useId, useState } from "react"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// Filter schema based on the API parameters
const filterSchema = z.object({
  search: z.string().optional(),
  reference: z.string().optional(),
  counterparty: z.string().optional(),
  description: z.string().optional(),
  amountFrom: z.string().optional(),
  amountTo: z.string().optional(),
  currency: z.string().optional(),
  types: z.array(z.string()).optional(),
  statuses: z.array(z.string()).optional(),
  paymentMethods: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  isRecurring: z.string().optional(),
  isInternal: z.string().optional()
})

type FilterFormData = z.infer<typeof filterSchema>

// Mock data for select options - in a real app, these would come from your API
const transactionTypes = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
  { value: "transfer", label: "Transfer" }
]

const transactionStatuses = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" }
]

const paymentMethods = [
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
  { value: "check", label: "Check" }
]

const currencies = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "JPY", label: "JPY" }
]

const categories = [
  { value: "food", label: "Food & Dining" },
  { value: "transport", label: "Transportation" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "utilities", label: "Utilities" },
  { value: "healthcare", label: "Healthcare" }
]

interface TransactionsFilterProps {
  className?: string
}

export function TransactionsFilter({ className }: TransactionsFilterProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const search = useSearch({ strict: false })

  // Generate unique IDs for form elements
  const searchId = useId()
  const referenceId = useId()
  const counterpartyId = useId()
  const descriptionId = useId()
  const amountFromId = useId()
  const amountToId = useId()

  // Initialize form state from URL search params
  const [formData, setFormData] = useState<FilterFormData>({
    search: (search.search as string) || "",
    reference: (search.reference as string) || "",
    counterparty: (search.counterparty as string) || "",
    amountFrom: String(search.amountFrom || ""),
    amountTo: String(search.amountTo || ""),
    currency: (search.currency as string) || "",
    types: (search.types as string[]) || [],
    statuses: (search.statuses as string[]) || [],
    paymentMethods: (search.paymentMethods as string[]) || [],
    categories: (search.categories as string[]) || [],
    tags: (search.tags as string[]) || [],
    dateFrom: search.dateFrom ? new Date(search.dateFrom as string) : undefined,
    dateTo: search.dateTo ? new Date(search.dateTo as string) : undefined,
    isRecurring: String(search.isRecurring || ""),
    isInternal: String(search.isInternal || "")
  })

  const updateFormData = (field: keyof FilterFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = () => {
    // Convert form data to search params
    const searchParams: Record<string, any> = {}

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        if (Array.isArray(value) && value.length > 0) {
          searchParams[key] = value
        } else if (value instanceof Date) {
          searchParams[key] = value.toISOString().split("T")[0]
        } else if (typeof value === "string" && value.trim() !== "") {
          searchParams[key] = value
        }
      }
    })

    navigate({
      to: ".",
      search: (prev) => ({ ...prev, ...searchParams })
    })
    setOpen(false)
  }

  const clearFilters = () => {
    const clearedData: FilterFormData = {
      search: "",
      reference: "",
      counterparty: "",
      description: "",
      amountFrom: "",
      amountTo: "",
      currency: "",
      types: [],
      statuses: [],
      paymentMethods: [],
      categories: [],
      tags: [],
      dateFrom: undefined,
      dateTo: undefined,
      isRecurring: "",
      isInternal: ""
    }

    setFormData(clearedData)

    navigate({
      to: ".",
      search: {}
    })
    setOpen(false)
  }

  const toggleArrayValue = (field: keyof FilterFormData, value: string) => {
    const currentArray = (formData[field] as string[]) || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFormData(field, newArray)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={cn("border-border", className)}>
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] overflow-y-auto sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Filter Transactions</SheetTitle>
          <SheetDescription>Set filters to narrow down your transaction results.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          {/* Search */}
          <div className="grid gap-2">
            <Label htmlFor={searchId}>Search</Label>
            <Input
              id={searchId}
              placeholder="Search transactions..."
              value={formData.search}
              onChange={(e) => updateFormData("search", e.target.value)}
            />
          </div>

          {/* Reference */}
          <div className="grid gap-2">
            <Label htmlFor={referenceId}>Reference</Label>
            <Input
              id={referenceId}
              placeholder="Transaction reference..."
              value={formData.reference}
              onChange={(e) => updateFormData("reference", e.target.value)}
            />
          </div>

          {/* Counterparty */}
          <div className="grid gap-2">
            <Label htmlFor={counterpartyId}>Counterparty</Label>
            <Input
              id={counterpartyId}
              placeholder="Counterparty name..."
              value={formData.counterparty}
              onChange={(e) => updateFormData("counterparty", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor={descriptionId}>Description</Label>
            <Input
              id={descriptionId}
              placeholder="Transaction description..."
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
            />
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor={amountFromId}>Amount From</Label>
              <Input
                id={amountFromId}
                type="number"
                placeholder="0.00"
                value={formData.amountFrom}
                onChange={(e) => updateFormData("amountFrom", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={amountToId}>Amount To</Label>
              <Input
                id={amountToId}
                type="number"
                placeholder="0.00"
                value={formData.amountTo}
                onChange={(e) => updateFormData("amountTo", e.target.value)}
              />
            </div>
          </div>

          {/* Currency */}
          <div className="grid gap-2">
            <Label>Currency</Label>
            <Select value={formData.currency} onValueChange={(value) => updateFormData("currency", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Types */}
          <div className="grid gap-2">
            <Label>Transaction Types</Label>
            <div className="flex flex-wrap gap-2">
              {transactionTypes.map((type) => (
                <Badge
                  key={type.value}
                  variant={formData.types?.includes(type.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleArrayValue("types", type.value)}
                >
                  {type.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Transaction Statuses */}
          <div className="grid gap-2">
            <Label>Status</Label>
            <div className="flex flex-wrap gap-2">
              {transactionStatuses.map((status) => (
                <Badge
                  key={status.value}
                  variant={formData.statuses?.includes(status.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleArrayValue("statuses", status.value)}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid gap-2">
            <Label>Payment Methods</Label>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <Badge
                  key={method.value}
                  variant={formData.paymentMethods?.includes(method.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleArrayValue("paymentMethods", method.value)}
                >
                  {method.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="grid gap-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.value}
                  variant={formData.categories?.includes(category.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleArrayValue("categories", category.value)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label>Date From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !formData.dateFrom && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateFrom ? format(formData.dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateFrom}
                    onSelect={(date) => updateFormData("dateFrom", date)}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label>Date To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !formData.dateTo && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateTo ? format(formData.dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateTo}
                    onSelect={(date) => updateFormData("dateTo", date)}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Is Recurring */}
          <div className="grid gap-2">
            <Label>Recurring</Label>
            <Select value={formData.isRecurring} onValueChange={(value) => updateFormData("isRecurring", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select recurring status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Recurring</SelectItem>
                <SelectItem value="false">One-time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Is Internal */}
          <div className="grid gap-2">
            <Label>Internal</Label>
            <Select value={formData.isInternal} onValueChange={(value) => updateFormData("isInternal", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select internal status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Internal</SelectItem>
                <SelectItem value="false">External</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
          <Button onClick={onSubmit}>Apply Filters</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
