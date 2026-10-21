import { FileText } from "lucide-react"

import { type Invoice, type InvoiceStatus, lastPaidInvoice } from "core/models/billing"
import { PageNav } from "shared/components/custom/page-nav"
import { Button } from "shared/components/ui/button"
import { Skeleton } from "shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/components/ui/table"
import { formatMoney } from "shared/utils/currency"
import { formatDate } from "shared/utils/date"
import { paginate } from "shared/utils/pagination"

/** Cuántas facturas entran en una página: al llegar a la undécima, el historial pasa a la siguiente. */
const INVOICES_PER_PAGE = 10

const STATUS: Record<InvoiceStatus, { label: string; className: string }> = {
  paid: { label: "Pagada", className: "bg-success/15 text-success" },
  pending: { label: "Pendiente", className: "bg-secondary text-secondary-foreground" },
}

interface NextCharge {
  date: string
  amount: number
  currency: string
}

interface InvoiceHistoryProps {
  invoices: Invoice[] | undefined
  isPending: boolean
  /** El próximo cobro sale de la suscripción: renovación y precio del plan. */
  nextCharge: NextCharge | undefined
  page: number
  onPageChange: (page: number) => void
}

function Stat({ label, value, detail }: Readonly<{ label: string; value: string; detail?: string }>) {
  return (
    <div className="rounded-xl bg-muted px-4 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-lg font-bold">{value}</dd>
      {detail && <dd className="text-xs text-muted-foreground">{detail}</dd>}
    </div>
  )
}

/** El historial de pagos, con el protagonismo de la vista: resumen arriba y la lista completa que se desplaza por dentro. */
export function InvoiceHistory({ invoices, isPending, nextCharge, page, onPageChange }: Readonly<InvoiceHistoryProps>) {
  const lastPaid = lastPaidInvoice(invoices ?? [])
  const pagination = paginate(invoices ?? [], page, INVOICES_PER_PAGE)

  return (
    <section className="flex min-h-0 flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-bold">Historial de pagos</h2>
        {invoices && <span className="text-sm text-muted-foreground">{invoices.length} facturas</span>}
      </div>

      {isPending && <Skeleton className="h-full min-h-40 rounded-lg" />}

      {!isPending && !invoices?.length && <p className="text-sm text-muted-foreground">Sin facturas todavía.</p>}

      {invoices && invoices.length > 0 && (
        <>
          <dl className="grid gap-3 sm:grid-cols-2">
            <Stat
              label="Próximo cobro"
              value={nextCharge ? formatMoney(nextCharge.amount, nextCharge.currency) : "—"}
              detail={nextCharge && formatDate(nextCharge.date)}
            />
            <Stat
              label="Último pago"
              value={lastPaid ? formatMoney(lastPaid.amount, lastPaid.currency) : "—"}
              detail={lastPaid && formatDate(lastPaid.date)}
            />
          </dl>

          <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Factura</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.items.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell>{invoice.concept}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatMoney(invoice.amount, invoice.currency)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS[invoice.status].className}`}
                      >
                        {STATUS[invoice.status].label}
                      </span>
                    </TableCell>
                    {/* La descarga de la factura emitida por la empresa todavía no existe: el botón queda listo para enlazarla. */}
                    <TableCell className="text-right">
                      <Button type="button" variant="outline" size="sm">
                        <FileText /> Ver factura
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {pagination.pageCount > 1 && (
            <nav aria-label="Paginación del historial de pagos" className="flex justify-center">
              <PageNav page={pagination.page} pageCount={pagination.pageCount} onPageChange={onPageChange} />
            </nav>
          )}
        </>
      )}
    </section>
  )
}
