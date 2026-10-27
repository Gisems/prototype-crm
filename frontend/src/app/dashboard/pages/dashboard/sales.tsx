import { useQueryState } from "nuqs"

import { useDashboard } from "core/hooks/query/use-query-dashboard"
import { averageTicket, changePercent, topSeller } from "core/models/dashboard"
import { formatMoney } from "shared/utils/currency"

import { ChannelSales } from "../../sections/dashboard/channel-sales"
import { DashboardSkeleton } from "../../sections/dashboard/dashboard-skeleton"
import { dashboardPeriodParser, PREVIOUS_PERIOD_LABELS } from "../../sections/dashboard/dashboard-view"
import { KpiCard } from "../../sections/dashboard/kpi-card"
import { OrdersByStatus } from "../../sections/dashboard/orders-by-status"
import { PeriodFilter } from "../../sections/dashboard/period-filter"
import { RevenueChart } from "../../sections/dashboard/revenue-chart"
import { SellersRanking } from "../../sections/dashboard/sellers-ranking"

export default function SalesTab() {
  const [period, setPeriod] = useQueryState("period", dashboardPeriodParser)
  const { data, isPending, isError } = useDashboard(period)

  const leader = data && topSeller(data.sellers)
  const previousLabel = PREVIOUS_PERIOD_LABELS[period]

  return (
    <div className="flex flex-col gap-5">
      <PeriodFilter period={period} onChange={(next) => void setPeriod(next)} />

      {isPending && <DashboardSkeleton />}
      {isError && <p className="text-sm text-destructive">No pudimos cargar las métricas. Intenta de nuevo.</p>}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Ventas cerradas"
              value={formatMoney(data.sales.revenue, "UYU")}
              change={changePercent(data.sales.revenue, data.sales.previousRevenue)}
              changeLabel={previousLabel}
            />
            <KpiCard
              label="Pedidos cerrados"
              value={String(data.sales.orders)}
              change={changePercent(data.sales.orders, data.sales.previousOrders)}
              changeLabel={previousLabel}
            />
            <KpiCard label="Ticket promedio" value={formatMoney(averageTicket(data.sales), "UYU")} />
            <KpiCard
              label="Vendedor líder"
              value={leader?.name ?? "—"}
              hint={leader && formatMoney(leader.revenue, "UYU")}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <RevenueChart series={data.revenueSeries} />
            <OrdersByStatus orders={data.ordersByStatus} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <SellersRanking sellers={data.sellers} />
            <ChannelSales channels={data.channels} />
          </div>
        </>
      )}
    </div>
  )
}
