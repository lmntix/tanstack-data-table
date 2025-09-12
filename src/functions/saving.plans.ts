import { createServerFn } from "@tanstack/react-start"

export const getSavingPlansFn = createServerFn({
  method: "GET"
}).handler(async () => {
  return { plans: [] }
})
