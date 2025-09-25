import type { ColumnDef } from "@tanstack/react-table"
import { Building2, CalendarIcon, CreditCard, DollarSign, Ellipsis, FileText } from "lucide-react"

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
import type { GetTransactionsResponse } from "@/functions/transactions"
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
      id: "narration",
      accessorKey: "narration",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => {
        const narration = row.getValue("narration") as string | null
        return <div className="max-w-[31.25rem] truncate">{narration || "No description"}</div>
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
      id: "date",
      accessorKey: "date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction Date" />,
      cell: ({ cell }) => {
        const date = cell.getValue() as string | null
        return <div className="flex items-center">{date ? formatDate(new Date(date)) : "N/A"}</div>
      },
      meta: {
        label: "Transaction Date",
        variant: "date",
        icon: CalendarIcon
      },
      enableColumnFilter: true
    },
    {
      id: "financialYearId",
      accessorKey: "financialYearId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Financial Year" />,
      cell: ({ row }) => {
        const yearId = row.getValue("financialYearId") as string | null
        return yearId ? (
          <Badge variant="outline" className="py-1">
            FY #{yearId.slice(-4)}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
      meta: {
        label: "Financial Year",
        variant: "multiSelect",
        icon: CalendarIcon
      },
      enableColumnFilter: true
    },
    {
      id: "branchId",
      accessorKey: "branchId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Branch" />,
      cell: ({ row }) => {
        const branchId = row.getValue("branchId") as string | null
        return branchId ? (
          <div className="flex items-center">
            <Building2 className="mr-2 size-3.5 text-muted-foreground" />
            Branch #{branchId.slice(-4)}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
      meta: {
        label: "Branch",
        variant: "multiSelect",
        icon: Building2
      },
      enableColumnFilter: true
    },
    {
      id: "mode",
      accessorKey: "mode",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Mode" />,
      cell: ({ row }) => {
        const mode = row.getValue("mode") as string | null
        const getModeLabel = (mode: string | null) => {
          switch (mode) {
            case "CASH":
              return "Cash"
            case "UPI":
              return "UPI"
            case "CHEQUE":
              return "Cheque"
            case "BANK_TRANSFER":
              return "Bank Transfer"
            case "OTHER":
              return "Other"
            default:
              return "Unknown"
          }
        }

        const modeLabel = getModeLabel(mode)
        const variant = mode === "CASH" ? "default" : mode === "UPI" ? "outline" : "secondary"

        return mode ? (
          <Badge variant={variant} className="text-xs">
            {modeLabel}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
      meta: {
        label: "Transaction Mode",
        variant: "multiSelect",
        options: [
          { label: "Cash", value: "CASH" },
          { label: "UPI", value: "UPI" },
          { label: "Cheque", value: "CHEQUE" },
          { label: "Bank Transfer", value: "BANK_TRANSFER" },
          { label: "Other", value: "OTHER" }
        ],
        icon: CreditCard
      },
      enableColumnFilter: true
    },
    {
      id: "voucherMaster",
      accessorKey: "voucherMaster",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Voucher Type" />,
      cell: ({ row }) => {
        const voucherType = row.getValue("voucherMaster") as string | null
        const getVoucherLabel = (type: string | null) => {
          switch (type) {
            case "OPENING_BALANCE":
              return "Opening Balance"
            case "CREDIT":
              return "Credit"
            case "DEBIT":
              return "Debit"
            case "JOURNAL_VOUCHER":
              return "Journal"
            case "CONTRA":
              return "Contra"
            default:
              return "Unknown"
          }
        }

        return voucherType ? (
          <Badge variant="secondary" className="text-xs">
            {getVoucherLabel(voucherType)}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
      meta: {
        label: "Voucher Type",
        variant: "multiSelect",
        options: [
          { label: "Opening Balance", value: "OPENING_BALANCE" },
          { label: "Credit", value: "CREDIT" },
          { label: "Debit", value: "DEBIT" },
          { label: "Journal", value: "JOURNAL_VOUCHER" },
          { label: "Contra", value: "CONTRA" }
        ],
        icon: FileText
      },
      enableColumnFilter: false,
      enableSorting: false
    },
    {
      id: "voucherNo",
      accessorKey: "voucherNo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Voucher No" />,
      cell: ({ row }) => {
        const voucherNo = row.getValue("voucherNo") as string | null
        return voucherNo ? (
          <div className="font-mono text-sm">{voucherNo}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
      meta: {
        label: "Voucher Number",
        placeholder: "Search voucher numbers",
        variant: "text",
        icon: FileText
      },
      enableColumnFilter: false
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ cell }) => {
        const date = cell.getValue() as Date
        return <div className="flex items-center">{formatDate(date)}</div>
      },
      meta: {
        label: "Created At",
        variant: "dateRange",
        icon: CalendarIcon
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
