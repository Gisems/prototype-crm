import {
  detectCardBrand,
  type PaymentMethod,
  paymentMethodSchema,
  type SavePaymentMethodDto,
} from "core/models/billing"

/**
 * MOCK: el método de pago vive en memoria. Solo se conserva lo que el backend devolvería (marca, últimos 4
 * y vencimiento): el número completo y el CVV se descartan acá, como pasaría con un procesador de pagos.
 */
let mockPaymentMethod: PaymentMethod | null = { brand: "Visa", last4: "4242", expiry: "08/28" }

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createPaymentMethodService() {
  return {
    /** `null` si todavía no hay tarjeta cargada. */
    async get(): Promise<PaymentMethod | null> {
      await delay(300)

      return mockPaymentMethod && paymentMethodSchema.parse(mockPaymentMethod)
    },

    async save({ number, expiry }: SavePaymentMethodDto): Promise<PaymentMethod> {
      await delay(600)

      mockPaymentMethod = paymentMethodSchema.parse({ brand: detectCardBrand(number), last4: number.slice(-4), expiry })

      return mockPaymentMethod
    },
  }
}
