import type { SupplierFormValues } from "./form"

export interface SaveSupplierDto {
  name: string
  ruc: string
  contactName: string
  phone: string
  email: string
  category: string
  notes: string
}

export function toSaveSupplierDto({ contactName, phone, notes, ...values }: SupplierFormValues): SaveSupplierDto {
  return { ...values, contactName: contactName ?? "", phone: phone ?? "", notes: notes ?? "" }
}
