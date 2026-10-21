import { type Plan, planSchema } from "core/models/billing"

/**
 * MOCK: el backend aún no tiene módulo de facturación, así que esto devuelve los planes del prototipo
 * (`docs/prototype`). Cuando exista, `list` pasa a `crmClient.get("/billing/plans", { decode })`.
 */
const MOCK_PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 1990,
    currency: "UYU",
    seatsIncluded: 2,
    messagesIncluded: 800,
    features: ["1 canal conectado", "Bots básicos", "Soporte por email"],
    popular: false,
  },
  {
    id: "pro",
    name: "Profesional",
    price: 4990,
    currency: "UYU",
    seatsIncluded: 5,
    messagesIncluded: 3000,
    features: ["Canales ilimitados", "Bots y flujos avanzados", "Reportes exportables", "Soporte prioritario"],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: 9990,
    currency: "UYU",
    seatsIncluded: 15,
    messagesIncluded: 10_000,
    features: ["Todo lo de Profesional", "Permisos por rol", "Soporte telefónico dedicado"],
    popular: false,
  },
]

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createPlanService() {
  return {
    async list(): Promise<Plan[]> {
      await delay(300)

      return MOCK_PLANS.map((plan) => planSchema.parse(plan))
    },
  }
}
