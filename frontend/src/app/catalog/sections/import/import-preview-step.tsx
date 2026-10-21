import { type ImportRow, summarizeImport } from "core/models/product"
import { Button } from "shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/components/ui/table"
import { formatMoney } from "shared/utils/currency"

interface ImportPreviewStepProps {
  rows: ImportRow[]
  isImporting: boolean
  onBack: () => void
  onConfirm: () => void
}

function RowStatus({ row }: Readonly<{ row: ImportRow }>) {
  if (row.action === "error") return <span className="text-destructive">{row.error}</span>
  if (row.action === "update") return <span className="font-medium text-primary-light">Se actualiza</span>

  return <span className="font-medium text-success">Nuevo</span>
}

export function ImportPreviewStep({ rows, isImporting, onBack, onConfirm }: Readonly<ImportPreviewStepProps>) {
  const { toCreate, toUpdate, errors } = summarizeImport(rows)
  const canImport = toCreate + toUpdate > 0

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Se van a <strong className="text-foreground">crear {toCreate}</strong> y{" "}
        <strong className="text-foreground">actualizar {toUpdate}</strong> ítems.
        {errors > 0 && ` ${errors} ${errors === 1 ? "fila con error se va" : "filas con error se van"} a omitir.`}
      </p>

      <div className="max-h-72 overflow-y-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fila</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.line}>
                <TableCell>{row.line}</TableCell>
                <TableCell className="font-mono text-xs">{row.sku || "—"}</TableCell>
                <TableCell>{row.name || "—"}</TableCell>
                <TableCell className="text-right">
                  {row.dto ? formatMoney(row.dto.price, row.dto.currency) : "—"}
                </TableCell>
                <TableCell className="text-right">{row.dto?.stock ?? "—"}</TableCell>
                <TableCell>
                  <RowStatus row={row} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between gap-2">
        <Button type="button" variant="outline" size="action" disabled={isImporting} onClick={onBack}>
          Volver a los campos
        </Button>
        <Button
          type="button"
          disabled={!canImport || isImporting}

          onClick={onConfirm}
          variant="accent"
        >
          {isImporting ? "Importando…" : "Confirmar importación"}
        </Button>
      </div>
    </div>
  )
}
