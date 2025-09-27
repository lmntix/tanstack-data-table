// columns.tsx
import type { ColumnDef } from "@tanstack/react-table"
import { Ellipsis } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
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

export const transactionsColumns: ColumnDef<Transaction>[] = [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => (
      <Button variant="link" className="h-auto truncate p-0 text-left">
        #{row.getValue("id")}
      </Button>
    ),
    enableSorting: false,
    enableHiding: true,
    size: 80
  },
  {
    id: "reference",
    accessorKey: "reference",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reference" />,
    cell: ({ row }) => {
      const reference = row.getValue("reference") as string | null
      return reference ? <div className="truncate">{reference}</div> : <span className="text-muted-foreground">—</span>
    },
    size: 120
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      return <div className="truncate font-medium">{name}</div>
    },
    size: 200
  },
  {
    id: "description",
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null
      return <div className="truncate">{description || "No description"}</div>
    },
    size: 250
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
      return <div className="truncate font-mono">{formatted}</div>
    },
    size: 130
  },
  {
    id: "type",
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = row.getValue("type") as "income" | "expense" | "transfer"
      const variant = type === "income" ? "default" : type === "expense" ? "destructive" : "secondary"
      return (
        <Badge variant={variant} className="truncate">
          {type}
        </Badge>
      )
    },
    size: 100
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
        <Badge variant={variant} className="truncate">
          {status}
        </Badge>
      )
    },
    size: 110
  },
  {
    id: "transactionDate",
    accessorKey: "transactionDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const date = row.getValue("transactionDate") as string
      return <div className="truncate font-mono text-sm">{formatDate(date)}</div>
    },
    size: 120
  },
  {
    id: "counterpartyName",
    accessorKey: "counterpartyName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Counterparty" />,
    cell: ({ row }) => {
      const counterpartyName = row.getValue("counterpartyName") as string | null
      return counterpartyName ? (
        <div className="truncate">{counterpartyName}</div>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
    size: 150
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40
  }
]
