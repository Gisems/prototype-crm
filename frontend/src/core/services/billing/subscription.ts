import { type Subscription, subscriptionSchema } from "core/models/billing"

/**
 * MOCK: la suscripción vive en memoria y el cambio de plan se pierde al recargar. El mock no valida que
 * `planId` exista; eso lo hará el backend, y la pantalla solo ofrece planes de la lista.
 */
let mockSubscription: Subscription = {
  planId: "pro",
  renewalDate: "2026-11-01",
  messagesUsed: 1842,
}

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createSubscriptionService() {
  return {
    async get(): Promise<Subscription> {
      await delay(300)

      return subscriptionSchema.parse(mockSubscription)
    },

    async changePlan(planId: string): Promise<Subscription> {
      await delay(600)

      mockSubscription = subscriptionSchema.parse({ ...mockSubscription, planId })

      return mockSubscription
    },
  }
}
