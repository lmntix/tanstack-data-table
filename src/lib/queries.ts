import { infiniteQueryOptions } from "@tanstack/react-query"
import z from "zod"

import { GetTransactionsResponse, getTransactions, getTransactionsParamsSchema } from "./functions"

type TransactionFilterParams = z.infer<typeof getTransactionsParamsSchema>

export function getTransactionsInfiniteOptions(filters: TransactionFilterParams) {
  return infiniteQueryOptions({
    queryKey: ["transactions", filters],
    queryFn: () =>
      getTransactions({
        data: {
          ...filters,
          cursor: undefined
        }
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: GetTransactionsResponse) => lastPage.meta?.cursor ?? undefined
  })
}
