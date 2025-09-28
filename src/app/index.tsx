import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { Suspense } from "react"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { getSortingStateSchema } from "@/components/ui/data-table/parsers"
import { getTransactionsParamsSchema } from "@/lib/functions"
import { getDefaultsFromSchema } from "@/utils/search"
import { getTransactionsInfiniteOptions, TransactionsTable } from "./-components/transactions-table"

// Create a schema for the search params that extends the API schema but excludes server-only fields
const transactionFilterSchema = getTransactionsParamsSchema.omit({
  cursor: true,
  pageSize: true
})

const transactionsSearchSchema = transactionFilterSchema.extend({
  sort: getSortingStateSchema().optional()
})

const defaultValues = getDefaultsFromSchema(transactionsSearchSchema)

export const Route = createFileRoute("/")({
  validateSearch: transactionsSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultValues)]
  },
  component: RouteComponent,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    // Map the search parameters to match the API schema
    const apiParams = {
      ...search,
      sort: search.sort && search.sort.length > 0 ? [search.sort[0].id, search.sort[0].desc ? "desc" : "asc"] : null
    }
    context.queryClient.prefetchInfiniteQuery(getTransactionsInfiniteOptions(apiParams))
  }
})

function RouteComponent() {
  return (
    <div className="container mx-auto w-full px-4 py-2">
      {/* <div className="mb-6">
        <h1 className="font-bold text-2xl">Transactions</h1>
        <p className="text-muted-foreground">Manage your organization's transactions</p>
      </div> */}

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
