import { parseCsv } from "shared/utils/csv"
import { parseLocalizedNumber } from "shared/utils/number"

import type { CreateProductDto } from "./dto"
import { productFormSchema } from "./form"
import type { BillingUnit, ItemType, ServiceModality } from "./response"

/** El archivo tal como vino: la primera fila son los encabezados y el resto, los datos. */
export interface ImportTable {
  headers: string[]
  rows: string[][]
}

export type ImportRowAction = "create" | "update" | "error"

export interface ImportRow {
  /** Número de línea en el archivo (la primera fila de datos es la 2, tras el encabezado). */
  line: number
  sku: string
  name: string
  action: ImportRowAction
  error?: string
  /** Lo que se envía; solo existe si la fila no tiene error. */
  dto?: CreateProductDto
}

// Los campos del catálogo a los que se puede asignar una columna del archivo, en el orden en que se muestran.
export const IMPORT_FIELDS = [
  { field: "sku", label: "SKU", required: true },
  { field: "name", label: "Nombre", required: true },
  { field: "price", label: "Precio", required: true },
  { field: "type", label: "Tipo (producto o servicio)", required: false },
  { field: "currency", label: "Moneda", required: false },
  { field: "description", label: "Descripción", required: false },
  { field: "color", label: "Color", required: false },
  { field: "size", label: "Talle", required: false },
  { field: "stock", label: "Stock", required: false },
  { field: "durationMinutes", label: "Duración (minutos)", required: false },
  { field: "modality", label: "Modalidad", required: false },
  { field: "billingUnit", label: "Unidad de cobro", required: false },
  { field: "image", label: "Imagen (URL)", required: false },
] as const

export type ImportField = (typeof IMPORT_FIELDS)[number]["field"]

/** Para cada campo del catálogo, el índice de la columna del archivo que lo llena, o `null` si no se importa. */
export type ImportMapping = Record<ImportField, number | null>

// Nombres de columna que se reconocen solos, en minúscula y sin tildes, para que un archivo exportado
// de otra herramienta (en español o en inglés) llegue ya con los campos asignados.
const ALIASES: Record<ImportField, readonly string[]> = {
  sku: ["sku", "codigo"],
  name: ["nombre", "name", "producto"],
  description: ["descripcion", "description"],
  price: ["precio", "price"],
  currency: ["moneda", "currency"],
  color: ["color"],
  size: ["talle", "talla", "size"],
  stock: ["stock", "cantidad", "existencias"],
  image: ["imagen", "image", "foto", "url"],
  type: ["tipo", "type"],
  durationMinutes: ["duracion", "duracion min", "minutos", "duration"],
  modality: ["modalidad", "modality"],
  billingUnit: ["unidad de cobro", "unidad", "cobro", "billing unit"],
}

const FIELD_LABELS = Object.fromEntries(IMPORT_FIELDS.map(({ field, label }) => [field, label])) as Record<
  ImportField,
  string
>

function normalizeHeader(header: string) {
  return header
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/\p{Diacritic}/gu, "")
}

/** `null` si el archivo está vacío. Los datos que no traen ninguna fila igual se devuelven, con `rows` vacío. */
export function parseImportTable(text: string): ImportTable | null {
  const [headers, ...rows] = parseCsv(text)

  return headers ? { headers: headers.map((header) => header.trim()), rows } : null
}

/** Asigna cada campo a la primera columna cuyo encabezado lo nombra; una columna no se usa para dos campos. */
export function suggestMapping(headers: string[]): ImportMapping {
  const normalized = headers.map(normalizeHeader)
  const taken = new Set<number>()
  const mapping = {} as ImportMapping

  for (const { field } of IMPORT_FIELDS) {
    const index = normalized.findIndex((header, column) => !taken.has(column) && ALIASES[field].includes(header))

    mapping[field] = index === -1 ? null : index
    if (index !== -1) taken.add(index)
  }

  return mapping
}

/** Los campos obligatorios que todavía no tienen columna. */
export function missingRequiredFields(mapping: ImportMapping) {
  return IMPORT_FIELDS.filter(({ field, required }) => required && mapping[field] === null)
}

