import { HttpFailure } from "core/lib/client/failure"
import { applyChannelChange, type Channel, channelSchema, type UpdateChannelDto } from "core/models/channel"

/**
 * MOCK: los canales del prototipo (`docs/prototype`), en memoria: los cambios se pierden al recargar. Conectar
 * un canal es hoy un interruptor; con backend real pasa por el flujo de autorización de Meta (OAuth) y la
 * cuenta vinculada llega en `detail`. Cada método pasa a `crmClient` con su `decode`.
 */
let mockChannels: Channel[] = [
  {
    id: "wa",
    name: "WhatsApp Business API",
    detail: "+598 99 123 456 · vía 360dialog",
    connected: true,
    botEnabled: true,
    flowId: "flow1",
  },
  { id: "ig", name: "Instagram Direct", detail: "@chatg2i.uy", connected: true, botEnabled: false, flowId: null },
  {
    id: "fb",
    name: "Facebook Messenger",
    detail: "Conecta tu página de Facebook",
    connected: false,
    botEnabled: false,
    flowId: null,
  },
]

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createChannelService() {
  return {
    async list(): Promise<Channel[]> {
      await delay(300)

      return mockChannels.map((channel) => channelSchema.parse(channel))
    },

    async update(id: string, change: UpdateChannelDto): Promise<Channel> {
      await delay(400)

      const channel = mockChannels.find((item) => item.id === id)

      if (!channel) throw new HttpFailure("Channel not found", { kind: "http", status: 404 })

      const updated = applyChannelChange(channel, change)
      mockChannels = mockChannels.map((item) => (item.id === id ? updated : item))

      return updated
    },
  }
}
