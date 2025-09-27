import type { Table } from "@tanstack/react-table"
import { Download, Trash2 } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import {
  DataTableBottomBar,
  DataTableBottomBarAction,
  DataTableBottomBarSelection
} from "@/components/ui/data-table/data-table-bottom-bar"

import { Separator } from "@/components/ui/separator"
import { GetTransactionsResponse } from "@/functions/transactions"
import { exportTableToCSV } from "@/utils/export"

type Transaction = GetTransactionsResponse["data"][number]
// type Transaction = RouterOutputs["transactions"]["list"]["data"][number]
type Action = "export" | "delete"

interface TransactionsTableBottomBarProps {
  table: Table<Transaction>
}

export function TransactionsTableBottomBar({ table }: TransactionsTableBottomBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows
  const [isPending, startTransition] = React.useTransition()
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null)

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction]
  )

  const onTransactionExport = React.useCallback(() => {
    setCurrentAction("export")
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ["select", "actions"],
        onlySelected: true
      })
    })
  }, [table])

  const onTransactionDelete = React.useCallback(() => {
    setCurrentAction("delete")
    startTransition(async () => {
      // TODO: Implement delete functionality
      toast.success(`Selected ${rows.length} transaction(s) for deletion`)
      table.toggleAllRowsSelected(false)
    })
  }, [rows, table])

  return (
    <DataTableBottomBar table={table} visible={rows.length > 0}>
      <DataTableBottomBarSelection table={table} />
      <Separator orientation="vertical" className="hidden data-[orientation=vertical]:h-5 sm:block" />
      <div className="flex items-center gap-1.5">
        <DataTableBottomBarAction
          size="icon"
          tooltip="Export transactions"
          isPending={getIsActionPending("export")}
          onClick={onTransactionExport}
        >
          <Download />
        </DataTableBottomBarAction>
        <DataTableBottomBarAction
          size="icon"
          tooltip="Delete transactions"
          isPending={getIsActionPending("delete")}
          onClick={onTransactionDelete}
        >
          <Trash2 />
        </DataTableBottomBarAction>
      </div>
    </DataTableBottomBar>
  )
}