// Cómo puede escribirse cada opción en una planilla, en minúscula y sin tildes.
const TYPE_ALIASES: Record<ItemType, readonly string[]> = {
  product: ["producto", "product", "articulo"],
  service: ["servicio", "service"],
}
const MODALITY_ALIASES: Record<ServiceModality, readonly string[]> = {
  in_person: ["presencial", "en persona", "in person", "in_person", "local"],
  online: ["online", "virtual", "remoto"],
  at_home: ["a domicilio", "domicilio", "at home", "at_home"],
}
const BILLING_UNIT_ALIASES: Record<BillingUnit, readonly string[]> = {
  session: ["sesion", "session"],
  hour: ["hora", "hour"],
  service: ["servicio", "service", "completo", "unico"],
}

/** La opción que nombra `text`, `fallback` si la celda está vacía, o `undefined` si no es ninguna conocida. */
function parseOption<T extends string>(text: string, aliases: Record<T, readonly string[]>, fallback: T) {
  if (!text) return fallback

  const key = normalizeHeader(text)

  return (Object.keys(aliases) as T[]).find((option) => aliases[option].includes(key))
}

/** Un número exportado de una planilla puede venir como `1.150,50`: se normaliza antes de validarlo. */
function normalizeNumber(text: string) {
  const parsed = parseLocalizedNumber(text)

  return Number.isNaN(parsed) ? text : String(parsed)
}

/**
 * Dice, fila por fila, qué pasaría al importar con esa asignación de columnas: crear (SKU nuevo), actualizar
 * (el SKU ya existe) u omitir por error. Cada fila se valida con el mismo esquema del formulario.
 */
export function buildImportRows(
  { rows }: ImportTable,
  mapping: ImportMapping,
  /** Los ítems que ya están en el catálogo: SKU y tipo. */
  existing: ReadonlyMap<string, ItemType>,
): ImportRow[] {
  const seenSkus = new Set<string>()

  return rows.map((cells, index): ImportRow => {
    const cell = (field: ImportField) => {
      const column = mapping[field]

      return column === null ? "" : (cells[column] ?? "").trim()
    }
    const base = { line: index + 2, sku: cell("sku").toUpperCase(), name: cell("name") }

    const type = parseOption(cell("type"), TYPE_ALIASES, "product")
    const modality = parseOption(cell("modality"), MODALITY_ALIASES, "in_person")
    const billingUnit = parseOption(cell("billingUnit"), BILLING_UNIT_ALIASES, "service")

    // Estas tres son listas cerradas: una palabra que no se reconoce se avisa en español, no con el mensaje del esquema.
    if (!type) return { ...base, action: "error", error: "Tipo: usa «producto» o «servicio»" }
    if (!modality) return { ...base, action: "error", error: "Modalidad: usa «presencial», «online» o «a domicilio»" }
    if (!billingUnit) return { ...base, action: "error", error: "Unidad de cobro: usa «sesión», «hora» o «servicio»" }

    const parsed = productFormSchema.safeParse({
      type,
      sku: cell("sku"),
      name: cell("name"),
      description: cell("description"),
      price: normalizeNumber(cell("price")),
      currency: cell("currency").toUpperCase() || "UYU",
      image: cell("image"),
      color: cell("color"),
      size: cell("size"),
      stock: normalizeNumber(cell("stock") || "0"),
      durationMinutes: normalizeNumber(cell("durationMinutes")),
      modality,
      billingUnit,
    })

    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      const field = String(issue?.path[0]) as ImportField

      return { ...base, action: "error", error: `${FIELD_LABELS[field] ?? field}: ${issue?.message}` }
    }

    const values = parsed.data

    const existingType = existing.get(values.sku)

    // Un ítem no cambia de tipo: un producto no pasa a servicio con una importación.
    if (existingType && existingType !== values.type) {
      return {
        ...base,
        action: "error",
        error: `Ya existe como ${existingType === "product" ? "producto" : "servicio"}: no se puede cambiar el tipo`,
      }
    }

    if (seenSkus.has(values.sku)) return { ...base, action: "error", error: "SKU repetido en el archivo" }
    seenSkus.add(values.sku)

    return {
      ...base,
      sku: values.sku,
      action: existingType ? "update" : "create",
      dto: values,
    }
  })
}

export function summarizeImport(rows: ImportRow[]) {
  return {
    toCreate: rows.filter((row) => row.action === "create").length,
    toUpdate: rows.filter((row) => row.action === "update").length,
    errors: rows.filter((row) => row.action === "error").length,
  }
}
