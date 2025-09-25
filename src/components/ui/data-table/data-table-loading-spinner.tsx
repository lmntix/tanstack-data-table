import { Loader } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.ComponentProps<"div"> {
  size?: "sm" | "md" | "lg"
}

export function DataTableLoadingSpinner({
  size = "md",
  className,
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6"
  }

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader className={cn("animate-spin", sizeClasses[size])} />
    </div>
  )
}
