import type { Dashboard } from "core/models/dashboard"
import { formatMoney } from "shared/utils/currency"

interface RevenueChartProps {
  series: Dashboard["revenueSeries"]
}

export function RevenueChart({ series }: Readonly<RevenueChartProps>) {
  const max = Math.max(1, ...series.map((point) => point.revenue))

  return (
    <section className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm">
      <h2 className="text-base font-bold">Ventas en el período</h2>

      <ul className="flex h-48 items-end gap-3">
        {series.map((point) => (
          <li key={point.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
            <span className="text-xs text-muted-foreground">{formatMoney(point.revenue, "UYU")}</span>
            <div
              aria-hidden="true"
              className="w-full max-w-12 rounded-t-md bg-primary"
              style={{ height: `${(point.revenue / max) * 75}%` }}
            />
            <span className="text-xs font-medium">{point.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
