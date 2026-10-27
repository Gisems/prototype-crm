import { z } from "zod"

import { invalidFormatMessage, optionalString, requiredString } from "shared/utils/schema"

import { type CalendarEvent, DATE_PATTERN, EVENT_TYPES, TIME_PATTERN } from "./response"

/** Valor de los selectores de contacto y responsable para "ninguno". */
export const NO_LINK = "none"

const idOrNull = z.string().transform((id) => (id === NO_LINK ? null : Number(id)))

export const eventFormSchema = z.object({
  title: requiredString(100),
  type: z.enum(EVENT_TYPES),
  date: requiredString().regex(DATE_PATTERN, { error: invalidFormatMessage }),
  time: requiredString().regex(TIME_PATTERN, { error: invalidFormatMessage }),
  customerId: idOrNull,
  assignedTo: idOrNull,
  notes: optionalString(500),
})

export type EventFormInput = z.input<typeof eventFormSchema>
export type EventFormValues = z.output<typeof eventFormSchema>

/** Un evento nuevo arranca en el día que se está mirando, a media mañana. */
export function emptyEventFormInput(date: string): EventFormInput {
  return { title: "", type: "meeting", date, time: "09:00", customerId: NO_LINK, assignedTo: NO_LINK, notes: "" }
}

/** Los campos del formulario son texto, que es lo que maneja un `<input>`; el schema los convierte al enviar. */
export function toEventFormInput(event: CalendarEvent): EventFormInput {
  return {
    title: event.title,
    type: event.type,
    date: event.date,
    time: event.time,
    customerId: event.customerId === null ? NO_LINK : String(event.customerId),
    assignedTo: event.assignedTo === null ? NO_LINK : String(event.assignedTo),
    notes: event.notes,
  }
}
