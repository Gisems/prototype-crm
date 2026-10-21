import { z } from "zod"

import { optionalString, requiredString } from "shared/utils/schema"

import type { Supplier } from "./response"

export const supplierFormSchema = z.object({
  name: requiredString(100),
  // El RUC uruguayo tiene 12 dígitos. Es opcional: un proveedor informal puede no tenerlo.
  ruc: z
    .string()
    .trim()
    .pipe(z.union([z.literal(""), z.string().regex(/^\d{12}$/, "El RUC tiene 12 dígitos")])),
  contactName: optionalString(100),
  phone: optionalString(30),
  // Vacío vale: no todo proveedor tiene email. Si se escribe algo, tiene que ser un correo.
  email: z
    .string()
    .trim()
    .pipe(z.union([z.literal(""), z.email({ error: "Correo inválido" })]))
    .transform((email) => email.toLowerCase()),
  category: requiredString(60),
  notes: optionalString(500),
})

export type SupplierFormInput = z.input<typeof supplierFormSchema>
export type SupplierFormValues = z.output<typeof supplierFormSchema>

export const emptySupplierFormInput: SupplierFormInput = {
  name: "",
  ruc: "",
  contactName: "",
  phone: "",
  email: "",
  category: "",
  notes: "",
}

export function toSupplierFormInput(supplier: Supplier): SupplierFormInput {
  return { ...supplier }
}
