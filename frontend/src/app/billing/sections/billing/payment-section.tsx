import type { PaymentMethod } from "core/models/billing"
import { Button } from "shared/components/ui/button"
import { Skeleton } from "shared/components/ui/skeleton"

interface PaymentSectionProps {
  /** `null` si todavía no hay tarjeta cargada. */
  method: PaymentMethod | null | undefined
  isPending: boolean
  onEdit: () => void
}

export function PaymentSection({ method, isPending, onEdit }: Readonly<PaymentSectionProps>) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold">Método de pago</h2>
        {!isPending && (
          <Button type="button" variant="outline" size="sm" onClick={onEdit}>
            {method ? "Cambiar tarjeta" : "Agregar tarjeta"}
          </Button>
        )}
      </div>

      {isPending && <Skeleton className="h-10 rounded-lg" />}

      {!isPending && !method && (
        <p className="text-sm text-muted-foreground">Todavía no agregaste una tarjeta para tus cobros.</p>
      )}

      {method && (
        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Tarjeta</dt>
            <dd className="font-semibold">{method.brand === "Otra" ? "Tarjeta" : method.brand}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Número</dt>
            <dd className="font-mono font-semibold">•••• {method.last4}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Vence</dt>
            <dd className="font-mono font-semibold">{method.expiry}</dd>
          </div>
        </dl>
      )}
    </section>
  )
}
