import { z } from "zod"

import { optionalString, requiredString } from "shared/utils/schema"

import { CUSTOMER_CHANNELS, CUSTOMER_STAGES, type Customer } from "./response"

/** Valor del selector de responsable para "sin asignar". */
export const NO_ASSIGNEE = "none"

/** "Lead, VIP, lead" → `["Lead", "VIP"]`: sin vacíos y sin repetidas, aunque difieran en mayúsculas. */
function parseTags(text: string) {
  const seen = new Set<string>()

  return text
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => {
      const key = tag.toLowerCase()
      if (!key || seen.has(key)) return false

      seen.add(key)

      return true
    })
}

export const customerFormSchema = z.object({
  name: requiredString(100),
  channel: z.enum(CUSTOMER_CHANNELS),
  phone: requiredString(30),
  whatsappId: optionalString(50),
  /** Se escriben separadas por coma en un solo campo. */
  tags: z.string().transform(parseTags),
  stage: z.enum(CUSTOMER_STAGES),
  value: requiredString()
    .transform(Number)
    .pipe(z.number({ error: "Ingresa un número" }).min(0, "No puede ser negativo")),
  assignedTo: z.string().transform((id) => (id === NO_ASSIGNEE ? null : Number(id))),
})

export type CustomerFormInput = z.input<typeof customerFormSchema>
export type CustomerFormValues = z.output<typeof customerFormSchema>

export const emptyCustomerFormInput: CustomerFormInput = {
  name: "",
  channel: "wa",
  phone: "",
  whatsappId: "",
  tags: "",
  stage: "new",
  value: "0",
  assignedTo: NO_ASSIGNEE,
}

/** Los campos del formulario son texto, que es lo que maneja un `<input>`; el schema los convierte al enviar. */
export function toCustomerFormInput(customer: Customer): CustomerFormInput {
  return {
    name: customer.name,
    channel: customer.channel,
    phone: customer.phone,
    whatsappId: customer.whatsappId,
    tags: customer.tags.join(", "),
    stage: customer.stage,
    value: String(customer.value),
    assignedTo: customer.assignedTo === null ? NO_ASSIGNEE : String(customer.assignedTo),
  }
}
