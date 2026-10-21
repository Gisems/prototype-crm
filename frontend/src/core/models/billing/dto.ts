import type { CardFormValues } from "./form"

/**
 * Hoy el mock solo se queda con la marca, los últimos 4 y el vencimiento. Con backend real el número y el
 * CVV no deben pasar por él: los tokeniza el procesador de pagos en el navegador y acá viajaría el token.
 */
export interface SavePaymentMethodDto {
  number: string
  expiry: string
  cvv: string
}

export function toSavePaymentMethodDto({ number, expiry, cvv }: CardFormValues): SavePaymentMethodDto {
  return { number, expiry, cvv }
}
