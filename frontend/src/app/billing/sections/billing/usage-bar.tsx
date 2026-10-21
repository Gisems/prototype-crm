import { HIGH_USAGE_PERCENT, usagePercent } from "core/models/billing"
import { formatNumber } from "shared/utils/number"

interface UsageBarProps {
  label: string
  used: number
  included: number
}

export function UsageBar({ label, used, included }: Readonly<UsageBarProps>) {
  const percent = usagePercent(used, included)

  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {formatNumber(used)} / {formatNumber(included)}
        </span>
      </div>
      {/* Decorativa: el uso ya está escrito en el texto de arriba. */}
      <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${percent >= HIGH_USAGE_PERCENT ? "bg-destructive" : "bg-primary"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
