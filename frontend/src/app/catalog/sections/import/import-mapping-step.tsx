import {
  IMPORT_FIELDS,
  type ImportField,
  type ImportMapping,
  type ImportTable,
  missingRequiredFields,
} from "core/models/product"
import { Button } from "shared/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select"

/** Valor del selector para "este campo no se importa". */
const NONE = "none"

const SAMPLE_COUNT = 2

interface ImportMappingStepProps {
  table: ImportTable
  mapping: ImportMapping
  onMappingChange: (field: ImportField, column: number | null) => void
  onBack: () => void
  onContinue: () => void
}

export function ImportMappingStep({
  table,
  mapping,
  onMappingChange,
  onBack,
  onContinue,
}: Readonly<ImportMappingStepProps>) {
  const missing = missingRequiredFields(mapping)

  // Las columnas se identifican por su posición: dos pueden llamarse igual, o una puede no tener nombre.
  const columns = table.headers.map((header, index) => ({
    value: String(index),
    label: header || `Columna ${index + 1}`,
  }))
  const columnItems: Record<string, string> = {
    [NONE]: "No importar",
    ...Object.fromEntries(columns.map(({ value, label }) => [value, label])),
  }

  function samples(column: number | null) {
    if (column === null) return "—"

    const values = table.rows
      .map((row) => (row[column] ?? "").trim())
      .filter(Boolean)
      .slice(0, SAMPLE_COUNT)

    return values.length > 0 ? values.join(" · ") : "—"
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Detectamos <strong className="text-foreground">{table.rows.length}</strong>{" "}
        {table.rows.length === 1 ? "fila" : "filas"} y{" "}
        <strong className="text-foreground">{table.headers.length}</strong> columnas. Indica qué columna de tu archivo
        corresponde a cada campo del catálogo.
      </p>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="hidden grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] gap-4 border-b bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground uppercase md:grid">
          <span>Campo del catálogo</span>
          <span>Columna de tu archivo</span>
          <span>Ejemplo</span>
        </div>

        {IMPORT_FIELDS.map(({ field, label, required }) => (
          <div
            key={field}
            className="grid items-center gap-2 border-b px-4 py-3 last:border-b-0 md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] md:gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{label}</span>
              {required && <span className="text-xs text-destructive">Obligatorio</span>}
            </div>

            <Select
              value={mapping[field] === null ? NONE : String(mapping[field])}
              items={columnItems}
              onValueChange={(next) => onMappingChange(field, next === NONE ? null : Number(next))}
            >
              <SelectTrigger className="w-full" aria-label={`Columna para ${label}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>No importar</SelectItem>
                {columns.map((column) => (
                  <SelectItem key={column.value} value={column.value}>
                    {column.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p className="truncate text-sm text-muted-foreground">{samples(mapping[field])}</p>
          </div>
        ))}
      </div>

      {missing.length > 0 && (
        <p className="text-sm text-destructive">Falta asignar: {missing.map(({ label }) => label).join(", ")}.</p>
      )}

      <div className="flex justify-between gap-2">
        <Button type="button" variant="outline" size="action" onClick={onBack}>
          Elegir otro archivo
        </Button>
        <Button
          type="button"
          disabled={missing.length > 0}

          onClick={onContinue}
          variant="accent"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
