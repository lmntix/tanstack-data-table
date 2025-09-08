"use client"

import { useRouter } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  /** The main title of the page */
  label: string
  /** Optional description text displayed below the title */
  description?: string
  /** Optional content to be displayed on the right side (typically action buttons) */
  children?: React.ReactNode
  /** Optional additional CSS classes */
  className?: string
  /** Whether to show the back button (defaults to false) */
  showBackButton?: boolean
  /** Optional callback function for custom back button behavior */
  onBackClick?: () => void
  /** Whether to show the bottom separator (defaults to true) */
  showSeparator?: boolean
}

const PageHeader: React.FC<PageHeaderProps> = ({
  label,
  description,
  children,
  className,
  showBackButton = false,
  onBackClick,
  showSeparator = true
}) => {
  const router = useRouter()

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      router.history.back()
    }
  }

  return (
    <>
      <div className={cn("flex flex-row items-center justify-between px-4 py-4 sm:px-6 sm:py-5", className)}>
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button aria-label="Go back" className="h-8 w-8" onClick={handleBackClick} size="icon" variant="outline">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="font-bold text-2xl tracking-tight">{label}</h1>
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
          </div>
        </div>
        <div className="flex shrink-0 space-x-2">{children}</div>
      </div>
      {showSeparator && <Separator />}
    </>
  )
}

export default PageHeader
