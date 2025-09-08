"use client"

interface ChartTooltipProps {
  active?: boolean
  payload?: { value: number; payload: { date?: Date; name?: string } }[]
  label?: string
  valueFormatter?: (value: number) => string
  dateFormat?: boolean
}

export default function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = (value) =>
    `₹${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`,
  dateFormat = false
}: ChartTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border border-border/50 bg-background/95 p-2 shadow-md backdrop-blur-xs">
        <div className="text-muted-foreground text-xs">
          {dateFormat && data.date
            ? data.date.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
                day: "numeric"
              })
            : label || data.name}
        </div>
        {payload.map((entry, index) => (
          <div className="font-medium text-base" key={`item-${index}`}>
            {valueFormatter(entry.value)}
          </div>
        ))}
      </div>
    )
  }
  return null
}
