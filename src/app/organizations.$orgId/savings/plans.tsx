import { createFileRoute, Link, stripSearchParams, useNavigate, useRouter } from "@tanstack/react-router"
import z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getActiveFilters, getDefaultsFromSchema } from "@/utils/search"

export const savingPlansFilterSearchSchema = z.object({
  page: z.coerce
    .number()
    .optional()
    .default(1)
    .catch(() => 1),
  perPage: z.coerce.number().optional().default(10),
  sort: z
    .array(
      z.object({
        id: z.string(),
        desc: z.boolean()
      })
    )
    .default([{ id: "createdAt", desc: true }]),
  q: z.string().optional(),
  type: z.array(z.coerce.number()).default([]),
  minBalance: z.array(z.coerce.number()).default([]),
  createdAt: z.array(z.coerce.number()).default([])
})

const defaultValues = getDefaultsFromSchema(savingPlansFilterSearchSchema)

export const Route = createFileRoute("/organizations/$orgId/savings/plans")({
  component: RouteComponent,
  validateSearch: savingPlansFilterSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultValues)]
  }
})

function RouteComponent() {
  const router = useRouter()
  const searchParams = Route.useSearch()

  const navigate = useNavigate({ from: Route.fullPath })

  const updateFilters = (newFilters: Partial<typeof searchParams>) => {
    navigate({
      search: (prev) => ({
        ...prev, // Preserve existing search params
        ...newFilters // Apply new filter values
      })
    })
  }

  const hasFilters = getActiveFilters(savingPlansFilterSearchSchema)

  return (
    <div className="space-y-4 p-6">
      <h1 className="font-bold text-2xl">Savings Plans</h1>
      {/* Browser-style search bar */}
      <div className="w-full">
        <Input value={router.state.location.href} readOnly placeholder="Enter URL..." />
      </div>
      {hasFilters(searchParams) && <p className="text-blue-600 text-sm">Filters are active</p>}

      <div className="flex gap-2">
        <Button className="border px-4 py-2" onClick={() => updateFilters({ page: searchParams.page + 1 })}>
          Button Next Page
        </Button>
        <Link className="border px-4 py-2" to="." search={{ ...searchParams, page: searchParams.page + 1 }}>
          Next Page
        </Link>
        <Link className="border px-4 py-2" to="." search={{ ...searchParams, page: searchParams.page - 1 }}>
          Previous Page
        </Link>
        <Link className="border px-4 py-2" to="." search={{ ...searchParams, q: "test", page: 1 }}>
          Search
        </Link>
        <Link className="border px-4 py-2" to="." search={{}}>
          Clear All
        </Link>
      </div>

      <pre className="rounded bg-accent-background p-2 text-sm">{JSON.stringify(searchParams, null, 2)}</pre>
    </div>
  )
}
