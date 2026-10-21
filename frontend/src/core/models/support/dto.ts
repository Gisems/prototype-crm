import type { TicketFormValues } from "./form"

export interface CreateTicketDto {
  subject: string
  message: string
}

export function toCreateTicketDto({ subject, message }: TicketFormValues): CreateTicketDto {
  return { subject, message }
}
