import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { Suspense } from "react"
import z from "zod"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { getSortingStateSchema } from "@/components/ui/data-table/parsers"
import { getDefaultsFromSchema } from "@/utils/search"
import { getTransactionsInfiniteOptions, TransactionsTable } from "./-components/transactions-table"

export const transactionFilterSchema = z.object({
  q: z.string().optional().catch(""),
  voucherNo: z.string().optional().catch("")
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
    const { queryClient } = context

    await queryClient.prefetchInfiniteQuery(getTransactionsInfiniteOptions(search))
  }
})

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-6">
        <h1 className="font-bold text-2xl">Transactions</h1>
        <p className="text-muted-foreground">Manage your organization's transactions</p>
      </div>
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
