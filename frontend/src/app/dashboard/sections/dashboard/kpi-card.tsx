import { TrendingDown, TrendingUp } from "lucide-react"

interface KpiCardProps {
  label: string
  value: string
  /** Variación en % contra el período anterior; sin ella no se muestra tendencia. */
  change?: number | null
  /** Contra qué período se compara: "el mes anterior". */
  changeLabel?: string
  /** Un dato de apoyo cuando no hay tendencia: por ejemplo, lo que vendió el líder. */
  hint?: string
}

export function KpiCard({ label, value, change, changeLabel, hint }: Readonly<KpiCardProps>) {
  const isUp = (change ?? 0) >= 0
  const Trend = isUp ? TrendingUp : TrendingDown

  return (
    <div className="flex flex-col gap-1 rounded-2xl border bg-card p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="truncate font-display text-2xl font-bold">{value}</p>
      {change !== undefined && change !== null && (
        <p className={`flex items-center gap-1 text-xs ${isUp ? "text-success" : "text-destructive"}`}>
          <Trend aria-hidden="true" className="size-3.5" />
          <span>
            {isUp ? "+" : ""}
            {change}% <span className="text-muted-foreground">vs. {changeLabel}</span>
          </span>
        </p>
      )}
      {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
