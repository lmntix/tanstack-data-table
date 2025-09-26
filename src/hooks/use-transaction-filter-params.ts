import { useNavigate, useSearch } from "@tanstack/react-router"
import { z } from "zod"
import { transactionFilterSchema } from "@/app/organizations.$orgId/transactions"

type TransactionFilterParams = z.infer<typeof transactionFilterSchema>

export function useTransactionFilterParams() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })

  // Parse the filter parameters from the URL
  const filter = transactionFilterSchema.parse(search)

  const setParams = (params: Partial<TransactionFilterParams>) => {
    navigate({
      to: ".",
      search: (prev) => {
        return {
          ...prev,
          ...params
        }
      }
    })
  }

  const clearParams = () => {
    navigate({
      to: ".",
      search: (prev) => {
        const { ...rest } = prev
        return rest
      }
    })
  }

  return {
    filter,
    setParams,
    clearParams
  }
}
