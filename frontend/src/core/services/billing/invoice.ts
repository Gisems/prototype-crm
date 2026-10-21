import { type Invoice, invoiceSchema } from "core/models/billing"

const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
]

/**
 * MOCK: facturas mensuales del plan Profesional. Cuando exista el backend, `list` pasa a
 * `crmClient.get("/billing/invoices", { decode })`.
 */
// Doce meses, de octubre de 2026 hacia atrás: más que una página, para que la paginación se vea en acción.
const MOCK_INVOICES: Invoice[] = Array.from({ length: 12 }, (_, offset) => {
  const date = new Date(2026, 9 - offset, 1)
  const month = String(date.getMonth() + 1).padStart(2, "0")

  return {
    id: `INV-${date.getFullYear()}-${month}`,
    date: `${date.getFullYear()}-${month}-01`,
    concept: `Plan Profesional — ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`,
    amount: 4990,
    currency: "UYU",
    status: "paid" as const,
  }
})

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createInvoiceService() {
  return {
    /** Las más recientes primero. */
    async list(): Promise<Invoice[]> {
      await delay(300)

      return MOCK_INVOICES.map((invoice) => invoiceSchema.parse(invoice))
    },
  }
}
