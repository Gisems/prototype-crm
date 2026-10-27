import type { Dashboard } from "core/models/dashboard"

import { STATUS_CLASSES, STATUS_LABELS } from "./dashboard-visuals"

interface OrdersByStatusProps {
  orders: Dashboard["ordersByStatus"]
}

export function OrdersByStatus({ orders }: Readonly<OrdersByStatusProps>) {
  const total = orders.reduce((sum, { count }) => sum + count, 0)

  return (
    <section className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-bold">Pedidos por estado</h2>
        <span className="text-sm text-muted-foreground">{total} en total</span>
      </div>

      <ul className="flex flex-col gap-3">
        {orders.map(({ status, count }) => (
          <li key={status}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span>{STATUS_LABELS[status]}</span>
              <span className="text-muted-foreground">{count}</span>
            </div>
            {/* Decorativa: la cantidad ya está escrita en el texto de arriba. */}
            <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${STATUS_CLASSES[status]}`}
                style={{ width: `${total === 0 ? 0 : (count / total) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
