import { type UsageMonth, usageMonthSchema } from "core/models/billing"

/**
 * MOCK: los últimos seis meses de mensajes enviados; el último es el mes en curso y coincide con
 * `messagesUsed` de la suscripción. Cuando exista el backend, `list` pasa a `crmClient.get("/billing/usage")`.
 */
const MOCK_USAGE: UsageMonth[] = [
  { month: "2026-05", messagesSent: 1210, messagesIncluded: 3000 },
  { month: "2026-06", messagesSent: 1534, messagesIncluded: 3000 },
  { month: "2026-07", messagesSent: 1688, messagesIncluded: 3000 },
  { month: "2026-08", messagesSent: 1925, messagesIncluded: 3000 },
  { month: "2026-09", messagesSent: 2310, messagesIncluded: 3000 },
  { month: "2026-10", messagesSent: 1842, messagesIncluded: 3000 },
]

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createUsageService() {
  return {
    /** De más antiguo a más reciente. */
    async list(): Promise<UsageMonth[]> {
      await delay(300)

      return MOCK_USAGE.map((month) => usageMonthSchema.parse(month))
    },
  }
}
