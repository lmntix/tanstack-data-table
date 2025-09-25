import { useNavigate, useSearch } from "@tanstack/react-router"
import { getSortingStateSchema } from "@/components/ui/data-table/parsers"

export function useSortParams() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })

  // Parse the sort parameter from the URL
  const sortSchema = getSortingStateSchema()
  const params = {
    sort: sortSchema.parse(search.sort || [])
  }

  const setSort = (sort: Array<{ id: string; desc: boolean }> | null) => {
    navigate({
      to: ".",
      search: (prev) => {
        if (!sort || sort.length === 0) {
          const { sort: _, ...rest } = prev
          return rest
        }
        return { ...prev, sort }
      }
    })
  }

  const clearSort = () => {
    navigate({
      to: ".",
      search: (prev) => {
        const { sort: _, ...rest } = prev
        return rest
      }
    })
  }

  return {
    params,
    setSort,
    clearSort
  }
}
