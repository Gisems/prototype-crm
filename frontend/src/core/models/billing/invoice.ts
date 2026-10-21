import type { Invoice } from "./response"

/** La factura pagada más reciente, o `undefined` si todavía no hay ninguna. */
export function lastPaidInvoice(invoices: Invoice[]) {
  return invoices.filter((invoice) => invoice.status === "paid").toSorted((a, b) => b.date.localeCompare(a.date))[0]
}
