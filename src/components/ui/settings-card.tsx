"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SettingsCardProps {
  title: string
  description: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function SettingsCard({
  title,
  description,
  children,
  footer,
  className
}: SettingsCardProps) {
  return (
    <div
      className={cn(
        "mb-6 overflow-hidden rounded-lg border bg-card",
        className
      )}
    >
      <div className="p-6">
        <h3 className="font-semibold text-xl">{title}</h3>
        <p className="mt-2 text-muted-foreground">{description}</p>
        <div className="mt-4">{children}</div>
      </div>
      {footer && <div className="border-t bg-muted/40 px-6 py-4">{footer}</div>}
    </div>
  )
}

export function SettingsCardFooter({
  children
}: {
  children: React.ReactNode
}) {
  return <div className="flex items-center justify-between">{children}</div>
}

export function SettingsSaveButton({
  onClick,
  disabled
}: {
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <Button className="ml-auto" disabled={disabled} onClick={onClick}>
      Save
    </Button>
  )
}
