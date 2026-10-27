import { useQueryState } from "nuqs"

import { useDashboard } from "core/hooks/query/use-query-dashboard"
import { totalMessages } from "core/models/dashboard"
import { formatNumber } from "shared/utils/number"

import { AgentsTable } from "../../sections/dashboard/agents-table"
import { BotHumanSplit } from "../../sections/dashboard/bot-human-split"
import { ChannelMessages } from "../../sections/dashboard/channel-messages"
import { DashboardSkeleton } from "../../sections/dashboard/dashboard-skeleton"
import { dashboardPeriodParser } from "../../sections/dashboard/dashboard-view"
import { KpiCard } from "../../sections/dashboard/kpi-card"
import { PeriodFilter } from "../../sections/dashboard/period-filter"

export default function ConversationsTab() {
  const [period, setPeriod] = useQueryState("period", dashboardPeriodParser)
  const { data, isPending, isError } = useDashboard(period)

  const conversations = data?.channels.reduce((sum, channel) => sum + channel.conversations, 0) ?? 0
  const messages = data?.channels.reduce((sum, channel) => sum + totalMessages(channel), 0) ?? 0
  const botMessages = data?.channels.reduce((sum, channel) => sum + channel.botMessages, 0) ?? 0
  const chatsHandled = data?.agents.reduce((sum, agent) => sum + agent.chats, 0) ?? 0

  return (
    <div className="flex flex-col gap-5">
      <PeriodFilter period={period} onChange={(next) => void setPeriod(next)} />

      {isPending && <DashboardSkeleton />}
      {isError && <p className="text-sm text-destructive">No pudimos cargar las métricas. Intenta de nuevo.</p>}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Conversaciones" value={formatNumber(conversations)} />
            <KpiCard label="Mensajes" value={formatNumber(messages)} />
            <KpiCard
              label="Mensajes del bot"
              value={`${messages === 0 ? 0 : Math.round((botMessages / messages) * 100)}%`}
              hint="del total de mensajes"
            />
            <KpiCard label="Chats atendidos" value={formatNumber(chatsHandled)} hint="por tu equipo" />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <ChannelMessages channels={data.channels} />
            <BotHumanSplit channels={data.channels} />
          </div>

          <AgentsTable agents={data.agents} />
        </>
      )}
    </div>
  )
}
