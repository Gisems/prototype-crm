import { PATHS } from "router/paths"
import { RouteTabs } from "shared/components/custom/route-tabs"

const TABS = [
  { label: "Ventas", to: PATHS.DASHBOARD.SALES },
  { label: "Conversaciones", to: PATHS.DASHBOARD.CONVERSATIONS },
] as const

export function DashboardTabs() {
  return <RouteTabs label="Secciones del dashboard" tabs={TABS} />
}
