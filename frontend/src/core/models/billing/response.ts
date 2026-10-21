import { z } from "zod"

export const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  currency: z.string(),
  seatsIncluded: z.number().int(),
  messagesIncluded: z.number().int(),
  features: z.array(z.string()),
  /** El plan que se destaca en la comparación. */
  popular: z.boolean(),
})

export type Plan = z.infer<typeof planSchema>

export const subscriptionSchema = z.object({
  planId: z.string(),
  /** `date` sin hora: `YYYY-MM-DD`. */
  renewalDate: z.iso.date(),
  /** Mensajes enviados en el mes en curso. Los miembros del equipo salen de `core/models/team`. */
  messagesUsed: z.number().int(),
})

export type Subscription = z.infer<typeof subscriptionSchema>

/** Mensajes enviados en un mes, frente a lo que incluía el plan en ese momento. */
export const usageMonthSchema = z.object({
  /** `YYYY-MM`. */
  month: z.string().regex(/^\d{4}-\d{2}$/),
  messagesSent: z.number().int(),
  messagesIncluded: z.number().int(),
})

export type UsageMonth = z.infer<typeof usageMonthSchema>

export const cardBrandSchema = z.enum(["Visa", "Mastercard", "Amex", "Otra"])

export type CardBrand = z.infer<typeof cardBrandSchema>

/** Lo único de la tarjeta que vuelve al front: nunca el número completo ni el CVV. */
export const paymentMethodSchema = z.object({
  brand: cardBrandSchema,
  last4: z.string().length(4),
  /** `MM/AA`. */
  expiry: z.string(),
})

export type PaymentMethod = z.infer<typeof paymentMethodSchema>

export const invoiceStatusSchema = z.enum(["paid", "pending"])

export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>

export const invoiceSchema = z.object({
  id: z.string(),
  date: z.iso.date(),
  concept: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: invoiceStatusSchema,
})

export type Invoice = z.infer<typeof invoiceSchema>
