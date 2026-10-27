import { z } from "zod"

/** Los tipos de evento: la vista les pone nombre y color. */
export const EVENT_TYPES = ["call", "meeting", "delivery", "reminder"] as const

/** `2026-10-26`: la fecha va sin hora ni zona, como la entrega un `<input type="date">`. */
export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** `09:30`, como la entrega un `<input type="time">`. */
export const TIME_PATTERN = /^\d{2}:\d{2}$/

export const calendarEventSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  type: z.enum(EVENT_TYPES),
  date: z.string().regex(DATE_PATTERN),
  time: z.string().regex(TIME_PATTERN),
  /** Id del cliente vinculado, o `null` si no hay. */
  customerId: z.number().int().nullable(),
  /** Id del miembro del equipo a cargo, o `null` si nadie. */
  assignedTo: z.number().int().nullable(),
  notes: z.string(),
})

export type CalendarEvent = z.infer<typeof calendarEventSchema>
export type EventType = (typeof EVENT_TYPES)[number]
