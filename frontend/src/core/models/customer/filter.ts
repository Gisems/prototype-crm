import { normalizeText } from "shared/utils/string"

import type { Customer, CustomerChannel, CustomerStage } from "./response"

export interface CustomerFilters {
  /** Busca en el nombre y en el teléfono. */
  query: string
  stage: CustomerStage | "all"
  channel: CustomerChannel | "all"
  /** Una etiqueta exacta, o `""` para no filtrar. */
  tag: string
}

export function filterCustomers(customers: Customer[], { query, stage, channel, tag }: CustomerFilters) {
  const needle = normalizeText(query.trim())

  return customers.filter(
    (customer) =>
      (stage === "all" || customer.stage === stage) &&
      (channel === "all" || customer.channel === channel) &&
      (!tag || customer.tags.includes(tag)) &&
      (!needle ||
        normalizeText(customer.name).includes(needle) ||
        customer.phone.replaceAll(" ", "").includes(needle.replaceAll(" ", ""))),
  )
}

/** Las etiquetas que existen entre los clientes, sin repetir y en orden alfabético: son las opciones del filtro. */
export function allTags(customers: Customer[]) {
  return [...new Set(customers.flatMap((customer) => customer.tags))].toSorted((a, b) => a.localeCompare(b, "es"))
}
