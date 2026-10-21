import type { CustomerFormValues } from "./form"
import type { CustomerChannel, CustomerStage } from "./response"

export interface SaveCustomerDto {
  name: string
  channel: CustomerChannel
  phone: string
  whatsappId: string
  tags: string[]
  stage: CustomerStage
  value: number
  assignedTo: number | null
}

export function toSaveCustomerDto({ whatsappId, ...values }: CustomerFormValues): SaveCustomerDto {
  return { ...values, whatsappId: whatsappId ?? "" }
}
