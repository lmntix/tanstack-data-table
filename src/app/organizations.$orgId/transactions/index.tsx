import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { Suspense } from "react"
import z from "zod"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { getSortingStateSchema } from "@/components/ui/data-table/parsers"
import { getActiveFilters, getDefaultsFromSchema } from "@/utils/search"
import { getTransactionsInfiniteOptions, TransactionsTable } from "./-components/transactions-table"

export const transactionFilterSchema = z.object({
  q: z.string().optional().catch(""),
  voucherNo: z.string().optional().catch(""),
  mode: z
    .array(z.enum(["OTHER", "CASH", "UPI", "CHEQUE", "BANK_TRANSFER"]))
    .optional()
    .catch([])
})

const transactionsSearchSchema = transactionFilterSchema.extend({
  sort: getSortingStateSchema().optional()
})

const defaultValues = getDefaultsFromSchema(transactionsSearchSchema)

export const Route = createFileRoute("/organizations/$orgId/transactions/")({
  validateSearch: transactionsSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultValues)]
  },
  component: RouteComponent,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    await context.queryClient.ensureInfiniteQueryData(getTransactionsInfiniteOptions(search))
  }
})

function RouteComponent() {
  const searchParams = Route.useSearch()
  const hasFilters = getActiveFilters(transactionFilterSchema)
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-6">
        <h1 className="font-bold text-2xl">Transactions</h1>
        <p className="text-muted-foreground">Manage your organization's transactions</p>
      </div>
      {hasFilters(searchParams) && <p className="text-blue-600 text-sm">Filters are active</p>}
      <pre className="rounded bg-accent-background p-2 text-sm">{JSON.stringify(searchParams, null, 2)}</pre>
      <Suspense
        fallback={
          <DataTableSkeleton
            cellWidths={["10rem", "30rem", "10rem", "10rem", "6rem", "6rem", "6rem"]}
            columnCount={6}
            shrinkZero
          />
        }
      >
        <TransactionsTable />
      </Suspense>
    </div>
  )
}
