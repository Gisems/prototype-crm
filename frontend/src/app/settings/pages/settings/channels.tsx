import { useState } from "react"
import { toast } from "sonner"

import { getHttpErrorMessage } from "core/hooks/error-message"
import { useUpdateChannel } from "core/hooks/mutation/use-mutation-channel"
import { useChannels, useFlows } from "core/hooks/query/use-query-channel"
import type { Channel, UpdateChannelDto } from "core/models/channel"
import { ConfirmDialog } from "shared/components/custom/confirm-dialog"
import { Skeleton } from "shared/components/ui/skeleton"

import { ChannelCard } from "../../sections/settings/channels/channel-card"

export default function ChannelsTab() {
  const [channelToDisconnect, setChannelToDisconnect] = useState<Channel | null>(null)
  const { data: channels, isPending, isError } = useChannels()
  const { data: flows } = useFlows()
  const { mutateAsync: updateChannel, isPending: isUpdating, variables } = useUpdateChannel()

  // Un flujo en borrador no está listo para atender mensajes: solo se ofrecen los publicados.
  const publishedFlows = flows?.filter((flow) => flow.status === "published") ?? []

  async function handleChange(channel: Channel, change: UpdateChannelDto, message: string) {
    try {
      await updateChannel({ id: channel.id, change })
      toast.success(message)

      return true
    } catch (error) {
      toast.error(getHttpErrorMessage(error))

      return false
    }
  }

  async function handleDisconnect() {
    if (!channelToDisconnect) return

    if (await handleChange(channelToDisconnect, { connected: false }, `${channelToDisconnect.name} desconectado`)) {
      setChannelToDisconnect(null)
    }
  }

  if (isPending) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    )
  }

  if (isError) return <p className="text-sm text-destructive">No pudimos cargar los canales. Intenta de nuevo.</p>

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-bold">Canales conectados</h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {channels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            flows={publishedFlows}
            isUpdating={isUpdating && variables?.id === channel.id}
            onToggleBot={(enabled) =>
              void handleChange(
                channel,
                { botEnabled: enabled },
                `Bot de ${channel.name} ${enabled ? "activado" : "desactivado"}`,
              )
            }
            onAssignFlow={(flowId) =>
              void handleChange(
                channel,
                { flowId },
                `Flujo de ${channel.name}: ${publishedFlows.find((flow) => flow.id === flowId)?.name ?? "ninguno"}`,
              )
            }
            onToggleConnection={() =>
              channel.connected
                ? setChannelToDisconnect(channel)
                : void handleChange(channel, { connected: true }, `${channel.name} conectado`)
            }
          />
        ))}
      </div>

      <ConfirmDialog
        open={channelToDisconnect !== null}
        onOpenChange={(open) => !open && setChannelToDisconnect(null)}
        title="Desconectar canal"
        description={`¿Desconectar ${channelToDisconnect?.name ?? ""}? Se apaga su bot y se suelta el flujo asignado. Podrás volver a conectarlo cuando quieras.`}
        confirmLabel="Desconectar"
        destructive
        isPending={isUpdating}
        onConfirm={() => void handleDisconnect()}
      />
    </div>
  )
}
