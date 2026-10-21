import { z } from "zod"

/** De lunes a domingo, en el orden en que se muestran. `letter` es la inicial de las pastillas de la tarjeta. */
export const DAYS = [
  { key: "mon", label: "Lunes", letter: "L" },
  { key: "tue", label: "Martes", letter: "M" },
  { key: "wed", label: "Miércoles", letter: "M" },
  { key: "thu", label: "Jueves", letter: "J" },
  { key: "fri", label: "Viernes", letter: "V" },
  { key: "sat", label: "Sábado", letter: "S" },
  { key: "sun", label: "Domingo", letter: "D" },
] as const

export type DayKey = (typeof DAYS)[number]["key"]

/** Los días a los que "Copiar horario del lunes" lleva el horario de ese día. */
export const WEEKDAYS_AFTER_MONDAY = ["tue", "wed", "thu", "fri"] as const

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Hora inválida")

export const dayScheduleSchema = z.object({
  active: z.boolean(),
  /** `HH:MM`, de 00:00 a 23:59. */
  from: timeSchema,
  to: timeSchema,
})

export type DaySchedule = z.infer<typeof dayScheduleSchema>

export const scheduleSchema = z.object({
  mon: dayScheduleSchema,
  tue: dayScheduleSchema,
  wed: dayScheduleSchema,
  thu: dayScheduleSchema,
  fri: dayScheduleSchema,
  sat: dayScheduleSchema,
  sun: dayScheduleSchema,
})

export type Schedule = z.infer<typeof scheduleSchema>

// `Date.getDay()` cuenta desde el domingo.
const DAY_BY_JS_INDEX: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number)

  return (hours ?? 0) * 60 + (minutes ?? 0)
}

/**
 * Si `now` cae dentro del horario de atención. Usa la hora local de quien mira: cuando el backend maneje zona
 * horaria por grupo, esto se calcula con la del grupo.
 */
export function isInSchedule(schedule: Schedule, now: Date) {
  const day = schedule[DAY_BY_JS_INDEX[now.getDay()] ?? "mon"]

  if (!day.active) return false

  const current = now.getHours() * 60 + now.getMinutes()

  return current >= toMinutes(day.from) && current <= toMinutes(day.to)
}

/** `09:00 – 18:00` si todos los días activos comparten horario; si no, un aviso. */
export function scheduleSummary(schedule: Schedule) {
  const activeDays = DAYS.map(({ key }) => schedule[key]).filter((day) => day.active)
  const first = activeDays[0]

  if (!first) return "Sin horario configurado"

  const isUniform = activeDays.every((day) => day.from === first.from && day.to === first.to)

  return isUniform ? `${first.from} – ${first.to}` : "Horario distinto por día"
}
