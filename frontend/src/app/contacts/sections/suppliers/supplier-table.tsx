import type { Supplier } from "core/models/supplier"
import { Button } from "shared/components/ui/button"
import { Skeleton } from "shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/components/ui/table"

interface SupplierTableProps {
  /** Los de la página actual, ya filtrados. */
  suppliers: Supplier[] | undefined
  isPending: boolean
  isError: boolean
  /** Hay una búsqueda: una lista vacía significa "sin coincidencias", no "no hay proveedores". */
  hasFilters: boolean
  onEdit: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
}

export function SupplierTable({
  suppliers,
  isPending,
  isError,
  hasFilters,
  onEdit,
  onDelete,
}: Readonly<SupplierTableProps>) {
  if (isPending) return <Skeleton className="h-64 rounded-lg" />

  if (isError) return <p className="text-sm text-destructive">No pudimos cargar los proveedores. Intenta de nuevo.</p>

  if (!suppliers?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        {hasFilters ? "No hay proveedores que coincidan con la búsqueda." : "Todavía no agregaste proveedores."}
      </p>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>RUC</TableHead>
            <TableHead>Rubro</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell>
                <p className="font-semibold">{supplier.name}</p>
                {supplier.notes && (
                  <p className="line-clamp-1 max-w-xs text-xs text-muted-foreground">{supplier.notes}</p>
                )}
              </TableCell>
              <TableCell className="font-mono text-xs whitespace-nowrap">{supplier.ruc || "—"}</TableCell>
              <TableCell>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                  {supplier.category}
                </span>
              </TableCell>
              <TableCell>{supplier.contactName || "—"}</TableCell>
              <TableCell className="whitespace-nowrap">{supplier.phone || "—"}</TableCell>
              <TableCell>
                {supplier.email ? (
                  <a href={`mailto:${supplier.email}`} className="text-primary hover:underline">
                    {supplier.email}
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(supplier)}>
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(supplier)}
                >
                  Quitar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
