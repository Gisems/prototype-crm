import { parseAsStringLiteral } from "nuqs"

import { DASHBOARD_PERIODS, type DashboardPeriod } from "core/models/dashboard"

// El período va en la URL (`?period=week`) para que recargar o compartir el enlace conserve lo que se ve.
export const dashboardPeriodParser = parseAsStringLiteral(DASHBOARD_PERIODS).withDefault("month")

export const PERIOD_LABELS: Record<DashboardPeriod, string> = {
  today: "Hoy",
  week: "Semana",
  month: "Mes",
}

/** Contra qué se compara la variación de cada período. */
export const PREVIOUS_PERIOD_LABELS: Record<DashboardPeriod, string> = {
  today: "ayer",
  week: "la semana anterior",
  month: "el mes anterior",
}
