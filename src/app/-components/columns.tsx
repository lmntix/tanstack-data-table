import type { ColumnDef } from "@tanstack/react-table"
import { Ellipsis } from "lucide-react"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
      minSize: 40
    },
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
      }
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        return <div className="max-w-[31.25rem] truncate font-medium">{name}</div>
      }
    },
    {
      id: "description",
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => {
        const description = row.getValue("description") as string | null
        return <div className="max-w-[31.25rem] truncate">{description || "No description"}</div>
      }
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
      }
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
      }
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
      }
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
      }
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
      }
    },
    {
      id: "transactionDate",
      accessorKey: "transactionDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction Date" />,
      cell: ({ row }) => {
        const date = row.getValue("transactionDate") as string
        return <div className="text-sm">{formatDate(date)}</div>
      }
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
      }
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
      }
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
      }
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string
        return <div className="text-sm">{formatDate(date)}</div>
      },
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
