import { z } from "zod"

export const productCurrencySchema = z.enum(["UYU", "USD", "PEN"])

export type ProductCurrency = z.infer<typeof productCurrencySchema>

/** Un ítem del catálogo es un producto (se cuenta en stock) o un servicio (se presta). */
export const ITEM_TYPES = ["product", "service"] as const

export type ItemType = (typeof ITEM_TYPES)[number]

/** Dónde se presta un servicio. */
export const SERVICE_MODALITIES = ["in_person", "online", "at_home"] as const

export type ServiceModality = (typeof SERVICE_MODALITIES)[number]

/** Por qué se cobra el precio de un servicio: cada sesión, cada hora o el servicio completo. */
export const BILLING_UNITS = ["session", "hour", "service"] as const

export type BillingUnit = (typeof BILLING_UNITS)[number]

/**
 * Un ítem del catálogo. Se llama `Product` por historia: el catálogo nació solo con productos, y los
 * campos de cada tipo conviven en el mismo objeto. Los que no corresponden al tipo quedan vacíos
 * (`color`/`size` en `""`, el resto en `null`).
 */
export const productSchema = z.object({
  id: z.number().int(),
  type: z.enum(ITEM_TYPES),
  /** Código único del ítem; no se repite entre ítems. */
  sku: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  currency: productCurrencySchema,
  /** Solo productos. */
  color: z.string(),
  /** Talle tal como lo muestra el negocio ("M", "42", "Único"): no es numérico ni una lista cerrada. Solo productos. */
  size: z.string(),
  /** Solo productos: un servicio no se cuenta en stock. */
  stock: z.number().int().nullable(),
  /** Solo servicios: cuánto dura, en minutos; `null` si varía o no se sabe. */
  durationMinutes: z.number().int().nullable(),
  /** Solo servicios. */
  modality: z.enum(SERVICE_MODALITIES).nullable(),
  /** Solo servicios. */
  billingUnit: z.enum(BILLING_UNITS).nullable(),
  /** URL de la imagen; vacía si el ítem aún no tiene. */
  image: z.string(),
})

export type Product = z.infer<typeof productSchema>
