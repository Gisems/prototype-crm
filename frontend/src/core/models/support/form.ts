import { z } from "zod"

import { requiredString } from "shared/utils/schema"

export const ticketFormSchema = z.object({
  subject: requiredString(120),
  message: requiredString(2000),
})

export type TicketFormInput = z.input<typeof ticketFormSchema>
export type TicketFormValues = z.output<typeof ticketFormSchema>

export const emptyTicketFormInput: TicketFormInput = { subject: "", message: "" }
