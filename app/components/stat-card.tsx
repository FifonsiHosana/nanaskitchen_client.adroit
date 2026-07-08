import React from "react"

interface StatCardProps {
  label: string
  value: string | number
  description: string
  children: React.ReactNode
}

export function StatCard({
  label,
  value,
  description,
  children,
}: StatCardProps) {
  return (
    <div className="flex h-45 flex-col  rounded-xl border bg-muted/50">
      <div className="flex shrink-0 flex-col gap-1 p-4 pb-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="text-xs tracking-tight text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  )
}
