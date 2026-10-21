import { PATHS } from "router/paths"
import { RouteTabs } from "shared/components/custom/route-tabs"

const TABS = [
  { label: "Canales & Bots", to: PATHS.SETTINGS.CHANNELS },
  { label: "Equipo", to: PATHS.SETTINGS.TEAM },
  { label: "Grupos y Horarios", to: PATHS.SETTINGS.GROUPS },
] as const

export function SettingsTabs() {
  return <RouteTabs label="Secciones de configuración" tabs={TABS} />
}
