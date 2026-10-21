import { normalizeText } from "shared/utils/string"

import type { Supplier } from "./response"

/** Busca en la empresa, el RUC, la persona de contacto, el rubro y el email. */
export function filterSuppliers(suppliers: Supplier[], query: string) {
  const needle = normalizeText(query.trim())

  if (!needle) return suppliers

  return suppliers.filter((supplier) =>
    [supplier.name, supplier.ruc, supplier.contactName, supplier.category, supplier.email].some((field) =>
      normalizeText(field).includes(needle),
    ),
  )
}
