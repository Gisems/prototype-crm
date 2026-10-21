import { z } from "zod"

/** Por dónde escribió: WhatsApp, Instagram o Messenger. La vista les pone nombre y color. */
export const CUSTOMER_CHANNELS = ["wa", "ig", "fb"] as const

/** Las etapas de venta, de la primera a la última. */
export const CUSTOMER_STAGES = ["new", "contacted", "negotiation", "won", "lost"] as const

export const customerSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  channel: z.enum(CUSTOMER_CHANNELS),
  phone: z.string(),
  /** El id del cliente en WhatsApp; vacío si no se conoce. No se muestra en la fila de la tabla. */
  whatsappId: z.string(),
  tags: z.array(z.string()),
  stage: z.enum(CUSTOMER_STAGES),
  /** Lo que vale la oportunidad, en pesos uruguayos. */
  value: z.number(),
  /** Id del miembro del equipo a cargo, o `null` si nadie. */
  assignedTo: z.number().int().nullable(),
})

export type Customer = z.infer<typeof customerSchema>
export type CustomerChannel = (typeof CUSTOMER_CHANNELS)[number]
export type CustomerStage = (typeof CUSTOMER_STAGES)[number]
