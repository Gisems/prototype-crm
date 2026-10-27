import type { Dashboard } from "core/models/dashboard"
import { formatMoney } from "shared/utils/currency"
import { initials } from "shared/utils/string"

interface SellersRankingProps {
  sellers: Dashboard["sellers"]
}

export function SellersRanking({ sellers }: Readonly<SellersRankingProps>) {
  const ranking = sellers.toSorted((a, b) => b.revenue - a.revenue)
  const max = Math.max(1, ...ranking.map((seller) => seller.revenue))

  return (
    <section className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm">
      <div>
        <h2 className="text-base font-bold">Ranking de vendedores</h2>
        <p className="text-xs text-muted-foreground">Solo cuentan los pedidos pagados y entregados.</p>
      </div>

      <ol className="flex flex-col divide-y">
        {ranking.map((seller, index) => (
          <li key={seller.id} className="flex items-center gap-3 py-3">
            <span className="w-5 text-center text-sm font-bold text-muted-foreground">{index + 1}</span>
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
            >
              {initials(seller.name)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-3 text-sm">
                <span className="truncate font-semibold">{seller.name}</span>
                <span className="shrink-0 font-semibold">{formatMoney(seller.revenue, "UYU")}</span>
              </div>
              <div aria-hidden="true" className="my-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-accent" style={{ width: `${(seller.revenue / max) * 100}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{seller.orders} pedidos cerrados</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
