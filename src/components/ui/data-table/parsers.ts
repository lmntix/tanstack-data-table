import { z } from "zod"

import { dataTableConfig } from "@/components/ui/data-table/data-table-config"
import type { ExtendedColumnFilter, ExtendedColumnSort } from "@/components/ui/data-table/data-table-types"

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean()
})

export const getSortingStateSchema = <TData>(columnIds?: string[] | Set<string>) => {
  const validKeys = columnIds ? (columnIds instanceof Set ? columnIds : new Set(columnIds)) : null

  return z
    .array(sortingItemSchema)
    .default([])
    .transform((data) => {
      if (validKeys && data.some((item) => !validKeys.has(item.id))) {
        return []
      }
      return data as unknown as ExtendedColumnSort<TData>[]
    })
}

const filterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string()
})

export type FilterItemSchema = z.infer<typeof filterItemSchema>

export const getFiltersStateSchema = <TData>(columnIds?: string[] | Set<string>) => {
  const validKeys = columnIds ? (columnIds instanceof Set ? columnIds : new Set(columnIds)) : null

  return z
    .array(filterItemSchema)
    .default([])
    .transform((data) => {
      if (validKeys && data.some((item) => !validKeys.has(item.id))) {
        return []
      }
      return data as unknown as ExtendedColumnFilter<TData>[]
    })
}
