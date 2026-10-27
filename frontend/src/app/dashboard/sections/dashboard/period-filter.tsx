import { DASHBOARD_PERIODS, type DashboardPeriod } from "core/models/dashboard"
import { SegmentedControl } from "shared/components/custom/segmented-control"

import { PERIOD_LABELS } from "./dashboard-view"

interface PeriodFilterProps {
  period: DashboardPeriod
  onChange: (period: DashboardPeriod) => void
}

const OPTIONS = DASHBOARD_PERIODS.map((value) => ({ value, label: PERIOD_LABELS[value] }))

export function PeriodFilter({ period, onChange }: Readonly<PeriodFilterProps>) {
  return <SegmentedControl label="Período" options={OPTIONS} value={period} onChange={onChange} />
}
