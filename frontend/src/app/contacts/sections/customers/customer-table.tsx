import type { Customer } from "core/models/customer"
import type { TeamMember } from "core/models/team"
import { Button } from "shared/components/ui/button"
import { Skeleton } from "shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/components/ui/table"
import { formatMoney } from "shared/utils/currency"

import { CHANNEL_CLASSES, CHANNEL_LABELS, STAGE_CLASSES, STAGE_LABELS } from "./customer-visuals"

interface CustomerTableProps {
  /** Los de la página actual, ya filtrados. */
  customers: Customer[] | undefined
  members: TeamMember[] | undefined
  isPending: boolean
  isError: boolean
  /** Hay búsqueda o filtros: una lista vacía significa "sin coincidencias", no "no hay clientes". */
  hasFilters: boolean
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

export function CustomerTable({
  customers,
  members,
  isPending,
  isError,
  hasFilters,
  onEdit,
  onDelete,
}: Readonly<CustomerTableProps>) {
  if (isPending) return <Skeleton className="h-64 rounded-lg" />

  if (isError) return <p className="text-sm text-destructive">No pudimos cargar los clientes. Intenta de nuevo.</p>

  if (!customers?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        {hasFilters ? "No hay clientes que coincidan con la búsqueda." : "Todavía no agregaste clientes."}
      </p>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Canal</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Etiquetas</TableHead>
            <TableHead>Etapa</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CHANNEL_CLASSES[customer.channel]}`}>
                  {CHANNEL_LABELS[customer.channel]}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">{customer.phone}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {customer.tags.length === 0 && <span className="text-muted-foreground">—</span>}
                  {customer.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STAGE_CLASSES[customer.stage]}`}>
                  {STAGE_LABELS[customer.stage]}
                </span>
              </TableCell>
              <TableCell className="text-right font-semibold">{formatMoney(customer.value, "UYU")}</TableCell>
              <TableCell>{members?.find((member) => member.id === customer.assignedTo)?.name ?? "—"}</TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(customer)}>
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(customer)}
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
