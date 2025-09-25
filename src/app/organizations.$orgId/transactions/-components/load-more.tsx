import type { ForwardedRef } from "react"
import { Spinner } from "@/components/ui/spinner"

export function LoadMore({ hasNextPage, ref }: { hasNextPage: boolean; ref: ForwardedRef<HTMLDivElement> }) {
  if (!hasNextPage) return null

  return (
    <div className="mt-6 flex items-center justify-center" ref={ref}>
      <div className="flex items-center space-x-2 py-5">
        <Spinner />
        <span className="text-[#606060] text-sm">Loading more...</span>
      </div>
    </div>
  )
}
