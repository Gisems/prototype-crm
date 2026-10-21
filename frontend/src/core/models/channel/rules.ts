import type { UpdateChannelDto } from "./dto"
import type { Channel } from "./response"

/**
 * Aplica un cambio a un canal respetando sus dependencias: el bot solo corre en un canal conectado y el flujo
 * solo se asigna con el bot activo. Desconectar apaga el bot y apagar el bot suelta el flujo.
 */
export function applyChannelChange(channel: Channel, change: UpdateChannelDto): Channel {
  const connected = change.connected ?? channel.connected
  const botEnabled = connected && (change.botEnabled ?? channel.botEnabled)
  const flowId = botEnabled ? (change.flowId === undefined ? channel.flowId : change.flowId) : null

  return { ...channel, connected, botEnabled, flowId }
}
