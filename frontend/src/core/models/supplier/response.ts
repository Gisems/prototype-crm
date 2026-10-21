import { z } from "zod"

export const supplierSchema = z.object({
  id: z.number().int(),
  /** La empresa o el proveedor. */
  name: z.string(),
  /** El RUC uruguayo (12 dígitos); vacío si el proveedor no lo tiene. */
  ruc: z.string(),
  /** La persona con la que se habla; puede estar vacío. */
  contactName: z.string(),
  phone: z.string(),
  email: z.string(),
  /** Qué provee: telas, cuero, calzado… Texto libre. */
  category: z.string(),
  notes: z.string(),
})

export type Supplier = z.infer<typeof supplierSchema>
