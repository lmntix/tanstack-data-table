import type { ColumnDef } from "@tanstack/react-table"
import { Calendar, CreditCard, DollarSign, Ellipsis, FileText, RefreshCw, Tag, User } from "lucide-react"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import type { DataTableRowAction } from "@/components/ui/data-table/data-table-types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { GetTransactionsResponse } from "@/lib/functions"
import { formatDate } from "@/utils/format"

type Transaction = GetTransactionsResponse["data"][number]

interface GetTransactionsTableColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Transaction> | null>>
}

export function getTransactionsTableColumns({
  setRowAction
}: GetTransactionsTableColumnsProps): ColumnDef<Transaction>[] {
  return [
    {
      id: "id",
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction ID" />,
      cell: ({ row }) => {
        return (
          <button type="button" onClick={() => setRowAction({ row, variant: "void" })} className="text-left">
            <span className="font-medium text-[#00C969]">#{row.getValue("id")}</span>
          </button>
        )
      },
      enableSorting: false,
      enableHiding: true
    },
    {
      id: "reference",
      accessorKey: "reference",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Reference" />,
      cell: ({ row }) => {
        const reference = row.getValue("reference") as string | null
        return reference ? (
          <div className="font-mono text-sm">{reference}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
      meta: {
        label: "Reference",
        placeholder: "Search references",
        variant: "text",
        icon: FileText
      },
      enableColumnFilter: true
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        return <div className="max-w-[31.25rem] truncate font-medium">{name}</div>
      },
      meta: {
        label: "Name",
        placeholder: "Search names",
        variant: "text",
        icon: FileText
      },
      enableColumnFilter: true
    },
    {
      id: "description",
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => {
        const description = row.getValue("description") as string | null
        return <div className="max-w-[31.25rem] truncate">{description || "No description"}</div>
      },
      meta: {
        label: "Description",
        placeholder: "Search descriptions",
        variant: "text",
        icon: FileText
      },
      enableColumnFilter: true
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2
        }).format(amount)

        return <div className="flex items-center font-medium">{formatted}</div>
      },
      meta: {
        label: "Amount",
        variant: "range",
        icon: DollarSign
      },
      enableColumnFilter: false
    },
    {
      id: "currency",
      accessorKey: "currency",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Currency" />,
      cell: ({ row }) => {
        const currency = row.getValue("currency") as string
        return (
          <Badge variant="outline" className="text-xs">
            {currency}
          </Badge>
        )
      },
      meta: {
        label: "Currency",
        variant: "select",
        options: [
          { label: "USD", value: "USD" },
          { label: "EUR", value: "EUR" },
          { label: "INR", value: "INR" },
          { label: "GBP", value: "GBP" }
        ],
        icon: DollarSign
      },
      enableColumnFilter: true
    },
    {
      id: "type",
      accessorKey: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => {
        const type = row.getValue("type") as "income" | "expense" | "transfer"
        const variant = type === "income" ? "default" : type === "expense" ? "destructive" : "secondary"

        return (
          <Badge variant={variant} className="text-xs capitalize">
            {type}
          </Badge>
        )
      },
      meta: {
        label: "Transaction Type",
        variant: "multiSelect",
        options: [
          { label: "Income", value: "income" },
          { label: "Expense", value: "expense" },
          { label: "Transfer", value: "transfer" }
        ],
        icon: CreditCard
      },
      enableColumnFilter: true
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as "pending" | "completed" | "failed" | "cancelled"
        const variant =
          status === "completed"
            ? "default"
            : status === "failed"
              ? "destructive"
              : status === "cancelled"
                ? "secondary"
                : "outline"

        return (
          <Badge variant={variant} className="text-xs capitalize">
            {status}
          </Badge>
        )
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [
          { label: "Pending", value: "pending" },
          { label: "Completed", value: "completed" },
          { label: "Failed", value: "failed" },
          { label: "Cancelled", value: "cancelled" }
        ],
        icon: FileText
      },
      enableColumnFilter: true
    },
    {
      id: "paymentMethod",
      accessorKey: "paymentMethod",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Payment Method" />,
      cell: ({ row }) => {
        const paymentMethod = row.getValue("paymentMethod") as string | null
        const getPaymentMethodLabel = (method: string | null) => {
          switch (method) {
            case "credit_card":
              return "Credit Card"
            case "debit_card":
              return "Debit Card"
            case "bank_transfer":
              return "Bank Transfer"
            case "cash":
              return "Cash"
            case "check":
              return "Check"
            case "digital_wallet":
              return "Digital Wallet"
            default:
              return "Unknown"
          }
        }

        return paymentMethod ? (
          <Badge variant="outline" className="text-xs">
            {getPaymentMethodLabel(paymentMethod)}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
      meta: {
        label: "Payment Method",
        variant: "multiSelect",
        options: [
          { label: "Credit Card", value: "credit_card" },
          { label: "Debit Card", value: "debit_card" },
          { label: "Bank Transfer", value: "bank_transfer" },
          { label: "Cash", value: "cash" },
          { label: "Check", value: "check" },
          { label: "Digital Wallet", value: "digital_wallet" }
        ],
        icon: CreditCard
      },
      enableColumnFilter: true
    },
    {
      id: "transactionDate",
      accessorKey: "transactionDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction Date" />,
      cell: ({ row }) => {
        const date = row.getValue("transactionDate") as string
        return <div className="text-sm">{formatDate(date)}</div>
      },
      meta: {
        label: "Transaction Date",
        variant: "date",
        icon: Calendar
      },
      enableColumnFilter: true
    },
    {
      id: "counterpartyName",
      accessorKey: "counterpartyName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Counterparty" />,
      cell: ({ row }) => {
        const counterpartyName = row.getValue("counterpartyName") as string | null
        return counterpartyName ? (
          <div className="text-sm">{counterpartyName}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
      meta: {
        label: "Counterparty Name",
        variant: "text",
        icon: User
      },
      enableColumnFilter: true
    },
    {
      id: "categorySlug",
      accessorKey: "categorySlug",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => {
        const categorySlug = row.getValue("categorySlug") as string | null
        const getCategoryLabel = (slug: string | null) => {
          if (!slug) return "Uncategorized"
          return slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        }

        return (
          <Badge variant="secondary" className="text-xs">
            {getCategoryLabel(categorySlug)}
          </Badge>
        )
      },
      meta: {
        label: "Category",
        variant: "select",
        options: [
          { label: "Food & Dining", value: "food-dining" },
          { label: "Transportation", value: "transportation" },
          { label: "Shopping", value: "shopping" },
          { label: "Entertainment", value: "entertainment" },
          { label: "Bills & Utilities", value: "bills-utilities" },
          { label: "Healthcare", value: "healthcare" },
          { label: "Education", value: "education" },
          { label: "Travel", value: "travel" },
          { label: "Business", value: "business" },
          { label: "Other", value: "other" }
        ],
        icon: Tag
      },
      enableColumnFilter: true
    },
    {
      id: "isRecurring",
      accessorKey: "isRecurring",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Recurring" />,
      cell: ({ row }) => {
        const isRecurring = row.getValue("isRecurring") as boolean
        return (
          <Badge variant={isRecurring ? "default" : "outline"} className="text-xs">
            {isRecurring ? "Yes" : "No"}
          </Badge>
        )
      },
      meta: {
        label: "Is Recurring",
        variant: "select",
        options: [
          { label: "Yes", value: "true" },
          { label: "No", value: "false" }
        ],
        icon: RefreshCw
      },
      enableColumnFilter: true
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string
        return <div className="text-sm">{formatDate(date)}</div>
      },
      meta: {
        label: "Created At",
        variant: "dateRange",
        icon: Calendar
      },
      enableColumnFilter: false,
      enableSorting: false
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => setRowAction({ row, variant: "void" })}>View Details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setRowAction({ row, variant: "update" })}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setRowAction({ row, variant: "delete" })}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      enableSorting: false,
      enableHiding: false,
      size: 40
    }
  ]
}
