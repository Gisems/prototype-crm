import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isValid,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { es } from "date-fns/locale"

import type { CalendarEvent } from "./response"

export const CALENDAR_VIEWS = ["month", "week", "day"] as const
export type CalendarView = (typeof CALENDAR_VIEWS)[number]

/** La semana arranca el lunes, como en la grilla del prototipo. */
const WEEK = { weekStartsOn: 1, locale: es } as const

const ISO_FORMAT = "yyyy-MM-dd"

/** `Date` → `2026-10-26`, en la zona del navegador (`toISOString` correría el día al oeste de Greenwich). */
export function toIsoDate(date: Date) {
  return format(date, ISO_FORMAT)
}

/** `2026-10-26` → `Date` a medianoche local, o `null` si no es una fecha real (`2026-02-31`). */
export function parseIsoDate(value: string) {
  const date = parse(value, ISO_FORMAT, new Date())

  return isValid(date) && toIsoDate(date) === value ? date : null
}

/** Los días que dibuja la vista: la grilla completa del mes (con los días vecinos), la semana o el día. */
export function visibleDays(view: CalendarView, anchor: Date) {
  if (view === "day") return [anchor]

  if (view === "week") {
    return eachDayOfInterval({ start: startOfWeek(anchor, WEEK), end: endOfWeek(anchor, WEEK) })
  }

  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(anchor), WEEK),
    end: endOfWeek(endOfMonth(anchor), WEEK),
  })
}

/** Mueve el día de referencia un mes, una semana o un día, según la vista. */
export function shiftAnchor(view: CalendarView, anchor: Date, step: 1 | -1) {
  if (view === "day") return addDays(anchor, step)

  return view === "week" ? addWeeks(anchor, step) : addMonths(anchor, step)
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** El título de lo que se está mirando: `Octubre de 2026`, `26 – 1 nov 2026` o `Lunes 26 de octubre de 2026`. */
export function rangeTitle(view: CalendarView, anchor: Date) {
  if (view === "month") return capitalize(format(anchor, "LLLL 'de' yyyy", { locale: es }))

  if (view === "day") return capitalize(format(anchor, "EEEE d 'de' MMMM 'de' yyyy", { locale: es }))

  const start = startOfWeek(anchor, WEEK)
  const end = endOfWeek(anchor, WEEK)

  if (start.getMonth() === end.getMonth()) {
    return `${format(start, "d")} – ${format(end, "d 'de' MMMM 'de' yyyy", { locale: es })}`
  }

  return `${format(start, "d MMM", { locale: es })} – ${format(end, "d MMM yyyy", { locale: es })}`
}

/** Los eventos de cada día (por su `YYYY-MM-DD`), ordenados por hora. */
export function groupByDate(events: CalendarEvent[]) {
  const groups = new Map<string, CalendarEvent[]>()

  for (const event of events.toSorted((a, b) => a.time.localeCompare(b.time))) {
    groups.set(event.date, [...(groups.get(event.date) ?? []), event])
  }

  return groups
}
