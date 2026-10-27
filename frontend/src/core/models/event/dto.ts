import type { EventFormValues } from "./form"
import type { EventType } from "./response"

export interface SaveEventDto {
  title: string
  type: EventType
  date: string
  time: string
  customerId: number | null
  assignedTo: number | null
  notes: string
}

export function toSaveEventDto({ notes, ...values }: EventFormValues): SaveEventDto {
  return { ...values, notes: notes ?? "" }
}
