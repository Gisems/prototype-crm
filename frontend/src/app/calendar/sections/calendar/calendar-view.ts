import { parseAsString, parseAsStringLiteral } from "nuqs"

import { CALENDAR_VIEWS, type CalendarView } from "core/models/event"

// La vista y el día van en la URL (`?view=week&date=2026-10-26`) para que recargar o compartir el enlace conserve lo
// que se ve. Sin `date` se mira hoy: "Hoy" solo borra el parámetro.
export const calendarViewParser = parseAsStringLiteral(CALENDAR_VIEWS).withDefault("month")

export const calendarDateParser = parseAsString

export const VIEW_LABELS: Record<CalendarView, string> = {
  month: "Mes",
  week: "Semana",
  day: "Día",
}

export const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const
